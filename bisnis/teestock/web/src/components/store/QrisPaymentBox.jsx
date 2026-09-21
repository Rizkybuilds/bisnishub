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
  Zap,
  Building2
} from 'lucide-react';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { Button } from '@bisnishub/shared/components/ui/Button';

export function QrisPaymentBox({ 
  orderId, 
  customerName, 
  phone, 
  baseTotal, 
  uniqueCode, 
  totalTransfer, 
  merchantName = 'TeeStock Apparel',
  nmid = 'ID102609070001',
  qrisImageUrl = '',
  bankName = 'BCA',
  bankAccountNo = '',
  bankAccountHolder = 'TeeStock Apparel',
  waUrl 
}) {
  const [copied, setCopied] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
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

  const handleCopyAccount = () => {
    if (!bankAccountNo) return;
    navigator.clipboard.writeText(String(bankAccountNo)).then(() => {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
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
        <span className="font-mono font-bold text-sm tracking-widest text-ts-krem px-2.5 py-0.5 rounded-lg bg-ts-surface border border-ts-border shadow-sm">
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

        {/* Crisp Authentic QRIS Visual or Direct Bank Transfer */}
        {qrisImageUrl ? (
          <div className="relative flex flex-col items-center py-2 space-y-2">
            <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-inner flex flex-col items-center">
              <img
                src={qrisImageUrl}
                alt={`QRIS Resmi ${merchantName}`}
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
              />
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>QRIS Resmi — Scan via BCA / Livin / GoPay / ShopeePay / OVO</span>
              </div>
            </div>
            <a
              href={qrisImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="qris-teestock.jpg"
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh / Buka Barcode Ukuran Penuh</span>
            </a>
          </div>
        ) : (
          <div className="py-2 space-y-3">
            <div className="p-4 sm:p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">
                  Pembayaran QRIS &amp; Transfer Bank
                </h4>
                <p className="text-[11px] text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Transfer persis nominal tagihan di bawah ke rekening resmi kami, atau minta kode barcode QRIS langsung melalui WhatsApp.
                </p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kirim Bukti / Minta Barcode ke WA</span>
              </a>
            </div>
          </div>
        )}

        {/* Bank Account Details if provided */}
        {bankAccountNo && (
          <div className="mt-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Transfer Manual Alternatif:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-mono font-bold text-[10px]">
                Bank {bankName || 'BCA'}
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200">
              <div>
                <div className="text-[10px] text-gray-400 font-semibold uppercase">Nomor Rekening:</div>
                <div className="font-mono text-base sm:text-lg font-black text-gray-950 tracking-wider">
                  {bankAccountNo}
                </div>
                <div className="text-[11px] text-gray-600 font-semibold">
                  a.n. {bankAccountHolder || merchantName}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  copiedAccount 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                }`}
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount ? 'Tersalin!' : 'Salin Rekening'}</span>
              </button>
            </div>
          </div>
        )}

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
                : 'bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border'
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
        <div className="p-3 rounded-2xl bg-ts-surface border border-ts-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-ts-kremMuted flex items-center gap-1.5">
            <span>Tagihan: <strong className="text-ts-krem">{formatRupiah(baseTotal)}</strong></span>
            <span>+</span>
            <span className="flex items-center gap-1 font-bold text-ts-mustard">
              Kode Unik:
              <span className="font-mono bg-ts-mustard/20 px-1.5 py-0.5 rounded border border-ts-mustard/40 text-ts-krem font-extrabold">
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
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-700 dark:text-amber-300 font-bold">PENTING:</strong> Mohon transfer <strong>PERSIS sejumlah {formatRupiah(totalTransfer)}</strong> (jangan dibulatkan). Tiga digit terakhir (<strong className="font-mono text-amber-800 dark:text-white bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">{uniqueCode}</strong>) adalah tanda pengenal pesanan Anda agar terverifikasi otomatis.
          </p>
        </div>
      </div>

      {/* Confirmation Button via WhatsApp */}
      <div className="space-y-2.5 pt-2">
        <a href={waUrl} target="_blank" rel="noreferrer" className="block w-full">
          <Button size="lg" variant="whatsapp" icon={MessageSquare} className="w-full py-4 text-sm font-extrabold shadow-glow-teal">
            Saya Sudah Bayar — Kirim Bukti Transfer ke WA
          </Button>
        </a>
        <div className="p-3 rounded-2xl bg-ts-surface border border-ts-border text-center space-y-1">
          <p className="text-xs font-bold text-ts-green flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Verifikasi Cepat 5–15 Menit (08.00 – 21.00 WIB)</span>
          </p>
          <p className="text-[11px] text-ts-kremMuted leading-relaxed">
            Setelah pembayaran tervalidasi, pesanan langsung masuk antrean produksi (H+0 / H+1) dan tautan live tracking otomatis dikirim ke WhatsApp Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
