// From: https://github.com/ds300/patch-package/blob/master/src/makePatch.ts

import { existsSync, mkdirSync, realpathSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import bindings from '../bindings';
import { PackageManagers } from '../detectPackageManager';
import copyDirectory from '../fs/copyDirectory';
import removeDirectory from '../fs/removeDirectory';
import { getPatchDetailsFromCliString, PackageDetails } from '../package/packageDetails';
import spawnCommand from '../spawnCommand';
import createTemporaryRepo from '../fs/createTemporaryRepo';
import installOriginal from '../package/installOriginal';
import getPatchFiles from '../fs/getPatchFiles';
import { green, red, reset } from '../colors';
import getUserHome from '../getUserHome';

export default async(packagePathSpecifier: string,
  applicationPath: string,
  packageManager: PackageManagers,
  includePaths: RegExp,
  excludePaths: RegExp,
  patchesDir: string
) => {
    const packageDetails = getPatchDetailsFromCliString(packagePathSpecifier);

    if (!packageDetails) {
      console.error('No such package', packagePathSpecifier);
      return;
    }

    const packagePath = join(applicationPath, packageDetails.path);
    const tmpRepo = createTemporaryRepo(packageDetails);

    if (packageManager === 'bun') await removeDirectory(packageManager, resolve(`${getUserHome()}/.bun/install/cache/${packageDetails.name}@${tmpRepo.packageVersion}/`));
    await installOriginal(packageManager, packageDetails, tmpRepo.packageVersion, tmpRepo.tmpRepoNpmRoot);
    await bindings().readLine('Press key');
    
    await copyDirectory(realpathSync(packagePath), packagePath);

    console.log(tmpRepo.tmpRepoName, tmpRepo.tmpRepoPackagePath);
    const git = (...args: string[]) => 
      spawnCommand(packageManager, 'git', args, {
        cwd: tmpRepo.tmpRepoName
      });
    
    removeDirectory(packageManager, join(tmpRepo.tmpRepoPackagePath, 'node_modules'));
    removeDirectory(packageManager, join(tmpRepo.tmpRepoPackagePath, '.git'));

    writeFileSync(join(tmpRepo.tmpRepoName, '.gitignore'), '!/node_modules\n\n');
    git('init');
    git('config', '--local', 'user.name', 'patch-package');
    git('config', '--local', 'user.email', 'patch@pack.age');

    // TODO: remove ignored files (tmpRepo.tmpRepoName, includePaths, excludePaths) // ON THIS LINE

    git('add', '-f', packageDetails.path);
    git('commit', '--allow-empty', '-m', 'init');

    removeDirectory(packageManager, tmpRepo.tmpRepoPackagePath);

    copyDirectory(realpathSync(packagePath), tmpRepo.tmpRepoPackagePath);

    removeDirectory(packageManager, join(tmpRepo.tmpRepoPackagePath, 'node_modules'));
    removeDirectory(packageManager, join(tmpRepo.tmpRepoPackagePath, '.git'));

    // TODO: remove ignored files (tmpRepo.tmpRepoName, includePaths, excludePaths) // ON THIS LINE

    // stage all files
    git('add', '-f', packageDetails.path);

    // get diff of changes
    const diffResult = (await git(
      'diff',
      '--cached',
      '--no-color',
      '--ignore-space-at-eol',
      '--no-ext-diff',
    ));

    if (packageManager === 'bun') removeDirectory(packageManager, resolve(`${getUserHome()}/.bun/install/cache/${packageDetails.name}@${tmpRepo.packageVersion}/`));

    if (diffResult.length === 0) {
      console.warn(
        `${red}⁉️  Not creating patch file for package '${packagePathSpecifier}'${reset}`,
      );
      console.warn(`${red}⁉️  There don't appear to be any changes.${reset}`);
      process.exit(1);
      return;
    }

    for (const patchFile of getPatchFiles(patchesDir)) {
      unlinkSync(`${patchesDir}/${patchFile}`);
    }

    const patchFileName = createPatchFileName({
      packageDetails,
      packageVersion: tmpRepo.packageVersion,
    });

    const patchPath = join(patchesDir, patchFileName);
    if (!existsSync(dirname(patchPath))) mkdirSync(dirname(patchPath));

    writeFileSync(patchPath, diffResult);
    console.log(
      `${green}🚀 Created patch in ${join(patchesDir, patchFileName)}${reset}\n`,
    );
};

function createPatchFileName({
  packageDetails,
  packageVersion,
}: {
  packageDetails: PackageDetails
  packageVersion: string
}) {
  const packageNames = packageDetails.packageNames
    .map((name) => name.replace(/\//g, '+'))
    .join('++');

  return `${packageNames}+${packageVersion}.patch`;
}