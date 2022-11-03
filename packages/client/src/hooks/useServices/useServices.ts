import { createContext, useContext } from 'react';
import { HttpRequest } from 'common/services';

interface Services {
  httpRequest: HttpRequest;
}

const ServicesContext = createContext<Services>({} as Services);
export const ServicesProvider = ServicesContext.Provider;

export const useServices = (): Services => useContext(ServicesContext);
