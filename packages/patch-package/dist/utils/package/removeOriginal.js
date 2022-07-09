"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawnCommand = _interopRequireDefault(require("../spawnCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (packageManager, packageDetails, packageVersion, tmpRepoNpmRoot) => {
  console.log(`Removing ${packageDetails.name}@${packageVersion} with ${packageManager}`);

  switch (packageManager) {
    case 'bun':
    case 'yarn':
    case 'pnpm':
      {
        await (0, _spawnCommand.default)(packageManager, packageManager, ['remove', packageDetails.name], {
          cwd: tmpRepoNpmRoot
        });
        break;
      }

    case 'npm':
      {
        await (0, _spawnCommand.default)(packageManager, packageManager, ['uninstall', packageDetails.name], {
          cwd: tmpRepoNpmRoot
        });
        break;
      }
  }

  console.log(`${packageDetails.name}@${packageVersion} has been removed with ${packageManager}`);
};

exports.default = _default;