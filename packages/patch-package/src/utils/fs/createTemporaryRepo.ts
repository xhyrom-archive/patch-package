import { chmodSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import getPackageVersion from '../package/getPackageVersion';
import { PackageDetails } from '../package/packageDetails';
import { randomString } from '../random/randomString';

export default (packageDetails: PackageDetails): {
  tmpRepoName: string,
  tmpRepoPackagePath: string;
  tmpRepoNpmRoot: string,
  tmpRepoPackageJsonPath: string;
  packageVersion: string;
} => {
  const tmpRepoName = randomString(7);
  const tmpRepoPackagePath = join(tmpRepoName, packageDetails.path);
  const tmpRepoNpmRoot = tmpRepoPackagePath.slice(
    0,
    -`/node_modules/${packageDetails.name}`.length,
  );

  const tmpRepoPackageJsonPath = join(tmpRepoNpmRoot, 'package.json');
  const version = getPackageVersion(join(resolve(packageDetails.path, 'package.json')));

  mkdirSync(tmpRepoNpmRoot);
  chmodSync(tmpRepoNpmRoot, 0o755);
  writeFileSync(
    tmpRepoPackageJsonPath,
    JSON.stringify({
      name: `${packageDetails.name}-tmp`,
      version: version,
    })
  );

  return {
    tmpRepoName, tmpRepoPackagePath, tmpRepoNpmRoot, tmpRepoPackageJsonPath, packageVersion: version
  };
};