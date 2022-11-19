import React, { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';

import { Fieldset, FieldsetProps } from '../Fieldset';
import { Input } from '../Input';

interface Props extends Omit<FieldsetProps, 'children'> {
  data: any[];
  searchBy: string;
  children: (data: any[]) => React.ReactNode;
}

export const SearchableFieldset = ({ data, children, searchBy, ...props }: Props) => {
  const [searchableData, setSearchableData] = useState(data);
  const fuse = useMemo(() => new Fuse(data, { keys: [searchBy] }), []);

  useEffect(() => {
    // TODO: придумать как приводить стейт к изначальному состоянию
    window.addEventListener('reset', () => setSearchableData(data), { once: true });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const searchQuery = e.target.value;
    const searchResult = fuse.search(searchQuery);
    const hasSearchResults = Boolean(searchResult.length);

    if (hasSearchResults || (!hasSearchResults && searchQuery)) {
      const newState = searchResult.map(({ item }) => item);
      setSearchableData(newState);
      return;
    }

    if (!hasSearchResults) {
      setSearchableData(data);
    }
  };

  return (
    <Fieldset {...props}>
      <Input type="search" placeholder="Search" onChange={handleSearch} />
      <div className="max-h-[300px] overflow-y-auto">{children(searchableData)}</div>
    </Fieldset>
  );
};
