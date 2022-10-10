import { useRef, useEffect } from 'react';
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
  const debouncedCallback = useRef(debounce(callback, wait, settings)).current;

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
