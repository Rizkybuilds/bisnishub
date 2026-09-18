import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Ruler, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare,
  Package,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Shirt
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/common/SEOHead';
import { useStore } from '../../context/StoreContext';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export const SIZE_CHART_MODELS = {
  nsa_7200: {
    id: 'nsa_7200',
    name: 'NSA Heavyweight 7200 (24s)',
    badge: 'Streetwear Distro',
    desc: 'Bahan 100% Cotton 180 g/m², tubular built-up tanpa sambungan samping. Kerah rib 2.2 cm.',
    rows: [
      { size: 'S', chest: '47 cm', length: '67 cm', sleeve: '19 cm', estHeight: '155 – 165 cm', estWeight: '45 – 55 kg' },
      { size: 'M', chest: '50 cm', length: '70 cm', sleeve: '19.5 cm', estHeight: '160 – 170 cm', estWeight: '55 – 65 kg' },
      { size: 'L', chest: '53 cm', length: '73 cm', sleeve: '20 cm', estHeight: '165 – 178 cm', estWeight: '65 – 75 kg', highlight: true },
      { size: 'XL', chest: '56 cm', length: '75 cm', sleeve: '20.5 cm', estHeight: '170 – 185 cm', estWeight: '75 – 88 kg' },
      { size: '2XL', chest: '59 cm', length: '77 cm', sleeve: '21 cm', estHeight: '175 – 190 cm', estWeight: '88 – 100 kg' },
      { size: '3XL', chest: '62 cm', length: '80 cm', sleeve: '21.5 cm', estHeight: '180 – 195 cm', estWeight: '100 – 112 kg' },
      { size: '4XL', chest: '65 cm', length: '83 cm', sleeve: '22 cm', estHeight: '> 185 cm', estWeight: '112 – 125 kg' },
      { size: '5XL', chest: '68 cm', length: '86 cm', sleeve: '22.5 cm', estHeight: '> 185 cm', estWeight: '> 125 kg' },
    ]
  },
  nsa_3600: {
    id: 'nsa_3600',
    name: 'NSA Softstyle 3600 (30s)',
    badge: 'Adem Tropis',
    desc: 'Bahan 100% Cotton 150 g/m², ringan, ekstra lembut, dan sangat adem untuk daily wear.',
    rows: [
      { size: 'S', chest: '47 cm', length: '67 cm', sleeve: '19 cm', estHeight: '155 – 165 cm', estWeight: '45 – 55 kg' },
      { size: 'M', chest: '50 cm', length: '70 cm', sleeve: '19.5 cm', estHeight: '160 – 170 cm', estWeight: '55 – 65 kg' },
      { size: 'L', chest: '53 cm', length: '73 cm', sleeve: '20 cm', estHeight: '165 – 178 cm', estWeight: '65 – 75 kg', highlight: true },
      { size: 'XL', chest: '56 cm', length: '75 cm', sleeve: '20.5 cm', estHeight: '170 – 185 cm', estWeight: '75 – 88 kg' },
      { size: '2XL', chest: '59 cm', length: '77 cm', sleeve: '21 cm', estHeight: '175 – 190 cm', estWeight: '88 – 100 kg' }
    ]
  },
  nsa_7280: {
    id: 'nsa_7280',
    name: 'NSA Long Sleeve 7280 (24s)',
    badge: 'Lengan Panjang',
    desc: 'Bahan 100% Cotton 180 g/m² dengan manset rib tebal di pergelangan tangan.',
    rows: [
      { size: 'S', chest: '47 cm', length: '67 cm', sleeve: '58 cm', estHeight: '155 – 165 cm', estWeight: '45 – 55 kg' },
      { size: 'M', chest: '50 cm', length: '70 cm', sleeve: '59 cm', estHeight: '160 – 170 cm', estWeight: '55 – 65 kg' },
      { size: 'L', chest: '53 cm', length: '73 cm', sleeve: '60 cm', estHeight: '165 – 178 cm', estWeight: '65 – 75 kg', highlight: true },
      { size: 'XL', chest: '56 cm', length: '75 cm', sleeve: '61 cm', estHeight: '170 – 185 cm', estWeight: '75 – 88 kg' },
      { size: '2XL', chest: '59 cm', length: '77 cm', sleeve: '62 cm', estHeight: '175 – 190 cm', estWeight: '88 – 100 kg' }
    ]
  },
  nsa_72y00: {
    id: 'nsa_72y00',
    name: 'NSA Youth Kids 72Y00 (24s)',
    badge: 'Anak-Anak',
    desc: 'Bahan 100% Cotton 180 g/m² ramah kulit anak, tidak gerah, dan nyaman beraktivitas.',
    rows: [
      { size: 'XS', chest: '33 cm', length: '45 cm', sleeve: '11.5 cm', estHeight: '100 – 115 cm', estWeight: '15 – 20 kg' },
      { size: 'S', chest: '36 cm', length: '48 cm', sleeve: '12.5 cm', estHeight: '115 – 125 cm', estWeight: '20 – 25 kg' },
      { size: 'M', chest: '38 cm', length: '51 cm', sleeve: '13.5 cm', estHeight: '125 – 135 cm', estWeight: '25 – 30 kg' },
      { size: 'L', chest: '41 cm', length: '54 cm', sleeve: '14.5 cm', estHeight: '135 – 145 cm', estWeight: '30 – 38 kg' },
      { size: 'XL', chest: '43 cm', length: '58 cm', sleeve: '15.5 cm', estHeight: '145 – 155 cm', estWeight: '38 – 45 kg' }
    ]
  }
};

