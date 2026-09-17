/**
 * TeeStock Production & Unit Economics Constants
 * Updated September 2026 based on real NSA Distributor & Vendor DTF parameters
 */

export const PRODUCTION_COSTS = {
  pressLabor: 5000,    // Ongkos pengerjaan heat press & penataan (Rp 5.000 - Rp 7.000)
  packaging: 2000,     // Kemasan polymailer, stiker logo, thank you card
  overhead: 1000,      // Listrik mesin press & isolasi tahan panas
};

// Estimasi biaya sablon DTF berdasarkan ukuran
export const DTF_PRINT_SIZES = [
  { id: "a6", name: "Logo Dada (A6 - 10x10 cm)", cost: 4500 },
  { id: "a4", name: "Sedang (A4 - 21x30 cm)", cost: 8500 },
  { id: "a3", name: "Studio Standard (A3 - 28x40 cm)", cost: 12500 },
  { id: "a3_plus_a6", name: "Depan A6 + Belakang A3", cost: 16500 },
  { id: "double_a3", name: "Full Depan + Belakang (2x A3)", cost: 24000 }
];

// Vendor cetak roll meteran DTF lebar 58-60 cm
export const VENDOR_DTF_RATES = {
  meterRateMin: 28000, // Harga grosir vendor DTF (Rp 28.000/m)
  meterRateMax: 35000, // Harga standar vendor DTF (Rp 35.000/m)
  meterRate: 30000,    // Baseline estimasi
  minOrderMeters: 1.0,
};

// Tarif Layanan Sablon DTF Resmi TeeStock (Piagam Kesepakatan 17 Sept 2026)
export const DTF_SERVICE_RATES = {
  logo: { id: 'logo', name: 'Logo Saku (A6 - 10x10 cm)', retail: 6000, tier12: 5500, tier36: 5000, tier72: 4500 },
  a5: { id: 'a5', name: 'Sedang (A5 - 14x20 cm)', retail: 10000, tier12: 9000, tier36: 8000, tier72: 7000 },
  a4: { id: 'a4', name: 'Depan Standar (A4 - 21x30 cm)', retail: 17000, tier12: 16000, tier36: 14000, tier72: 12000 },
  a3: { id: 'a3', name: 'Punggung Standar (A3 - 28x40 cm)', retail: 25000, tier12: 23000, tier36: 21000, tier72: 18000 },
  a3_plus: { id: 'a3_plus', name: 'Graphic Punggung (A3+ - 30x42 cm)', retail: 35000, tier12: 32000, tier36: 29000, tier72: 25000 },
  a2: { id: 'a2', name: 'Jumbo Streetwear (A2 - 42x60 cm)', retail: 45000, tier12: 41000, tier36: 37000, tier72: 32000 },
};

// Standar Margin Kaos Polos Resmi (Piagam Kesepakatan 17 Sept 2026)
export const BLANK_MARGINS = {
  retail: 3000,   // Eceran < 12 pcs (+Rp 3.000 dari vendor)
  grosir: 2000,   // Lusinan >= 12 pcs (+Rp 2.000 dari vendor)
  partai: 1000,   // Partai >= 72 pcs (+Rp 1.000 dari vendor)
  reseller: 1000  // Reseller all tiers (+Rp 1.000 dari vendor)
};

// Estimasi komisi/potongan marketplace
export const CHANNELS = [
  { id: "shopee", name: "Shopee", feeRate: 0.120, badge: "bg-[#EE4D2D]/20 text-[#FF6E4E] border-[#EE4D2D]/40" },
  { id: "tiktok", name: "TikTok Shop", feeRate: 0.115, badge: "bg-white/10 text-white border-white/20" },
  { id: "whatsapp", name: "WhatsApp Direct", feeRate: 0.000, badge: "bg-[#25D366]/20 text-[#4EFA8A] border-[#25D366]/40" },
  { id: "web", name: "TeeStock Storefront", feeRate: 0.000, badge: "bg-[#C1673D]/20 text-[#E2885E] border-[#C1673D]/40" },
  { id: "custom", name: "Custom / B2B", feeRate: 0.000, badge: "bg-[#D9A441]/20 text-[#ECC369] border-[#D9A441]/40" }
];

