/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 201z Thorsten Suckow-Homberg/conjoon.org
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

describe('conjoon.cn_comp.form.field.FileButtonTest', function(t) {


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    t.it('Sanitize FileButton class', function(t) {

        var button = Ext.create('conjoon.cn_comp.form.field.FileButton');

        t.expect(button instanceof Ext.form.field.FileButton).toBe(true);
        t.expect(button.alias).toContain('widget.cn_comp-formfieldfilebutton');
        t.expect(button.afterTpl.join(" ")).toContain('multiple="true"');

        button.destroy();
        button = null;
    });

    t.it('Make sure fireChange() passes fourth argument', function(t) {

        var button = Ext.create('conjoon.cn_comp.form.field.FileButton', {
                renderTo : document.body
            }),
            checkA, checkB, checkC, checkD;

        button.on('change', function(a, b, c, d) {
            checkA = a;
            checkB = b;
            checkC = c;
            checkD = d;
        });

        t.expect(checkA).toBeUndefined();
        t.expect(checkB).toBeUndefined();
        t.expect(checkC).toBeUndefined();
        t.expect(checkD).toBeUndefined();

        button.fireChange({});

        t.expect(checkA).toBeDefined();
        t.expect(checkB).toBeDefined();
        t.expect(checkC).toBeDefined();
        t.expect(checkD).toBeDefined();
        t.expect(checkD instanceof FileList).toBe(true);


        button.destroy();
        button = null;
    });


});
