"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = packageJsonPath => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(packageJsonPath).version.replace(/\+.*$/, '');
};

exports.default = _default;