// Surcharge untuk ukuran jumbo (tambahan modal garmen dari distributor)
export const SIZE_SURCHARGES = {
  "XXL": 5000,
  "2XL": 5000,
  "3XL": 10000,
  "4XL": 15000,
  "5XL": 20000,
};

export const LONG_SLEEVE_SIZE_SURCHARGES = {
  "XXL": 7000,
  "2XL": 7000,
  "3XL": 14000,
  "4XL": 21000,
  "5XL": 28000,
};

export function getSizeSurcharge(size, isLongSleeve = false) {
  if (!size) return 0;
  const clean = String(size).toUpperCase().trim();
  if (isLongSleeve) {
    return LONG_SLEEVE_SIZE_SURCHARGES[clean] || 0;
  }
  return SIZE_SURCHARGES[clean] || 0;
}

/**
 * Kalkulasi harga dasar kaos polos NSA (7200, 3600, 7280, 72Y00, 7250, 7260)
 * berbasis Piagam Kesepakatan & Dokumen Riset Vendor:
 * Margin: Retail +3k, Grosir +2k, Partai +1k, Reseller +1k.
 */
export function getBlankPricing(product, colorName = 'Black', role = 'retail', size = 'L', qty = 1) {
  const sku = (product?.sku || '').toUpperCase();
  const name = (product?.name || '').toLowerCase();

  const is3600 = sku.includes('3600') || name.includes('3600') || product?.template === 'softstyle_30s';
  const is7280 = sku.includes('7280') || sku.includes('-LS') || name.includes('7280') || name.includes('long sleeve');
  const is72Y00 = sku.includes('72Y00') || sku.includes('-YOUTH') || name.includes('72y00') || name.includes('youth');
  const is7250 = sku.includes('7250') || name.includes('7250') || name.includes('ringer');
  const is7260 = sku.includes('7260') || name.includes('7260') || name.includes('raglan');
  const is7200 = sku.includes('7200') || name.includes('7200') || (!is3600 && !is7280 && !is72Y00 && !is7250 && !is7260);

  const cleanColor = String(colorName || '').trim().toLowerCase();
  const isWhite = cleanColor === 'white' || cleanColor === 'putih';
  const isReseller = role === 'reseller' || role === 'partner' || role === 'dropship';
  const surcharge = getSizeSurcharge(size, is7280);

  const margin = isReseller 
    ? BLANK_MARGINS.reseller 
    : qty >= 72 
    ? BLANK_MARGINS.partai 
    : qty >= 12 
    ? BLANK_MARGINS.grosir 
    : BLANK_MARGINS.retail;

  let vendorCostBase;

  if (is3600) {
    if (qty >= 72) {
      vendorCostBase = isWhite ? 29000 : 32000;
    } else if (qty >= 12) {
      vendorCostBase = isWhite ? 32000 : 35000;
    } else {
      vendorCostBase = isWhite ? 34000 : 37000;
    }
  } else if (is7280) {
    if (qty >= 72) {
      vendorCostBase = isWhite ? 48000 : 51000;
    } else if (qty >= 12) {
      vendorCostBase = isWhite ? 51000 : 54000;
    } else {
      vendorCostBase = isWhite ? 53000 : 56000;
    }
  } else if (is72Y00) {
    if (qty >= 72) {
      vendorCostBase = 28000;
    } else if (qty >= 12) {
      vendorCostBase = 31000;
    } else {
      vendorCostBase = 33000;
    }
  } else if (is7250) {
    if (qty >= 72) {
      vendorCostBase = 40000;
    } else if (qty >= 12) {
      vendorCostBase = 43000;
    } else {
      vendorCostBase = 45000;
    }
  } else if (is7260) {
    if (qty >= 72) {
      vendorCostBase = 50000;
    } else if (qty >= 12) {
      vendorCostBase = 53000;
    } else {
      vendorCostBase = 55000;
    }
  } else {
    // Default: NSA 7200
    if (qty >= 72) {
      vendorCostBase = isWhite ? 34000 : 37000;
    } else if (qty >= 12) {
      vendorCostBase = isWhite ? 37000 : 40000;
    } else {
      vendorCostBase = isWhite ? 39000 : 42000;
    }
  }

  const vendorCostTotal = vendorCostBase + surcharge;
  const unitPrice = vendorCostBase + margin;
  const finalPrice = unitPrice + surcharge;
  const minFloorPrice = vendorCostTotal + 1000;

  return {
    basePrice: finalPrice,
    unitPrice,
    vendorCost: vendorCostTotal,
    minFloorPrice,
    surcharge,
    targetProfit: margin,
    isWhite,
    is3600,
    is7200,
    is7280,
    is72Y00,
    is7250,
    is7260,
    tier: isReseller ? 'reseller' : qty >= 72 ? 'partai' : qty >= 12 ? 'grosir' : 'retail'
  };
}

