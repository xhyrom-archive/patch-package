"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeEffects = void 0;

var _fs = require("fs");

var _path = require("path");

/* eslint-disable */
const executeEffects = (effects, {
  dryRun
}) => {
  effects.forEach(eff => {
    switch (eff.type) {
      case 'file deletion':
        if (dryRun) {
          if (!(0, _fs.existsSync)(eff.path)) {
            throw new Error('Trying to delete file that doesn\'t exist: ' + eff.path);
          }
        } else {
          // TODO: integrity checks
          (0, _fs.unlinkSync)(eff.path);
        }

        break;

      case 'rename':
        if (dryRun) {
          // TODO: see what patch files look like if moving to exising path
          if (!(0, _fs.existsSync)(eff.fromPath)) {
            throw new Error('Trying to move file that doesn\'t exist: ' + eff.fromPath);
          }
        } else {
          (0, _fs.renameSync)(eff.fromPath, eff.toPath);
        }

        break;

      case 'file creation':
        if (dryRun) {
          if ((0, _fs.existsSync)(eff.path)) {
            throw new Error('Trying to create file that already exists: ' + eff.path);
          } // todo: check file contents matches

        } else {
          const fileContents = eff.hunk ? eff.hunk.parts[0].lines.join('\n') + (eff.hunk.parts[0].noNewlineAtEndOfFile ? '' : '\n') : '';
          if (!(0, _fs.existsSync)((0, _path.dirname)(eff.path))) (0, _fs.mkdirSync)((0, _path.dirname)(eff.path));
          (0, _fs.writeFileSync)(eff.path, fileContents); // remove { mode } for now
        }

        break;

      case 'patch':
        applyPatch(eff, {
          dryRun
        });
        break;

      case 'mode change':
        const currentMode = (0, _fs.statSync)(eff.path).mode;

        if ((isExecutable(eff.newMode) && isExecutable(currentMode) || !isExecutable(eff.newMode) && !isExecutable(currentMode)) && dryRun) {
          console.warn(`Mode change is not required for file ${eff.path}`);
        }

        (0, _fs.chmodSync)(eff.path, eff.newMode);
        break;

      default:
        return;
    }
  });
};

exports.executeEffects = executeEffects;

function isExecutable(fileMode) {
  // tslint:disable-next-line:no-bitwise
  return (fileMode & 0b001_000_000) > 0;
}

const trimRight = s => s.replace(/\s+$/, '');

function linesAreEqual(a, b) {
  return trimRight(a) === trimRight(b);
}
/**
 * How does noNewLineAtEndOfFile work?
 *
 * if you remove the newline from a file that had one without editing other bits:
 *
 *    it creates an insertion/removal pair where the insertion has \ No new line at end of file
 *
 * if you edit a file that didn't have a new line and don't add one:
 *
 *    both insertion and deletion have \ No new line at end of file
 *
 * if you edit a file that didn't have a new line and add one:
 *
 *    deletion has \ No new line at end of file
 *    but not insertion
 *
 * if you edit a file that had a new line and leave it in:
 *
 *    neither insetion nor deletion have the annoation
 *
 */


function applyPatch({
  hunks,
  path
}, {
  dryRun
}) {
  // modifying the file in place
  const fileContents = (0, _fs.readFileSync)(path, {
    encoding: 'utf-8',
    flag: 'r'
  }).toString(); //const mode = statSync(path).mode;

  const fileLines = fileContents.split(/\n/);
  const result = [];

  for (const hunk of hunks) {
    let fuzzingOffset = 0;

    while (true) {
      const modifications = evaluateHunk(hunk, fileLines, fuzzingOffset);

      if (modifications) {
        result.push(modifications);
        break;
      }

      fuzzingOffset = fuzzingOffset < 0 ? fuzzingOffset * -1 : fuzzingOffset * -1 - 1;

      if (Math.abs(fuzzingOffset) > 20) {
        throw new Error(`Cant apply hunk ${hunks.indexOf(hunk)} for file ${path}`); // idk how to resolve it but it works so
        //return;
      }
    }
  }

  if (dryRun) {
    return;
  }

  let diffOffset = 0;

  for (const modifications of result) {
    for (const modification of modifications) {
      switch (modification.type) {
        case 'splice':
          fileLines.splice(modification.index + diffOffset, modification.numToDelete, ...modification.linesToInsert);
          diffOffset += modification.linesToInsert.length - modification.numToDelete;
          break;

        case 'pop':
          fileLines.pop();
          break;

        case 'push':
          fileLines.push(modification.line);
          break;

        default:
          return;
      }
    }
  }

  (0, _fs.writeFileSync)(path, fileLines.join('\n')); // remove { mode } for now
}

function evaluateHunk(hunk, fileLines, fuzzingOffset) {
  const result = [];
  let contextIndex = hunk.header.original.start - 1 + fuzzingOffset; // do bounds checks for index

  if (contextIndex < 0) {
    return null;
  }

  if (fileLines.length - contextIndex < hunk.header.original.length) {
    return null;
  }

  for (const part of hunk.parts) {
    switch (part.type) {
      case 'deletion':
      case 'context':
        for (const line of part.lines) {
          const originalLine = fileLines[contextIndex];

          if (!linesAreEqual(originalLine, line)) {
            return null;
          }

          contextIndex++;
        }

        if (part.type === 'deletion') {
          result.push({
            type: 'splice',
            index: contextIndex - part.lines.length,
            numToDelete: part.lines.length,
            linesToInsert: []
          });

          if (part.noNewlineAtEndOfFile) {
            result.push({
              type: 'push',
              line: ''
            });
          }
        }

        break;

      case 'insertion':
        result.push({
          type: 'splice',
          index: contextIndex,
          numToDelete: 0,
          linesToInsert: part.lines
        });

        if (part.noNewlineAtEndOfFile) {
          result.push({
            type: 'pop'
          });
        }

        break;

      default:
        return;
    }
  }

  return result;
}