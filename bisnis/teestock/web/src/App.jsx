import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <RouterProvider router={router} />
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

