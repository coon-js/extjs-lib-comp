# @coon-js/extjs-lib-comp ![MIT](https://img.shields.io/npm/l/@coon-js/extjs-lib-comp) [![npm version](https://badge.fury.io/js/@coon-js%2Fextjs-lib-comp.svg)](https://badge.fury.io/js/@coon-js%2Fextjs-lib-comp)


Common and extended view component implementations for rapid, modular Ext JS application building.

## Installation
```bash
$ npm i --save-dev @coon-js/extjs-lib-comp
```

If you want to develop with `extjs-lib-comp`, run the `build:dev`-script afterwards:
```bash
$ npm run build:dev
```
Testing environment will then be available via

```bash
$ npm test
```

For using the package as an external dependency in an application, use
```bash
$ npm i @coon-js/extjs-lib-comp
```

In your `app.json`, add this package as a requirement, and make sure your Ext JS `workspace.json`
is properly configured to look up local repositories in the `node_modules`-directory.

Example (`workspace.json`) :
```json 
{
  "packages": {
    "dir": "${workspace.dir}/node_modules/@l8js,${workspace.dir}/node_modules/@conjoon,${workspace.dir}/node_modules/@coon-js,${workspace.dir}/packages/local,${workspace.dir}/packages,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name},${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-treegrid,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-base,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-ios,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-material,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-aria,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-neutral,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-classic,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-gray,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-crisp,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-crisp-touch,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-neptune,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-neptune-touch,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-triton,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-graphite,${workspace.dir}/node_modules/@sencha/ext-${toolkit.name}-theme-material,${workspace.dir}/node_modules/@sencha/ext-calendar,${workspace.dir}/node_modules/@sencha/ext-charts,${workspace.dir}/node_modules/@sencha/ext-d3,${workspace.dir}/node_modules/@sencha/ext-exporter,${workspace.dir}/node_modules/@sencha/ext-pivot,${workspace.dir}/node_modules/@sencha/ext-pivot-d3,${workspace.dir}/node_modules/@sencha/ext-ux,${workspace.dir}/node_modules/@sencha/ext-font-ios",
    "extract": "${workspace.dir}/packages/remote"
  }
}
```

## Post-Install
[@coon-js/extjs-link](https://npmjs.org/coon-js/extjs-link) will start once the package was installed and guide you
through the process of creating symlinks to an existing Ext JS sdk installation.
This is only required if you want to run the tests (`./tests`), as [Siesta](https//npmjs.org/siesta-lite) relies on
an existing Ext JS installation.

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
Tests are written with [Siesta](https://bryntum.com/siesta). Documentation can be found [here](./tests/README.md).