// Penawaran Paket Bundling Ritel (AOV Booster - Khusus Kaos Grafis)
export const BUNDLE_DEALS = [
  {
    minQty: 2,
    pricePerItem: 90000,
    savingsTotal: 18000,
    badge: "HEMAT RP 18.000",
    title: "Paket Duo (2 Pcs)",
    tagline: "Beli 2 Kaos @Rp 90.000",
    description: "Bebas pilih desain, warna, & ukuran. Hemat Rp 18.000 + subsidi ongkir.",
    highlight: false
  },
  {
    minQty: 3,
    pricePerItem: 85000,
    savingsTotal: 42000,
    badge: "HEMAT RP 42.000 (BEST VALUE)",
    title: "Paket Trio (3 Pcs)",
    tagline: "Beli 3 Kaos @Rp 85.000",
    description: "Harga terhemat untuk koleksi lengkap. Diskon langsung Rp 42.000.",
    highlight: true
  }
];

/**
 * Hitung diskon bundling otomatis untuk customer ritel
 * PENTING: Hanya berlaku untuk kaos grafis (non-blank) untuk melindungi margin kaos polos!
 */
export function calculateBundleDiscount(graphicQty, role = 'retail') {
  if (role === 'reseller' || role === 'dropship') return 0;
  if (!graphicQty || graphicQty < 2) return 0;
  
  if (graphicQty >= 3) {
    return (99000 - 85000) * graphicQty; // Rp 14.000 hemat per pcs kaos grafis
  }
  if (graphicQty === 2) {
    return 18000; // Rp 18.000 hemat total (Rp 9.000/pcs)
  }
  return 0;
}

/**
 * 🚚 Zona Tarif Ongkir Standar Ekspedisi Nasional (JNE / J&T / SiCepat dari Bandung/Jakarta)
 * Mencegah kebocoran subsidi margin ritel ke luar pulau Jawa.
 */
export const SHIPPING_ZONES = [
  { id: 'jabodetabek_jabar', name: 'Jabodetabek & Jawa Barat', rate: 10000, eta: '1-2 Hari' },
  { id: 'jawa_lainnya', name: 'Jawa Tengah, Jawa Timur, & DIY', rate: 15000, eta: '2-3 Hari' },
  { id: 'luar_jawa_kota', name: 'Luar Jawa — Kota Besar (Sumatera, Bali, Kalbar, Sulsel)', rate: 28000, eta: '3-4 Hari' },
  { id: 'luar_jawa_timur', name: 'Luar Jawa — Wilayah Lainnya & Indonesia Timur', rate: 45000, eta: '4-7 Hari' }
];

export function getShippingRateByZone(zoneId) {
  const zone = SHIPPING_ZONES.find(z => z.id === zoneId);
  return zone ? zone.rate : 15000;
}

/**
 * 📦 Standar Biaya Satuan Kemasan & Operasional TeeStock (September 2026)
 * Sesuai arahan Founder & C-Suite:
 * - Packing: Polymailer (800) + Stiker (600) + Lakban & Label Thermal A6 (600) = Rp 2.000
 * - Operasional: Listrik Heat Press In-House 900W & Curing = Rp 1.000
 * - DTF Rates: Roll 58x100 cm @ Rp 35.000 terbagi proporsional per ukuran
 */
export const UNIT_COST_STANDARDS = {
  packaging: 2000,
  electricity: 1000,
  dtfRates: {
    a6: 2000,
    logo: 2000,
    a5: 4500,
    a4: 7500,
    a3: 12500,
    a3_plus: 14500,
    a3_plus_a6: 14500,
    a2: 24000,
    double_a3: 24000
  }
};

