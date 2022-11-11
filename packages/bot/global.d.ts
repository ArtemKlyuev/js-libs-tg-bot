interface Env {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly TELEGRAM_BOT_TOKEN: string;
  readonly TELEGRAM_VALID_USER_ID: string;
  readonly WEB_APP_URL: string;
}

type EnvVaribales = keyof Env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
