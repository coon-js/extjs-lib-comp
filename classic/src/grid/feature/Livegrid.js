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
     * A list of pages that where vetoed when the PageMapFeeder wanted to remove
     * them. This is most likely due to the view still needing the page as being
     * rendered. vetoedPages will get pruned in the #onScroll listener
     *
     * @type {Array}
     * @private
     */
    vetoedPages : null,


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

        me.swapSaveFocusState();

        me.mon(me.grid.view.getScrollable(), 'scroll', me.onScroll, me);

        me.vetoedPages = [];
    },


    /**
     * Adds the specified record to this Feature's BufferedStore.
     *
     * @param {Ext.data.Model} record
     *
     * @returns {Boolean} Returns the result of  #refreshView, which returns
     * true in case the view was updated, otherwise false
     */
    add : function(record) {

        const me = this;

        let op  = me.pageMapFeeder.add(record),
            pos = [], result;

        if (op) {
            result = op.getResult();

            if (result.to) {
                pos.push(result.to);
            }
        }

        return me.refreshView(pos, false);

    },


    /**
     * Callback for this feature's grid's scroll-event. Will check if the
     * current-scroll position allows for finally removing vetoed pages out of the
     * pageMap, so that they are reloaded when demanded.
     *
     * @param {Ext.scroll.Scroller} scroller
     * @param {Number} x
     * @param {Number} scrollTop
     *
     * @private
     */
    onScroll : function(scroller, x, scrollTop) {

        const me          = this,
              vetoedPages = me.vetoedPages,
              len         = vetoedPages.length;

        if (!len) {
            return;
        }

        const rowHeight      = me.grid.view.bufferedRenderer.rowHeight,
              pageMap        = me.getPageMap(),
              pageSize       = pageMap.getPageSize(),
              recordIndex    = Math.round(scrollTop / rowHeight);

        let idx, start, end;

        for (var i = len -1; i >= 0; i--) {
            idx = vetoedPages[i];

            // compute the range for the vetoedPage
            start = (idx - 1) * pageSize;
            end   = (start) + (pageSize - 1);

            if (!(start <= recordIndex && recordIndex <= end)) {
                pageMap.suspendEvents();
                pageMap.removeAtKey(idx);
                pageMap.resumeEvents();

                vetoedPages.splice(i, 1);
            }
        }
    },


    /**
     * Callback for the cn_core-pagemapfeeder-pageremoveveto-event of this
     * Livegrid's PageMapFeeder.
     * Will add the vetoed page to #vetoedPages, if it was not already registered
     * as such.
     *
     * @param {Ext.data.PageMap} pageMapFeeder
     * @param {Number} pageNumber
     *
     * @private
     */
    onPageRemoveVeto : function(pageMapFeeder, pageNumber) {
        const me          = this,
              vetoedPages = me.vetoedPages;

        if (vetoedPages.indexOf(pageNumber) === -1) {
            me.vetoedPages.push(pageNumber);
        }
    },


    /**
     * Method for removing a record, which will forward this call to this
     * feature's PageMapFeeder#remove method.
     * Selections will be updated in case the removed record was part of
     * the selection-model.
     *
     * @param {Ext.data.Model} record
     *
     * @returns {Boolean} Returns the result of  #refreshView, which returns
     * true in case the view was updated, otherwise false
     */
    remove : function(record) {

        const me       = this,
              selModel = me.grid.getSelectionModel();

        let op  = me.pageMapFeeder.remove(record),
            pos = [], result;

        if (op) {
            result = op.getResult();

            if (selModel.isSelected(record)) {
                selModel.deselect(record);
            }

            if (result.from) {
                pos.push(result.from);
            }
        }

        return me.refreshView(pos, false);
    },


    /**
     * Callback for the store's update event. Will check if this
     * grid's store sorter and sort order is affected by the update, and forward
     * to this PageMapFeeder's #update method. If a conjoon.cn_core.data.pageMap.Operation
     * instance is returned by this method, either its from or to (or both)
     * position(s) will be forwarded to #refreshView, which has the to decide
     * if the view is re-rendered.
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
     * @param {Boolean=true} ensureVisible true to call the grid's ensureVisible()
     * method IF the grid has a selection
     *
     * @return {Boolean} true if refreshing the view was delegated to this grid's
     * view, otherwise false
     *
     * @private
     */
    refreshView : function(positions, ensureVisible = true) {

        const me        = this,
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
            indexes.push(view.all.startIndex);

            view.refreshView(Math.min(...indexes));

            if (ensureVisible !== false) {
                let selection = grid.getSelection();
                if (selection.length) {
                    grid.ensureVisible(selection[0]);
                }
            }

            return true;
        }

        return false;
    },


    /**
     * Returns the current range of rendered indexes.
     * The end index of the computed range might not exist anymore in the
     * store, since this method might get called after a record has been
     * removed locally, but the view wasn't updated yet.
     *
     * @return {conjoon.cn_core.data.pageMap.IndexRange} the current range or
     * null if no range could be determined
     *
     * @private
     */
    getCurrentViewRange : function() {

        const me          = this,
              grid        = me.grid,
              view        = grid.getView(),
              rows        = view.all,
              PageMapUtil = conjoon.cn_core.data.pageMap.PageMapUtil;

        if (rows.endIndex === -1) {
            return null;
        }

        let start = rows.startIndex,
            end   = rows.endIndex;

        return PageMapUtil.storeIndexToRange(start, end, me.getPageMap(), true);
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
     * Last resort for BufferedStore is to trigger the cachemiss which signals
     * that the pages between the start- and the end-index shoulc be loaded
     * immediately.
     * Since this feature might prevent Pages to be loaded in case they are
     * currently being used as Feeds, the cachemiss event will remove all
     * Feeds that would be replaced by the page(s) which are about to get
     * loaded.
     * This method will effectively release any "lock" that is considered by the
     * beforepretch-listener in this feature,
     *
     * @param {Ext.data.BufferedStore} store
     * @param {Number} start
     * @param {Number} end
     */
    onCacheMiss : function(store, start, end) {

        const me            = this,
              pageMap       = me.getPageMap(),
              PageMapUtil   = conjoon.cn_core.data.pageMap.PageMapUtil,
              pageMapFeeder = me.pageMapFeeder;

        let startPos = PageMapUtil.storeIndexToPosition(start, pageMap),
            endPos   = PageMapUtil.storeIndexToPosition(end, pageMap),
            startIdx = Math.min(startPos.getPage(), endPos.getPage()),
            endIdx   = Math.max(startPos.getPage(), endPos.getPage());

        for (let i = startIdx; i <= endIdx; i++) {
            if (!pageMap.peekPage(i) && pageMapFeeder.getFeedAt(i)) {
                pageMapFeeder.removeFeedAt(i);
            }
        }
    },


    /**
     * Callback for the pageadd-event.
     * Delegates to #cleanFeedsAndVetoed with the pageNumber.
     * When this callback is invoked, we assume the event was triggered for
     * a valid cause.
     *
     * @param {Ext.data.PageMap} pageMap
     * @param {Number} pageNumber
     *
     * @private
     *
     * @see #cleanFeedsAndVetoed
     */
    onPageAdd : function(pageMap, pageNumber) {
        this.cleanFeedsAndVetoed(pageNumber);
    },


    /**
     * Callback for the pageremove-event.
     * Delegates to #cleanFeedsAndVetoed with the pageNumber.
     * When this callback is invoked, we assume the event was triggered for
     * a valid cause.

     * @param {Ext.data.PageMap} pageMap
     * @param {Number} pageNumber
     *
     * @private
     *
     * @see #cleanFeedsAndVetoed
     */
    onPageRemove : function(pageMap, pageNumber) {
        this.cleanFeedsAndVetoed(pageNumber);
    },



    /**
     * Cancels prefetch by checking whether the required page exists as a Feed,
     * and, if that is the case, is currently not in the current view-range.
     *
     * @param {Ext.data.BufferedStore} store
     * @param {Ext.data.Operation} operation
     *
     * @return {Boolean} if this feature is okay with prefetching the requested
     * page, otherwise false
     *
     * @see #getCurrentViewRange
     */
    onBeforePrefetch : function(store, operation) {

        const me             = this,
              page           = operation.getPage(),
              pageMapFeeder  = me.pageMapFeeder,
              RecordPosition = conjoon.cn_core.data.pageMap.RecordPosition;

        if (pageMapFeeder.getFeedAt(page) &&
            !me.getCurrentViewRange().contains(RecordPosition.create(page, 0))) {
            return false;
        }

        return true;
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
     * @param {Ext.data.BufferedStore} store
     *
     * @return {Boolean} true if the requirements where successfully installed,
     * otherwise false, e.g. due to an empty store
     *
     * @private
     *
     * @throws if store is not an empty store or a BufferedStore
     */
    configure : function(store) {

        const me = this;

        if (store && store.isEmptyStore) {
            return false;
        }

        if (!store || !(store instanceof Ext.data.BufferedStore)) {
            Ext.raise({
                msg   : '\'store\' must be an instance of Ext.data.BufferedStore',
                store : store
            });
        }

        let pageMap = store.getData();

        // this is not needed since Ext.util.Event#addListener already checks
        // for duplicates and doesn't add one and the same event twice.
        // however, we want to be on the save side, our tests consider this
        // edge case
        me.mun(store, 'update',  me.onStoreUpdate, me);
        me.mon(store, 'update',  me.onStoreUpdate, me);

        me.mun(store, 'beforeprefetch',  me.onBeforePrefetch, me);
        me.mon(store, 'beforeprefetch',  me.onBeforePrefetch, me);

        me.mun(store, 'pageadd',  me.onPageAdd, me);
        me.mon(store, 'pageadd',  me.onPageAdd, me);

        me.mun(store, 'pageremove',  me.onPageRemove, me);
        me.mon(store, 'pageremove',  me.onPageRemove, me);

        me.mun(store, 'cachemiss',  me.onCacheMiss, me);
        me.mon(store, 'cachemiss',  me.onCacheMiss, me);


        if (me.pageMapFeeder) {
            me.mun(me.pageMapFeeder, 'cn_core-pagemapfeeder-pageremoveveto',  me.onPageRemoveVeto, me);
            me.pageMapFeeder.destroy();
            me.pageMapFeeder = null;
        }

        me.pageMapFeeder = Ext.create('conjoon.cn_core.data.pageMap.PageMapFeeder', {
            pageMap : pageMap
        });

        me.mon(me.pageMapFeeder, 'cn_core-pagemapfeeder-pageremoveveto',  me.onPageRemoveVeto, me);

        return true;
    },


    /**
     * Swaps the restoreFocus() method that is usually returned by the grid's
     * view "saveFocusState()" with a custom method that considers all store
     * data instead just a snapshot as assumed by the default implementation,
     * by overriding the NodeCache's (view.all) getCount() method to return the
     * totalCount of the store.
     *
     * @return {Boolean}
     *
     * @private
     */
    swapSaveFocusState : function() {
        const me   = this,
              view = me.view;

        view.saveFocusState = conjoon.cn_comp.grid.feature.Livegrid.prototype.saveFocusState;

        return true;
    },


    /**
     * Replacement-method for Ext.view.Table#saveFocusState.
     * This method gets called in the scope of the grid's view.
     *
     * @return {Function}
     *
     * @private
     *
     * @see swapSaveFocusState
     */
    saveFocusState : function() {

        const me = this;

        let tmp = me.all.getCount,
            res = Ext.view.Table.prototype.saveFocusState.apply(me, arguments);

        let func = function() {

            me.all.getCount = function() {
                return me.dataSource.getTotalCount();
            };
            res.apply(me);

            me.all.getCount = tmp;
        };


        return func;
    },


    /**
     * Will remove the Feed and the vetoedPage identified by pageNumber.
     *
     * @param {Number} pageNumber
     *
     * @private
     */
    cleanFeedsAndVetoed : function(pageNumber) {

        const me            = this,
              pageMapFeeder = me.pageMapFeeder,
              vetoedPages   = me.vetoedPages;

        pageMapFeeder.removeFeedAt(pageNumber);

        let idx = vetoedPages.indexOf(pageNumber);
        if (idx !== -1) {
            vetoedPages.splice(idx, 1);
        }
    },



});