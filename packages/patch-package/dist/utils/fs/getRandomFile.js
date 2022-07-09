"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _default = path => {
  const files = (0, _fs.readdirSync)(path);
  return `${path}/${files[0]}`;
};

exports.default = _default;