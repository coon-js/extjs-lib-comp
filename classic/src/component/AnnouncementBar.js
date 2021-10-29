/**
 * coon.js
 * extjs-lib-comp
 * Copyright (C) 2021 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-comp
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
 * An basic announcement bar to be used in applications.
 * Provides options to show "yes"/no"-buttons, and a closable link.
 *
 * Example usage:
 *
 *     @example
 *     Ext.define("MyPanel", {
 *         extend: "Ext.Panel",
 *
 *         layout : {
 *             "vbox"
 *         },
 *
 *         items: [{
 *             xtype : "cn_comp-announcementbar"
 *         }, {
 *             xtype: "panel",
 *             html: "main panel"
 *         }]
 *     });
 *
 *     const p = Ext.create("MyPanel");
 *
 *     coon.Announcement.register(p.down("cn_comp-announcementbar"));
 *
 *     coon.Announcement.show({
 *         "message": "This application has an update, reload?",
 *         "yes": () => window.location.reload(),
 *         "no": true, // clicking yes/no will hide the bar, use "true" to render default "no" options
 *         "type": "warning"
 *     })
 *
 */
Ext.define("coon.comp.component.AnnouncementBar", {

    extend: "Ext.Component",

    requires: [
        // @define
        "l8"
    ],

    alias: "widget.cn_comp-announcementbar",

    statics: {
        INFO: 1,
        WARNING: 2,
        ALERT: 3,
        SUCCESS: 4
    },

    hidden: true,

    config: {
        /**
         * The message to show in the announcement bar
         * @string
         */
        message: undefined,

        /**
         * The link text to show on the right side of the announcement bar
         *
         * @type string
         */
        link: undefined,

        /**
         * The type of the message. See statics for this class.
         *
         * @type {Number}
         */
        type: undefined,

        /**
         * The callback for the link click event. The argument the method gets called with is
         * this announcement bar.
         *
         * @type {Function}
         */
        callback: Ext.emptyFn,

        /**
         * The callback for a "yes"-option, if any.
         *
         * @type {Function}
         */
        yes: undefined,

        /**
         * The callback for a "no"-option, if any.
         *
         * @type {Function}
         */
        no: undefined
    },

    /**
     * @cfg renderTpl
     * @inheritdoc
     */
    renderTpl: [
        "<div id=\"{id}-barEl\" data-ref=\"barEl\" class=\"wrap {type}\" role=\"presentation\">" +
            "<div class=\"msgWrap\">" +
                "<div id=\"{id}-msgEl\" class=\"msg\" data-ref=\"msgEl\">{message}</div>" +
                "<div data-ref=\"yesEl\" id=\"{id}-yesEl\" class=\"yes\">yes</div>" +
                "<div data-ref=\"noEl\" id=\"{id}-noEl\" class=\"no\">no</div>" +
            "</div>" +
            "<div id=\"{id}-linkEl\" class=\"link\" data-ref=\"linkEl\" >{link}</div>" +
        "</div>"
    ],

    childEls: [
        "linkEl",
        "msgEl",
        "barEl",
        "yesEl",
        "noEl"
    ],

    cls: "cn_comp-announcementbar",


    /**
     * @inheritdoc
     */
    initRenderData: function () {
        const
            me = this,
            result = me.callParent(arguments);

        result.type = me.translateType(me.type);
        result.message = me.message;
        result.link = me.link;
        result.className = me.cls;
        result.yes = me.yes;
        result.no = me.no;

        return result;
    },


    /**
     * Overrides parent implementation to make sure this component's el "click"
     * event is handled by #onClick()
     *
     * @ee onClick
     */
    afterRender () {
        const me = this;

        me.callParent(arguments);

        if (!me.getYes()) {
            me.yesEl.hide();
        }

        if (!me.getYes()) {
            me.noEl.hide();
        }

        me.el.on("click", me.onClick, me);
    },


    /**
     * Handles a "link" click. The argument passed to the #callback, if any
     * defined for this instance, is the announcementBar itself.
     * If the click-event was detected on a yes/no-option, the type of the option
     * will be passed as an argument
     *
     * @param this bar
     * @param {String} type
     *
     * @private
     */
    handleLinkClick: function (bar, type) {
        const
            me = this;

        let callback;

        switch (type) {
        case "yes":
            callback = me.getYes();
            break;
        case "no":
            callback = me.getNo();
            break;
        default:
            callback = me.getCallback();
            break;
        }

        if (l8.isFunction(callback)) {
            callback(me);
        }

        me.hide();
    },


    /**
     * Handler for this el's click event. Delegates to handleLinkClick
     * if a valid target was clicked.
     *
     * @param {Ext.util.Event} evt
     * @param {HtmlElement} el
     *
     * @see handleButtonClick
     */
    onClick: function (evt, el) {
        const me = this,
            id = el.id.split("-").pop();

        if (el.tagName.toLowerCase() === "div") {

            switch (id) {
            case "linkEl":
                return me.handleLinkClick.apply(me);

            case "yesEl":
                return me.handleLinkClick.apply(me, [me, "yes"]);

            case "noEl":
                return me.handleLinkClick.apply(me, [me, "no"]);
            }
        }

    },


    /**
     * Removes and destroys this component.
     *
     * @see destroy
     */
    close: function () {
        this.destroy();
    },


    /**
     * @param {String} msg
     */
    updateMessage (msg) {
        this.msgEl && this.msgEl.update(msg);
    },

    /**
     * @param {String} msg
     */
    updateLink (link) {
        this.linkEl && this.linkEl.update(link);
    },

    /**
     * @param {String} msg
     */
    updateYes (yesCallback) {
        this.yesEl && this.yesEl[yesCallback ? "show" : "hide"]();
    },


    /**
     * @param {String} msg
     */
    updateNo (noCallback) {
        this.noEl && this.noEl[noCallback ? "show" : "hide"]();
    },

    /**
     * Sets the type for the announcement.
     * Can be an integer representing one of the statics of this class,
     * or a string.
     *
     * @param {String|Number}
     * @returns {String}
     */
    applyType (type) {
        return this.translateType(type);
    },


    /**
     * @param {String} type
     */
    updateType (type,oldType) {
        const
            me = this,
            el = me.barEl;

        if (!el) {
            return;
        }

        el.removeCls(oldType);
        el.addCls(type);
    },


    /**
     * (Re-)configures this instance with the data founc in msg.
     * @param {Object} msg
     */
    setAnnouncement (announcement = {}) {

        const
            me = this,
            ann = announcement;


        ann.message && me.setMessage(ann.message);
        ann.type && me.setType(ann.type);
        ann.link && me.setLink(ann.link);
        ann.callback && me.setCallback(ann.callback);
        me.setYes(ann.yes ?? null);
        me.setNo(ann.no ?? null);

        this.show();

        return this;
    },


    /**
     * @private
     */
    translateType (type) {

        const
            me = this,
            types = {},
            statics = me.statics();

        types[statics.INFO] = "info";
        types[statics.ALERT] = "alert";
        types[statics.WARNING] = "warning";
        types[statics.SUCCESS] = "success";

        return types[type] ? types[type] : Object.values(types).includes(type) ? type : "info";
    },


    /**
     * no store functionality
     */
    bindStore: Ext.emptyFn,


    /**
     * no store functionality
     */
    getStoreListeners: Ext.emptyFn,


    /**
     * no store functionality
     */
    onLoad: Ext.emptyFn,


    /**
     * no store functionality
     */
    onBeforeLoad: Ext.emptyFn


}, AnnouncementBar => {

    coon.Announcement = function () {

        let announcementBar;
        const stack = [];

        /**
         * Shows the announcement.
         *
         * @param {Object} announcement
         */
        const show = (announcement) => {
            return announcementBar.setAnnouncement(announcement);
        };

        /**
         * Processes the stack of announcements that could not be shown
         * since an announcement was visible.
         */
        const processStack = () => {
            if (stack.length) {
                show(stack.shift());
            }
        };

        return {
            /**
             * Sets the announcementBar that should be used for showing announcements.
             * @param target
             */
            register (target) {
                announcementBar = target;
                announcementBar.on("hide", processStack, null);
            },


            /**
             * Shows the configured announcement if, and only if the current announcement is not visible.
             * Otherwise, the announcement will be placed on a stack and processed once the current
             * announcement was hidden.
             *
             * @param announcement
             */
            show (announcement) {
                if (announcementBar.isVisible()) {
                    stack.push(announcement);
                    return;
                }

                return show(announcement);
            }

        };
    }();
});
