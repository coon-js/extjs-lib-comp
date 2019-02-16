/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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
 *
 */
Ext.define('coon.comp.fixtures.sim.ItemTable', {

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
            'Welcome to coon',
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