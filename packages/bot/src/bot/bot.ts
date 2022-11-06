import { Telegraf, Context, Scenes, session } from 'telegraf';

import { Config } from '@config';

import { userPermissionGuard, diContainer } from './middlewares';
import { commands } from './commands';
import { addScene, searchScene } from './scenes';

// export interface AddScene {
//   properties: Properties;
//   state: AddSceneState;
// }

// export interface AddSceneState {
//   name: string;
//   platform: string;
//   tags: string[];
//   status: string;
//   score?: string;
//   review?: string;
// }

// interface State {
//   addScene?: AddScene;
// }

// interface DiContainer {
//   dbRepository: DatabaseRepository;
//   GithubApi: typeof GithubApi;
//   NPMRegistry: typeof NPMRegistry;
// }

/**
 * It is possible to extend the session object that is available to each wizard.
 * This can be done by extending `WizardSessionData` and in turn passing your
 * own interface as a type variable to `WizardContextWizard`.
 */
// export interface WizardSession extends Scenes.WizardSessionData {
//   // will be available under `ctx.scene.session.state`
//   state: State;
// }

/**
 * We can define our own context object.
 *
 * We now have to set the scene object under the `scene` property. As we extend
 * the scene session, we need to pass the type in as a type variable.
 *
 * We also have to set the wizard object under the `wizard` property.
 */
// export interface MyContext extends Context {
//   diContainer: DiContainer;
//   scene: Scenes.SceneContextScene<MyContext, WizardSession>;
//   wizard: Scenes.WizardContextWizard<MyContext>;
// }

export const startBot = async (): Promise<void> => {
  // const bot = new Telegraf<MyContext>(Config.env.TELEGRAM_BOT_TOKEN);
  const bot = new Telegraf(Config.env.TELEGRAM_BOT_TOKEN);

  bot.use(userPermissionGuard(Config.env.TELEGRAM_VALID_USER_ID));
  bot.use(session());
  bot.use(diContainer);

  // const scenes = new Scenes.Stage<MyContext>([addScene.scene, searchScene.scene]);

  // bot.use(scenes.middleware());

  await bot.telegram.setMyCommands(commands);

  bot.start((ctx) => ctx.reply('Welcome!'));

  // bot.command('healthcheck', (ctx) => ctx.reply('Ok'));
  // bot.command('add', (ctx) => ctx.scene.enter(addScene.name));
  // bot.command('search', (ctx) => ctx.scene.enter(searchScene.name));

  bot.command('healthcheck', (ctx) => ctx.reply('Ok'));
  bot.command('add', (ctx) => ctx);
  bot.command('search', (ctx) => ctx.scene.enter(searchScene.name));

  bot.launch();

  process.once('SIGINT', () => {
    console.log('bot SIGINT');
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    console.log('bot SIGTERM');
    bot.stop('SIGTERM');
  });
};
