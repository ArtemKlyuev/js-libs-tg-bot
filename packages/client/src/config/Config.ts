interface Env {
  BACKEND_URL: string;
  MODE: 'development' | 'production';
  DEV: boolean;
  PROD: boolean;
  BASE_URL: string;
}

export interface Config {
  env: Env;
}

const ENV_PREFIX = 'APP_EXPOSE_';

class AppConfig implements Config {
  #env: Env;

  constructor() {
    this.#env = Object.entries(import.meta.env).reduce<Env>((acc, [metaKey, value]) => {
      const key = metaKey.replace(ENV_PREFIX, '');

      return { ...acc, [key]: value };
    }, {} as Env);
  }

  get env(): Env {
    return this.#env;
  }
}

export const config = new AppConfig();
