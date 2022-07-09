"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomString = void 0;

var _randomNumber = require("./randomNumber");

const randomString = length => {
  if (!length) length = (0, _randomNumber.randomNumber)(7, 5);
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
};

exports.randomString = randomString;