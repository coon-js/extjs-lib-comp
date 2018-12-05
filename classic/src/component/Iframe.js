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
 * Iframe implementation, with focus on sandbox and srcdoc functionality.
 * The Iframe is sandboxed defaulting to 'allow-same-origin'.
 * This implementation does not provide a src-getter/setter for loading documents
 * into the frame.
 * Right now, the content must be set using setSrcDoc and getSrcDoc.
 *
 * Example usage:
 *
 *     @example
 *     let iframe = Ext.create('conjoon.cn_comp.component.Iframe({
 *         renderTo : document.body,
 *         height   : 400,
 *         width    : 800
 *     });
 *
 *     iframe.setSrcDoc("Hello World");
 *
 */
Ext.define('conjoon.cn_comp.component.Iframe', {

    extend : 'Ext.Component',

    alias : 'widget.cn_comp-iframe',

    renderTpl: [
        '<iframe sandbox="{sandbox}" scrolling="{scrolling}" id="{id}-cn_iframeEl" data-ref="cn_iframeEl" name="{name}" width="100%" height="100%" frameborder="0"></iframe>'
    ],

    childEls: ['cn_iframeEl'],

    /**
     * @cfg {String} name
     */
    name : undefined,

    /**
     * @cfg {String} scrolling
     */
    scrolling : undefined,

    /**
     * @cfg {String} sandbox
     */
    sandbox : "allow-same-origin",

    /**
     * @inheritdoc
     */
    initComponent: function () {
        const me = this;

        me.callParent();

        me.name = me.name || me.id + '-frame';
    },


    /**
     * @inheritdoc
     */
    initRenderData: function() {
        const me = this;

        return Ext.apply(me.callParent(arguments), {
            name      : me.name,
            sandbox   : me.sandbox,
            scrolling : me.scrolling
        });
    },


    /**
     * Sets the srcdoc of this iframe to the specified value. If a falsy value
     * is submitted, srcdoc will be set to an empty string.
     *
     * @param {String} value
     */
    setSrcDoc : function(value) {
        const me = this;

        if (!value) {
            value = "";
        }

        me.cn_iframeEl.dom.srcdoc = value;
    },


    /**
     * Returns the value of the srcdoc of this iframe.
     *
     * @returns {string}
     */
    getSrcDoc : function() {

        const me = this;

        return me.cn_iframeEl.dom.srcdoc;
    }

});