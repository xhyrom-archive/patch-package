"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = () => {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
};

exports.default = _default;