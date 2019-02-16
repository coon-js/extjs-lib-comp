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

describe('conjoon.cn_comp.component.IframeTest', function(t) {

    let iframe;

    const createIframe = function(cfg) {
        let iframe = Ext.create('conjoon.cn_comp.component.Iframe', Ext.apply({
            renderTo : document.body,
            height : 400,
            width : 600
        }, cfg || {}));

        return iframe;
    }


    t.beforeEach(function() {

    });

    t.afterEach(function() {
        if (iframe) {
            iframe.destroy();
            iframe = null;
        }
    });



// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.it('test class and configuration', function(t) {

        iframe = createIframe();


        t.isInstanceOf(iframe, 'Ext.Component');

        t.expect(iframe.alias).toContain("widget.cn_comp-iframe");

        t.expect(iframe.name).toBeTruthy();

        t.expect(iframe.el.dom.firstChild.getAttribute('sandbox')).toBe("allow-same-origin");

    });


    t.it('src / name', function(t) {

        iframe = createIframe({
            name : 'conjoonIframe'
        });


        t.expect(iframe.name).toBe('conjoonIframe');

    });


    t.it('setSrcDoc() / getSrcDoc()', function(t) {

        iframe = createIframe();

        t.expect(iframe.getSrcDoc()).not.toBe("foo");

        iframe.setSrcDoc("foo");

        t.expect(iframe.getSrcDoc()).toBe("foo");


        iframe.setSrcDoc(null);

        t.expect(iframe.getSrcDoc()).toBe("");

    });



    t.it('sandbox / scrolling', function(t) {

        iframe = createIframe({
            sandbox : "",
            scrolling : "no"
        });

        t.expect(iframe.el.dom.firstChild.getAttribute('sandbox')).toBe("");
        t.expect(iframe.el.dom.firstChild.getAttribute('scrolling')).toBe("no");

    });


    t.it('getBody()', function(t) {

        iframe = createIframe({
        });

        t.expect(iframe.getBody()).toBeTruthy();
        t.expect(iframe.getBody().toString()).toContain("HTMLBodyElement");

    });


    t.it('load event', function(t) {

        iframe = createIframe({
        });

        let CALLED = 0;

        iframe.on('load', function() {
            CALLED++;
        });

        t.expect(CALLED).toBe(0);
        iframe.setSrcDoc("foo");

        t.waitForMs(250, function() {

            t.expect(CALLED).toBe(1);
            iframe.setSrcDoc("bar");

            t.waitForMs(250, function() {

                t.expect(CALLED).toBe(2);
            });
        });


    });
});