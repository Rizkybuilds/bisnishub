import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, ShieldCheck, Truck, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { NSA_7200_SIZE_CHART, NSA_3600_SIZE_CHART } from '../../../constants/garments';

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-ts-border rounded-2xl overflow-hidden bg-ts-surface">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-ts-surfaceHover transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-xs font-bold text-ts-krem">
          <Icon className="w-4 h-4 text-ts-terracotta shrink-0" />
          <span>{title}</span>
        </div>
        <span className="text-ts-muted text-xs font-mono">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-xs text-ts-kremMuted leading-relaxed border-t border-ts-border">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductSpecsAccordion({
  is3600,
  isBlank,
  selectedSize,
  sizeList,
  onOpenSizeModal
}) {
  return (
    <div className="pt-4 border-t border-ts-border space-y-2">
      {/* Panduan Ukuran */}
      <AccordionItem
        title={`Panduan Ukuran (Size Chart ${is3600 ? 'NSA 3600' : 'NSA 7200'})`}
        icon={Ruler}
        defaultOpen={isBlank}
      >
        <div className="space-y-3">
          <p className="text-[11px] text-ts-kremMuted leading-relaxed">
            {is3600
              ? 'Standar ukuran New States Apparel Softstyle 3600 (Asian Fit) tubular built-up tanpa sambungan samping. Toleransi penjahitan pabrik ±1-2 cm.'
              : 'Standar potongan Asia (Asian Fit) tubular built-up tanpa sambungan samping. Toleransi penjahitan pabrik ±1-2 cm.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-ts-border">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-ts-surfaceHover font-mono text-ts-muted border-b border-ts-border">
                  <th className="py-2 px-2.5 font-bold">Size</th>
                  <th className="py-2 px-2.5">Lebar Dada</th>
                  <th className="py-2 px-2.5">Panjang</th>
                  <th className="py-2 px-2.5">Lengan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-border font-mono">
                {(is3600 ? NSA_3600_SIZE_CHART : NSA_7200_SIZE_CHART).map((item) => {
                  const isCurrent = selectedSize === item.size;
                  const isAvail = sizeList.includes(item.size);
                  return (
                    <tr
                      key={item.size}
                      className={`hover:bg-ts-surfaceHover transition-colors ${
                        isCurrent ? 'bg-ts-terracotta/15 font-bold text-ts-krem' : ''
                      }`}
                    >
                      <td className="py-1.5 px-2.5 font-bold text-ts-terracotta">
                        <span>{item.size}</span>
                        {!isAvail && !is3600 && (
                          <span className="block text-[8px] font-sans text-ts-muted font-normal">
                            8 Warna
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-2.5">{item.chest} cm</td>
                      <td className="py-1.5 px-2.5">{item.length} cm</td>
                      <td className="py-1.5 px-2.5">{item.sleeve} cm</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={onOpenSizeModal}
            className="inline-flex items-center gap-1.5 text-xs text-ts-mustard hover:text-ts-krem font-bold transition-colors pt-0.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buka Kalkulator Ukuran Pas (Rekomendasi TB / BB) &rarr;</span>
          </button>
        </div>
      </AccordionItem>

      {/* Spesifikasi Garmen & Sablon */}
      <AccordionItem
        title="Spesifikasi Garmen NSA & Sablon DTF 155°C"
        icon={ShieldCheck}
        defaultOpen={!isBlank}
      >
        {is3600 ? (
          <span>
            100% Ring Spun Cotton New States Apparel (NSA) Softstyle 3600 Original Cititex. Gramasi 150 g/m² (30s), pola rajutan tubular knit tanpa sambungan samping, kerah rib 2.0 cm kokoh anti-melar, sangat sejuk, lembut, dan nyaman untuk iklim tropis. Siap pakai langsung atau disablon custom.
          </span>
        ) : isBlank ? (
          <span>
            100% Katun Combed New States Apparel (NSA) Premium 7200 Original Cititex. Gramasi 180 g/m² (24s), pola rajutan tubular knit tanpa sambungan samping, kerah rib 2.2 cm kokoh anti-melar, tebal dan jatuh di badan. Siap pakai langsung atau disablon custom.
          </span>
        ) : (
          <span>
            100% Katun New States Apparel (NSA) Heavyweight 24s gramasi 180 g/m² (atau Softstyle 30s). Pola tubular knit tanpa sambungan samping. Dicetak dengan sablon DTF High-Density curing suhu 155°C dengan tinta elastis tahan cuci berkali-kali.
          </span>
        )}
      </AccordionItem>

      {/* SLA Produksi & Pengiriman */}
      <AccordionItem title="Jadwal Produksi & SLA Pengiriman" icon={Truck}>
        Warna studio reguler (Hitam, Putih): Dipress in-house &amp; dikirim H+0 / H+1.<br />
        Warna non-reguler / size jumbo: Ditarik dari gudang pusat H+1, pengiriman H+2 via J&amp;T, SiCepat, atau JNE dengan nomor resi otomatis.
      </AccordionItem>

      {/* Garansi 100% */}
      <AccordionItem title="Garansi Kepuasan 100% & Bebas Tukar Ukuran" icon={RotateCcw}>
        Garansi 100% ganti baru jika sablon cacat/pecah, bahan berlubang, atau salah kirim ukuran dalam 30 hari sejak barang diterima. Hubungi kami via WhatsApp untuk klaim instan.
      </AccordionItem>

      <div className="flex justify-end pt-1">
        <Link
          to="/garansi"
          className="text-[11px] text-ts-mustard hover:text-ts-krem font-bold transition-colors flex items-center gap-1"
        >
          <span>Panduan Perawatan &amp; Garansi Lengkap</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
