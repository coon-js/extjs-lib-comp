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

/**
 *
 */
Ext.define('conjoon.cn_comp.fixtures.sim.ItemTable', {

    singleton : true,

    items : null,

    baseItems : null,


    buildRandomNumber : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    buildRandomDate : function() {
        var me = this,
            d  = me.buildRandomNumber(1, 31),
            m  = me.buildRandomNumber(1, 12),
            y  = me.buildRandomNumber(2007, 2017),
            h  = me.buildRandomNumber(0, 23),
            i  = me.buildRandomNumber(0, 59),
            pad = function(v) {
                return v < 10 ? '0' + v : v;
            };

        return Ext.String.format(
            "{0}-{1}-{2} {3}:{4}",
            y, pad(m), pad(d), pad(h), pad(i)
        );
    },

    updateItem : function(id, values) {

        var me = this;

        me.updateAllItemData(id, values);
    },

    updateAllItemData : function(id, values) {
        var me     = this,
            item   = me.getItem(id),
            dataItems = [draft, item],
            dataItems, item;

        for (var i = 0, len = dataItems.length; i < len; i++) {

            item = dataItems[i];

            // possible that we landed from DraftAttachment Test here and that
            // items are not existing
            if (!item) {
                continue;
            }
            item['date'] = Ext.util.Format.date(new Date(), 'Y-m-d H:i');

            for (var prop in values) {

                if (!item.hasOwnProperty(prop)) {
                    continue;
                }

                switch (prop) {
                    case 'to':
                    case 'cc':
                    case 'bcc':
                        if (Ext.isString(values[prop]))
                        item[prop] = Ext.JSON.decode(values[prop]);
                        break;
                    default:
                        item[prop] = values[prop];
                        break;
                }


            }

        }
    },


    getItem : function(id) {
        var me    = this,
            items = me.getItems();

        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i]['id'] == id) {
                return items[i];
            }
        }

        return null;
    },


    getItems : function() {

        var me        = this,
            baseItems = me.buildBaseItems(),
            items = subjects = sender = [];

        if (me.items) {
            return me.items;
        }

        for (var i = 0; i < baseItems.length; i++) {

            items.push(Ext.apply({
                // leave first one as unread for tests
                isRead         : i == 0 ? false : (me.buildRandomNumber(0, 1) ? true : false)
            }, baseItems[i]));
        }

        me.items = items;

        return me.items;
    },

    buildBaseItems : function() {
        var me = this,
            baseItems = subjects = sender = [];

        if (me.baseItems) {
            return me.baseItems;
        }

        subjects = [
            'Welcome to conjoon',
            'Re: Ihre Buchung in der Unterkunft',
            'Achtung! DVBT Antennen sind bald nutzlos, Thorsten Suckow-Homberg',
            'Verbindliche Bestellung Banshee Headbadge',
            'Vielen Dank für Ihre Bestellung',
            'Monte Walsh [Blu Ray] und mehr aus DVD & Blu Ray Klassiker'
        ];

        sender = [
            'tsuckow@conjoon.org',
            'service@bosafasf.com',
            'info@eawerrrbay.de',
            'mailer@msafsf.de',
            'service@owrfdgso.de',
            'info@dsgewtewon.de'
        ];

        for (var i = 0; i < 10000; i++) {

            baseItems.push({
                id      : (i + 1) + '',
                date    : me.buildRandomDate(),
                subject : ' - ' + (i) + ' - ' + subjects[me.buildRandomNumber(0, 5)],
                from    : i === 0
                           ? 'from@domain.tld'
                           : sender[me.buildRandomNumber(0, 5)],
                testProp : i
            });
        }

        me.baseItems = baseItems;

        return me.baseItems;
    }


});