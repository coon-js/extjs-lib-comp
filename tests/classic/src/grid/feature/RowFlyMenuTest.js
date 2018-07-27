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

describe('conjoon.cn_comp.grid.feature.RowFlyMenuTest', function(t) {

    var grid;

    var getGrid = function(disabled) {

        return Ext.create('Ext.grid.Panel', {

            renderTo : document.body,

            width  : 510,
            height : 200,

            features : [{
                disabled           : !!disabled,
                ftype              : 'cn_comp-gridfeature-rowflymenu',
                id                 : 'rowflymenu',
                items : [{cls : 'foo', title : 'foobar'}, {html : 'bar'}]
            }],

            store : {
                fields : ['isRead', 'subject', 'to'],
                data   : [{
                    isRead : false, subject : 'Subject 1', to : 'to 1'
                }, {
                    isRead : true, subject : 'Subject 2', to : 'to 2'
                }, {
                    isRead : false, subject : 'Subject 3', to : 'to 3'
                }]
            },

            columns : [{
                text      : 'Read',
                dataIndex : 'isRead',
                flex      : 1
            }, {
                text      : 'Subject',
                dataIndex : 'subject',
                flex      : 1
            }, {
                text      : 'To',
                dataIndex : 'to',
                visible   : false
            }]

        });


    };




// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.requireOk('conjoon.cn_comp.grid.feature.RowFlyMenu', function() {


        t.it('test class and configuration', function(t) {
            let feature = Ext.create('conjoon.cn_comp.grid.feature.RowFlyMenu');

            t.isInstanceOf(feature, 'conjoon.cn_comp.grid.feature.RowFlyMenu');

            t.expect(feature.alias).toContain('feature.cn_comp-gridfeature-rowflymenu');

            t.expect(feature.cls).toContain('cn_comp-rowflymenu');
            t.expect(feature.alignTo).toBe('tr-tr');

            let at = ['tr-tr', [10, 10]];
            feature = Ext.create('conjoon.cn_comp.grid.feature.RowFlyMenu', {
                alignTo : at
            });

            t.expect(feature.alignTo).toEqual(at);

        });


        t.it('processItems() / idToActionMap', function(t) {

            let grid    = getGrid(false),
                feature = grid.view.getFeature('rowflymenu'),
                items   = [{cls : 'foo', title : 'foobar', id : 'meh', action : 'fooaction'}, {id : '3e', html : 'bar', action : 'baraction'}, {tag : 'span'}];

            let pis = feature.processItems(items);

            t.expect(pis[2].id).toBeTruthy();

            t.expect(pis).toEqual([{
                tag   : 'div',
                cls   : 'item foo',
                title : 'foobar',
                id    : 'meh'
            }, {
                tag   : 'div',
                cls   : 'item',
                html  : 'bar',
                id    : '3e'
            }, {
                tag : 'span',
                cls : 'item',
                id  : pis[2].id
            }]);

            t.expect(feature.idToActionMap['meh']).toBe('fooaction');
            t.expect(feature.idToActionMap['3e']).toBe('baraction');
            t.expect(feature.idToActionMap['pis[2].id']).toBeUndefined();


            grid.destroy();
        });


        t.it('buildMenu()', function(t) {

            let grid    = getGrid(false),
                feature = grid.view.getFeature('rowflymenu'),
                items   = [{cls : 'foo', title : 'foobar'}, {html : 'bar'}, {tag : 'span'}];

            t.isCalledNTimes('processItems', feature, 1);

            t.isInstanceOf(feature.buildMenu(items), 'Ext.dom.Element');

            t.expect(feature.menu.dom.parentNode).toBeFalsy();

            grid.destroy();
        });


        t.it("installListeners()", function(t) {

            let grid    = getGrid(false),
                feature = grid.view.getFeature('rowflymenu');

            let ENTER = 0, LEAVE = 0;
            feature.onItemMouseEnter = function() {
                ENTER++;
            };

            feature.onItemMouseLeave = function() {
                LEAVE++;
            };

            let tGrid = Ext.create({xtype : 'grid'});

            feature.installListeners(tGrid);

            tGrid.fireEvent('itemmouseenter');
            tGrid.fireEvent('itemmouseleave');

            t.expect(ENTER).toBe(1);
            t.expect(LEAVE).toBe(1);

            grid.destroy();
            tGrid.destroy();
        });


        t.it("onItemMouseEnter() / onItemMouseLeave()", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});

            t.expect(feature.currentRecord).toBe(rec);
            t.expect(menu.dom.parentNode).toBe(targetRow);

            feature.onItemMouseLeave(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(feature.currentRecord).toBe(null);
            t.expect(menu.dom.parentNode).toBe(null);

            grid.destroy();
        });


        t.it("onItemMouseEnter() / onItemMouseLeave() - feature disabled", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0);

            feature.disable();

            feature.onItemMouseEnter(null, {id : 1}, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(feature.currentRecord).toBe(null);
            t.expect(menu.dom.parentNode).toBe(null);

            feature.onItemMouseLeave(null, {id : 1}, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(feature.currentRecord).toBe(null);
            t.expect(menu.dom.parentNode).toBe(null);

            grid.destroy();
        });


        t.it("onItemMouseEnter() / onItemMouseLeave() - feature disabled during runtime", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(feature.currentRecord).toBe(rec);
            feature.disable();

            t.expect(feature.currentRecord).toBe(null);
            t.expect(menu.dom.parentNode).toBe(null);

            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});

            t.expect(menu.dom.parentNode).toBe(null);
            t.expect(feature.currentRecord).toBe(null);

            grid.destroy();
        });


        t.it('onMenuClick() - installed', function(t) {

            let feature = Ext.create('conjoon.cn_comp.grid.feature.RowFlyMenu', {
                items : []
            });

            let CLICKED = 0;

            feature.onMenuClick = function() {
                CLICKED++;
            }

            feature.init(Ext.create({xtype : 'grid'}));

            t.expect(CLICKED).toBe(0);

            feature.menu.fireEvent('tap');

            t.expect(CLICKED).toBe(1);

        });


        t.it('onMenuClick()', function(t) {

            let feature = Ext.create('conjoon.cn_comp.grid.feature.RowFlyMenu', {
                items : []
            });

            let CLICKED = {},
                evt     = {stopEvent : Ext.emptyFn};

            feature.idToActionMap = {
                'a' : 'foo',
                'b' : 'bar'
            };

            feature.on('itemclick', function(feature, item, action, record) {
                CLICKED[action] = record;
            });

            let rec1 = {id : 1}, rec2 = {id : 2}, rec3 = {id : 3};
            feature.currentRecord = rec1;
            feature.onMenuClick(evt, {id : 'a'});
            feature.currentRecord = rec2;
            feature.onMenuClick(evt, {id : 'b'});
            feature.currentRecord = rec3;
            feature.onMenuClick(evt, {id : 'c'});


            t.expect(CLICKED).toEqual({
                foo : rec1,
                bar : rec2
            });
        });


        t.it('destroy()', function(t) {

            let grid    = getGrid(false),
                feature = grid.view.getFeature('rowflymenu');

            let ENTER = 0, LEAVE = 0;
            feature.onItemMouseEnter = function() {
                ENTER++;
            };

            feature.onItemMouseLeave = function() {
                LEAVE++;
            };
            t.expect(feature.menu).not.toBe(null);

            t.isCalledNTimes('destroy', feature.menu, 1);

            feature.destroy();

            t.expect(feature.menu).toBe(null);

            grid.fireEvent('itemmouseenter');
            grid.fireEvent('itemmouseleave');

            t.expect(ENTER).toBe(0);
            t.expect(LEAVE).toBe(0);

            grid.destroy();
        });


        t.it("onItemMouseEnter() - beforemenushow", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            let CALLED = 0;

            feature.on('beforemenushow', function() {
                CALLED++;
            });

            t.expect(CALLED).toBe(0);
            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(menu.dom.parentNode).toBe(targetRow);
            t.expect(CALLED).toBe(1);


            grid.destroy();
        });


        t.it("onItemMouseEnter() - beforemenushow false", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(menu.dom.parentNode).toBe(targetRow);

            feature.onItemMouseLeave(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(menu.dom.parentNode).toBe(null);

            feature.on('beforemenushow', function() {
                return false;
            });

            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(menu.dom.parentNode).toBe(null);


            grid.destroy();
        });


        t.it("skipGarbageCollection should be set to \"true\"", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            t.expect(menu.skipGarbageCollection).toBe(true);
            grid.destroy();
        });

        t.it("detachMenuAndUnset()", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            feature.onItemMouseEnter(null, rec, targetRow, 0, {stopEvent : Ext.emptyFn});
            t.expect(menu.dom.parentNode).toBe(targetRow);
            t.expect(feature.currentRecord).toBe(rec);
            feature.detachMenuAndUnset();
            t.expect(menu.dom.parentNode).toBe(null);
            t.expect(feature.currentRecord).toBe(null);
            grid.destroy();
        });


        t.it("grid view refresh - detachMenuAndUnset is called", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            t.isCalled('detachMenuAndUnset', feature);
            grid.view.refresh();
            grid.destroy();
        });



});});