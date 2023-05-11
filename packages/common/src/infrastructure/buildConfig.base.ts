import { BuildOptions } from 'esbuild';

import { nodejsVersion } from './nodejsVersion';

export const baseBuildOptions: BuildOptions = {
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
};
