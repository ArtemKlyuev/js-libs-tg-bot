import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AxiosHttpRequest } from 'common/services';

import { Error } from '@pages';
import { Layout } from '@components';
import { ServicesProvider } from '@hooks';
import { LibraryService } from '@services';

import { App } from './App';

import './index.scss';

const SearchLibraryPage = lazy(() =>
  import('./pages/SearchLibrary').then((module) => ({
    default: module.SearchLibrary,
  })),
);

const AddLibraryPage = lazy(() =>
  import('./pages/AddLibrary').then((module) => ({ default: module.AddLibrary })),
);

const root = document.getElementById('root')!;
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

const httpRequest = new AxiosHttpRequest({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

const libraryService = new LibraryService(httpRequest);

const services = {
  httpRequest,
  libraryService,
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <ServicesProvider value={services}>
        <RouterProvider router={router} />
      </ServicesProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
