/**
 * conjoon
 * (c) 2007-2016 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2016 Thorsten Suckow-Homberg/conjoon.org
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
