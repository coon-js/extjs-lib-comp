/**
 * coon.js
 * extjs-lib-core
 * Copyright (C) 2017-2022 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-core
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
 *
 */
export default {

    name: "extjs-lib-comp",

    timeout: 750,

    loaderPath: {

        "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
        "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",

        "coon.comp.fixtures": "./fixtures",
        "coon.comp.component.AbstractAnnouncementBar": "../src/component/AbstractAnnouncementBar.js",
        "coon.comp.window.LockingWindow": "../src/window/LockingWindow.js",
        "coon.comp.app": "../src/app",
        "coon.comp.list": "../src/list",
        "coon.core": "../node_modules/@coon-js/extjs-lib-core/src",
        "coon.universal.test": "./src",

        modern: {
            "coon.comp.form": "../modern/src/form",
            "coon.comp.container": "../modern/src/container",
            "coon.comp.component": "../modern/src/component",
            "coon.comp.Img": "../modern/src/Img.js"
        },

        classic: {
            "coon.classic.test": "./classic/src",
            "coon.comp.form": "../classic/src/form",
            "coon.comp.container": "../classic/src/container",
            "coon.comp.Img": "../classic/src/Img.js",
            "coon.comp.component": "../classic/src/component",
            "coon.comp.window": "../classic/src/window",
            "coon.comp.grid": "../classic/src/grid"
        }


    },
    preload: {
        css: [
            "./classic/resources/test.css"
        ],
        js: ["../node_modules/@l8js/l8/dist/l8.runtime.umd.js"]
    }
};
