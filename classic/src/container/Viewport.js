/**
 * conjoon
 * (c) 2007-2016 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2016 Thorsten Suckow-Homberg/conjoon.org
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
 * A viewport implementation capable of consuming postLaunchHook-information
 * of {@link conjoon.cn_comp.app.Application}s
 */
Ext.define('conjoon.cn_comp.container.Viewport', {

    extend : 'Ext.container.Viewport',

    /**
     * Method gets called by {@link conjoon.cn_comp.app.Application#postLaunchHookProcess}
     * if any attached controller's postLaunchHook returns viable information
     * this view can use.
     *
     * @param {Object} information An object providing information as computed
     * by the postLaunch-process.
     */
    addPostLaunchInfo : Ext.emptyFn,

    /**
     * Helper method to add any view from outside by specifying a hash. This is
     * mainly for PackageControllers utilizing deeplinking that have to set up
     * their packages' MainView first in order to continue routing into
     * functionality of nested views.
     * This method should first query its container for a view associated with
     * the hash, then set this view active. If a view with the hash cannot be
     * found, the class information of the view associated with the hash should
     * be looked up and then build.
     *
     * @param {String} hash A string representing a unique hash which is
     * associated with the view.
     *
     * @return {Ext.Component} The view associated with the hash, if any.
     */
    addViewForHash : Ext.emptyFn

});
