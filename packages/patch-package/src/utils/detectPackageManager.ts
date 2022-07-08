import { existsSync } from 'fs';
import { join } from 'path';
import parseFlag from './parseFlag'

export type PackageManagers = 'npm' | 'npm-shrinkwrap' | 'yarn' | 'pnpm' | 'bun';

export default (applicationPath): PackageManagers => {
    const override = parseFlag('use-pkg-manager') as PackageManagers;
    if (override) return override;

    const packageLockExists = existsSync(
        join(applicationPath, 'package-lock.json'),
    );
    const shrinkWrapExists = existsSync(
        join(applicationPath, 'npm-shrinkwrap.json'),
    );
    const yarnLockExists = existsSync(join(applicationPath, 'yarn.lock'));
    const bunLockbExists = existsSync(join(applicationPath, 'bun.lockb'));
    const pnpmLockExists = existsSync(join(applicationPath, 'pnpm-lock.yaml'));

    if ((packageLockExists || shrinkWrapExists) && yarnLockExists) {
        return shrinkWrapExists ? 'npm-shrinkwrap' : 'npm'
    } else if (packageLockExists || shrinkWrapExists) {
        return shrinkWrapExists ? 'npm-shrinkwrap' : 'npm'
    } else if (yarnLockExists) {
        return 'yarn'
    } else if (bunLockbExists) {
        return 'bun'
    } else if (pnpmLockExists) {
        return 'pnpm'
    } else {
        return 'npm';
    }
}