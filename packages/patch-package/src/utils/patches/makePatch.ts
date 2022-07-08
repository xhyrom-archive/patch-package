// From: https://github.com/ds300/patch-package/blob/master/src/makePatch.ts

import { rmdirSync, rmSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { PackageManagers } from '../detectPackageManager'
import { getPatchDetailsFromCliString } from '../package/packageDetails'
import spawnCommand from '../spawnCommand'
import createTemporaryRepo from './createTemporaryRepo'
import installOriginal from './installOriginal'

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
    writeFileSync(join(tmpRepo.tmpRepoName, ".gitignore"), "!/node_modules\n\n");

    const git = (...args: string[]) =>
      spawnCommand(packageManager, 'git', args, {
        cwd: tmpRepo.tmpRepoName
      });

    git('init');
    git("config", "--local", "user.name", "patch-package");
    git("config", "--local", "user.email", "patch@pack.age");

    git("add", "-f", packageDetails.path);
    git("commit", "--allow-empty", "-m", "init");

    // TODO: replace with user version, check diff, make patch
}