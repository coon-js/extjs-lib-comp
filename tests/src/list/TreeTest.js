/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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

describe('coon.comp.list.TreeTest', function(t) {

    var tree,
        treeConfig;

    t.beforeEach(function() {
        treeConfig = {renderTo : document.body};
    });

    t.afterEach(function() {
        if (tree) {
            tree.destroy();
            tree = null;
        }
    });


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    t.it("Should create and show the tree", function(t) {
        tree = Ext.create('coon.comp.list.Tree', treeConfig);

        t.expect(tree instanceof Ext.list.Tree).toBe(true);
        t.expect(tree.alias).toContain('widget.cn_comp-listtree');
    });

    t.it("Should evaluate getMicro to false", function(t) {
        var tree = Ext.create('coon.comp.list.Tree', {width : 200});
        t.expect(tree.getMicro()).toBeFalsy();
        tree.destroy();
    });

    t.it("Should process width properly", function(t) {
        var tree = Ext.create('coon.comp.list.Tree', {width : 200});
        t.expect(tree.defaultWidth).toBe(200);
        tree.destroy();

        tree = Ext.create('coon.comp.list.Tree');
        t.expect(tree.defaultWidth).toBe(250);
        tree.destroy();
    });

    t.it("Should process setHidden properly", function(t) {
        var tree = Ext.create('coon.comp.list.Tree', {
                renderTo : document.body,
                width    : 200
            }),
            w;
        t.expect(tree.isVisible()).toBe(true);
        t.expect(tree.isHidden()).toBe(false);
        t.expect(tree.getWidth()).toBe(200);
        tree.setWidth(100);
        tree.setHidden(true);

        t.expect(tree.isVisible()).toBe(false);
        t.expect(tree.isHidden()).toBe(true);

        tree.setHidden(false);
        t.expect(tree.getWidth()).toBe(100);
        t.expect(tree.isVisible()).toBe(true);
        t.expect(tree.isHidden()).toBe(false);
        tree.destroy();

        tree = Ext.create('coon.comp.list.Tree');
        t.expect(tree.getWidth()).toBeNull();
        tree.setHidden(true);
        t.expect(tree.isVisible()).toBe(false);
        t.expect(tree.isHidden()).toBe(true);
        tree.setHidden(false);
        t.expect(tree.isVisible()).toBe(true);
        t.expect(tree.isHidden()).toBe(false);
        t.expect(tree.getWidth()).toBe(tree.defaultWidth);
    });


});