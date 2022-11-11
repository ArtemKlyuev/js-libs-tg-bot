import { lazy } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AxiosHttpRequest } from 'common/services';

import { config } from '@config';
import { Error } from '@pages';
import { Layout } from '@components';
import { ServicesProvider } from '@hooks';
import { LibraryService, LocalStorageService } from '@services';

const SearchLibraryPage = lazy(() =>
  import('./pages/SearchLibrary').then((module) => ({
    default: module.SearchLibrary,
  })),
);

const AddLibraryPage = lazy(() =>
  import('./pages/AddLibrary').then((module) => ({ default: module.AddLibrary })),
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout title="Root" />,
    errorElement: <Error />,
  },
  {
    path: '/library',
    children: [
      {
        path: 'add',
        element: (
          <Layout title="Добавление библиотеки">
            <AddLibraryPage />
          </Layout>
        ),
      },
      {
        path: 'search',
        element: (
          <Layout title="Поиск библиотеки">
            <SearchLibraryPage />
          </Layout>
        ),
      },
    ],
  },
]);

const params = new URLSearchParams(window.location.search);
const id = params.get('id') ?? '0';

const httpRequest = new AxiosHttpRequest({
  baseURL: `${config.env.BACKEND_URL}/api`,
  auth: { username: id, password: config.env.PASSWORD },
});

const libraryService = new LibraryService(httpRequest);
const telegram = window.Telegram.WebApp;

const services = {
  config,
  httpRequest,
  libraryService,
  telegram,
  LocalStorage: LocalStorageService,
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ServicesProvider value={services}>
        <RouterProvider router={router} />
      </ServicesProvider>
    </QueryClientProvider>
  );
};
