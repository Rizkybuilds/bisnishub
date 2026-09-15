import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeeStockLogoIcon } from '../common/TeeStockLogo';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithMagicLink, authModalRedirect } = useAuth();
  const [email, setEmail] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMagic, setLoadingMagic] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setErrorMsg('');
    const redirectUrl = authModalRedirect || window.location.href;
    const { error } = await signInWithGoogle(redirectUrl);
    if (error) {
      const msg = error.message || '';
      if (msg.includes('provider is not enabled') || msg.includes('Unsupported provider') || msg.includes('validation_failed')) {
        setErrorMsg('Login Google belum diaktifkan di dashboard Supabase. Silakan masukkan email kamu di bawah untuk masuk instan via Magic Link tanpa password.');
      } else {
        setErrorMsg(msg || 'Gagal login via Google. Silakan coba lagi.');
      }
      setLoadingGoogle(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }

    setLoadingMagic(true);
    setErrorMsg('');
    const redirectUrl = authModalRedirect || window.location.href;
    const { error } = await signInWithMagicLink(email.trim(), redirectUrl);
    setLoadingMagic(false);

    if (error) {
      setErrorMsg(error.message || 'Gagal mengirim magic link. Silakan coba lagi.');
    } else {
      setMagicSent(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md rounded-3xl bg-ts-surface border border-ts-border p-6 sm:p-8 shadow-2xl shadow-black/20 dark:shadow-black/80 text-ts-krem space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-ts-muted hover:text-ts-krem hover:bg-ts-hitam/10 transition-colors cursor-pointer"
          aria-label="Tutup dialog autentikasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ts-terracotta to-[#9E3B1B] flex items-center justify-center mx-auto shadow-glow-terracotta border border-ts-border">
            <TeeStockLogoIcon className="w-7 h-7 text-white drop-shadow-sm" />
          </div>
          <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-black text-ts-krem tracking-tight">
            Akun Member TeeStock
          </h3>
          <p className="text-xs text-ts-muted leading-relaxed">
            Satu akun untuk lacak pesanan, simpan alamat pengiriman, dan nikmati diskon khusus member &amp; mitra.
          </p>
        </div>

        {/* Status / Error */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 dark:text-red-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {magicSent ? (
          /* Magic Link Sent State */
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-ts-krem">Cek Email Kamu</h4>
            <p className="text-xs text-ts-muted leading-relaxed">
              Tautan masuk telah dikirim ke <strong className="text-ts-krem">{email}</strong>.
              Klik tautan di email untuk langsung masuk tanpa perlu mengingat password!
            </p>
            <button
              onClick={() => { setMagicSent(false); setEmail(''); }}
              className="text-xs text-ts-terracotta hover:underline pt-2"
            >
              Gunakan email lain
            </button>
          </div>
        ) : (
          /* Normal Auth State */
          <div className="space-y-4">
            {/* 1. Google OAuth (Primary / Frictionless) */}
            <button
              onClick={handleGoogleLogin}
              disabled={loadingGoogle || loadingMagic}
              className="w-full py-3 px-4 rounded-xl bg-ts-krem hover:bg-white text-ts-hitam font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all border border-ts-border shadow-sm active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {loadingGoogle ? (
                <Loader2 className="w-4 h-4 animate-spin text-ts-hitam" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Lanjut dengan Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-ts-muted">
              <span className="flex-1 h-px bg-ts-border" />
              <span className="font-mono text-[10px] uppercase">atau via email</span>
              <span className="flex-1 h-px bg-ts-border" />
            </div>

            {/* 2. Magic Link Email */}
            <form onSubmit={handleMagicLink} className="space-y-2.5">
              <div className="relative">
                <Mail className="w-4 h-4 text-ts-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  aria-label="Alamat email untuk masuk"
                  disabled={loadingGoogle || loadingMagic}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ts-krem placeholder-ts-muted focus:outline-none focus:border-ts-terracotta focus:ring-1 focus:ring-ts-terracotta transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loadingGoogle || loadingMagic}
                className="w-full py-2.5 px-4 rounded-xl bg-ts-surface hover:bg-ts-border border border-ts-border text-ts-krem font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loadingMagic ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Kirim Magic Link Masuk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Benefits Micro Bar */}
        <div className="pt-2 border-t border-ts-border grid grid-cols-2 gap-2 text-[11px] text-ts-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-ts-green shrink-0" />
            <span>Riwayat pesanan tersimpan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-ts-green shrink-0" />
            <span>Alamat checkout otomatis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
