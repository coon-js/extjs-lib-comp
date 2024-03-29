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

StartTest((t) => {

    // +----------------------------------------------------------------------------
    // |                    =~. Unit Tests .~=
    // +----------------------------------------------------------------------------

    t.requireOk("coon.comp.form.AutoCompleteForm", function () {

        var form,
            formConfig,
            currId;

        t.beforeEach(function (){

            currId = Ext.id();

            formConfig = {
                id: currId,
                xclass: "coon.comp.form.AutoCompleteForm",
                width: 400,
                height: 200,
                renderTo: document.body,
                items: [{
                    xtype: "textfield",
                    value: "a",
                    name: "focusMeToo"
                }, {
                    xtype: "textfield",
                    name: "focusMe"
                }, {
                    xtype: "textfield",
                    inputType: "password"
                }, {
                    xtype: "textfield",
                    inputType: "password",
                    autoComplete: false
                }]
            };
        });


        t.afterEach(function () {

            formConfig = null;

            if (form) {
                form.destroy();
                form = null;
            }

            if (document.getElementById(currId)) {
                document.getElementById(currId)
                    .parentNode
                    .removeChild(document.getElementById(currId));
            }
        });


        // -------------------------------------------------------------------------

        t.it("Should build the form with autocomplete attributes (autoCompleteTrigger=false)", (t) => {
            formConfig.formName = "testform";
            form = Ext.create(formConfig);

            t.expect(form.autoCompleteTrigger).toBe(false);
            t.expect(form.submitHelperButton).toBeNull();
            t.expect(form.el.dom.tagName.toLowerCase()).toBe("form");
            t.expect(form.el.dom.method.toLowerCase()).toBe("post");
            t.expect(form.el.dom.name).toBe("testform");

        });


        t.it("Should have added autocomplete attribute to some fields (autoCompleteTrigger=false)", (t) => {
            form = Ext.create(formConfig);

            var c = 0,
                i = 0;

            Ext.each(form.query("textfield"), function (field) {
                
                if (field.getAutoComplete() === false) {
                    t.expect(field.inputElement.dom.autocomplete).toBe("off");
                    i++;
                } else {
                    t.expect(field.inputElement.dom.autocomplete).toBe("on");
                    c++;
                }

            });

            t.expect(i).toBe(1);
            t.expect(c).toBe(3);
            t.expect(form.el.dom.name).toBe("");
        });


        t.it("Second textfield should have the focus (autoCompleteTrigger=false)", (t) => {
            form = Ext.widget(formConfig);

            var el  = form.down("textfield[name=focusMe]"),
                el2 = form.down("textfield[name=focusMeToo]");

            t.expect(document.activeElement).not.toBe(el2.inputElement.dom);
            t.expect(document.activeElement).not.toBe(el.inputElement.dom);
            form.focus();
            t.expect(document.activeElement).not.toBe(el2.inputElement.dom);
            t.expect(document.activeElement).toBe(el.inputElement.dom);

            el2.focus();

            t.expect(document.activeElement).not.toBe(el.inputElement.dom);
            t.expect(document.activeElement).toBe(el2.inputElement.dom);

        });

        t.it("Should be okay with missing actionUrl (autoCompleteTrigger {})", (t) => {

            form = Ext.widget(Ext.apply({
                autoCompleteTrigger: {
                    reference: "somebutton"
                },
                buttons: [{
                    text: "Login",
                    reference: "somebutton"
                }]
            }, formConfig));

            t.expect(form.defaultFakeActionUrl).not.toBeNull();
            t.expect(form.defaultFakeActionUrl).toBeDefined();
            t.expect(form.defaultFakeActionUrl).toBe("./resources/html/blank.html");

            t.expect(form.autoCompleteTrigger.actionUrl).toBe("./resources/html/blank.html");

        });

        t.it("Should be okay with autoCompleteTrigger", (t) => {

            var wasClicked = false;

            var form = Ext.create(Ext.apply({
                autoCompleteTrigger: {
                    actionUrl: "./foo.bar",
                    reference: "somebuttonNew"
                },
                buttons: [{
                    text: "Login",
                    reference: "somebuttonNew"
                }]
            }, formConfig));

            t.expect(form.submitHelperButton).not.toBeNull();
            t.expect(form.submitHelperButton).toBeDefined();

            if (Ext.isChrome) {
                form.submitHelperButton.addEventListener("click", function (){
                    wasClicked = true;
                });
            } else {
                Ext.get(form.submitHelperButton).on("click", function (){
                    wasClicked = true;
                });
            }

            t.expect(wasClicked).toBe(false);


            t.click(form.down("button[reference=somebuttonNew]"), function () {
                t.expect(wasClicked).toBe(true);
            });


        });


        t.it("Should throw error for missing reference (autoCompleteTrigger {})", (t) => {
            formConfig.autoCompleteTrigger = {
                actionUrl: "foo.bar"
            };
            var exc = undefined;
            try {
                form = Ext.create(formConfig);
            } catch (e) {
                exc = e;
            }
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();

        });

        t.it("Should trigger error with missing reference target (autoCompleteTrigger {})", (t) => {
            formConfig.autoCompleteTrigger = {
                actionUrl: "foo.bar",
                reference: "somebutton"
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

        t.it("Should throw error for wrong value for autoCompleteTrigger (autoCompleteTrigger {})", (t) => {
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


    }); // EO requireOK


});
