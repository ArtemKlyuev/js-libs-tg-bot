import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { AxiosHttpRequest } from 'common/services';

import { Error, Root, AddLibrary, SearchLibrary } from '@pages';
import { Layout } from '@components';
import { ServicesProvider } from '@hooks';

import { App } from './App';

import './index.scss';

const root = document.getElementById('root')!;
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
  },
  {
    path: '/library',
    children: [
      {
        path: 'add',
        element: (
          <Layout title="Добавление библиотеки">
            <AddLibrary />
          </Layout>
        ),
      },
      {
        path: 'search',
        element: (
          <Layout title="Поиск библиотеки">
            <SearchLibrary />
          </Layout>
        ),
      },
    ],
  },
]);

const services = {
  httpRequest: new AxiosHttpRequest({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  }),
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
