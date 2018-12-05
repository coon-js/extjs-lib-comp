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


});