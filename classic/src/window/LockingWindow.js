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
 * This class provides the modal Ext.Window support.
 * It's configured to be modal, not resizable, not closable via userinput and
 * maximized to block/hide the underlying application.
 */
Ext.define('conjoon.cn_comp.window.LockingWindow', {

    extend : 'Ext.window.Window',

    alias : 'widget.cn_comp-lockingwindow',

    cls : 'cn_comp-lockingwindow',

    autoShow   : true,

    titleAlign : 'center',

    maximized  : true,
    modal      : true,
    closable   : false,
    resizable  : false,

    /**
     * @inheritdoc
     *
     * @param config
     */
    constructor : function(config) {

        var me = this;

        config = config || {};

        delete config.maximized;
        delete config.modal;
        delete config.closable;
        delete config.resizable;

        me.callParent(arguments);
    }

});
