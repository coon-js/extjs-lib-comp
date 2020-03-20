/**
 * coon.js
 * lib-cn_comp
 * Copyright (C) 2017-2020 Thorsten Suckow-Homberg https://github.com/coon-js/lib-cn_comp
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
 * This special implementation of a FileButton provides HTML5 functionality
 * for selecting multiple files at once.
 * The change event of this button provides an additional argument for
 * accessing the FileList object with all the files selected by the user.
 *
 *      @example
 *      Ext.define('MyApp.FileButton', {
 *
 *          extend : 'coon.comp.form.FileButton',
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
Ext.define("coon.comp.form.field.FileButton", {

    extend : "Ext.form.field.FileButton",

    requires : [
        /**
         * @see https://www.sencha.com/forum/showthread.php?339216-6-2-(GPL)-Styles-for-Ext-form-field-FileButton-not-loaded-generated-in-production&p=1178359#post1178359
         * @bug this is needed so the css styles for the FileButton get loaded.
         * Otherwise, the FileButton is not properly rendered in production mode.
         */
        "Ext.form.field.File"
    ],

    alias : "widget.cn_comp-formfieldfilebutton",

    /**
     * @event change
     * @param {coon.comp.form.FileButton} this
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
        "<input id=\"{id}-fileInputEl\" data-ref=\"fileInputEl\" class=\"{childElCls} {inputCls}\" ",
        "type=\"file\" size=\"1\" name=\"{inputName}\" multiple=\"true\" unselectable=\"on\" ",
        "<tpl if=\"accept != null\">accept=\"{accept}\"</tpl>",
        "<tpl if=\"tabIndex != null\">tabindex=\"{tabIndex}\"</tpl>",
        ">"
    ],

    /**
     * @inheritdoc
     *
     * Overriden to make sure the fileList of this button is passed as a fourth
     * argument to any listening observer.
     */
    fireChange: function (evt) {
        var me      = this,
            fileDom = me.fileInputEl.dom;

        me.fireEvent("change", me, evt, fileDom.value, fileDom.files);
    }

});
