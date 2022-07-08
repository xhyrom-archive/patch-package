import { PackageManagers } from "../detectPackageManager"
import { PackageDetails } from "../package/packageDetails"
import spawnCommand from "../spawnCommand";

export default async(packageManager: PackageManagers, packageDetails: PackageDetails, packageVersion: string, tmpRepoNpmRoot: string) => {
    console.log(`Installing ${packageDetails.name}@${packageVersion} with ${packageManager}`);
    
    switch(packageManager) {
        case 'bun':
        case 'yarn':
        case 'pnpm': {
            await spawnCommand(
                packageManager,
                packageManager,
                [
                  'add', packageDetails.name
                ],
                {
                  cwd: tmpRepoNpmRoot
                }
            );
            break;
        }
        case 'npm': {
            await spawnCommand(
                packageManager,
                packageManager,
                [
                    'i', packageDetails.name
                ],
                {
                    cwd: tmpRepoNpmRoot
                }
            );
            break;
        }
    }

    console.log(`${packageDetails.name}@${packageVersion} has been installed with ${packageManager}`);
}