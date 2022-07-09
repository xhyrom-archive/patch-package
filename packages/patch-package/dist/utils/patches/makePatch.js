"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _bindings = _interopRequireDefault(require("../bindings"));

var _copyDirectory = _interopRequireDefault(require("../fs/copyDirectory"));

var _removeDirectory = _interopRequireDefault(require("../fs/removeDirectory"));

var _packageDetails = require("../package/packageDetails");

var _spawnCommand = _interopRequireDefault(require("../spawnCommand"));

var _createTemporaryRepo = _interopRequireDefault(require("../fs/createTemporaryRepo"));

var _installOriginal = _interopRequireDefault(require("../package/installOriginal"));

var _getPatchFiles = _interopRequireDefault(require("../fs/getPatchFiles"));

var _colors = require("../colors");

var _getUserHome = _interopRequireDefault(require("../getUserHome"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// From: https://github.com/ds300/patch-package/blob/master/src/makePatch.ts
var _default = async (packagePathSpecifier, applicationPath, packageManager, includePaths, excludePaths, patchesDir) => {
  const packageDetails = (0, _packageDetails.getPatchDetailsFromCliString)(packagePathSpecifier);

  if (!packageDetails) {
    console.error('No such package', packagePathSpecifier);
    return;
  }

  const packagePath = (0, _path.join)(applicationPath, packageDetails.path);
  const tmpRepo = (0, _createTemporaryRepo.default)(packageDetails);
  if (packageManager === 'bun') await (0, _removeDirectory.default)(packageManager, (0, _path.resolve)(`${(0, _getUserHome.default)()}/.bun/install/cache/${packageDetails.name}@${tmpRepo.packageVersion}/`));
  await (0, _installOriginal.default)(packageManager, packageDetails, tmpRepo.packageVersion, tmpRepo.tmpRepoNpmRoot);
  await (0, _bindings.default)().readLine('Press key');
  await (0, _copyDirectory.default)((0, _fs.realpathSync)(packagePath), packagePath);
  console.log(tmpRepo.tmpRepoName, tmpRepo.tmpRepoPackagePath);

  const git = (...args) => (0, _spawnCommand.default)(packageManager, 'git', args, {
    cwd: tmpRepo.tmpRepoName
  });

  (0, _removeDirectory.default)(packageManager, (0, _path.join)(tmpRepo.tmpRepoPackagePath, 'node_modules'));
  (0, _removeDirectory.default)(packageManager, (0, _path.join)(tmpRepo.tmpRepoPackagePath, '.git'));
  (0, _fs.writeFileSync)((0, _path.join)(tmpRepo.tmpRepoName, '.gitignore'), '!/node_modules\n\n');
  git('init');
  git('config', '--local', 'user.name', 'patch-package');
  git('config', '--local', 'user.email', 'patch@pack.age'); // TODO: remove ignored files (tmpRepo.tmpRepoName, includePaths, excludePaths) // ON THIS LINE

  git('add', '-f', packageDetails.path);
  git('commit', '--allow-empty', '-m', 'init');
  (0, _removeDirectory.default)(packageManager, tmpRepo.tmpRepoPackagePath);
  (0, _copyDirectory.default)((0, _fs.realpathSync)(packagePath), tmpRepo.tmpRepoPackagePath);
  (0, _removeDirectory.default)(packageManager, (0, _path.join)(tmpRepo.tmpRepoPackagePath, 'node_modules'));
  (0, _removeDirectory.default)(packageManager, (0, _path.join)(tmpRepo.tmpRepoPackagePath, '.git')); // TODO: remove ignored files (tmpRepo.tmpRepoName, includePaths, excludePaths) // ON THIS LINE
  // stage all files

  git('add', '-f', packageDetails.path); // get diff of changes

  const diffResult = await git('diff', '--cached', '--no-color', '--ignore-space-at-eol', '--no-ext-diff');
  if (packageManager === 'bun') (0, _removeDirectory.default)(packageManager, (0, _path.resolve)(`${(0, _getUserHome.default)()}/.bun/install/cache/${packageDetails.name}@${tmpRepo.packageVersion}/`));

  if (diffResult.length === 0) {
    console.warn(`${_colors.red}⁉️  Not creating patch file for package '${packagePathSpecifier}'${_colors.reset}`);
    console.warn(`${_colors.red}⁉️  There don't appear to be any changes.${_colors.reset}`);
    process.exit(1);
    return;
  }

  for (const patchFile of (0, _getPatchFiles.default)(patchesDir)) {
    (0, _fs.unlinkSync)(`${patchesDir}/${patchFile}`);
  }

  const patchFileName = createPatchFileName({
    packageDetails,
    packageVersion: tmpRepo.packageVersion
  });
  const patchPath = (0, _path.join)(patchesDir, patchFileName);
  if (!(0, _fs.existsSync)((0, _path.dirname)(patchPath))) (0, _fs.mkdirSync)((0, _path.dirname)(patchPath));
  (0, _fs.writeFileSync)(patchPath, diffResult);
  console.log(`${_colors.green}🚀 Created patch in ${(0, _path.join)(patchesDir, patchFileName)}${_colors.reset}\n`);
};

exports.default = _default;

function createPatchFileName({
  packageDetails,
  packageVersion
}) {
  const packageNames = packageDetails.packageNames.map(name => name.replace(/\//g, '+')).join('++');
  return `${packageNames}+${packageVersion}.patch`;
}