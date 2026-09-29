/**
 * 📣 TeeStock & MultiGraph Marketing Hub API
 * Mengelola kalender konten organik pilar 4E, amunisi Swipe File direct response,
 * optimalisasi Social SEO (TikTok & Instagram Search), dan ekspor CSV 12-kolom.
 */

const LOCAL_STORAGE_CONTENT_KEY = 'bh_content_plans';

export const PILLARS_4E = {
  entertain: {
    id: 'entertain',
    label: 'Entertain (30%)',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    targetPercent: 30,
    desc: 'Humor, POV relatable cowok/freelancer, outfit parodi'
  },
  educate: {
    id: 'educate',
    label: 'Educate (30%)',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    targetPercent: 30,
    desc: 'Bahan katun 24s vs 30s, standar curing DTF 155°C teflon'
  },
  emotion: {
    id: 'emotion',
    label: 'Emotion / BTS (25%)',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    targetPercent: 25,
    desc: 'Behind the scenes studio, proses heat press, perjuangan brand'
  },
  promote: {
    id: 'promote',
    label: 'Promote (15%)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    targetPercent: 15,
    desc: 'Countdown drop rilis baru, kupon VIP, unboxing kloter pesanan'
  }
};

export const CHANNELS_CONFIG = {
  tiktok: {
    id: 'tiktok',
    label: 'TikTok Video (9:16)',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30'
  },
  instagram: {
    id: 'instagram',
    label: 'Instagram Reels / Carousel',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  },
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp Status / Broadcast',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  }
};

export const SWIPE_FILES = [
  {
    id: 'sw-01',
    category: 'video_hook',
    categoryLabel: 'Hook Video 3-Detik',
    title: 'Hook TikTok/Reels: Perbandingan NSA vs Kaos Murahan',
    text: 'Banyak yang jual kaos distro 50 ribuan tapi baru 3x cuci kerahnya udah melar kayak daster. Di TeeStock, kita pakai NSA Heavyweight 24s 100% preshrunk cotton + sablon DTF curing 155°C. Ini buktinya waktu ditarik kencang...'
  },
  {
    id: 'sw-02',
    category: 'video_hook',
    categoryLabel: 'Hook Video 3-Detik',
    title: 'Hook ASMR & Squelch: Peeling Film DTF Dingin',
    text: 'Jangan pernah kelupas sablon DTF sebelum dingin total! Ini suara cold peel 15 detik press di 155°C yang bikin sablon nempel seumur hidup ke pori-pori kain NSA...'
  },
  {
    id: 'sw-03',
    category: 'objection',
    categoryLabel: 'Objection Handling',
    title: 'Objection: "Kaos 24s tebal panas gak buat iklim Indonesia?"',
    text: 'Tenang bro, NSA 24s itu gramasi 180-190 gsm dengan benang 100% serat katun murni alami tanpa polyester plastik. Bahannya kokoh & jatuh rapi di badan (boxy streetwear fit), tapi pori-pori katunnya tetap dingin dan nyerap keringat maksimal di iklim tropis seharian.'
  },
  {
    id: 'sw-04',
    category: 'objection',
    categoryLabel: 'Objection Handling',
    title: 'Objection: "Sablon DTF bisa pecah atau lengket pas disetrika?"',
    text: 'Sablon DTF TeeStock dipress dengan double finishing sheet teflon dan tinta elastis. Tips kuncinya: saat cuci posisikan kaos terbalik (inside-out) dan saat setrika cukup setrika dari bagian dalam kaos atau lapisi kain tipis. Sablon dijamin lentur anti-pecah.'
  },
  {
    id: 'sw-05',
    category: 'whatsapp',
    categoryLabel: 'Script WhatsApp',
    title: 'Script WA: Recovery Keranjang Tertunda (Abandoned Checkout)',
    text: 'Halo Kak! 🙏 Kami lihat Kakak tadi sempat memilih artikel kaos TeeStock tapi transaksinya belum selesai. Kuota early bird Batch ini tersisa beberapa pcs lagi nih kak. Mau kami bantu amankan size dan slot produksinya sebelum kehabisan?'
  },
  {
    id: 'sw-06',
    category: 'whatsapp',
    categoryLabel: 'Script WhatsApp',
    title: 'Script WA: Konfirmasi Resi & Garansi Tukar Baru 100%',
    text: 'Paket kaos TeeStock Kakak sudah meluncur ke kurir ekspedisi! 🚀 Nomor resi pengiriman Kakak terlampir di bawah. Paket Kakak dilindungi Garansi Tukar Baru 100% jika ada cacat jahitan atau sablon luntur (sertakan video unboxing ya). Ditunggu kedatangan paketnya kak! ✨'
  },
  {
    id: 'sw-07',
    category: 'vip_launch',
    categoryLabel: 'VIP Launch Drop',
    title: 'Broadcast WA: Akses Awal VIP Drop Sebelum Rilis Publik',
    text: 'Halo Kak! 👑 Sebagai pelanggan setia TeeStock, kami kasih kamu *Akses Eksklusif Awal (VIP Early Access)* untuk Drop desain terbaru kami sebelum dirilis ke publik besok malam. Gunakan voucher VIP Kakak: *VIPDROP15* untuk potongan 15% di teestockapparel.vercel.app. Slot size sangat terbatas ya!'
  }
];

