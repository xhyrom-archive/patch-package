"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

const applicationPath = process.cwd();

var _default = (file, pkg) => {
  const localFileExisted = (0, _fs.existsSync)((0, _path.join)(applicationPath, 'packages', 'rust-bindings', file));

  try {
    if (localFileExisted) {
      return require((0, _path.join)(applicationPath, 'packages', 'rust-bindings', file));
    }

    return require(pkg);
  } catch (e) {
    console.error(e);
    process.exit(0);
  }
};

exports.default = _default;