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
