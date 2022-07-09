import { PackageManagers } from '../detectPackageManager';
import { PackageDetails } from './packageDetails';
import spawnCommand from '../spawnCommand';

export default async(packageManager: PackageManagers, packageDetails: PackageDetails, packageVersion: string, tmpRepoNpmRoot: string) => {
    console.log(`Removing ${packageDetails.name}@${packageVersion} with ${packageManager}`);
    
    switch(packageManager) {
        case 'bun':
        case 'yarn':
        case 'pnpm': {
            await spawnCommand(
                packageManager,
                packageManager,
                [
                  'remove', packageDetails.name
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
                    'uninstall', packageDetails.name
                ],
                {
                    cwd: tmpRepoNpmRoot
                }
            );
            break;
        }
    }

    console.log(`${packageDetails.name}@${packageVersion} has been removed with ${packageManager}`);
};