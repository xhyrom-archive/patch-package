import bindings from './bindings';
import { PackageManagers } from './detectPackageManager';

export default async(packageManager: PackageManagers, command: string, args: string[], options?: Record<string, string>) => {
    if (packageManager == 'bun') {
        return bindings().runCommand(command, options.cwd, args);
    }

    const childProcess = await import('node:child_process');

    const defaultOptions = {
        logStdErrOnError: true,
        throwOnError: true,
    }

    const mergedOptions = Object.assign({}, defaultOptions, options)
    const result = childProcess.spawnSync(command, args, options)
    if (result.error || result.status !== 0) {
      if (mergedOptions.logStdErrOnError) {
        if (result.stderr) {
          console.error(result.stderr.toString())
        } else if (result.error) {
          console.error(result.error)
        }
      }
      if (mergedOptions.throwOnError) {
        throw result
      }
    }
    return result
}