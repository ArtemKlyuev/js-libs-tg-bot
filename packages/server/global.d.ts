interface Env {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly NOTION_TOKEN: string;
  readonly NOTION_DATABASE_ID: string;
  readonly TELEGRAM_BOT_TOKEN: string;
  readonly TELEGRAM_VALID_USER_ID: string;
}

type EnvVaribales = keyof Env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