export const GARMENT_CARE_RULES = [
  {
    ruleNo: '01',
    title: 'Balik Kaos Saat Dicuci (Inside-Out)',
    desc: 'Selalu balik posisi kaos sehingga permukaan sablon berada di bagian dalam sebelum dimasukkan ke mesin cuci atau direndam. Ini melindungi permukaan grafis DTF dari gesekan pakaian lain.',
    colorTheme: 'text-ts-terracotta'
  },
  {
    ruleNo: '02',
    title: 'Hindari Pemutih & Air Sangat Panas',
    desc: 'Gunakan deterjen biasa dengan air suhu normal atau suam-kuku. Jangan gunakan cairan pemutih klorin keras karena dapat merusak pigmen warna sablon dan serat katun.',
    colorTheme: 'text-ts-teal'
  },
  {
    ruleNo: '03',
    title: 'PANTANG Setrika Langsung Permukaan Sablon',
    desc: 'Panas langsung dari tapak setrika logam dapat melunakkan kembali lem sablon. Selalu setrika dari bagian dalam kaos, atau gunakan kain pelapis/kertas teflon di atas sablon.',
    colorTheme: 'text-ts-mustard'
  },
  {
    ruleNo: '04',
    title: 'Jemur di Tempat Teduh',
    desc: 'Jemur kaos dengan posisi tetap terbalik dan hindari terik matahari langsung yang berlebihan agar warna pekat kain katun hitam/charcoal tidak cepat pudar.',
    colorTheme: 'text-ts-green'
  }
];

/**
 * Pure Antropometric Sizing Recommendation Helper
 */
export function recommendGarmentSize({ heightCm = 170, weightKg = 65, fitPreference = 'regular' } = {}) {
  const h = Number(heightCm) || 170;
  const w = Number(weightKg) || 65;

  let size = 'L';
  if (w < 55) size = 'S';
  else if (w <= 65) size = 'M';
  else if (w <= 75) size = 'L';
  else if (w <= 88) size = 'XL';
  else if (w <= 100) size = '2XL';
  else if (w <= 112) size = '3XL';
  else if (w <= 125) size = '4XL';
  else size = '5XL';

  const sizesOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  let idx = sizesOrder.indexOf(size);
  if (fitPreference === 'oversize' && idx < sizesOrder.length - 1) {
    idx += 1;
  } else if (fitPreference === 'slim' && idx > 0) {
    idx -= 1;
  }

  const recommendedSize = sizesOrder[idx];
  const chestEstimates = {
    S: '47 cm',
    M: '50 cm',
    L: '53 cm',
    XL: '56 cm',
    '2XL': '59 cm',
    '3XL': '62 cm',
    '4XL': '65 cm',
    '5XL': '68 cm'
  };

  return {
    recommendedSize,
    fitPreference,
    heightCm: h,
    weightKg: w,
    chestEstimate: chestEstimates[recommendedSize] || '53 cm',
    note: fitPreference === 'oversize'
      ? 'Ukuran dinaikkan 1 tingkat untuk tampilan santai streetwear (loose/baggy look).'
      : fitPreference === 'slim'
      ? 'Ukuran pas mengikuti siluet tubuh (fitted look).'
      : 'Ukuran proporsional ideal standar reguler Asian Fit.'
  };
}

/**
 * Generates structured WhatsApp brief for warranty claims or size consultations
 */
