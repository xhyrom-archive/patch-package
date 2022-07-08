// https://github.com/ds300/patch-package/blob/master/src/PackageDetails.ts

import { existsSync } from 'fs';
import { join } from 'path';
export interface PackageDetails {
    humanReadablePathSpecifier: string;
    pathSpecifier: string;
    path: string;
    name: string;
    isNested: boolean;
    packageNames: string[];
}
  
export interface PatchedPackageDetails extends PackageDetails {
    version: string;
    patchFilename: string;
    isDevOnly: boolean;
}

export function getPatchDetailsFromCliString(
    specifier: string,
  ): PackageDetails | null {
    const parts = specifier.split('/')
  
    const packageNames = []
  
    let scope: string | null = null
  
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith('@')) {
        if (scope) {
          return null
        }
        scope = parts[i]
      } else {
        if (scope) {
          packageNames.push(`${scope}/${parts[i]}`)
          scope = null
        } else {
          packageNames.push(parts[i])
        }
      }
    }
  
    const path = join('node_modules', packageNames.join('/node_modules/'));
    if (!existsSync(path)) return null;
  
    return {
      packageNames,
      path,
      name: packageNames[packageNames.length - 1],
      humanReadablePathSpecifier: packageNames.join(' => '),
      isNested: packageNames.length > 1,
      pathSpecifier: specifier,
    }
}  