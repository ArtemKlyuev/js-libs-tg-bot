import { useMemo, useRef } from 'react';

import { useServices } from '../useServices';

const APP_CACHE_KEY = 'app_cache';

export const useAppCache = () => {
  const { LocalStorage } = useServices();
  const cache = useRef<Map<string, any>>(new Map());

  const updateCacheStorage = (value: any) => LocalStorage.set(APP_CACHE_KEY, JSON.stringify(value));

  const set = (key: string, value: any): void => {
    cache.current.set(key, value);
    const obj = Object.fromEntries(cache.current.entries());
    updateCacheStorage(obj);
  };

  useMemo(() => {
    if (!LocalStorage.has(APP_CACHE_KEY)) {
      updateCacheStorage({});
      return;
    }

    const appCache = LocalStorage.get<{}>(APP_CACHE_KEY, true)!;

    cache.current = new Map(Object.entries(appCache));
  }, []);

  const isEmpty = () => cache.current.size === 0;

  return { isEmpty, get: cache.current.get.bind(cache.current), set };
};
