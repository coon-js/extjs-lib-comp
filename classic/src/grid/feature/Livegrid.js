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
 *  +--------------------------------------------------------------------+
 *  |                        LIVEGRID                                    |
 *  +--------------------------------------------------------------------+
 *
 * Grid Feature which enhances the usability when used with a BufferedStore,
 * allowing for more seamless update/remove/add operations without the need
 * to completely reload the store, and instead delay reloading data to
 * the prefetching mechanism of the BufferedStore.
 *
 */
Ext.define('conjoon.cn_comp.grid.feature.Livegrid', {

    extend : 'Ext.grid.feature.Feature',

    alias : 'feature.cn_comp-gridfeature-livegrid',

    requires : [
        'conjoon.cn_core.data.pageMap.PageMapFeeder',
        'conjoon.cn_core.data.pageMap.RecordPosition',
        'conjoon.cn_core.data.pageMap.IndexRange'
    ],


    /**
     * @type {conjoon.cn_core.data.pageMap.PageMapFeeder} pageMapFeeder
     * @private
     */
    pageMapFeeder : null,


    /**
     * @inheritdoc
     */
    init : function(grid) {

        var me = this;

        if (grid.multiColumnSort) {
            Ext.raise({
                msg             : 'Livegrid does not work with ' +
                                  'grid\'s "multiColumnSort"-functionality enabled',
                multiColumnSort : grid.multiColumnSort
            });
        }

        me.configure(grid.getStore());
        grid.on('reconfigure', me.onGridReconfigure, me);

        me.callParent(arguments);
    },


    /**
     * Callback for the store's update event. Will check if this
     * grid's store sorter and sort order is affected by the update, and forward
     * to this PageMapFeeder's #update method. If a conjoon.cn_core.data.pageMap.Operation
     * instance is returned by this method, either its from or to (or both)
     * position(s) will be forwarded to #refreshView, which has the to decide
     * if the view is re-rendered.
     *
     *
     * @param {Ext.data.BufferedStore} store
     * @param {Ext.data.Model} record
     * @param {Ext.data.operation.Operation} operation
     *
     * @return {Boolean} false if no update in the view was triggered, otherwise
     * true
     */
    onStoreUpdate : function(store, record, operation) {

        const me       = this,
              sorters  = me.grid.store.getSorters(),
              property = sorters && sorters.getAt(0)
                         ? sorters.getAt(0).getProperty()
                         : null;

        if (!property || !record.previousValues.hasOwnProperty(property)) {
            return false;
        }

        let op  = me.pageMapFeeder.update(record),
            pos = [], result;

        if (op) {
            result = op.getResult();
            if (result.to) {
                pos.push(result.to);
            }
            if (result.from) {
                pos.push(result.from);
            }
        }

        return me.refreshView(pos);
    },


    /**
     * Refreshes the view if any of the positions found in positions is contained
     * in the current view.
     *
     * @param {Array|conjoon.cn_core.data.pageMap.RecordPosition} positions
     *
     * @return {Boolean} true if refreshing the view was delegated to this grid's
     * view, otherwise false
     *
     * @private
     */
    refreshView : function(positions) {

        const me          = this,
              grid        = me.grid,
              view        = grid.getView(),
              pageMap     = me.getPageMap(),
              PageMapUtil = conjoon.cn_core.data.pageMap.PageMapUtil;

        let i, len, indexes = [];

        for (i = 0, len = positions.length; i < len; i++) {
            indexes.push(PageMapUtil.positionToStoreIndex(positions[i], pageMap));
        }

        // if from or to is in the rendered rect, refresh view
        if (me.getCurrentViewRange().contains(positions)) {
            view.refreshView(Math.min(...indexes));

            return true;
        }

        return false;
    },


    /**
     * Returns the current range of rendered indexes.
     *
     *  @return {conjoon.cn_core.data.pageMap.IndexRange} the current range or
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
        const me = this;

        return this.grid.getStore().getData();
    },


    /**
     * Callback for the reconfigure event of the grid of this feature.
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
            me.configure(store);
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
    configure : function(store) {

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
        // however, we want to be on the save side, our tests consider this
        // edge case
        me.mun(store, 'update',  me.onStoreUpdate, me);
        me.mon(store, 'update',  me.onStoreUpdate, me);

        if (me.pageMapFeeder) {
            me.pageMapFeeder.destroy();
            me.pageMapFeeder = null;
        }

        me.pageMapFeeder = Ext.create('conjoon.cn_core.data.pageMap.PageMapFeeder', {
            pageMap : store.getData()
        });

        return true;
    }




});