import { DevTool } from '@hookform/devtools';

import { Form, InputLabel, Input, Button, LibraryCard, Spinner, ErrorMessage } from '@components';
import { useServices } from '@hooks';

import { Library, useLibraries, useSearch } from './hooks';

export const SearchLibrary = () => {
  const { config, telegram } = useServices();
  const {
    libraries,
    hasSelectedLibraries,
    selectedCount,
    selectedLibraries,
    setLibraries,
    toggleSelectLibrary,
  } = useLibraries();
  const { control, data, error, isError, isFetching, onSubmit, register } = useSearch({
    onSuccess: setLibraries,
  });

  const sendToTelegram = (libraries: Library[]): void => {
    const result = libraries.map((library) => library.toString());
    telegram.sendData(result);
  };
  const sendSelectedToTelegram = (): void => sendToTelegram(selectedLibraries);
  const sendAllToTelegram = (): void => sendToTelegram(libraries);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <div className="form-control w-full">
          <InputLabel label="Ключевое слово" />
          <Input type="search" {...register('query')} />
        </div>
        <Button type="submit">Искать</Button>
      </Form>
      <div className="mt-10 flex items-center gap-[10px] flex-col">
        {isFetching && <Spinner />}
        {isError && (
          <ErrorMessage message={error!.message} messageFromServer={error!.responseData?.error} />
        )}
        {libraries.map((library) => {
          const { id, selected, properties } = library;
          const handleClick = (): void => toggleSelectLibrary(id);

          return (
            <LibraryCard
              key={id}
              selected={selected}
              properties={properties}
              onClick={handleClick}
            />
          );
        })}
      </div>
      {data?.results && (
        <div className="sticky bottom-[0] mt-[20px] flex flex-col content-center gap-[10px]">
          {hasSelectedLibraries && (
            <Button onClick={sendSelectedToTelegram}>
              Отправить библиотек в телеграм: {selectedCount}
            </Button>
          )}
          <Button onClick={sendAllToTelegram}>Отправить все библиотеки в телеграм</Button>
        </div>
      )}
      {config.env.DEV && <DevTool control={control} />}
    </>
  );
};
