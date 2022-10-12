const envs: EnvVaribales[] = ['NODE_ENV', 'NOTION_DATABASE_ID', 'NOTION_TOKEN'];

export interface ParsedEnvVariables extends Omit<Env, 'TELEGRAM_VALID_USER_ID'> {
  TELEGRAM_VALID_USER_ID: number;
}

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
}

export class Config {
  static #loadEnvVariable<Env extends EnvVaribales>(variable: Env): NodeJS.ProcessEnv[Env] | never {
    const env = process.env[variable];

    if (!env) {
      throw new Error(`Env variable: "${variable}" is not found!`);
    }

    return env;
  }

  static #processEnvVariableValue(name: EnvVaribales, value: string): string | number {
    return value;
  }

  static #loadEnvVariables(): ParsedEnvVariables | never {
    const aggregateErros = new AggregateError([], 'Config env variables errors');

    const result = envs.reduce((acc, curr) => {
      try {
        const env = this.#processEnvVariableValue(curr, this.#loadEnvVariable(curr)!);
        return { ...acc, [curr]: env };
      } catch (error) {
        aggregateErros.errors.push(error);
        return acc;
      }
    }, {} as ParsedEnvVariables);

    if (aggregateErros.errors.length > 0) {
      const errorString = aggregateErros.errors.join('\n');
      throw new Error(`Error while load env variables! Trace:\n${errorString}`);
    }

    return result;
  }

  static readonly env = this.#loadEnvVariables();
}
