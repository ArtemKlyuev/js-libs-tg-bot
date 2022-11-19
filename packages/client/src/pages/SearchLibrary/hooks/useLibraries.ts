import { useMemo, useState } from 'react';

import { Library } from './useSearch';

interface Result {
  hasSelectedLibraries: boolean;
  libraries: Library[];
  selectedCount: number;
  selectedLibraries: Library[];
  setLibraries: React.Dispatch<React.SetStateAction<Library[]>>;
  toggleSelectLibrary: (id: string) => void;
}

export const useLibraries = (): Result => {
  const [libraries, setLibraries] = useState<Library[]>([]);

  const toggleSelectLibrary = (id: string): void => {
    const library = libraries.find((library) => library.id === id)!;

    library.toggleSelected();

    setLibraries((prev) => [...prev]);
  };

  const selectedLibraries = useMemo(
    () => libraries.filter((library) => library.selected),
    [libraries],
  );
  const hasSelectedLibraries = useMemo(
    () => libraries.some(({ selected }) => selected),
    [selectedLibraries],
  );
  const selectedCount = selectedLibraries.length;

  return {
    hasSelectedLibraries,
    libraries,
    selectedCount,
    selectedLibraries,
    setLibraries,
    toggleSelectLibrary,
  };
};
