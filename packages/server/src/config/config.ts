if (!process.env.NODE_ENV) {
  throw new Error('process.env.NODE_ENV is not defined');
}

export interface ParsedEnvVariables extends Omit<Env, 'ALLOWED_ORIGINS' | 'LOGIN' | 'PORT'> {
  readonly ALLOWED_ORIGINS: string[];
  readonly LOGIN: number;
  readonly PORT: number;
}

const envs: EnvVaribales[] = [
  'NODE_ENV',
  'HOST',
  'PORT',
  'ALLOWED_ORIGINS',
  'NOTION_DATABASE_ID',
  'NOTION_TOKEN',
  'LOGIN',
  'PASSWORD',
];

const { loadEnv } = await import('./loadEnv');
const loadedEnvs = loadEnv();

export class Config {
  static #loadEnvVariable<Env extends EnvVaribales>(variable: Env): NodeJS.ProcessEnv[Env] | never {
    const env = loadedEnvs[variable];

    if (!env) {
      throw new Error(`Env variable: "${variable}" is not found!`);
    }

    return env;
  }

  static #processEnvVariableValue(name: EnvVaribales, value: string): string | string[] | number {
    if (name === 'PORT' || name === 'LOGIN') {
      return Number(value);
    }

    if (name === 'ALLOWED_ORIGINS') {
      return value.split(',');
    }

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
  static readonly isProd: boolean = this.env.NODE_ENV === 'production';
  static readonly isDev: boolean = !this.isProd;
}
