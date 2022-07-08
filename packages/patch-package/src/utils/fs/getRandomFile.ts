import { readdirSync } from 'fs';

export default (path: string) => {
    const files = readdirSync(path);
    return `${path}/${files[0]}`;
}