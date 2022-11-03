import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';

import { Error, Root, AddLibrary, SearchLibrary } from '@pages';
import { Layout } from '@components';

import { App } from './App';

import './index.scss';

const root = document.getElementById('root')!;
const queryClient = new QueryClient();

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

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
