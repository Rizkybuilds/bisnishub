import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <RouterProvider router={router} />
            <CookieConsentBanner />
            <SpeedInsights />
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

