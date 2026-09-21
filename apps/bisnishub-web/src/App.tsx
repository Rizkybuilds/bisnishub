import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '@bisnishub/shared/context/ThemeContext';
import { AuthProvider, useAuth } from '@bisnishub/shared/context/AuthContext';
import { StoreProvider } from '@bisnishub/shared/context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import { PinLock } from './components/PinLock';

const AUTH_STORAGE_KEY = 'bisnishub_founder_session_v1';

function AppContent() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
            return true;
          }
        } catch {
          // invalid token
        }
      }
    }
    return false;
  });

  // Automatically unlock if verified as Admin via Supabase Google OAuth
  useEffect(() => {
    if (!loading && user && isAdmin) {
      setIsUnlocked(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        unlockedBy: user.email,
        authType: 'google_oauth',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 hari
      }));
    }
  }, [user, isAdmin, loading]);

  const handleUnlock = (authInfo?: { method: string; identifier?: string }) => {
    setIsUnlocked(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      unlockedBy: authInfo?.identifier || 'founder_master_pin',
      authType: authInfo?.method || 'pin',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 hari
    }));
  };

  const handleLock = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsUnlocked(false);
    if (user) {
      signOut();
    }
  };

  // Dengarkan event kunci layar dari sidebar atau topbar
  useEffect(() => {
    const onLockEvent = () => handleLock();
    window.addEventListener('bisnishub_lock_os', onLockEvent);
    return () => window.removeEventListener('bisnishub_lock_os', onLockEvent);
  }, [user]);

  if (!isUnlocked) {
    return <PinLock onUnlock={handleUnlock} />;
  }

  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <AdminProvider>
            <AppContent />
          </AdminProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
