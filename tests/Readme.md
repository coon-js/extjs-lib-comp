# lib-cn_comp - Tests - Read Me

lib-cn_comp uses Siesta (http://bryntum.com) for Unit/UI testing.

Make sure you set the paths to the resources properly in the files index.html.template and
tests.config.js.template, then rename them:

index.html.template -> index.html
tests.config.js.template -> tests.config.js

The tests require lib-cn_core. Make sure you adjust the paths to this library in
the index.js if both packages are not part of a regular local package directory
layout in a sencha workspace.