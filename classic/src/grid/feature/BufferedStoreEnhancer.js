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
        'conjoon.cn_core.data.pageMap.IndexLookup'
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
     * grid's store sorter and sort order is affected by the update, and trigger
     * a view update if necessary and applicable.
     *
     * @param {Ext.data.BufferedStore} store
     * @param {Ext.data.Model} record
     * @param {Ext.data.operation.Operation} operation
     */
    onStoreUpdate : function(store, record, operation) {

        var me            = this,
            grid          = me.grid,
            PageMapUtil   = conjoon.cn_core.data.pageMap.PageMapUtil,
            sorters       = store.getSorters(),
            property      = sorters.getAt(0).getProperty(),
            rows          = grid.getView().all,
            pageMap       = grid.getStore().getData(),
            viewRefreshed = false,
            orgIndex,index, viewRect, from, to;

        if (!record.previousValues.hasOwnProperty(property)) {
            return;
        }

        orgIndex = pageMap.indexOf(record);

        viewRect = [rows.startIndex, rows.endIndex];

        index = me.indexLookup.findInsertIndex(record);

        if (Ext.isArray(index)) {

            from = PageMapUtil.storeIndexToPosition(orgIndex, pageMap);
            to   = Ext.create('conjoon.cn_core.data.pageMap.RecordPosition', {
                page  : index[0],
                index : index[1]
            });

            PageMapUtil.moveRecord(from, to, pageMap);

            // if from or to is in the rendered rect, refresh view
            if (pageMap.indexOf(record) >= 0 ||
                (index[1] >= viewRect[0] && index[1] <= viewRect[1])) {
                grid.view.refreshView(Math.min(from.getIndex(), to.getIndex()));
                viewRefreshed = true;
                grid.ensureVisible(record);
            }

            grid.fireEvent(
                'cn_comp-bufferedstoreenhancer-recordmove',
                grid, record, from, to, viewRefreshed
            );


        }

    },


    /**
     * Callback fro the reconfigure event of the grid of this feature.
     *
     * @param {Ext.grid.Panel} grid
     * @param {Ext.store.AbstractStore} store
     * @param {Array} columns
     * @param {Ext.store.AbstractStore} oldStore
     * @param {Array} oldColumns
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