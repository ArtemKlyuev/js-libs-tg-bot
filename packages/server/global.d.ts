interface Env {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly NOTION_TOKEN: string;
  readonly NOTION_DATABASE_ID: string;
}

type EnvVaribales = keyof Env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
