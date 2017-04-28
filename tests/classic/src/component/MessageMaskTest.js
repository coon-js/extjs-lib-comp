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

describe('conjoon.cn_comp.container.MessageMaskTest', function(t) {

    var panel,
        mask;

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
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });

        t.expect(conjoon.cn_comp.component.MessageMask.YESNO).toBeDefined();
        t.expect(conjoon.cn_comp.component.MessageMask.QUESTION).toBeDefined();

        t.isInstanceOf(mask, 'Ext.LoadMask');

        t.expect(mask.cls).toContain('cn_comp-messagemask');

        t.expect(mask.icon).toBeUndefined();
        t.expect(mask.msg).toBeUndefined();
        t.expect(mask.callback).toBeUndefined();
        t.expect(mask.scope).toBeUndefined();

        t.expect(mask.buttonIds[0]).toBe('yes');
        t.expect(mask.buttonIds[1]).toBe('no');

        t.expect(mask.buttonText).toEqual({
            yes : 'Yes', no : 'No'
        });
    });


    t.it('default dom nodes', function(t) {

        var nodes, ids;

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel,
            title  : 'foo'
        });

        mask.show();

        nodes = Ext.dom.Query.select('span[role=button]', mask.el.dom);

        t.expect(nodes.length).toBe(2);

        ids = [nodes[0].id, nodes[1].id];

        t.expect(ids).toContain(mask.getId() + '-' + 'yes');
        t.expect(ids).toContain(mask.getId() + '-' + 'no');

    });


    t.it('constructor()', function(t) {
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel,
            title  : 'foo'
        });

        t.expect(mask.title).toBeUndefined();
        t.expect(mask.msg).toBe('foo');
    });


    t.it('initRenderData()', function(t) {
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target      : panel,
            buttonText  : {yes : 'foo', no : 'bar'},
            message     : 'snafu',
            icon        : 'barfoo'
        }),
        result = mask.initRenderData();

        t.expect(result.glyphCls).toBe('barfoo');
        t.expect(result.message).toBe('snafu');
        t.expect(result.yes).toEqual('foo');
        t.expect(result.no).toEqual('bar');

    });


    t.it('afterRender()', function(t) {

        t.isCalledOnce('onClick', conjoon.cn_comp.component.MessageMask.prototype);

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
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

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
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
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });

        t.expect(exc).toBeUndefined();
        try{mask.getButtonIdForIndex(5);}catch(e){exc = e;}
        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("no value found");

        t.expect(mask.buttonIds.length).toBe(2);

        t.expect(res).toBeUndefined();
        res = mask.getButtonIdForIndex(0);
        t.expect(res).toBe('yes');

        res = mask.getButtonIdForIndex(1);
        t.expect(res).toBe('no');
    });


    t.it('onClick()', function(t) {

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('handleButtonClick',   mask);
        t.isCalledOnce('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'foo-yes', tagName : 'SPAN'});
    });


    t.it('onClick()', function(t) {

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('handleButtonClick',   mask);
        t.isCalledOnce('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'foo-no', tagName : 'span'});
    });


    t.it('onClick()', function(t) {

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });

        t.isntCalled('handleButtonClick', mask);
        t.isntCalled('getButtonIdForIndex', mask);

        mask.onClick(null, {id : 'dsd-yes', tagName : 'div'});
    });


    t.it('close()', function(t) {

        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });

        t.isCalledOnce('destroy', mask);

        mask.close();
    });


    t.it('bindStore()', function(t) {
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.bindStore).toBe(Ext.emptyFn);
    });


    t.it('getStoreListeners()', function(t) {
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.getStoreListeners).toBe(Ext.emptyFn);
    });


    t.it('onLoad()', function(t) {
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.onLoad).toBe(Ext.emptyFn);
    });


    t.it('onBeforeLoad()', function(t) {
        mask = Ext.create('conjoon.cn_comp.component.MessageMask', {
            target : panel
        });
        t.expect(mask.onBeforeLoad).toBe(Ext.emptyFn);
    });

});