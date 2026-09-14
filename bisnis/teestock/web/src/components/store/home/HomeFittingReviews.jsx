import React from 'react';
import { Star } from 'lucide-react';

export function HomeFittingReviews() {
  const reviews = [
    {
      id: 1,
      quote: "Kain NSA 24s Heavyweight-nya terasa mantap dan berbobot tanpa bikin gerah. Sablon raster di kaos 'Raw Identity' sangat detail dan tidak terasa kaku seperti sablon karet tebal.",
      author: "Dimas P.",
      meta: "TB 174 cm / BB 70 kg • Size L",
      badge: "Verified",
      badgeColor: "text-ts-green bg-ts-green/10 border-ts-green/20"
    },
    {
      id: 2,
      quote: "Order 12 pcs custom untuk merch band. Hasil presisi di sablon A3, warna gradasi abu-abu keluar sempurna, dan kemasan polymailer-nya sangat rapi.",
      author: "Rian H.",
      meta: "Merch Project • Size M & L",
      badge: "Studio Collab",
      badgeColor: "text-ts-teal bg-ts-teal/10 border-ts-teal/20"
    },
    {
      id: 3,
      quote: "Kerah rib 2.2 cm di NSA 7200 kencang dan tidak letoy. Pengiriman cepat H+1 langsung dikirim resinya via WA tanpa harus ditanya berulang kali.",
      author: "Andi S.",
      meta: "TB 180 cm / BB 78 kg • Size XL",
      badge: "Verified",
      badgeColor: "text-ts-green bg-ts-green/10 border-ts-green/20"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-5 sm:space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
            <span>VERIFIED FIT // FITTING NOTES &amp; PEMAKAIAN NYATA</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-ts-krem tracking-tight uppercase">
            Catatan Fitting &amp; Uji Pemakaian Nyata
          </h3>
          <p className="text-xs text-ts-kremMuted max-w-lg mx-auto leading-relaxed">
            Feedback langsung dari pelanggan terverifikasi mengenai kenyamanan bahan katun NSA, akurasi ukuran, dan ketahanan sablon studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="p-4 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-3.5 sm:space-y-4 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-ts-krem leading-relaxed">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-ts-border flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-ts-krem font-medium">{rev.author}</strong>
                  <span className="text-[10px] text-ts-muted font-mono">{rev.meta}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${rev.badgeColor}`}>
                  {rev.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
