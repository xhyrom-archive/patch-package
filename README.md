# Patch Package
> Most code is from https://github.com/ds300/patch-package

```
# start patch-package
npx @xhyrom/patch-package some-package

# fix a bug in one of your dependencies
vim node_modules/some-package/brokenFile.js
```

## Setup

```diff
"scripts": {
+    "postinstall": "@xhyrom/patch-package"
}
```