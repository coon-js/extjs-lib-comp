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
 * ViewPortMock. This instance's addPostLaunchInfo collects the data in a
 * queryable property.
 */
Ext.define('conjoon.classic.test.container.mock.ViewportMock', {

    extend : 'conjoon.cn_comp.container.Viewport',

    postLaunchInfo : null,

    addPostLaunchInfo : function(info) {

        this.postLaunchInfo = this.postLaunchInfo || [];

        this.postLaunchInfo.push(info);

    }



});
