"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const sliced = process.argv.slice(2);

var _default = (flag, argv = sliced) => {
  const findFlag = argv.find(f => f.startsWith(flag));
  if (findFlag?.includes('=')) return findFlag?.split('=')[1] || '';else return null;
};

exports.default = _default;