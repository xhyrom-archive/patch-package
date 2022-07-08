import { readdirSync, readFileSync } from 'fs';
import { PackageManagers } from '../detectPackageManager';

interface File {
    path: string;
    content: string;
}

export default async(packageManager: PackageManagers, folder: string): Promise<File[]> => {
    const files = [];

    const getFiles = async(folder) => {
        for (const path of readdirSync(folder, { withFileTypes: true })) {
            if (path.isDirectory()) {
                await getFiles(`${folder}/${path.name}`);
            } else {
                if (path.name === 'README') continue;
                files.push({
                    path: `${folder}/${path.name}`,
                    content: readFileSync(`${folder}/${path.name}`, { encoding: 'utf-8', flag: 'r' }).toString()
                })
            }
        }
    }
    await getFiles(folder);

    return files;
};