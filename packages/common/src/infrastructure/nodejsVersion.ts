import fs from 'node:fs/promises';

// TODO: сделать рекурсивный поиск файла
const res = await fs.readFile('../../.tool-versions', { encoding: 'utf-8' });
export const nodejsVersion = res.trim().split(' ').at(-1)!;
