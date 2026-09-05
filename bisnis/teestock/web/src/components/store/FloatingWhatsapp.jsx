import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function FloatingWhatsapp() {
  const { storeSettings } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const rawPhone = storeSettings?.storeWhatsapp || '081280000581';
  const cleanPhone = sanitizePhoneNumber(rawPhone);
  const defaultMessage = "Halo TeeStock! Mau tanya info kaos polos New States Apparel (NSA) & konsultasi pemesanan.";
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-2">
      {/* Pop-up Mini Banner / Tooltip (can be dismissed) */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-ts-surface/95 backdrop-blur border border-ts-border px-3.5 py-2 rounded-2xl shadow-xl animate-in slide-in-from-right-4 duration-300">
          <div className="text-left">
            <div className="text-[11px] font-bold text-ts-krem flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Customer Care TeeStock</span>
            </div>
            <div className="text-[10px] text-ts-muted">Konsultasi ukuran &amp; stok NSA</div>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="p-1 rounded-full text-ts-muted hover:text-ts-krem ml-1"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp TeeStock"
        className="relative group flex items-center justify-center w-13 h-13 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all"
      >
        {/* Radar ping effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        
        <MessageCircle className="w-6 h-6 fill-current relative z-10" />
      </a>
    </div>
  );
}
