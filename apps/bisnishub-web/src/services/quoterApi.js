/**
 * ⚡ TeeStock Custom Order Quoter & WhatsApp Sales Proposal Engine
 * Menghitung HPP custom garmen secara presisi, multi-posisi sablon DTF,
 * surcharge ukuran jumbo (2XL/3XL), tiering volume, kepatuhan margin CFO (>= 35%),
 * generator pesan penawaran WhatsApp direct, dan jembatan ke antrean Kanban.
 */

import { GARMENT_TYPES } from '@bisnishub/shared/constants/garments';
import { PRODUCTION_COSTS, getSizeSurcharge } from '@bisnishub/shared/constants/pricing';
import { normalizePhoneNumber } from './customersApi';

/**
 * Daftar Posisi Sablon DTF Resmi TeeStock & MultiGraph
 */
export const PRINT_POSITIONS = [
  { id: 'front_a3', name: 'Depan Utama A3 (28x40 cm)', area: 'A3', cost: 12500, defaultActive: true },
  { id: 'front_a4', name: 'Depan Sedang A4 (21x30 cm)', area: 'A4', cost: 8500, defaultActive: false },
  { id: 'front_a5', name: 'Depan A5 (14x20 cm)', area: 'A5', cost: 6000, defaultActive: false },
  { id: 'front_chest', name: 'Dada Kiri / Logo Saku A6 (10x10 cm)', area: 'A6', cost: 4500, defaultActive: false },
  { id: 'back_a3', name: 'Punggung Belakang A3 (28x40 cm)', area: 'A3', cost: 12500, defaultActive: false },
  { id: 'back_a4', name: 'Punggung Belakang A4 (21x30 cm)', area: 'A4', cost: 8500, defaultActive: false },
  { id: 'back_neck_logo', name: 'Logo Punggung Atas (8x8 cm)', area: 'Logo', cost: 3500, defaultActive: false },
  { id: 'neck_label', name: 'Label Kerah Dalam (6x3 cm)', area: 'Label', cost: 2000, defaultActive: false },
  { id: 'sleeve_left', name: 'Sablon Lengan Kiri (8x8 cm)', area: 'Sleeve', cost: 3500, defaultActive: false },
  { id: 'sleeve_right', name: 'Sablon Lengan Kanan (8x8 cm)', area: 'Sleeve', cost: 3500, defaultActive: false },
];

/**
 * Pilihan Paket Kemasan & Unboxing Distro
 */
export const PACKAGING_OPTIONS = [
  { id: 'standard_poly', name: 'Standar Distro (Polymailer Doff + Care Card MultiGraph)', cost: 2000 },
  { id: 'premium_ziplock', name: 'Premium Ziplock Pouch + Stiker Pack MultiGraph (100% Retail Look)', cost: 4000 },
  { id: 'b2b_box', name: 'Exclusive E-Flute Gift Box + Hangtag Die-cut (Merch/Gift Komunitas)', cost: 6500 },
];

/**
 * Skema Tiering Diskon Volume & Target Margin CFO
 */
export const VOLUME_TIERS = [
  { id: 'tier_single', min: 1, max: 5, label: 'Satuan / Sampel (1–5 pcs)', discountPercent: 0, targetMargin: 0.42 },
  { id: 'tier_community', min: 6, max: 11, label: 'Komunitas Mini (6–11 pcs)', discountPercent: 8, targetMargin: 0.39 },
  { id: 'tier_dozen', min: 12, max: 23, label: 'Lusinan Distro (12–23 pcs)', discountPercent: 15, targetMargin: 0.37 },
  { id: 'tier_event', min: 24, max: 49, label: 'Grosir Event (24–49 pcs)', discountPercent: 20, targetMargin: 0.35 },
  { id: 'tier_bulk', min: 50, max: 9999, label: 'Partai Besar (50+ pcs)', discountPercent: 25, targetMargin: 0.35 }
];

/**
 * Format Rupiah standar
 */
export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
}

/**
 * Menghitung rincian penawaran custom apparel secara presisi
 */
