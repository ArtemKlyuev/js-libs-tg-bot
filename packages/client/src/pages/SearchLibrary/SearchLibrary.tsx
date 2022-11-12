import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { HttpRequestError } from 'common/services';
import { SearchLibrarySucessReply, SearchLibraryErrorReply } from 'server/types';

import { Form, InputLabel, Input, Button, LibraryCard, Spinner, ErrorMessage } from '@components';
import { useServices } from '@hooks';

interface Fields {
  query: string;
}

interface LibraryProperty {
  id: string;
  name: string;
  value: string;
}

type Library = LibraryProperty[];
interface Data {
  error: null;
  results: Library[];
}

const schema = z.object({ query: z.string().trim().min(1, { message: 'Required' }) });

const numberFormat = new Intl.NumberFormat();

const select = (data: SearchLibrarySucessReply): Data => {
  const results = data.results.map((library) =>
    library.map(({ value, ...props }) => {
      if (!value) {
        return { ...props, value: 'Нет данных' };
      }

      if (typeof value === 'number') {
        return { ...props, value: numberFormat.format(value) };
      }

      if (Array.isArray(value)) {
        return { ...props, value: value.map(({ name }) => `#${name}`).join(', ') };
      }

      if (typeof value === 'object') {
        return { ...props, value: value.name };
      }

      return { ...props, value };
    }),
  );

  return { error: data.error, results };
};

export const SearchLibrary = () => {
  const { libraryService, config, telegram } = useServices();
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

  const { handleSubmit, register, reset, control } = useForm<Fields>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [query, setQuery] = useState('');

  const { isFetching, isError, error, data } = useQuery<
    Data,
    HttpRequestError<SearchLibraryErrorReply>
  >(
    ['search-library', query],
    async () => {
      const { data } = await libraryService.search(query).response;
      return data as Data;
    },
    { enabled: Boolean(query), onSuccess: () => reset(), select },
  );

  const onSubmit = handleSubmit((data) => setQuery(data.query));

  const sendToTelegram = (id: string) => {
    const result = data?.results
      .find((properties) => {
        const [title] = properties;
        return title.id === id;
      })
      ?.map(({ name, value }) => `${name}: ${value}`)
      .join('\n\n');

    telegram.sendData(result);
  };

  const sendAllToTelegram = () => {
    const result = data?.results?.map((library) =>
      library.map(({ name, value }) => `${name}: ${value}`).join('\n\n'),
    );

    telegram.sendData(result);
  };

  const selectLibrary = (id: string): void => setSelectedIDs((prev) => [...prev, id]);
  const unSelectLibrary = (id: string): void => {
    setSelectedIDs((prev) => prev.filter((inclID) => inclID !== id));
  };

  const toggleSelectLibrary = (id: string): void => {
    const hasID = Boolean(selectedIDs.find((inclID) => inclID === id));

    if (hasID) {
      unSelectLibrary(id);
      return;
    }

    selectLibrary(id);
  };

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
          <ErrorMessage message={error.message} messageFromServer={error.responseData?.error} />
        )}
        {data?.results.map((properties) => {
          const [{ value: id }] = properties;
          const handleClick = () => toggleSelectLibrary(id);
          const hasID = Boolean(selectedIDs.find((inclID) => inclID === id));

          return (
            <LibraryCard key={id} selected={hasID} properties={properties} onClick={handleClick} />
          );
        })}
      </div>
      {data?.results && (
        <div className="sticky bottom-[0] mt-[20px] flex flex-col content-center gap-[10px]">
          {selectedIDs.length !== 0 && (
            <Button>Отправить библиотек в телеграм: {selectedIDs.length}</Button>
          )}
          <Button onClick={sendAllToTelegram}>Отправить все библиотеки в телеграм</Button>
        </div>
      )}
      {config.env.DEV && <DevTool control={control} />}
    </>
  );
};
