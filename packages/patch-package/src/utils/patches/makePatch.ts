// From: https://github.com/ds300/patch-package/blob/master/src/makePatch.ts

import { existsSync, mkdirSync, realpathSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import bindings from '../bindings';
import { PackageManagers } from '../detectPackageManager';
import copyDirectory from '../fs/copyDirectory';
import removeDirectory from '../fs/removeDirectory';
import { getPatchDetailsFromCliString, PackageDetails } from '../package/packageDetails';
import spawnCommand from '../spawnCommand';
import createTemporaryRepo from '../fs/createTemporaryRepo';
import installOriginal from '../package/installOriginal';

export default async(packagePathSpecifier: string,
  applicationPath: string,
  packageManager: PackageManagers,
  includePaths: RegExp,
  excludePaths: RegExp,
  patchesDir: string
) => {
    const packageDetails = getPatchDetailsFromCliString(packagePathSpecifier)

    if (!packageDetails) {
      console.error('No such package', packagePathSpecifier)
      return
    }

    const appPackageJson = require(join(applicationPath, "package.json"))
    const packagePath = join(applicationPath, packageDetails.path)
    const packageJsonPath = join(packagePath, "package.json")

    const tmpRepo = createTemporaryRepo(packageDetails);

    await installOriginal(packageManager, packageDetails, tmpRepo.packageVersion, tmpRepo.tmpRepoNpmRoot);
    
    try {
      await copyDirectory(realpathSync(packagePath), resolve(packagePath + '-for-patch'));
    } catch(e) {
      console.log(e)
      return;
    }
    
    await bindings().readLine(`Now, update files in node_modules/${packageDetails.name}-for-patch and after that click some key`);

    
    const git = (...args: string[]) => 
      spawnCommand(packageManager, 'git', args, {
        cwd: tmpRepo.tmpRepoPackagePath
      });
    
    // TODO: remove ignored files (tmpRepo.tmpRepoName, includePaths, excludePaths) // ON THIS LINE

    removeDirectory(packageManager, tmpRepo.tmpRepoPackagePath);

    copyDirectory(realpathSync(packagePath), tmpRepo.tmpRepoPackagePath);

    removeDirectory(packageManager, join(tmpRepo.tmpRepoPackagePath, "node_modules"));
    removeDirectory(packageManager, join(tmpRepo.tmpRepoPackagePath, ".git"));

    // TODO: remove ignored files (tmpRepo.tmpRepoName, includePaths, excludePaths) // ON THIS LINE

    const diffResult = await git(
      "diff",
      "--no-index",
      resolve(tmpRepo.tmpRepoPackagePath),
      resolve(packagePath + '-for-patch'),
    );

    removeDirectory(packageManager, resolve(packagePath + '-for-patch'));
    removeDirectory(packageManager, tmpRepo.tmpRepoNpmRoot);

    if (diffResult.length === 0) {
      console.warn(
        `⁉️  Not creating patch file for package '${packagePathSpecifier}'`,
      );
      console.warn(`⁉️  There don't appear to be any changes.`);
      process.exit(1);
      return;
    }

    const patchFileName = createPatchFileName({
      packageDetails,
      packageVersion: tmpRepo.packageVersion,
    });

    const patchPath = join(patchesDir, patchFileName);
    if (!existsSync(dirname(patchPath))) mkdirSync(dirname(patchPath));

    writeFileSync(patchPath, diffResult);
    console.log(
      `Created patch in ${join(patchesDir, patchFileName)}\n`,
    )
}

function createPatchFileName({
  packageDetails,
  packageVersion,
}: {
  packageDetails: PackageDetails
  packageVersion: string
}) {
  const packageNames = packageDetails.packageNames
    .map((name) => name.replace(/\//g, "+"))
    .join("++")

  return `${packageNames}+${packageVersion}.patch`
}