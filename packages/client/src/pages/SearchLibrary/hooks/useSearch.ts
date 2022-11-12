import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HttpRequestError } from 'common/services';
import { SearchLibrarySucessReply, SearchLibraryErrorReply } from 'server/types';

import { useServices } from '@hooks';

interface Options {
  onSuccess: (data: Library[]) => void;
}

interface Fields {
  query: string;
}

interface LibraryProperty {
  id: string;
  name: string;
  value: string;
}

export interface Data {
  error: null;
  results: Library[];
}

type Value = SearchLibrarySucessReply['results'][0][0];

const numberFormat = new Intl.NumberFormat();

export class Library {
  #id: string;
  #properties: LibraryProperty[];
  #selected: boolean;

  #mapProperty({ value, ...rest }: Value): LibraryProperty {
    if (!value) {
      return { ...rest, value: 'Нет данных' };
    }

    if (typeof value === 'number') {
      return { ...rest, value: numberFormat.format(value) };
    }

    if (Array.isArray(value)) {
      return { ...rest, value: value.map(({ name }) => `#${name}`).join(', ') };
    }

    if (typeof value === 'object') {
      return { ...rest, value: value.name };
    }

    return { ...rest, value };
  }

  constructor(properties: SearchLibrarySucessReply['results'][0], selected: boolean) {
    const property = properties.find(({ id }) => id.toLowerCase() === 'title');

    if (!property) {
      throw new Error(`Library: can't find property with id "title"`);
    }

    this.#properties = properties.map(this.#mapProperty);
    this.#id = property.value as string;
    this.#selected = selected;
  }

  setSelected(selected: boolean): void {
    this.#selected = selected;
  }

  toggleSelected(): void {
    this.#selected = !this.#selected;
  }

  toString(): string {
    return this.#properties.map(({ name, value }) => `${name}: ${value}`).join('\n\n');
  }

  get id(): string {
    return this.#id;
  }

  get selected(): boolean {
    return this.#selected;
  }

  get properties(): LibraryProperty[] {
    return this.#properties;
  }
}

const schema = z.object({ query: z.string().trim().min(1, { message: 'Required' }) });

const select = (data: SearchLibrarySucessReply): Data => {
  const results = data.results.map((library) => new Library(library, false));

  return { error: data.error, results };
};

export const useSearch = ({ onSuccess }: Options) => {
  const { libraryService } = useServices();

  const { handleSubmit, register, reset, control } = useForm<Fields>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [query, setQuery] = useState('');

  const { isFetching, isError, error, data } = useQuery<
    SearchLibrarySucessReply,
    HttpRequestError<SearchLibraryErrorReply>,
    Data
  >(
    ['search-library', query],
    async () => {
      const { data } = await libraryService.search(query).response;
      return data as SearchLibrarySucessReply;
    },
    {
      enabled: Boolean(query),
      onSuccess: ({ results }) => {
        onSuccess(results);
        reset();
      },
      select,
    },
  );

  const onSubmit = handleSubmit((data) => setQuery(data.query));

  return { isFetching, isError, error, data, control, register, onSubmit };
};
