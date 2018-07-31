/**
 * conjoon
 * (c) 2007-2016 conjoon.org
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

describe('conjoon.cn_comp.window.ToastTest', function(t) {

    t.it("prerequisites", function(t) {
        let toast = Ext.create('conjoon.cn_comp.window.Toast', {
            context : 'foo',
            html    : 'Test'
        });

        t.isInstanceOf(toast, 'Ext.window.Toast');
        t.expect(toast.alias).toContain('widget.cn_comp-toast');
        t.expect(toast.cls).toContain('cn_comp-toast foo');
        t.expect(toast.context).toBe("foo");
        t.expect(toast.bodyPadding).toBe("14 14 0 68");
        t.expect(toast.align).toBe("tr");
        t.expect(toast.autoClose).toBe(true);
    });


    t.it("conjoon.Toast", function(t) {
        t.expect(conjoon.Toast).toBeTruthy();
    });


    t.it("conjoon.Toast.warn", function(t) {

        let message = "This is a warning.",
            toast   = conjoon.Toast.warn(message);

        t.isInstanceOf(toast, 'conjoon.cn_comp.window.Toast');

        let node = Ext.dom.Query.selectNode('div[class=x-autocontainer-innerCt]', toast.el.dom);
        t.expect(node.innerHTML).toBe(message);
    });


});