/**
 * 🧮 Hitung HPP dan Harga ARB (Auto Rijek Bawah)
 * Aturan:
 * - HPP Blank = HPP Kaos + Packing
 * - HPP Katalog Grafis = HPP Kaos + HPP DTF + Packing + Operasional Listrik
 * - Harga ARB = HPP Total + 10% Profit Bersih (Dibulatkan ke atas / Math.ceil ke Rp 1.000)
 */
export function calculateProductHPPAndARB({ garmentCost = 38000, printSize = 'a3', isBlank = false }) {
  const packCost = UNIT_COST_STANDARDS.packaging;
  const electCost = isBlank ? 0 : UNIT_COST_STANDARDS.electricity;
  const dtfCost = isBlank ? 0 : (UNIT_COST_STANDARDS.dtfRates[printSize] || 12500);

  const totalHPP = garmentCost + dtfCost + packCost + electCost;
  const rawARB = totalHPP * 1.10;
  const arbFloorPrice = Math.ceil(rawARB / 1000) * 1000;

  return {
    garmentCost,
    dtfCost,
    packCost,
    electCost,
    totalHPP,
    arbFloorPrice
  };
}

/**
 * 🛡️ ARB Guard Engine: Validasi apakah harga akhir setelah promo/diskon aman
 * Menolak pemotongan harga yang tembus di bawah floor price (ARB)!
 */
export function applyARBGuard(calculatedPrice, arbFloorPrice) {
  if (calculatedPrice < arbFloorPrice) {
    return {
      finalPrice: arbFloorPrice,
      isFloorClamped: true,
      message: 'Diskon optimal maksimal telah diterapkan untuk menjaga standar kualitas material.'
    };
  }
  return {
    finalPrice: calculatedPrice,
    isFloorClamped: false,
    message: null
  };
}

/**
 * 👕 Opsi Model Garmen Resmi TeeStock (Cititex Vendor Agreement 2026)
 */
export const GARMENT_OPTIONS = [
  {
    id: 'nsa_heavyweight_24s',
    name: 'NSA Premium Cotton 7200 (24s)',
    shortName: 'NSA 7200 (24s Heavyweight)',
    vendorCostColor: 42000,
    vendorCostWhite: 39000,
    retailPriceColor: 45000,
    retailPriceWhite: 42000,
    isDefault: true,
    badge: 'Hero Anchor',
    desc: 'Bahan 24s gramasi 180 gsm, tebal, adem, standar streetwear internasional.'
  },
  {
    id: 'nsa_softstyle_30s',
    name: 'NSA Softstyle 3600 (30s)',
    shortName: 'NSA 3600 (30s Softstyle)',
    vendorCostColor: 37000,
    vendorCostWhite: 34000,
    retailPriceColor: 40000,
    retailPriceWhite: 37000,
    isDefault: false,
    badge: 'Value Edition',
    desc: 'Bahan 30s gramasi 150 gsm, lebih tipis dan ringan, cocok untuk cuaca tropis.'
  },
  {
    id: 'nsa_longsleeve',
    name: 'NSA 7280 Long Sleeve (24s)',
    shortName: 'NSA 7280 (Lengan Panjang)',
    vendorCostColor: 56000,
    vendorCostWhite: 53000,
    retailPriceColor: 59000,
    retailPriceWhite: 56000,
    isDefault: false,
    badge: 'Long Sleeve',
    desc: 'Kaos lengan panjang rib cuff tebal premium 24s.'
  },
  {
    id: 'nsa_youth',
    name: 'NSA Premium Cotton Youth Kids 72Y00 (24s)',
    shortName: 'NSA 72Y00 (Anak-anak)',
    vendorCostColor: 33000,
    vendorCostWhite: 33000,
    retailPriceColor: 36000,
    retailPriceWhite: 36000,
    isDefault: false,
    badge: 'Kids Apparel',
    desc: 'Kaos anak 100% cotton combed 24s lembut aman untuk kulit anak.'
  },
  {
    id: 'nsa_ringer',
    name: 'NSA 7250 Ringer Tee (24s)',
    shortName: 'NSA 7250 (Ringer Retro)',
    vendorCostColor: 45000,
    vendorCostWhite: 45000,
    retailPriceColor: 48000,
    retailPriceWhite: 48000,
    isDefault: false,
    badge: 'Retro Contrast',
    desc: 'Kerah dan lingkar lengan berwarna kontras retro 70s.'
  },
  {
    id: 'nsa_raglan',
    name: 'NSA 7260 Raglan 3/4 (24s)',
    shortName: 'NSA 7260 (Raglan 3/4)',
    vendorCostColor: 55000,
    vendorCostWhite: 55000,
    retailPriceColor: 58000,
    retailPriceWhite: 58000,
    isDefault: false,
    badge: 'Baseball 3/4',
    desc: 'Lengan 3/4 baseball style kombinasi dua warna.'
  }
];

