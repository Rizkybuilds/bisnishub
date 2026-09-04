import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AdminProvider } from './context/AdminContext';
import { StoreProvider } from './context/StoreContext';

export default function App() {
  return (
    <AdminProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AdminProvider>
  );
}
