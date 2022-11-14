import Fuse from 'fuse.js';
import React, { useMemo, useState } from 'react';
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const searchResult = fuse.search(e.target.value);

    if (searchResult.length) {
      const newState = searchResult.map(({ item }) => item);
      setSearchableData(newState);
      return;
    }

    setSearchableData(data);
  };

  return (
    <Fieldset {...props}>
      <Input type="search" placeholder="Search" onChange={handleSearch} />
      <div className="max-h-[300px] overflow-y-auto">{children(searchableData)}</div>
    </Fieldset>
  );
};
