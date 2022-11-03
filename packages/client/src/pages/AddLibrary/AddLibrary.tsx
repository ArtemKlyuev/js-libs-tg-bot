import {
  Alert,
  Button,
  Checkbox,
  Fieldset,
  Input,
  InputLabel,
  Radio,
  Spinner,
  Textarea,
} from '@components';
import { useDebouncedInput, useLibraryStatus } from '@hooks';

export const AddLibrary = () => {
  const { setLibrary } = useLibraryStatus();

  const { value, setValue } = useDebouncedInput({
    onSearch: (value) => {
      setLibrary(value);
    },
    wait: 1000,
  });

  const handleLibraryNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <form className="grid gap-[20px]">
      <div className="form-control w-full max-w-xs">
        <InputLabel label="Название библиотеки" />
        <Input value={value} onChange={handleLibraryNameChange} />
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
      <Textarea label="Напишите ревью" placeholder="Review" />
      <Button type="submit" loading>
        Добавить
      </Button>
      <Alert type="success" message="Your purchase has been confirmed!" />
      <Spinner />
    </form>
  );
};
