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
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

describe('conjoon.cn_comp.grid.feature.RowBodySwitchTest', function(t) {

    var grid;

    t.beforeEach(function() {
        grid = Ext.create('Ext.grid.Panel', {

            renderTo : document.body,

            extend : 'Ext.grid.Panel',

            width  : 400,
            height : 200,

            features : [{
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
                    'isRead'  : {visible : false},
                    'subject' : {visible : false},
                    'to'      : {}
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
                dataIndex : 'isRead'
            }, {
                text      : 'Subject',
                dataIndex : 'subject'
            }, {
                text      : 'To',
                dataIndex : 'to',
                visible   : false
            }]

        });
    });

    t.afterEach(function() {
        if (grid) {
            grid.destroy();
            grid = null;
        }
    });



// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.requireOk('conjoon.cn_comp.grid.feature.RowBodySwitch', function() {


        t.it('test class and configuration', function(t) {
            var feature = grid.view.getFeature('rowbodyswitchfeature');

            t.isInstanceOf(feature, 'conjoon.cn_comp.grid.feature.RowBodySwitch');

            t.expect(feature.alias).toContain('feature.cn_comp-gridfeature-rowbodyswitch');

            t.expect(feature.enableCls).toContain('cn_comp-rowbodyswitch-enable');
            t.expect(feature.disableCls).toContain('cn_comp-rowbodyswitch-disable');

        });


        t.it('enable()/disable()()', function(t) {
            var feature = grid.view.getFeature('rowbodyswitchfeature'),
                columns = grid.getColumns();

            t.expect(feature.columnConfig).toEqual({
                isRead  : {visible : true},
                subject : {visible : true},
                to      : {visible : false}
            });

            t.expect(feature.disabled).toBeFalsy();
            t.expect(feature.getAdditionalData(null, null, {get:function(){return 'a';}})).toBeDefined();

            t.expect(columns[0].isVisible()).toBe(false);
            t.expect(columns[0].dataIndex).toBe('isRead');

            t.expect(columns[1].isVisible()).toBe(false);
            t.expect(columns[1].dataIndex).toBe('subject');

            t.expect(columns[2].isVisible()).toBe(true);
            t.expect(columns[2].dataIndex).toBe('to');

            feature.disable();
            t.expect(feature.disabled).toBeTruthy();
            t.expect(feature.getAdditionalData()).toBeUndefined();


            grid.headerCt.move(1, 0); 
            columns = grid.getColumns();
            columns[0].setVisible(true);
            columns[1].setVisible(false);
            columns[2].setVisible(true);

            t.expect(columns[0].dataIndex).toBe('subject');
            t.expect(columns[1].dataIndex).toBe('isRead');
            t.expect(columns[2].dataIndex).toBe('to');

            feature.enable();
            columns = grid.getColumns();
            t.expect(columns[0].dataIndex).toBe('isRead');
            t.expect(columns[1].dataIndex).toBe('subject');
            t.expect(columns[2].dataIndex).toBe('to');
            t.expect(columns[0].isVisible()).toBe(false);
            t.expect(columns[1].isVisible()).toBe(false);
            t.expect(columns[2].isVisible()).toBe(true);

            feature.disable();
            columns = grid.getColumns();
            t.expect(columns[0].isVisible()).toBe(true);
            t.expect(columns[1].isVisible()).toBe(false);
            t.expect(columns[2].isVisible()).toBe(true);


        });
    });



});