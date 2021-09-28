# @coon-js/extjs-lib-comp  
Common and extended view component implementations for rapid, modular ExtJS application building.

## Installation
```bash
npm i --save-dev @coon-js/extjs-lib-comp
```

If you want to develop with `extjs-lib-comp`, run the `build:dev`-script afterwards:
```bash
npm run build:dev
```
Testing environment will then be available via

```bash
npm test
```



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