# lib-cn_comp  [![Build Status](https://travis-ci.org/conjoon/lib-cn_comp.svg?branch=master)](https://travis-ci.org/conjoon/lib-cn_comp)

#### conjoon.cn_comp.form.AutoCompleteForm
When using the AutoCompleteForm you have to make sure that the
```javascript
autoCompleteTrigger.actionUrl
```
configuration option is set to a valid document. In the package itself, the
default value for this property is
```javascript
 defaultFakeActionUrl : './resources/html/blank.html'
```
This is an empty html page and resides in this package's resource folder.
If you do not specify a custom actionUrl for your AutoCompleteForm, simply copy the resources over to your application's resource folder.

For more information, see the documentation of [conjoon.cn_comp.form.AutoCompleteForm](https://github.com/conjoon/lib-cn_comp/blob/master/classic/src/form/AutoCompleteForm.js).