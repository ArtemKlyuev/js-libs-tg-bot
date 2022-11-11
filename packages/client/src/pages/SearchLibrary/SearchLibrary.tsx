import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { HttpRequestError } from 'common/services';
import { SearchLibrarySucessReply, SearchLibraryErrorReply } from 'server/types';

import { Form, InputLabel, Input, Button } from '@components';
import { useServices } from '@hooks';

interface Fields {
  query: string;
}

const schema = z.object({ query: z.string().trim().min(1, { message: 'Required' }) });

const numberFormat = new Intl.NumberFormat();

const select = (data: SearchLibrarySucessReply) => {
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
    SearchLibrarySucessReply,
    HttpRequestError<SearchLibraryErrorReply>
  >(
    ['search-library', query],
    async () => {
      const { data } = await libraryService.search(query).response;
      return data as SearchLibrarySucessReply;
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

            return (
              <button key={id} className="card bg-neutral text-neutral-content">
                <div className="card-body gap-[15px]">
                  {properties.map(({ id, name, value }) => (
                    <div key={id} className="text-left">
                      <span className="font-bold">{name}:</span>&nbsp;<span>{value}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
      {config.env.DEV && <DevTool control={control} />}
    </>
  );
};
