import { readdirSync } from 'fs';

export default (patchesDir: string) => {
    const files = readdirSync(patchesDir);
    return files.filter(file => file.endsWith('.patch'));
};