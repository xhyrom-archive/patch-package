import { mkdirSync, writeFileSync } from "fs"
import { join, resolve } from "path"
import getPackageVersion from "../package/getPackageVersion"
import { PackageDetails } from "../package/packageDetails"
import { randomString } from "../random/randomString"

export default (packageDetails: PackageDetails): {
  tmpRepoName: string,
  tmpRepoNpmRoot: string,
  tmpRepoPackageJsonPath: string;
  packageVersion: string;
} => {
  const tmpRepoName = join(randomString(7), packageDetails.path);
  const tmpRepoNpmRoot = tmpRepoName.slice(
    0,
    -`/node_modules/${packageDetails.name}`.length,
  );

  const tmpRepoPackageJsonPath = join(tmpRepoNpmRoot, "package.json");
  const version = getPackageVersion(join(resolve(packageDetails.path, 'package.json')));

  mkdirSync(tmpRepoNpmRoot);
  writeFileSync(
    tmpRepoPackageJsonPath,
    JSON.stringify({
      name: `${packageDetails.name}-tmp`,
      version: version,
    })
  );

  return {
    tmpRepoName, tmpRepoNpmRoot, tmpRepoPackageJsonPath, packageVersion: version
  }
}