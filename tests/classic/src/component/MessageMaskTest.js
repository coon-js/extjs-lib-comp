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

describe('coon.comp.container.MessageMaskTest', function(t) {

    var panel,
        mask,
        getTextField = function(dom) {
            var field = Ext.dom.Query.select('div[class=textInput] > input[type=text]', dom);
            if (field.length) {
                return field[0];
            }

            return null;
        };


    t.beforeEach(function() {
        panel = Ext.create('Ext.Panel', {
            renderTo : document.body,
            width    : 600,
            height   : 400
        });
    });

    t.afterEach(function() {
        if (panel) {
            panel.destroy();
            panel = null;
        }

        if (mask) {
            mask.destroy();
            mask = null;
        }
    });



// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.it('test class and configuration', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.expect(coon.comp.component.MessageMask.YESNO).toBeDefined();
        t.expect(coon.comp.component.MessageMask.QUESTION).toBeDefined();
        t.expect(coon.comp.component.MessageMask.FAILURE).toBeDefined();
        t.expect(coon.comp.component.MessageMask.OK).toBeDefined();
        t.expect(coon.comp.component.MessageMask.ERROR).toBeDefined();
        t.expect(coon.comp.component.MessageMask.OKCANCEL).toBeDefined();

        t.isInstanceOf(mask, 'Ext.LoadMask');

        t.expect(mask.cls).toContain('cn_comp-messagemask');
        t.expect(mask.cls).toContain('dialog');

        t.expect(mask.dialogStyle).toBe(true);

        t.expect(mask.icon).toBeUndefined();
        t.expect(mask.msg).toBeUndefined();
        t.expect(mask.callback).toBeUndefined();
        t.expect(mask.scope).toBeUndefined();

        t.expect(mask.buttonIds[0]).toBe('yesButton');
        t.expect(mask.buttonIds[1]).toBe('noButton');
        t.expect(mask.buttonIds[2]).toBe('okButton');
        t.expect(mask.buttonIds[3]).toBe('cancelButton');

        t.expect(mask.buttonText).toEqual({
            yes : 'Yes', no : 'No', ok : 'Ok', cancel : 'Cancel'
        });

        mask.destroy();
        mask = null;

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel,
            dialogStyle : false
        });

        t.expect(mask.cls).toContain('cn_comp-messagemask');
        t.expect(mask.cls).not.toContain('dialog');

    });


    t.it('default dom nodes', function(t) {

        var nodes, ids;

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel,
            title  : 'foo'
        });

        mask.show();

        nodes = Ext.dom.Query.select('span[role=button]', mask.el.dom);

        t.expect(nodes.length).toBe(4);

        ids = [nodes[0].id, nodes[1].id, nodes[2].id, nodes[3].id];

        t.expect(ids).toContain(mask.getId() + '-' + 'yesButton');
        t.expect(ids).toContain(mask.getId() + '-' + 'noButton');
        t.expect(ids).toContain(mask.getId() + '-' + 'okButton');
        t.expect(ids).toContain(mask.getId() + '-' + 'cancelButton');

        var textField = getTextField(mask.el.dom);
        t.expect(textField).not.toBe(null);

    });


    t.it('constructor()', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel,
            title  : 'foo'
        });

        t.expect(mask.title).toBeUndefined();
        t.expect(mask.msg).toBe('foo');
    });


    t.it('initRenderData()', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target      : panel,
            buttonText  : {yes : 'foo', no : 'bar', ok : 'test', cancel : 'abort'},
            message     : 'snafu',
            icon        : 'barfoo',
            input       : {emptyText : 'foobar'}
        }),
        result = mask.initRenderData();

        t.expect(result.glyphCls).toBe('barfoo');
        t.expect(result.message).toBe('snafu');
        t.expect(result.yes).toBe('foo');
        t.expect(result.no).toBe('bar');
        t.expect(result.ok).toBe('test');
        t.expect(result.cancel).toEqual('abort');
        t.expect(result.emptyText).toEqual('foobar');

        mask.destroy();

        mask = Ext.create('coon.comp.component.MessageMask', {
                target : panel,
                input  : true
            }),
            result = mask.initRenderData();

        t.expect(result.emptyText).toEqual('');

        mask.destroy();

        mask = Ext.create('coon.comp.component.MessageMask', {
                target : panel
            }),
            result = mask.initRenderData();

        t.expect(result.emptyText).toEqual('');

        mask.destroy();
    });


    t.it('afterRender()', function(t) {

        t.isCalledOnce('onClick', coon.comp.component.MessageMask.prototype);

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel,
            title  : 'foo'
        });

        mask.show();
        t.click(mask);
    });


    t.it('handleButtonClick()', function(t) {

        var type     = null,
            callback = function(arg) {
                type = arg;
            };

        mask = Ext.create('coon.comp.component.MessageMask', {
            target   : panel,
            callback : callback
        });

        t.isCalledOnce('close',    mask);
        t.isCalledOnce('callback', mask);

        t.expect(type).toBe(null);
        mask.handleButtonClick('foo');
        t.expect(type).toBe('foo');

    });


    t.it('getButtonIdForIndex()', function(t) {

        var exc, e, res;
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.expect(exc).toBeUndefined();
        try{mask.getButtonIdForIndex(5);}catch(e){exc = e;}
        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("no value found");

        t.expect(mask.buttonIds.length).toBe(4);

        t.expect(res).toBeUndefined();
        res = mask.getButtonIdForIndex(0);
        t.expect(res).toBe('yesButton');

        res = mask.getButtonIdForIndex(1);
        t.expect(res).toBe('noButton');

        res = mask.getButtonIdForIndex(2);
        t.expect(res).toBe('okButton');

        res = mask.getButtonIdForIndex(3);
        t.expect(res).toBe('cancelButton');
    });


    t.it('yesButton onClick()', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('handleButtonClick',   mask);
        t.isCalledOnce('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'foo-yesButton', tagName : 'SPAN'});
    });


    t.it('noButton onClick()', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('handleButtonClick',   mask);
        t.isCalledOnce('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'foo-noButton', tagName : 'span'});
    });


    t.it('okButton onClick()', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('handleButtonClick',   mask);
        t.isCalledOnce('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'foo-okButton', tagName : 'span'});
    });


    t.it('cancelButton onClick()', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('handleButtonClick',   mask);
        t.isCalledOnce('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'foo-cancelButton', tagName : 'span'});
    });


    t.it('invalid target onClick()', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.isntCalled('handleButtonClick', mask);
        t.isntCalled('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'dsd-yes', tagName : 'div'});
    });


    t.it('close()', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('destroy', mask);

        mask.close();
    });


    t.it('bindStore()', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.bindStore).toBe(Ext.emptyFn);
    });


    t.it('getStoreListeners()', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.getStoreListeners).toBe(Ext.emptyFn);
    });


    t.it('onLoad()', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.onLoad).toBe(Ext.emptyFn);
    });


    t.it('onBeforeLoad()', function(t) {
        mask = Ext.create('coon.comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.onBeforeLoad).toBe(Ext.emptyFn);
    });


    t.it('button visibility - no buttons', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            target      : panel
        });

        t.expect(getTextField(mask.el.dom).parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=yesButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=noButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=okButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=cancelButton]")[0].parentNode.style.display).toBe('none');

        mask.close();
    });

    
    t.it('button visibility - YESNO', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons : coon.comp.component.MessageMask.YESNO,
            target  : panel
        });

        t.expect(getTextField(mask.el.dom).parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=yesButton]")[0].parentNode.style.display).not.toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=noButton]")[0].parentNode.style.display).not.toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=okButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=cancelButton]")[0].parentNode.style.display).toBe('none');

        mask.close();
    });


    t.it('button visibility - OK', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons : coon.comp.component.MessageMask.OK,
            target  : panel
        });

        t.expect(getTextField(mask.el.dom).parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=yesButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=noButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=okButton]")[0].parentNode.style.display).not.toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=cancelButton]")[0].parentNode.style.display).toBe('none');

        mask.close();
    });


    t.it('button visibility - OKCANCEL', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons : coon.comp.component.MessageMask.OKCANCEL,
            target  : panel
        });

        t.expect(getTextField(mask.el.dom).parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=yesButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=noButton]")[0].parentNode.style.display).toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=okButton]")[0].parentNode.style.display).not.toBe('none');
        t.expect(Ext.dom.Query.select("span[data-ref=cancelButton]")[0].parentNode.style.display).not.toBe('none');

        mask.close();
    });


    t.it('input visibility', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons : coon.comp.component.MessageMask.OKCANCEL,
            target  : panel,
            input   : true
        });

        t.expect(getTextField(mask.el.dom).parentNode.style.display).not.toBe('none');

        mask.close();
    });


    t.it('input w/ callback (click)', function(t) {

        var BUTTONID, VALUE,
            func = function(btnId, value) {
                BUTTONID = btnId;
                VALUE    = value;
            };

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons  : coon.comp.component.MessageMask.OKCANCEL,
            target   : panel,
            input    : {emptyText : 'foobar'},
            callback : func
        });

        mask.show();

        t.expect(getTextField(mask.el.dom).placeholder).toBe('foobar');

        getTextField(mask.el.dom).value = 'barfoo';

        t.click("span[data-ref=okButton]");

        t.expect(BUTTONID).toBe('okButton');
        t.expect(VALUE).toBe('barfoo');

        t.expect(mask.destroyed).toBe(true);
    });


    t.it('input w/ callback (keyevent)', function(t) {

        var BUTTONID, VALUE,
            func = function(btnId, value) {
                BUTTONID = btnId;
                VALUE    = value;
            };

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons  : coon.comp.component.MessageMask.OKCANCEL,
            target   : panel,
            input    : {emptyText : 'foobar'},
            callback : func
        });

        mask.show();

        t.expect(getTextField(mask.el.dom).placeholder).toBe('foobar');

        getTextField(mask.el.dom).value = 'barfoo';

        t.keyPress(getTextField(mask.el.dom), "ENTER");

        t.expect(BUTTONID).toBe('okButton');
        t.expect(VALUE).toBe('barfoo');

        t.expect(mask.destroyed).toBe(true);
    });


    t.it('textfield focus', function(t) {

        mask = Ext.create('coon.comp.component.MessageMask', {
            buttons  : coon.comp.component.MessageMask.OKCANCEL,
            target   : panel,
            input    : true
        });

        mask.show();

        t.waitForMs(500, function() {
            t.expect(getTextField(mask.el.dom)).toBe(document.activeElement);
        });
    });
});