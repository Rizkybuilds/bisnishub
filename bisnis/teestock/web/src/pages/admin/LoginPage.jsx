import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const { isAuthenticated, loading, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  // Sudah login → redirect ke admin
  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg('Masukkan email admin kamu');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    const { error } = await signInWithMagicLink(email.trim());

    if (error) {
      setErrorMsg(error.message || 'Gagal mengirim magic link. Coba lagi.');
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ts-hitam flex items-center justify-center">
        <div className="animate-pulse text-ts-kremMuted text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ts-hitam flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ts-krem tracking-tight">
            TeeStock
          </h1>
          <p className="text-ts-kremMuted text-sm mt-1">Admin Hub</p>
        </div>

        {/* Login Card */}
        <div className="bg-ts-surface border border-ts-border rounded-xl p-6">
          {status === 'sent' ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📧</div>
              <h2 className="text-lg font-semibold text-ts-krem mb-2">
                Cek Email Kamu
              </h2>
              <p className="text-ts-kremMuted text-sm leading-relaxed">
                Magic link sudah dikirim ke{' '}
                <span className="text-ts-krem font-medium">{email}</span>.
                <br />
                Klik link di email untuk masuk ke Admin Hub.
              </p>
              <button
                onClick={() => { setStatus('idle'); setEmail(''); }}
                className="mt-5 text-sm text-ts-kremMuted hover:text-ts-krem underline underline-offset-2 transition-colors"
              >
                Kirim ulang / ganti email
              </button>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ts-kremMuted mb-1.5"
                >
                  Email Admin
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@teestock.id"
                  autoComplete="email"
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg bg-ts-hitam border border-ts-border text-ts-krem placeholder:text-ts-muted text-sm focus:outline-none focus:ring-2 focus:ring-ts-mustard/50 focus:border-ts-mustard transition-all"
                />
              </div>

              {status === 'error' && errorMsg && (
                <div className="text-xs text-ts-red bg-ts-red/10 border border-ts-red/20 rounded-lg px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-2.5 rounded-lg bg-ts-mustard text-ts-hitam font-semibold text-sm hover:bg-ts-mustard/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-ts-hitam/30 border-t-ts-hitam rounded-full animate-spin" />
                    Mengirim...
                  </span>
                ) : (
                  'Kirim Magic Link'
                )}
              </button>

              <p className="text-xs text-ts-muted text-center leading-relaxed">
                Login tanpa password — cukup klik link yang dikirim ke email kamu.
              </p>
            </form>
          )}
        </div>

        {/* Back to Store */}
        <div className="text-center mt-5">
          <a
            href="/"
            className="text-xs text-ts-kremMuted hover:text-ts-krem transition-colors"
          >
            ← Kembali ke Toko
          </a>
        </div>
      </div>
    </div>
  );
}
