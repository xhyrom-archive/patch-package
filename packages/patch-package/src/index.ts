import help from './commands/help';
import parseFlag from './utils/parseFlag';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import makeRegex from './utils/makeRegex';
import detectPackageManager from './utils/detectPackageManager';
import spawnCommand from './utils/spawnCommand';
import makePatch from './utils/patches/makePatch';
const argv = process.argv.slice(2);
const applicationPath = process.cwd();

if (parseFlag('help')) {
    help();
    process.exit(0);
} else {
    const patchesDir = join(applicationPath, 'patches');
    if (!existsSync(patchesDir)) mkdirSync(patchesDir);

    if (argv.length) {
        const packageNames = argv.filter(arg => !arg.includes('='));
        const includePaths = makeRegex(
            parseFlag('include') || '',
            'include',
            /.*/,
            Boolean(parseFlag('case_sensitive_path_filtering')),
        )
        const excludePaths = makeRegex(
            parseFlag('exclude') || '',
            'exclude',
            /package\.json$/,
            Boolean(parseFlag('case_sensitive_path_filtering')),
        )
        const packageManager = detectPackageManager(applicationPath);
        console.log(packageManager)
        
        for (const packageName of packageNames) {
            /*spawnCommand(packageManager, 'git', ['--version'], {
                cwd: process.cwd()
            });*/
            makePatch(packageName, applicationPath, packageManager, includePaths, excludePaths, patchesDir);
        }
    } else {
        console.log('patch')
    }
}