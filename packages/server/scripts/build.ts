import fs from 'node:fs/promises';

import { build } from 'esbuild';
import { baseBuildOptions } from 'common/infrastructure';

import { dependencies, devDependencies } from '../package.json' assert { type: 'json' };

const BUILD_DIR = 'build';

const devDeps = Object.keys(devDependencies);
const deps = Object.keys(dependencies).filter((dep) => dep !== 'common');

await fs.rm(BUILD_DIR, { force: true, recursive: true });

build({
  ...baseBuildOptions,
  entryPoints: ['./src/index.ts'],
  outfile: `${BUILD_DIR}/index.js`,
  external: [...devDeps, ...deps],
})
  .then(() => console.log('Сервер успешно собран!'))
  .catch((error) => console.error(`Ошибка при сборке сервера! ${error}`));
