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
 * An {@link Ext.list.Tree} which provides functionality for showing/hiding it.
 */
Ext.define('conjoon.cn_comp.list.Tree', {

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