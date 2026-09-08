/**
 * TeeStock Production & Unit Economics Constants
 * Updated September 2026 based on real NSA Distributor & Vendor DTF parameters
 */

export const PRODUCTION_COSTS = {
  pressLabor: 5000,    // Ongkos pengerjaan heat press & penataan (Rp 5.000 - Rp 7.000)
  packaging: 2000,     // Kemasan polymailer, stiker logo, thank you card
  overhead: 1000,      // Listrik mesin press & isolasi tahan panas
};

// Biaya garmen bahan New States Apparel (Distributor NSA)
export const GARMENT_BASE_PRICING = {
  nsa_softstyle_30s: {
    wholesale: 32000,
    retail: 37000,
  },
  nsa_heavyweight_24s: {
    wholesale: 37000,  // Grosir min 72 pcs
    retail: 42000,     // Beli satuan / retail
  }
};

// Estimasi biaya sablon DTF berdasarkan ukuran
export const DTF_PRINT_SIZES = [
  { id: "a6", name: "Logo Dada (A6 - 10x10 cm)", cost: 4500 },
  { id: "a4", name: "Sedang (A4 - 21x30 cm)", cost: 8500 },
  { id: "a3", name: "Standar Distro (A3 - 28x40 cm)", cost: 12500 },
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

// Arsitektur Harga (Anchor Pricing & Multi-Tier)
export const TIER_PRICING = {
  anchorPrice: 139000,       // Harga coret psikologis (nilai pasar distro)
  retailDisplay: 99000,      // Harga etalase standar di web
  promoCampaign: 89000,      // Harga promo event / flash sale
  partnerReseller: 65000,    // HPP grosir Rp 56k + profit ~16% (min 12 pcs)
  partnerDropship: 75000,    // HPP eceran Rp 64k + profit ~17% (satuan white-label)
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
  XXL: 5000,
  "3XL": 10000,
};

export function getSizeSurcharge(size) {
  if (!size) return 0;
  return SIZE_SURCHARGES[size.toUpperCase()] || 0;
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

