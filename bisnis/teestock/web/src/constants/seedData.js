export const SEED_PRODUCTS = [
  {
    sku: "TS-PRO-001",
    name: "Commit & Pray",
    series: "profesi",
    seriesName: "TeeStock Profesi",
    niche: "Software Engineer / IT",
    priceRetail: 99000,
    priceReseller: 75000,
    costBlank: 38000,
    costDtf: 12750,
    filePath: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    description: "Kaos streetwear minimalis bertema developer dan programmer. Bahan NSA Softstyle 30s 100% cotton adem dan sablon DTF HD tajam tahan cuci.",
    status: "active",
    featured: true
  },
  {
    sku: "TS-PRO-002",
    name: "Architect's Blueprint",
    series: "profesi",
    seriesName: "TeeStock Profesi",
    niche: "Arsitek & Desainer",
    priceRetail: 109000,
    priceReseller: 82000,
    costBlank: 48000,
    costDtf: 12750,
    filePath: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
    description: "Visual garis isometrik denah arsitektur di atas bahan tebal NSA Heavyweight 24s. Potongan boxy modern yang nyaman dipakai seharian di proyek maupun studio.",
    status: "active",
    featured: true
  },
  {
    sku: "TS-KOM-001",
    name: "7 Summits 3000 MDPL",
    series: "komunitas",
    seriesName: "TeeStock Komunitas / Aktif",
    niche: "Pendaki Gunung / Hiking",
    priceRetail: 99000,
    priceReseller: 75000,
    costBlank: 38000,
    costDtf: 12750,
    filePath: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
    description: "Ilustrasi kontur topografi puncak-puncak tertinggi Nusantara. Dedikasi untuk jiwa-jiwa petualang alam bebas.",
    status: "active",
    featured: true
  },
  {
    sku: "TS-LOK-001",
    name: "Wong Jowo Ojo Ilang Jawane",
    series: "lokal",
    seriesName: "TeeStock Lokal",
    niche: "Filosofi Jawa / Budaya",
    priceRetail: 89000,
    priceReseller: 68000,
    costBlank: 38000,
    costDtf: 12750,
    filePath: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
    description: "Aksara Jawa stilasi modern dengan pesan pengingat akar budaya luhur. Elegan dan bermakna mendalam.",
    status: "active",
    featured: true
  },
  {
    sku: "TS-REC-001",
    name: "Crisis with Iced Coffee",
    series: "receh",
    seriesName: "TeeStock Receh / Sarkas",
    niche: "Kopi & Gaya Hidup",
    priceRetail: 99000,
    priceReseller: 75000,
    costBlank: 38000,
    costDtf: 12750,
    filePath: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    description: "Menghadapi hari berat dengan secangkir es kopi susu gula aren. Santai, jenaka, dan sangat relatable.",
    status: "active",
    featured: false
  },
  {
    sku: "TS-FAN-001",
    name: "Neo Tokyo 1988",
    series: "fandom",
    seriesName: "TeeStock Fandom",
    niche: "Retro Anime & Cyberpunk",
    priceRetail: 109000,
    priceReseller: 82000,
    costBlank: 48000,
    costDtf: 12750,
    filePath: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
    description: "Estetika anime retro cyberpunk 80-an dengan cetakan DTF warna neon di atas kaos NSA Heavyweight 24s hitam pekat.",
    status: "active",
    featured: true
  }
];

