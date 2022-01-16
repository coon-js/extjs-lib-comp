/**
 * coon.js
 * extjs-lib-comp
 * Copyright (C) 2021-2022 Thorsten Suckow-Homberg https://github.com/coon-js/extjs-lib-comp
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
 * Classic toolkit implementation of the AnnouncementBar.
 */
Ext.define("coon.comp.component.AnnouncementBar", {

    extend: "coon.comp.component.AbstractAnnouncementBar",

    alias: "widget.cn_comp-announcementbar",

    /**
     * @cfg renderTpl
     * @inheritdoc
     */
    renderTpl: [
        "<div id=\"{id}-barEl\" data-ref=\"barEl\" class=\"wrap {type}\" role=\"presentation\">" +
            "<div class=\"msgWrap\">" +
                "<div id=\"{id}-msgEl\" class=\"msg\" data-ref=\"msgEl\">{message}</div>" +
                "<div data-ref=\"yesEl\" id=\"{id}-yesEl\" class=\"yes\">{yesText}</div>" +
                "<div data-ref=\"noEl\" id=\"{id}-noEl\" class=\"no\">{noText}</div>" +
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

    /**
     * @inheritdoc
     */
    initRenderData () {
        const
            me = this,
            result = me.callParent(arguments);

        result.type = me.translateType(me.type);
        result.message = me.message;
        result.link = me.link;
        result.className = me.cls;
        result.yes = me.yes;
        result.yesText = me.yesText;
        result.no = me.no;
        result.noText = me.noText;

        return result;
    }
});
