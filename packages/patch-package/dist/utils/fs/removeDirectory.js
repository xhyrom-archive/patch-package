"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _bindings = _interopRequireDefault(require("../bindings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (packageManager, removeDirectory) => {
  if (packageManager == 'bun') {
    return (0, _bindings.default)().removeDirectory(removeDirectory);
  }

  return (0, _fs.rmSync)(removeDirectory, {
    recursive: true,
    force: true
  });
};

exports.default = _default;