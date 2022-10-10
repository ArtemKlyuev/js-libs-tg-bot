import { useCallback, useEffect } from 'react';
import { Settings, DebouncedFunction, debounce } from 'common/utils';

export interface Options<Callback extends (...args: any) => any> {
  callback: Callback;
  wait?: number;
  settings?: Settings;
}

export const useDebounce = <Callback extends (...args: any) => any>({
  callback,
  wait,
  settings,
}: Options<Callback>): DebouncedFunction<Callback> => {
  const debouncedCallback = useCallback(debounce(callback, wait, settings), []);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