/**
 * 🎨 Kualitas & Alokasi Nilai Desain (Curated Tier Strategy)
 */
export const DESIGN_TIERS = [
  {
    id: 'tier1_minimalist',
    name: 'Minimalist / Typo',
    shortLabel: 'Minimalist (Rp 10k)',
    value: 10000,
    desc: 'Tipografi simpel, teks 1 baris, atau line art monokrom.',
    badge: 'Entry'
  },
  {
    id: 'tier2_signature',
    name: 'Signature Graphic (Hero)',
    shortLabel: 'Signature (Rp 16k)',
    value: 16000,
    desc: 'Desain hero grafis utama TeeStock (Anchor Rp 99.000).',
    badge: 'Hero Anchor'
  },
  {
    id: 'tier3_masterpiece',
    name: 'Masterpiece Artwork',
    shortLabel: 'Masterpiece (Rp 26k)',
    value: 26000,
    desc: 'Ilustrasi detail kompleks, lukisan vintage, atau multi-layer art.',
    badge: 'Artistic'
  },
  {
    id: 'tier4_collab',
    name: 'Limited Collab Drop',
    shortLabel: 'Limited Drop (Rp 36k)',
    value: 36000,
    desc: 'Karya eksklusif kolaborasi kreator tamu / rilis nomor terbatas.',
    badge: 'Exclusive'
  },
  {
    id: 'custom',
    name: 'Kustom Nilai Desain',
    shortLabel: 'Custom',
    value: 0,
    desc: 'Tentukan sendiri alokasi nilai desain secara manual.',
    badge: 'Custom'
  }
];

/**
 * 🎨 Palet Warna Terkurasi TeeStock
 * Mencegah komplain grafis mati karena salah warna kaos
 */
export const CURATED_COLORS = [
  { id: 'Hitam', name: 'Hitam (Black)', hex: '#111111', border: '#333333', dark: true },
  { id: 'Krem', name: 'Krem (Sand)', hex: '#E6DCB8', border: '#C5B990', dark: false },
  { id: 'Putih', name: 'Putih (White)', hex: '#FFFFFF', border: '#D4D4D8', dark: false },
  { id: 'Charcoal', name: 'Charcoal (Abu Tua)', hex: '#36454F', border: '#4B5563', dark: true },
  { id: 'Forest Green', name: 'Forest Green', hex: '#1E3A2F', border: '#2D5545', dark: true },
  { id: 'Maroon', name: 'Maroon', hex: '#5C1D24', border: '#7A2730', dark: true },
  { id: 'Navy', name: 'Navy (Biru Gelap)', hex: '#1B263B', border: '#2C3E55', dark: true },
  { id: 'Terracotta', name: 'Terracotta (Bata)', hex: '#C1673D', border: '#A5532E', dark: true },
  { id: 'Mustard', name: 'Mustard (Gold)', hex: '#D4A373', border: '#BC8A57', dark: false },
  { id: 'Military Olive', name: 'Military Olive', hex: '#4B5320', border: '#606A29', dark: true }
];

/**
 * 📍 Pilihan Ukuran Sablon per Zona / Titik Cetak
 */
