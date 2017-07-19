/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2017 Thorsten Suckow-Homberg/conjoon.org
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
 * Grid Feature which extends RowBody and is capable to switch between regular
 * grid view and view with RowBody enabled by calling this feature's
 * #disable()/#enable() methods.
 * This feature tries to remember current column state to make sure
 * when switching to detail view by disabling this feature the columns are
 * re-arranged in their last known order and their proper visibility state.
 * By specifying #previewColumnConfig, this feature knows about the columns
 * that should be initially rendered along with the preview body.
 *
 * Note:
 * =====
 *  - You must still override #getAdditionalData() to make sure the RowBody is
 *  rendered. Make sure you return "undefined" if this feature is disabled.
 *  - This feature hides the column headers when it gets enabled.
 *
 *  @example
 *
 *  Ext.define('MyGrid', {
 *
 *      extend : 'Ext.grid.Panel',
  *
 *      features : [{
 *          ftype              : 'cn_comp-gridfeature-rowbodyswitch',
 *          id                 : 'rowbodyswitchfeature',
 *          getAdditionalData  : function (data, idx, record, orig) {
 *
 *              var me = this;
 *
 *              if (me.disabled) {
 *                  return undefined;
 *              }
 *
 *              return {
 *                  rowBody : 'Subject: <div>' + record.get('subject') + '</div>'
 *              };
 *          },
 *          previewColumnConfig : {
 *              'isRead'         : {visible : false},
 *              'subject'        : {visible : false},
 *              'to'             : {}
 *          }
 *      }],
 *
 *      store : {
 *          fields : ['isRead', 'subject', 'to'],
 *          data   : [{
 *              isRead : false, subject : 'Subject 1', to : 'to 1'
 *          }, {
 *              isRead : true, subject : 'Subject 2', to : 'to 2'
 *          }, {
 *              isRead : false, subject : 'Subject 3', to : 'to 3'
 *          }],
 *       },
 *
 *      columns : [{
 *          text      : 'Read',
 *          dataIndex : 'isRead',
 *      }, {
 *          text      : 'Subject',
 *          dataIndex : 'subject'
 *      }, {
 *          text      : 'To',
 *          dataIndex : 'to'
 *      }]
 *
 *   });
 *
 *   var myGrid = Ext.create('MyGrid', {
 *      renderTo : document.body
 *   ));
 *
 *   var feature = myGrid.view.getFeature('rowbodyswitchfeature');
 *
 *   feature.disable();
 *   feature.enable();
 *
 *
 *
 */
Ext.define('conjoon.cn_comp.grid.feature.RowBodySwitch', {

    extend : 'Ext.grid.feature.RowBody',

    alias : 'feature.cn_comp-gridfeature-rowbodyswitch',

    /**
     * @cfg {String} enableCls
     * Additional css class that should be added to the grid's view as soon
     * as the feature gets enabled. Gets removed from the grid's view as soon as
     * the feature gets disabled.
     * @see disableCls
     */
    enableCls : 'cn_comp-rowbodyswitch-enable',

    /**
     * @cfg {String} enableCls
     * Additional css class that should be added to the grid's view as soon
     * as the feature gets disabled. Gets removed from the grid's view as soon as
     * the feature gets enabled.
     * @see enableCls
     */
    disableCls : 'cn_comp-rowbodyswitch-disable',

    /**
     * @cfg {Object} previewColumnConfig
     * Initial state of columns that should be shown along with the row body
     * when this feature gets enabled. The keys are the dataIndex of the column,
     * values are objects with information about their visibility, e.g.
     * {visible : true/false}.
     */
    previewColumnConfig : null,

    /**
     * @private
     */
    columnConfig : null,

    /**
     * @inheritdoc
     */
    init : function(grid) {

        var me = this;

        if (!me.disabled) {
            me.saveColumns();
            grid.view.addCls(me.enableCls);
            me.restoreColumns(me.previewColumnConfig);
            grid.setHideHeaders(true);
        } else {
            grid.view.addCls(me.disableCls);
        }

        me.callParent(arguments);
    },


    /**
     * @inheritdoc
     */
    disable : function() {

        var me = this;
        me.callParent(arguments);

        me.restoreColumns(me.columnConfig);
        me.disablePreview(true);
    },


    /**
     * @inheritdoc
     */
    enable : function() {

        var me = this;

        me.callParent(arguments);

        me.saveColumns();
        me.restoreColumns(me.previewColumnConfig);
        me.disablePreview(false);
    },


    /**
     * Disables or enables this features based on the specified argument.
     * This feature controls the view and the grid it is used with by showing/
     * hiding grid columns, refreshing the view and changing css classes accordingly.
     *
     * @param {Boolean} disable true to disable this feature
     */
    disablePreview : function(disable) {

        var me      = this,
            disable = !!disable,
            view     = me.view,
            grid     = view.grid,
            gridBody = grid.body;

        grid.setHideHeaders(!disable);

        if (disable) {
            /**
             * @bug https://www.sencha.com/forum/showthread.php?308038-grid-hideHeaders-true-and-border-true-border-top-not-visible
             */
            gridBody.removeCls('x-noborder-trbl').addCls('x-noborder-rbl');
            view.addCls(me.disableCls).removeCls(me.enableCls);
        } else {
            gridBody.removeCls('x-noborder-rbl').addCls('x-noborder-trbl');
            view.addCls(me.enableCls).removeCls(me.disableCls);
        }

        view.refresh();
    },


    /**
     * Saves the current state of the columns (position and visibility) to make
     * sure it's possible to re-apply this exact state later on when switching
     * between states.
     *
     * @private
     */
    saveColumns : function() {

        var me           = this,
            view         = me.view,
            grid         = view.grid,
            columns      = grid.getColumns(),
            columnConfig = {},
            col;


        for (var i = 0, len = columns.length; i < len; i++) {
            col = columns[i];

            columnConfig[col.dataIndex] = {
                visible : col.rendered
                    ? col.isVisible()
                    : col.visible !== false
            };
        }

        me.columnConfig = columnConfig;
    },


    /**
     * Restores the column model and their positions based on the information
     * passed in the object, wheres the keys are the dataIndex of the associated
     * column, and the value is an object with information about the state (e.g.
     * {visible : true/false}.
     *
     * @param {Object} columnConfig
     *
     * @private
     *
     * @see previewColumnConfig
     * @see columnConfig
     * @see saveColumns
     */
    restoreColumns : function(columnConfig) {
        var me           = this,
            view         = me.view,
            grid         = view.grid,
            columns      = grid.getColumns(),
            col          = null,
            dataIndex    = null,
            restoreCount = 0;

        for (dataIndex in columnConfig) {
            if (!columnConfig.hasOwnProperty(dataIndex)) {
                continue;
            }

            for (var i = 0, len = columns.length; i < len; i++) {
                col = columns[i];
                col.setVisible(true);

                if (col.dataIndex == dataIndex) {
                    grid.headerCt.move(i, restoreCount);
                    columns = grid.getColumns();
                    break;
                }
            }

            restoreCount++;
        }

        columns = grid.getColumns();
        for (var i = 0, len = columns.length; i < len; i++) {
            col = columns[i];
            if (columnConfig[col.dataIndex].visible === false) {
                col.setVisible(false);
            }
        }

    }


});