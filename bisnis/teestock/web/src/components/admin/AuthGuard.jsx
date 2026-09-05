import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AuthGuard — Wrapper untuk route admin yang membutuhkan autentikasi.
 * Jika user belum login → redirect ke /admin/login.
 * Jika sedang loading (cek session) → tampilkan loading spinner.
 */
export function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ts-hitam flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-6 h-6 border-2 border-ts-kremMuted/30 border-t-ts-kremMuted rounded-full animate-spin mb-3" />
          <p className="text-ts-kremMuted text-sm">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simpan intended URL agar bisa redirect kembali setelah login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
