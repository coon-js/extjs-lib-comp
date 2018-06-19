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



    })}) // EO requireOk




});