var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title          : 'lib-cn_comp Tests',
    disableCaching : true,
    loaderPath     : {
        /**
         * Classic Toolkit
         */
        'conjoon.cn_comp.container' : '../classic/src/container',
        'conjoon.cn_comp.window'    : '../classic/src/window',
        'conjoon.cn_comp.form'      : '../classic/src/form',
        'conjoon.cn_comp.list'      : '../classic/src/list',

        /**
         * Universal
         */
        'conjoon.cn_comp.app' : '../src/app',

        /**
         * Requirements
         */
        'conjoon.cn_core' : '../../lib-cn_core/src',

        /**
         * Mocks
         */
        'conjoon.classic.test'    : './classic/src',
        'conjoon.universal.test'  : './src'
    },
    preload        : [
        conjoon.tests.config.paths.extjs.css.url,
        conjoon.tests.config.paths.extjs.js.url
    ]
});

harness.start({
    group : 'classic',
    items : [{
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
        group : 'list',
        items : [
            'classic/src/list/TreeTest.js'
        ]
    }, {
        group : 'window',
        items : [
            'classic/src/window/LockingWindowTest.js'
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
