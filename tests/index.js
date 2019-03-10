var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title          : 'lib-cn_comp',
    disableCaching : true,
    loaderPath     : {

        /**
         * ux
         */
        'Ext.ux' : "../../../../ext/packages/ux/src/",////bryntum.com/examples/extjs-6.0.1/build/ext-all.js"

        /**
         * fixtures
         */
        'coon.comp.fixtures' : './fixtures',

        /**
         * Classic Toolkit
         */
        'coon.comp.container' : '../classic/src/container',
        'coon.comp.component' : '../classic/src/component',
        'coon.comp.window'    : '../classic/src/window',
        'coon.comp.form'      : '../classic/src/form',
        'coon.comp.list'      : '../classic/src/list',
        'coon.comp.grid'      : '../classic/src/grid',

        /**
         * Universal
         */
        'coon.comp.app' : '../src/app',

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
        coon.tests.config.paths.extjs.css.url,
        coon.tests.config.paths.extjs.js.url
    ]
});

harness.start({
    group : 'classic',
    items : [{
        group : 'component',
        items : [
            'classic/src/component/IframeTest.js',
            'classic/src/component/LoadMaskTest.js',
            'classic/src/component/MessageMaskTest.js'
        ]
    }, {
        group : 'container',
        items : [
            'classic/src/container/ViewportTest.js'
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
        group : 'list',
        items : [
            'classic/src/list/TreeTest.js'
        ]
    }, {
        group : 'window',
        items : [
            'classic/src/window/LockingWindowTest.js',
            'classic/src/window/ToastTest.js'
        ]
    }]
}, {
    group : 'universal',
    items : [{
        group : 'app',
        items : [
            'src/app/ApplicationTest.js'
        ]
    }]
});
