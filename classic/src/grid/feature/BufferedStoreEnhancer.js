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
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Grid Feature which enhances the usability when used with a BufferedStore,
 * allowing for more seamlessly udate/remove/add operations without the need
 * to completely reload the store, and instead delay reloading data to
 * the prefetching mechanism of the BufferedStore.
 *
 *
 *
 */
Ext.define('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', {

    extend : 'Ext.grid.feature.Feature',

    alias : 'feature.cn_comp-gridfeature-bufferedstoreenhancer',

    /**
     * @type {Ext.grid.Panel}
     */
    grid : null,

    /**
     * @type {Array} prunePageSet
     * Holds a list of pages that need to get pruned when the next prefetch
     * should happen. This holds most likely the data representing the rendered
     * view in which an update happened, and which needs to be frehsly reloaded
     * from the server in the background when the user scrolls it out of view.
     */
    prunePageSet : null,

    /**
     * The ccss class which will be attached to updated rows
     * @cfg {String=cn_comp-bufferedstoreenhancer-updatedrow}
     */
    updatedRowCls : 'cn_comp-bufferedstoreenhancer-updatedrow',


    /**
     * @inheritdoc
     */
    init : function(grid) {

        var me = this;

        me.grid = grid;

        if (grid.multiColumnSort) {
            Ext.raise({
                msg             : 'BufferedStoreEnhancer does not work with ' +
                                  'grid\'s "multiColumnSort"-functionality enabled',
                multiColumnSort : grid.multiColumnSort
            });
        }

        me.interceptGrid(grid);

        me.callParent(arguments);
    },

    interceptGrid : function(grid) {
        var me = this;

        Ext.Function.interceptBefore(grid, "bindStore",   me.bindStore,   me);
        Ext.Function.interceptBefore(grid, "unbindStore", me.unbindStore, me);
    },


    /**
     *
     * @param store
     * @param operation
     */
    onBeforeStorePrefetch : function(store, operation) {

        var me           = this,
            grid         = me.grid,
            /**
             * @type {Ext.data.PageMap}
             */
            pageMap      = grid.getStore().getData(),
            prunePageSet = me.prunePageSet;

        if (prunePageSet) {
            console.log("Prefetching and pruning", prunePageSet, arguments);

            for (var i = 0, len = prunePageSet.length; i < len; i++) {
                pageMap.removeAtKey(prunePageSet[i]);
            }

            me.prunePageSet =  null;
        }

    },


    /**
     *
     * @param store
     * @param record
     * @param operation
     */
    onStoreUpdate : function(store, record, operation) {

        var me          = this,
            grid        = me.grid,
            view        = grid.view,
            store       = grid.getStore(),
            /**
             * @type {Ext.data.PageMap}
             */
            pageMap     = store.getData(),
            pages       = pageMap.map,
            recordIndex = store.indexOf(record), // -1 if not found
            recordPage  = recordIndex > -1
                ? store.getPageFromRecordIndex(recordIndex)
                : -1,
            rows        = view.all,
            sortField   = store.sorters && store.sorters.length
                          ? store.sorters.getAt(0).getProperty()
                          : null,
            prunePageSet = [],
            renderStartPage = store.getPageFromRecordIndex(rows.startIndex),
            renderEndPage   = store.getPageFromRecordIndex(rows.endIndex);

        // IN ANY CASE, EVEN IF THE RECORD WAS NOT PART OF THE CACHED/VIEWD PAGES:
        // was the updated field part of the sorter? Then the order of the
        // displayed records might have changed, we need to update the cahed
        // pages

        // WAS THE RECORD PART OF THE VIEW?
        // Discard all saved pages except for the rendered one
        // discard the rendered one as soon as the new prefetch starts

        // WAS THE RECORD ONLY PART OF THE CACHED PAGES?
        // Discard the cached pages, discard the rendered pages as soon
        // as the next prefetch happens

        if (recordIndex === -1) {
            // the update event isnt even fired if the record was not part of the store,
            // i.e. if the user scrolled the view and requested new data
            // which discarded the cache with THIS record
            // we leave this in here to be on the safe side.
            return;
        }

        if (!sortField || !record.previousValues.hasOwnProperty(sortField)) {
           // me.updateRowCls(record);
            // if not part of a sort field, data set needs no re-ordering
            // return here
            return;
        }

        // add pages which are currently rendered to pagePruneSet.
        // we may not remove them right now
        for (var i = renderStartPage; i <= renderEndPage; i++) {
            prunePageSet.push('' + i);
        }

        if (recordIndex < rows.startIndex || recordIndex > rows.endIndex) {
            // record was not part of the rendered view
            // add pages which are currently part of the rendered view to
            // pagePruneSet, other pages can be removed
            for (var pageNumber in pages) {
                if (prunePageSet.indexOf('' + pageNumber) == -1) {
                    pageMap.removeAtKey(pageNumber);
                }
            }
        } else {
            // TESTED
            // Remove surrounding pages.
            // if we are here, the record was also rendered, not only part of
            // the store.
            // Make sure we are not removing any page which is currently
            // rendered
            //if (prunePageSet.indexOf('' + recordPage) == -1) {
            //    prunePageSet.push('' + recordPage);
            //}
            prunePageSet = null;
            me.moveSorted(record, renderStartPage, renderEndPage);
            // only refresh the view of the buffered renderer
            me.grid.view.bufferedRenderer.refreshView();
          //  me.updateRowCls(record);

            //for (var pageNumber in pages) {
             //   if (prunePageSet.indexOf(pageNumber) == -1) {
                    // We do not need to remove right now if anything happened IN
                    // the rendered view
                   // pageMap.removeAtKey(pageNumber);
              //  }
            //}


        }

        me.prunePageSet = prunePageSet;
    },


    updateRowCls : function(record) {
        var me          = this,
            grid        = me.grid,
            view        = grid.view,
            recordIndex = grid.getStore().indexOf(record);
console.log("UPDATING ROW CLS", record, recordIndex);
        // apply updatedRowCls to the row here
        Ext.fly(
            Ext.dom.Query.selectNode(
                'tr[class*=x-grid-row]',
                view.all.item(recordIndex, true)
            )
        ).addCls(me.updatedRowCls);
    },


    /**
     *
     * @param {Ext.data.Store} store
     */
    bindStore : function(store) {
        var me = this;

        if (store && (store instanceof Ext.data.BufferedStore)) {
            me.mon(store, 'update',         me.onStoreUpdate, me);
            me.mon(store, 'beforeprefetch', me.onBeforeStorePrefetch,    me);
        }
    },


    /**
     *
     */
    unbindStore : function() {
        var me    = this,
            store = me.grid ? me.grid.getStore() : null;

        if (store && (store instanceof Ext.data.BufferedStore)) {
            me.mun(store, 'update',         me.onStoreUpdate, me);
            me.mun(store, 'beforeprefetch', me.onBeforeStorePrefetch,    me);
        }
    },


    /**
     * (Local sort only) Inserts the passed Record into the Store at the index where it
     * should go based on the current sort information.
     *
     * @param {Ext.data.Record} record
     * @param {Mixed} startPage
     * @param {Mixed} endPage
     *
     * @return {Ext.data.Record}
     */
    moveSorted : function(record, startPage, endPage) {
        var me         = this,
            store      = me.grid.getStore(),
            data       = store.getData(),
            orgIndex   = data.indexOf(record) % data.getPageSize(),
            index      = me.findInsertIndexInPageRangeForRecord(record, startPage, endPage),
            storeIndex = 0,
            page, pos, values, tmp;


        if (index === null) {
            return null;
        }

        page   = index[0];
        pos    = index[1];
        values = data.map[page].value;

        // swap
        tmp = values.splice(orgIndex, 1);
        values.splice(pos, 0, tmp[0]);


        for (var startIdx in data.map) {
            // Maintain the indexMap so that we can implement indexOf(record)
            for (var i = 0, len = data.map[startIdx].value.length; i < len; i++) {
                data.indexMap[data.map[startIdx].value[i].internalId] = storeIndex++;
            }
        }

        console.log(data.map);
        console.log(data.indexMap);

        return record;
    },


    isFirstPageLoaded : function() {
        return !!this.grid.getStore().getData().map[1]
    },


    cmpFuncHelper : function(val1, val2) {

        return val1 < val2
            ? -1
            : val1 === val2
            ? 0
            : 1;
    },


    /**
     * Same values: Presedence is given the newly inserted record.
     *
     * @param record
     * @returns {*}
     */
    findInsertIndexInPageRangeForRecord : function(record, startPage, endPage) {

        var me          = this,
            grid        = me.grid,
            store       = grid.getStore(),
            map         = store.getData().map,
            // guaranteed to be only one sorter
            sorters     = store.getSorters(),
            target      = null,
            isBeginning = this.isFirstPageLoaded(),
            pageIterate,
            values, property,
            direction, cmpRecord, cmp, cmpFunc,
            firstPage;

        // iterate through maps
        // insert at map n
        // shift records through pages
        // update indexMap
        if (!sorters || sorters.length != 1) {
            return [1, 0];
        }

        property  = sorters.getAt(0).getProperty();
        direction = sorters.getAt(0).getDirection();

        cmpFunc = record.getField(property)
                  ? record.getField(property).compare
                  : me.cmpFuncHelper;

        for (var i = startPage; i <= endPage; i++) {

            if (!map.hasOwnProperty(i) ) {
                continue;
            }

            pageIterate = parseInt(i, 10) ;
            firstPage   = firstPage ? firstPage : pageIterate;

            values = map[i].value;

            for (var a = 0, lena = values.length; a < lena; a++) {
                cmpRecord = values[a];

                if (cmpRecord === record) {
                    continue;
                }

                cmp = cmpFunc(record.get(property), cmpRecord.get(property));

                // -1 less, 0 equal, 1 greater
                switch (direction) {
                    case 'ASC':
                        console.log("CMP", cmp, record.get(property), cmpRecord.get(property));
                        if (cmp === 0) {
                            return [pageIterate, a];
                        } else if (cmp === -1) {

                            if (a === 0) {
                                if (firstPage === 1 && pageIterate >= 1) {
                                    return [pageIterate, a];
                                } else {
                                    return null;
                                }
                            } else {
                                a--;
                            }

                            return [pageIterate, a];
                        }
                        break;
                    default:
                        if (cmp === 0) {
                            return [pageIterate, a];
                        } else if (cmp === 1) {
                            if (firstPage !== 1 &&  !map.hasOwnProperty(pageIterate - 1)) {
                                return null;
                            }
                            return [pageIterate, a];
                        }
                        break;
                }
            }
        }

        return null;

    }





});