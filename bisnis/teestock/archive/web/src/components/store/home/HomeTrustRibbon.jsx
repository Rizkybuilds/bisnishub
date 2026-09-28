import React from 'react';
import { ShieldCheck, Flame, Truck, RotateCcw } from 'lucide-react';

export function HomeTrustRibbon() {
  const trustFeatures = [
    {
      icon: ShieldCheck,
      badge: 'GARMEN RESMI',
      title: '100% NSA Original Cititex',
      desc: 'Katun ringspun murni tanpa jahitan samping (tubular knit). Bebas bahan oplosan.',
      accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Flame,
      badge: 'STANDAR STUDIO',
      title: '155°C Dual-Heat Press',
      desc: 'Dipress dua kali dengan tekanan 4 bar. Sablon elastis, anti-pecah, dan tahan cuci berkali-kali.',
      accent: 'text-ts-terracotta bg-ts-terracotta/10 border-ts-terracotta/20'
    },
    {
      icon: Truck,
      badge: 'PENGIRIMAN CEPAT',
      title: 'Dispatch H+0 / H+1 Depok',
      desc: 'Packing polymailer matte doff tahan air + free 2x limited vinyl stickers di setiap paket.',
      accent: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20'
    },
    {
      icon: RotateCcw,
      badge: 'BEBAS KHAWATIR',
      title: 'Garansi Retur 100%',
      desc: 'Ada cacat sablon atau salah ukuran? Kami ganti baru tanpa birokrasi berbelit.',
      accent: 'text-ts-mustard bg-ts-mustard/10 border-ts-mustard/20'
    }
  ];

  return (
    <section aria-label="Jaminan Kualitas dan Layanan TeeStock" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {trustFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 sm:p-5 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-terracotta/30 transition-all shadow-sm hover:shadow-elevation flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${item.accent}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.accent}`}>
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-ts-krem tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-ts-kremMuted mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
