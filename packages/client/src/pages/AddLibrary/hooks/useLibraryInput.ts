import { useDebouncedInput, useLibraryStatus } from '@hooks';

interface Config {
  validationErrorMessage?: string | undefined;
}

type HandleChange = (event: React.ChangeEvent<HTMLInputElement>) => void;

interface UseLibraryInputReturn {
  error: string;
  handleChange: HandleChange;
}

const constructInputErrorMessage = (
  libraryName: string,
  validationErrorMessage: string | undefined,
  existOnDb: boolean | null,
  existOnNPM: boolean | null,
): string => {
  if (existOnDb !== null && existOnDb) {
    return `${libraryName} уже есть в базе`;
  }

  if (validationErrorMessage) {
    return validationErrorMessage;
  }

  if (existOnNPM !== null && !existOnNPM) {
    return `Библиотека ${libraryName} не найдена в NPM`;
  }

  return '';
};

export const useLibraryInput = ({ validationErrorMessage }: Config): UseLibraryInputReturn => {
  const { setLibrary, existOnDb, existOnNPM } = useLibraryStatus();

  const { value, setValue } = useDebouncedInput({
    onSearch: (value) => setLibrary(value.trim().toLowerCase()),
    wait: 300,
  });

  const handleChange: HandleChange = (event) => setValue(event.target.value);

  const error = constructInputErrorMessage(
    value.trim().toLowerCase(),
    validationErrorMessage,
    existOnDb,
    existOnNPM,
  );

  return { error, handleChange };
};
