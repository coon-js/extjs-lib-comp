/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2017 Thorsten Suckow-Homberg/conjoon.org
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * An implementation of {@link conjoon.cn_core.app.Aplication} to be working with
 * Viewports of the type {@link conjoon.cn_comp.container.Viewport}.
 *
 * @inheritdoc
 */
Ext.define('conjoon.cn_comp.app.Application', {

    extend: 'conjoon.cn_core.app.Application',

    requires: [
        'conjoon.cn_core.data.schema.BaseSchema',
        'conjoon.cn_core.app.PackageController',
        'conjoon.cn_comp.container.Viewport'
    ],

    /**
     * @cfg {Object/String} [applicationSchemaConfig={type:'cn_core-baseschema', id : 'cn_core-baseschema', namespace : 'conjoon.cn_core.data'}] (required)
     * The fqn of the class representing the schema to be used for {@link #applicationViewModel},
     * or the object configuration for creating the schema.
     * The representing classes should have been loaded before this class
     * gets instantiated, to prevent synchronous requests to this class.
     */
    applicationSchemaConfig : {
        type      : 'cn_core-baseschema',
        id        : 'cn_core-baseschema',
        namespace : 'conjoon.cn_core.data'
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
     * It's schema will default to {@link conjoon.cn_core.data.schema.BaseSchema}
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
                sourceClass                   : 'conjoon.cn_comp.app.Application',
                applicationViewModelClassName : me.applicationViewModelClassName,
                applicationSchemaConfig       : me.applicationSchemaConfig,
                msg                           : "conjoon.cn_comp.app.Application requires both applicationSchemaConfig and applicationViewModelClassName to be defined."
            });
        }

        if (!Ext.ClassManager.get(me.applicationViewModelClassName) ||
            ((Ext.isString(me.applicationSchemaConfig) && !Ext.ClassManager.get(me.applicationSchemaConfig)) ||
             (Ext.isObject(me.applicationSchemaConfig) && !Ext.ClassManager.getNameByAlias('schema.' + me.applicationSchemaConfig.type))
            )) {
            Ext.raise({
                sourceClass               : 'conjoon.cn_comp.app.Application',
                applicationViewModelClass : Ext.ClassManager.get(me.applicationViewModelClassName),
                applicationSchemaConfig   : Ext.isString(me.applicationSchemaConfig)
                                            ? Ext.ClassManager.get(me.applicationSchemaConfig)
                                            : Ext.ClassManager.getNameByAlias('schema.' + me.applicationSchemaConfig.type),
                msg                       : "conjoon.cn_comp.app.Application requires both applicationSchemaConfig and applicationViewModelClass to be loaded."
            });
        }

        delete config.applicationSchemaConfig;
        delete config.applicationViewModelClassName;

        me.callParent([config]);
    },

    /**
     * @inheritdoc
     * Overridden to make sure the viewmodel of the view gets created and set to
     * the return value of {@link #getApplicationViewModel}
     * @param value
     *
     * @return {conjoon.cn_comp.container.Viewport}
     *
     * @throws if {@link #mainView} was already set and instantiated, or if
     * the mainView ist no instance of {@link conjoon.cn_comp.container.Viewport}
     */
    applyMainView: function(value) {

        if (this.getMainView()) {
            Ext.raise({
                sourceClass : 'conjoon.cn_comp.app.Application',
                mainView    : this.getMainView(),
                msg         : "conjoon.cn_comp.app.Application's mainView was already set."
            });
        }

        var view = this.getView(value),
            view = view.create({
            viewModel : this.getApplicationViewModel()
        });

        if (!(view instanceof conjoon.cn_comp.container.Viewport)) {
            Ext.raise({
                sourceClass : 'conjoon.cn_comp.app.Application',
                mainView    : this.getMainView(),
                msg         : "conjoon.cn_comp.app.Application's mainView must be an instance of conjoon.cn_comp.container.Viewport."
            });
        }

        return view;
    },

    /**
     * Iterates over this applications controllers and checks if any controller
     * is of the type {@link conjoon.cn_core.app.PackageController}. Its method
     * {@link conjoon.cn_core.app.PackageController#postLaunchHook} will then be called,
     * if possible, and the returning items will be passed to its
     * {@link conjoon.cn_comp.container.Viewport#addPostLaunchInfo} method.
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

            if ((ctrl instanceof conjoon.cn_core.app.PackageController) &&
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
                    sourceClass : 'conjoon.cn_comp.app.Application',
                    schema      : Ext.getClass(schema),
                    msg         : "conjoon.cn_comp.app.Application requires schema to be an instance of Ext.data.schema.Schema."
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
                    sourceClass          : 'conjoon.cn_comp.app.Application',
                    applicationViewModel : Ext.getClass(me.applicationViewModel),
                    msg                  : "conjoon.cn_comp.app.Application requires applicationViewModel to be an instance of Ext.app.ViewModel."
                });
            }

        }

        return this.applicationViewModel;
    }


});