export const PRINT_PLACEMENTS = {
  front: [
    { id: 'none', name: 'Tidak Ada', shortName: 'None', rate: 0, filmCost: 0 },
    { id: 'logo', name: 'Logo Dada / Saku (A6 - 10x10 cm)', shortName: 'Logo A6', rate: 6000, filmCost: 2000 },
    { id: 'a5', name: 'Dada Sedang (A5 - 14x20 cm)', shortName: 'Dada A5', rate: 10000, filmCost: 4500 },
    { id: 'a4', name: 'Depan Standar (A4 - 21x30 cm)', shortName: 'Depan A4', rate: 17000, filmCost: 7500 },
    { id: 'a3', name: 'Full Front Graphic (A3 - 28x40 cm)', shortName: 'Depan A3', rate: 25000, filmCost: 12500 },
  ],
  back: [
    { id: 'none', name: 'Tidak Ada', shortName: 'None', rate: 0, filmCost: 0 },
    { id: 'logo', name: 'Logo Leher / Tengkuk (A6 - 10x10 cm)', shortName: 'Logo A6', rate: 6000, filmCost: 2000 },
    { id: 'a5', name: 'Punggung Sedang (A5 - 14x20 cm)', shortName: 'Punggung A5', rate: 10000, filmCost: 4500 },
    { id: 'a4', name: 'Punggung Standar (A4 - 21x30 cm)', shortName: 'Punggung A4', rate: 17000, filmCost: 7500 },
    { id: 'a3', name: 'Punggung Standar (A3 - 28x40 cm)', shortName: 'Punggung A3', rate: 25000, filmCost: 12500 },
    { id: 'a3_plus', name: 'Graphic Punggung (A3+ - 30x42 cm)', shortName: 'Punggung A3+', rate: 35000, filmCost: 14500 },
    { id: 'a2', name: 'Jumbo Streetwear (A2 - 42x60 cm)', shortName: 'Punggung A2', rate: 45000, filmCost: 24000 },
  ],
  sleeve: [
    { id: 'none', name: 'Tidak Ada', shortName: 'None', rate: 0, filmCost: 0 },
    { id: 'left', name: 'Lengan / Bahu Kiri (A6 - 8x8 cm)', shortName: 'Lengan Kiri', rate: 5000, filmCost: 1500 },
    { id: 'right', name: 'Lengan / Bahu Kanan (A6 - 8x8 cm)', shortName: 'Lengan Kanan', rate: 5000, filmCost: 1500 },
    { id: 'both', name: 'Kedua Lengan (2x A6)', shortName: 'Kedua Lengan', rate: 9000, filmCost: 3000 },
  ]
};

/**
 * 🎯 Preset Kombinasi Titik Sablon Populer Distro
 */
export const PRINT_PRESETS = [
  {
    id: 'back_a3_plus',
    name: 'Punggung A3+ Saja (Hero Graphic)',
    shortName: 'Punggung A3+',
    placements: { front: 'none', back: 'a3_plus', sleeve: 'none' },
    desc: 'Standar hero TeeStock: Punggung penuh A3+ (Anchor Rp 99rb)',
    badge: 'Hero Anchor',
    isDefault: true
  },
  {
    id: 'front_a4',
    name: 'Depan A4 Saja (Minimal Front)',
    shortName: 'Depan A4',
    placements: { front: 'a4', back: 'none', sleeve: 'none' },
    desc: 'Cetak depan saja ukuran A4 (Ekonomis Rp 75rb)',
    badge: 'Ekonomis',
    isDefault: false
  },
  {
    id: 'front_a6_back_a3_plus',
    name: 'Dada Logo (A6) + Punggung (A3+)',
    shortName: 'Dada A6 + Punggung A3+',
    placements: { front: 'logo', back: 'a3_plus', sleeve: 'none' },
    desc: 'Streetwear distro: Logo saku dada + artwork penuh punggung',
    badge: 'Streetwear Duo',
    isDefault: false
  },
  {
    id: 'front_a4_back_a3',
    name: 'Depan A4 + Punggung A3',
    shortName: 'Depan A4 + Punggung A3',
    placements: { front: 'a4', back: 'a3', sleeve: 'none' },
    desc: 'Grafis depan sedang A4 dipadu artwork punggung A3',
    badge: 'Double Graphic',
    isDefault: false
  },
  {
    id: 'front_a6_back_a3_plus_sleeve',
    name: 'Full Combo: Dada A6 + Punggung A3+ + Lengan',
    shortName: 'Full Combo (+Bahu)',
    placements: { front: 'logo', back: 'a3_plus', sleeve: 'left' },
    desc: 'Cetak 3 titik: Dada saku, punggung penuh, dan aksen bahu/lengan',
    badge: 'Full Streetwear',
    isDefault: false
  },
  {
    id: 'custom',
    name: '⚙️ Kustom Titik Cetak Bebas',
    shortName: 'Kustom Zona',
    placements: null,
    desc: 'Atur bebas ukuran untuk depan, belakang, dan lengan secara terpisah',
    badge: 'Kustom',
    isDefault: false
  }
];

