"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bindings = _interopRequireDefault(require("./bindings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = async (packageManager, command, args, options) => {
  if (packageManager == 'bun') {
    return (0, _bindings.default)().runCommand(command, options.cwd, args);
  }

  const childProcess = await Promise.resolve().then(() => _interopRequireWildcard(require('node:child_process')));
  const defaultOptions = {
    logStdErrOnError: true,
    throwOnError: true
  };
  const mergedOptions = Object.assign({}, defaultOptions, options);
  const result = childProcess.spawnSync(command, args, options);

  if (result.error || result.status !== 0) {
    if (mergedOptions.logStdErrOnError) {
      if (result.stderr) {
        console.error(result.stderr.toString());
      } else if (result.error) {
        console.error(result.error);
      }
    }

    if (mergedOptions.throwOnError) {
      throw result;
    }
  }

  return result;
};

exports.default = _default;