/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2017-2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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

describe("coon.comp.grid.feature.LivegridTest", function (t) {

    const TIMEOUT = 1250;

    Ext.define("MockModel", {
        extend : "Ext.data.Model",

        fields : [{
            name : "testProp",
            type : "int"
        }]
    });

    var createStore = function (cfg) {

            cfg = cfg || {};

            return Ext.create("Ext.data.BufferedStore", {

                model : "MockModel",

                type   : "buffered",
                fields : ["id", "testProp"],
                pageSize : 100,
                autoLoad : cfg.autoLoad ? cfg.autoLoad : undefined,
                sorters  : cfg.sorters
                    ? cfg.sorters
                    : undefined,
                proxy : {
                    type : "rest",
                    url  : "cn_comp/fixtures/Livegrid",
                    extraParams : cfg.extraParams || {},
                    reader : {
                        type         : "json",
                        rootProperty : "data"
                    }
                }
            });

        },
        getGrid = function (cfg) {

            cfg = cfg || {};

            var featureCfg = {
                ftype : "cn_comp-gridfeature-livegrid",
                id    : "livegrid"
            };


            return Ext.create("Ext.grid.Panel", {

                renderTo : document.body,

                width  : 510,
                height : 550,

                features : [featureCfg],

                multiColumnSort :  cfg.multiColumnSort ? cfg.multiColumnSort : false,

                store : createStore(cfg),


                columns : [{
                    text      : "id",
                    dataIndex : "id",
                    flex      : 1
                }, {
                    text      : "subject",
                    dataIndex : "subject",
                    flex      : 1
                }, {
                    text      : "date",
                    dataIndex : "date",
                    flex      : 1
                }, {
                    text      : "from",
                    dataIndex : "from",
                    flex      : 1
                }, {
                    text      : "testProp",
                    dataIndex : "testProp",
                    flex      : 1
                }]

            });
        },
        createLivegrid = function () {
            return Ext.create("coon.comp.grid.feature.Livegrid");
        };


    // +----------------------------------------------------------------------------
    // |                    =~. Tests .~=
    // +----------------------------------------------------------------------------

    t.requireOk("coon.comp.grid.feature.Livegrid", function () {
        t.requireOk("coon.comp.fixtures.sim.ItemSim", function (){


            t.it("Livegrid will not work with multiColumnSort", function (t) {

                var exc;

                try {
                    getGrid({autoLoad : false, multiColumnSort : true});
                } catch(e) {
                    exc = e;
                }

                t.expect(exc).toBeDefined();
                t.expect(exc.msg).toContain("does not work with");

            });

            t.it("setup()", function (t) {

                var store   = Ext.create("Ext.data.Store"),
                    SIGNAL  = 0, BEFOREPREFETCH = 0, CACHEMISS = 0, PAGEADD = 0,
                    PAGEREMOVE = 0, PAGEREMOVEVETO = 0,
                    exc, oldPageMapFeeder;

                store.isEmptyStore = true;

                let feature = createLivegrid();
                t.expect(feature.isConfigured()).toBe(false);
                t.expect(feature.configure(store)).toBe(false);

                // exceptions
                feature = createLivegrid();
                try {feature.configure(Ext.create("Ext.data.Store"));}catch(e){exc=e;}
                t.expect(exc).toBeDefined();
                t.expect(exc.msg.toLowerCase()).toContain("must be an instance of");
                exc = undefined;
                try {feature.configure();}catch(e){exc=e;}
                t.expect(exc).toBeDefined();
                t.expect(exc.msg.toLowerCase()).toContain("must be an instance of");


                // pageMapFeeder setting
                feature = createLivegrid();
                t.expect(feature.pageMapFeeder).toBeFalsy();
                oldPageMapFeeder = Ext.create("coon.core.data.pageMap.PageMapFeeder", {
                    pageMap : createStore().getData()
                });
                feature.pageMapFeeder = oldPageMapFeeder;
                t.isCalledNTimes("destroy", feature.pageMapFeeder, 1);
                t.expect(feature.pageMapFeeder).toBe(oldPageMapFeeder);
                t.expect(feature.configure(Ext.create("Ext.data.BufferedStore"))).toBe(true);
                t.expect(feature.isConfigured()).toBe(true);
                t.expect(feature.pageMapFeeder instanceof coon.core.data.pageMap.PageMapFeeder).toBe(true);
                t.expect(feature.pageMapFeeder).not.toBe(oldPageMapFeeder);

                store = createStore();
                store.load();
                t.waitForMs(250, function () {

                    // onStoreUpdate installed
                    feature = createLivegrid();
                    feature.onCacheMiss = function () {
                        CACHEMISS++;
                    };
                    feature.onBeforePrefetch = function () {
                        BEFOREPREFETCH++;
                    };
                    feature.onPageAdd = function () {
                        PAGEADD++;
                    };
                    feature.onStoreUpdate = function () {
                        SIGNAL++;
                    };

                    feature.onPageRemove = function () {
                        PAGEREMOVE++;
                    };

                    feature.onPageRemoveVeto = function () {
                        PAGEREMOVEVETO++;
                    };


                    t.expect(SIGNAL).toBe(0);
                    t.expect(feature.configure(store)).toBe(true);
                    store.getAt(0).set("testProp", "t");
                    store.getAt(0).commit();
                    t.expect(SIGNAL).toBe(1);

                    store.fireEvent("cachemiss");
                    store.fireEvent("beforeprefetch");
                    store.fireEvent("pageadd");
                    store.fireEvent("pageremove");
                    feature.pageMapFeeder.fireEvent("cn_core-pagemapfeeder-pageremoveveto");
                    t.expect(BEFOREPREFETCH).toBe(1);
                    t.expect(CACHEMISS).toBe(1);
                    t.expect(PAGEADD).toBe(1);
                    t.expect(PAGEREMOVE).toBe(1);
                    t.expect(PAGEREMOVEVETO).toBe(1);

                    store.getAt(0).set("testProp", "u");
                    store.getAt(0).commit();
                    t.expect(SIGNAL).toBe(2);

                    store.fireEvent("cachemiss");
                    store.fireEvent("beforeprefetch");
                    store.fireEvent("pageadd");
                    t.expect(BEFOREPREFETCH).toBe(2);
                    t.expect(CACHEMISS).toBe(2);
                    t.expect(PAGEADD).toBe(2);

                    CACHEMISS = 0;
                    BEFOREPREFETCH = 0;
                    PAGEADD = 0;
                    SIGNAL = 0;
                    t.expect(feature.configure(store)).toBe(true);
                    t.expect(feature.configure(store)).toBe(true);
                    store.getAt(1).set("testProp", "fjfjjfu");
                    store.getAt(1).commit();
                    t.expect(SIGNAL).toBe(1);

                    store.fireEvent("cachemiss");
                    store.fireEvent("beforeprefetch");
                    store.fireEvent("pageadd");
                    t.expect(BEFOREPREFETCH).toBe(1);
                    t.expect(CACHEMISS).toBe(1);
                    t.expect(PAGEADD).toBe(1);

                    store.destroy();
                    store = null;
                });
            });


            t.it("scroller registered", function (t) {

                let grid, feature;
                t.isCalled("onScroll", coon.comp.grid.feature.Livegrid.prototype);
                grid    = getGrid({autoLoad : true});
                feature = grid.view.getFeature("livegrid");

                t.waitForMs(750, function () {
                    feature.grid.view.getScrollable().scrollTo(0, 4200);
                    t.waitForMs(250, function () {
                        grid.destroy();
                        grid = null;
                    });

                });
            });


            t.it("onGridReconfigure() - callback", function (t) {

                var grid, store;

                t.isCalledNTimes(
                    "onGridReconfigure",
                    coon.comp.grid.feature.Livegrid.prototype,
                    1
                );

                grid    = getGrid({autoLoad : true});
                store   = createStore();

                grid.reconfigure(store);


                grid.destroy();
                grid = null;
            });


            t.it("onGridReconfigure() - argument behavior", function (t) {

                var grid, feature, store, store2;

                grid    = getGrid({autoLoad : true});
                feature = grid.view.getFeature("livegrid");
                store   = createStore(),
                store2  = createStore();


                t.isCalledNTimes("configure", feature, 3);
                feature.onGridReconfigure(grid, store, null, null);
                feature.onGridReconfigure(grid, store2, null, store);
                feature.onGridReconfigure(grid, store, null, store2);
                // shouldnt trigger associate setup
                feature.onGridReconfigure(grid, store, null, store);
                feature.onGridReconfigure(grid);


                grid.destroy();
                grid = null;
            });


            t.it("getPageMap()", function (t) {

                var grid, feature;

                grid    = getGrid({autoLoad : true});
                feature = grid.view.getFeature("livegrid");

                t.expect(feature.getPageMap()).toBe(grid.getStore().getData());
                t.expect(feature.pageMapFeeder.getPageMap()).toBe(feature.getPageMap()
                );

                grid.destroy();
                grid = null;
            });


            t.it("getCurrentViewRange()", function (t) {

                var grid           = getGrid({autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil;


                t.expect(feature.getCurrentViewRange()).toBe(null);

                t.waitForMs(500, function () {

                    t.expect(
                        feature.getCurrentViewRange() instanceof
                        coon.core.data.pageMap.IndexRange).toBe(true);

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


            t.it("refreshView()", function (t) {

                var grid           = getGrid({autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    RecordPosition = coon.core.data.pageMap.RecordPosition,
                    viewRange, SIGNAL = 0;


                t.waitForMs(500, function () {

                    grid.view.on("refresh", function (){SIGNAL++;});

                    t.expect(feature.refreshView(
                        [RecordPosition.create(1, 0), RecordPosition.create(2,4)]
                    )).toBe(true);

                    t.expect(SIGNAL).toBe(1);
                    viewRange = feature.getCurrentViewRange();

                    t.expect(feature.refreshView(
                        [RecordPosition.create(viewRange.getEnd().getPage() + 1, 0),
                            RecordPosition.create(viewRange.getEnd().getPage() + 1, 4)]
                    )).toBe(false);
                    t.expect(SIGNAL).toBe(1);

                    grid.destroy();
                    grid = null;
                });
            });


            t.it("onStoreUpdate() - is called", function (t) {

                t.isCalledNTimes(
                    "onStoreUpdate",
                    coon.comp.grid.feature.Livegrid.prototype,
                    1
                );
                var grid    = getGrid({autoLoad : true});

                t.waitForMs(500, function () {

                    grid.getStore().getData().map[1].value[0].set("testProp", 800);
                    grid.getStore().getData().map[1].value[0].commit();

                    grid.destroy();
                    grid = null;
                });
            });


            t.it("onStoreUpdate()", function (t) {

                var grid           = getGrid({autoLoad : true}),
                    store          = grid.getStore(),
                    feature        = grid.view.getFeature("livegrid"),
                    pageMap        = feature.getPageMap(),
                    RecordPosition = coon.core.data.pageMap.RecordPosition,
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil,
                    rec;

                t.waitForMs(750, function () {

                    rec = PageMapUtil.getRecordAt(RecordPosition.create(1, 0), pageMap);

                    // no sorters
                    t.expect(grid.getStore().getSorters().length).toBe(0);
                    t.expect(feature.onStoreUpdate(store, rec)).toBe(false);

                    // wrong sorter
                    store.setSorters({property : "subject", dir : "ASC"});
                    t.waitForMs(500, function () {
                        t.expect(grid.getStore().getSorters().length).toBe(1);
                        t.expect(grid.getStore().getSorters().getAt(0).getProperty()).toBe("subject");

                        // trigger commit and check regarding previousValues
                        rec.commit();
                        t.expect(feature.onStoreUpdate(store, rec)).toBe(false);

                        rec.set("testProp", 1);
                        rec.commit();
                        t.expect(feature.onStoreUpdate(store, rec)).toBe(false);


                        // proper sorter
                        store.getSorters().clear();
                        store.setSorters({property : "testProp", dir : "ASC"});
                        t.waitForMs(500, function () {
                            t.expect(grid.getStore().getSorters().length).toBe(1);
                            t.expect(grid.getStore().getSorters().getAt(0).getProperty()).toBe("testProp");
                            rec = PageMapUtil.getRecordAt(RecordPosition.create(1, 0), pageMap);
                            rec.set("testProp", 2);
                            rec.commit();
                            t.expect(feature.onStoreUpdate(store, rec)).toBe(true);


                            // no insert index can be found
                            rec.set("testProp", 322552252);
                            rec.commit();
                            t.expect(feature.onStoreUpdate(store, rec)).toBe(false);

                            grid.destroy();
                            grid = null;
                        });

                    });

                });
            });


            t.it("saveFocusState()", function (t) {

                let grid    = getGrid({autoLoad : true}),
                    feature = grid.view.getFeature("livegrid"),
                    res;

                t.waitForMs(750, function () {

                    t.isCalledNTimes("saveFocusState", Ext.view.Table.prototype, 1);

                    res = feature.saveFocusState.apply(grid.view);
                    t.expect(res).toBeTruthy();
                    t.expect(Ext.isFunction(res));

                    grid.destroy();
                    grid = null;

                });

            });


            t.it("swapSaveFocusState()", function (t) {

                let grid    = getGrid({autoLoad : true}),
                    feature = grid.view.getFeature("livegrid");

                t.isCalledNTimes("saveFocusState", coon.comp.grid.feature.Livegrid.prototype, 1);

                t.waitForMs(750, function () {

                    t.expect(feature.swapSaveFocusState()).toBe(true);
                    t.expect(grid.view.saveFocusState).toBe(
                        coon.comp.grid.feature.Livegrid.prototype.saveFocusState
                    );

                    t.expect(Ext.isFunction(grid.view.saveFocusState())).toBe(true);

                    grid.destroy();
                    grid = null;

                });
            });


            t.it("onBeforePrefetch()", function (t) {

                let grid    = getGrid({autoLoad : true}),
                    store   = grid.getStore(),
                    feature = grid.view.getFeature("livegrid"),
                    PAGE, operation = {
                        getPage : function () {
                            return PAGE;
                        }
                    };


                t.waitForMs(1250, function () {

                    feature.pageMapFeeder.swapMapToFeed(2, 1);

                    t.expect(feature.pageMapFeeder.getFeedAt(2)).toBeTruthy();

                    PAGE = 2;

                    t.expect(feature.onBeforePrefetch(store, operation)).toBe(false);

                    PAGE = 10000;
                    t.expect(feature.onBeforePrefetch(store, operation)).toBe(true);

                    grid.destroy();
                    grid = null;

                });
            });


            t.it("onPageAdd()", function (t) {

                let grid    = getGrid({autoLoad : true}),
                    feature = grid.view.getFeature("livegrid"),
                    pageMap = feature.getPageMap();


                t.waitForMs(1250, function () {

                    feature.onPageAdd(pageMap, 1);
                    feature.pageMapFeeder.swapMapToFeed(3, 2);
                    t.expect(feature.pageMapFeeder.getFeedAt(3)).toBeTruthy();

                    feature.onPageAdd(pageMap, 3);
                    t.expect(feature.pageMapFeeder.getFeedAt(3)).toBe(null);

                    grid.destroy();
                    grid = null;

                });
            });


            t.it("onCacheMiss()", function (t) {

                let grid    = getGrid({autoLoad : true}),
                    store   = grid.getStore(),
                    feature = grid.view.getFeature("livegrid"),
                    pageMap = feature.getPageMap();


                t.waitForMs(1250, function () {

                    feature.pageMapFeeder.swapMapToFeed(3, 2);
                    t.expect(feature.pageMapFeeder.getFeedAt(3)).toBeTruthy();
                    feature.onCacheMiss(store, 301, 310);

                    feature.onPageAdd(pageMap, 3);
                    t.expect(feature.pageMapFeeder.getFeedAt(3)).toBe(null);

                    grid.destroy();
                    grid = null;

                });
            });


            t.it("getCurrentViewRange()", function (t) {

                let grid        = getGrid({autoLoad : true}),
                    view        = grid.view,
                    feature     = grid.view.getFeature("livegrid"),
                    pageMap     = feature.getPageMap(),
                    PageMapUtil = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(750, function () {

                    let oldEnd = view.all.endIndex;

                    view.all.endIndex = -1;

                    t.expect(feature.getCurrentViewRange()).toBe(null);

                    view.all.endIndex = oldEnd;

                    let range = feature.getCurrentViewRange();
                    t.expect(range instanceof coon.core.data.pageMap.IndexRange);

                    t.expect(PageMapUtil.positionToStoreIndex(range.getStart(), pageMap)).toBe(view.all.startIndex);
                    t.expect(PageMapUtil.positionToStoreIndex(range.getEnd(), pageMap)).toBe(view.all.endIndex);

                    grid.destroy();
                    grid = null;

                });
            });


            t.it("refreshView()", function (t) {

                let grid           = getGrid({autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    RecordPosition =  coon.core.data.pageMap.RecordPosition;


                t.waitForMs(750, function () {

                    let positions = [
                        RecordPosition.create(3, 23)
                    ];

                    t.expect(feature.refreshView(positions)).toBe(false);

                    t.isCalledNTimes("ensureVisible", grid, 0);

                    positions = [
                        RecordPosition.create(1, 4),
                        RecordPosition.create(3, 23)
                    ];

                    t.expect(feature.refreshView(positions)).toBe(true);


                    grid.destroy();
                    grid = null;
                });
            });


            t.it("refreshView() - ensureVisible with selection", function (t) {

                let grid           = getGrid({autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    pageMap        = feature.getPageMap(),
                    RecordPosition =  coon.core.data.pageMap.RecordPosition,
                    positions;


                t.waitForMs(750, function () {

                    t.isCalledNTimes("ensureVisible", grid, 1);

                    grid.getSelectionModel().select(pageMap.map[1].value[4]);

                    positions = [
                        RecordPosition.create(1, 4),
                        RecordPosition.create(3, 23)
                    ];

                    t.expect(feature.refreshView(positions)).toBe(true);


                    grid.destroy();
                    grid = null;
                });
            });


            t.it("refreshView() - ensureVisible (=false) with selection", function (t) {

                let grid           = getGrid({autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    pageMap        = feature.getPageMap(),
                    RecordPosition =  coon.core.data.pageMap.RecordPosition,
                    positions;


                t.waitForMs(750, function () {

                    t.isCalledNTimes("ensureVisible", grid, 0);

                    grid.getSelectionModel().select(pageMap.map[1].value[4]);

                    positions = [
                        RecordPosition.create(1, 4),
                        RecordPosition.create(3, 23)
                    ];

                    t.expect(feature.refreshView(positions, false)).toBe(true);


                    grid.destroy();
                    grid = null;
                });
            });


            t.it("remove()", function (t) {

                let grid           = getGrid({autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    pageMap        = feature.getPageMap();

                t.waitForMs(750, function () {

                    let rec  = pageMap.map[1].value[4],
                        rec2 =  pageMap.map[3].value[4];

                    t.isCalledNTimes("remove", feature.pageMapFeeder, 2);

                    grid.getSelectionModel().select(rec);
                    t.expect(grid.getSelection()[0]).toBe(rec);
                    t.expect(feature.remove(rec)).toBe(true);
                    t.expect(grid.getSelection().length).toBe(0);


                    grid.getSelectionModel().select(rec2);
                    t.expect(grid.getSelection()[0]).toBe(rec2);
                    t.expect(feature.remove(rec2)).toBe(false);
                    t.expect(grid.getSelection().length).toBe(0);

                    grid.destroy();
                    grid = null;
                });
            });


            t.it("refreshView() - indexes properly passed to view's refreshView", function (t) {

                let grid           = getGrid({autoLoad : true}),
                    view           = grid.view,
                    feature        = grid.view.getFeature("livegrid"),
                    feeder         = feature.pageMapFeeder,
                    pageMap        = feature.getPageMap(),
                    map            = pageMap.map,
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(1250, function () {

                    let scrollable = view.getScrollable(),
                        rowHeight  = view.bufferedRenderer.rowHeight;

                    scrollable.scrollTo(0, 300 * rowHeight);

                    t.waitForMs(1250, function () {

                        let rec      = map[4].value[5],
                            pos      = PageMapUtil.findRecord(rec, feeder),
                            checkRec = map[4].value[1];

                        t.expect(feature.getCurrentViewRange().contains(pos)).toBe(true);

                        grid.getSelectionModel().select(rec);

                        feature.remove(rec);

                        t.expect(feature.getCurrentViewRange().contains(
                            PageMapUtil.findRecord(checkRec, feeder))
                        ).toBe(true);

                        grid.destroy();
                        grid = null;
                    });
                });
            });


            t.it("add()", function (t) {

                let grid           = getGrid({sorters : {property : "testProp", dir : "ASC"}, autoLoad : true}),
                    view           = grid.view,
                    feature        = grid.view.getFeature("livegrid"),
                    feeder         = feature.pageMapFeeder,
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(1250, function () {

                    let scrollable = view.getScrollable(),
                        rowHeight  = view.bufferedRenderer.rowHeight;

                    scrollable.scrollTo(0, 300 * rowHeight);

                    t.waitForMs(1250, function () {

                        let rec      = Ext.create("MockModel", {
                            testProp : 306.5,
                            subject  : "+++ NEW +++"
                        });

                        feature.add(rec);

                        t.expect(feature.getCurrentViewRange().contains(
                            PageMapUtil.findRecord(rec, feeder))
                        ).toBe(true);

                        grid.destroy();
                        grid = null;
                    });
                });
            });


            t.it("add() - start of view", function (t) {

                let grid        = getGrid({sorters : {property : "testProp", dir : "ASC"}, autoLoad : true}),
                    feature     = grid.view.getFeature("livegrid"),
                    feeder      = feature.pageMapFeeder,
                    PageMapUtil = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(1250, function () {

                    t.waitForMs(1250, function () {

                        for (var i = 0; i < 78; i++) {
                            let rec      = Ext.create("MockModel", {
                                testProp : 0 - i,
                                subject  : "+++ NEW (" + i + ") +++"
                            });
                            feature.add(rec);

                            t.expect(feature.getCurrentViewRange().contains(
                                PageMapUtil.findRecord(rec, feeder))
                            ).toBe(true);

                        }


                        grid.destroy();
                        grid = null;
                    });
                });
            });


            t.it("onPageAdd()", function (t) {

                let grid = getGrid({
                        sorters: {property: "testProp", dir: "ASC"},
                        autoLoad: true
                    }),
                    feature = grid.view.getFeature("livegrid");

                t.waitForMs(1250, function () {

                    t.isCalledNTimes("cleanFeedsAndVetoed", feature, 1);

                    feature.onPageAdd(feature.getPageMap(), 3);

                    grid.destroy();
                    grid = null;
                });
            });


            t.it("onPageRemove()", function (t) {

                let grid = getGrid({
                        sorters: {property: "testProp", dir: "ASC"},
                        autoLoad: true
                    }),
                    feature = grid.view.getFeature("livegrid");

                t.waitForMs(1250, function () {

                    t.isCalledNTimes("cleanFeedsAndVetoed", feature, 1);

                    feature.onPageRemove(feature.getPageMap(), 3);

                    grid.destroy();
                    grid = null;
                });
            });


            t.it("onPageRemoveVeto()", function (t) {

                let grid = getGrid({
                        sorters: {property: "testProp", dir: "ASC"},
                        autoLoad: true
                    }),
                    feature = grid.view.getFeature("livegrid");

                t.waitForMs(1250, function () {

                    t.expect(feature.vetoedPages).toEqual([]);

                    feature.onPageRemoveVeto(feature.pageMapFeeder, 3);
                    feature.onPageRemoveVeto(feature.pageMapFeeder, 2);

                    t.expect(feature.vetoedPages).toEqual([3, 2]);

                    feature.onPageRemoveVeto(feature.pageMapFeeder, 2);
                    feature.onPageRemoveVeto(feature.pageMapFeeder, 1);

                    t.expect(feature.vetoedPages).toEqual([3, 2, 1]);

                    grid.destroy();
                    grid = null;
                });

            });


            t.it("onScroll()", function (t) {

                let grid = getGrid({
                        sorters: {property: "testProp", dir: "ASC"},
                        autoLoad: true
                    }),
                    feature        = grid.view.getFeature("livegrid"),
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil,
                    RecordPosition = coon.core.data.pageMap.RecordPosition;

                t.waitForMs(1250, function () {

                    let rowHeight = feature.grid.view.bufferedRenderer.rowHeight,
                        posToY = function (pos) {
                            return PageMapUtil.positionToStoreIndex(pos, feature.getPageMap()) * rowHeight;
                        };


                    feature.vetoedPages = [1, 3];
                    t.expect(feature.getPageMap().map[1]).toBeDefined();
                    t.expect(feature.getPageMap().map[3]).toBeDefined();

                    feature.onScroll(null, 0, posToY(RecordPosition.create(1, 2)));
                    t.expect(feature.vetoedPages).toEqual([1]);
                    t.expect(feature.getPageMap().map[1]).toBeDefined();
                    t.expect(feature.getPageMap().map[3]).toBeUndefined();

                    feature.onScroll(null, 0, posToY(RecordPosition.create(2, 13)));
                    t.expect(feature.vetoedPages).toEqual([]);
                    t.expect(feature.getPageMap().map[1]).toBeUndefined();

                    grid.destroy();
                    grid = null;
                });

            });


            t.it("cleanFeedsAndVetoed()", function (t) {

                let grid = getGrid({
                        sorters: {property: "testProp", dir: "ASC"},
                        autoLoad: true
                    }),
                    feature = grid.view.getFeature("livegrid");

                t.waitForMs(1250, function () {

                    feature.pageMapFeeder.swapMapToFeed(3, 2);
                    feature.vetoedPages = [3];

                    t.expect(feature.pageMapFeeder.getFeedAt(3)).toBeTruthy();
                    t.expect(feature.vetoedPages).toEqual([3]);

                    feature.cleanFeedsAndVetoed(3);

                    t.expect(feature.pageMapFeeder.getFeedAt(3)).toBeFalsy();
                    t.expect(feature.vetoedPages).toEqual([]);

                    grid.destroy();
                    grid = null;
                });
            });


            t.it("add() - start of view, last page vetoed", function (t) {

                let grid           = getGrid({sorters : {property : "testProp", dir : "ASC"}, autoLoad : true}),
                    view           = grid.view,
                    feature        = grid.view.getFeature("livegrid"),
                    pageMap        = feature.getPageMap(),
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(1250, function () {

                    let scrollable = view.getScrollable(),
                        rowHeight  = view.bufferedRenderer.rowHeight,
                        lastPage   = PageMapUtil.getLastPossiblePageNumber(pageMap);

                    t.expect(lastPage).toBe(100);


                    scrollable.scrollTo(0, 100000 * rowHeight);

                    t.waitForMs(1250, function () {

                        for (var i = 0; i < 1; i++) {
                            let rec      = Ext.create("MockModel", {
                                testProp : 0 - i,
                                subject  : "+++ NEW (" + i + ") +++"
                            });

                            feature.add(rec);

                            coon.comp.fixtures.sim.ItemTable.items.splice(0, 0, rec.data);
                            t.expect(feature.vetoedPages.indexOf(lastPage)).not.toBe(-1);
                        }

                        scrollable.scrollTo(0, 0);

                        t.waitForMs(750, function () {
                            t.expect(feature.vetoedPages.indexOf(lastPage)).toBe(-1);
                            t.expect(pageMap.map[lastPage]).toBeUndefined();

                            grid.destroy();
                            grid = null;
                        });

                    });
                });
            });


            t.it("getRecordById()", function (t) {

                let grid           = getGrid({sorters : {property : "testProp", dir : "ASC"}, autoLoad : true}),
                    feature        = grid.view.getFeature("livegrid"),
                    PageMapUtil    = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(750, function () {

                    t.isCalledOnce("getRecordById", PageMapUtil);

                    feature.getRecordById("foo");

                    t.waitForMs(750, function () {
                        grid.destroy();
                        grid = null;
                    });
                });
            });


            t.it("lib-cn_comp#4", function (t) {

                var grid     = getGrid({autoLoad : true, sorters : {property : "testProp", dir : "ASC"}}),
                    store    = grid.getStore(),
                    selModel = grid.getSelectionModel();

                t.isntCalled("ensureVisible" ,grid);

                t.waitForMs(500, function () {

                    let rogueRec = Ext.create("Ext.data.Model", {text : "foo"}),
                        rec      = store.getAt(0);

                    selModel.select(rogueRec);

                    t.expect(selModel.isSelected(rec)).toBe(false);
                    t.expect(selModel.isSelected(rogueRec)).toBe(true);


                    rec.set("subject", "foo");
                    rec.set("testProp", 2);
                    rec.commit();


                    grid.destroy();
                    grid = null;


                });
            });


            t.it("lib-cn_comp#5", function (t) {

                let grid = getGrid({
                        sorters     : {property : "testProp", dir : "ASC"},
                        autoLoad    : true,
                        extraParams : {isEmpty : true}
                    }),
                    feature     = grid.view.getFeature("livegrid"),
                    feeder      = feature.pageMapFeeder,
                    PageMapUtil = coon.core.data.pageMap.PageMapUtil;


                t.waitForMs(TIMEOUT, function () {

                    for (var i = 0; i < 78; i++) {
                        let rec      = Ext.create("MockModel", {
                            testProp : 0 - i,
                            subject  : "+++ NEW (" + i + ") +++"
                        });
                        feature.add(rec);

                        t.expect(feature.getCurrentViewRange().contains(
                            PageMapUtil.findRecord(rec, feeder))
                        ).toBe(true);

                    }


                    grid.destroy();
                    grid = null;

                });
            });


        });});});