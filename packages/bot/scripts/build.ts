import fs from 'node:fs/promises';

import { build } from 'esbuild';
import { baseBuildOptions } from 'common/infrastructure';

const BUILD_DIR = 'build';

await fs.rm(BUILD_DIR, { force: true, recursive: true });

build({
  ...baseBuildOptions,
  entryPoints: ['./src/index.ts'],
  outdir: BUILD_DIR,
})
  .then(() => console.log('Бот успешно собран!'))
  .catch((error) => console.error(`Ошибка при сборке бота! ${error}`));
