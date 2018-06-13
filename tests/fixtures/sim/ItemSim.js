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
 * Ext.ux.ajax.SimManager hook for fixture data.
 */
Ext.define('conjoon.cn_comp.fixtures.sim.ItemSim', {

    requires : [
        'conjoon.cn_comp.fixtures.sim.Init',
        'conjoon.cn_comp.fixtures.sim.ItemTable'
    ]

}, function() {

    Ext.ux.ajax.SimManager.register({
        type : 'json',

        url  : /cn_comp\/fixtures\/BufferedStoreEnhancerItems(\/\d+)?/,

        doPut : function(ctx) {

            var me        = this,
                ret       = {},
                ItemTable = conjoon.cn_comp.fixtures.sim.ItemTable,
                values    = {};

            for (var i in ctx.xhr.options.jsonData) {
                if (!ctx.xhr.options.jsonData.hasOwnProperty(i)) {
                    continue;
                }
                values[i] = ctx.xhr.options.jsonData[i];
            }

            ItemTable.updateItem(ctx.xhr.options.jsonData.id, values);

            Ext.Array.forEach(me.responseProps, function (prop) {
                if (prop in me) {
                    ret[prop] = me[prop];
                }
            });

            return ret;
        },


        data: function(ctx) {

            var idPart  = ctx.url.match(this.url)[1],
                filters = ctx.params.filter,
                id,
                ItemTable = conjoon.cn_comp.fixtures.sim.ItemTable,
                items     = ItemTable.getItems();

            if (idPart) {
                id = parseInt(idPart.substring(1), 10);
                return {data : Ext.Array.findBy(
                    items,
                    function(item) {
                        return item.id === '' + id;
                    }
                )};
            } else if (filters) {
                Ext.raise('no filter supported');
            } else {

                return items;
            }
        }
    });



});