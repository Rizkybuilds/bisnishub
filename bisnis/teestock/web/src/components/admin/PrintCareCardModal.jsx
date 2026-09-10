import React, { useState } from 'react';
import { X, Printer, ShieldCheck, Sparkles, Heart, RefreshCw, QrCode, Tag } from 'lucide-react';

export function PrintCareCardModal({ isOpen, onClose }) {
  const [activeSide, setActiveSide] = useState('both'); // 'front', 'back', 'both'

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Dialog */}
      <div className="bg-ts-surface border border-ts-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 print:m-0 print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Header - Hidden on Print */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ts-borderDim bg-ts-hitam/60 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ts-krem">Unboxing Thank You & Care Card (A6 Insert)</h2>
              <p className="text-xs text-ts-muted">Selipkan di setiap polymailer paket kaos untuk mencegah komplain sablon dan dorong repeat order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ts-muted hover:text-white hover:bg-ts-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar - Hidden on Print */}
        <div className="px-6 py-3 bg-ts-hitam/30 border-b border-ts-borderDim flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ts-muted mr-1">Tampilan:</span>
            <button
              onClick={() => setActiveSide('both')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSide === 'both' ? 'bg-ts-terracotta text-white font-bold' : 'bg-ts-hitam/50 text-ts-muted hover:text-white'
              }`}
            >
              Kedua Sisi (Depan & Belakang)
            </button>
            <button
              onClick={() => setActiveSide('front')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSide === 'front' ? 'bg-ts-terracotta text-white font-bold' : 'bg-ts-hitam/50 text-ts-muted hover:text-white'
              }`}
            >
              Hanya Depan (Thank You)
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSide === 'back' ? 'bg-ts-terracotta text-white font-bold' : 'bg-ts-hitam/50 text-ts-muted hover:text-white'
              }`}
            >
              Hanya Belakang (Care Guide)
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-ts-terracotta hover:bg-ts-terracotta/90 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu A6 (Print)</span>
          </button>
        </div>

        {/* Card Canvas Container */}
        <div className="p-6 sm:p-8 bg-neutral-900/50 flex flex-wrap gap-6 justify-center items-start print:p-0 print:bg-white print:m-0">
          
          {/* ==================================================== */}
          {/* SISI DEPAN: THANK YOU & VIP REORDER VOUCHER          */}
          {/* ==================================================== */}
          {(activeSide === 'both' || activeSide === 'front') && (
            <div className="w-[105mm] min-h-[148mm] bg-[#121212] text-[#F3EFE0] p-6 rounded-2xl border border-white/20 shadow-xl flex flex-col justify-between relative overflow-hidden print:w-[105mm] print:h-[148mm] print:border print:border-neutral-300 print:shadow-none print:rounded-none print:bg-[#121212] print:text-white print:break-inside-avoid">
              
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D96B43]/30 via-transparent to-transparent rounded-bl-full pointer-events-none" />

              {/* Brand Top */}
              <div className="space-y-1 relative z-10 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-black tracking-widest text-[#D96B43] uppercase">TEESTOCK APPAREL</span>
                  <span className="text-[9px] font-mono text-white/50 tracking-wider">NSA × DTF HD</span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mt-2">
                  Thank You for Supporting Local!
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Kaos ini dipres secara in-house dengan dedikasi tinggi menggunakan bahan katun <strong className="text-white">New States Apparel</strong> original dan teknologi sablon DTF HD.
                </p>
              </div>

              {/* VIP Voucher Box */}
              <div className="my-4 bg-white/5 border border-dashed border-[#D96B43]/60 rounded-xl p-4 text-center space-y-2 relative z-10">
                <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-[#E5A93C] tracking-wider">
                  <Tag className="w-3 h-3" />
                  <span>Hadiah Khusus Pembeli Pertama</span>
                </div>
                <div className="font-mono text-lg font-black tracking-widest text-white bg-black/60 py-1.5 px-3 rounded-lg border border-white/10 inline-block">
                  REPEATVIP
                </div>
                <p className="text-[10px] text-white/70">
                  Gunakan kode di atas untuk <strong className="text-[#E5A93C]">Diskon 15%</strong> pada pembelian berikutnya di website resmi kami:
                </p>
                <p className="font-mono text-[10px] font-bold text-white/90">
                  teestockapparel.vercel.app
                </p>
              </div>

              {/* Founder Note & Guarantee Bottom */}
              <div className="space-y-2 border-t border-white/10 pt-3 relative z-10">
                <div className="flex items-center justify-between text-[10px] text-white/60">
                  <span className="flex items-center gap-1 text-[#25D366]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" /> Garansi 100% Cacat Pabrik
                  </span>
                  <span className="font-mono">IG: @teestock.apparel</span>
                </div>
                <p className="text-[9px] text-white/40 text-center italic">
                  "Kualitas terbaik berawal dari rasa bangga memakai karya anak bangsa."
                </p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SISI BELAKANG: PETUNJUK PERAWATAN SABLON DTF        */}
          {/* ==================================================== */}
          {(activeSide === 'both' || activeSide === 'back') && (
            <div className="w-[105mm] min-h-[148mm] bg-[#FDFBF7] text-[#1A1A1A] p-6 rounded-2xl border border-neutral-300 shadow-xl flex flex-col justify-between relative overflow-hidden print:w-[105mm] print:h-[148mm] print:border print:border-neutral-400 print:shadow-none print:rounded-none print:bg-white print:text-black print:break-inside-avoid">
              
              {/* Header */}
              <div className="border-b border-neutral-200 pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#D96B43]">CARE GUIDE</span>
                  <span className="text-[9px] font-bold text-neutral-400">PETUNJUK CUCI</span>
                </div>
                <h4 className="text-base font-black uppercase text-neutral-900 tracking-tight">
                  Cara Merawat Kaos & Sablon DTF
                </h4>
                <p className="text-[10px] text-neutral-600">
                  Ikuti 4 panduan mudah ini agar sablon DTF tetap lentur, tajam, dan tidak retak hingga bertahun-tahun:
                </p>
              </div>

              {/* 4 Golden Rules */}
              <div className="space-y-2.5 my-3 text-[11px]">
                
                {/* Rule 1: Balik Kaos */}
                <div className="flex items-start gap-2.5 bg-neutral-100 p-2.5 rounded-xl border border-neutral-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#D96B43]/15 text-[#D96B43] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-bold text-[11px]">Balik Kaos Saat Dicuci & Dijemur</strong>
                    <span className="text-[10px] text-neutral-600 leading-tight block">
                      Pastikan posisi sablon berada di bagian dalam untuk melindungi permukaan sablon dari gesekan mesin cuci.
                    </span>
                  </div>
                </div>

                {/* Rule 2: CRITICAL - JANGAN SETRIKA LANGSUNG */}
                <div className="flex items-start gap-2.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    !
                  </div>
                  <div>
                    <strong className="block text-red-700 font-extrabold text-[11px]">JANGAN MENYETRIKA LANGSUNG SABLON!</strong>
                    <span className="text-[10px] text-red-600 leading-tight block">
                      Panas setrika langsung akan melelehkan sablon. Setrikalah dari <strong>sisi dalam kaos</strong> atau lapisi kain di atasnya.
                    </span>
                  </div>
                </div>

                {/* Rule 3: Suhu Air & Pemutih */}
                <div className="flex items-start gap-2.5 bg-neutral-100 p-2.5 rounded-xl border border-neutral-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#D96B43]/15 text-[#D96B43] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-bold text-[11px]">Gunakan Air Dingin / Suhu Ruang</strong>
                    <span className="text-[10px] text-neutral-600 leading-tight block">
                      Hindari air panas berlebih dan <em>jangan gunakan pemutih klorin</em> agar warna kain katun NSA tetap pekat.
                    </span>
                  </div>
                </div>

                {/* Rule 4: Keringkan Alami */}
                <div className="flex items-start gap-2.5 bg-neutral-100 p-2.5 rounded-xl border border-neutral-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#D96B43]/15 text-[#D96B43] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-bold text-[11px]">Jemur di Tempat Teduh / Berangin</strong>
                    <span className="text-[10px] text-neutral-600 leading-tight block">
                      Hindari sinar matahari terik ekstrem langsung ke permukaan sablon saat kondisi basah.
                    </span>
                  </div>
                </div>

              </div>

              {/* Resolution & CS Footer */}
              <div className="border-t border-neutral-200 pt-2.5 flex items-center justify-between text-[10px] text-neutral-500">
                <div className="flex items-center gap-1 text-neutral-700 font-semibold">
                  <span>Ada kendala paket?</span>
                  <span className="text-[#D96B43] font-bold">WA: 0852-2027-4968</span>
                </div>
                <span className="font-mono text-[9px] text-neutral-400">TeeStock Quality Assured</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Note - Hidden on Print */}
        <div className="px-6 py-3 bg-ts-hitam/40 border-t border-ts-borderDim flex items-center justify-between text-xs text-ts-muted print:hidden">
          <span>💡 Tips: Gunakan kertas Art Carton 210-260 gsm untuk hasil cetak premium.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem text-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
