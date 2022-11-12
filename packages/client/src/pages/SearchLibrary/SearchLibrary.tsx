import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { HttpRequestError } from 'common/services';
import { SearchLibrarySucessReply, SearchLibraryErrorReply } from 'server/types';

import { Form, InputLabel, Input, Button, LibraryCard } from '@components';
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
  const { libraryService, config } = useServices();

  const { handleSubmit, register, reset, control } = useForm<Fields>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [query, setQuery] = useState('');

  const { isLoading, isError, error, data } = useQuery<
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

  return (
    <>
      <Form onSubmit={onSubmit}>
        <div className="form-control w-full">
          <InputLabel label="Ключевое слово" />
          <Input type="search" {...register('query')} />
        </div>
        <Button type="submit">Искать</Button>
      </Form>
      {data?.results && (
        <div className="mt-10">
          {data.results.map((properties) => {
            const [{ id }] = properties;

            return <LibraryCard key={id} properties={properties} />;
          })}
        </div>
      )}
      {config.env.DEV && <DevTool control={control} />}
    </>
  );
};
