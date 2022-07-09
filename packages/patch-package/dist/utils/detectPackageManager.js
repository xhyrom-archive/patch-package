"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _parseFlag = _interopRequireDefault(require("./parseFlag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = applicationPath => {
  const override = (0, _parseFlag.default)('use-pkg-manager');
  if (override) return override;
  const packageLockExists = (0, _fs.existsSync)((0, _path.join)(applicationPath, 'package-lock.json'));
  const shrinkWrapExists = (0, _fs.existsSync)((0, _path.join)(applicationPath, 'npm-shrinkwrap.json'));
  const yarnLockExists = (0, _fs.existsSync)((0, _path.join)(applicationPath, 'yarn.lock'));
  const bunLockbExists = (0, _fs.existsSync)((0, _path.join)(applicationPath, 'bun.lockb'));
  const pnpmLockExists = (0, _fs.existsSync)((0, _path.join)(applicationPath, 'pnpm-lock.yaml'));

  if ((packageLockExists || shrinkWrapExists) && yarnLockExists) {
    return shrinkWrapExists ? 'npm-shrinkwrap' : 'npm';
  } else if (packageLockExists || shrinkWrapExists) {
    return shrinkWrapExists ? 'npm-shrinkwrap' : 'npm';
  } else if (yarnLockExists) {
    return 'yarn';
  } else if (bunLockbExists) {
    return 'bun';
  } else if (pnpmLockExists) {
    return 'pnpm';
  } else {
    return process.argv[0];
  }
};

exports.default = _default;