import { existsSync } from 'fs';
import { join } from 'path';
const applicationPath = process.cwd();

export default (file, pkg) => {
    const localFileExisted = existsSync(join(applicationPath, 'packages', 'rust-bindings', file))
    try {
      if (localFileExisted) {
        return require(join(applicationPath, 'packages', 'rust-bindings', file));
      }

      return require(pkg);
    } catch (e) {
      console.error(e)
      process.exit(0);
    }
}