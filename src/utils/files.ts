import fs from 'node:fs/promises'
import path from "node:path";

export async function getFiles(dir: string) {
    if (dir.trim()) {
        return (await fs.readdir(dir)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }
    return []
}

export function getFilePath(dir: string, fileName: string) {
    return path.join(dir, fileName)
}

export async function getFileContent(filePath: string) {
    return await fs.readFile(filePath, 'utf-8');
}
