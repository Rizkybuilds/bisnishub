import React from 'react';
import { Package, Sparkles, ShieldCheck, Shirt, CheckCircle2 } from 'lucide-react';

export function UnboxingShowcase() {
  const touchpoints = [
    {
      number: '01',
      icon: Package,
      title: 'Charcoal Matte Doff Polymailer',
      tag: 'KEMASAN LUAR',
      description:
        'Kemasan luar doff tebal, kedap air, dan bertekstur matte mewah. Melindungi garmen dari debu dan air hujan selama perjalanan ekspedisi ke rumah Anda.',
      spec: 'Bahan Doff Tebal • Anti-Sobek • Water Resistant'
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Collector Vinyl Sticker Pack',
      tag: 'BONUS EKSKLUSIF',
      description:
        'Setiap pembelian kaos grafis otomatis disertai 2x stiker vinil die-cut laminasi doff. Tahan air, tidak mudah pudar, siap ditempel di laptop, helm, atau case HP.',
      spec: '2x Die-Cut Vinyl • Doff Lamination • Weatherproof'
    },
    {
      number: '03',
      icon: ShieldCheck,
      title: 'Founder Guarantee & Care Card',
      tag: 'JAMINAN 100%',
      description:
        'Kartu garansi resmi dan instruksi perawatan garmen. Jika terdapat cacat sablon, jahitan rusak, atau ukuran tidak pas, kami ganti baru 100% tanpa ribet.',
      spec: '30 Hari Retur • Direct WhatsApp Studio Resolution'
    },
    {
      number: '04',
      icon: Shirt,
      title: 'Zero-Itch Neck Protocol',
      tag: 'KENYAMANAN MAKSIMAL',
      description:
        'Bebas dari label leher kertas kaku yang menusuk dan bikin gatal. Setiap kaos nyaman dipakai berjam-jam untuk aktivitas harian tanpa iritasi di tengkuk leher.',
      spec: 'Tagless Comfort • Rib Leher 2.2 cm Kokoh'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-widest uppercase bg-ts-surface px-3.5 py-1 rounded-full border border-ts-border">
          <Package className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>THE SENSORY EXPERIENCE // UNBOXING STANDARD</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-ts-krem tracking-tight uppercase">
          Standar Kemasan Setiap Paket
        </h2>
        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
          Kami menolak pengiriman kaos yang dibungkus plastik tipis murahan. Setiap helai dirawat, diperiksa detailnya, dan dikemas rapi layaknya barang bernilai tinggi.
        </p>
      </div>

      {/* Bento Grid 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {touchpoints.map((tp) => {
          const Icon = tp.icon;
          return (
            <div
              key={tp.number}
              className="p-5 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-borderHover shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-terracotta flex items-center justify-center border border-ts-border group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-ts-muted">
                    {tp.number}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold text-ts-terracotta uppercase tracking-wider">
                    {tp.tag}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-ts-krem mt-0.5 leading-snug">
                    {tp.title}
                  </h3>
                </div>

                <p className="text-xs text-ts-kremMuted leading-relaxed">
                  {tp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-ts-border flex items-center gap-1.5 text-[10px] font-mono text-ts-muted">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{tp.spec}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
