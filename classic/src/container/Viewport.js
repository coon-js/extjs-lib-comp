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
 * A viewport implementation capable of consuming postLaunchHook-information
 * of {@link coon.comp.app.Application}s
 *
 * For the modern toolkit, this instance extends from Ext.Panel,
 * whereas for the classic toolkit Ext.container.Viewport is being used.
 */
Ext.define('coon.comp.container.Viewport', {

    extend : 'Ext.container.Viewport',

    /**
     * Method gets called by {@link coon.comp.app.Application#postLaunchHookProcess}
     * if any attached controller's postLaunchHook returns viable information
     * this view can use.
     *
     * @param {Object} information An object providing information as computed
     * by the postLaunch-process.
     */
    addPostLaunchInfo : Ext.emptyFn,


    /**
     * Method to make sure the the view represented by the passed hash is
     * available and activated in this viewport.
     *
     * @param {String} hash A string representing a unique hash which is
     * associated with the view.
     * @param {String} defaultToken A string representing the defaultToken of the
     * application, if any.
     *
     * @return {Ext.Component} The view associated with the hash, if any.
     */
    activateViewForHash : Ext.emptyFn,


    /**
     * Helper method to remove any remaining views from the viewport to make sure
     * input is not blocked by leftovers.
     */
    cleanup : Ext.emptyFn

});