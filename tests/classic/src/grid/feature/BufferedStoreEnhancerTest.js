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

    var createStore = function(cfg) {

            cfg = cfg || {};

            return Ext.create('Ext.data.BufferedStore', {

                type   : 'buffered',
                fields : ['id', 'testProp'],
                autoLoad : cfg.autoLoad ? cfg.autoLoad : undefined,
                sorters  : cfg.sorters
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
            });

        },
        getGrid = function(cfg) {

            cfg = cfg || {};

            var featureCfg = {
                ftype : 'cn_comp-gridfeature-bufferedstoreenhancer',
                id    : 'bufferedstoreenhancer'
            };

            return Ext.create('Ext.grid.Panel', {

                renderTo : document.body,

                width  : 510,
                height : 550,

                features : [featureCfg],

                multiColumnSort :  cfg.multiColumnSort ? cfg.multiColumnSort : false,

                store : createStore(cfg),


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
        },
        moveRecordTest = function(config, t) {

                var grid = getGrid({
                        autoLoad : true,
                        sorters  : [{
                            property : 'testProp',
                            dir      : 'ASC'
                        }]
                    }),
                    store          = grid.getStore(),
                    pageMap        = store.getData(),
                    map            = pageMap.map,
                    feature        = grid.view.getFeature('bufferedstoreenhancer'),
                    RecordPosition = conjoon.cn_core.data.pageMap.RecordPosition,
                    PageMapUtil    = conjoon.cn_core.data.pageMap.PageMapUtil,
                    SIGNAL = 0, REFRESHED = false,
                    from, to, FROM, TO;


                t.waitForMs(500, function() {

                    config.before && config.before.apply(null, [grid, t]);

                    from = RecordPosition.create(config.from);
                    to   = RecordPosition.create(config.to);

                    grid.on('cn_comp-bufferedstoreenhancer-recordmove', function(grid, record, from, to, refreshed) {
                        SIGNAL++;
                        REFRESHED = refreshed;
                        FROM = from;
                        TO = to;
                    });

                    config.additionalFn && config.additionalFn.apply(null, [grid, t]);

                    if (config.exception) {

                        var exc, e;
                        try {
                            feature.moveRecord(PageMapUtil.getRecordAt(from, pageMap), to);
                        } catch (e) {
                            exc = e;
                        }

                        t.expect(exc).toBeDefined();
                        t.expect(exc.msg).toBeDefined();
                        t.expect(exc.msg.toLowerCase()).toContain(config.exception.toLowerCase());

                    } else {
                        feature.moveRecord(PageMapUtil.getRecordAt(from, pageMap), to);

                        t.expect(SIGNAL).toBe(1);
                        t.expect(REFRESHED).toBe(config.REFRESHED);
                        t.expect(FROM.equalTo(from)).toBe(true);
                        t.expect(TO.equalTo(to)).toBe(true);
                    }

                    if (config.remove !== false) {
                        grid.destroy();
                        grid = null;
                    }

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


        t.it("associateSetup()", function(t) {

            var store   = Ext.create('Ext.data.Store'),
                SIGNAL  = 0,
                exc, e, oldLookup, store;

            store.isEmptyStore = true;

            feature = Ext.create('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer');
            t.expect(feature.associateSetup(store)).toBe(false);

            // exceptions
            feature = Ext.create('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer');
            try {feature.associateSetup(Ext.create('Ext.data.Store'));}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain('must be an instance of');
            exc = undefined;
            try {feature.associateSetup();}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain('must be an instance of');


            // indexLookup setting
            feature = Ext.create('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer');
            t.expect(feature.indexLookup).toBeFalsy();
            oldLookup = Ext.create('conjoon.cn_core.data.pageMap.IndexLookup', {
                pageMap : createStore().getData()
            });
            feature.indexLookup = oldLookup;
            t.isCalledNTimes('destroy', feature.indexLookup, 1);
            t.expect(feature.indexLookup).toBe(oldLookup);
            t.expect(feature.associateSetup(Ext.create('Ext.data.BufferedStore'))).toBe(true);
            t.expect(feature.indexLookup instanceof conjoon.cn_core.data.pageMap.IndexLookup).toBe(true);
            t.expect(feature.indexLookup).not.toBe(oldLookup);

            store = createStore();
            store.load();
            t.waitForMs(250, function() {

                // onStoreUpdate installed
                feature = Ext.create('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer');
                feature.onStoreUpdate = function() {
                    SIGNAL++;
                };
                t.expect(SIGNAL).toBe(0);
                t.expect(feature.associateSetup(store)).toBe(true);
                store.getAt(0).set('testProp', 't');
                store.getAt(0).commit();
                t.expect(SIGNAL).toBe(1);
                store.getAt(0).set('testProp', 'u');
                store.getAt(0).commit();
                t.expect(SIGNAL).toBe(2);
                SIGNAL = 0;
                t.expect(feature.associateSetup(store)).toBe(true);
                t.expect(feature.associateSetup(store)).toBe(true);
                store.getAt(1).set('testProp', 'fjfjjfu');
                store.getAt(1).commit();
                t.expect(SIGNAL).toBe(1);

                store.destroy();
                store = null;
            });
        });


        t.it("onGridReconfigure() - callback", function(t) {

            var grid, feature, store;

            t.isCalledNTimes(
                'onGridReconfigure',
                conjoon.cn_comp.grid.feature.BufferedStoreEnhancer.prototype,
                1
            );

            grid    = getGrid({autoLoad : true});
            feature = grid.view.getFeature('bufferedstoreenhancer');
            store   = createStore(),
            store2  = createStore;


            grid.reconfigure(store);


            grid.destroy();
            grid = null;
        });


        t.it("onGridReconfigure() - argument behavior", function(t) {

            var grid, feature, store;

            grid    = getGrid({autoLoad : true});
            feature = grid.view.getFeature('bufferedstoreenhancer');
            store   = createStore(),
            store2  = createStore();


            t.isCalledNTimes('associateSetup', feature, 3)
            feature.onGridReconfigure(grid, store, null, null);
            feature.onGridReconfigure(grid, store2, null, store);
            feature.onGridReconfigure(grid, store, null, store2);
            // shouldnt trigger associate setup
            feature.onGridReconfigure(grid, store, null, store);
            feature.onGridReconfigure(grid);


            grid.destroy();
            grid = null;
        });


        t.it("getPageMap()", function(t) {

            var grid, feature, store;

            grid    = getGrid({autoLoad : true});
            feature = grid.view.getFeature('bufferedstoreenhancer');

            t.expect(feature.getPageMap()).toBe(grid.getStore().getData());

            grid.destroy();
            grid = null;
        });


        t.it("getCurrentViewRange()", function(t) {

            var grid           = getGrid({autoLoad : true}),
                feature        = grid.view.getFeature('bufferedstoreenhancer'),
                PageMapUtil    = conjoon.cn_core.data.pageMap.PageMapUtil;


            t.expect(feature.getCurrentViewRange()).toBe(null);

            t.waitForMs(500, function() {

                t.expect(
                    feature.getCurrentViewRange() instanceof
                        conjoon.cn_core.data.pageMap.IndexRange).toBe(true);

                t.expect(
                    feature.getCurrentViewRange().getStart().equalTo(
                        PageMapUtil.storeIndexToPosition(grid.view.all.startIndex, feature.getPageMap())
                    )).toBe(true);

                t.expect(
                    feature.getCurrentViewRange().getEnd().equalTo(
                        PageMapUtil.storeIndexToPosition(grid.view.all.endIndex, feature.getPageMap())
                    )).toBe(true);


                grid.destroy();
                grid = null;
            });


        });


        t.it("refreshView()", function(t) {

            var grid           = getGrid({autoLoad : true}),
                feature        = grid.view.getFeature('bufferedstoreenhancer'),
                RecordPosition = conjoon.cn_core.data.pageMap.RecordPosition,
                PageMapUtil    = conjoon.cn_core.data.pageMap.PageMapUtil,
                viewRange, SIGNAL = 0;


            t.waitForMs(500, function() {

                grid.view.on('refresh', function(){SIGNAL++});

                t.expect(feature.refreshView(
                    RecordPosition.create(1, 0), RecordPosition.create(2,4)
                )).toBe(true);

                t.expect(SIGNAL).toBe(1);
                viewRange = feature.getCurrentViewRange();

                t.expect(feature.refreshView(
                    RecordPosition.create(viewRange.getEnd().getPage() + 1, 0),
                    RecordPosition.create(viewRange.getEnd().getPage() + 1, 4)
                )).toBe(false);
                t.expect(SIGNAL).toBe(1);

                grid.destroy();
                grid = null;
            });
        });


        t.it("moveRecord() - from visible, to visible", function(t) {
            moveRecordTest({
                from      : [1, 0],
                to        : [1, 8],
                REFRESHED : true
            }, t)
        });


        t.it("moveRecord() - from visible, to not visible", function(t) {
            moveRecordTest({
                from      : [1, 0],
                to        : [3, 24],
                REFRESHED : true,
                additionalFn : function(grid, t) {
                    t.expect(grid.view.all.startIndex).toBeGreaterThan(-1);
                    t.expect(grid.view.all.endIndex).toBeLessThan(55);
                }
            }, t)
        });


        t.it("moveRecord() - from not visible, to not visible", function(t) {
            moveRecordTest({
                from      : [3, 18],
                to        : [3, 24],
                REFRESHED : false,
                additionalFn : function(grid, t) {
                    t.expect(grid.view.all.startIndex).toBeGreaterThan(-1);
                    t.expect(grid.view.all.endIndex).toBeLessThan(55);
                }
            }, t)
        });


        t.it("moveRecord() - from and to not in same page range", function(t) {
            moveRecordTest({
                remove    : false,
                from      : [1, 18],
                to        : [3, 24],
                exception : "runtime exception",
                REFRESHED : false,
                before    : function(grid, t) {
                    grid.view.getFeature('bufferedstoreenhancer')
                        .getPageMap().removeAtKey(2);
                }
            }, t)
        });


        t.it("onStoreUpdate() - is called", function(t) {

            t.isCalledNTimes(
                'onStoreUpdate',
                conjoon.cn_comp.grid.feature.BufferedStoreEnhancer.prototype,
                1
            );
            var grid    = getGrid({autoLoad : true}),
                feature = grid.view.getFeature('bufferedstoreenhancer');

            t.waitForMs(500, function() {

                grid.getStore().getData().map[1].value[0].set('testProp', 800);
                grid.getStore().getData().map[1].value[0].commit();

                grid.destroy();
                grid = null;
            });
        });


        t.it("onStoreUpdate()", function(t) {

            var grid           = getGrid({autoLoad : true}),
                store          = grid.getStore(),
                feature        = grid.view.getFeature('bufferedstoreenhancer'),
                pageMap        = feature.getPageMap(),
                RecordPosition = conjoon.cn_core.data.pageMap.RecordPosition,
                PageMapUtil    = conjoon.cn_core.data.pageMap.PageMapUtil,
                rec;

            t.waitForMs(750, function() {

                rec = PageMapUtil.getRecordAt(RecordPosition.create(1, 0), pageMap);

                // no sorters
                t.expect(grid.getStore().getSorters().length).toBe(0);
                t.expect(feature.onStoreUpdate(store, rec)).toBe(false);

                // wrong sorter
                store.setSorters({property : 'subject', dir : 'ASC'});
                t.waitForMs(500, function() {
                    t.expect(grid.getStore().getSorters().length).toBe(1);
                    t.expect(grid.getStore().getSorters().getAt(0).getProperty()).toBe('subject');
                    rec.set('testProp', 1);
                    rec.commit();
                    t.expect(feature.onStoreUpdate(store, rec)).toBe(false);


                    // proper sorter
                    store.getSorters().clear()
                    store.setSorters({property : 'testProp', dir : 'ASC'});
                    t.waitForMs(500, function() {
                        t.expect(grid.getStore().getSorters().length).toBe(1);
                        t.expect(grid.getStore().getSorters().getAt(0).getProperty()).toBe('testProp');
                        rec = PageMapUtil.getRecordAt(RecordPosition.create(1, 0), pageMap);
                        rec.set('testProp', 2);
                        rec.commit();
                        t.expect(feature.onStoreUpdate(store, rec)).toBe(true);


                        // no insert index can be found
                        rec.set('testProp', 322552252);
                        rec.commit();
                        t.expect(feature.onStoreUpdate(store, rec)).toBe(false);

                        grid.destroy();
                        grid = null;
                    });

                });

            });
        });


})}) // EO requireOk




});