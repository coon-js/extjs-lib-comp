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
 * An extended LoadMask which is capable of displaying title, a message and
 * buttons/links to behave similar to MessageBoxes, although this implementation
 * is designed to be used as component masks to be more unobtrusive than modal
 * dialogs.
 *
 * Example usage:
 *
 *     @example
 *     var myPanel = new Ext.panel.Panel({
 *         renderTo : document.body,
 *         height   : 400,
 *         width    : 800,
 *         title    : 'Foo'
 *     });
 *
 *     var myMask = Ext.create('conjoon.cn_comp.component.MessageMask', {
 *         title    : 'Saving failed',
 *         message  : 'Saving the data failed. Do you want to try again?',
 *         target   : myPanel,
 *         buttons  : conjoon.cn_comp.component.MessageMask.YESNO,
 *         icon     : conjoon.cn_comp.component.MessageMask.QUESTION,
 *         callback : function(btnAction) {
 *             alert("You clicked " + btnAction);
 *         }
 *     });
 *
 *     myMask.show();
 *
 *     // to close and destroy the mask later on, call "close()"
 *     // myMask.close();
 *
 *
 *
 */
Ext.define('conjoon.cn_comp.component.MessageMask', {

    extend: 'Ext.LoadMask',

    statics : {

        /**
         * Button Config for showing "Yes"/"No" buttons.
         * @type {Number} [YESNO=1]
         */
        YESNO    : 1,

        /**
         * Glyph cls for Question mark
         * @type {String} [QUESTION=fa fa-question-circle]
         */
        QUESTION : 'fa fa-question-circle'

    },

    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',

        '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
        Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
        '<div class="badge {glyphCls}"></div>',
        '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
        Ext.baseCSSPrefix, 'mask-msg-text',
        '{childElCls}" role="presentation">{msg}</div>',
        '<div class="message">{message}</div>',
        '<div class="actionBox">',
        '<div class="left"><span  id="{id}-yes" class="button" role="button">{yes}</span></div>',
        '<div class="right"><span id="{id}-no" class="button" role="button">{no}</span></div>',
        '</div>',
        '</div>',
        '</div>'
    ],

    cls :  Ext.baseCSSPrefix + 'mask' + ' cn_comp-messagemask',

    msg : undefined,

    /**
     * An object containing the default button text strings.
     * @cfg {Object} buttonText
     */
    buttonText: {
        yes    : 'Yes',
        no     : 'No'
    },

    /**
     * An array holding the button ids that should be used as arguments for the
     * #callback. Make sure you keep the order of the entries when overriding
     * this property.
     * @cfg {Array} buttonIds
     */
    buttonIds : [
        'yes', 'no'
    ],

    /**
     * A callback function to call whenever a button is clicked.
     * @cfg {Function} confirmCallback
     */
    callback : undefined,

    /**
     * The scope the callback has to be called in.
     * @cfg {Object} scope
     */
    scope : undefined,

    /**
     * The glyph cls to use with this mask.
     * @cfg {String} icon
     */
    icon : undefined,


    /**
     * @inheridoc
     */
    constructor : function(config) {

        var me = this;

        config = config || {};

        config.msg = config.title;

        delete config.title;

        me.callParent([config]);
    },


    /**
     * @inheritdoc
     */
    initRenderData: function() {
        var me     = this,
            result = me.callParent(arguments);

        // buttons
        result.yes  = me.buttonText.yes;
        result.no   = me.buttonText.no;

        // texts
        result.message = me.message;

        // icons
        result.glyphCls = me.icon;

        return result;
    },


    /**
     * Overrides parent implementation to make sure this component's el "click"
     * event is handled by #onClick()
     *
     * @ee onClick
     */
    afterRender: function() {
        var me = this;

        me.callParent(arguments);

        me.el.on('click', me.onClick, me);
    },


    /**
     * Handles a "button" click. The argument passed to the #callback, if any
     * defined for this instance, is the button type that was clicked, thus any
     * of #buttonIds. Any button click will close this mask.
     *
     * @param {String} type
     *
     * @see close
     * @private
     */
    handleButtonClick : function(type) {
        var me = this;

        if (me.callback) {
            me.callback.apply(me.scope, [type]);
        }

        me.close();
    },


    /**
     * Returns the value of buttonIds at the specified index.
     *
     * @param {Number} index
     *
     * @throws if no value was found at the specified index
     *
     * @private
     */
    getButtonIdForIndex : function(index) {
        var me    = this,
            value = me.buttonIds[index];

        if (!value) {
            Ext.raise({
                index : index,
                msg   : "no value found for \"index\""
            });
        }

        return value;
    },


    /**
     * Handler for this el's click event. Delegates to handleButtonClick
     * if a valid target was clicked (any of the "buttons"). The argument passed
     * to handleButtonClicked is the value of buttonIds which index corresponds
     * to the parsed id of the clicked "button".
     *
     * @param {Ext.util.Event} evt
     * @param {HtmlElement} el
     *
     * @see handleButtonClick
     */
    onClick : function(evt, el) {
        var me          = this,
            id          = el.id.split('-').pop(),
            /**
             * Entries here must map the order of ids in buttonIds
             * @type {string[]}
             */
            originalIds = ['yes', 'no'],
            elId        = originalIds.indexOf(id);

        if (el.tagName.toLowerCase() == 'span' && elId !== -1) {
            me.handleButtonClick(me.getButtonIdForIndex(elId));
        }

    },


    /**
     * Removes and destroys this component.
     *
     * @see destroy
     */
    close : function() {
        var me = this;
        me.destroy();
    },


    /**
     * no store functionality
     */
    bindStore : Ext.emptyFn,


    /**
     * no store functionality
     */
    getStoreListeners : Ext.emptyFn,


    /**
     * no store functionality
     */
    onLoad : Ext.emptyFn,


    /**
     * no store functionality
     */
    onBeforeLoad : Ext.emptyFn

});