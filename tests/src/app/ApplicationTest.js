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

describe('conjoon.cn_comp.app.ApplicationTest', function(t) {


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

    t.it('Should throw an error when applicationSchemaConfig is an object and schema was not loaded yet', function(t) {
        var exc = undefined;
        try {
            Ext.create('conjoon.cn_comp.app.Application', {
                name                          : 'test',
                mainView                      : 'conjoon.cn_comp.container.Viewport',
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
            Ext.create('conjoon.cn_comp.app.Application', {
                name                          : 'test',
                mainView                      : 'conjoon.cn_comp.container.Viewport',
                applicationSchemaConfig       : undefined,
                applicationViewModelClassName : 'Ext.app.ViewModel'
            });

        } catch(e) {exc = e;}
        t.expect(exc).toBeUndefined();
    });


    t.it('Should not throw an error when applicationViewModelClassName is not specified', function(t) {
        var exc = undefined;

        try {
            Ext.create('conjoon.cn_comp.app.Application', {
                name                          : 'test',
                mainView                      : 'conjoon.cn_comp.container.Viewport',
                applicationSchemaConfig       : 'Ext.data.schema.Schema',
                applicationViewModelClassName : undefined
            });

        } catch(e) {console.log(e);exc = e;}

        t.expect(exc).toBeUndefined();

    });

    t.it('Should throw an error if setup is complete, but mainView is no instance of conjoon.cn_comp.container.Viewport', function(t) {
        var exc = undefined;

        try {
            var w = Ext.create('conjoon.cn_comp.app.Application', {
                    name                          : 'test',
                    mainView                      : 'Ext.Panel',
                applicationSchemaConfig           : 'Ext.data.schema.Schema',
                    applicationViewModelClassName : 'Ext.app.ViewModel'
                });
        } catch(e) {exc = e;}

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });

    t.it('Should create mainView if configured properly', function(t) {
        var w = Ext.create('conjoon.cn_comp.app.Application', {
            name                          : 'test',
            mainView                      : 'conjoon.cn_comp.container.Viewport',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        t.expect(w.getMainView() instanceof conjoon.cn_comp.container.Viewport).toBeTruthy();
    });

    t.it('Should throw exception if mainView is set in post-launch call', function(t) {
        var exc = undefined;

        var w = Ext.create('conjoon.cn_comp.app.Application', {
            name                          : 'test',
            mainView                      : 'conjoon.cn_comp.container.Viewport',
            applicationSchemaConfig       : 'Ext.data.schema.Schema',
            applicationViewModelClassName : 'Ext.app.ViewModel'
        });

        try {
            w.setMainView(new Ext.Panel);
        } catch (e) {
            exc = e;
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();

    });

    t.it('Should NOT call ViewportMock\'s postLaunchHook', function(t) {

        t.requireOk('conjoon.classic.test.container.mock.ViewportMock', function () {

            var w = Ext.create('conjoon.cn_comp.app.Application', {
                name                          : 'test',
                mainView                      : 'conjoon.classic.test.container.mock.ViewportMock',
                applicationSchemaConfig       : 'Ext.data.schema.Schema',
                applicationViewModelClassName : 'Ext.app.ViewModel'
            });

            t.expect(w.getMainView().postLaunchInfo).toBeNull();

        });


    });

    t.it('Should call ViewportMock\'s postLaunchHook', function(t) {

        t.requireOk(
            'conjoon.classic.test.container.mock.ViewportMock',
            'conjoon.universal.test.app.mock.PackageControllerMock',
            function () {

                var w = Ext.create('conjoon.cn_comp.app.Application', {
                    controllers : [
                        'conjoon.universal.test.app.mock.PackageControllerMock'
                    ],
                    name                          : 'test',
                    mainView                      : 'conjoon.classic.test.container.mock.ViewportMock',
                    applicationSchemaConfig       : 'Ext.data.schema.Schema',
                    applicationViewModelClassName : 'Ext.app.ViewModel'
                });

                t.expect(w.getMainView().postLaunchInfo.length).toBe(1);
                t.expect(w.getMainView().postLaunchInfo[0]).toBe(true);


            });
    });

    t.it('Should call ViewportMock\'s postLaunchHook 2 times', function(t) {

        t.requireOk(
            'conjoon.classic.test.container.mock.ViewportMock',
            'conjoon.universal.test.app.mock.PackageControllerMock',
            'conjoon.universal.test.app.mock.PackageControllerMock1',
            function () {

                var w = Ext.create('conjoon.cn_comp.app.Application', {
                    controllers : [
                        'conjoon.universal.test.app.mock.PackageControllerMock',
                        'conjoon.universal.test.app.mock.PackageControllerMock1'
                    ],
                    name                          : 'test',
                    mainView                      : 'conjoon.classic.test.container.mock.ViewportMock',
                    applicationSchemaConfig       : 'Ext.data.schema.Schema',
                    applicationViewModelClassName : 'Ext.app.ViewModel'
                });

                t.expect(w.getMainView().postLaunchInfo.length).toBe(2);
                t.expect(w.getMainView().postLaunchInfo[1]).toEqual({});
            });
    });

    t.it('4 controllers, 1 returns undefined, should call ViewportMock\'s postLaunchHook 3 times', function(t) {

        t.requireOk(
            'conjoon.classic.test.container.mock.ViewportMock',
            'conjoon.universal.test.app.mock.PackageControllerMock',
            'conjoon.universal.test.app.mock.PackageControllerMock1',
            'conjoon.universal.test.app.mock.PackageControllerMock2',
            'conjoon.universal.test.app.mock.PackageControllerMock3',
            function () {

                var w = Ext.create('conjoon.cn_comp.app.Application', {
                    controllers : [
                        'conjoon.universal.test.app.mock.PackageControllerMock',
                        'conjoon.universal.test.app.mock.PackageControllerMock1',
                        'conjoon.universal.test.app.mock.PackageControllerMock2',
                        'conjoon.universal.test.app.mock.PackageControllerMock3'
                    ],
                    name                          : 'test',
                    mainView                      : 'conjoon.classic.test.container.mock.ViewportMock',
                    applicationSchemaConfig       : 'Ext.data.schema.Schema',
                    applicationViewModelClassName : 'Ext.app.ViewModel'
                });

                t.expect(w.getMainView().postLaunchInfo.length).toBe(3);
                t.expect(w.getMainView().postLaunchInfo[2]).toBeNull();
            });
    });

    t.requireOk(
        'conjoon.universal.test.app.mock.PackageControllerMockFalse',
        function() {

            t.it('Should throw exception when applicationSchemaConfig is not representing Ext.data.schema.Schema', function(t) {

                var exc;

                var w = Ext.create('conjoon.cn_comp.app.Application', {
                    controllers                : ['conjoon.universal.test.app.mock.PackageControllerMockFalse'],
                    name                       : 'test',
                    mainView                   : 'conjoon.cn_comp.container.Viewport',
                    applicationSchemaConfig    : 'Ext.Panel'
                });

                try {
                    w.getApplicationSession();
                } catch (e) {
                    exc = e;
                }


                t.expect(exc).toBeDefined();
                t.expect(exc.msg).toBeDefined();
            });


        });

    t.it('Should throw exception when applicationSchemaConfig is not representing Ext.data.schema.Schema and preLaunchHookProcess does return false', function(t) {

        var exc;

        try{
            var w = Ext.create('conjoon.cn_comp.app.Application', {
                name                       : 'test',
                mainView                   : 'conjoon.cn_comp.container.Viewport',
                applicationSchemaConfig : 'Ext.Panel'
            });
        } catch (e) {
            exc = e;
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });


    t.it('Should return Ext.data.Session with custom schema', function(t) {

        var w = Ext.create('conjoon.cn_comp.app.Application', {
            name                          : 'test',
            mainView                      : 'conjoon.cn_comp.container.Viewport',
            applicationSchemaConfig       : 'Ext.data.schema.Schema'
        });

        t.expect(w.getApplicationSession() instanceof Ext.data.Session).toBeTruthy();
        t.expect(Ext.getClassName(w.getApplicationSession().getSchema())).toBe('Ext.data.schema.Schema');
    });

    t.it('Should return Ext.data.Session with default schema', function(t) {

        var w = Ext.create('conjoon.cn_comp.app.Application', {
            name     : 'test',
            mainView : 'conjoon.cn_comp.container.Viewport'
        });

        t.expect(Ext.getClassName(w.getApplicationSession().getSchema())).toBe('conjoon.cn_core.data.schema.BaseSchema');

    });

    t.requireOk(
        'conjoon.universal.test.app.mock.PackageControllerMockFalse',
        function() {

            t.it('Should throw exception when applicationViewModelClassName is not representing Ext.app.ViewModel', function(t) {

                var exc;

                var w = Ext.create('conjoon.cn_comp.app.Application', {
                    controllers                   : ['conjoon.universal.test.app.mock.PackageControllerMockFalse'],
                    name                          : 'test',
                    mainView                      : 'conjoon.cn_comp.container.Viewport',
                    applicationViewModelClassName : 'Ext.Panel'
                });

                try {
                    w.getApplicationViewModel();
                } catch (e) {
                    exc = e;
                }


                t.expect(exc).toBeDefined();
                t.expect(exc.msg).toBeDefined();
            });


        });

    t.it('Should throw exception when applicationViewModelClassName is not representing Ext.app.ViewModel and preLaunchHookProcess does return false', function(t) {

        var exc;

        try{
            var w = Ext.create('conjoon.cn_comp.app.Application', {
                name                          : 'test',
                mainView                      : 'conjoon.cn_comp.container.Viewport',
                applicationViewModelClassName : 'Ext.Panel'
            });
        } catch (e) {
            exc = e;
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toBeDefined();
    });

    t.requireOk(
        'conjoon.universal.test.app.mock.ViewModelMock',
        function() {
            t.it('Should return view with custom viewModel', function(t) {

                var w = Ext.create('conjoon.cn_comp.app.Application', {
                    name                          : 'test',
                    mainView                      : 'conjoon.cn_comp.container.Viewport',
                    applicationViewModelClassName : 'conjoon.universal.test.app.mock.ViewModelMock'
                });

                t.expect(Ext.getClassName(w.getApplicationViewModel())).toBe('conjoon.universal.test.app.mock.ViewModelMock');
                t.expect(w.getMainView().getViewModel()).toBe(w.getApplicationViewModel());
            });
        }
    );


    t.it('Should return default ViewModel', function(t) {

        var w = Ext.create('conjoon.cn_comp.app.Application', {
            name     : 'test',
            mainView : 'conjoon.cn_comp.container.Viewport'
        });

        t.expect(Ext.getClassName(w.getApplicationViewModel())).toBe('Ext.app.ViewModel');
        t.expect(w.getMainView().getViewModel()).toBe(w.getApplicationViewModel());

    });


    t.it('ViewModel and Session should equal to those returned by the methods', function(t) {

        var w = Ext.create('conjoon.cn_comp.app.Application', {
            name     : 'test',
            mainView : 'conjoon.cn_comp.container.Viewport'
        });

        t.expect(w.getApplicationViewModel()).toBe(w.getMainView().getViewModel());
        t.expect(w.getApplicationSession()).toBe(w.getMainView().getViewModel().getSession());
    });


    t.it('activateViewForHash()', function(t) {

        var w = Ext.create('conjoon.cn_comp.app.Application', {
                name     : 'test',
                mainView : 'conjoon.cn_comp.container.Viewport'
            }),
            called = false;;

        w.getMainView().activateViewForHash = function() {
            called = true;
        }

        t.expect(called).toBe(false);
        t.expect(w.activateViewForHash());
        t.expect(called).toBe(true);
    });

});