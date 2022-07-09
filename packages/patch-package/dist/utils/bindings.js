"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loadBinding = _interopRequireDefault(require("./loadBinding"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let nativeBinding = null;

var _default = () => {
  if (nativeBinding) return nativeBinding;
  const {
    platform,
    arch
  } = process;

  switch (platform) {
    case 'darwin':
      {
        switch (arch) {
          case 'x64':
            nativeBinding = (0, _loadBinding.default)('patch-package-bindings.darwin-x64.node', '@xhyrom/patch-package-bindings-darwin-x64');
            break;
        }

        break;
      }

    case 'linux':
      {
        switch (arch) {
          case 'x64':
            nativeBinding = (0, _loadBinding.default)('patch-package-bindings.linux-x64-gnu.node', '@xhyrom/patch-package-bindings-linux-x64-gnu');
            break;
        }

        break;
      }

    case 'win32':
      {
        nativeBinding = (0, _loadBinding.default)('patch-package-bindings.win32-x64-msvc.node', '@xhyrom/patch-package-bindings-win32-x64-msvc');
        break;
      }
  }

  return nativeBinding;
};

exports.default = _default;