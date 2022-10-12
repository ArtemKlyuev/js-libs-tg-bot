import { Markup } from 'telegraf';
import chunk from 'lodash/chunk';

import { Scene } from '../../../Scene';

import { CheckboxesState } from './CheckboxesState';
import { Checkbox } from './Checkbox';

export const tagsStep = Scene.createStep();

const getCheckbox = (checkboxesState: CheckboxesState) => (tag: string) => {
  return new Checkbox(tag, tag, checkboxesState.getCheckboxState(tag)).render();
};

const CHECKBOXES_IN_A_ROW = 3;

tagsStep.on('callback_query', async (ctx) => {
  const pressedButton = ctx.update.callback_query.data!;
  const { tags } = ctx.scene.session.state.addScene!.properties;

  ctx.scene.session.state.addScene!.state.platform ??= pressedButton!;
  // @ts-expect-error вынужденная мера, так как стейт должен быть локальным для данного этапа
  ctx.scene.session.state.addScene!.checkboxesState ??= new CheckboxesState(tags);

  // @ts-expect-error
  const checkboxesState = ctx.scene.session.state.addScene!.checkboxesState as CheckboxesState;

  checkboxesState.toggleCheckbox(pressedButton);

  if (pressedButton === 'next') {
    if (checkboxesState.hasCheckedCheckboxes) {
      ctx.scene.session.state.addScene!.state.tags = checkboxesState.checkedCheckboxes;
      ctx.wizard.next();
      // @ts-expect-error пришлось вызвать приватное свойство, иначе шаг не переключался,
      // другого способа пока нет
      return ctx.wizard.steps[ctx.wizard.cursor].handler(ctx);
    }

    return await ctx.answerCbQuery('Нужно выбрать хотя бы один тег');
  }

  await ctx.answerCbQuery();

  const checkboxes = chunk(tags, CHECKBOXES_IN_A_ROW).map((chunk) =>
    chunk.map(getCheckbox(checkboxesState)),
  );

  await ctx.editMessageText(
    'Выберите тэги',
    Markup.inlineKeyboard([[Markup.button.callback('Далее', 'next')], ...checkboxes]),
  );
});
