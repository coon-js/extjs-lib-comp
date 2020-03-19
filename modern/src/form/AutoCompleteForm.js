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
 * This is the base class for forms that wish to utilize autocomplete functionality,
 * such as authentication forms.
 * This form will basically set the autocomplete attribute of it's child textfield
 * items to true, except those which have their autocomplete-config property explicitely
 * set to "false".
 * Additionally, this form will also focus the first visible, enabled and empty
 * textfield that can be found after the form was rendered.
 * To set the autocomplete attribute of nested textfields to "off", configure
 * these fields with "autoComplete: false".
 *
 * This class can also trigger autocompletion when the form is not used
 * with the basic {@link #Ext.form.Action}-classes, for example, when the values
 * of the form should be processed in custom code rather than a standard/direct
 * form-submit. Specify {@link #autoCompleteTrigger} to an object containing
 * an actionUrl and a button-reference whenever instances of
 * this class do not use calls to {@link Ext.form.Panel#submit}.
 * This component will then render a hidden input-button with its type set to
 * "submit" which will be used to create an automatic submit. A specific form
 * listener will then prevent the default action for the submit event and POST
 * data via a XMLHttpRequest to the configured #actionUrl.
 * This is necessary so the browser get notified of a form submit and save those
 * values which are - in the most cases - a pair of user credentials.
 * The action-url for the form can be specified in
 * {@link #autoCompleteTrigger}.actionUrl and should be an existing local file.
 * By default, this package's "resources/html/blank.html" will be used.
 * No further form-data is needed by this html-page, it serves solely as a POST
 * target for the submit button andthe created XMLHttpRequest - a status code
 * of 200 is required, notifying the browser that autocomplete values can be saved.
 * In order for the fake form-submit and the autocomplete to work, implementing
 * classes need to specify a button reference via {@link #autoCompleteTrigger}.reference.
 * This class will then add a click-listener to this button and run the fake
 * submit-process as soon as the button was clicked. Implementing classes should
 * make sure that clicking this button is only possible once form-data has been
 * validated.
 *
 *      @example
 *      Ext.define('MyApp.AutoCompleteForm', {
 *
 *          extend : 'coon.comp.form.AutoCompleteForm',
 *
 *          autoCompleteTrigger : {
 *              reference : 'submitButton',
 *              actionUrl : './resources/html/blank.html',
 *          },
 *
 *          items : [{
 *              xtype      : 'textfield',
 *              name       : 'name',
 *              fieldLabel : 'Name',
                allowBlank : false
 *          }],
 *
 *          buttons : [{
 *              // clicking this button will trigger  the "autocomplete"
 *              // functionality of browsers by submitting the form into a
 *              // hidden iframe, since "autoCompleteTrigger" was configured
 *              // with this button's reference.
 *              reference : 'submitButton',
 *              formBind  : true,
 *              text      : "Submit",
 *              handler   : function(btn) {
 *                   console.log(btn.up('form').getValues());
 *              }
 *          }]
 *
 *      });
 *
 *
 */
Ext.define('coon.comp.form.AutoCompleteForm', {

    extend : 'Ext.form.Panel',

    xtype : 'cn_comp-autocompleteform',

    referenceHolder : true,

    /**
     * Seek out the first enabled, focusable, empty textfield when the form is focused
     */
    defaultFocus: 'textfield:focusable:not([hidden]):not([disabled]):not([value])',

    /**
     * @cfg {String} formName
     * The name for the form used as the name attribute for the <form>-tag
     */
    formName : undefined,

    /**
     * @type {Boolean/Object} [autoCompleteTrigger=false]
     * false to not trigger autocomplete by faking a form submit into a hidden
     * iframe, or
     * {String} autoCompleteTrigger.actionUrl The url to which the fake post
     * of the XMLHttpRequest should happen. Will default to {@link #defaultFakeActionUrl}
     * if not specified.
     * {String} autoCompleteTrigger.reference The reference of the button that
     * triggers the fake submit/autocomplete. This class will automatically
     * create a "click" listener for this button.
     */
    autoCompleteTrigger : false,

    /**
     * @cfg {String} [defaultFakeActionUrl=./resources/html/blank.html]
     * The default action url to use with the fake iframe if autoCompleteTrigger
     * is configured as an object, but missing the actionUrl property.
     */
    defaultFakeActionUrl : './resources/html/blank.html',

    /**
     * @type {HtmlElement}
     * @private
     */
    submitHelperButton : null,


    method : "post",


    /**
     * @inheritdoc
     *
     * @throws exception if autoCompleteTrigger was not properly configured
     */
    initialize: function () {

        const me = this;

        if (me.formName) {
            me.el.dom.name = me.formName;
        }

        me.el.dom.method = me.getMethod();

        Ext.each(me.query('textfield'), function (field) {
            field.setAutoComplete(field.getAutoComplete() !== false);
        });

        if (me.autoCompleteTrigger !== false) {
            me.sanitizeAutoCompleteTrigger(me.autoCompleteTrigger);
            me.on('initialize', me.createFakeSubmitHelper, me, {single : true});
        }

        me.callParent();
    },


    privates : {

        /**
         * Additional check for this forms configuration, mainly for the
         * {@link #autoCompleteTrigger} configuration that gets passed to this
         * method.
         *
         * @param {Object} options
         *
         * @return {Object} returns an object that should be applied to this
         * form's {@link Ext.form.Panel#autoEl}.
         *
         * @throws error if autoCompleteTrigger is not false and properly configured
         * with actionUrl and reference
         */
        sanitizeAutoCompleteTrigger : function(options) {

            const me = this;

            if (!options.actionUrl ||
                !Ext.isString(options.actionUrl)) {
                options.actionUrl = me.defaultFakeActionUrl;
            }

            if (!options.actionUrl || !options.reference ||
                !Ext.isString(options.actionUrl) || !Ext.isString(options.reference)) {
                Ext.raise({
                    sourceClass : Ext.getClassName(this),
                    actionUrl   : options.actionUrl,
                    reference   : options.reference,
                    msg         : Ext.getClassName(this) + " needs actionUrl and reference to be configured as strings"
                });
            }

            return {
                actionUrl : options.actionUrl
            };
        },



        /**
         * Creates fake submit elements if this form should not use the default
         * submit() functionality.
         *
         * @throws error if the reference specified in {@link #autoCompleteTrigger}.reference
         * cannot be found.
         */
        createFakeSubmitHelper : function() {

            const me  = this,
                btn = me.lookup(me.autoCompleteTrigger.reference);

            if (!btn) {
                Ext.raise({
                    sourceClass : Ext.getClassName(this),
                    reference   : me.autoCompleteTrigger.reference,
                    msg         : Ext.getClassName(this) + "#autoCompleteTrigger (Object) needs reference to be representing an existing component"
                });
                return;
            }

            me.submitHelperButton = Ext.DomHelper.append(
                me.el.dom,
                {tag : 'input', type : 'submit', style : 'display:none'}
            );

            Ext.fly(me.el.dom).on('submit', me.onDomFormSubmit, me);

            btn.on('tap', me.triggerFakeSubmit, me);
        },

        /**
         * Callback for the native {Form] wrapped by this Ext Element to make
         * sure the browser's "save form data" dialog is triggered.
         *
         * @param {Ext.Event} evt
         *
         * @returns {boolean} false
         */
        onDomFormSubmit : function(evt) {

            var me   = this,
                form, p, input;

            evt.preventDefault();

            var request = new XMLHttpRequest();
            request.open('POST', me.autoCompleteTrigger.actionUrl, true);
            request.send();

            return false;
        },

        /**
         * Triggers a fake submit
         *
         * @throws error if neither the button referenced via {@link #submitButtonId}
         * or the iframe referenced via {@link #iframeId} can be found.
         */
        triggerFakeSubmit : function() {

            var me  = this,
                btn = me.submitHelperButton;

            if (!btn) {
                Ext.raise({
                    sourceClass : Ext.getClassName(this),
                    msg         : Ext.getClassName(this) + " cannot find the fake submit button"
                });
            }

            btn.click();
        }

    }

});
