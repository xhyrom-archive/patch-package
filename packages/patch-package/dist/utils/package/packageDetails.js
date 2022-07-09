"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageDetailsFromPatchFilename = getPackageDetailsFromPatchFilename;
exports.getPatchDetailsFromCliString = void 0;

var _fs = require("fs");

var _path = require("path");

// From https://github.com/ds300/patch-package/blob/master/src/PackageDetails.ts
const parseNameAndVersion = s => {
  const parts = s.split('+');

  switch (parts.length) {
    case 1:
      {
        return {
          name: parts[0]
        };
      }

    case 2:
      {
        const [nameOrScope, versionOrName] = parts;

        if (versionOrName.match(/^\d+/)) {
          return {
            name: nameOrScope,
            version: versionOrName
          };
        }

        return {
          name: `${nameOrScope}/${versionOrName}`
        };
      }

    case 3:
      {
        const [scope, name, version] = parts;
        return {
          name: `${scope}/${name}`,
          version
        };
      }
  }

  return null;
};

const getPatchDetailsFromCliString = specifier => {
  const parts = specifier.split('/');
  const packageNames = [];
  let scope = null;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('@')) {
      if (scope) {
        return null;
      }

      scope = parts[i];
    } else {
      if (scope) {
        packageNames.push(`${scope}/${parts[i]}`);
        scope = null;
      } else {
        packageNames.push(parts[i]);
      }
    }
  }

  const path = (0, _path.join)('node_modules', packageNames.join('/node_modules/'));
  if (!(0, _fs.existsSync)(path)) return null;
  return {
    packageNames,
    path,
    name: packageNames[packageNames.length - 1],
    humanReadablePathSpecifier: packageNames.join(' => '),
    isNested: packageNames.length > 1,
    pathSpecifier: specifier
  };
};

exports.getPatchDetailsFromCliString = getPatchDetailsFromCliString;

function getPackageDetailsFromPatchFilename(patchFilename) {
  const legacyMatch = patchFilename.match(/^([^+=]+?)(:|\+)(\d+\.\d+\.\d+.*?)(\.dev)?\.patch$/);

  if (legacyMatch) {
    const name = legacyMatch[1];
    const version = legacyMatch[3];
    return {
      packageNames: [name],
      pathSpecifier: name,
      humanReadablePathSpecifier: name,
      path: (0, _path.join)('node_modules', name),
      name,
      version,
      isNested: false,
      patchFilename,
      isDevOnly: patchFilename.endsWith('.dev.patch')
    };
  }

  const parts = patchFilename.replace(/(\.dev)?\.patch$/, '').split('++').map(parseNameAndVersion).filter(x => x !== null);

  if (parts.length === 0) {
    return null;
  }

  const lastPart = parts[parts.length - 1];

  if (!lastPart.version) {
    return null;
  }

  return {
    name: lastPart.name,
    version: lastPart.version,
    path: (0, _path.join)('node_modules', parts.map(({
      name
    }) => name).join('/node_modules/')),
    patchFilename,
    pathSpecifier: parts.map(({
      name
    }) => name).join('/'),
    humanReadablePathSpecifier: parts.map(({
      name
    }) => name).join(' => '),
    isNested: parts.length > 1,
    packageNames: parts.map(({
      name
    }) => name),
    isDevOnly: patchFilename.endsWith('.dev.patch')
  };
}