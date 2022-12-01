import * as fs from 'fs';

export const doesFileExists = async (filePath: string) =>  {
    return await fs.existsSync(filePath);
}