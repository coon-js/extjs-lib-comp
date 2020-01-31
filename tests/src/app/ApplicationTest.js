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

describe('coon.comp.app.ApplicationTest', function(t) {

    let app;

    t.beforeEach(function() {
        Ext.isModern && Ext.viewport.Viewport.setup();
    });

    t.afterEach(function() {

        if (app) {
            if (app.getMainView()) {
                app.getMainView().destroy();
            }

            app.destroy();
            app = null;

        }

        if (Ext.isModern && Ext.Viewport) {
            Ext.Viewport.destroy();
            Ext.Viewport = null;
        }

    });

// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    
    
t.requireOk(
        'coon.universal.test.container.mock.ViewportMock',
        'coon.universal.test.app.mock.ViewModelMock',
        'coon.universal.test.app.mock.PackageControllerMock',
        'coon.universal.test.app.mock.PackageControllerMock1',
        'coon.universal.test.app.mock.PackageControllerMock2',
        'coon.universal.test.app.mock.PackageControllerMock3',
        'coon.universal.test.app.mock.PackageControllerMockFalse', function() {

    t.it('Should throw an error when applicationSchemaConfig is an object and schema was not loaded yet', function(t) {
        var exc = undefined;
        try {
            app = Ext.create('coon.comp.app.Application', {
                name                          : 'test',
                mainView                      : 'coon.comp.container.Viewport',
                applicationSchemaConfig       : {type : 'maschema'},
                applicationViewModelClassName : 'Ext.app.ViewModel'
            });

        } catch(e) {exc = e;}

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });

    t.it('Should not throw an error when applicationSchemaConfig is not specified', function(t) {
        var exc = undefined;
        try {
            app = Ext.create('coon.comp.app.Application', {
                name                          : 'test',
                mainView                      : 'coon.comp.container.Viewport',
                applicationSchemaConfig       : undefined,
                applicationViewModelClassName : 'Ext.app.ViewModel'
            });

        } catch(e) {exc = e;}
        t.expect(exc).toBeUndefined();
    });


    t.it('Should not throw an error when applicationViewModelClassName is not specified', function(t) {
        var exc = undefined;

        try {
            app = Ext.create('coon.comp.app.Application', {
                name                          : 'test',
                mainView                      : 'coon.comp.container.Viewport',
                applicationSchemaConfig       : 'Ext.data.schema.Schema',
                applicationViewModelClassName : undefined
            });

        } catch(e) {console.log(e);exc = e;}

        t.expect(exc).toBeUndefined();

    });

    t.it('Should create mainView if configured properly', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name                          : 'test',
            mainView                      : 'coon.comp.container.Viewport',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        t.expect(app.getMainView() instanceof coon.comp.container.Viewport).toBeTruthy();
    });



    t.it('Should NOT call ViewportMock\'s postLaunchHook', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name                          : 'test',
            mainView                      : 'coon.universal.test.container.mock.ViewportMock',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        t.expect(app.getMainView().postLaunchInfo).toBeNull();
    });


    t.it('Should call ViewportMock\'s postLaunchHook', function(t) {


        app = Ext.create('coon.comp.app.Application', {
            controllers : [
                'coon.universal.test.app.mock.PackageControllerMock'
            ],
            name                          : 'test',
            mainView                      : 'coon.universal.test.container.mock.ViewportMock',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        t.expect(app.getMainView().postLaunchInfo.length).toBe(1);
        t.expect(app.getMainView().postLaunchInfo[0]).toBe(true);
    });

    t.it('Should call ViewportMock\'s postLaunchHook 2 times', function(t) {


        app = Ext.create('coon.comp.app.Application', {
            controllers : [
                'coon.universal.test.app.mock.PackageControllerMock',
                'coon.universal.test.app.mock.PackageControllerMock1'
            ],
            name                          : 'test',
            mainView                      : 'coon.universal.test.container.mock.ViewportMock',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        t.expect(app.getMainView().postLaunchInfo.length).toBe(2);
        t.expect(app.getMainView().postLaunchInfo[1]).toEqual({});
    });


    t.it('4 controllers, 1 returns undefined, should call ViewportMock\'s postLaunchHook 3 times', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            controllers : [
                'coon.universal.test.app.mock.PackageControllerMock',
                'coon.universal.test.app.mock.PackageControllerMock1',
                'coon.universal.test.app.mock.PackageControllerMock2',
                'coon.universal.test.app.mock.PackageControllerMock3'
            ],
            name                          : 'test',
            mainView                      : 'coon.universal.test.container.mock.ViewportMock',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        t.expect(app.getMainView().postLaunchInfo.length).toBe(3);
        t.expect(app.getMainView().postLaunchInfo[2]).toBeNull();
    });


    t.it('Should return Ext.data.Session with custom schema', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name                          : 'test',
            mainView                      : 'coon.comp.container.Viewport',
            applicationSchemaConfig       : 'Ext.data.schema.Schema'
        });

        t.expect(app.getApplicationSession() instanceof Ext.data.Session).toBeTruthy();
        t.expect(Ext.getClassName(app.getApplicationSession().getSchema())).toBe('Ext.data.schema.Schema');
    });

    t.it('Should return Ext.data.Session with default schema', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name     : 'test',
            mainView : 'coon.comp.container.Viewport'
        });

        t.expect(Ext.getClassName(app.getApplicationSession().getSchema())).toBe('coon.core.data.schema.BaseSchema');

    });


    t.it('Should return view with custom viewModel', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name                          : 'test',
            mainView                      : 'coon.comp.container.Viewport',
            applicationViewModelClassName : 'coon.universal.test.app.mock.ViewModelMock'
        });

        t.expect(Ext.getClassName(app.getApplicationViewModel())).toBe('coon.universal.test.app.mock.ViewModelMock');
        t.expect(app.getMainView().getViewModel()).toBe(app.getApplicationViewModel());
    });



    t.it('Should return default ViewModel', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name     : 'test',
            mainView : 'coon.comp.container.Viewport'
        });

        t.expect(Ext.getClassName(app.getApplicationViewModel())).toBe('Ext.app.ViewModel');
        t.expect(app.getMainView().getViewModel()).toBe(app.getApplicationViewModel());

    });


    t.it('ViewModel and Session should equal to those returned by the methods', function(t) {

        app = Ext.create('coon.comp.app.Application', {
            name     : 'test',
            mainView : 'coon.comp.container.Viewport'
        });

        t.expect(app.getApplicationViewModel()).toBe(app.getMainView().getViewModel());
        t.expect(app.getApplicationSession()).toBe(app.getMainView().getViewModel().getSession());
    });


    t.it('activateViewForHash()', function(t) {

        app = Ext.create('coon.comp.app.Application', {
                name     : 'test',
                mainView : 'coon.comp.container.Viewport'
            }),
            called = false;;

        app.getMainView().activateViewForHash = function() {
            called = true;
        }

        t.expect(called).toBe(false);
        t.expect(app.activateViewForHash());
        t.expect(called).toBe(true);
    });


    t.it('Should throw exception when applicationSchemaConfig is not representing Ext.data.schema.Schema', function(t) {

        var exc;

        app = Ext.create('coon.comp.app.Application', {
            controllers                : ['coon.universal.test.app.mock.PackageControllerMockFalse'],
            name                       : 'test',
            mainView                   : 'coon.comp.container.Viewport',
            applicationSchemaConfig    : 'Ext.Panel'
        });

        try {
            app.getApplicationSession();
        } catch (e) {
            exc = e;
        }


        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });


    t.it('Should throw exception when applicationViewModelClassName is not representing Ext.app.ViewModel', function(t) {

        var exc;

        app = Ext.create('coon.comp.app.Application', {
            controllers                   : ['coon.universal.test.app.mock.PackageControllerMockFalse'],
            name                          : 'test',
            mainView                      : 'coon.comp.container.Viewport',
            applicationViewModelClassName : 'Ext.Panel'
        });

        try {
            app.getApplicationViewModel();
        } catch (e) {
            exc = e;
        }


        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });


    t.it('Should throw exception when applicationViewModelClassName is not representing Ext.app.ViewModel and preLaunchHookProcess does return false', function(t) {

        var exc;

        try{
            app = Ext.create('coon.comp.app.Application', {
                name                          : 'test',
                mainView                      : 'coon.comp.container.Viewport',
                applicationViewModelClassName : 'Ext.Panel'
            });
        } catch (e) {
            exc = e;
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });


    t.it('Should throw an error if setup is complete, but mainView is no instance of coon.comp.container.Viewport', function(t) {
        var exc = undefined;

        try {
            app = Ext.create('coon.comp.app.Application', {
                name                          : 'test',
                mainView                      : 'Ext.Panel',
                applicationSchemaConfig       : 'Ext.data.schema.Schema',
                applicationViewModelClassName : 'Ext.app.ViewModel'
            });
        } catch(e) {exc = e;}

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });



    t.it('Should throw exception when applicationSchemaConfig is not representing Ext.data.schema.Schema and preLaunchHookProcess does return false', function(t) {

        var exc;

        try{
            app = Ext.create('coon.comp.app.Application', {
                name                       : 'test',
                mainView                   : 'coon.comp.container.Viewport',
                applicationSchemaConfig : 'Ext.Panel'
            });
        } catch (e) {
            exc = e;
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });


})});