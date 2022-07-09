"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawnCommand = _interopRequireDefault(require("../spawnCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (packageManager, packageDetails, packageVersion, tmpRepoNpmRoot) => {
  console.log(`Installing ${packageDetails.name}@${packageVersion} with ${packageManager}`);

  switch (packageManager) {
    case 'bun':
    case 'yarn':
    case 'pnpm':
      {
        await (0, _spawnCommand.default)(packageManager, packageManager, ['add', `${packageDetails.name}@${packageVersion}`], {
          cwd: tmpRepoNpmRoot
        });
        break;
      }

    case 'npm':
      {
        await (0, _spawnCommand.default)(packageManager, packageManager, ['i', `${packageDetails.name}@${packageVersion}`], {
          cwd: tmpRepoNpmRoot
        });
        break;
      }
  }

  console.log(`${packageDetails.name}@${packageVersion} has been installed with ${packageManager}`);
};

exports.default = _default;