export function generateWarrantyClaimWaText({
  orderNumber = '',
  issueType = 'cacat_sablon',
  customerName = '',
  details = ''
} = {}) {
  const issueLabels = {
    cacat_sablon: 'Klaim Retur: Cacat Sablon DTF / Mengelupas',
    salah_kirim: 'Klaim Retur: Salah Ukuran / Salah Desain / Salah Warna',
    konsultasi_ukuran: 'Konsultasi: Rekomendasi Ukuran Sebelum Membeli'
  };

  const label = issueLabels[issueType] || 'Klaim Garansi Produk';

  return [
    `Halo Customer Support TeeStock! Saya ingin mengajukan ${label}:`,
    ``,
    `📋 *No. Pesanan:* ${orderNumber || '-'}`,
    `👤 *Nama:* ${customerName || '-'}`,
    `📌 *Kategori Kendala:* ${label}`,
    details ? `📝 *Rincian:* ${details}` : null,
    ``,
    `Saya telah menyiapkan video unboxing singkat untuk verifikasi penggantian barang baru. Terima kasih!`
  ].filter(Boolean).join('\n');
}

/**
 * Generates direct wa.me link for warranty claims
 */
export function generateWarrantyClaimWaUrl(storePhone = '085220274968', claimData = {}) {
  const cleanWhatsapp = sanitizePhoneNumber(storePhone);
  const text = generateWarrantyClaimWaText(claimData);
  return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
}

