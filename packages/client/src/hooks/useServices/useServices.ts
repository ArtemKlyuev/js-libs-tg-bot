import { createContext, useContext } from 'react';

interface Services {}

const ServicesContext = createContext<Services>({});
export const ServicesProvider = ServicesContext.Provider;

export const useServices = (): Services => useContext(ServicesContext);
