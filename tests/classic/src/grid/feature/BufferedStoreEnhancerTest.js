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

describe('conjoon.cn_comp.grid.feature.BufferedStoreEnhancerTest', function(t) {

    var grid;

    var getGrid = function(cfg) {

        cfg = cfg || {};

        var featureCfg = {
            ftype : 'cn_comp-gridfeature-bufferedstoreenhancer',
            id    : 'bufferedstoreenhancer'
        };

        if (cfg.updatedRowCls) {
            featureCfg.updatedRowCls = cfg.updatedRowCls;
        }

        return Ext.create('Ext.grid.Panel', {

            renderTo : document.body,

            width  : 510,
            height : 550,

            features : [featureCfg],

            multiColumnSort :  cfg.multiColumnSort ? cfg.multiColumnSort : false,

            store : {
                type : 'buffered',
                fields : ['id', 'testProp'],
                autoLoad : cfg.autoLoad ? cfg.autoLoad : undefined,
                sorters : cfg.sorters
                          ? cfg.sorters
                          : undefined,
                proxy : {
                    type : 'rest',
                    url  : 'cn_comp/fixtures/BufferedStoreEnhancerItems',
                    reader : {
                        type         : 'json',
                        rootProperty : 'data'
                    }
                    }
            },


            columns : [{
                text      : 'id',
                dataIndex : 'id',
                flex      : 1
            }, {
                text      : 'subject',
                dataIndex : 'subject',
                flex      : 1
            }, {
                text      : 'date',
                dataIndex : 'date',
                flex      : 1
            }, {
                text      : 'from',
                dataIndex : 'from',
                flex      : 1
            }, {
                text      : 'testProp',
                dataIndex : 'testProp',
                flex      : 1
            }]

        });


    };




// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.requireOk('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', function() {
    t.requireOk('conjoon.cn_comp.fixtures.sim.ItemSim', function(){


        t.it('BufferedStoreEnhancer will not work with multiColumnSort', function(t) {

            var exc, e, grid;

            try {
                grid = getGrid({autoLoad : false, multiColumnSort : true});
            } catch(e) {
                exc = e;
            }

            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toContain('does not work with');

        }); //^^


        t.it('cfg updatedRowCls', function(t) {

            var grid    = getGrid({autoLoad : false}),
                feature = grid.view.getFeature('bufferedstoreenhancer');

            t.expect(feature.updatedRowCls).toBe(
                'cn_comp-bufferedstoreenhancer-updatedrow');

            grid.destroy();

            grid    = getGrid({autoLoad : false, updatedRowCls : 'foo'});
            feature = grid.view.getFeature('bufferedstoreenhancer');

            t.expect(feature.updatedRowCls).toBe('foo');

            grid.destroy();
            grid = null;
        }); //^^


        t.it('onStoreUpdate() is registered and called', function(t) {
            t.methodIsCalledNTimes('onStoreUpdate', 'conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', 1);

            var grid    = getGrid({autoLoad : true}),
                store   = grid.getStore(),
                feature = grid.view.getFeature('bufferedstoreenhancer');

            t.waitForMs(750, function() {
                store.getAt(0).set('testProp', 2);
                store.getAt(0).commit();
                grid.destroy();
                grid = null;
            });
        }); // ^^


        t.it('onBeforeStorePrefetch() is registered and called', function(t) {
            t.methodIsCalled('onBeforeStorePrefetch', 'conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', 1);

            var grid    = getGrid({
                    autoLoad : true
                }),
                store   = grid.getStore(),
                feature = grid.view.getFeature('bufferedstoreenhancer');


            t.waitForMs(750, function() {
                grid.destroy();
                grid = null;
            });
        }); // ^^


        t.it('unbindStore()', function(t) {
            t.methodIsntCalled('onStoreUpdate', 'conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', 1);
            t.methodIsCalledNTimes('onBeforeStorePrefetch', 'conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', 11);

            var grid    = getGrid(),
                store   = grid.getStore(),
                feature = grid.view.getFeature('bufferedstoreenhancer');

            store.load();

            t.waitForMs(750, function() {

                grid.unbindStore();

                store.getAt(0).set('testProp', 9724224723);
                store.getAt(0).commit();

                store.reload();
                t.waitForMs(750, function() {


                    grid.destroy();
                    grid = null;
                });


            });
        }); // ^^


        t.it('updating a field which is not part of a sorter should NOT ADD to prunePageSet', function(t) {

            var grid = getGrid({
                    autoLoad : true
                }),
                store   = grid.getStore(),
                feature = grid.view.getFeature('bufferedstoreenhancer');

            t.waitForMs(750, function() {

                store.getAt(0).set('testProp', 9724224723);
                store.getAt(0).commit();

                t.expect(feature.prunePageSet).toBe(null);

                grid.destroy();
                grid = null;
            });
        }); // ^^


        t.it('updating a field which is part of a sorter and in the rendered view should NOT ADD to prunePageSet', function(t) {

            var grid = getGrid({
                    autoLoad : true,
                    sorters : [{
                        property  : 'testProp',
                        direction : 'ASC'
                    }]
                }),
                store   = grid.getStore(),
                feature = grid.view.getFeature('bufferedstoreenhancer');

            t.waitForMs(750, function() {

                store.getAt(0).set({subject : 'foo', 'testProp' : 5.5});
                store.getAt(0).commit();

                t.expect(feature.prunePageSet).toBe(null);

                grid.destroy();
                grid = null;
            });
        }); // ^^


        t.it('updating a field should add updatedRowCls to the row representing the updated record ', function(t) {

            var grid = getGrid({
                    autoLoad : true,
                    sorters  : [{
                        property  : 'testProp',
                        direction : 'DESC'
                    }]
                }),
                view    = grid.view,
                store   = grid.getStore(),
                feature = view.getFeature('bufferedstoreenhancer'),
                row;

            t.waitForMs(750, function() {

                store.getAt(0).set('testProp', 924224723);
                store.getAt(0).commit();
                row = Ext.dom.Query.selectNode(
                    'tr[class*=x-grid-row]', view.all.item(0, true)
                );
                t.expect(row.className).toContain(feature.updatedRowCls);

                store.getAt(10).set('testProp', 9998.5);
                store.getAt(10).commit();
                row = Ext.dom.Query.selectNode(
                    'tr[class*=x-grid-row]', view.all.item(10, true)
                );
                t.expect(row.className).toContain(feature.updatedRowCls);

                //grid.destroy();
                // grid = null;
            });
        }); // ^^


        t.it('updating a field of data currently in the view should prune surrounding pages', function(t) {

            var grid = getGrid({
                    autoLoad : true,
                    sorters  : [{
                        property  : 'testProp',
                        direction : 'ASC'
                    }]
                }),
                view    = grid.view,
                store   = grid.getStore(),
                pageMap = store.getData(),
                pages   = pageMap.map,
                countPages = function() {
                    var length = 0, i;
                    for (i in pages) {
                        length++;
                    }

                    return length;
                },
                feature = view.getFeature('bufferedstoreenhancer'),
                row, recToUpdate, length = 0, start, end;

            t.waitForMs(750, function() {

                t.expect(pages[1]).toBeDefined();

                t.expect(countPages()).toBe(11);
                recToUpdate = pages[5].value[9];

                // scroll to the record
                grid.ensureVisible(recToUpdate);

                recToUpdate.set('testProp', new Date());
                recToUpdate.commit();

                t.expect(countPages()).not.toBe(11);
                t.expect(pages[1]).not.toBeDefined();
                t.expect(pages[5]).toBeDefined();

                start = view.all.startIndex;
                end   = view.all.endIndex;

                for (var i = start; i < end; i++) {
                    t.expect(store.getAt(i)).toBeDefined();
                }

                grid.destroy();
                grid = null;

            });
        }); // ^^


        t.it('updating a field of data NOT in the view should prune surrounding pages of rendered view', function(t) {

            var grid = getGrid({
                    autoLoad : true,
                    sorters  : [{
                        property  : 'testProp',
                        direction : 'ASC'
                    }]
                }),
                view    = grid.view,
                store   = grid.getStore(),
                pageMap = store.getData(),
                pages   = pageMap.map,
                countPages = function() {
                    var length = 0, i;
                    for (i in pages) {
                        length++;
                    }

                    return length;
                },
                feature = view.getFeature('bufferedstoreenhancer'),
                row, recToUpdate, length = 0, start, end;

            t.waitForMs(750, function() {

                t.expect(pages[1]).toBeDefined();

                t.expect(countPages()).toBe(11);
                recToUpdate = pages[1].value[0];

                // scroll to ANOTHER record
                grid.ensureVisible(pages[5].value[9]);

                recToUpdate.set('testProp', new Date());
                recToUpdate.commit();

                t.expect(countPages()).not.toBe(11);
                t.expect(pages[1]).not.toBeDefined();
                t.expect(pages[5]).toBeDefined();

                start = view.all.startIndex;
                end   = view.all.endIndex;

                for (var i = start; i < end; i++) {
                    t.expect(store.getAt(i)).toBeDefined();
                }

                grid.destroy();
                grid = null;

            });
        }); // ^^


        t.it('updating a field in the view should re-sort in the remaining pages which are not getting pruned', function(t) {

            var grid = getGrid({
                    autoLoad : true,
                    sorters  : [{
                        property  : 'testProp',
                        direction : 'ASC'
                    }]
                }),
                view    = grid.view,
                store   = grid.getStore(),
                pageMap = store.getData(),
                pages   = pageMap.map,
                countPages = function() {
                    var length = 0, i;
                    for (i in pages) {
                        length++;
                    }

                    return length;
                },
                feature = view.getFeature('bufferedstoreenhancer'),
                row, recToUpdate, length = 0, start, end,
                siblingLeftId, siblingRightId;

            t.waitForMs(750, function() {

                t.expect(pages[1]).toBeDefined();

                t.expect(countPages()).toBe(11);
                siblingLeftId  = pages[5].value[8].getId();
                recToUpdate    = pages[5].value[9];
                siblingRightId = pages[5].value[10].getId();

                // scroll to ANOTHER record
                grid.ensureVisible(pages[5].value[9]);

                recToUpdate.set('testProp', 107.5)
                recToUpdate.commit();

                t.expect(pages[5].value[8].get('id')).toBe(recToUpdate.get('id'));
                t.expect(pages[5].value[9].get('id')).toBe(siblingLeftId);
                t.expect(pages[5].value[10].get('id')).toBe(siblingRightId);

                start = view.all.startIndex;
                end   = view.all.endIndex;

                for (var i = start; i < end; i++) {
                    t.expect(store.getAt(i)).toBeDefined();
                }

                grid.destroy();
                grid = null;

            });

        }); // ^^


        t.it('updating a field in the view should remove it out of pages which are not getting pruned and shift data from sibling pages', function(t) {
        }); // ^^


    })}) // EO requireOk




});