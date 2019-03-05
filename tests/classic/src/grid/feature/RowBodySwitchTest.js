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

describe('coon.comp.grid.feature.RowBodySwitchTest', function(t) {

    var grid;

    var getGrid = function(disabled, rendered = true) {

        return Ext.create('Ext.grid.Panel', {

            renderTo : rendered ? document.body : undefined,

            width  : 510,
            height : 200,

            features : [{
                disabled           : !!disabled,
                ftype              : 'cn_comp-gridfeature-rowbodyswitch',
                id                 : 'rowbodyswitchfeature',
                getAdditionalData  : function (data, idx, record, orig) {

                    var me = this;

                    if (me.disabled) {
                        return undefined;
                    }

                    return {
                        rowBody : 'Subject: <div>' + record.get('subject') + '</div>'
                    };
                },
                previewColumnConfig : {
                    'isRead'  : {hidden : true},
                    'subject' : {hidden : true},
                    'to'      : {flex : 1}
                }
            }],

            store : {
                fields : ['isRead', 'subject', 'to'],
                data   : [{
                    isRead : false, subject : 'Subject 1', to : 'to 1'
                }, {
                    isRead : true, subject : 'Subject 2', to : 'to 2'
                }, {
                    isRead : false, subject : 'Subject 3', to : 'to 3'
                }]
            },

            columns : [{
                text      : 'Read',
                dataIndex : 'isRead',
                flex      : 1
            }, {
                text      : 'Subject',
                dataIndex : 'subject',
                flex      : 1
            }, {
                text      : 'To',
                dataIndex : 'to',
                hidden    : true
            }]

        });


    };




// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.requireOk('coon.comp.grid.feature.RowBodySwitch', function() {


        t.it('test class and configuration', function(t) {
            var grid    = getGrid(false),
                feature = grid.view.getFeature('rowbodyswitchfeature');

            t.isInstanceOf(feature, 'coon.comp.grid.feature.RowBodySwitch');

            t.expect(feature.alias).toContain('feature.cn_comp-gridfeature-rowbodyswitch');

            t.expect(feature.enableCls).toContain('cn_comp-rowbodyswitch-enable');
            t.expect(feature.disableCls).toContain('cn_comp-rowbodyswitch-disable');

            grid.destroy();
        });


        t.it('enable()/disable() - excpetion', function(t) {

            const grid    = getGrid(false, false),
                  feature = grid.view.getFeature('rowbodyswitchfeature');

            let exc, e;

            try{feature.enable()}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain("cannot enable");

            exc = e = undefined;

            try{feature.disable()}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain("cannot disable");
        });


        t.it('enable()/disable()', function(t) {
            var grid    = getGrid(false),
                feature = grid.view.getFeature('rowbodyswitchfeature'),
                columns = grid.getColumns(),
                recalcWidth;

            let fc = Ext.copy(feature.columnConfig);
            for (let i in fc) {
                delete fc[i].width;
            }

            t.expect(fc).toEqual({
                isRead  : {hidden : false},
                subject : {hidden : false},
                to      : {hidden : true}
            });

            t.expect(feature.disabled).toBeFalsy();
            t.expect(feature.getAdditionalData(null, null, {get:function(){return 'a';}})).toBeDefined();

            t.expect(grid.getHideHeaders()).toBe(true);

            t.expect(grid.view.hasCls(feature.enableCls)).toBe(true);
            t.expect(grid.view.hasCls(feature.disableCls)).toBe(false);

            t.expect(columns[0].isVisible()).toBe(false);
            t.expect(columns[0].isVisible()).toBe(false);

            t.expect(columns[0].dataIndex).toBe('isRead');

            t.expect(columns[1].isVisible()).toBe(false);
            t.expect(columns[1].dataIndex).toBe('subject');

            t.expect(columns[2].isVisible()).toBe(true);
            t.expect(columns[2].dataIndex).toBe('to');
            t.expect(columns[2].flex).toBe(1);


            feature.disable();
            t.expect(feature.disabled).toBeTruthy();
            t.expect(feature.getAdditionalData()).toBeUndefined();

            grid.headerCt.move(1, 0);
            columns = grid.getColumns();
            columns[0].setVisible(true);
            columns[1].setVisible(false);
            columns[2].setVisible(true);

            columns[2].setWidth(210);
            recalcWidth = columns[2].getWidth();

            t.expect(columns[0].dataIndex).toBe('subject');
            t.expect(columns[1].dataIndex).toBe('isRead');
            t.expect(columns[2].dataIndex).toBe('to');

            feature.enable();
            t.expect(grid.view.hasCls(feature.enableCls)).toBe(true);
            t.expect(grid.view.hasCls(feature.disableCls)).toBe(false);
            columns = grid.getColumns();
            t.expect(columns[0].dataIndex).toBe('isRead');
            t.expect(columns[1].dataIndex).toBe('subject');
            t.expect(columns[2].dataIndex).toBe('to');
            t.expect(columns[0].isVisible()).toBe(false);
            t.expect(columns[1].isVisible()).toBe(false);
            t.expect(columns[2].isVisible()).toBe(true);

            feature.disable();
            t.expect(grid.view.hasCls(feature.enableCls)).toBe(false);
            t.expect(grid.view.hasCls(feature.disableCls)).toBe(true);
            columns = grid.getColumns();
            t.expect(columns[0].isVisible()).toBe(true);
            t.expect(columns[1].isVisible()).toBe(false);
            t.expect(columns[2].isVisible()).toBe(true);
            t.expect(columns[2].getWidth()).toBe(recalcWidth);

            grid.destroy();
        });


        t.it('featured initially disabled', function(t) {

            var grid    = getGrid(true),
                feature = grid.view.getFeature('rowbodyswitchfeature');

            t.expect(feature.disabled).toBe(true);

            t.expect(grid.getHideHeaders()).toBeFalsy();

            t.expect(grid.view.hasCls(feature.enableCls)).toBe(false);
            t.expect(grid.view.hasCls(feature.disableCls)).toBe(true);

            grid.destroy();

        });

    });


});