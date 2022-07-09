"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _getPackageVersion = _interopRequireDefault(require("../package/getPackageVersion"));

var _randomString = require("../random/randomString");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = packageDetails => {
  const tmpRepoName = (0, _randomString.randomString)(7);
  const tmpRepoPackagePath = (0, _path.join)(tmpRepoName, packageDetails.path);
  const tmpRepoNpmRoot = tmpRepoPackagePath.slice(0, -`/node_modules/${packageDetails.name}`.length);
  const tmpRepoPackageJsonPath = (0, _path.join)(tmpRepoNpmRoot, 'package.json');
  const version = (0, _getPackageVersion.default)((0, _path.join)((0, _path.resolve)(packageDetails.path, 'package.json')));
  (0, _fs.mkdirSync)(tmpRepoNpmRoot);
  (0, _fs.chmodSync)(tmpRepoNpmRoot, 0o755);
  (0, _fs.writeFileSync)(tmpRepoPackageJsonPath, JSON.stringify({
    name: `${packageDetails.name}-tmp`,
    version: version
  }));
  return {
    tmpRepoName,
    tmpRepoPackagePath,
    tmpRepoNpmRoot,
    tmpRepoPackageJsonPath,
    packageVersion: version
  };
};

exports.default = _default;