import { Form, InputLabel, Input, Button } from '@components';

export const SearchLibrary = () => {
  return (
    <Form>
      <div className="form-control w-full">
        <InputLabel label="Название библиотеки" />
        <Input type="search" />
      </div>
      <Button type="submit">Искать</Button>
    </Form>
  );
};
