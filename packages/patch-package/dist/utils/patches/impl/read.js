"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPatch = readPatch;

var _fs = require("fs");

var _path = require("path");

var _colors = require("../../colors");

var _parse = require("./parse");

function readPatch({
  patchFilePath,
  packageDetails,
  patchDir
}) {
  try {
    return (0, _parse.parsePatchFile)((0, _fs.readFileSync)(patchFilePath, {
      encoding: 'utf-8',
      flag: 'r'
    }).toString());
  } catch (e) {
    const fixupSteps = [];
    const relativePatchFilePath = (0, _path.normalize)((0, _path.relative)(process.cwd(), patchFilePath));
    const patchBaseDir = relativePatchFilePath.slice(0, relativePatchFilePath.indexOf(patchDir));

    if (patchBaseDir) {
      fixupSteps.push(`cd ${patchBaseDir}`);
    }

    fixupSteps.push(`patch -p1 -i ${relativePatchFilePath.slice(relativePatchFilePath.indexOf(patchDir))}`);
    fixupSteps.push(`npx patch-package ${packageDetails.pathSpecifier}`);

    if (patchBaseDir) {
      fixupSteps.push(`cd ${(0, _path.relative)((0, _path.resolve)(process.cwd(), patchBaseDir), process.cwd())}`);
    }

    console.error(`${_colors.red}**ERROR** Failed to apply patch for package ${packageDetails.humanReadablePathSpecifier}
    
  This happened because the patch file ${relativePatchFilePath} could not be parsed.
   
  If you just upgraded patch-package, you can try running:
  
    ${fixupSteps.join('\n    ')}
    
  Otherwise, try manually creating the patch file again.
  
  If the problem persists, please submit a bug report:
  
    https://github.com/ds300/patch-package/issues/new?title=Patch+file+parse+error&body=%3CPlease+attach+the+patch+file+in+question%3E
`);
    process.exit(1);
  }

  return [];
}