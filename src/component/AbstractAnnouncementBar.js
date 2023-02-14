/**
 * coon.js
 * extjs-lib-comp
 * Copyright (C) 2022-2023 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-comp
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
 * Concrete implementations can be found in the specific toolkits.
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
 *     });
 *
 *     // custom text for "yes"-option
 *     coon.Announcement.show({
 *         "message": "This application has an update, reload?",
 *         "yes": {
 *            text: "Reload window",
 *            callback: () => window.location.reload()
 *          }
 *         "no": false
 *         "type": "info"
 *     })
 *
 */
Ext.define("coon.comp.component.AbstractAnnouncementBar", {

    extend: "Ext.Component",

    requires: [
        // @define
        "l8"
    ],

    inheritableStatics: {
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
         * @type {Object|Function}
         */
        yes: undefined,

        /**
         * The callback for a "no"-option, if any.
         *
         * @type {Object|Function}
         */
        no: undefined,

        /**
         * @type {String}
         */
        yesText: "yes",

        /**
         * @type {String}
         */
        noText: "no"

    },

    /**
     * @type {String} defaultYesText
     * @private
     */
    defaultYesText: "yes",

    /**
     * @type {String} defaultNoText
     * @private
     */
    defaultNoText: "no",

    cls: "cn_comp-announcementbar",

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

        if (!me.getNo()) {
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
    handleLinkClick (bar, type) {
        "use strict";

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
    onClick (evt, el) {
        "use strict";

        const me = this,
            id = el.className;

        if (el.tagName.toLowerCase() === "div") {

            switch (id) {
            case "link":
                return me.handleLinkClick.apply(me);

            case "yes":
                return me.handleLinkClick.apply(me, [me, "yes"]);

            case "no":
                return me.handleLinkClick.apply(me, [me, "no"]);
            }
        }


    },


    /**
     * Removes and destroys this component.
     *
     * @see destroy
     */
    close () {
        "use strict";

        const me = this;

        me.itsAnnouncement = null;
        me.destroy();
    },


    /**
     * @param {String} msg
     */
    updateMessage (msg) {
        "use strict";

        this.msgEl && this.msgEl.update(msg);
    },

    /**
     * @param {String} msg
     */
    updateLink (link) {
        "use strict";

        this.linkEl && this.linkEl.update(link);
    },

    /**
     * Configures the "yes"-option for the AnnouncementBar.
     *
     * @param {Object|Function} yesCallback
     */
    applyYes (yesCallback) {
        "use strict";

        const me = this;

        if (l8.isPlainObject(yesCallback)) {
            me.setYesText(yesCallback.text);
            yesCallback = yesCallback.callback || (() => {});
        } else {
            me.setYesText(me.defaultYesText);
        }

        me.yesEl && me.yesEl[yesCallback ? "show" : "hide"]();

        return yesCallback;
    },


    /**
     * @param {String} yesText
     */
    updateYesText (yesText) {
        "use strict";

        this.yesEl && this.yesEl.update(yesText);
    },


    /**
     * Configures the "no"-option for the AnnouncementBar.
     *
     * @param {Object|Function} noCallback
     */
    applyNo (noCallback) {
        "use strict";

        const me = this;

        if (l8.isPlainObject(noCallback)) {
            me.setNoText(noCallback.text);
            noCallback = noCallback.callback || (() => {});
        } else {
            me.setNoText(me.defaultNoText);
        }

        me.noEl && me.noEl[noCallback ? "show" : "hide"]();
        return noCallback;
    },


    /**
     * @param {String} noText
     */
    updateNoText (noText) {
        "use strict";

        this.noEl && this.noEl.update(noText);
    },


    /**
     * @param {String} msg
     */
    updateNo (noCallback) {
        "use strict";

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
        "use strict";

        return this.translateType(type);
    },


    /**
     * @param {String} type
     */
    updateType (type,oldType) {
        "use strict";

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

        ann.message !== undefined && me.setMessage(ann.message);
        ann.type && me.setType(ann.type);
        ann.link && me.setLink(ann.link);
        ann.callback && me.setCallback(ann.callback);
        me.setYes(ann.yes ? ann.yes :  null);
        me.setNo(ann.no ? ann.no : null);

        this.itsAnnouncement = announcement;
        this.show();

        return this;
    },

    currentAnnouncement () {
        return this.itsAnnouncement;
    },


    /**
     * @private
     */
    translateType (type) {
        "use strict";

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
            "use strict";

            return announcementBar.setAnnouncement(announcement);
        };

        /**
         * Processes the stack of announcements that could not be shown
         * since an announcement was visible.
         */
        const processStack = () => {
            "use strict";

            if (stack.length) {
                show(stack.shift());
            }
        };

        return {

            /**
             * Closes and destroys the AnnouncementBar
             */
            close () {
                "use strict";

                if (announcementBar) {
                    announcementBar.close();
                }

                stack.splice(0);
                announcementBar = null;
            },


            /**
             * Sets the announcementBar that should be used for showing announcements.
             *
             * @param target
             *
             * @return {coon.comp.component.AbstractAnnouncementBar}
             */
            register (target) {
                "use strict";

                // swap if any message is available
                if (stack.length) {
                    const ann = Object.fromEntries(Object.entries(target.config).filter(([key, value]) => [
                        "message", "type", "link", "callback", "yes", "no"
                    ].includes(key)));
                    const announcement = stack.shift();
                    stack.unshift(ann);
                    target.setAnnouncement(announcement);
                }

                announcementBar = target;
                announcementBar.on("hide", processStack, null);

                return announcementBar;
            },


            /**
             * Shows the configured announcement if, and only if the current announcement is not visible.
             * Otherwise, the announcement will be placed on a stack and processed once the current
             * announcement was hidden.
             *
             * @param announcement if undefined, will fall back to currentAnnouncement() of bar
             */
            show (announcement) {
                "use strict";

                if (!announcementBar || announcementBar.isVisible()) {
                    stack.push(announcement);
                    return;
                }

                return show(announcement || announcementBar.currentAnnouncement());
            },


            /**
             * Shows the configured announcement immediately before any existing announcement.
             * @param announcement
             */
            urge (announcement) {
                "use strict";

                if (announcementBar?.currentAnnouncement()) {
                    stack.unshift(announcementBar.currentAnnouncement());
                }

                if (!announcementBar?.isVisible()) {
                    stack.unshift(announcement);
                    return;
                }

                return show(announcement);
            }

        };
    }();
});
