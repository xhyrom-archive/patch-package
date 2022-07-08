import { rmSync } from 'fs';
import bindings from '../bindings';

export default (packageManager: string, removeDirectory: string) => {
    if (packageManager == 'bun') {
        return bindings().removeDirectory(removeDirectory);
    }

    return rmSync(removeDirectory, { recursive: true, force: true });
}