/**
 * conjoon
 * (c) 2007-2018 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2018 Thorsten Suckow-Homberg/conjoon.org
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
 * This class provides a Toast Window to present system messages to the user.
 *
 * @example
 *    conjoon.Toast.warn("This is a warning");
 */
Ext.define('conjoon.cn_comp.window.Toast', {


    extend : 'Ext.window.Toast',


    alias : 'widget.cn_comp-toast',


    cls : 'cn_comp-toast',

    /**
     * The context for which this toast was created. Will be added as css-class name
     * to the cls of the Toast-Window.
     * @type {String} context=""
     */
    context : "",

    /**
     * @type {String} bodyPadding="14 14 0 68"
     */
    bodyPadding : "14 14 0 68",

    /**
     * @type {String} align="tr"
     */
    align : 'tr',

    /**
     * @type {Boolean} autoClose=true
     */
    autoClose : true,


    /**
     * @inheritdoc
     */
    constructor : function(cfg) {

        const me = this;

        if (cfg.context) {
            cfg.cls = this.cls + ' ' + cfg.context;
        }


        me.callParent([cfg]);
    }


}, function(Toast) {

    conjoon.Toast = function() {

        return {

            /**
             * Creates a Toast Window that presents a message in the context "warning".
             *
             * @param {String} message
             *
             * @return {conjoon.cn_comp.window.Toast}
             */
            warn : function(message) {

                let toast, cfg = {
                    context : 'warning',
                    html    : message
                };

                toast = new Toast(cfg);
                toast.show();
                return toast;
            },


            /**
             * Creates a Toast Window that presents a message in the context "info".
             *
             * @param {String} message
             *
             * @return {conjoon.cn_comp.window.Toast}
             */
            info : function(message) {

                let toast, cfg = {
                    context : 'info',
                    html    : message
                };

                toast = new Toast(cfg);
                toast.show();
                return toast;
            }

        }

    }();

});
