"use strict";

var _help = _interopRequireDefault(require("./commands/help"));

var _parseFlag = _interopRequireDefault(require("./utils/parseFlag"));

var _fs = require("fs");

var _path = require("path");

var _makeRegex = _interopRequireDefault(require("./utils/makeRegex"));

var _detectPackageManager = _interopRequireDefault(require("./utils/detectPackageManager"));

var _makePatch = _interopRequireDefault(require("./utils/patches/makePatch"));

var _applyPatches = _interopRequireDefault(require("./utils/patches/applyPatches"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const argv = process.argv.slice(2);
const applicationPath = process.cwd();

(async () => {
  if ((0, _parseFlag.default)('help')) {
    (0, _help.default)();
    process.exit(0);
  } else {
    const patchesDir = (0, _path.join)(applicationPath, 'patches');
    const packageManager = (0, _detectPackageManager.default)(applicationPath);
    if (!(0, _fs.existsSync)(patchesDir)) (0, _fs.mkdirSync)(patchesDir);

    if (argv.length) {
      const packageNames = argv.filter(arg => !arg.includes('='));
      const includePaths = (0, _makeRegex.default)((0, _parseFlag.default)('include') || '', 'include', /.*/, Boolean((0, _parseFlag.default)('case_sensitive_path_filtering')));
      const excludePaths = (0, _makeRegex.default)((0, _parseFlag.default)('exclude') || '', 'exclude', /package\.json$/, Boolean((0, _parseFlag.default)('case_sensitive_path_filtering')));

      for (const packageName of packageNames) {
        await (0, _makePatch.default)(packageName, applicationPath, packageManager, includePaths, excludePaths, patchesDir);
        await (0, _applyPatches.default)(packageManager, patchesDir, applicationPath);
      }
    } else {
      (0, _applyPatches.default)(packageManager, patchesDir, applicationPath);
    }
  }
})();