export const SEED_ORDERS = [
  {
    id: "SHP-2609-001",
    customer: "Dimas Arya",
    phone: "0812-9821-4411",
    city: "Jakarta Selatan",
    channel: "shopee",
    sku: "TS-PRO-001",
    productName: "Commit & Pray",
    garment: "NSA Softstyle 30s",
    color: "Hitam",
    size: "L",
    qty: 1,
    price: 99000,
    fee: 6435,
    status: "pending",
    date: "2026-09-04 14:20"
  },
  {
    id: "SHP-2609-002",
    customer: "Reza Fahlevi",
    phone: "0857-1122-3344",
    city: "Bandung",
    channel: "shopee",
    sku: "TS-KOM-001",
    productName: "7 Summits 3000 MDPL",
    garment: "NSA Softstyle 30s",
    color: "Olive",
    size: "XL",
    qty: 1,
    price: 99000,
    fee: 6435,
    status: "dtf",
    date: "2026-09-04 15:10"
  },
  {
    id: "WA-2609-003",
    customer: "Komunitas Kopi Pagi",
    phone: "0818-4455-6677",
    city: "Yogyakarta",
    channel: "whatsapp",
    sku: "TS-REC-001",
    productName: "Crisis with Iced Coffee",
    garment: "NSA Heavyweight 24s",
    color: "Krem",
    size: "M",
    qty: 2,
    price: 210000,
    fee: 0,
    status: "press",
    date: "2026-09-04 16:05"
  },
  {
    id: "WEB-2609-004",
    customer: "Andi Wijaya",
    phone: "0821-8899-0011",
    city: "Surabaya",
    channel: "web",
    sku: "TS-LOK-001",
    productName: "Wong Jowo Ojo Ilang",
    garment: "NSA Softstyle 30s",
    color: "Hitam",
    size: "L",
    qty: 1,
    price: 89000,
    fee: 1335,
    status: "pack",
    date: "2026-09-04 17:45"
  }
];

export const INITIAL_INVENTORY_MATRIX = {
  nsa_softstyle_30s: {
    Hitam:      { S: 4, M: 8, L: 10, XL: 6, XXL: 3, "3XL": 2 },
    Krem:       { S: 2, M: 5, L: 6,  XL: 4, XXL: 2, "3XL": 1 },
    Charcoal:   { S: 3, M: 4, L: 5,  XL: 3, XXL: 1, "3XL": 1 },
    Olive:      { S: 2, M: 4, L: 5,  XL: 3, XXL: 2, "3XL": 1 },
    Navy:       { S: 2, M: 3, L: 4,  XL: 2, XXL: 1, "3XL": 1 },
    Terracotta: { S: 1, M: 3, L: 4,  XL: 2, XXL: 1, "3XL": 0 },
    Putih:      { S: 3, M: 6, L: 6,  XL: 4, XXL: 2, "3XL": 1 }
  },
  nsa_heavyweight_24s: {
    Hitam:    { S: 3, M: 6, L: 8, XL: 5, XXL: 2, "3XL": 1 },
    Krem:     { S: 2, M: 4, L: 5, XL: 3, XXL: 1, "3XL": 1 },
    Charcoal: { S: 2, M: 3, L: 4, XL: 2, XXL: 1, "3XL": 1 },
    Olive:    { S: 1, M: 2, L: 3, XL: 2, XXL: 1, "3XL": 0 },
    Navy:     { S: 1, M: 2, L: 3, XL: 1, XXL: 1, "3XL": 0 }
  },
  nsa_longsleeve: {
    Hitam:    { S: 2, M: 4, L: 5, XL: 3, XXL: 1, "3XL": 1 },
    Putih:    { S: 1, M: 3, L: 3, XL: 2, XXL: 1, "3XL": 0 },
    Navy:     { S: 1, M: 2, L: 2, XL: 1, XXL: 1, "3XL": 0 },
    Charcoal: { S: 1, M: 2, L: 2, XL: 1, XXL: 0, "3XL": 0 }
  },
  nsa_hoodie: {
    Hitam:    { S: 1, M: 3, L: 4, XL: 3, XXL: 1, "3XL": 1 },
    Charcoal: { S: 1, M: 2, L: 2, XL: 2, XXL: 1, "3XL": 0 },
    Navy:     { S: 0, M: 2, L: 2, XL: 1, XXL: 1, "3XL": 0 }
  },
  nsa_polo: {
    Hitam: { S: 2, M: 3, L: 4, XL: 2, XXL: 1, "3XL": 1 },
    Navy:  { S: 1, M: 2, L: 3, XL: 2, XXL: 1, "3XL": 0 },
    Putih: { S: 1, M: 2, L: 2, XL: 1, XXL: 1, "3XL": 0 }
  },
  supplies: {
    "Polymailer Tebal (30x40 cm)": { Ready: 120, Min: 30 },
    "Hangtag Distro TeeStock":     { Ready: 250, Min: 50 },
    "Stiker Vinyl Pack TeeStock":  { Ready: 180, Min: 40 },
    "Kertas Roti Baking Paper":    { Ready: 45,  Min: 10 },
    "Lakban Fragile Merah":        { Ready: 6,   Min: 2  }
  }
};
