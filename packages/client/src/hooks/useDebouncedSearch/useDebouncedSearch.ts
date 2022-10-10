import { useEffect, useState } from 'react';

import { Options as UseDebounceOptions, useDebounce } from '../useDebounce';

interface Result {
  value: string;
  setValue: (value: string) => void;
}

interface Options extends Omit<UseDebounceOptions<any>, 'callback'> {
  onSearch: (value: string) => void;
}

export const useDebouncedSearch = ({ onSearch, ...options }: Options): Result => {
  const [value, setValue] = useState('');
  const debouncedCallback = useDebounce({
    callback: (value: string) => {
      onSearch(value);
    },
    ...options,
  });

  useEffect(() => {
    debouncedCallback(value);
  }, [value]);

  return { value, setValue };
};
