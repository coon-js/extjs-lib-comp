/**
 * conjoon
 * (c) 2007-2019 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2019 Thorsten Suckow-Homberg/conjoon.org
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

describe('conjoon.cn_comp.container.LoadMaskTest', function(t) {

    var panel;

    t.beforeEach(function() {
        panel = Ext.create('Ext.Panel', {
            renderTo : document.body,
            width    : 600,
            height   : 400
        });
    });

    t.afterEach(function() {
        if (panel) {
            panel.destroy();
            panel = null;
        }
    });



// +----------------------------------------------------------------------------
// |                    =~. Tests .~=
// +----------------------------------------------------------------------------

    t.it('test class and configuration', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            });

        t.isInstanceOf(w, 'Ext.LoadMask');

        t.expect(w.cls).toContain('cn_comp-loadmask');

        t.expect(w.childEls.msgActionEl).toBeDefined();
        t.expect(w.childEls.bar).toBeDefined();

        t.expect(w.msgWidth).toBe(200);
        t.expect(w.glyphCls).toBe('');
    });


    t.it('initRenderData()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel,
                glyphCls  : 'fa fa-envelope',
                msgWidth  : 300,
                msgAction : 'foo'
            }),
            result = w.initRenderData();

        t.expect(result.glyphCls).toBe('fa fa-envelope');
        t.expect(result.msgWidth).toBe(300);
        t.expect(result.msgAction).toBe('foo');

    });


    t.it('updateActionMsg()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel,
                msgAction : 'foo'
            }),
            node, m;

        node = Ext.dom.Query.selectNode('div[data-ref=msgActionEl]', w.el.dom);
        t.expect(node.innerHTML).toBe('foo');

        m = w.updateActionMsg('bar');
        t.expect(node.innerHTML).toBe('bar');
        t.expect(m).toBe(w);
    });


    t.it('updateProgress()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel
            }),
            node, m;

        t.isCalled('clearTimer', w);

        node = Ext.dom.Query.selectNode('div[data-ref=bar]', w.el.dom);
        t.expect(node.style.width).toBe("0%");

        m = w.updateProgress(0.5);
        t.expect(node.style.width).toBe("50%");
        t.expect(m).toBe(w);

    });


    t.it('loopProgress()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel
            }),
            m, node;

        node = Ext.dom.Query.selectNode('div[data-ref=bar]', w.el.dom);
        t.expect(node.style.transitionDuration).not.toBe('0.1s');

        t.expect(w.waitTimer).toBeFalsy();

        t.isCalledOnce('setTransitionDuration', w);
        t.isCalled('updateProgress', w);
        t.isntCalled('clearTimer', w);
        t.isCalled('calculatePercFromTask', w);
        m = w.loopProgress({increment: 50, interval : 100});

        t.expect(node.style.transitionDuration).toBe('0.1s');

        t.expect(m).toBe(w);

        t.isObject(w.waitTimer);

        t.waitForMs(500, function() {
            // set timeout so tests can pass
        });

    });


    t.it('clearTimer()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            });

        t.expect(w.waitTimer).toBeFalsy();

        t.isntCalled('resetProgress', w);
        w.loopProgress({increment: 50, interval : 1000});
        t.expect(w.waitTimer).toBeTruthy();

        t.waitForMs(200, function() {
            w.clearTimer();
            t.expect(w.waitTimer).toBeFalsy();
        });
    });


    t.it('stop task with Ext.TaskManager.stop()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            });

        t.expect(w.waitTimer).toBeFalsy();

        t.isCalledOnce('resetProgress', w);
        w.loopProgress({increment: 50, interval : 1000});
        t.expect(w.waitTimer).toBeTruthy();

        Ext.TaskManager.stop(w.waitTimer);

        t.waitForMs(200, function() {
            t.expect(w.waitTimer).toBeFalsy();
        });
    });


    t.it('resetBar()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            }),
            node, m;

        t.expect(w.waitTimer).toBeFalsy();

        m = w.loopProgress({increment: 50, interval : 100});
        t.expect(m).toBe(w);
        t.isObject(w.waitTimer);

        t.waitForMs(150, function() {

            node = Ext.dom.Query.selectNode('div[data-ref=bar]', w.el.dom);
            t.expect(node.style.width).not.toBe("0%");

            w.resetBar();

            t.expect(node.style.width).toBe("0%");
            t.notOk(w.waitTimer);


        });
    });


    t.it('hide()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel,
                msgAction : 'foo'
            });

        t.isCalledOnce('hide', w.superclass);
        t.isCalledOnce('resetBar', w);

        w.hide();
    });


    t.it('resetProgress()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            }),
            m;

        t.isntCalled('hide', w);
        t.isCalledOnce('resetBar', w);

        m = w.resetProgress();

        t.expect(m).toBe(w);
    });


    t.it('resetProgress(true)', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            }),
            m;

        t.isCalledOnce('hide', w);
        t.isCalledNTimes('resetBar', w, 2, "resetBar called 2 times (from hide())");

        m = w.resetProgress(true);

        t.expect(m).toBe(w);
    });


    t.it('calculatePercFromTask()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
            target : panel
        });

        t.expect(w.calculatePercFromTask(10, 1)).toBe(0);
        t.expect(w.calculatePercFromTask(10, 2)).toBe(0.1);
        t.expect(w.calculatePercFromTask(10, 3)).toBe(0.2);
        t.expect(w.calculatePercFromTask(10, 4)).toBe(0.3);
        t.expect(w.calculatePercFromTask(10, 5)).toBe(0.4);
        t.expect(w.calculatePercFromTask(10, 6)).toBe(0.5);
        t.expect(w.calculatePercFromTask(10, 7)).toBe(0.6);
        t.expect(w.calculatePercFromTask(10, 8)).toBeGreaterThan(0.7);
        t.expect(w.calculatePercFromTask(10, 8)).toBeLessThan(0.8);
        t.expect(w.calculatePercFromTask(10, 9)).toBe(0.8);
        t.expect(w.calculatePercFromTask(10, 10)).toBe(0.9);
        t.expect(w.calculatePercFromTask(10, 11)).toBe(1);
        t.expect(w.calculatePercFromTask(10, 12)).toBe(0);
    });


    t.it('doDestroy()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            });

        t.isCalled('clearTimer', w);
        t.isCalled('doDestroy', w.superclass);

        w.doDestroy();
    });


    t.it('setTransitionDuration()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel
            }),
            node;

        node = Ext.dom.Query.selectNode('div[data-ref=bar]', w.el.dom);
        w.setTransitionDuration(12);
        t.expect(node.style.transitionDuration).toBe('12s');
        w.setTransitionDuration(0.5);
        t.expect(node.style.transitionDuration).toBe('0.5s');

    });


    t.it('Should start with specified progress', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel,
                progress  : 0.3
            }),
            node, m;

        node = Ext.dom.Query.selectNode('div[data-ref=bar]', w.el.dom);
        t.expect(node.style.width).toBe("30%");
    });


    t.it('Manual call to updateProcess() should stop loop timer', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target    : panel
            }),
            m, node;

        w.loopProgress({increment: 50, interval : 100});

        t.isCalled('clearTimer', w);

        t.waitForMs(200, function() {
            w.updateProgress(1);
        });

    });


    t.it('updateMsg()', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
                target : panel,
                msg    : 'foo'
            }),
            node, m;

        node = Ext.dom.Query.selectNode('div[data-ref=msgTextEl]', w.el.dom);
        t.expect(node.innerHTML).toBe('foo');

        m = w.updateMsg('bar');
        t.expect(node.innerHTML).toBe('bar');
        t.expect(m).toBe(w);
    });


    t.it('make sure load mask is destroyed', function(t) {
        var w = Ext.create('conjoon.cn_comp.component.LoadMask', {
            target : panel
        });


        panel.destroy();

        t.expect(w.destroyed).toBe(true);

    });

});