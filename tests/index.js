/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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


const harness = new Siesta.Harness.Browser.ExtJS();

let isModern = window.location.href.indexOf("toolkit=modern") !== -1;

harness.configure({
    title          : 'lib-cn_comp - ' + (isModern ? "modern" : "classic"),
    disableCaching : true,
    loaderPath     : {

        /**
         * ux
         */
        'Ext.ux' : "../../../../ext/packages/ux/src/",

        /**
         * fixtures
         */
        'coon.comp.fixtures' : './fixtures',

        /**
         * Classic Toolkit
         */
        'coon.comp.component' : '../classic/src/component',
        'coon.comp.window'    : '../classic/src/window',
        'coon.comp.form'      : (isModern ? '../modern/src/form' : '../classic/src/form'),
        'coon.comp.grid'      : '../classic/src/grid',

        /**
         * Universal
         */
        'coon.comp.window.LockingWindow' : '../src/window/LockingWindow.js',
        'coon.comp.app' : '../src/app',
        'coon.comp.container' : (isModern ? '../modern/src/container' : '../classic/src/container'),
        'coon.comp.list'      : '../src/list',
        'coon.comp.Img' : (isModern ? '../modern/' : '../classic/') + 'src/Img.js',

        /**
         * Requirements
         */
        'coon.core' : '../../lib-cn_core/src',

        'Ext.Package' : '../../../remote/package-loader/src/Package.js',
        'Ext.package' : '../../../remote/package-loader/src/package',

        /**
         * Mocks
         */
        'coon.classic.test'    : './classic/src',
        'coon.universal.test'  : './src'
    },
    preload        : [
        './classic/resources/test.css',
        coon.tests.config.paths.extjs[isModern ? "modern" : "classic" ].css.url,
        coon.tests.config.paths.extjs[isModern ? "modern" : "classic" ].js.url
    ]
});


let groups = [];

// +--------------------------------
// | Classic Tests
// +--------------------------------
if (!isModern) {
    groups.push({
        group : 'classic',
        items : ['classic/src/ImgTest.js', {
            group : 'component',
            items : [
                'classic/src/component/IframeTest.js',
                'classic/src/component/LoadMaskTest.js',
                'classic/src/component/MessageMaskTest.js'
            ]
        }, {
            group : 'container',
            items : [
                'src/container/ViewportTest.js'
            ]
        }, {
            group : 'form',
            items : [
                'classic/src/form/AutoCompleteFormTest.js',
                {
                    group : 'field',
                    items : [
                        'classic/src/form/field/FileButtonTest.js'
                    ]
                }]
        }, {
            group : 'grid',
            items : [{
                group : 'feature',
                items : [
                    'classic/src/grid/feature/RowBodySwitchTest.js',
                    'classic/src/grid/feature/RowFlyMenuTest.js',
                    'classic/src/grid/feature/LivegridTest.js'
                ]
            }]
        }, {
            group : 'window',
            items : [
                'classic/src/window/ToastTest.js'
            ]
        }]
    });

}


// +--------------------------------
// | Modern Tests
// +--------------------------------
if (isModern) {
    groups.push({
        group : 'modern',
        items : ['modern/src/ImgTest.js', {
            group : 'container',
            items : [
                'src/container/ViewportTest.js'
            ]
        }, {
            group : 'form',
            items : [
                'modern/src/form/AutoCompleteFormTest.js'
            ]
        }]
    });

}


// +--------------------------------
// | Universal Tests
// +--------------------------------
groups.push({
    group : 'universal',
    items : [{
        group : 'app',
        items : [
            'src/app/ApplicationTest.js'
        ]
    }, {
        group : 'list',
        items : [
            'src/list/TreeTest.js'
        ]
    }, {
        group : 'window',
        items : [
            'src/window/LockingWindowTest.js'
        ]
    }]
})

harness.start.apply(harness, groups);