export const INITIAL_CONTENT_PLANS = [
  {
    id: 'cnt-01',
    businessId: 'teestock',
    channel: 'tiktok',
    pillar: 'emotion',
    targetDate: '2026-09-18',
    title: 'BTS Heat Press 155°C & Suara Squelch Cold Peel',
    hookCopy: '"Jangan beli kaos distro 100 ribuan sebelum liat proses sablonnya sedetail ini..."',
    caption: 'Di balik kualitas sablon awet TeeStock: suhu presisi 155°C selama 15 detik + finishing teflon. Link store di bio! #teestock #sablonindonesia #streetwearlokal #dtfprint',
    seoKeywords: 'proses sablon dtf, heat press 155 derajat, kaos streetwear lokal',
    status: 'ready'
  },
  {
    id: 'cnt-02',
    businessId: 'teestock',
    channel: 'instagram',
    pillar: 'educate',
    targetDate: '2026-09-19',
    title: 'Perbandingan Kain NSA Heavyweight 24s vs 30s Tipis',
    hookCopy: '"Kaos 24s itu gerah atau kokoh? Ini bedanya waktu dipakai seharian..."',
    caption: 'Banyak yang salah kira makin tebal makin panas. NSA 24s pakai 100% serat katun preshrunk jadi sirkulasi udara tetap sejuk. Drop #01 sudah live! #kaosboxy #streetwearindo #teestock',
    seoKeywords: 'perbedaan nsa 24s dan 30s, kaos boxy katun murni, streetwear lokal indonesia',
    status: 'draft'
  },
  {
    id: 'cnt-03',
    businessId: 'teestock',
    channel: 'tiktok',
    pillar: 'entertain',
    targetDate: '2026-09-21',
    title: 'POV: Cowok Waktu Nemu Kaos yang Fittingnya Pas di Bahu',
    hookCopy: '"Perasaan cowok pas akhirnya nemu kaos yang gak melar di leher dan gak gantung..."',
    caption: 'Tipe cowok yang cuma punya 3 kaos tapi semuanya dipakai ganti-ganti karena fittingnya pas. Cek sizing chart di bio! #outfitpria #kaosboxy #teestockid',
    seoKeywords: 'outfit cowok simple, rekomendasi kaos boxy lokal, streetwear pria',
    status: 'draft'
  },
  {
    id: 'cnt-04',
    businessId: 'teestock',
    channel: 'whatsapp',
    pillar: 'promote',
    targetDate: '2026-09-22',
    title: 'Broadcast Unboxing Pack & Kode Kupon Repeat Order 10%',
    hookCopy: '"Unboxing Kloter Batch #01: Siap Terbang ke Pemilik Barunya..."',
    caption: 'Kabar gembira untuk member VIP TeeStock: Kupon REPEAT10 aktif untuk pemesanan artikel kedua. Pengiriman hari yang sama sebelum jam 16:00 WIB.',
    seoKeywords: 'unboxing kaos distro, voucher teestock, promo apparel',
    status: 'draft'
  }
];

/**
 * Ambil daftar seluruh rencana konten dari localStorage
 */
export function getContentPlans() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(INITIAL_CONTENT_PLANS));
      return INITIAL_CONTENT_PLANS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CONTENT_PLANS;
  } catch (err) {
    console.warn("Could not read content plans from localStorage:", err);
    return INITIAL_CONTENT_PLANS;
  }
}

/**
 * Simpan atau perbarui rencana konten
 */
