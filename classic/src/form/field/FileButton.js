/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * lib-cn_comp
 * Copyright (C) 2017 Thorsten Suckow-Homberg/conjoon.org
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
 * This special implementation of a FileButton provides HTML5 functionality
 * for selecting multiple files at once.
 * The change event of this button provides an additional argument for
 * accessing the FileList object with all the files selected by the user.
 *
 *      @example
 *      Ext.define('MyApp.FileButton', {
 *
 *          extend : 'conjoon.cn_comp.form.FileButton',
 *
 *          text : 'Browse',
 *
 *          listeners : {
 *
 *              change : function(field, e, value, fileList) {
 *
 *                  for (var i = 0, len = fileList.length; i < len; i++) {
 *                      console.log(
 *                          "name", fileList[i].name,
  *                          "size", fileList[i].size,
  *                          "type", fileList[i].text
 *                      );
 *                  }
 *
 *              }
 *
 *          }
 *
 *      });
 *
 */
Ext.define('conjoon.cn_comp.form.field.FileButton', {

    extend : 'Ext.form.field.FileButton',

    alias : 'widget.cn_comp-formfieldfilebutton',

    /**
     * @event change
     * @param {conjoon.cn_comp.form.FileButton} this
     * @param {Ext.event.Event} evt
     * @param {String} value
     * @param {FileList} fileList
     */

    /**
     * @inheritdoc
     *
     * Inherits parent's template and adds "multiple" attribute
     */
    afterTpl: [
        '<input id="{id}-fileInputEl" data-ref="fileInputEl" class="{childElCls} {inputCls}" ',
        'type="file" size="1" name="{inputName}" multiple="true" unselectable="on" ',
        '<tpl if="accept != null">accept="{accept}"</tpl>',
        '<tpl if="tabIndex != null">tabindex="{tabIndex}"</tpl>',
        '>'
    ],

    /**
     * @inheritdoc
     *
     * Overriden to make sure the fileList of this button is passed as a fourth
     * argument to any listening observer.
     */
    fireChange: function(evt) {
        var me      = this,
            fileDom = me.fileInputEl.dom;

        me.fireEvent('change', me, evt, fileDom.value, fileDom.files);
    }

});
