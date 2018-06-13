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
            pageSize    = store.pageSize,
            sortField   = store.sorters && store.sorters.length
                          ? store.sorters.getAt(0).getProperty()
                          : null,
            prunePageSet = [],
            renderStartPage = store.getPageFromRecordIndex(rows.startIndex),
            renderEndPage   = store.getPageFromRecordIndex(rows.endIndex),
            firstPage, lastPage;

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
            console.log("Record to update was not found", record);
            return;
        }

        // apply updatedRowCls to the row here
        Ext.fly(
            Ext.dom.Query.selectNode('tr[class*=x-grid-row]', view.all.item(recordIndex, true))
        ).addCls(me.updatedRowCls);

        if (!sortField || !record.previousValues.hasOwnProperty(sortField)) {
            console.log("record was not updated at " + sortField +", no action needed.");
            return;
        }

        //console.log(rows)
        console.log(recordPage, pages);

        firstPage = Math.max(1, Math.floor(rows.startIndex / pageSize));
        lastPage  = Math.ceil(rows.endIndex / pageSize);

        if (recordIndex < rows.startIndex || recordIndex > rows.endIndex) {
            console.log("Record was not part of the rendered view", recordIndex, recordPage);
            console.log("removing all cached pages except for page in view", rows.startIndex, rows.endIndex);

            for (var pageNumber in pages) {
                console.log("checking if " + pageNumber + " can be removed", firstPage, lastPage);

                if (pageNumber >= firstPage && pageNumber <= lastPage) {
                    console.log("NOT TOUCHING", pageNumber);
                    prunePageSet.push(pageNumber);
                } else {
                    console.log("removing page at " + pageNumber, pageMap.removeAtKey(pageNumber));
                }
            }

            console.log("DONE", rows, store.getData().map);
        } else {
            // Remove surrounding pages.
            // if we are here, the record was also renderes, not only part of
            // the store.
            // Make sure we are not removing any page which is currently
            // rendered
            for (var i = renderStartPage; i < renderEndPage; i++) {
                prunePageSet.push('' + i);
            }
            if (prunePageSet.indexOf(recordPage) == -1) {
                prunePageSet.push('' + recordPage);
            }

            for (var pageNumber in pages) {
                if (prunePageSet.indexOf(pageNumber) == -1) {
                    pageMap.removeAtKey(pageNumber);
                }
            }
        }

        me.prunePageSet = prunePageSet;
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
    }



});