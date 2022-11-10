interface Env {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly NOTION_TOKEN: string;
  readonly NOTION_DATABASE_ID: string;
  readonly HOST: string;
  readonly PORT: string;
  readonly ALLOWED_ORIGINS: string;
  readonly LOGIN: string;
  readonly PASSWORD: string;
}

type EnvVaribales = keyof Env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
