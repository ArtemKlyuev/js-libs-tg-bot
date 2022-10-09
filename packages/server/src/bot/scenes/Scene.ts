import { Scenes, Composer } from 'telegraf';

import { MyContext } from '../bot';

export class Scene {
  readonly scene: Scenes.WizardScene<MyContext>;

  constructor(readonly name: string, ...steps: Composer<MyContext>[]) {
    this.scene = new Scenes.WizardScene<MyContext>(name, ...steps);
  }

  static createStep(): Composer<MyContext> {
    return new Composer<MyContext>();
  }

  addSteps(...steps: Composer<MyContext>[]): void {
    this.scene.steps.push(...steps);
  }
}
