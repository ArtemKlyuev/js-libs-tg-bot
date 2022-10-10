import { Checkbox, Fieldset, Input, InputLabel, Radio } from './components';

export const App = () => {
  return (
    <main className="artboard phone-2 m-auto grid gap-[20px]">
      <h1 className="text-3xl font-bold underline">Добавление библиотеки</h1>
      <div className="form-control w-full max-w-xs">
        <InputLabel label="Название библиотеки" />
        <Input />
      </div>
      <Fieldset label="Выберите платформу">
        <Radio name="platform" value="frontend" label="Frontend" />
        <Radio name="platform" value="backend" label="Backend" />
        <Radio name="platform" value="isomorphic" label="Isomorphic" />
      </Fieldset>
      <Fieldset label="Выберите теги">
        <Checkbox value="kek1" label="Kek1" />
        <Checkbox value="kek2" label="Kek2" />
        <Checkbox value="kek3" label="Kek3" />
      </Fieldset>
      <Fieldset label="Выберите статус">
        <Radio name="status" value="frontend" label="Frontend" />
        <Radio name="status" value="backend" label="Backend" />
        <Radio name="status" value="isomorphic" label="Isomorphic" />
      </Fieldset>
      <Fieldset label="Поставьте рейтинг">
        <Radio name="rating" value="frontend" label="Frontend" />
        <Radio name="rating" value="backend" label="Backend" />
        <Radio name="rating" value="isomorphic" label="Isomorphic" />
      </Fieldset>
    </main>
  );
};