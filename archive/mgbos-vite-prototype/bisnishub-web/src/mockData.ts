import { BusinessConfig, Transaction, HppItem, Order, Vendor, ContentPlan } from './types'

export const BUSINESSES: BusinessConfig[] = [
  {
    id: 'all',
    name: 'Semua Bisnis (MultiGraph Holding)',
    tagline: 'Ringkasan Ekosistem Percetakan & Apparel',
    color: '#38BDF8',
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    border: 'border-sky-500/40'
  },
  {
    id: 'teestock',
    name: 'TeeStock Apparel',
    tagline: 'Curated Graphic Apparel & Merch',
    color: '#D95D39',
    badgeBg: 'bg-[#D95D39]/10 text-[#F8704A] border-[#D95D39]/30',
    border: 'border-[#D95D39]/40'
  },
  {
    id: 'multigraph',
    name: 'MultiGraph Printing',
    tagline: 'Packaging & Commercial Print Collateral',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500/40'
  }
]

export const INITIAL_TRANSACTIONS: Transaction[] = []


export const INITIAL_HPP_TEMPLATES: HppItem[] = [
  {
    id: 'hpp-01',
    name: 'Kaos Graphic NSA Heavyweight 24s (A3 DTF + Full Pack)',
    blankCost: 38000,
    dtfCost: 10000,
    electricCost: 1500,
    packCost: 3000, // Polymailer + Stiker MultiGraph + Care Card
    overheadCost: 1500,
    bufferDefectRate: 0.05,
    retailPrice: 99000,
    platformFeeRate: 0.015
  },
  {
    id: 'hpp-02',
    name: 'Kaos Graphic NSA Softstyle 30s (A3 DTF + Full Pack)',
    blankCost: 32000,
    dtfCost: 10000,
    electricCost: 1500,
    packCost: 3000,
    overheadCost: 1500,
    bufferDefectRate: 0.05,
    retailPrice: 89000,
    platformFeeRate: 0.015
  },
  {
    id: 'hpp-03',
    name: 'MultiGraph Custom Stiker Vinyl Pack (100 Pcs Die-Cut)',
    blankCost: 18000,
    dtfCost: 15000,
    electricCost: 1000,
    packCost: 1000,
    overheadCost: 1000,
    bufferDefectRate: 0.03,
    retailPrice: 60000,
    platformFeeRate: 0.007
  }
]

export const INITIAL_ORDERS: Order[] = []


export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vnd-01',
    name: 'Cititex (Official NSA Distributor)',
    category: 'garment',
    pic: 'Rian Sales Outlet',
    phone: '6281288990011',
    address: 'Jl. Balai Pustaka Timur No. 12, Rawamangun, Jakarta Timur',
    pricingNotes: 'NSA Heavyweight 24s Rp 38.000 (lusinan), NSA Softstyle 30s Rp 32.000. Stok hitam & putih selalu ready.',
    bankAccount: 'BCA 5220-3344-21 a.n PT Cititex Jaya',
    rating: 5,
    status: 'active'
  },
  {
    id: 'vnd-02',
    name: 'Cahaya Digital DTF Roll 58cm',
    category: 'dtf_print',
    pic: 'Mas Hendra (Operator Mesin)',
    phone: '6285711223344',
    address: 'Kawasan Percetakan Senen, Blok 3 Lantai 2 No. 44, Jakarta Pusat',
    pricingNotes: 'Tarif maklon roll 58 cm: Rp 28.000/meter (minimal 5 meter), Rp 32.000/meter (< 5 meter). File wajib TIFF 300 DPI.',
    bankAccount: 'Mandiri 122-00-1122334-1 a.n Hendra Gunawan',
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'vnd-03',
    name: 'Mitra Polymailer & Kemasan Grosir',
    category: 'packaging',
    pic: 'Ibu Linda',
    phone: '6287899887766',
    address: 'Pasar Pagi Mangga Dua, Lt. Semi Basement Los B No. 10',
    pricingNotes: 'Polymailer Hitam Doff 30x40 cm Rp 950/pcs (min 100 pcs). Box kardus e-flute die-cut Rp 2.200/pcs.',
    bankAccount: 'BCA 088-2233-112 a.n Linda Susanti',
    rating: 4.5,
    status: 'active'
  },
  {
    id: 'vnd-04',
    name: 'J&T Cargo & Express Drop Point 02',
    category: 'expedition',
    pic: 'Pak Wahyu (Kurir Langganan)',
    phone: '6281555667788',
    address: 'Jl. Otista Raya No. 89, Jatinegara, Jakarta Timur',
    pricingNotes: 'Pickup paket gratis ke studio jam 16:30 WIB. Diskon ongkir reguler 15% untuk akun membership agen.',
    bankAccount: 'Tunai saat pick-up / QRIS',
    rating: 4.9,
    status: 'active'
  }
]

export const INITIAL_CONTENT_PLANS: ContentPlan[] = [
  {
    id: 'cnt-01',
    businessId: 'teestock',
    channel: 'tiktok',
    targetDate: '2026-09-18',
    title: 'BTS Heat Press 155°C & Suara Squelch Cold Peel',
    hookCopy: '"Jangan beli kaos distro 100 ribuan sebelum liat proses sablonnya sedetail ini..."',
    caption: 'Di balik kualitas sablon awet TeeStock: suhu presisi 155°C selama 15 detik + finishing teflon. Link store di bio! #teestock #sablonindonesia #streetwearlokal #dtfprint',
    status: 'ready'
  },
  {
    id: 'cnt-02',
    businessId: 'teestock',
    channel: 'instagram',
    targetDate: '2026-09-19',
    title: 'Lookbook Reel: Fit Kaos NSA 24s di Badan 175cm/70kg',
    hookCopy: '"Kaos tebal tapi gak gerah di cuaca Jakarta? Ini perbandingan fitting size L vs XL."',
    caption: 'Koleksi Drop #01 "Raw Identity" dibuat dengan NSA Heavyweight 24s 100% cotton combed. Siluet boxy, leher tebal anti-melar. Siap checkout di teestockapparel.vercel.app',
    status: 'scripted'
  },
  {
    id: 'cnt-03',
    businessId: 'multigraph',
    channel: 'whatsapp',
    targetDate: '2026-09-20',
    title: 'Script Broadcast Pasokan Kemasan ke Distro & UMKM Teman',
    hookCopy: 'Halo bro! Mau bikin paket unboxing brand bajumu kelihatan mahal tanpa modal jutaan?',
    caption: 'MultiGraph siap bantu cetak hangtag tebal 310gsm + stiker vinyl die-cut mulai dari puluhan pcs. Tanpa minimal ribuan lembar. Cek portofolio kemasan kami di link katalog!',
    status: 'ready'
  }
]
