"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// https://github.com/ds300/patch-package/blob/master/src/makeRegExp.ts
const bold = text => `\u001b[1m${text}`;

const red = text => `\u001b[31m${text}`;

var _default = (reString, name, defaultValue, caseSensitive) => {
  if (!reString) {
    return defaultValue;
  } else {
    try {
      return new RegExp(reString, caseSensitive ? '' : 'i');
    } catch (_) {
      console.error(`${red(bold('***ERROR***'))}\u001b[0m
  Invalid format for option --${name}
  
    Unable to convert the string ${JSON.stringify(reString)} to a regular expression.
  `);
      process.exit(1);
      return /unreachable/;
    }
  }
};

exports.default = _default;