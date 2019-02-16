/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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
 * An extended LoadMask which is capable of showing a ProgressBar and more
 * information providing an msgAction, describing the current step the LoadMask
 * is representing of a process.
 * The LoadMask's msgElement can be styled with a glyph, providing the config
 * glyphCls.
 *
 * Example usage:
 *
 *     @example
 *     var myPanel = new Ext.panel.Panel({
 *         renderTo : document.body,
 *         height   : 400,
 *         width    : 800,
 *         title    : 'Foo'
 *     });
 *
 *     var myMask = Ext.create('coon.comp.component.LoadMask', {
 *         msg       : 'Saving Data',
 *         msgAction : 'Stand by...',
 *         glyphCls  : 'fa fa-envelope',
 *         target    : myPanel
 *     });
 *
 *     myMask.show();
 *
 *     // loops the progress bar to indicate something's going on
 *     myMask.loopProgress({
 *         increment : 100,
 *         interval : 10
 *     });
 *
 *     // sets the progress manually to "50%"
 *     myMask.updateProgress(0.5, true);
 *
 *     // update the msgAction by hand
 *     myMask.updateActionMsg('Uploading attachments...');
 *
 *
 * CSS3 Transitions:
 * =================
 * This class relies on CSS3 Transitions. Therefor, it does not use the
 * animations from Ext itself. The loopProgress method will alter the
 * transitionDuration of the bar-element according to the selected interval.
 */
Ext.define('coon.comp.component.LoadMask', {

    extend: 'Ext.LoadMask',

    cls :  Ext.baseCSSPrefix + 'mask' + ' cn_comp-loadmask',

    childEls: [
        'msgWrapEl',
        'msgEl',
        'msgTextEl',
        'msgActionEl',
        'bar'
    ],

    /**
     * Default width for the msg element excluding the badge.
     * @type {Number} [msgWidth=200]
     */
    msgWidth : 200,

    /**
     * The timer object created for this loadMask when loopProgress was called.
     * @type {Object}
     * @private
     */
    waitTimer : null,

    /**
     * The glyphCls to use for showing in the badge of the message element.
     * @type {String} glyphCls
     */
    glyphCls : '',

    /**
     * Number between 0 and 1 to start the progress bar with.
     * @type {Float} progress
     */
    progress : 0,

    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',
        '<div class="badge {glyphCls}"></div><div style="width:{msgWidth}px">',
        '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
        Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
        '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
        Ext.baseCSSPrefix, 'mask-msg-text',
        '{childElCls}" role="presentation">{msg}</div>',
        '</div>',
        '<div class="progress"><div id="{id}-bar" data-ref="bar"></div></div>',
        '<div id="{id}-msgActionEl" data-ref="msgActionEl">{msgAction}</div>',
        '</div></div>'
    ],


    /**
     * @inheritdoc
     */
    initRenderData: function() {
        var me     = this,
            result = me.callParent(arguments);

        result.msgAction = me.msgAction || '';
        result.msgWidth  = me.msgWidth  || 200;
        result.glyphCls  = me.glyphCls;

        return result;
    },


    /**
     * We also add a listener to this #target's destroy-event, which
     * will trigger destroying THIS LoadMask.
     *
     *  @inheritdoc
     */
    afterRender : function() {
        var me = this;

        me.callParent(arguments);

        me.updateProgress(me.progress);

        if (me.target && me.target.isComponent) {
            me.target.on('destroy', me.destroy, me);
        }
    },


    /**
     * Updates this elements msgActionEl with the provided text.
     *
     * @param {String} value
     *
     * @return {coon.comp.component.LoadMask}
     */
    updateActionMsg : function(value) {
        var me = this;

        me.msgActionEl.setHtml(value);

        return me;
    },


    /**
     * Updates this elements msgEl with the provided text.
     *
     * @param {String} value
     *
     * @return {coon.comp.component.LoadMask}
     */
    updateMsg : function(value) {
        var me = this;

        me.msgTextEl.setHtml(value);

        return me;
    },

    /**
     * Updates the progress bar's width with the specified value, wheres
     * the value should be any number between 0 and 1
     *
     * @param {Number} value
     * @param {Boolean} internal Whether this method was called internally.
     * If not submitted or set to false, this value will stop any timers
     * previously created by #loopProgress
     *
     * @return {coon.comp.component.LoadMask}
     */
    updateProgress: function(value, isInternal) {
        var me    = this,
            value = value || 0;

        if (isInternal !== true) {
            me.clearTimer();
        }

        me.bar.setStyle('width', (value * 100) + '%');

        return me;
    },


    /**
     * Loops the progress bar automatically to indicate a progress is currently
     * going on.
     *
     * @param {Object} config (optional) Configuration options
     * @param {Number} config.duration The time in ms the progress bar will be
     * looped before it resets itself. If set to undefined/ omitted it will
     * run indefinitely until #resetProgress was callesd
     * @param {Number} config.interval The length of time in ms before the progress
     * bar is incremented (defaults to 1000)
     * @param {Number} config.increment This is the number of segments the progress
     * bar is divided in (defaults to 10). Each segment will be filled after
     * config.interval ms. Once the end of the segments was reached,
     * the bar will begin in the first segment again.

     * @returns {coon.comp.component.LoadMask}
     */
    loopProgress : function(config) {

        var me = this,
            interval, increment;

        if (!me.waitTimer) {
            config = config || {};

            interval  = config.interval ||  500;
            increment = config.increment || 10;

            me.setTransitionDuration(interval/1000);

            me.waitTimer = Ext.TaskManager.start({
                run: function(i) {
                    me.updateProgress(
                        me.calculatePercFromTask(increment, i), true
                    );
                },
                interval : interval,
                duration : config.duration,
                onStop   : function(){
                    me.resetProgress();
                }
            });
        }

        return me;
    },


    /**
     * @private
     */
    resetBar : function() {
        var me = this;

        me.updateProgress(0);
        me.clearTimer();
    },


    /**
     * @private
     */
    clearTimer : function() {
        var me = this;

        if (me.waitTimer) {
            // prevents recursion when being called from resetBar()
            me.waitTimer.onStop = null;
            Ext.TaskManager.stop(me.waitTimer);
            me.waitTimer = null;
        }
    },


    /**
     * @inheritdoc
     */
    hide : function() {
        var me = this;

        me.resetBar();

        return me.callParent();
    },


    /**
     * Resets the progress bar value to 0 and resets the timer.
     *
     * @param {Boolean} [hide=false] True to hide the progress bar.
     *
     * @return {Ext.ProgressBar} this
     */
    resetProgress : function(hide) {
        var me = this;

        me.resetBar();

        if (hide === true) {
            me.hide();
        }

        return me;
    },


    /**
     * Calculates the float number for the progress bar, based on the number
     * of increments and the current iteration count.
     *
     * @param {Number} increment The number of segemnts of the progress bar
     * @param {Number} iteration The current iteration of the task from which
     * this method is being called.
     *
     * @return {Number}
     *
     * @private
     */
    calculatePercFromTask : function(increment, iteration) {

        var seg     = ((iteration - 1) % (increment + 1)),
            segPerc = (100 / increment);

        return (seg * segPerc) * 0.01;
    },


    /**
     * @inheritdoc
     */
    doDestroy : function() {

        var me = this,
            bar = me.bar;

        me.clearTimer();
        me.callParent();
    },


    /**
     * Sets the transition duration for the progress loop.
     *
     * @param {Number} value The value in s for the transition duration
     *
     * @private
     */
    setTransitionDuration : function(value) {
        var me = this;

        me.bar.setStyle('transitionDuration', value + 's');
    }

});