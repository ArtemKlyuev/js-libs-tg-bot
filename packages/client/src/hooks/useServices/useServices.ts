import { createContext, useContext } from 'react';
import { HttpRequest } from 'common/services';

import { Config } from '@config';
import { Library, LocalStorage } from '@services';

interface Services {
  httpRequest: HttpRequest;
  libraryService: Library;
  config: Config;
  telegram: Window['Telegram']['WebApp'];
  LocalStorage: LocalStorage;
}

const ServicesContext = createContext<Services>({} as Services);
export const ServicesProvider = ServicesContext.Provider;

export const useServices = (): Services => useContext(ServicesContext);
