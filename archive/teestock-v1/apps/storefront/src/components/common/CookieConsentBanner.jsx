import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'teestock_cookie_consent';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (consent === 'granted') {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
          });
        }
      } else if (!consent) {
        // Belum ada preferensi, tampilkan banner setelah jeda halus
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (_) {
      // localStorage mungkin diblokir di privacy mode browser tertentu
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'granted');
    } catch (_) {}

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'denied');
    } catch (_) {}

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Persetujuan Cookie dan Privasi"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-ts-surface/95 backdrop-blur-md border border-ts-border rounded-md shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-ts-terracotta/10 text-ts-terracotta flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h4 className="font-heading font-semibold text-xs tracking-tight text-ts-krem">
              Privasi & Cookie Analitik
            </h4>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-ts-teal/10 text-ts-teal border border-ts-teal/20">
              <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> GA4 Safe
            </span>
          </div>
          <p className="text-[11px] text-ts-kremMuted leading-relaxed">
            Kami menggunakan cookie analitik anonim untuk mengukur performa web dan meningkatkan kenyamanan belanja katalog & custom sablon Anda.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="px-3 py-1.5 bg-ts-terracotta hover:bg-ts-terracottaHover text-white text-[11px] font-medium rounded-sm transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-ts-terracotta"
            >
              Setujui Semua
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="px-3 py-1.5 bg-ts-surface hover:bg-ts-surfaceHover border border-ts-border hover:border-ts-borderHover text-ts-kremMuted text-[11px] font-medium rounded-sm transition-colors focus:outline-none"
            >
              Hanya Esensial
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Tutup banner cookie"
          className="text-ts-kremMuted hover:text-ts-krem p-1 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
