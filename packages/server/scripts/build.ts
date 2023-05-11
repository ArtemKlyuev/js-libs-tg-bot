import fs from 'node:fs/promises';

import { build } from 'esbuild';

import { dependencies, devDependencies } from '../package.json' assert { type: 'json' };

const BUILD_DIR = 'build';

const devDeps = Object.keys(devDependencies);
const deps = Object.keys(dependencies).filter((dep) => dep !== 'common');

await fs.rm(BUILD_DIR, { force: true, recursive: true });

const res = await fs.readFile('../../.tool-versions', { encoding: 'utf-8' });
const nodejsVersion = res.trim().split(' ').at(-1);

build({
  entryPoints: ['./src/index.ts'],
  outfile: `${BUILD_DIR}/index.js`,
  external: [...devDeps, ...deps],
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
  .then(() => console.log('Сервер успешно собран!'))
  .catch((error) => console.error(`Ошибка при сборке сервера! ${error}`));
