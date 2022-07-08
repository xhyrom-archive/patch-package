import { join, resolve } from "path";
import { bold, green, red, reset } from "../colors";
import { PackageManagers } from "../detectPackageManager";
import getPatchFiles from "../fs/getPatchFiles";
import { getPackageDetailsFromPatchFilename, PackageDetails } from "../package/packageDetails";
import { executeEffects } from "./impl/apply";
import { readPatch } from "./impl/read";
import { reversePatch } from "./impl/reverse";

export default async(packageManager: PackageManagers,
    patchesDir: string,
    applicationPath: string,
) => {
    const patchFiles = getPatchFiles(patchesDir);
    if (patchFiles.length === 0) {
        console.error(`${red}No patch files found${reset}`);
        return;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    for (const patchFile of patchFiles) {
        const packageDetails = getPackageDetailsFromPatchFilename(patchFile);

        if (!packageDetails) {
            warnings.push(
              `Unrecognized patch file in patches directory ${patchFile}`,
            );
            continue;
        }

        const {
            version,
            path,
            pathSpecifier,
        } = packageDetails;
    
        const packageDir = join(applicationPath, path)
        const installedPackage = require(join(packageDir, "package.json"))

        if (
            applyPatch({
              patchFilePath: resolve(patchesDir, patchFile) as string,
              reverse: false,
              packageDetails,
              patchDir: patchesDir,
            })
        ) {
          console.log(
            `${bold}${pathSpecifier}@${version} ${green}✔${reset}`,
          )
        } else if (installedPackage.version === version) {
          errors.push(
            `${red}Failed to apply patch because package version?.`
          )
        } else {
          errors.push(
            `${red}Failed to apply patch.`
          )
        }
    }
}

export function applyPatch({
    patchFilePath,
    reverse,
    packageDetails,
    patchDir,
  }: {
    patchFilePath: string
    reverse: boolean
    packageDetails: PackageDetails
    patchDir: string
  }): boolean {
    const patch = readPatch({ patchFilePath, packageDetails, patchDir });
    try {
      executeEffects(reverse ? reversePatch(patch) : patch, { dryRun: false })
    } catch (e) {
      console.log(e);
      try {
        executeEffects(reverse ? patch : reversePatch(patch), { dryRun: true })
      } catch (e) {
        return false
      }
    }
  
    return true
}