export function saveContentPlan(planData) {
  const current = getContentPlans();
  let updated;

  if (planData.id && current.some(p => p.id === planData.id)) {
    updated = current.map(p => p.id === planData.id ? { ...p, ...planData } : p);
  } else {
    const newPlan = {
      ...planData,
      id: planData.id || `cnt-${Date.now().toString().slice(-6)}`,
      businessId: planData.businessId || 'teestock',
      pillar: planData.pillar || 'educate',
      status: planData.status || 'draft',
      targetDate: planData.targetDate || new Date().toISOString().slice(0, 10)
    };
    updated = [newPlan, ...current];
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save content plan to localStorage:", e);
  }

  return updated;
}

/**
 * Hapus rencana konten
 */
export function deleteContentPlan(planId) {
  const current = getContentPlans();
  const updated = current.filter(p => p.id !== planId);
  try {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not delete content plan:", e);
  }
  return updated;
}

/**
 * Ubah status rencana konten (draft -> ready -> published)
 */
export function updatePlanStatus(planId, newStatus) {
  const current = getContentPlans();
  const updated = current.map(p => p.id === planId ? { ...p, status: newStatus } : p);
  try {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not update plan status:", e);
  }
  return updated;
}

/**
 * Reset rencana konten ke default
 */
export function resetDefaultContentPlans() {
  try {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(INITIAL_CONTENT_PLANS));
  } catch (e) {}
  return INITIAL_CONTENT_PLANS;
}

/**
 * Hitung 4 Executive KPI Ribbon Cards untuk Marketing Hub
 */
export function calculateMarketingKpis(plans = []) {
  const totalPlans = plans.length;
  let draftCount = 0;
  let readyCount = 0;
  let publishedCount = 0;

  const pillarCounts = { entertain: 0, educate: 0, emotion: 0, promote: 0 };
  const channelCounts = { tiktok: 0, instagram: 0, whatsapp: 0 };

  plans.forEach(p => {
    if (p.status === 'ready') readyCount += 1;
    else if (p.status === 'published') publishedCount += 1;
    else draftCount += 1;

    if (pillarCounts[p.pillar] !== undefined) {
      pillarCounts[p.pillar] += 1;
    } else {
      pillarCounts.educate += 1;
    }

    if (channelCounts[p.channel] !== undefined) {
      channelCounts[p.channel] += 1;
    }
  });

  // Hitung persentase pilar 4E
  const pillarPercentages = {
    entertain: totalPlans > 0 ? Math.round((pillarCounts.entertain / totalPlans) * 100) : 0,
    educate: totalPlans > 0 ? Math.round((pillarCounts.educate / totalPlans) * 100) : 0,
    emotion: totalPlans > 0 ? Math.round((pillarCounts.emotion / totalPlans) * 100) : 0,
    promote: totalPlans > 0 ? Math.round((pillarCounts.promote / totalPlans) * 100) : 0
  };

  return {
    totalPlans,
    draftCount,
    readyCount,
    publishedCount,
    pillarCounts,
    pillarPercentages,
    channelCounts,
    swipeFileCount: SWIPE_FILES.length
  };
}

/**
 * Ekspor Kalender Konten ke CSV 12 Kolom dengan UTF-8 BOM
 */
export function exportContentCalendarCsv(plans = []) {
  const headers = [
    'ID Konten',
    'Tanggal Target',
    'Saluran Media',
    'Pilar Konten 4E',
    'Judul Konten',
    'Hook 3-Detik Pertama',
    'Naskah Caption & CTA',
    'Kata Kunci Social SEO',
    'Status Produksi',
    'Bisnis / Brand'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = plans.map(p => {
    const pilarLabel = PILLARS_4E[p.pillar]?.label || p.pillar;
    const channelLabel = CHANNELS_CONFIG[p.channel]?.label || p.channel;

    return [
      escapeCsv(p.id),
      escapeCsv(p.targetDate),
      escapeCsv(channelLabel),
      escapeCsv(p.pillarLabel || pilarLabel),
      escapeCsv(p.title),
      escapeCsv(p.hookCopy),
      escapeCsv(p.caption),
      escapeCsv(p.seoKeywords || '-'),
      escapeCsv(p.status || 'draft'),
      escapeCsv((p.businessId || 'teestock').toUpperCase())
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Kalender-Konten-Marketing-TeeStock-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}
