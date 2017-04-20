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

describe('conjoon.cn_comp.container.ViewportTest', function(t) {


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    t.it('should be instance of Ext.container.Viewport', function(t) {
        var w = Ext.create('conjoon.cn_comp.container.Viewport', {
        });

        t.expect(w instanceof Ext.container.Viewport).toBeTruthy();
    });

    t.it('postLaunchHook should be Ext.emptyFn', function(t) {
        var w = Ext.create('conjoon.cn_comp.container.Viewport', {
        });

        t.expect(w.addPostLaunchInfo).toBe(Ext.emptyFn);
    });

    t.it('activateViewForHash()', function(t) {
        var w = Ext.create('conjoon.cn_comp.container.Viewport', {
        });

        t.expect(w.activateViewForHash).toBe(Ext.emptyFn);
    });

    t.it('cleanup()', function(t) {
        var w = Ext.create('conjoon.cn_comp.container.Viewport', {
        });

        t.expect(w.cleanup).toBe(Ext.emptyFn);
    });


});
