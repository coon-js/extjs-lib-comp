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
 * Iframe implementation, with focus on sandbox and srcdoc functionality.
 * The Iframe is sandboxed defaulting to 'allow-same-origin'.
 * This implementation does not provide a src-getter/setter for loading documents
 * into the frame.
 * Right now, the content must be set using setSrcDoc and getSrcDoc.
 *
 * Example usage:
 *
 *     @example
 *     let iframe = Ext.create('coon.comp.component.Iframe({
 *         renderTo : document.body,
 *         height   : 400,
 *         width    : 800
 *     });
 *
 *     iframe.setSrcDoc("Hello World");
 *
 */
Ext.define('coon.comp.component.Iframe', {

    extend : 'Ext.Component',

    alias : 'widget.cn_comp-iframe',

    renderTpl: [
        '<iframe sandbox="{sandbox}" scrolling="{scrolling}" id="{id}-cn_iframeEl" data-ref="cn_iframeEl" name="{name}" width="100%" height="100%" frameborder="0"></iframe>'
    ],

    childEls: ['cn_iframeEl'],

    /**
     * Fired when the iframe loaded it's url/srcdoc.
     * @event load
     * @param this
     */

    /**
     * Fired before the srcdoc is set
     * @event beforesrcdoc
     * @param this
     * @param {Mixed} value The value with which this frame's srcoc is being set
     */

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
     *
     * @see #onLoad
     */
    initEvents : function() {

        const me = this;

        me.callParent(arguments);

        me.cn_iframeEl.on('load', me.onLoad, me);
    },


    /**
     * Named callback to make sure this Ext.Component triggers the "load" event
     * once the iframe triggered it.
     *
     * @private
     */
    onLoad : function() {

        const me = this;

        me.fireEvent('load', me);

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
     * Returns the body of this iframe.
     *
     * @return {HTMLElement}
     */

    getBody : function() {

        const me = this;

        return me.cn_iframeEl.dom.contentWindow.document.body;
    },


    /**
     * Sets the srcdoc of this iframe to the specified value. If a falsy value
     * is submitted, srcdoc will be set to an empty string.
     * Fires the
     * @param {String} value
     */
    setSrcDoc : function(value) {
        const me = this;

        if (!value) {
            value = "";
        }

        me.fireEvent("beforesrcdoc", me, value);

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