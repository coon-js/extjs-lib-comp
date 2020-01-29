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

describe('coon.comp.grid.feature.RowFlyMenuTest', function(t) {

    var grid;

    var getGrid = function(disabled) {

        return Ext.create('Ext.grid.Panel', {

            renderTo : document.body,

            width  : 800,
            height : 600,

            features : [{
                disabled           : !!disabled,
                ftype              : 'cn_comp-gridfeature-rowflymenu',
                id                 : 'rowflymenu',
                items : [{cls : 'foo', title : 'foobar', html : 'foobar', id : 'rowflytestid'}, {html : 'bar'}]
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
                hidden    : true
            }]

        });


    };




// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.requireOk('coon.comp.grid.feature.RowFlyMenu', function() {


        t.it('test class and configuration', function(t) {
            let feature = Ext.create('coon.comp.grid.feature.RowFlyMenu');

            t.isInstanceOf(feature, 'coon.comp.grid.feature.RowFlyMenu');

            t.expect(feature.alias).toContain('feature.cn_comp-gridfeature-rowflymenu');

            t.expect(feature.cls).toContain('cn_comp-rowflymenu');
            t.expect(feature.alignTo).toBe('tr-tr');

            let at = ['tr-tr', [10, 10]];
            feature = Ext.create('coon.comp.grid.feature.RowFlyMenu', {
                alignTo : at
            });

            t.expect(feature.alignTo).toEqual(at);

            feature.destroy();
        });


        t.it('processItems() / idToActionMap', function(t) {

            let grid    = getGrid(false),
                feature = grid.view.getFeature('rowflymenu'),
                items   = [{cls : 'foo', title : 'foobar', id : 'meh', action : 'fooaction'}, {id : '3e', html : 'bar', action : 'baraction'}, {tag : 'span'}];

            let pis = feature.processItems(items);

            t.expect(pis[2].id).toBeTruthy();

            t.expect(pis).toEqual([{
                tag   : 'div',
                cls   : 'cn-item foo',
                title : 'foobar',
                id    : 'meh'
            }, {
                tag   : 'div',
                cls   : 'cn-item',
                html  : 'bar',
                id    : '3e'
            }, {
                tag : 'span',
                cls : 'cn-item',
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

            let feature = Ext.create('coon.comp.grid.feature.RowFlyMenu', {
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

            feature.destroy();
        });


        t.it('onMenuClick()', function(t) {

            let feature = Ext.create('coon.comp.grid.feature.RowFlyMenu', {
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

            feature.destroy();
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


        t.it("onMenuMouseOver() / onMenuMouseOut()", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};


            t.moveCursorTo(targetRow, function() {

                t.expect(menu.dom.parentNode).toBe(targetRow.parentNode.parentNode);

                let dom = document.getElementById('rowflytestid');

                t.moveCursorTo(menu.dom, function() {
                    t.expect(dom.className).not.toContain('cn-over');

                    t.moveCursorTo(dom, function() {

                        t.expect(dom.className).toContain('cn-over');

                        t.moveCursorTo(menu.dom, function () {
                            t.expect(dom.className).not.toContain('cn-over');

                            grid.destroy();
                        });
                    });
                });
            });
        });


        t.it("app-cn_mail#74", function(t) {

            let grid      = getGrid(false),
                feature   = grid.view.getFeature('rowflymenu'),
                menu      = feature.menu,
                targetRow = grid.view.getRow(0),
                rec       = {id : 1};

            // mouseover row
            t.moveCursorTo(targetRow, function() {

                t.expect(menu.dom.parentNode).toBe(targetRow.parentNode.parentNode);
                let dom = document.getElementById('rowflytestid');

                grid.getSelectionModel().select(grid.getStore().getAt(1));
                t.expect(grid.getSelection().length).toBe(1);

                // mouseover menu
                t.moveCursorTo(dom, function() {

                    t.expect(dom.className).toContain('cn-over');
                    grid.getSelectionModel().select(grid.getStore().getAt(0));
                    t.expect(grid.getSelection()[0]).not.toBe(grid.getStore().getAt(0));

                    // mouseout
                    t.moveCursorTo([0, 0], function() {

                        t.expect(dom.className).not.toContain('cn-over');

                        grid.getSelectionModel().select(grid.getStore().getAt(0));
                        t.expect(grid.getSelection()[0]).toBe(grid.getStore().getAt(0));

                        grid.getSelectionModel().deselectAll();

                        // mouseover row
                        t.moveCursorTo(targetRow, function() {

                            grid.getSelectionModel().select(grid.getStore().getAt(0));
                            t.expect(grid.getSelection()[0]).toBe(grid.getStore().getAt(0));

                            t.moveCursorTo(dom, function() {
                                t.expect(feature.menu.el.dom.parentNode).not.toBe(null);
                                grid.fireEvent('beforeitemkeydown', {}, dom);
                                t.expect(feature.menu.el.dom.parentNode).toBe(null);

                                grid.getSelectionModel().select(grid.getStore().getAt(0));
                                t.expect(grid.getSelection()[0]).toBe(grid.getStore().getAt(0));

                                grid.destroy();
                            });

                        })
                    });
                })
            }, null, [0, 0]);
        });



});});