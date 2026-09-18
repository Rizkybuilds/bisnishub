import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { subscribeNewsletter } from '../../services/subscribersApi';

export function NewsletterCapture({ source = 'website_footer', className = '', compact = false }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setMessage('Silakan masukkan alamat email yang valid.');
      return;
    }

    setLoading(true);
    setStatus('idle');

    const result = await subscribeNewsletter({
      email: email.trim(),
      source,
    });

    setLoading(false);
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setEmail('');
    } else {
      setStatus('error');
      setMessage(result.error || 'Terjadi kendala. Silakan coba lagi.');
    }
  };

  if (compact) {
    return (
      <div className={className}>
        {status === 'success' ? (
          <div className="p-3.5 rounded-xl bg-ts-green/15 border border-ts-green/30 text-xs text-ts-green flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-ts-green mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-ts-krem">Berhasil Terdaftar!</p>
              <p className="text-[11px] leading-relaxed text-ts-kremMuted">{message}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu..."
                disabled={loading}
                className="w-full bg-ts-surfaceHover/60 border border-ts-border rounded-xl pl-9 pr-24 py-2.5 text-xs text-ts-krem placeholder-ts-muted focus:outline-none focus:border-ts-terracotta focus:ring-1 focus:ring-ts-terracotta transition-all"
              />
              <Mail className="w-4 h-4 text-ts-muted absolute left-3 pointer-events-none" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 px-3 py-1.5 rounded-lg bg-ts-terracotta hover:bg-ts-terracotta/90 text-white font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>Gabung</span>}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-[10px] text-red-500 pl-1">{message}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border shadow-sm relative overflow-hidden transition-colors duration-300 ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ts-terracotta/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surfaceHover border border-ts-border text-ts-terracotta text-[10px] sm:text-xs font-mono font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE ARCHIVE CLUB // PRIVATE ACCESS</span>
        </div>

        <h3 className="text-xl sm:text-3xl font-black text-ts-krem tracking-tight">
          Early Access. Curated Archive. Zero Noise.
        </h3>
        <p className="text-xs sm:text-sm text-ts-kremMuted mt-1.5 sm:mt-2 leading-relaxed">
          Dapatkan akses 24 jam lebih awal sebelum rilisan publik, rilisan desain terkurasi, dan catatan studio in-house langsung ke inbox kamu.
        </p>

        <div className="mt-5 sm:mt-6">
          {status === 'success' ? (
            <div className="p-4 rounded-2xl bg-ts-green/15 border border-ts-green/30 text-xs text-ts-green flex items-start gap-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-ts-green mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-ts-krem">Berhasil Terdaftar di Archive Club!</p>
                <p className="text-xs leading-relaxed text-ts-kremMuted">{message}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-ts-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu..."
                  disabled={loading}
                  className="w-full bg-ts-surfaceHover/60 border border-ts-border rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-ts-krem placeholder-ts-muted focus:outline-none focus:border-ts-terracotta focus:ring-2 focus:ring-ts-terracotta/30 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-ts-terracotta hover:bg-ts-terracotta/90 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0 disabled:opacity-50 font-mono text-center cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Dapatkan Notifikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-xs text-red-500 mt-2 pl-1 font-mono">{message}</p>
          )}

          <p className="text-[10px] text-ts-muted mt-3 flex items-center gap-1.5 font-mono">
            <span>Privasi terjaga. Tanpa spam, berhenti langganan kapan saja.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
