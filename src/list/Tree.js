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
 * An {@link Ext.list.Tree} which provides functionality for showing/hiding it.
 */
Ext.define('coon.comp.list.Tree', {

    extend :  'Ext.list.Tree',

    alias : 'widget.cn_comp-listtree',

    /**
     * @protected
     */
    previousWidth : null,

    /**
     * @protected
     */
    defaultWidth : 250,

    /**
     * @inheritdoc
     */
    constructor : function(config) {

        var me = this,
            width;

        config = config || {};

        if (config.width) {
            width = config.width;
        } else if (me.defaultConfig.width) {
            width = me.defaultConfig.width;
        }

        if (width) {
            me.defaultWidth = width;
        }


        me.callParent(arguments);
    },

    /**
     * Sets the visibility of this component by changing it's width to microWidth to
     * hide it, otherwise tries to read out {@link #previousWidth}. If that
     * value does not evaluate to a numeric value, {@link #defaultWidth} will be
     * used to set the width.
     *
     * @param {Boolean} hide true to hide it, otherwise false
     */
    setHidden : function(hide) {

        var me = this;

        if (hide) {

            me.previousWidth = me.getWidth();

            me.setWidth(0);
        } else {
            me.setWidth(me.previousWidth ? me.previousWidth : me.defaultWidth);

        }
    },

    /**
     * Returns true if this components width is anything other than 0.
     *
     * @return {Boolean} true if this Tree List is visible, otherwise false.
     */
    isHidden : function() {
        return this.getWidth() === 0;
    },

    /**
     * Returns true if this components width is anything other than 0.
     *
     * @return {Boolean} true if this Tree List is visible, otherwise false.
     */
    isVisible : function() {
        return !this.isHidden();
    }

});