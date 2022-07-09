"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _default = patchesDir => {
  const files = (0, _fs.readdirSync)(patchesDir);
  return files.filter(file => file.endsWith('.patch'));
};

exports.default = _default;