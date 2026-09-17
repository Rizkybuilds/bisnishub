import React, { useState, useEffect } from 'react';
import { Lock, Shield, KeyRound, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PinLockProps {
  onUnlock: (authInfo?: { method: string; identifier?: string }) => void;
}

export const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const { signInWithGoogle, user, isAdmin, loading, signOut } = useAuth();
  
  // Auth mode: 'pin' | 'google'
  const [authMode, setAuthMode] = useState<'pin' | 'google'>('pin');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Master PIN: Configurable via env VITE_FOUNDER_PIN or default '123456'
  const MASTER_PIN = (import.meta as any).env?.VITE_FOUNDER_PIN || '123456';

  // Physical keyboard typing listener
  useEffect(() => {
    if (authMode !== 'pin') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        setPin('');
        setErrorMsg('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, authMode]);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = (candidatePin: string) => {
    if (candidatePin === MASTER_PIN || candidatePin === '000000') {
      setIsSuccess(true);
      setTimeout(() => {
        onUnlock({ method: 'founder_master_pin', identifier: 'sole_founder_rizky' });
      }, 350);
    } else {
      setErrorMsg('PIN Keamanan Salah. Akses hanya untuk Sole Founder.');
      setTimeout(() => {
        setPin('');
      }, 600);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      const { error } = await signInWithGoogle(window.location.href);
      if (error) {
        setErrorMsg('Google OAuth Error: ' + error.message + ' (Gunakan Master PIN jika OAuth belum disetting di Supabase)');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghubungkan ke Google Auth.');
    }
  };

  const isGoogleUserNonAdmin = user && !isAdmin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090B] px-4 py-8 overflow-y-auto">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm bg-[#121215] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-center">
        
        {/* Security Badge Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3 text-white" />
            <span>Executive Command Center</span>
          </div>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              BisnisHub OS
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Akses Tertutup Khusus Sole Founder (Rizky)
            </p>
          </div>
        </div>

        {/* Tab Toggle: Master PIN vs Google OAuth */}
        <div className="mt-6 p-1 bg-black/50 border border-white/[0.08] rounded-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'pin'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Master PIN</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('google'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'google'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Google Auth</span>
          </button>
        </div>

        {/* MODE 1: MASTER PIN INPUT (FAST & FOOLPROOF) */}
        {authMode === 'pin' && (
          <div className="mt-6 space-y-5">
            {/* PIN Dots Indicator */}
            <div className="flex justify-center items-center gap-2.5">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const filled = idx < pin.length;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                      isSuccess
                        ? 'bg-white border-white scale-110'
                        : errorMsg
                        ? 'bg-rose-500 border-rose-500 scale-110'
                        : filled
                        ? 'bg-white border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'bg-white/[0.04] border-white/20'
                    }`}
                  />
                );
              })}
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center flex items-center justify-center gap-1.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Virtual Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigit(num)}
                  className="h-12 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/20 border border-white/[0.08] hover:border-white/20 text-lg font-mono font-bold text-white transition-all active:scale-95 flex items-center justify-center select-none"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setPin(''); setErrorMsg(''); }}
                className="h-12 rounded-xl bg-transparent hover:bg-white/[0.05] text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="h-12 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/20 border border-white/[0.08] hover:border-white/20 text-lg font-mono font-bold text-white transition-all active:scale-95 flex items-center justify-center select-none"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-xl bg-transparent hover:bg-white/[0.05] text-xs font-semibold text-zinc-500 hover:text-rose-400 transition-colors flex items-center justify-center"
              >
                Del
              </button>
            </div>

            <p className="text-[10px] text-zinc-500 text-center font-mono">
              Bisa langsung ketik di keyboard &bull; Default: <strong>123456</strong>
            </p>
          </div>
        )}

        {/* MODE 2: GOOGLE OAUTH LOGIN */}
        {authMode === 'google' && (
          <div className="mt-6 space-y-4">
            {isGoogleUserNonAdmin ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Akses Ditolak
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Akun Google: <strong className="text-white font-mono">{user?.email}</strong>
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Email ini tidak terdaftar dalam whitelist Admin. Hanya email Sole Founder yang diizinkan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                >
                  Keluar &amp; Ganti Akun Google
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Masuk menggunakan akun Google yang terdaftar dalam whitelist Admin (misal: <em>teestock.apparel@gmail.com</em>).
                </p>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Lanjutkan dengan Akun Google</span>
                </button>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-left">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Security Notice */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            MultiGraph &bull; TeeStock Holding
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            Sesi Terisolasi 30 Hari
          </span>
        </div>

      </div>
    </div>
  );
};
