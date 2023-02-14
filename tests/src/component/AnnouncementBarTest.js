/**
 * coon.js
 * extjs-lib-comp
 * Copyright (C) 2021-2023 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-comp
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
 * We can safely test modern/classic AnnouncementBar since they share the same functionality,
 * except for a different rendering mechanism.
 */

StartTest(t => {


    var bar;

    const
        className = "coon.comp.component.AnnouncementBar",


        createBar = (cfg) => {

            return Ext.create(className, Ext.apply({
                renderTo: document.body,
                width: 300,
                height: 40
            }, cfg));

        };

    t.beforeEach(() => {

    });

    t.afterEach(() => {
        coon.Announcement.close();
        bar = null;

    });


    // +----------------------------------------------------------------------------
    // |                    =~. Tests .~=
    // +----------------------------------------------------------------------------
    t.requireOk("coon.comp.component.AnnouncementBar", () => {


        t.it("test class and configuration", (t) => {

            let barMock;

            bar = createBar({
                message: "Hello World",
                link: "okay"
            });

            t.isInstanceOf(bar, "Ext.Component");
            t.expect(bar.isHidden()).toBe(true);
            bar.show();

            const
                dom = () => bar.el.dom.firstChild,
                message = () => dom().firstChild.firstChild,
                yes = () => message().nextSibling ,
                no =  () => yes().nextSibling,
                link = () => dom().lastChild;

            t.expect(barMock).toBeUndefined();

            t.expect(Ext.fly(yes()).isVisible()).toBe(false);
            t.expect(Ext.fly(no()).isVisible()).toBe(false);


            t.expect(dom().className).toBe("wrap info");
            t.expect(message().innerHTML).toBe("Hello World");
            t.expect(link().innerHTML).toBe("okay");

            bar.setType(coon.comp.component.AnnouncementBar.WARNING);
            t.expect(dom().className).toBe("wrap warning");
            bar.setType("alert");
            t.expect(dom().className).toBe("wrap alert");

            bar.setMessage("changed");
            t.expect(message().innerHTML).toBe("changed");
            bar.setLink("got it");
            t.expect(link().innerHTML).toBe("got it");


            t.click(link(), () => {
                t.expect(barMock).toBeUndefined();

                t.expect(bar.isVisible()).toBe(false);
                bar.show();
                bar.setCallback(bar => barMock = bar);
                t.click(link(), () => {
                    t.expect(barMock).toBe(bar);

                    bar.show();

                    let yesMock;
                    bar.setYes((bar) => yesMock = bar);

                    t.click(yes(), () => {
                        t.expect(yesMock).toBe(bar);
                        t.expect(bar.isHidden()).toBe(true);
                        bar.show();

                        bar.setNo(true);
                        t.expect(bar.isHidden()).toBe(false);
                        t.click(no(), () => {
                            t.expect(bar.isHidden()).toBe(true);
                            bar.show();
                            let noMock;
                            bar.setNo((bar) => noMock = bar);
                            t.expect(bar.isHidden()).toBe(false);
                            t.click(no(), () => {
                                t.expect(bar.isHidden()).toBe(true);
                                t.expect(noMock).toBe(bar);
                            });

                        });


                    });
                });
            });
        });


        t.it("setAnnouncement", (t) => {

            bar = createBar({
                message: "Hello World",
                link: "okay"
            });
            bar.show();

            const
                dom = () => bar.el.dom.firstChild,
                message = () => dom().firstChild.firstChild,
                yes = () => message().nextSibling ,
                no =  () => yes().nextSibling;

            t.expect(Ext.fly(yes()).isVisible()).toBe(false);
            t.expect(Ext.fly(no()).isVisible()).toBe(false);

            bar.setAnnouncement({yes: () => {}});

            t.expect(Ext.fly(yes()).isVisible()).toBe(true);
            t.expect(Ext.fly(no()).isVisible()).toBe(false);

            bar.setAnnouncement({no: () => {}});

            t.expect(Ext.fly(yes()).isVisible()).toBe(false);
            t.expect(Ext.fly(no()).isVisible()).toBe(true);
            bar.setAnnouncement({message: ""});

            t.expect(Ext.fly(yes()).isVisible()).toBe(false);
            t.expect(Ext.fly(no()).isVisible()).toBe(false);

        });


        t.it("coon.Announcement.show()", (t) => {

            coon.Announcement.register( createBar({
                message: "Hello World",
                link: "okay"
            }));

            bar = coon.Announcement.show({message: 1});
            t.expect(bar.getMessage()).toBe(1);

            coon.Announcement.show({message: 2});
            t.expect(bar.getMessage()).toBe(1);

            coon.Announcement.show({message: 3});
            t.expect(bar.getMessage()).toBe(1);

            coon.Announcement.show({message: 4});
            t.expect(bar.getMessage()).toBe(1);

            coon.Announcement.show({message: 5});
            t.expect(bar.getMessage()).toBe(1);

            bar.hide();
            t.expect(bar.getMessage()).toBe(2);

            bar.hide();
            t.expect(bar.getMessage()).toBe(3);

            bar.hide();
            t.expect(bar.getMessage()).toBe(4);

            bar.hide();
            t.expect(bar.getMessage()).toBe(5);

        });


        t.it("yes/no custom text", t => {

            let yesCall = 0, noCall = 0;

            bar = createBar({
                message: "Hello World",
                yes: {
                    text: "That's okay",
                    callback: () => yesCall++
                }
            });
            bar.show();

            const
                dom = () => bar.el.dom.firstChild,
                message = () => dom().firstChild.firstChild,
                yes = () => message().nextSibling ,
                no =  () => yes().nextSibling;

            t.expect(Ext.fly(yes()).isVisible()).toBe(true);
            t.expect(message().innerHTML).toBe("Hello World");
            t.expect(yes().innerHTML).toBe("That's okay");

            t.click(yes(), () => {
                t.expect(yesCall).toBe(1);
                t.expect(noCall).toBe(0);
                t.expect(bar.isHidden()).toBe(true);
                bar.show();

                bar.setNo({
                    text: "I'm good, thanks",
                    callback: () => noCall++
                });

                t.expect(Ext.fly(no()).isVisible()).toBe(true);
                t.expect(no().innerHTML).toBe("I'm good, thanks");

                t.click(no(), () => {
                    t.expect(yesCall).toBe(1);
                    t.expect(noCall).toBe(1);

                    t.expect(bar.isHidden()).toBe(true);
                });
            });

        });


        t.it("extjs-lib-comp#6", t => {

            coon.Announcement.register( createBar({
                message: "Hello World",
                link: "okay"
            }));

            bar = coon.Announcement.show({message: 1, no: {text: "nono"}, yes: {text: "option", callback: () =>{}}});
            t.expect(bar.getMessage()).toBe(1);

            const
                dom = () => bar.el.dom.firstChild,
                message = () => dom().firstChild.firstChild,
                yes = () => message().nextSibling ,
                no =  () => yes().nextSibling;

            t.expect(Ext.fly(yes()).isVisible()).toBe(true);
            t.expect(yes().innerHTML).toBe("option");

            t.expect(Ext.fly(no()).isVisible()).toBe(true);
            t.expect(no().innerHTML).toBe("nono");

            coon.Announcement.show({yes: () => {}});

            t.expect(yes().innerHTML).toBe("option");

            bar.hide();
            t.expect(bar.isVisible()).toBe(true);
            t.expect(Ext.fly(no()).isVisible()).toBe(false);


            t.expect(Ext.fly(yes()).isVisible()).toBe(true);

            t.expect(yes().innerHTML).toBe("yes");

            coon.Announcement.show({no: () => {}});
            bar.hide();
            t.expect(bar.isVisible()).toBe(true);
            t.expect(Ext.fly(no()).isVisible()).toBe(true);
            t.expect(no().innerHTML).toBe("no");

            let closeSpy =  t.spyOn(bar, "close").and.callThrough();
            coon.Announcement.close();
            t.expect(closeSpy.calls.all().length).toBe(1);
            closeSpy.remove();
        });


        t.it("fix: call to show() triggers error if AnnouncementBar was not registered yet - coon-js/extjs-lib-comp#22", t => {

            bar = coon.Announcement.show({message: "Hello World", type: "success"});
            t.expect(bar).toBeUndefined();

            const add = createBar({});
            bar = coon.Announcement.register(add);
            bar.show();
            t.expect(bar).toBe(add);
            t.expect(bar.getMessage()).toBe("Hello World");
            t.expect(bar.getType()).toBe("success");
            bar.hide();
            t.expect(bar.isVisible()).toBe(true);
            t.expect(bar.getMessage()).toBe("Hello World");

        });

        t.it("coon.Announcement.urge()", (t) => {

            bar = coon.Announcement.urge({message: 0});
            t.expect(bar).toBeUndefined();

            bar = coon.Announcement.register( createBar({
                message: "Hello World",
                link: "okay"
            }));

            t.expect(bar.getMessage()).toBe(0);
            bar.hide();

            t.expect(bar.getMessage()).toBe("Hello World");
            bar.hide();

            coon.Announcement.show({message: 1}); // 1
            t.expect(bar.getMessage()).toBe(1);
            t.expect(bar.currentAnnouncement().message).toBe(1);

            coon.Announcement.show({message: 2}); // 2 1
            t.expect(bar.getMessage()).toBe(1);
            t.expect(bar.currentAnnouncement().message).toBe(1);

            coon.Announcement.urge({message: 4}); // 2 1 4
            t.expect(bar.isVisible()).toBe(true);
            t.expect(bar.getMessage()).toBe(4);
            t.expect(bar.currentAnnouncement().message).toBe(4);

            coon.Announcement.show({message: 5}); // 5 2 1 4
            t.expect(bar.getMessage()).toBe(4);
            t.expect(bar.currentAnnouncement().message).toBe(4);

            bar.hide();
            t.expect(bar.getMessage()).toBe(1); // 2 1
            t.expect(bar.currentAnnouncement().message).toBe(1);

            bar.hide();
            t.expect(bar.getMessage()).toBe(2); // 2
            t.expect(bar.currentAnnouncement().message).toBe(2);

            bar.hide();
            t.expect(bar.getMessage()).toBe(5); // 5
            t.expect(bar.currentAnnouncement().message).toBe(5);

            bar.hide();
            bar.show();
            t.expect(bar.getMessage()).toBe(5); // 5
            t.expect(bar.currentAnnouncement().message).toBe(5);
        });

        t.it("urge() sets bar visible", (t) => {

            bar = coon.Announcement.register( createBar({
                message: "Hello World",
                link: "okay"
            }));
            bar.show();
            t.expect(bar.isVisible()).toBe(true);

            bar.hide();
            t.expect(bar.isVisible()).toBe(false);

            bar = coon.Announcement.urge({message: 0});
            t.expect(bar.isVisible()).toBe(true);
            t.expect(bar.getMessage()).toBe(0);
        });
    });});
