import path from 'node:path';

import { config } from 'dotenv';

const mode = process.env.NODE_ENV as Env['NODE_ENV'] | undefined;

const envToLoader = {
  development: () => config({ path: path.resolve(process.cwd(), '.env.local') }),
  production: () => config({ path: path.resolve(process.cwd(), '.env') }),
  test: () => config({ path: path.resolve(process.cwd(), '.env.test.local') }),
};

export const loadEnv = <EnvVars extends Record<string, string>>(): EnvVars | never => {
  if (!mode) {
    throw new Error(`No loader assigned to env ${mode}`);
  }

  const loader = envToLoader[mode];

  if (!loader) {
    console.error(`Not found env loader for mode ${mode}.\nReturning process.env`);
    return process.env as EnvVars;
  }

  try {
    const env = loader();

    if (env.error) {
      throw env.error;
    }

    return env.parsed as EnvVars;
  } catch (error) {
    console.error(
      `[loadEnv]: Can't parse env file for mode ${mode}. Make sure file exist. Returning process.env`,
    );
    console.error(error);
    return process.env as EnvVars;
  }
};
