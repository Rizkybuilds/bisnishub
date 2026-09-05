import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { StoreProvider } from './context/StoreContext';

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <StoreProvider>
          <RouterProvider router={router} />
        </StoreProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
