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
 * allowing for more seamless update/remove/add operations without the need
 * to completely reload the store, and instead delay reloading data to
 * the prefetching mechanism of the BufferedStore.
 *
 * ## Extra Events
 *
 * This feature adds several extra events that will be fired on the grid to
 * interact with:
 *
 *  - {@link #cn_comp-bufferedstoreenhancer-recordmove}
 *
 *
 */
Ext.define('conjoon.cn_comp.grid.feature.BufferedStoreEnhancer', {

    extend : 'Ext.grid.feature.Feature',

    alias : 'feature.cn_comp-gridfeature-bufferedstoreenhancer',

    requires : [
        'conjoon.cn_core.data.pageMap.IndexLookup',
        'conjoon.cn_core.data.pageMap.RecordPosition',
        'conjoon.cn_core.data.pageMap.IndexRange'
    ],


    /**
     * @event cn_comp-bufferedstoreenhancer-recordmove
     * @param {Ext.grid.Panel} grid The grid this feature is used with
     * @param {Ext.data.Model} record The record that was updated
     * @param {conjoon.cn_core.data.pageMap.RecordPosition} from The original
     * position of the record before it was moved
     * @param {conjoon.cn_core.data.pageMap.RecordPosition} to The target position
     * of the record to which it was moved
     * @param {Boolean} viewRefreshed whether the view was refresh to represent
     * the changes
     */


    /**
     * @inheritdoc
     */
    init : function(grid) {

        var me = this;

        if (grid.multiColumnSort) {
            Ext.raise({
                msg             : 'BufferedStoreEnhancer does not work with ' +
                                  'grid\'s "multiColumnSort"-functionality enabled',
                multiColumnSort : grid.multiColumnSort
            });
        }


        me.associateSetup(grid.getStore());
        grid.on('reconfigure', me.onGridReconfigure, me);

        me.callParent(arguments);
    },


    /**
     * Callback for the store's update event. Will check if this
     * grid's store sorter and sort order is affected by the update, and forward
     * to #moveRecord.
     *
     * @param {Ext.data.BufferedStore} store
     * @param {Ext.data.Model} record
     * @param {Ext.data.operation.Operation} operation
     */
    onStoreUpdate : function(store, record, operation) {

        var me             = this,
            grid           = me.grid,
            RecordPosition = conjoon.cn_core.data.pageMap.RecordPosition,
            sorters        = grid.store.getSorters(),
            property       = sorters && sorters.getAt(0)
                             ? sorters.getAt(0).getProperty()
                             : null,
            searchIndex;


        if (!property || !record.previousValues.hasOwnProperty(property)) {
            return false;
        }

        searchIndex = me.indexLookup.findInsertIndex(record);

        if (Ext.isArray(searchIndex)) {
            me.moveRecord(record, RecordPosition.create(searchIndex));
            return true;
        }

        return false;
    },


    /**
     * Tries to move the record in the PageMap to position based on the sort
     * information.
     * Any responsibility for refreshing the view is delegated to #refreshView.
     * This method triggers the #cn_comp-bufferedstoreenhancer-recordmove event
     * with the appropriate event-informations.
     * Will not scroll to the moved record, for this you are advised to call
     * {Ext.grid.Panel#ensureVisible} in any #cn_comp-bufferedstoreenhancer-recordmove-
     * listener.

     *
     * @param {Ext.data.Model} record
     * @param {conjoon.cn_core.data.pageMap.RecordPosition} to
     *
     * @return {Boolean} true if the record was moved, otherwise false.
     *
     * @private
     */
    moveRecord : function(record, to) {

        var me             = this,
            grid           = me.grid,
            PageMapUtil    = conjoon.cn_core.data.pageMap.PageMapUtil,
            pageMap        = me.getPageMap(),
            viewRefreshed  = false,
            from           = PageMapUtil.storeIndexToPosition(pageMap.indexOf(record), pageMap);

        // no support for moving anything that is out of the PageRange of record
        if (!PageMapUtil.getPageRangeForRecord(record, pageMap)
            .equalTo(PageMapUtil.getPageRangeForRecord(
                PageMapUtil.getRecordAt(to, pageMap), pageMap)
        )) {
            Ext.raise('Runtime Exception');
        }

        PageMapUtil.moveRecord(from, to, pageMap);
        viewRefreshed = me.refreshView(from, to);

        grid.fireEvent(
            'cn_comp-bufferedstoreenhancer-recordmove',
            grid, record, from, to, viewRefreshed
        );

    },


    /**
     * Refreshes the view if either from or to are within the currently rendered
     * range of records in the grid.
     *
     * @param {conjoon.cn_core.data.pageMap.RecordPosition} from The position from
     * where the view should be re-rendered
     * @param {conjoon.cn_core.data.pageMap.RecordPosition} from The position to
     * where the view should be re-rendered
     *
     * @return {Boolean} true if refreshing the view was delegated to this grid's
     * view, otherwise false
     *
     * @private
     */
    refreshView : function(from, to) {

        var me          = this,
            grid        = me.grid,
            view        = grid.getView(),
            pageMap     = me.getPageMap(),
            PageMapUtil = conjoon.cn_core.data.pageMap.PageMapUtil,
            start;

        // if from or to is in the rendered rect, refresh view
        if (me.getCurrentViewRange().contains([from, to])) {
            start = Math.min(
                PageMapUtil.positionToStoreIndex(from, pageMap),
                PageMapUtil.positionToStoreIndex(to, pageMap)
            );
            view.on('beforerefresh', function(){console.log(arguments)});
            view.refreshView(start);

            return true;
        }

        return false;
    },


    /**
     * Returns the current range of rendered indexes.
     *
     *  @return {conjoon.cn_core.data.pageMap.IndexRange} the current rnge or
     *  null if no range could be determined
     */
    getCurrentViewRange : function() {

        var me          = this,
            grid        = me.grid,
            view        = grid.getView(),
            rows        = view.all,
            PageMapUtil = conjoon.cn_core.data.pageMap.PageMapUtil;

        if (rows.endIndex === -1) {
            return null;
        }

        return PageMapUtil.storeIndexToRange(
            rows.startIndex,
            rows.endIndex,
            me.getPageMap()
        );
    },


    /**
     * Returns the PageMap this feature works with.
     *
     * @return {Ext.data.PageMap}
     *
     * @private
     */
    getPageMap : function() {
        return this.grid.getStore().getData();
    },


    /**
     * Callback fro the reconfigure event of the grid of this feature.
     *
     * @param {Ext.grid.Panel} grid
     * @param {Ext.store.AbstractStore} store
     * @param {Array} columns
     * @param {Ext.store.AbstractStore} oldStore
     * @param {Array} oldColumns
     *
     * @private
     */
    onGridReconfigure : function(grid, store, columns, oldStore, oldColumns) {

        var me = this;

        if (store && store !== oldStore) {
            me.associateSetup(store);
        }
    },


    /**
     * Sets up needed requirements for this feature to work properly.
     * We treat empty stores special, as we silently ignore them when this
     * method is called with a store representing an empty store.
     *
     * @param {Ext.data.AbstractStore} store
     * @return {Boolean} true if the requirements where successfully installed,
     * otherwise false, e.g. due to an empty store
     *
     * @private
     *
     * @throws if store is not an empty store or a BufferedStore
     */
    associateSetup : function(store) {

        var me = this;


        if (store && store.isEmptyStore) {
            return false;
        }

        if (!store || !(store instanceof Ext.data.BufferedStore)) {
            Ext.raise({
                msg   : '\'store\' must be an instance of Ext.data.BufferedStore',
                store : store
            });
        }

        // this is not needed since Ext.util.Event#addListener already checks
        // for duplicates and doesn't add one and the same event twice.
        // however, we want to be on the save side, tests consider this edge case
        me.mun(store, 'update',  me.onStoreUpdate, me);
        me.mon(store, 'update',  me.onStoreUpdate, me);

        if (me.indexLookup) {
            me.indexLookup.destroy();
            me.indexLookup = null;
        }

        me.indexLookup = Ext.create('conjoon.cn_core.data.pageMap.IndexLookup', {
            pageMap : store.getData()
        });

        return true;
    }




});