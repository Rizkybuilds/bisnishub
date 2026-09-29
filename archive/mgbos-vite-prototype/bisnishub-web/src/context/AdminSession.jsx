import React, { useEffect } from 'react';
import { useAuth } from '@bisnishub/shared/context/AuthContext';
import { StoreProvider } from '@bisnishub/shared/context/StoreContext';
import { AdminProvider } from './AdminContext';

export function AdminSession({ children }) {
  const { signOut } = useAuth();
  useEffect(() => {
    localStorage.removeItem('bisnishub_founder_session_v1');
    const lock = () => { void signOut(); };
    window.addEventListener('bisnishub_lock_os', lock);
    return () => window.removeEventListener('bisnishub_lock_os', lock);
  }, [signOut]);
  return <StoreProvider><AdminProvider>{children}</AdminProvider></StoreProvider>;
}
