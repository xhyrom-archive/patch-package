# Patch Package
> Most code is from https://github.com/ds300/patch-package

Install: 
```shell
$ bun add @xhyrom/patch-package
$ pnpm add @xhyrom/patch-package
$ yarn add @xhyrom/patch-package
$ npm i @xhyrom/patch-package
```

## Run
```
# fix a bug in one of your dependencies
vim node_modules/some-package/brokenFile.js

# start patch-package
npx @xhyrom-patch-package some-package
# with bun: bun node_modules/@xhyrom/patch-package some-package
```

## Setup

```diff
"scripts": {
+    "postinstall": "@xhyrom-patch-package"
}
```

### With bun:
You need run `bun node_modules/@xhyrom/patch-package` after every `bun add some-package`