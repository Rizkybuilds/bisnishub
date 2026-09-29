import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '@bisnishub/shared/context/ThemeContext';
import { AuthProvider } from '@bisnishub/shared/context/AuthContext';
import { StoreProvider } from '@bisnishub/shared/context/StoreContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <RouterProvider router={router} />
            <CookieConsentBanner />
            <SpeedInsights />
            <Analytics />
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

