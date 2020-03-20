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
 *              'isRead'         : {hidden : true},
 *              'subject'        : {hidden : true},
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
Ext.define("coon.comp.grid.feature.RowBodySwitch", {

    extend : "Ext.grid.feature.RowBody",

    alias : "feature.cn_comp-gridfeature-rowbodyswitch",

    /**
     * @cfg {String} enableCls
     * Additional css class that should be added to the grid's view as soon
     * as the feature gets enabled. Gets removed from the grid's view as soon as
     * the feature gets disabled.
     * @see disableCls
     */
    enableCls : "cn_comp-rowbodyswitch-enable",

    /**
     * @cfg {String} enableCls
     * Additional css class that should be added to the grid's view as soon
     * as the feature gets disabled. Gets removed from the grid's view as soon as
     * the feature gets enabled.
     * @see enableCls
     */
    disableCls : "cn_comp-rowbodyswitch-disable",

    /**
     * @cfg {Object} previewColumnConfig
     * Initial state of columns that should be shown along with the row body
     * when this feature gets enabled. The keys are the dataIndex of the column,
     * values are objects with information about their visibility, e.g.
     * {hidden : true/false}.
     */
    previewColumnConfig : null,


    /**
     * Set this explicitely to "false" to prevent rendering issues with Ext6.7. The problem
     * is that ExtJS set variableRowHeight for the grid/view automatically to "true" if a
     * RowBody plugin is detected. That leads to re-calculating the average rowHeight once pages
     * are loaded, and if the last page is loaded and only 34 remaining records are loaded into a page
     * that would fit 50, the average row height suddenly changes, although it has been fix for the
     * previous pages. This can cause trouble with BufferedStores where the user uses infinite scrolling.
     * Set this to false only if the contents of the RowBody are always the same for each and every
     * data loaded.
     *
     * @see BufferedRenderer#getScrollHeight
     */
    variableRowHeight : true,


    /**
     * @private
     */
    columnConfig : null,

    /**
     * @inheritdoc
     *
     * @see initFeatureForGrid
     */
    init : function (grid) {

        var me = this;

        if (grid.rendered) {
            me.initFeatureForGrid(grid);
        } else {
            grid.on("afterrender", me.initFeatureForGrid, me, {single : true});
        }

        me.callParent(arguments);

        if (me.variableRowHeight === false) {
            grid.variableRowHeight = grid.view.variableRowHeight = false;
        }

    },


    /**
     * @param {Ext.grid.Panel} grid The grid this feature should be initiated with
     *
     * @private
     */
    initFeatureForGrid : function (grid) {

        const me = this;

        if (!me.disabled) {
            me.saveColumns();
            grid.view.addCls(me.enableCls);
            me.restoreColumns(me.previewColumnConfig);
            grid.setHideHeaders(true);
        } else {
            grid.view.addCls(me.disableCls);
        }
    },


    /**
     * @inheritdoc
     */
    disable : function () {

        var me = this;

        if (!me.view.grid.rendered) {
            Ext.raise({
                msg : "Cannot disable since grid was not rendered yet."
            });
        }

        me.callParent(arguments);

        me.restoreColumns(me.columnConfig);
        me.disablePreview(true);
    },


    /**
     * @inheritdoc
     */
    enable : function () {

        var me = this;

        if (!me.view.grid.rendered) {
            Ext.raise({
                msg : "Cannot enable since grid was not rendered yet."
            });
        }

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
    disablePreview : function (disable) {

        var me      = this,
            view     = me.view,
            grid     = view.grid,
            gridBody = grid.body;

        disable = !!disable;

        grid.setHideHeaders(!disable);

        if (disable) {
            /**
             * @bug https://www.sencha.com/forum/showthread.php?308038-grid-hideHeaders-true-and-border-true-border-top-not-visible
             */
            gridBody.removeCls("x-noborder-trbl").addCls("x-noborder-rbl");
            view.addCls(me.disableCls).removeCls(me.enableCls);
        } else {
            gridBody.removeCls("x-noborder-rbl").addCls("x-noborder-trbl");
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
    saveColumns : function () {

        var me           = this,
            view         = me.view,
            grid         = view.grid,
            columns      = grid.getColumns(),
            columnConfig = {},
            col;

        for (var i = 0, len = columns.length; i < len; i++) {
            col = columns[i];

            columnConfig[col.dataIndex] = {
                hidden : col.rendered
                    ? col.isHidden()
                    : col.hidden === true,
                width : col.rendered
                    ? col.getWidth() === 0
                        ? undefined
                        : col.getWidth()
                    : col.width
                        ? col.width
                        : undefined
            };

            if (columnConfig[col.dataIndex].width === undefined) {
                delete columnConfig[col.dataIndex].width;
            }
            if (!col.rendered && col.flex) {
                delete columnConfig[col.dataIndex].width;
                columnConfig[col.dataIndex].flex = col.flex;
            }
        }

        me.columnConfig = columnConfig;
    },


    /**
     * Restores the column model and their positions based on the information
     * passed in the object, wheres the keys are the dataIndex of the associated
     * column, and the value is an object with information about the state (e.g.
     * {hidden : true/false}.
     *
     * @param {Object} columnConfig
     *
     * @private
     *
     * @see previewColumnConfig
     * @see columnConfig
     * @see saveColumns
     */
    restoreColumns : function (columnConfig) {
        var me           = this,
            view         = me.view,
            grid         = view.grid,
            columns      = grid.getColumns(),
            col          = null,
            dataIndex    = null,
            restoreCount = 0,
            configCol, i , len;

        for (dataIndex in columnConfig) {
            if (!Object.prototype.hasOwnProperty.call(columnConfig, dataIndex)) {
                continue;
            }

            for (i = 0, len = columns.length; i < len; i++) {
                col = columns[i];
                col.setVisible(true);

                if (col.dataIndex === dataIndex) {
                    grid.headerCt.move(i, restoreCount);
                    columns = grid.getColumns();
                    break;
                }
            }

            restoreCount++;
        }

        columns = grid.getColumns();
        for (i = 0, len = columns.length; i < len; i++) {
            col       = columns[i];
            configCol = columnConfig[col.dataIndex];
            if (configCol.hidden === true) {
                col.setVisible(false);
            }
            if (configCol.flex !== undefined) {
                col.setFlex(configCol.flex);
            } else if (configCol.width !== undefined) {
                col.setWidth(configCol.wdth);
            }
        }

    }


});