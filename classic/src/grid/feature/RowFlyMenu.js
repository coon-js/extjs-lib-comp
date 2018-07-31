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
 * Grid Feature which renders a menu on top of a grid row. Best used with
 * grid configurations with enabled rowBodies.
 *
 *
 *  @example
 *
 *  Ext.define('MyGrid', {
 *
 *      extend : 'Ext.grid.Panel',
 *
 *      features : [{
 *          ftype : 'cn_comp-gridfeature-rowflymenu',
 *          id    : 'cn_mail-mailMessageFeature-rowFlyMenu',
 *          items  : [{
 *              cls    : 'fa fa-envelope-o',
 *              title  : 'Mark as Unread',
 *              action : 'markunread',
 *              id     : 'cn_mail-mailMessageFeature-rowFlyMenu-markUnread'
 *         }],
 *         alignTo : ['tr-tr', [-12, 4]]
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
 *
 *
 */
Ext.define('conjoon.cn_comp.grid.feature.RowFlyMenu', {

    extend : 'Ext.grid.feature.Feature',

    alias : 'feature.cn_comp-gridfeature-rowflymenu',

    cls : 'cn_comp-rowflymenu',

    /**
     * Gets firec when an item of this menu was clicked that was configured
     * with an action.
     * @event itemclick
     * @param this
     * @param {HtmlElement} item
     * @param {String} action
     * @param {Ext.data.Model} record The record for which the menu was shown
     */


    /**
     * Gets fired when this menu is about to get shown.
     * @event beforemenushow
     * @param this
     * @param {HtmlElement} item
     * @param {Ext.data.Model} record The record for which the menu will be shown
     */

    /**
     * Maps item-ids to their actions.
     * @type {Object}
     * @private
     */
    idToActionMap : null,

    /**
     * The menu that gets created from #items for this Feature.
     * @type {Ext.Element}
     * @private
     */
    menu : null,


    /**
     * @cfg {Array} An array of element-configurations representing the items
     * for the RowFlyMenu. See #processItems
     * @cfg {Array} items
     */
    items : null,


    /**
     * Lets you specify how the RowFlyMenu gets aligned to the rowitem for which
     * it is being shown. If configured as an array, the array should comply
     * with the specificatiosn of the alignTo()-method.
     * @cfg {String/Array} alignTo
     */
    alignTo : 'tr-tr',


    /**
     * The record represented by the grid row for which the menu is currently
     * shown.
     * @tape {Ext.data.Model}
     * @private
     */
    currentRecord : null,

    /**
     * @inheritdoc
     */
    init : function(grid) {

        const me = this;

        me.menu = me.buildMenu(me.items);

        me.mon(me.menu, {
            'tap'       : me.onMenuClick,
            'mouseover' : me.onMenuMouseOver,
            'mouseout'  : me.onMenuMouseOut,
             scope      : me
        });

        delete me.items;

        me.installListeners(grid);

        me.callParent(arguments);
    },


    /**
     * Callback for the menu's mouseover event.
     *
     * @param {Ext.Event}evt
     * @param {HtmlElement} target
     */
    onMenuMouseOver : function(evt, target) {
        if (target.className.indexOf('cn-item') !== -1) {
            Ext.fly(target).addCls('cn-over')
        }
    },


    /**
     * Callback for the menu's mouseout event.
     *
     * @param {Ext.Event}evt
     * @param {HtmlElement} target
     */
    onMenuMouseOut : function(evt, target) {
        if (target.className.indexOf('cn-item') !== -1) {
            Ext.fly(target).removeCls('cn-over')
        }
    },


    /**
     * Callback for the tap-event of this feature's menu. Will try to mao the
     * event-source's id to an action (if specified for #items). If an action was
     * found, the event #itemclick is fired with appropriate information.
     *
     * @param {Ext.Event} evt
     * @param {HtmlElement} target
     */
    onMenuClick : function(evt, target) {

        const me         = this,
              idToAction = me.idToActionMap,
              action     = idToAction[target.id];

        evt.stopEvent();

        if (!action) {
            return;
        }

        me.fireEvent('itemclick', me, target, action, me.currentRecord);
    },


    /**
     * Callback for the itemmouseenter-event of this feature's grid. Makes sure
     * the menu is shown and aligned properly to this event's HTML-source (item).
     * Does nothing if this feature is disabled.
     * Triggers the #beforemenushow-event. If any listener returns false, te
     * menu will not get shown.
     *
     * @param {Ext.view.Table} view
     * @param {Ext.data.Model} record
     * @param {HtmlElement} item
     * @param {Number} index
     * @param {Ext.Event} e
     * @param {Object} eOpts
     *
     * @private
     */
    onItemMouseEnter : function(view, record, item, index, e, eOpts) {

        const me = this;

        if (me.disabled) {
            return;
        }

        e.stopEvent();

        me.currentRecord = record;

        if (me.fireEvent('beforemenushow', me, item, record) === false) {
            me.currentRecord = null;
            return;
        }

        Ext.fly(item).appendChild(me.menu);
        me.menu.show();
        me.menu.alignTo.apply(me.menu, [item].concat(me.alignTo));
    },


    /**
     * Callback for the itemmouseleave-event of this feature's grid. Makes sure
     * the menu is hidden again.
     * Does nothing if this feature is disabled.
     *
     * @param {Ext.view.Table} view
     * @param {Ext.data.Model} record
     * @param {HtmlElement} item
     * @param {Number} index
     * @param {Ext.Event} e
     * @param {Object} eOpts
     *
     * @private
     *
     * @see detachMenuAndUnset
     */
    onItemMouseLeave : function(view, record, item, index, e, eOpts) {

        const me = this;

        if (me.disabled) {
            return;
        }

        e.stopEvent();
        me.detachMenuAndUnset();
    },


    /**
     * Installs the callbacks for itemmouseenter- and itemmouseleave-events of
     * the specified grid.
     *
     * @param {Ext.grid.Panel} grid
     *
     * @private
     */
    installListeners : function(grid) {

        const me = this;

        grid.view.on('beforerefresh', me.onBeforeGridViewRefresh, me);
        grid.on('itemmouseenter', me.onItemMouseEnter, me);
        grid.on('itemmouseleave', me.onItemMouseLeave, me);
    },


    /**
     * Processes the specified items and creates an Ext.dom.Element wrapping the
     * native HTMLElement. The created  Ext.Element's skipGarbageCollection-property
     * is explicitely set to true to prevend it from being removed by ExtJS'
     * (DOM-)GarbageCollector.
     *
     * @param {Array} items The items for this RowFlyMenu
     *
     * @return {Ext.dom.Element}
     *
     * @see #processItems
     *
     * @private
     */
    buildMenu : function(items) {

        const me = this;

        let childs = me.processItems(items), el;

        let re = Ext.Element.create({
            tag       : 'div',
            cls       : me.cls,
            children : childs
        }, true);

        el = Ext.create('Ext.Element', re);
        el.skipGarbageCollection = true;

        return el;
    },


    /**
     * Processes configuration items and returns them decorated with needed
     * informations for this class.
     * Fills the idToActionMap-object.
     *
     * @param {Array} items
     *
     * @private
     */
    processItems : function(items) {

        const me = this;

        let childs = [], item;

        me.idToActionMap = {};

        for (let i = 0, len = items.length; i < len; i++) {

            item = Ext.apply({}, items[i]);

            item.tag = item.tag ? item.tag : 'div';

            item.cls = item.cls ? 'cn-item ' + item.cls : 'cn-item';

            item.id = item.id ? item.id : Ext.id();

            if (item.action) {
                me.idToActionMap[item.id] = item.action;
                delete item.action;
            }

            childs.push(item)
        }

        return childs;
    },


    /**
     * @inheritdoc
     */
    disable : function() {

        const me = this;

        me.detachMenuAndUnset();

        me.callParent(arguments);
    },


    /**
     * Callback for the grid view's beforerefresh-event.
     * Delegates to #detachMenu
     *
     * @private
     *
     * @see detachMenuAndUnset
     */
    onBeforeGridViewRefresh : function() {

        const me = this;

        me.detachMenuAndUnset();
    },


    /**
     * Detaches the #menu from any parent it currently has and sets the
     * #currentRecord for this menu to null.
     *
     */
    detachMenuAndUnset : function() {

        const me    = this,
              menu  = me.menu;

        if (menu.dom.parentNode) {
            Ext.fly(menu.dom.parentNode).removeChild(menu);
        }
        me.currentRecord = null;
    },


    /**
     * Makes sure #menu gets destroyed.
     *
     * @inheritdoc
     */
    destroy : function() {

        const me = this;

        me.menu.destroy();
        me.menu = null;

        return me.callParent(arguments);
    }

});