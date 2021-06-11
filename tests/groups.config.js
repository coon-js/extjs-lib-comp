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

export default [{
    group: "classic",
    items: ["classic/src/ImgTest.js", {
        group: "component",
        items: [
            "classic/src/component/IframeTest.js",
            "classic/src/component/LoadMaskTest.js",
            "classic/src/component/MessageMaskTest.js"
        ]
    }, {
        group: "container",
        items: [
            "src/container/ViewportTest.js"
        ]
    }, {
        group: "form",
        items: [
            "classic/src/form/AutoCompleteFormTest.js",
            {
                group: "field",
                items: [
                    "classic/src/form/field/FileButtonTest.js"
                ]
            }]
    }, {
        group: "grid",
        items: [{
            group: "feature",
            items: [
                "classic/src/grid/feature/RowBodySwitchTest.js",
                "classic/src/grid/feature/RowFlyMenuTest.js",
                "classic/src/grid/feature/LivegridTest.js"
            ]
        }]
    }, {
        group: "window",
        items: [
            "classic/src/window/ToastTest.js"
        ]
    }]
}, {
    group: "modern",
    items: ["modern/src/ImgTest.js", {
        group: "container",
        items: [
            "src/container/ViewportTest.js"
        ]
    }, {
        group: "form",
        items: [
            "modern/src/form/AutoCompleteFormTest.js"
        ]
    }]
}, {
    group: "universal",
    items: [{
        group: "app",
        items: [
            "src/app/ApplicationTest.js"
        ]
    }, {
        group: "list",
        items: [
            "src/list/TreeTest.js"
        ]
    }, {
        group: "window",
        items: [
            "src/window/LockingWindowTest.js"
        ]
    }]
}];