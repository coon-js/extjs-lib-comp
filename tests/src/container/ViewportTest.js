/**
 * coon.js
 * extjs-lib-comp
 * Copyright (C) 2017-2021 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-comp
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

StartTest((t) => {


    // +----------------------------------------------------------------------------
    // |                    =~. Unit Tests .~=
    // +----------------------------------------------------------------------------

    t.it("should be instance of Ext.container.Viewport", (t) => {
        const w = Ext.create("coon.comp.container.Viewport", {
        });

        switch (Ext.isModern) {
        case true:
            t.expect(w instanceof Ext.Panel).toBeTruthy();
            break;
        case undefined:
            t.expect(w instanceof Ext.container.Viewport).toBeTruthy();
            break;
        default:
            throw("Unexpected value for \"Ext.isModern\": " + Ext.isModern);
        }

    });

    t.it("postLaunchHook should be Ext.emptyFn", (t) => {
        var w = Ext.create("coon.comp.container.Viewport", {
        });

        t.expect(w.addPostLaunchInfo).toBe(Ext.emptyFn);
    });

    t.it("activateViewForHash()", (t) => {
        var w = Ext.create("coon.comp.container.Viewport", {
        });

        t.expect(w.activateViewForHash).toBe(Ext.emptyFn);
    });

    t.it("cleanup()", (t) => {
        var w = Ext.create("coon.comp.container.Viewport", {
        });

        t.expect(w.cleanup).toBe(Ext.emptyFn);
    });


});
