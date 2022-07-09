"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveRelativeFileDependencies = resolveRelativeFileDependencies;

var _path = require("path");

function transformVersionString(version, appRootPath) {
  if (version.startsWith('file:') && version[5] !== '/') {
    return 'file:' + (0, _path.resolve)(appRootPath, version.slice(5));
  } else {
    return version;
  }
}

function resolveRelativeFileDependencies(appRootPath, resolutions) {
  const result = {};

  for (const packageName of Object.keys(resolutions)) {
    result[packageName] = transformVersionString(resolutions[packageName], appRootPath);
  }

  return result;
}