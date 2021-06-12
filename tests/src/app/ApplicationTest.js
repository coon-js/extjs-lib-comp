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

    t.requireOk(
        "coon.core.app.Application",
        "coon.universal.test.container.mock.ViewportMock",
        "coon.universal.test.app.mock.ViewModelMock",
        "coon.universal.test.app.mock.PackageControllerMock",
        "coon.universal.test.app.mock.PackageControllerMock1",
        "coon.universal.test.app.mock.PackageControllerMock2",
        "coon.universal.test.app.mock.PackageControllerMock3",
        "coon.universal.test.app.mock.PackageControllerMockFalse", function () {


            let app = null,
                ONPROFILESREADY;

            const switchOnProfilesReady = (origin) => {
                if (!origin) {
                    ONPROFILESREADY = coon.core.app.Application.prototype.onProfilesReady;
                    coon.core.app.Application.prototype.onProfilesReady = Ext.app.Application.prototype.onProfilesReady;
                    return ONPROFILESREADY;
                } else if (ONPROFILESREADY) {
                    coon.core.app.Application.prototype.onProfilesReady = ONPROFILESREADY;
                }
            };

            t.beforeEach(function () {
                Ext.isModern && Ext.viewport.Viewport.setup();
                switchOnProfilesReady();
            });

            t.afterEach(function () {

                switchOnProfilesReady(true);
                if (app) {
                    app.destroy();
                    app = null;
                }

                if (Ext.isModern && Ext.Viewport) {
                    Ext.Viewport.destroy();
                    Ext.Viewport = null;
                }

                coon.core.Environment._vendorBase = undefined;
            });

            // +----------------------------------------------------------------------------
            // |                    =~. Unit Tests .~=
            // +----------------------------------------------------------------------------


            t.it("Should create mainView if configured properly", (t) => {

                app = Ext.create("coon.comp.app.Application", {
                    name: "test",
                    mainView: "coon.comp.container.Viewport"
                });

                t.expect(app.getMainView() instanceof coon.comp.container.Viewport).toBeTruthy();
            });


            t.it("Should NOT call ViewportMock's postLaunchHook", (t) => {

                app = Ext.create("coon.comp.app.Application", {
                    name: "test",
                    mainView: "coon.universal.test.container.mock.ViewportMock"
                });

                t.expect(app.getMainView().postLaunchInfo).toBeNull();
            });


            t.it("Should call ViewportMock's postLaunchHook", (t) => {


                app = Ext.create("coon.comp.app.Application", {
                    controllers: [
                        "coon.universal.test.app.mock.PackageControllerMock"
                    ],
                    name: "test",
                    mainView: "coon.universal.test.container.mock.ViewportMock"
                });

                t.expect(app.getMainView().postLaunchInfo.length).toBe(1);
                t.expect(app.getMainView().postLaunchInfo[0]).toBe(true);
            });


            t.it("Should call ViewportMock's postLaunchHook 2 times", (t) => {


                app = Ext.create("coon.comp.app.Application", {
                    controllers: [
                        "coon.universal.test.app.mock.PackageControllerMock",
                        "coon.universal.test.app.mock.PackageControllerMock1"
                    ],
                    name: "test",
                    mainView: "coon.universal.test.container.mock.ViewportMock"
                });

                t.expect(app.getMainView().postLaunchInfo.length).toBe(2);
                t.expect(app.getMainView().postLaunchInfo[1]).toEqual({});
            });


            t.it("4 controllers, 1 returns undefined, should call ViewportMock's postLaunchHook 3 times", (t) => {

                app = Ext.create("coon.comp.app.Application", {
                    controllers: [
                        "coon.universal.test.app.mock.PackageControllerMock",
                        "coon.universal.test.app.mock.PackageControllerMock1",
                        "coon.universal.test.app.mock.PackageControllerMock2",
                        "coon.universal.test.app.mock.PackageControllerMock3"
                    ],
                    name: "test",
                    mainView: "coon.universal.test.container.mock.ViewportMock"
                });

                t.expect(app.getMainView().postLaunchInfo.length).toBe(3);
                t.expect(app.getMainView().postLaunchInfo[2]).toBeNull();
            });


            t.it("activateViewForHash()", (t) => {

                app = Ext.create("coon.comp.app.Application", {
                    name: "test",
                    mainView: "coon.comp.container.Viewport"
                });
                let called = false;

                app.getMainView().activateViewForHash = function () {
                    called = true;
                };

                t.expect(called).toBe(false);
                t.expect(app.activateViewForHash());
                t.expect(called).toBe(true);
            });


            t.it("Should throw an error if setup is complete, but mainView is no instance of coon.comp.container.Viewport", (t) => {
                var exc;

                try {
                    app = Ext.create("coon.comp.app.Application", {
                        name: "test",
                        mainView: "Ext.Panel"
                    });
                } catch(e) {exc = e;}

                t.expect(exc).toBeDefined();
                t.expect(exc.msg).toBeDefined();
            });


        });
});