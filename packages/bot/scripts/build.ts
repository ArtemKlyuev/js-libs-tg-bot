import fs from 'node:fs/promises';

import { build } from 'esbuild';

const BUILD_DIR = 'build';

await fs.rm(BUILD_DIR, { force: true, recursive: true });

const res = await fs.readFile('../../.tool-versions', { encoding: 'utf-8' });
const nodejsVersion = res.trim().split(' ').at(-1);

build({
  entryPoints: ['./src/index.ts'],
  outdir: BUILD_DIR,
  platform: 'node',
  format: 'esm',
  target: `node${nodejsVersion}`,
  bundle: true,
  minify: false,
  sourcemap: false,
  banner: {
    js: [
      `import { createRequire as topLevelCreateRequire } from 'module';`,
      `import { fileURLToPath } from 'url';`,
      `import { dirname } from 'path';`,
      `const __filename = fileURLToPath(import.meta.url);`,
      `const __dirname = dirname(__filename);`,
      `const require = topLevelCreateRequire(import.meta.url);`,
    ].join('\n'),
  },
})
  .then(() => console.log('Бот успешно собран!'))
  .catch((error) => console.error(`Ошибка при сборке бота! ${error}`));
