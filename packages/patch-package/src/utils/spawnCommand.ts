import { PackageManagers } from './detectPackageManager';
import loadBinding from './loadBinding';

let nativeBinding = null;

const bindings = () => {
    if (nativeBinding) return nativeBinding;
    const { platform, arch } = process;
    
    switch(platform) {
        case 'darwin': {
            switch(arch) {
                case 'x64':
                    nativeBinding = loadBinding('patch-package-bindings.darwin-x64.node', '@xhyrom/patch-package-bindings-darwin-x64');
                    break;
            }
            break;
        }
        case 'linux': {
            switch(arch) {
                case 'x64':
                    nativeBinding = loadBinding('patch-package-bindings.linux-x64-gnu.node', '@xhyrom/patch-package-bindings-linux-x64-gnu');
                    break;
            }
            break;
        }
        case 'win32': {
            nativeBinding = loadBinding('patch-package-bindings.win32-x64-msvc.node', '@xhyrom/patch-package-bindings-win32-x64-msvc');
            break;
        }
    }

    return nativeBinding;
}

export default async(packageManager: PackageManagers, command: string, args: string[], options?: Record<string, string>) => {
    if (packageManager == 'bun') {
        bindings();

        return nativeBinding.runCommand(command, options.cwd, args);
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