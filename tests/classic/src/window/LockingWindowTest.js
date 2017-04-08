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

describe('conjoon.cn_comp.window.LockingWindowTest', function(t) {

    t.it("Sanitize tests for LockingWindow specifics", function(t) {

        var w =Ext.create('conjoon.cn_comp.window.LockingWindow', {
            modal     : false,
            maximized : false,
            closable  : true,
            resizable : true
        });

        // truthies
        t.expect(w.isVisible()).toBeTruthy();
        t.expect(w.modal).toBeTruthy();
        t.expect(w.maximized).toBeTruthy();

        // falsies
        t.expect(w.closable).toBeFalsy();
        t.expect(w.resizable).toBeFalsy();


    });


});