export function calculateCustomQuote({
  garmentKey = 'nsa_softstyle_30s',
  garmentColor = 'Hitam',
  sizeQuantities = { S: 0, M: 1, L: 0, XL: 0, '2XL': 0, '3XL': 0 },
  selectedPlacements = ['front_a3'],
  packagingId = 'standard_poly',
  extraPressLabor = PRODUCTION_COSTS.pressLabor || 5000,
  extraOverhead = PRODUCTION_COSTS.overhead || 1000
}) {
  // 1. Total kuantitas dan pembagian ukuran
  const safeSizes = { ...sizeQuantities };
  let totalQty = 0;
  let totalJumboSurcharge = 0;

  Object.entries(safeSizes).forEach(([size, q]) => {
    const qtyNum = Math.max(0, parseInt(q, 10) || 0);
    totalQty += qtyNum;
    const isLongSleeve = garmentKey.includes('longsleeve');
    const surcharge = getSizeSurcharge(size, isLongSleeve);
    totalJumboSurcharge += surcharge * qtyNum;
  });

  // Jika input qty kosong semua, minimal asumsikan 1 pcs
  const effectiveQty = totalQty > 0 ? totalQty : 1;

  // 2. Biaya bahan baku garmen
  const garment = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  const isWhite = (garmentColor || '').toLowerCase().includes('putih') || (garmentColor || '').toLowerCase().includes('white');
  const baseBlankCost = (isWhite && garment.baseCostWhite) ? garment.baseCostWhite : (garment.baseCost || 38000);
  const totalBlankCost = (baseBlankCost * effectiveQty) + totalJumboSurcharge;

  // 3. Biaya cetak DTF multi-posisi
  let totalDtfPerPcs = 0;
  const activePlacements = PRINT_POSITIONS.filter(p => selectedPlacements.includes(p.id));
  activePlacements.forEach(p => {
    totalDtfPerPcs += p.cost;
  });
  const totalDtfCost = totalDtfPerPcs * effectiveQty;

  // 4. Biaya kemasan & finishing
  const selectedPackaging = PACKAGING_OPTIONS.find(pkg => pkg.id === packagingId) || PACKAGING_OPTIONS[0];
  const packagingCostPerPcs = selectedPackaging.cost;
  const totalPackagingCost = packagingCostPerPcs * effectiveQty;

  // 5. Biaya pengerjaan heat press & operasional listrik studio
  const pressAndOverheadPerPcs = extraPressLabor + extraOverhead;
  const totalPressAndOverhead = pressAndOverheadPerPcs * effectiveQty;

  // 6. Total HPP Pokok Produksi (BOM Riil)
  const totalProductionCost = totalBlankCost + totalDtfCost + totalPackagingCost + totalPressAndOverhead;
  const unitHpp = Math.round(totalProductionCost / effectiveQty);

  // 7. Penentuan Tier Volume & Target Margin CFO
  const currentTier = VOLUME_TIERS.find(t => effectiveQty >= t.min && effectiveQty <= t.max) || VOLUME_TIERS[0];
  
  // Harga rekomendasi satuan (dibulatkan ke atas kelipatan Rp 1.000)
  const rawUnitPrice = unitHpp / (1 - currentTier.targetMargin);
  let recommendedUnitPrice = Math.ceil(rawUnitPrice / 1000) * 1000;

  // CFO Guardrail: Margin bersih minimum tidak boleh di bawah 25% (ideal >= 35%)
  const minPriceFloor35 = Math.ceil((unitHpp / 0.65) / 1000) * 1000;
  if (recommendedUnitPrice < minPriceFloor35 && effectiveQty < 50) {
    recommendedUnitPrice = minPriceFloor35;
  }

  // 8. Total Penagihan & Keuntungan
  const totalPrice = recommendedUnitPrice * effectiveQty;
  const totalNetProfit = totalPrice - totalProductionCost;
  const netMarginPercent = totalPrice > 0 ? ((totalNetProfit / totalPrice) * 100) : 0;

  // Status Kepatuhan CFO
  let cfoStatus = 'healthy';
  let cfoStatusLabel = 'Sehat (Margin >= 35%)';
  let cfoBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (netMarginPercent < 25) {
    cfoStatus = 'critical';
    cfoStatusLabel = 'Kritis (< 25% - Tolak Diskon)';
    cfoBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (netMarginPercent < 35) {
    cfoStatus = 'warning';
    cfoStatusLabel = 'Perhatian (25% - 34% - Evaluasi CFO)';
    cfoBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  // 9. Down Payment (DP 50%) & Pelunasan
  const downPayment = Math.ceil((totalPrice * 0.5) / 1000) * 1000;
  const remainingPayment = totalPrice - downPayment;

  return {
    garment,
    garmentColor,
    totalQty: effectiveQty,
    sizeQuantities: safeSizes,
    totalJumboSurcharge,
    activePlacements,
    selectedPackaging,
    baseBlankCost,
    totalBlankCost,
    totalDtfPerPcs,
    totalDtfCost,
    packagingCostPerPcs,
    totalPackagingCost,
    pressAndOverheadPerPcs,
    totalPressAndOverhead,
    unitHpp,
    totalProductionCost,
    tier: currentTier,
    recommendedUnitPrice,
    totalPrice,
    totalNetProfit,
    netMarginPercent: Number(netMarginPercent.toFixed(1)),
    cfoStatus,
    cfoStatusLabel,
    cfoBadgeColor,
    downPayment,
    remainingPayment
  };
}

/**
 * Template WhatsApp Penawaran Custom Direct (wa.me)
 */
export const QUOTE_WHATSAPP_TEMPLATES = [
  {
    id: 'detailed_quote',
    title: 'Penawaran Resmi Custom (Detailed Quote)',
    description: 'Rincian spesifikasi garmen, sablon, harga satuan tier, total, dan estimasi waktu pengerjaan',
    badge: 'Rekomendasi'
  },
  {
    id: 'dp_invoice',
    title: 'Invoice Tagihan DP 50% (Deposit Invoice)',
    description: 'Instruksi pembayaran uang muka 50% untuk mengamankan slot antrean produksi heat press',
    badge: 'Uang Muka'
  },
  {
    id: 'final_balance',
    title: 'Konfirmasi Pelunasan & Kirim (Final Balance)',
    description: 'Notifikasi bahwa kaos telah selesai dipress, QC lolos, dan siap kirim setelah pelunasan',
    badge: 'Pelunasan'
  }
];

/**
 * Generator Pesan Penawaran WhatsApp Siap Kirim
 */
export function generateQuoteWhatsAppText(quote, customerInfo = {}, templateType = 'detailed_quote') {
  if (!quote) return '';

  const customerName = customerInfo.name?.trim() || 'Kak';
  const garmentName = quote.garment?.name || 'NSA Heavyweight 24s';
  const color = quote.garmentColor || 'Hitam';
  const qty = quote.totalQty || 1;
  const unitPriceFormatted = formatRupiah(quote.recommendedUnitPrice);
  const totalPriceFormatted = formatRupiah(quote.totalPrice);
  const dpFormatted = formatRupiah(quote.downPayment);
  const remainingFormatted = formatRupiah(quote.remainingPayment);

  // Rincian posisi sablon
  const placementsList = quote.activePlacements?.length > 0
    ? quote.activePlacements.map(p => `  • ${p.name}`).join('\n')
    : '  • Sablon Depan A3 (28x40 cm)';

  // Rincian ukuran jika ada
  const sizeBreakdown = Object.entries(quote.sizeQuantities || {})
    .filter(([_, q]) => Number(q) > 0)
    .map(([sz, q]) => `${sz}:${q}`)
    .join(', ');

  const sizeText = sizeBreakdown ? ` (${sizeBreakdown})` : '';

  switch (templateType) {
    case 'detailed_quote':
      return `Halo Kak ${customerName}! 👋\nTerima kasih banyak sudah menghubungi *TeeStock Apparel x MultiGraph* 😊\n\nBerikut rincian penawaran resmi untuk pesanan kaos custom kamu:\n\n👕 *Spesifikasi Kaos:*\n• Model: *${garmentName}* (100% Preshrunk Cotton Original NSA)\n• Warna Bahan: *${color}*\n• Jumlah Pesanan: *${qty} pcs*${sizeText}\n• Kemasan: *${quote.selectedPackaging?.name || 'Standar Distro'}*\n\n🎨 *Titik Sablon DTF HD (155°C Teflon Finish):*\n${placementsList}\n\n💰 *Rincian Penawaran Harga (Tier ${quote.tier?.label}):*\n• Harga Satuan: *${unitPriceFormatted}* / pcs\n• Total Nilai Proyek: *${totalPriceFormatted}*\n• Syarat DP 50%: *${dpFormatted}* (Pelunasan: ${remainingFormatted})\n\n⭐ *Standar Kualitas TeeStock Studio:*\n✅ Bahan original New State Apparel, adem dan anti-susut\n✅ Sablon DTF High Density, warna solid, lentur, dan tahan cuci berkali-kali\n✅ Melewati double-QC dan kemasan rapi polymailer tebal\n✅ Estimasi pengerjaan: 2–3 hari kerja sejak DP terkonfirmasi\n\nApakah desain artwork-nya sudah siap untuk kami buatkan preview mockup digitalnya kak? 🚀`;

    case 'dp_invoice':
      return `Halo Kak ${customerName}! ✨\nTerima kasih sudah sepakat dengan penawaran custom *TeeStock Apparel* (${qty} pcs ${garmentName}).\n\n📋 *Tagihan Uang Muka (DP 50% Produksi):*\n• No. Ref Penawaran: *TS-CUSTOM-${Date.now().toString().slice(-6)}*\n• Total Proyek: *${totalPriceFormatted}*\n• *TOTAL TRANSFER DP (50%): ${dpFormatted}*\n• Sisa Pelunasan Sebelum Kirim: ${remainingFormatted}\n\n💳 *Metode Pembayaran Resmi:*\n• *BCA Bisnis:* 522-033-4421 a.n TeeStock Apparel Studio\n• *QRIS Dinamis:* (Bisa request link QRIS via chat ini)\n\nSetelah transfer, mohon kirimkan bukti transfernya di sini ya kak agar slot antrean cetak DTF dan bahan kaos segera kami kunci di sistem! ⚡`;

    case 'final_balance':
      return `Kabar gembira Kak ${customerName}! 🎉 Kaos custom pesananmu (*${qty} pcs ${garmentName}*) sudah *SELESAI DIPRESS* dan telah lolos Quality Control 100% di studio kami.\n\n📦 Paket sudah siap dipacking polymailer tebal dan siap diserahkan ke kurir ekspedisi.\n\n💳 *Sisa Pelunasan Akhir:*\n• Sisa Tagihan (50%): *${remainingFormatted}*\n• Transfer ke: *BCA 522-033-4421* a.n TeeStock Apparel Studio\n\nBegitu pelunasan terkonfirmasi, paket langsung kami serahkan ke kurir dan nomor resi pengiriman akan langsung kami infokan ya kak. Terima kasih banyak! 🙌`;

    default:
      return `Halo Kak ${customerName}! Berikut rincian penawaran custom order TeeStock Apparel untuk ${qty} pcs: ${totalPriceFormatted}.`;
  }
}

/**
 * Menghasilkan URL WhatsApp web/mobile direct
 */
export function getQuoteWhatsAppUrl(quote, customerInfo = {}, templateType = 'detailed_quote') {
  const phone = customerInfo.phone ? normalizePhoneNumber(customerInfo.phone) : '';
  const text = generateQuoteWhatsAppText(quote, customerInfo, templateType);
  if (!phone) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Menghasilkan payload pesanan baru untuk dimasukkan ke antrean Kanban (`orders`)
 */
export function createKanbanOrderFromQuote(quote, customerInfo = {}) {
  const customerName = customerInfo.name?.trim() || 'Pelanggan Custom WA';
  const customerPhone = customerInfo.phone ? normalizePhoneNumber(customerInfo.phone) : '';
  const customerCity = customerInfo.city?.trim() || 'Kota Pemesan';
  const customerAddress = customerInfo.address?.trim() || '';

  // Buat rincian items per ukuran
  const items = [];
  const primaryGarment = quote.garment?.name || 'NSA Softstyle 30s';
  const color = quote.garmentColor || 'Hitam';

  Object.entries(quote.sizeQuantities || {}).forEach(([size, q]) => {
    const qty = Number(q) || 0;
    if (qty > 0) {
      items.push({
        sku: `TS-CUST-${size}-${Date.now().toString().slice(-4)}`,
        name: `Custom ${primaryGarment}`,
        garment: primaryGarment,
        size: size,
        color: color,
        qty: qty,
        price: quote.recommendedUnitPrice,
        unit_price: quote.recommendedUnitPrice,
        subtotal: quote.recommendedUnitPrice * qty
      });
    }
  });

  // Fallback jika array items kosong
  if (items.length === 0) {
    items.push({
      sku: 'TS-CUST-ORDER',
      name: `Custom ${primaryGarment}`,
      garment: primaryGarment,
      size: 'L',
      color: color,
      qty: quote.totalQty || 1,
      price: quote.recommendedUnitPrice,
      unit_price: quote.recommendedUnitPrice,
      subtotal: quote.totalPrice
    });
  }

  const placementsSummary = quote.activePlacements?.map(p => p.area).join('+') || 'A3';
  const summaryNotes = `Custom Order WA: ${primaryGarment} (${color}) - DTF: ${placementsSummary}. DP: ${formatRupiah(quote.downPayment)}. Sisa: ${formatRupiah(quote.remainingPayment)}`;

  return {
    customer: customerName,
    customer_name: customerName,
    phone: customerPhone,
    customer_phone: customerPhone,
    city: customerCity,
    customer_city: customerCity,
    address: customerAddress,
    customer_address: customerAddress,
    channel: 'whatsapp',
    tier: quote.totalQty >= 12 ? 'reseller' : 'retail',
    status: 'pending',
    price: quote.totalPrice,
    total_amount: quote.totalPrice,
    qty: quote.totalQty || 1,
    items: items,
    garment: primaryGarment,
    color: color,
    size: items[0]?.size || 'L',
    productName: `Custom Apparel (${quote.totalQty} pcs)`,
    notes: summaryNotes,
    date: new Date().toISOString()
  };
}

/**
 * Ekspor Dokumen Penawaran Harga Custom ke CSV 12 Kolom (BOM UTF-8)
 */
export function exportQuotationCsv(quote, customerInfo = {}) {
  const headers = [
    'No. Penawaran',
    'Tanggal',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Model Garmen',
    'Warna Kain',
    'Total Jumlah (Pcs)',
    'Rincian Ukuran',
    'Titik Sablon DTF',
    'HPP Produksi Satuan (Rp)',
    'Harga Penawaran Satuan (Rp)',
    'Total Tagihan Proyek (Rp)',
    'Uang Muka 50% (Rp)',
    'Sisa Pelunasan (Rp)',
    'Estimasi Laba Bersih (Rp)',
    'Margin CFO (%)'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const sizeBreakdown = Object.entries(quote.sizeQuantities || {})
    .filter(([_, q]) => Number(q) > 0)
    .map(([sz, q]) => `${sz}:${q}`)
    .join('; ');

  const placementsText = quote.activePlacements?.map(p => p.name).join(' + ') || 'Depan A3';

  const row = [
    escapeCsv(`QUO-${Date.now().toString().slice(-6)}`),
    escapeCsv(new Date().toISOString().slice(0, 10)),
    escapeCsv(customerInfo.name || 'Pelanggan Custom'),
    escapeCsv(customerInfo.phone || '-'),
    escapeCsv(quote.garment?.name || 'NSA 24s'),
    escapeCsv(quote.garmentColor || 'Hitam'),
    quote.totalQty || 1,
    escapeCsv(sizeBreakdown || 'All Size'),
    escapeCsv(placementsText),
    quote.unitHpp || 0,
    quote.recommendedUnitPrice || 0,
    quote.totalPrice || 0,
    quote.downPayment || 0,
    quote.remainingPayment || 0,
    quote.totalNetProfit || 0,
    `${quote.netMarginPercent}%`
  ];

  const csvContent = '\uFEFF' + [headers.join(','), row.join(',')].join('\r\n');

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Penawaran-Custom-TeeStock-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}
