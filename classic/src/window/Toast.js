/**
 * coon.js
 * extjs-lib-comp
 * Copyright (C) 2017-2021 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-comp
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
 * This class provides a Toast Window to present system messages to the user.
 *
 * @example
 *    coon.Toast.warn("This is a warning");
 */
Ext.define("coon.comp.window.Toast", {


    extend: "Ext.window.Toast",


    alias: "widget.cn_comp-toast",


    cls: "cn_comp-toast",

    /**
     * The context for which this toast was created. Will be added as css-class name
     * to the cls of the Toast-Window.
     * @type {String} context=""
     */
    context: "",

    /**
     * @type {String} bodyPadding="14 14 0 68"
     */
    bodyPadding: "14 28 14 68",

    /**
     * @type {String} align="tr"
     */
    align: "tr",

    /**
     * @type {Boolean} autoClose=true
     */
    autoClose: true,


    /**
     * @inheritdoc
     */
    constructor: function (cfg) {

        const me = this;

        if (cfg.context) {
            cfg.cls = this.cls + " " + cfg.context;
        }


        me.callParent([cfg]);
    }


}, function (Toast) {

    coon.Toast = function () {

        const show = function (message, context) {
            let toast, cfg = {
                context: context,
                html: message
            };

            toast = new Toast(cfg);
            toast.show();
            return toast;
        };

        return {


            /**
             * Creates a Toast Window that presents a message in the context "error".
             *
             * @param {String} message
             *
             * @return {coon.comp.window.Toast}
             */
            fail: function (message) {

                return show(message, "error");

            },

            /**
             * Creates a Toast Window that presents a message in the context "warning".
             *
             * @param {String} message
             *
             * @return {coon.comp.window.Toast}
             */
            warn: function (message) {

                return show(message, "warning");
            },


            /**
             * Creates a Toast Window that presents a message in the context "info".
             *
             * @param {String} message
             *
             * @return {coon.comp.window.Toast}
             */
            info: function (message) {

                return show(message, "info");
            }

        };

    }();

});