/**
 * 🧮 Kalkulator Auto-Pricing Resmi Katalog TeeStock (Zero-Manual Input)
 * Formula Piagam: Kaos Polos + Sablon DTF Multi-Titik + Kemasan (3k) + Nilai Desain
 */
export function calculateCatalogAutoPrice({
  garmentId = 'nsa_heavyweight_24s',
  printSizeId = null,
  printPreset = null,
  printPlacements = null,
  designValue = 16000,
  resellerDiscountPercent = 25,
  isWhite = false
}) {
  const garment = GARMENT_OPTIONS.find(g => g.id === garmentId) || GARMENT_OPTIONS[0];

  // Resolve placements
  let placements = { front: 'none', back: 'a3_plus', sleeve: 'none' };

  if (printPlacements && typeof printPlacements === 'object') {
    placements = {
      front: printPlacements.front || 'none',
      back: printPlacements.back || 'none',
      sleeve: printPlacements.sleeve || 'none'
    };
  } else if (printPreset && printPreset !== 'custom') {
    const preset = PRINT_PRESETS.find(p => p.id === printPreset);
    if (preset?.placements) {
      placements = preset.placements;
    }
  } else if (printSizeId) {
    // Backwards-compatible single placement mapping
    if (printSizeId === 'logo' || printSizeId === 'a6') {
      placements = { front: 'logo', back: 'none', sleeve: 'none' };
    } else if (printSizeId === 'a4') {
      placements = { front: 'a4', back: 'none', sleeve: 'none' };
    } else if (printSizeId === 'a3_plus_a6') {
      placements = { front: 'logo', back: 'a3_plus', sleeve: 'none' };
    } else {
      placements = { front: 'none', back: printSizeId, sleeve: 'none' };
    }
  }

  // Hitung akumulasi tarif jasa & modal film DTF per titik cetak
  const frontItem = PRINT_PLACEMENTS.front.find(p => p.id === placements.front) || { rate: 0, filmCost: 0 };
  const backItem = PRINT_PLACEMENTS.back.find(p => p.id === placements.back) || { rate: 0, filmCost: 0 };
  const sleeveItem = PRINT_PLACEMENTS.sleeve.find(p => p.id === placements.sleeve) || { rate: 0, filmCost: 0 };

  let dtfRate = frontItem.rate + backItem.rate + sleeveItem.rate;
  let dtfFilmCost = frontItem.filmCost + backItem.filmCost + sleeveItem.filmCost;

  // Fallback safety
  if (dtfRate === 0) {
    dtfRate = 35000;
    dtfFilmCost = 14500;
  }

  const packagingCost = 3000;
  const pressAndBuffer = 2000;

  const garmentRetail = isWhite ? garment.retailPriceWhite : garment.retailPriceColor;
  const garmentVendorCost = isWhite ? garment.vendorCostWhite : garment.vendorCostColor;

  const retailPrice = garmentRetail + dtfRate + packagingCost + Number(designValue || 0);
  const resellerDiscount = Math.max(0, Math.min(100, Number(resellerDiscountPercent ?? 25)));
  const resellerPrice = Math.round(retailPrice * (1 - resellerDiscount / 100));

  // Modal Fisik Riil
  const physicalCogs = garmentVendorCost + dtfFilmCost + packagingCost + pressAndBuffer;

  return {
    retailPrice,
    resellerPrice,
    garmentRetail,
    garmentVendorCost,
    dtfRate,
    dtfFilmCost,
    placements,
    frontRate: frontItem.rate,
    backRate: backItem.rate,
    sleeveRate: sleeveItem.rate,
    packagingCost,
    pressAndBuffer,
    designValue: Number(designValue || 0),
    resellerDiscount,
    physicalCogs,
    grossProfitRetail: retailPrice - physicalCogs,
    grossMarginRetail: retailPrice > 0 ? (((retailPrice - physicalCogs) / retailPrice) * 100).toFixed(1) : 0,
    grossProfitReseller: resellerPrice - physicalCogs,
    grossMarginReseller: resellerPrice > 0 ? (((resellerPrice - physicalCogs) / resellerPrice) * 100).toFixed(1) : 0
  };
}


