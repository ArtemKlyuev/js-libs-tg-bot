import Fuse from 'fuse.js';
import React, { useMemo, useState } from 'react';
import { Fieldset, FieldsetProps } from '../Fieldset';
import { Input } from '../Input';

interface Props extends Omit<FieldsetProps, 'children'> {
  data: any[];
  searchBy: string;
  children: (data: any[]) => React.ReactNode;
}

class Data {
  #data: any;
  #matchesSearch: boolean = true;

  constructor(data: any) {
    this.#data = data;
  }

  setMatchesSearch(): void {
    this.#matchesSearch = true;
  }

  unMatchesSearch(): void {
    this.#matchesSearch = false;
  }

  get data(): any {
    return this.#data;
  }

  get matchesSearch(): boolean {
    return this.#matchesSearch;
  }
}

const mapData = (data: any[]): Data[] => data.map((item) => new Data(item));

export const SearchableFieldset = ({ data, children, searchBy, ...props }: Props) => {
  const [search, setSearch] = useState(mapData(data));
  const fuse = useMemo(
    () =>
      new Fuse(
        search.map(({ data }) => data),
        { keys: [searchBy] },
      ),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const finded = fuse.search(e.target.value);
    const hasItemUnmatchesSearch = search.some((data) => !data.matchesSearch);
    const copy = hasItemUnmatchesSearch ? [...search] : search;

    if (!finded.length) {
      copy.forEach((data) => data.setMatchesSearch());
    } else {
      copy.forEach((data) => data.unMatchesSearch());
      finded.forEach(({ refIndex }) => copy[refIndex].setMatchesSearch());
    }

    setSearch(copy);
  };

  return (
    <Fieldset {...props}>
      <Input type="search" placeholder="Search" onChange={handleSearch} />
      <div className="max-h-[300px] overflow-y-auto">
        {children(search.filter(({ matchesSearch }) => matchesSearch).map(({ data }) => data))}
      </div>
    </Fieldset>
  );
};
