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
        YESNO : 1,

        /**
         * Button Config for showing "Ok" button.
         * @type {Number} [OK=2]
         */
        OK : 2,

        /**
         * Button Config for showing "Ok" and "Cancel" button.
         * @type {Number} [OKCANCEL=3]
         */
        OKCANCEL : 3,

        /**
         * Glyph cls for Question mark
         * @type {String} [QUESTION=fa fa-question-circle]
         */
        QUESTION : 'fa fa-question-circle',

        /**
         * Glyph cls for Question mark
         * @type {String} [QUESTION=fa fa-question-circle]
         */
        FAILURE : 'fa fa-frown-o',

        /**
         * Glyph cls for Exclamation mark
         * @type {String} [ERROR=fa fa-exclamation-circle]
         */
        ERROR : 'fa fa-exclamation-circle'

    },

    childEls: [
        'yesButton',
        'noButton',
        'okButton',
        'cancelButton',
        'textfield'
    ],

    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',

        '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
        Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
        '<div class="badge {glyphCls}"></div>',
        '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
        Ext.baseCSSPrefix, 'mask-msg-text',
        '{childElCls}" role="presentation">{msg}</div>',
        '<div class="message">{message}</div>',
        '<div class="textInput"><input type="text" id="{id}-textfield" data-ref="textfield" class="x-form-text-default" placeholder="{emptyText}"/></div>',
        '<div class="actionBox">',
        '<div class="left"><span data-ref="yesButton" id="{id}-yesButton" class="button" role="button">{yes}</span></div>',
        '<div class="right"><span data-ref="noButton" id="{id}-noButton" class="button" role="button">{no}</span></div>',
        '<div class="left"><span data-ref="okButton" id="{id}-okButton" class="button" role="button">{ok}</span></div>',
        '<div class="right"><span data-ref="cancelButton" id="{id}-cancelButton" class="button" role="button">{cancel}</span></div>',
        '</div>',
        '</div>',
        '</div>'
    ],

    cls :  Ext.baseCSSPrefix + 'mask' + ' cn_comp-messagemask',

    /**
     * true to style the mask as a dialog, otherwise false.
     */
    dialogStyle : true,

    msg : undefined,


    /**
     * @cfg {Boolean/Object} true to show an input field. It's value will be
     * submitted to the configured callback as the second parameter. Optional,
     * an object with an "emptyText" value which will be shown as the placeholder
     * in the input field.
     */
    input : null,

    /**
     * An object containing the default button text strings.
     * @cfg {Object} buttonText
     */
    buttonText: {
        yes    : 'Yes',
        no     : 'No',
        ok     : 'Ok',
        cancel : 'Cancel'
    },

    /**
     * An array holding the button ids that should be used as arguments for the
     * #callback. Make sure you keep the order of the entries when overriding
     * this property.
     * @cfg {Array} buttonIds
     */
    buttonIds : [
        'yesButton', 'noButton', 'okButton', 'cancelButton'
    ],

    /**
     * A callback function to call whenever a button is clicked. First argument
     * passed to the method is the button-id that was clicked, second argument is
     * the value of the #input field, if any was rendered.
     * @cfg {Function} callback
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

        if (config.dialogStyle === false) {
            me.dialogStyle = false;
        }

        if (me.dialogStyle !== false) {
            me.cls += ' dialog';
        }

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
        result.yes    = me.buttonText.yes;
        result.no     = me.buttonText.no;
        result.ok     = me.buttonText.ok;
        result.cancel = me.buttonText.cancel;

        result.emptyText = Ext.isObject(me.input) && me.input.emptyText
                           ? me.input.emptyText
                           : '';

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

        switch (me.buttons) {
            case me.statics().YESNO:
                me.okButton.dom.parentNode.style.display     = "none";
                me.cancelButton.dom.parentNode.style.display = "none";
                break;

            case me.statics().OK:
                me.yesButton.dom.parentNode.style.display    = "none";
                me.noButton.dom.parentNode.style.display     = "none";
                me.cancelButton.dom.parentNode.style.display = "none";
                break;

            case me.statics().OKCANCEL:
                me.yesButton.dom.parentNode.style.display = "none";
                me.noButton.dom.parentNode.style.display  = "none";
                break;

            default:
                me.yesButton.dom.parentNode.style.display    = "none";
                me.noButton.dom.parentNode.style.display     = "none";
                me.cancelButton.dom.parentNode.style.display = "none";
                me.okButton.dom.parentNode.style.display     = "none";
                break;
        }

        if (me.input) {
            me.textfield.focus(100);
            me.mon(me.textfield, 'keydown', me.handleTextFieldKeyDown, me);
        } else {
            me.textfield.dom.parentNode.style.display = "none";
        }
    },


    /**
     * Handles a "button" click. The argument passed to the #callback, if any
     * defined for this instance, is the button type that was clicked, thus any
     * of #buttonIds. Additionally, if #input was specified and the textfield
     * was rendered, the value of this field will be submitted as the second
     * argument.
     *
     * @param {String} type
     * @param {String} inputValue
     *
     * @see close
     * @private
     */
    handleButtonClick : function(type, inputValue) {
        var me = this;

        if (me.callback) {
            me.callback.apply(me.scope, arguments);
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
            originalIds = me.buttonIds,
            elId        = originalIds.indexOf(id),
            args;

        if (el.tagName.toLowerCase() == 'span' && elId !== -1) {
            args = [me.getButtonIdForIndex(elId)];

            if (me.input) {
                args.push(me.textfield.dom.value);
            }
            me.handleButtonClick.apply(me, args);
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
    onBeforeLoad : Ext.emptyFn,

    privates : {

        /**
         * Callback for the textfields "keydown" event, if the textfield was renderd.
         * Will treat the "enter" key like a click on the okButton.
         *
         * @param {Ext.event.Event} evt
         * @param {HTMLElement} source
         *
         * @see handleButtonClick
         */
        handleTextFieldKeyDown : function(evt, source) {

            var me = this;

            if (evt.keyCode === Ext.event.Event.ENTER) {
                me.handleButtonClick('okButton', source.value);
            }

        }

    }

});