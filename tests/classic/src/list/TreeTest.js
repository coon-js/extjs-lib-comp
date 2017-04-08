/**
 * conjoon
 * (c) 2007-2016 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2016 Thorsten Suckow-Homberg/conjoon.org
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

describe('conjoon.cn_comp.list.TreeTest', function(t) {

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
        tree = Ext.create('conjoon.cn_comp.list.Tree', treeConfig);

        t.expect(tree instanceof Ext.list.Tree).toBe(true);
        t.expect(tree.alias).toContain('widget.cn_comp-listtree');
    });

    t.it("Should evaluate getMicro to false", function(t) {
        var tree = Ext.create('conjoon.cn_comp.list.Tree', {width : 200});
        t.expect(tree.getMicro()).toBeFalsy();
        tree.destroy();
    });

    t.it("Should process width properly", function(t) {
        var tree = Ext.create('conjoon.cn_comp.list.Tree', {width : 200});
        t.expect(tree.defaultWidth).toBe(200);
        tree.destroy();

        tree = Ext.create('conjoon.cn_comp.list.Tree');
        t.expect(tree.defaultWidth).toBe(250);
        tree.destroy();
    });

    t.it("Should process setHidden properly", function(t) {
        var tree = Ext.create('conjoon.cn_comp.list.Tree', {
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

        tree = Ext.create('conjoon.cn_comp.list.Tree');
        t.expect(tree.getWidth()).toBeNull();
        tree.setHidden(true);
        t.expect(tree.isVisible()).toBe(false);
        t.expect(tree.isHidden()).toBe(true);
        tree.setHidden(false);
        t.expect(tree.isVisible()).toBe(true);
        t.expect(tree.isHidden()).toBe(false);
        t.expect(tree.getWidth()).toBe(tree.defaultWidth);
        tree.destroy();
    });


});