import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Download,
  Info
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { Button } from '../ui/Button';

export function QrisPaymentBox({ 
  orderId, 
  customerName, 
  phone, 
  baseTotal, 
  uniqueCode, 
  totalTransfer, 
  merchantName = 'TeeStock Apparel',
  nmid = 'ID102609070001',
  waUrl 
}) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  // 2-Hour Payment Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(String(totalTransfer)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 text-left">
      {/* Timer & Expiry Alert */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-ts-mustard/15 border border-ts-mustard/30 text-xs text-ts-mustard">
        <div className="flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-ts-mustard animate-pulse" />
          <span>Selesaikan pembayaran dalam:</span>
        </div>
        <span className="font-mono font-bold text-sm tracking-widest text-white px-2 py-0.5 rounded-lg bg-ts-hitam/60 border border-white/10">
          {formatTimer(timeLeft)}
        </span>
      </div>

      {/* Main QRIS Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-gray-900 border border-gray-200 relative overflow-hidden">
        {/* Top Header: Official QRIS Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-red-600 font-sans">QRIS</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                Standar Nasional
              </span>
            </div>
            <div className="text-[10px] font-semibold text-gray-500 mt-0.5">
              Pembayaran Digital Indonesia (ASPI / BI)
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-black text-gray-900 tracking-wider uppercase block">GPN</span>
            <span className="text-[9px] text-gray-500 font-mono">NMID: {nmid}</span>
          </div>
        </div>

        {/* Merchant Identity */}
        <div className="text-center py-4 space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Merchant Resmi:</div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 uppercase font-mono">
            {merchantName}
          </h3>
          <p className="text-[11px] text-gray-500 font-medium">
            Order ID: <strong className="font-mono text-gray-800">{orderId}</strong> • Pemesan: <strong>{customerName}</strong>
          </p>
        </div>

        {/* Crisp Authentic QRIS Visual */}
        <div className="relative flex justify-center py-2">
          <div className="relative p-4 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-inner flex flex-col items-center">
            {/* SVG Representation of QRIS Pattern */}
            <svg 
              className="w-52 h-52 sm:w-60 sm:h-60" 
              viewBox="0 0 200 200" 
              fill="currentColor"
            >
              {/* Corner 1: Top-Left Finder */}
              <rect x="10" y="10" width="50" height="50" fill="#111827" rx="8" />
              <rect x="18" y="18" width="34" height="34" fill="#ffffff" rx="4" />
              <rect x="26" y="26" width="18" height="18" fill="#111827" rx="3" />

              {/* Corner 2: Top-Right Finder */}
              <rect x="140" y="10" width="50" height="50" fill="#111827" rx="8" />
              <rect x="148" y="18" width="34" height="34" fill="#ffffff" rx="4" />
              <rect x="156" y="26" width="18" height="18" fill="#111827" rx="3" />

              {/* Corner 3: Bottom-Left Finder */}
              <rect x="10" y="140" width="50" height="50" fill="#111827" rx="8" />
              <rect x="18" y="148" width="34" height="34" fill="#ffffff" rx="4" />
              <rect x="26" y="156" width="18" height="18" fill="#111827" rx="3" />

              {/* Decorative Authentic Data Cells */}
              <rect x="70" y="15" width="8" height="8" fill="#111827" />
              <rect x="85" y="15" width="8" height="8" fill="#111827" />
              <rect x="100" y="15" width="12" height="8" fill="#111827" />
              <rect x="120" y="15" width="8" height="8" fill="#111827" />

              <rect x="70" y="30" width="16" height="8" fill="#111827" />
              <rect x="95" y="30" width="8" height="8" fill="#111827" />
              <rect x="110" y="30" width="16" height="8" fill="#111827" />

              <rect x="70" y="45" width="8" height="12" fill="#111827" />
              <rect x="85" y="50" width="14" height="8" fill="#111827" />
              <rect x="115" y="45" width="8" height="12" fill="#111827" />

              {/* Middle Section Data */}
              <rect x="15" y="70" width="8" height="16" fill="#111827" />
              <rect x="30" y="75" width="14" height="8" fill="#111827" />
              <rect x="50" y="70" width="8" height="16" fill="#111827" />

              <rect x="70" y="70" width="12" height="12" fill="#111827" />
              <rect x="120" y="70" width="12" height="12" fill="#111827" />

              <rect x="145" y="70" width="8" height="16" fill="#111827" />
              <rect x="160" y="75" width="14" height="8" fill="#111827" />
              <rect x="180" y="70" width="8" height="16" fill="#111827" />

              {/* Center Logo Cutout */}
              <rect x="75" y="75" width="50" height="50" fill="#ffffff" rx="10" />
              <rect x="78" y="78" width="44" height="44" fill="#b84220" rx="8" />
              <text x="100" y="104" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">TS</text>

              {/* Lower Section Data */}
              <rect x="70" y="135" width="14" height="8" fill="#111827" />
              <rect x="90" y="140" width="8" height="14" fill="#111827" />
              <rect x="105" y="135" width="14" height="8" fill="#111827" />
              <rect x="125" y="140" width="8" height="14" fill="#111827" />

              <rect x="145" y="135" width="16" height="8" fill="#111827" />
              <rect x="170" y="135" width="15" height="8" fill="#111827" />
              <rect x="145" y="150" width="8" height="14" fill="#111827" />
              <rect x="160" y="155" width="14" height="8" fill="#111827" />
              <rect x="180" y="150" width="8" height="14" fill="#111827" />

              <rect x="70" y="160" width="8" height="25" fill="#111827" />
              <rect x="85" y="165" width="14" height="8" fill="#111827" />
              <rect x="105" y="160" width="8" height="25" fill="#111827" />
              <rect x="120" y="165" width="14" height="8" fill="#111827" />

              <rect x="145" y="175" width="40" height="12" fill="#111827" />
            </svg>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dukungan Seluruh E-Wallet &amp; Mobile Banking</span>
            </div>
          </div>
        </div>

        {/* Accepted Payment Logos Bar */}
        <div className="pt-3 pb-1 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-500 font-semibold">
          <span className="px-2 py-0.5 rounded bg-gray-100">BCA</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">Mandiri</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">BRI</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">BNI</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">BSI</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">GoPay</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">OVO</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">DANA</span>
          <span className="px-2 py-0.5 rounded bg-gray-100">ShopeePay</span>
        </div>
      </div>

      {/* HIGHLIGHT: EXACT TRANSFER AMOUNT CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-ts-surface/90 backdrop-blur-xl border-2 border-ts-green/40 shadow-glow-teal space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-ts-kremMuted uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
              <span>Nominal Transfer Persis (Wajib Sesuai)</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl sm:text-3xl font-black text-ts-green tracking-tight">
                {formatRupiah(totalTransfer)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyNominal}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              copied 
                ? 'bg-ts-green text-ts-hitam font-extrabold'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Nominal Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Nominal</span>
              </>
            )}
          </button>
        </div>

        {/* 3-Digit Breakdown Chip */}
        <div className="p-3 rounded-2xl bg-ts-hitam/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-ts-kremMuted flex items-center gap-1.5">
            <span>Tagihan: <strong className="text-white">{formatRupiah(baseTotal)}</strong></span>
            <span>+</span>
            <span className="flex items-center gap-1 font-bold text-ts-mustard">
              Kode Unik:
              <span className="font-mono bg-ts-mustard/20 px-1.5 py-0.5 rounded border border-ts-mustard/40 text-white font-extrabold">
                +{uniqueCode}
              </span>
            </span>
          </div>
          <div className="text-[11px] text-ts-green font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Verifikasi Otomatis via Kode Unik</span>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300 font-bold">PENTING:</strong> Mohon transfer <strong>PERSIS sejumlah {formatRupiah(totalTransfer)}</strong> (jangan dibulatkan). Tiga digit terakhir (<strong className="font-mono text-white">{uniqueCode}</strong>) adalah tanda pengenal pesanan Anda agar terverifikasi otomatis.
          </p>
        </div>
      </div>

      {/* Confirmation Button via WhatsApp */}
      <div className="space-y-3 pt-2">
        <a href={waUrl} target="_blank" rel="noreferrer" className="block w-full">
          <Button size="lg" variant="whatsapp" icon={MessageSquare} className="w-full py-4 text-sm font-extrabold shadow-glow-teal">
            Saya Sudah Bayar — Kirim Bukti Transfer ke WA
          </Button>
        </a>
        <p className="text-[11px] text-center text-ts-muted">
          Admin kami akan langsung memvalidasi mutasi pembayaran dan memasukkan kaos Anda ke antrean cetak sablon.
        </p>
      </div>
    </div>
  );
}
