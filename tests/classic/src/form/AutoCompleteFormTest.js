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

describe('conjoon.cn_comp.form.AutCompleteFormTest', function(t) {


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    t.requireOk('conjoon.cn_comp.form.AutoCompleteForm', function() {

        var form,
            formConfig;

        t.beforeEach(function(t){
            formConfig = {
                id    : 'testForm',
                xtype : 'cn_comp-autocompleteform',

                renderTo : document.body,

                items : [{
                    xtype : 'textfield',
                    value : 'a',
                    name  : 'focusMeToo'
                }, {
                    xtype : 'textfield',
                    name  : "focusMe"
                }, {
                    xtype     : 'textfield',
                    inputType : 'password'
                }, {
                    xtype        : 'textfield',
                    inputType    : 'password',
                    autoComplete : false
                }]
            };
        });

        t.afterEach(function(t) {

            if (form) {
                form.destroy();
                form = null;
            }
        })

    // -------------------------------------------------------------------------

        t.it('Should build the form with autocomplete attributes (autoCompleteTrigger=false)', function(t) {
            formConfig.formName = 'testform';
            form = Ext.widget(formConfig);

            t.expect(form.autoCompleteTrigger).toBe(false);
            t.expect(form.submitButtonId).toBeNull();
            t.expect(form.iframeId).toBeNull();
            t.expect(form.el.dom.tagName.toLowerCase()).toBe('form');
            t.expect(form.el.dom.method.toLowerCase()).toBe('post');
            t.expect(form.el.dom.action).toBe("");
            t.expect(form.el.dom.target).toBe("");
            t.expect(form.el.dom.name).toBe("testform");

        });

        t.it('Should have added autocomplete attribute to some fields (autoCompleteTrigger=false)', function(t) {
            form = Ext.widget(formConfig);

            var c = 0,
                i = 0;

            Ext.each(form.query('textfield'), function (field) {
                if (field.autoComplete === false) {
                    t.expect(field.inputEl.dom.autocomplete).toBe('off');
                    i++;
                } else {
                    t.expect(field.inputEl.dom.autocomplete).toBe('on');
                    c++;
                }

            });

            t.expect(i).toBe(1);
            t.expect(c).toBe(3);
            t.expect(form.el.dom.name).toBe("");
        });


        t.it('Second textfield should have the focus (autoCompleteTrigger=false)', function(t) {
            form = Ext.widget(formConfig);

            var el  = form.down('textfield[name=focusMe]'),
                el2 = form.down('textfield[name=focusMeToo]');

            t.expect(document.activeElement).not.toBe(el2.inputEl.dom);
            t.expect(document.activeElement).not.toBe(el.inputEl.dom);
            form.focus();
            t.expect(document.activeElement).not.toBe(el2.inputEl.dom);
            t.expect(document.activeElement).toBe(el.inputEl.dom);

            el2.focus();

            t.expect(document.activeElement).not.toBe(el.inputEl.dom);
            t.expect(document.activeElement).toBe(el2.inputEl.dom);

        });


        t.it('Should throw error for missing reference (autoCompleteTrigger {})', function(t) {
            formConfig.autoCompleteTrigger = {
                actionUrl : 'foo.bar'
            };
            var exc = undefined;
            try {
                form = Ext.widget(formConfig);
            } catch (e) {
                exc = e;
            }
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();

        });

        t.it('Should trigger error with missing reference target (autoCompleteTrigger {})', function(t) {
            formConfig.autoCompleteTrigger = {
                actionUrl : 'foo.bar',
                reference : 'somebutton'
            };

            var exc = undefined;

            try {
                form = Ext.widget(formConfig);
            } catch (e) {
                exc = e;
            }

            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();
        });


        t.it('Should throw error for wrong value for autoCompleteTrigger (autoCompleteTrigger {})', function(t) {
            formConfig.autoCompleteTrigger = true;
            var exc = undefined;
            try {
                form = Ext.widget(formConfig);
            } catch (e) {
                exc = e;
            }
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();

        });

        t.it("Should be okay with missing actionUrl (autoCompleteTrigger {})", function(t) {

            formConfig.autoCompleteTrigger = {
                reference : 'somebutton'
            };
            formConfig.buttons = [{
                text      : "Login",
                reference : "somebutton"
            }];

            form = Ext.widget(formConfig);

            t.expect(form.defaultFakeActionUrl).not.toBeNull();
            t.expect(form.defaultFakeActionUrl).toBeDefined();
            t.expect(form.defaultFakeActionUrl).toBe('./resources/html/blank.html');

            t.expect(
                form.el.dom.action.substring(
                    form.el.dom.action.length - form.defaultFakeActionUrl.length + 1,
                    form.el.dom.action.length
                )
            ).toBe('/resources/html/blank.html');

        });

        t.it('Should be okay with autoCompleteTrigger', function(t) {

            var wasClicked = false;

            formConfig.autoCompleteTrigger = {
                actionUrl : './foo.bar',
                reference : 'somebutton'
            };

            formConfig.buttons = [{
                text : "Login",
                reference : "somebutton"
            }];

            form = Ext.widget(formConfig);

            t.expect(form.submitButtonId).not.toBeNull();
            t.expect(form.submitButtonId).toBeDefined();
            t.expect(form.iframeId).not.toBeNull();
            t.expect(form.iframeId).toBeDefined();

            t.expect(Ext.getElementById(form.iframeId)).not.toBeNull();
            t.expect(Ext.getElementById(form.iframeId)).toBeDefined();
            t.expect(Ext.getElementById(form.submitButtonId)).not.toBeNull();
            t.expect(Ext.getElementById(form.submitButtonId)).toBeDefined();

            t.expect(form.el.dom.action.substring(form.el.dom.action.length-8, form.el.dom.action.length)).toBe("/foo.bar");
            t.expect(form.el.dom.target).toBe(form.iframeId);


            if (Ext.isChrome) {
                Ext.getElementById(form.submitButtonId).addEventListener(
                    'click',
                    function(){
                        wasClicked = true;
                    }
                )
            } else {
                Ext.fly(Ext.getElementById(form.submitButtonId)).on('click', function(){
                    wasClicked = true;
                });
            }

            t.expect(wasClicked).toBe(false);
            t.click(form.down('button[reference=somebutton]'));

            t.expect(wasClicked).toBe(true);
        });


    }); // EO requireOK




});
