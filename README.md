# @coon-js/extjs-lib-comp  
This **Sencha ExtJS** package contains view functionality for the coon.js 
project.
Files found herein represent view implementations.  

## Installation
```
npm install --save-dev @coon-js/extjs-lib-core
```

## Post-Install
[@coon-js/extjs-link](https://npmjs.org/coon-js/extjs-link) will start once the package was installed and guide you
through the process of creating symlinks to an existing ExtJS sdk installation.
This is only required if you want to run the tests (`./tests`), as [Siesta](https//npmjs.org/siesta-lite) relies on
an existing ExtJS installation.

## Naming
The following naming conventions apply:

#### Namespace
`coon.comp.*`
#### Package name
`extjs-lib-comp`
#### Shorthand to be used with providing aliases
`cn_comp`

**Example:**
Class `coon.comp.component.Iframe` has the alias `widget.cn_comp-iframe`

## Tests
Tests are written with [Siesta](https://bryntum.com/siesta)

# Usage
## Requirements
This package requires the [extjs-lib-core](https://github.com/coon-js/extjs-lib-core) package of the [coon.js](https://github.com/coon-js) project.

## Resources
The folder `resources/html` with it's contents and subfolders has to be copied into your
application's resource folder if you want to use this package.


#### coon.comp.form.AutoCompleteForm
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

For more information, see the documentation of [coon.comp.form.AutoCompleteForm](https://github.com/coon-js/extjs-lib-comp/blob/master/classic/src/form/AutoCompleteForm.js).