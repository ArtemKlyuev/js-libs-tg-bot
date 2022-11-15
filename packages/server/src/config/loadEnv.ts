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

  const env = loader();

  if (env.error) {
    console.error(
      `Can't parse env file for mode ${mode}. Make sure file exist.\Returning process.env`,
    );
    console.error(env.error);
    return process.env as EnvVars;
  }

  return env.parsed as EnvVars;
};
