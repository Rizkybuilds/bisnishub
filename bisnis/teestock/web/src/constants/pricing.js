export const PRODUCTION_COSTS = {
  pressLabor: 2000,
  packaging: 4500, // Polymailer tebal, hangtag, stiker logo, kertas roti
  overhead: 2000,  // Listrik mesin press, internet, isolasi
  marketingBuffer: 5000, // Alokasi ads / promosi
};

export const DTF_PRINT_SIZES = [
  { id: "a6", name: "Logo Dada (A6 - 10x10 cm)", cost: 4500 },
  { id: "a4", name: "Sedang (A4 - 21x30 cm)", cost: 8500 },
  { id: "a3", name: "Standar (A3 - 30x42 cm)", cost: 12750 },
  { id: "a3_plus_a6", name: "Depan A6 + Belakang A3", cost: 17250 },
  { id: "double_a3", name: "Full Depan + Belakang (2x A3)", cost: 25500 }
];

export const VENDOR_DTF_RATES = {
  meterRate: 85000, // MultiGraph / Vendor DTF per meter roll 60 cm
  minOrderMeters: 1.0,
};

export const CHANNELS = [
  { id: "shopee", name: "Shopee", feeRate: 0.065, badge: "bg-[#EE4D2D]/20 text-[#FF6E4E] border-[#EE4D2D]/40" },
  { id: "tiktok", name: "TikTok Shop", feeRate: 0.060, badge: "bg-white/10 text-white border-white/20" },
  { id: "whatsapp", name: "WhatsApp Direct", feeRate: 0.000, badge: "bg-[#25D366]/20 text-[#4EFA8A] border-[#25D366]/40" },
  { id: "web", name: "TeeStock Storefront", feeRate: 0.015, badge: "bg-[#C1673D]/20 text-[#E2885E] border-[#C1673D]/40" },
  { id: "custom", name: "Custom / B2B", feeRate: 0.000, badge: "bg-[#D9A441]/20 text-[#ECC369] border-[#D9A441]/40" }
];
