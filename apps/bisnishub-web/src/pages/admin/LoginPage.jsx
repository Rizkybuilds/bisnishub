import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@bisnishub/shared/context/AuthContext';
import { AlertCircle, LogOut, ArrowLeft } from 'lucide-react';

export function LoginPage() {
  const { isAuthenticated, isAdmin, user, signOut, loading, signInWithMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  // Sudah login DAN terverifikasi sebagai admin → redirect ke /admin
  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg('Masukkan email admin kamu');
      setStatus('error');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    setStatus('sending');
    setErrorMsg('');

    const { error } = await signInWithMagicLink(cleanEmail);

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
        <div className="animate-pulse text-ts-kremMuted text-sm">Memverifikasi otorisasi...</div>
      </div>
    );
  }

  // 🛡️ Jika user sudah login tapi BUKAN admin (Member biasa), tampilkan halaman pemisah
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-ts-hitam flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-ts-surface border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Bukan Akun Administrator</h2>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Anda sedang masuk menggunakan akun: <br />
              <strong className="text-white font-mono">{user?.email}</strong>
            </p>
            <p className="text-xs text-ts-muted">
              Akun ini terdaftar sebagai Member/Pelanggan biasa dan tidak memiliki izin akses ke Admin Hub TeeStock.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => signOut()}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar &amp; Ganti Akun Admin</span>
            </button>
            <a
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-ts-krem font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Toko</span>
            </a>
          </div>
        </div>
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
              <button type="button" className="w-full rounded-lg border p-3" onClick={async () => {
                try { const { error } = await signInWithGoogle(window.location.origin + '/admin/login'); if (error) throw error; }
                catch (error) { setErrorMsg(error.message); setStatus('error'); }
              }}>Masuk dengan Google</button>
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
