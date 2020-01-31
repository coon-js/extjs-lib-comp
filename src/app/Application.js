/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * An implementation of {@link coon.core.app.Aplication} to be working with
 * Viewports of the type {@link coon.comp.container.Viewport}.
 *
 * @inheritdoc
 */
Ext.define('coon.comp.app.Application', {

    extend: 'coon.core.app.Application',

    requires: [
        'coon.core.data.schema.BaseSchema',
        'coon.core.app.PackageController',
        'coon.comp.container.Viewport'
    ],

    /**
     * @cfg {Object/String} [applicationSchemaConfig={type:'cn_core-baseschema', id : 'cn_core-baseschema', namespace : 'coon.core.data'}] (required)
     * The fqn of the class representing the schema to be used for {@link #applicationViewModel},
     * or the object configuration for creating the schema.
     * The representing classes should have been loaded before this class
     * gets instantiated, to prevent synchronous requests to this class.
     */
    applicationSchemaConfig : {
        type      : 'cn_core-baseschema',
        id        : 'cn_core-baseschema',
        namespace : 'coon.core.data'
    },

    /**
     * @cfg {String} [applicationViewModelClassName=Ext.app.ViewModel] (required)
     * The fqn of the class representing the viewModel which will be used with
     * the {@link #applicationView}.
     * The representing classes should have been loaded before this class
     * gets instantiated, to prevent synchronous requests to this class.
     */
    applicationViewModelClassName : 'Ext.app.ViewModel',

    /**
     * @type {Ext.app.ViewModel} applicationViewModel
     * The ViewModel of the {@link applicationView}.
     * see {@link #getApplicationViewModel}
     */
    applicationViewModel : null,

    /**
     * @type {Ext.data.Session} applicationSession
     * The application's session which is owned by {@link #applicationViewModel}
     * It's schema will default to {@link coon.core.data.schema.BaseSchema}
     */
    applicationSession : null,

    /**
     * @inheritdocs
     *
     * @throws Exception if any of the required class configs are not available,
     * or if either {@link #applicationViewModelClassName} or
     * {@link #mainView} were not loaded already.
     */
    constructor : function(config) {

        var me = this;

        config = config || {};

        me.applicationSchemaConfig = config.applicationSchemaConfig ||
                                     me.applicationSchemaConfig;

        me.applicationViewModelClassName = config.applicationViewModelClassName ||
                                           me.applicationViewModelClassName;

        if (!me.applicationViewModelClassName || !me.applicationSchemaConfig) {
            Ext.raise({
                sourceClass                   : 'coon.comp.app.Application',
                applicationViewModelClassName : me.applicationViewModelClassName,
                applicationSchemaConfig       : me.applicationSchemaConfig,
                msg                           : "coon.comp.app.Application requires both applicationSchemaConfig and applicationViewModelClassName to be defined."
            });
        }

        if (!Ext.ClassManager.get(me.applicationViewModelClassName) ||
            ((Ext.isString(me.applicationSchemaConfig) && !Ext.ClassManager.get(me.applicationSchemaConfig)) ||
             (Ext.isObject(me.applicationSchemaConfig) && !Ext.ClassManager.getNameByAlias('schema.' + me.applicationSchemaConfig.type))
            )) {
            Ext.raise({
                sourceClass               : 'coon.comp.app.Application',
                applicationViewModelClass : Ext.ClassManager.get(me.applicationViewModelClassName),
                applicationSchemaConfig   : Ext.isString(me.applicationSchemaConfig)
                                            ? Ext.ClassManager.get(me.applicationSchemaConfig)
                                            : Ext.ClassManager.getNameByAlias('schema.' + me.applicationSchemaConfig.type),
                msg                       : "coon.comp.app.Application requires both applicationSchemaConfig and applicationViewModelClass to be loaded."
            });
        }

        delete config.applicationSchemaConfig;
        delete config.applicationViewModelClassName;

        me.callParent([config]);
    },


    /**
     * Iterates over this applications controllers and checks if any controller
     * is of the type {@link coon.core.app.PackageController}. Its method
     * {@link coon.core.app.PackageController#postLaunchHook} will then be called,
     * if possible, and the returning items will be passed to its
     * {@link coon.comp.container.Viewport#addPostLaunchInfo} method.
     *
     */
    postLaunchHookProcess : function() {

        var me          = this,
            ctrl        = null,
            items       = [],
            controllers = me.controllers.getRange(),
            mainView    = me.getMainView(),
            info        = {},
            signaled    = false;

        for (var i = 0, len = controllers.length; i < len; i++) {

            ctrl = controllers[i];

            if ((ctrl instanceof coon.core.app.PackageController) &&
                Ext.isFunction(ctrl.postLaunchHook)) {
                info = ctrl.postLaunchHook();
                if (info !== undefined) {
                    mainView.addPostLaunchInfo(info);
                }
            }
        }

    },

    /**
     * Returns the session which is used by {@link #applicationViewModel}.
     * This session can be used to adopt data models which need to be globally
     * available during the runtime of the application.
     * See {@link #applicationSession}. The schema of this session will be set
     * to an instance of {@link #applicationSchemaClassName}
     *
     * @returns {Ext.data.Session}
     *
     * @throws if {@link #applicationSchemaClassName} does not represent
     * an instance of {@link Ext.data.schema.Schema}
     */
    getApplicationSession : function() {

        var me = this;

        if (!me.applicationSession) {

            var schema = Ext.isString(me.applicationSchemaConfig)
                        ? Ext.create(me.applicationSchemaConfig)
                        : Ext.Factory.schema(me.applicationSchemaConfig);

            if (!(schema instanceof Ext.data.schema.Schema)) {
                Ext.raise({
                    sourceClass : 'coon.comp.app.Application',
                    schema      : Ext.getClass(schema),
                    msg         : "coon.comp.app.Application requires schema to be an instance of Ext.data.schema.Schema."
                });
            }

            me.applicationSession = Ext.create('Ext.data.Session', {
                schema : schema
            });
        }

        return me.applicationSession;
    },

    /**
     * Returns the {@link #applicationViewModel} used by {@link #mainView}.
     * The desired class can be specified in {@link #applicationViewModelClassName}.
     * The view model is available before the {@link #mainView} is rendered, so
     * that associated controllers can already access it.
     *
     * @return {Ext.app.ViewModel}
     *
     * @throws if {@link #applicationViewModel} is not an instance of {@link Ext.app.ViewModel}
     */
    getApplicationViewModel : function() {

        var me = this;

        if (!me.applicationViewModel) {

            me.applicationViewModel = Ext.create(
                me.applicationViewModelClassName, {
                    session : this.getApplicationSession()
                }
            );

            if (!(me.applicationViewModel instanceof Ext.app.ViewModel)) {
                Ext.raise({
                    sourceClass          : 'coon.comp.app.Application',
                    applicationViewModel : Ext.getClass(me.applicationViewModel),
                    msg                  : "coon.comp.app.Application requires applicationViewModel to be an instance of Ext.app.ViewModel."
                });
            }

        }

        return this.applicationViewModel;
    },


    /**
     * Helper method to activate a view identified by the passed hash.
     * If the view is not available yet, it will be created and added to this
     * application's viewport, then activated to make sure it has the focus.
     * The view will be returned.
     * Any views that might block input (e.g. windows) will be removed if possible.
     *
     * Note:
     * =====
     * This is mainly for PackageControllers utilizing deeplinking that have to
     * set up their packages' MainView first in order to continue routing into
     * functionality of nested views.
     *
     * @param {String} hash A string representing a unique hash which is
     * associated with the view that should be looked up/created and added.
     *
     * @return {Ext.Component} The view associated with the hash, if any.
     *
     * @see {@link coon.comp.container.Viewport#activateViewForHash}
     */
    activateViewForHash : function(hash) {
        var me = this;
        return me.getMainView().activateViewForHash(hash, me.getDefaultToken());
    },


    /**
     * @inheritdoc
     */
    createApplicationView : function(view) {

        const appView = view.create({
            viewModel : this.getApplicationViewModel()
        });

        if (!(appView instanceof coon.comp.container.Viewport)) {
            Ext.raise({
                sourceClass : 'coon.comp.app.Application',
                mainView    : this.getMainView(),
                msg         : "coon.comp.app.Application's mainView must be an instance of coon.comp.container.Viewport."
            });
        }

        return appView;
    }

});