/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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
        'coon.core.app.PackageController',
        'coon.comp.container.Viewport'
    ],


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
            controllers = me.controllers.getRange(),
            mainView    = me.getMainView(),
            info        = {};

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
     * @throws if view is not instance of coon.comp.container.Viewport
     */
    applyMainView : function(view) {

        const me      = this,
              appView = me.callParent(arguments);

        if (appView !== undefined && !(appView instanceof coon.comp.container.Viewport)) {
            Ext.raise({
                msg : "coon.comp.app.Application's mainView must be an instance of coon.comp.container.Viewport."
            });
        }

        return appView;
    }

});