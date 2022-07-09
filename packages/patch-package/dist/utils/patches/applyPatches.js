"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPatch = applyPatch;
exports.default = void 0;

var _path = require("path");

var _colors = require("../colors");

var _getPatchFiles = _interopRequireDefault(require("../fs/getPatchFiles"));

var _removeDirectory = _interopRequireDefault(require("../fs/removeDirectory"));

var _getUserHome = _interopRequireDefault(require("../getUserHome"));

var _packageDetails = require("../package/packageDetails");

var _apply = require("./impl/apply");

var _read = require("./impl/read");

var _reverse = require("./impl/reverse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (packageManager, patchesDir, applicationPath) => {
  const patchFiles = (0, _getPatchFiles.default)(patchesDir);

  if (patchFiles.length === 0) {
    console.error(`${_colors.red}No patch files found${_colors.reset}`);
    return;
  }

  const errors = [];
  const warnings = [];

  for (const patchFile of patchFiles) {
    const packageDetails = (0, _packageDetails.getPackageDetailsFromPatchFilename)(patchFile);

    if (!packageDetails) {
      warnings.push(`Unrecognized patch file in patches directory ${patchFile}`);
      continue;
    }

    const {
      version,
      path,
      pathSpecifier
    } = packageDetails;
    const packageDir = (0, _path.join)(applicationPath, path);

    const installedPackage = require((0, _path.join)(packageDir, 'package.json'));

    if (applyPatch({
      patchFilePath: (0, _path.resolve)(patchesDir, patchFile),
      reverse: false,
      packageDetails,
      patchDir: patchesDir
    })) {
      console.log(`${_colors.bold}${pathSpecifier}@${version} ${_colors.green}✔${_colors.reset}`);
      if (packageManager === 'bun') await (0, _removeDirectory.default)(packageManager, (0, _path.resolve)(`${(0, _getUserHome.default)()}/.bun/install/cache/${packageDetails.name}@${version}/`));
    } else if (installedPackage.version === version) {
      errors.push(`${_colors.red}Failed to apply patch because package version?.`);
    } else {
      errors.push(`${_colors.red}Failed to apply patch.`);
    }
  }
};

exports.default = _default;

function applyPatch({
  patchFilePath,
  reverse,
  packageDetails,
  patchDir
}) {
  const patch = (0, _read.readPatch)({
    patchFilePath,
    packageDetails,
    patchDir
  });

  try {
    (0, _apply.executeEffects)(reverse ? (0, _reverse.reversePatch)(patch) : patch, {
      dryRun: false
    });
  } catch (e) {
    console.log(e);

    try {
      (0, _apply.executeEffects)(reverse ? patch : (0, _reverse.reversePatch)(patch), {
        dryRun: true
      });
    } catch (e) {
      return false;
    }
  }

  return true;
}