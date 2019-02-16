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
 * Ext.ux.ajax.SimManager hook for fixture data.
 */
Ext.define('coon.comp.fixtures.sim.ItemSim', {

    requires : [
        'coon.comp.fixtures.sim.Init',
        'coon.comp.fixtures.sim.ItemTable'
    ]

}, function() {

    Ext.ux.ajax.SimManager.register({
        type : 'json',

        url  : /cn_comp\/fixtures\/Livegrid(\/\d+)?/,

        doPut : function(ctx) {

            var me        = this,
                ret       = {},
                ItemTable = coon.comp.fixtures.sim.ItemTable,
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

            var idPart    = ctx.url.match(this.url)[1],
                filters   = ctx.params.filter,
                isEmpty   = ctx.params.isEmpty,
                id,
                ItemTable = coon.comp.fixtures.sim.ItemTable,
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

                if (isEmpty) {
                    return [];
                }
                return items;
            }
        }
    });



});