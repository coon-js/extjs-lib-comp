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

    const TOASTTEST = function(t, message, type) {

        let toast = conjoon.Toast[type](message);

        t.isInstanceOf(toast, 'conjoon.cn_comp.window.Toast');

        let node = Ext.dom.Query.selectNode('div[class=x-autocontainer-innerCt]', toast.el.dom);
        t.expect(node.innerHTML).toBe(message);
    };

    t.it("conjoon.Toast.warn", function(t) {

        TOASTTEST(t, "This is a warning.", 'warn');
    });


    t.it("conjoon.Toast.info", function(t) {

        TOASTTEST(t, "This is an info", 'info');
    });


    t.it("conjoon.Toast.fail", function(t) {

        TOASTTEST(t, "This is a failure.", 'fail');
    });
});