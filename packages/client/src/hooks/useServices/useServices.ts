import { createContext, useContext } from 'react';
import { HttpRequest } from 'common/services';
import { Library } from '@services';

interface Services {
  httpRequest: HttpRequest;
  libraryService: Library;
}

const ServicesContext = createContext<Services>({} as Services);
export const ServicesProvider = ServicesContext.Provider;

export const useServices = (): Services => useContext(ServicesContext);
