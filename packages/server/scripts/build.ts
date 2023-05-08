import { build } from 'esbuild';

import packageJSON from '../package.json' assert { type: 'json' };

const devDeps = Object.keys(packageJSON.devDependencies);
const deps = Object.keys(packageJSON.dependencies).filter((dep) => dep !== 'common');

build({
  entryPoints: ['./src/index.ts'],
  outfile: 'build/index.js',
  external: [...devDeps, ...deps],
  platform: 'node',
  format: 'esm',
  target: 'node18.16.0',
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

// build({
//   entryPoints: ['./src/index.ts'],
//   outfile: 'build/index.cjs',
//   external: Object.keys(packageJSON.devDependencies),
//   platform: 'node',
//   format: 'cjs',
//   target: 'node16.17.1',
//   bundle: true,
//   minify: false,
//   sourcemap: false,
//   // banner: {
//   //   js: [
//   //     `import { createRequire as topLevelCreateRequire } from 'module'`,
//   //     `import { fileURLToPath } from 'url';`,
//   //     `import { dirname } from 'path';`,
//   //     `const __filename = fileURLToPath(import.meta.url);`,
//   //     `const __dirname = dirname(__filename);`,
//   //     `const require = topLevelCreateRequire(import.meta.url)`,
//   //   ].join('\n'),
//   // },
// })
//   .then(() => console.log('Сервер успешно собран!'))
//   .catch((error) => console.error(`Ошибка при сборке сервера! ${error}`));
