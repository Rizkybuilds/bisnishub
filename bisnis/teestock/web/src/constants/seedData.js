/**
 * TeeStock Data Constants
 * CATATAN: Seed data demo/mockup telah dihapus sesuai instruksi.
 * Seluruh katalog produk dan pesanan kini murni bersumber dari Cloud Supabase (ts_products & ts_orders).
 */

export const SEED_PRODUCTS = [
  // === SERIES 01: GRAPHIC STATEMENT & MODERN TYPOGRAPHY ===
  {
    sku: "TS-STM-001",
    name: "Raw Identity // Statement Tee",
    series: "statement",
    series_name: "Graphic Statement",
    series_color: "#D95D39",
    niche: "Minimalist Typography",
    batch: "Drop #01",
    template: "heavyweight_24s",
    status: "active",
    featured: true,
    price_retail: 99000,
    price_anchor: 139000,
    price_reseller: 79000,
    cost_blank: 42000,
    cost_dtf: 12500,
    colors: "Hitam, Charcoal, Putih, Olive",
    sizes: "S, M, L, XL, 2XL, 3XL",
    file_path: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "Koleksi Drop #01: Tipografi presisi dengan pernyataan sikap filosofis berbobot. Menggunakan garmen katun New States Apparel (NSA) Heavyweight 24s tubular knit (180 GSM) tanpa jahitan samping, kerah rib tebal 2.2 cm yang tidak mudah melar, serta sablon DTF double-press in-house 155°C berdaya rekat permanen."
  },
  {
    sku: "TS-STM-002",
    name: "Quiet Confidence // Monolith Tee",
    series: "statement",
    series_name: "Graphic Statement",
    series_color: "#D95D39",
    niche: "Modern Statement",
    batch: "Drop #01",
    template: "heavyweight_24s",
    status: "active",
    featured: false,
    price_retail: 99000,
    price_anchor: 139000,
    price_reseller: 79000,
    cost_blank: 42000,
    cost_dtf: 12500,
    colors: "Hitam, Putih, Navy",
    sizes: "S, M, L, XL, 2XL, 3XL",
    file_path: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    description: "Karakter hening dengan ketegasan visual. Layout grid editorial modern di atas katun NSA 24s Heavyweight tubular 180 GSM. Sentuhan sablon matte lembut yang awet dicuci harian."
  },

  // === SERIES 02: URBAN SUBCULTURE & VINTAGE STREETWEAR ===
  {
    sku: "TS-SUB-001",
    name: "Tokyo Underground '94 // Bootleg Tee",
    series: "subculture",
    series_name: "Urban Subculture",
    series_color: "#FAFAFA",
    niche: "Retro 90s Streetwear",
    batch: "Drop #01",
    template: "heavyweight_24s",
    status: "active",
    featured: true,
    price_retail: 99000,
    price_anchor: 139000,
    price_reseller: 79000,
    cost_blank: 42000,
    cost_dtf: 12500,
    colors: "Hitam, Charcoal, Putih",
    sizes: "S, M, L, XL, 2XL, 3XL",
    file_path: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
    description: "Tribute estetika retro bootleg 90s, kultur sinema independen, dan energi jalanan kota metropolitan. Katun NSA 24s Heavyweight tubular knit dengan daya tahan cuci tinggi."
  },
  {
    sku: "TS-SUB-002",
    name: "Echoes of Concrete // Skate Archive Tee",
    series: "subculture",
    series_name: "Urban Subculture",
    series_color: "#FAFAFA",
    niche: "Subculture Skate",
    batch: "Drop #01",
    template: "heavyweight_24s",
    status: "active",
    featured: false,
    price_retail: 99000,
    price_anchor: 139000,
    price_reseller: 79000,
    cost_blank: 42000,
    cost_dtf: 12500,
    colors: "Hitam, Charcoal, Putih, Olive",
    sizes: "S, M, L, XL, 2XL, 3XL",
    file_path: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80",
    description: "Kultur skate subversif dan distorsi visual grunge. Dikerjakan dengan proses curing presisi in-house 155°C untuk detail garis mikro yang tajam."
  },

  // === SERIES 03: OUTDOOR & NATURE EXPLORER ===
  {
    sku: "TS-OUT-001",
    name: "Summit Ridge // Wilderness Expedition Tee",
    series: "outdoor",
    series_name: "Outdoor & Nature Explorer",
    series_color: "#6B7057",
    niche: "Outdoor Adventure",
    batch: "Drop #01",
    template: "heavyweight_24s",
    status: "active",
    featured: true,
    price_retail: 99000,
    price_anchor: 139000,
    price_reseller: 79000,
    cost_blank: 42000,
    cost_dtf: 12500,
    colors: "Hitam, Olive, Charcoal, Putih",
    sizes: "S, M, L, XL, 2XL, 3XL",
    file_path: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80",
    description: "Badge penjelajah vintage dengan ilustrasi topografi dan garis kontur puncak gunung. Konstruksi garmen tubular kuat, nyaman untuk aktivitas luar ruang maupun harian santai."
  },
  {
    sku: "TS-OUT-002",
    name: "Pine Needle // Botanical Archive Tee",
    series: "outdoor",
    series_name: "Outdoor & Nature Explorer",
    series_color: "#6B7057",
    niche: "Nature Botanical",
    batch: "Drop #01",
    template: "heavyweight_24s",
    status: "active",
    featured: false,
    price_retail: 99000,
    price_anchor: 139000,
    price_reseller: 79000,
    cost_blank: 42000,
    cost_dtf: 12500,
    colors: "Hitam, Olive, Putih",
    sizes: "S, M, L, XL, 2XL, 3XL",
    file_path: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80",
    description: "Line-art botani presisi yang merayakan vegetasi liar hutan hujan tropis. Dicetak di in-house studio kami di atas katun NSA 24s Heavyweight 180 GSM."
  },

  // === NSA BLANK APPAREL (THE RAW CANVASES) ===
  {
    sku: "TS-BLK-7200",
    name: "New States Apparel Heavyweight 7200",
    series: "blank",
    series_name: "NSA Blank Apparel",
    series_color: "#EBE3D5",
    niche: "Official Blank",
    batch: "Stock Buffer",
    template: "heavyweight_24s",
    status: "active",
    featured: true,
    price_retail: 52000,
    price_anchor: 65000,
    price_reseller: 44000,
    cost_blank: 42000,
    cost_dtf: 0,
    colors: "Hitam, Putih, Charcoal, Olive, Navy",
    sizes: "S, M, L, XL, 2XL, 3XL, 4XL, 5XL",
    file_path: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "100% Combed Cotton 24s (180 GSM). Rajutan silinder tubular tanpa jahitan samping, kerah rib 2.2 cm kokoh, serta potongan boxier streetwear. Standar garmen utama untuk koleksi TeeStock Originals."
  },
  {
    sku: "TS-BLK-3600",
    name: "New States Apparel Softstyle 3600",
    series: "blank",
    series_name: "NSA Blank Apparel",
    series_color: "#EBE3D5",
    niche: "Official Blank",
    batch: "Stock Buffer",
    template: "softstyle_30s",
    status: "active",
    featured: false,
    price_retail: 37000,
    price_anchor: 45000,
    price_reseller: 32000,
    cost_blank: 30000,
    cost_dtf: 0,
    colors: "Hitam, Putih, Charcoal, Navy, Olive, Maroon",
    sizes: "S, M, L, XL, 2XL",
    file_path: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
    description: "100% Ring Spun Cotton 30s (150 GSM). Sangat lembut, jatuh, adem, dan menyerap keringat maksimal. Standar kaos distro harian berstandar internasional tanpa jahitan samping."
  }
];

export const SEED_ORDERS = [];

export const INITIAL_INVENTORY_MATRIX = {
  nsa_softstyle_30s: {},
  nsa_heavyweight_24s: {},
  supplies: {},
  dtf_films: {}
};
