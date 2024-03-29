/**
 * coon.js
 * lib-cn_user
 * Copyright (C) 2017-2021 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_user
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

/**
 * Implementation of Ext.Img, providing glyph support with Ext.Img
 * in modern toolkit
 */
Ext.define("coon.comp.Img", {

    extend: "Ext.Img",

    config: {
        glyph: undefined
    },

    applyGlyph: function (glyph, oldGlyph) {
        if (glyph) {
            if (!glyph.isGlyph) {
                glyph = Ext.create("Ext.Glyph", glyph);
            }

            if (glyph.isEqual(oldGlyph)) {
                glyph = undefined;
            }
        }

        return glyph;
    },


    updateGlyph: function (glyph) {
        const me = this,
            el = me.el;

        if (el) {
            el.dom.innerHTML = glyph.character;
            el.setStyle(glyph.getStyle());
        }
    }
});
