import { build } from 'esbuild';

import { devDependencies } from './package.json';

build({
  entryPoints: ['./src/bot/index.ts'],
  outdir: 'build',
  external: Object.keys(devDependencies),
  platform: 'node',
  format: 'cjs',
  target: 'es2022',
  bundle: true,
  minify: false,
  sourcemap: false,
})
  .then(() => console.log('Бот успешно собран!'))
  .catch((error) => console.error(`Ошибка при сборке бота! ${error}`));