export function GaransiPage() {
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Interactive Sizing States
  const [userHeight, setUserHeight] = useState(170);
  const [userWeight, setUserWeight] = useState(65);
  const [userFit, setUserFit] = useState('regular'); // 'regular', 'oversize', 'slim'
  const [activeModelKey, setActiveModelKey] = useState('nsa_7200');

  // Quick Warranty Claim Modal States
  const [claimOrderId, setClaimOrderId] = useState('');
  const [claimName, setClaimName] = useState('');
  const [claimType, setClaimType] = useState('cacat_sablon');
  const [claimDetails, setClaimDetails] = useState('');

  const sizingRecommendation = recommendGarmentSize({
    heightCm: userHeight,
    weightKg: userWeight,
    fitPreference: userFit
  });

  const selectedModel = SIZE_CHART_MODELS[activeModelKey] || SIZE_CHART_MODELS.nsa_7200;

  const claimWaUrl = generateWarrantyClaimWaUrl(cleanWhatsapp, {
    orderNumber: claimOrderId,
    customerName: claimName,
    issueType: claimType,
    details: claimDetails
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <SEOHead
        title="Garansi Produk, Panduan Ukuran & Perawatan Kaos | TeeStock"
        description="Jaminan 100% garmen NSA original, garansi ganti baru retur sablon cacat, tabel size chart ukuran, dan SOP perawatan sablon DTF tahan cuci."
        canonicalPath="/care"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ts-terracotta/15 border border-ts-terracotta/30 text-xs font-mono font-bold text-ts-terracotta">
          <ShieldCheck className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>TEESTOCK QUALITY COMMITMENT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-ts-krem tracking-tight uppercase">
          Garansi, Ukuran &amp; Panduan Perawatan
        </h1>
        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed max-w-2xl mx-auto">
          Komitmen penuh studio kami untuk memastikan setiap potong apparel yang tiba di tangan Anda memiliki standar garmen dan sablon terbaik tanpa rasa khawatir.
        </p>
      </div>

      {/* 1. THREE PILLARS OF GUARANTEE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-ts-border">
          <ShieldCheck className="w-5 h-5 text-ts-green" />
          <h2 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight">
            1. Jaminan Kualitas &amp; Kebijakan Retur
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ts-green/15 text-ts-green flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ts-krem">100% Garmen NSA Original Cititex</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Kami hanya menggunakan garmen New States Apparel resmi tanpa jahitan samping (*tubular built-up*). Jika terbukti kain bukan NSA original, kami kembalikan dana 100%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ts-krem">Garansi Ganti Baru Cacat Sablon</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Jika sablon mengelupas, retak parah, atau cacat cetak saat unboxing atau setelah pencucian pertama, kami ganti kaos baru tanpa biaya tambahan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ts-krem">Salah Ukuran / Salah Kirim</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Jika item yang diterima tidak sesuai dengan pesanan di faktur (salah warna, salah desain, atau salah ukuran), ongkos kirim bolak-balik kami tanggung penuh.
            </p>
          </div>
        </div>

        {/* Syarat Klaim Retur */}
        <div className="p-5 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-kremMuted space-y-2">
          <div className="font-bold text-ts-krem flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-ts-mustard" />
            <span>Syarat Mudah Klaim Garansi &amp; Pengembalian (Maksimal 3 Hari Sejak Paket Diterima):</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Sertakan video unboxing singkat saat membuka polymailer doff tanpa jeda/edit.</li>
            <li>Kaos belum dicuci pakai deterjen keras dan tag label garmen masih utuh.</li>
            <li>Kirim nomor pesanan (cth: TS-260918-123456) ke WhatsApp Customer Support kami.</li>
          </ul>
        </div>
      </section>

      {/* 2. INTERACTIVE SIZE CALCULATOR & SIZE CHART */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-ts-border">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-ts-terracotta" />
            <h2 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight">
              2. Panduan Ukuran (Size Chart Guide)
            </h2>
          </div>
          <span className="text-xs font-mono text-ts-kremMuted hidden sm:inline">Regular Asian Fit</span>
        </div>

        {/* Interactive Size Recommendation Widget */}
        <div className="p-6 rounded-3xl bg-ts-surface border border-ts-border shadow-glass-card space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-teal bg-ts-teal/15 px-2.5 py-0.5 rounded-full border border-ts-teal/30">
                <Sparkles className="w-3 h-3" />
                <span>KALKULATOR UKURAN INSTAN</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-ts-krem">
                Cari Tahu Ukuran Paling Pas untuk Postur Tubuh Kamu
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input Sliders (7 Cols) */}
            <div className="md:col-span-7 space-y-5">
              {/* Height Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label htmlFor="userHeightInput" className="text-ts-krem">Tinggi Badan (TB):</label>
                  <span className="font-mono text-sm font-bold text-ts-terracotta px-2.5 py-0.5 rounded-lg bg-ts-hitam/30 border border-ts-border">
                    {userHeight} cm
                  </span>
                </div>
                <input
                  id="userHeightInput"
                  type="range"
                  min="145"
                  max="200"
                  step="1"
                  value={userHeight}
                  onChange={(e) => setUserHeight(Number(e.target.value))}
                  className="w-full accent-ts-terracotta cursor-pointer min-h-[36px]"
                />
              </div>

              {/* Weight Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label htmlFor="userWeightInput" className="text-ts-krem">Berat Badan (BB):</label>
                  <span className="font-mono text-sm font-bold text-ts-mustard px-2.5 py-0.5 rounded-lg bg-ts-hitam/30 border border-ts-border">
                    {userWeight} kg
                  </span>
                </div>
                <input
                  id="userWeightInput"
                  type="range"
                  min="40"
                  max="130"
                  step="1"
                  value={userWeight}
                  onChange={(e) => setUserWeight(Number(e.target.value))}
                  className="w-full accent-ts-mustard cursor-pointer min-h-[36px]"
                />
              </div>

              {/* Fit Preference Buttons */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ts-krem">Preferensi Potongan (Fit):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'slim', label: 'Pas Badan' },
                    { id: 'regular', label: 'Reguler (Ideal)' },
                    { id: 'oversize', label: 'Oversize (Baggy)' }
                  ].map((fit) => (
                    <button
                      key={fit.id}
                      type="button"
                      onClick={() => setUserFit(fit.id)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        userFit === fit.id
                          ? 'bg-ts-terracotta text-white border-ts-terracotta shadow-glow-terracotta'
                          : 'bg-ts-hitam/20 text-ts-muted border-ts-border hover:text-ts-krem'
                      }`}
                    >
                      {fit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result Card (5 Cols) */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-ts-hitam/20 border border-ts-border text-center space-y-3">
              <span className="text-[11px] font-mono text-ts-muted uppercase block">Ukuran Rekomendasi Kami:</span>
              <div className="font-mono text-4xl sm:text-5xl font-black text-ts-terracotta tracking-tight">
                {sizingRecommendation.recommendedSize}
              </div>
              <div className="text-xs text-ts-krem font-bold">
                Estimasi Lebar Dada: {sizingRecommendation.chestEstimate}
              </div>
              <p className="text-[11px] text-ts-muted leading-relaxed">
                {sizingRecommendation.note}
              </p>
            </div>
          </div>
        </div>

        {/* Model Tabs for Size Table */}
        <div className="flex flex-wrap gap-2 pt-4">
          {Object.entries(SIZE_CHART_MODELS).map(([k, m]) => (
            <button
              key={k}
              type="button"
              onClick={() => setActiveModelKey(k)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${
                activeModelKey === k
                  ? 'bg-ts-terracotta text-white border-ts-terracotta shadow-glow-terracotta'
                  : 'bg-ts-surface text-ts-muted border-ts-border hover:text-ts-krem'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-ts-kremMuted">
          {selectedModel.desc}
        </p>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-2xl border border-ts-border bg-ts-surface shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-ts-surfaceHover text-ts-krem font-mono uppercase tracking-wider border-b border-ts-border">
              <tr>
                <th className="py-3 px-4 font-bold">Size</th>
                <th className="py-3 px-4 font-bold">Lebar Dada</th>
                <th className="py-3 px-4 font-bold">Panjang Badan</th>
                <th className="py-3 px-4 font-bold">Lengan</th>
                <th className="py-3 px-4 font-bold">Estimasi Tinggi</th>
                <th className="py-3 px-4 font-bold">Estimasi Berat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ts-border text-ts-kremMuted font-mono">
              {selectedModel.rows.map((row) => {
                const isHighlight = row.highlight || row.size === sizingRecommendation.recommendedSize;
                return (
                  <tr
                    key={row.size}
                    className={`hover:bg-ts-surfaceHover/50 transition-colors ${
                      isHighlight ? 'bg-ts-terracotta/10 text-ts-krem font-bold' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 font-bold ${isHighlight ? 'text-ts-terracotta' : 'text-ts-krem'}`}>
                      {row.size} {row.highlight ? '(Best Seller)' : ''}
                    </td>
                    <td className="py-3 px-4">{row.chest}</td>
                    <td className="py-3 px-4">{row.length}</td>
                    <td className="py-3 px-4">{row.sleeve}</td>
                    <td className="py-3 px-4">{row.estHeight}</td>
                    <td className="py-3 px-4">{row.estWeight}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ts-kremMuted">
          <div className="p-4 rounded-xl bg-ts-surface border border-ts-border space-y-1 shadow-sm">
            <span className="font-bold text-ts-krem block">💡 Tips Fit Streetwear / Oversize:</span>
            <p>Jika Anda menyukai tampilan santai yang longgar (*loose/baggy look*), disarankan naik 1 ukuran (*up-size*) dari ukuran reguler Anda.</p>
          </div>
          <div className="p-4 rounded-xl bg-ts-surface border border-ts-border space-y-1 shadow-sm">
            <span className="font-bold text-ts-krem block">📐 Toleransi Jahitan Pabrik:</span>
            <p>Toleransi ukuran alami pada kain katun berkisar 1 – 2 cm karena proses pemotongan dan penjahitan manual garmen.</p>
          </div>
        </div>
      </section>

      {/* 3. DTF WASH & CARE GUIDE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-ts-border">
          <Flame className="w-5 h-5 text-ts-mustard" />
          <h2 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight">
            3. Panduan Perawatan Sablon DTF &amp; Garmen Katun
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
          Sablon DTF (*Direct-to-Film*) TeeStock dipress ganda dengan suhu 155°C sehingga sangat elastis dan tahan cuci. Ikuti 4 aturan perawatan ini agar warna sablon tetap tajam bertahun-tahun:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GARMENT_CARE_RULES.map((rule) => (
            <div key={rule.ruleNo} className="p-5 rounded-2xl bg-ts-surface border border-ts-border space-y-2 shadow-sm">
              <div className={`${rule.colorTheme} font-mono font-bold text-xs`}>ATURAN // {rule.ruleNo}</div>
              <h4 className="font-bold text-sm text-ts-krem">{rule.title}</h4>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Support Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-ts-terracotta/15 via-ts-surface to-ts-surface border border-ts-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-lg sm:text-xl font-black text-ts-krem uppercase tracking-tight">
            Ada Pertanyaan Seputar Pesanan atau Butuh Bantuan Ukuran?
          </h3>
          <p className="text-xs text-ts-kremMuted leading-relaxed">
            Tim studio kami siap membantu konsultasi ukuran, kendala paket, atau garansi tukar baru via WhatsApp setiap hari (08.00 – 21.00 WIB).
          </p>
        </div>

        <a
          href={claimWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button size="lg" variant="whatsapp" icon={MessageSquare} className="font-bold text-xs sm:text-sm px-6 py-3.5 shadow-sm min-h-[48px]">
            Chat WhatsApp Studio
          </Button>
        </a>
      </div>
    </div>
  );
}

