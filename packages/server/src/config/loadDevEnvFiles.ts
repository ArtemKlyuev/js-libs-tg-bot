import path from 'node:path';

import { config } from 'dotenv';

const shouldExpose = (): boolean => {
  try {
    // @ts-expect-error wrapped in try...catch
    return JSON.parse(process.env.EXPOSE);
  } catch (error) {
    return false;
  }
};

export const loadDevEnvFiles = (): void => {
  config({ path: path.resolve(process.cwd(), '.env.local') });

  if (shouldExpose()) {
    config({
      path: path.resolve(process.cwd(), '.env.expose.local'),
      override: true,
    });
  }
};
