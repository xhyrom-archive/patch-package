import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const copyDirectory = (src: string, dest: string) => {
    const exists = existsSync(src);
    const existsDestination = existsSync(dest);
    if (!exists) return;

    if (statSync(src).isDirectory()) {
      if (!existsDestination) mkdirSync(dest);

      for (const dir of readdirSync(src)) copyDirectory(join(src, dir), join(dest, dir));
    } else writeFileSync(dest, readFileSync(src, { encoding: 'utf-8', flag: 'r' }).toString());
};

export default copyDirectory;