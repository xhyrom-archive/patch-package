"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

const copyDirectory = (src, dest) => {
  const exists = (0, _fs.existsSync)(src);
  const existsDestination = (0, _fs.existsSync)(dest);
  if (!exists) return;

  if ((0, _fs.statSync)(src).isDirectory()) {
    if (!existsDestination) (0, _fs.mkdirSync)(dest);

    for (const dir of (0, _fs.readdirSync)(src)) copyDirectory((0, _path.join)(src, dir), (0, _path.join)(dest, dir));
  } else (0, _fs.writeFileSync)(dest, (0, _fs.readFileSync)(src, {
    encoding: 'utf-8',
    flag: 'r'
  }).toString());
};

var _default = copyDirectory;
exports.default = _default;