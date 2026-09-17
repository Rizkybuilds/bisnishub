/**
 * 👑 TeeStock CRM & Customer Aggregation Service
 * Menghubungkan data pesanan (orders) menjadi profil pelanggan terkonsolidasi,
 * menghitung metrik LTV/AOV, klasifikasi tier (VIP, Reseller, Churn Risk),
 * WhatsApp follow-up copy generator, dan ekspor database CSV 11-kolom.
 */

/**
 * Normalisasi nomor WhatsApp format Indonesia standar internasional (628...)
 * Contoh: 0812-3456-7890 -> 6281234567890
 *         +62 812-3456   -> 628123456
 *         81234567890    -> 6281234567890
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  const cleaned = String(phone).replace(/\D/g, '');
  if (!cleaned) return '';

  if (cleaned.startsWith('62')) {
    return cleaned;
  }
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  if (cleaned.startsWith('8')) {
    return '62' + cleaned;
  }
  return cleaned;
}

/**
 * Format angka ke mata uang Rupiah standar
 */
export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
}

/**
 * Menghitung hari yang telah berlalu sejak tanggal tertentu
 */
export function getDaysSinceDate(dateString, referenceDate = new Date()) {
  if (!dateString) return 999;
  const target = new Date(dateString);
  if (isNaN(target.getTime())) return 999;
  const diffMs = referenceDate.getTime() - target.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Agregasi pesanan (orders) menjadi database profil pelanggan lengkap
 * @param {Array} orders - Daftar pesanan dari AdminContext / Supabase
 * @param {Date} referenceDate - Tanggal acuan untuk kalkulasi hari (default now)
 * @returns {Array} Array objek pelanggan dengan metrik CRM lengkap
 */
export function aggregateCustomersFromOrders(orders = [], referenceDate = new Date()) {
  if (!Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const customerMap = new Map();

  orders.forEach((order) => {
    if (!order) return;

    const rawPhone = order.customer_phone || order.phone || '';
    const normalizedPhone = normalizePhoneNumber(rawPhone);
    const rawName = order.customer_name || order.customer || 'Pelanggan';
    const cleanName = rawName.trim();

    // Kunci agregasi: prioritaskan nomor telepon jika valid, jika tidak gunakan nama
    const key = normalizedPhone && normalizedPhone.length >= 9
      ? `phone-${normalizedPhone}`
      : `name-${cleanName.toLowerCase()}`;

    const orderAmount = Number(order.total_amount || order.price || 0);
    const orderQty = Number(order.qty || 1);
    const orderDate = order.created_at || order.date || new Date().toISOString();
    const isCancelled = order.status === 'cancelled';
    const channel = (order.channel || 'web').toLowerCase();
    const tierOrder = (order.tier || 'retail').toLowerCase();

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: `cust-${normalizedPhone || cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-') || Math.random().toString(36).slice(2, 8)}`,
        name: cleanName,
        phone: normalizedPhone,
        rawPhone: rawPhone,
        city: order.customer_city || order.city || 'Kota Belum Tercatat',
        address: order.customer_address || order.address || '',
        totalOrders: 0,
        completedOrders: 0,
        totalPcs: 0,
        ltv: 0,
        channels: new Set(),
        hasResellerOrder: false,
        firstOrderDate: orderDate,
        lastOrderDate: orderDate,
        garmentCounts: {},
        ordersList: []
      });
    }

    const c = customerMap.get(key);

    // Update nama dan kontak ke yang terbaru jika ada
    if (cleanName && cleanName !== 'Pelanggan' && (!c.name || c.name === 'Pelanggan')) {
      c.name = cleanName;
    }
    if (order.customer_city || order.city) {
      c.city = order.customer_city || order.city;
    }
    if (order.customer_address || order.address) {
      c.address = order.customer_address || order.address;
    }

    // Hitung total pesanan
    c.totalOrders += 1;
    if (!isCancelled) {
      c.completedOrders += 1;
      c.ltv += orderAmount;
      c.totalPcs += orderQty;
    }

    // Saluran & Indikasi Reseller
    c.channels.add(channel);
    if (channel === 'reseller' || tierOrder === 'reseller') {
      c.hasResellerOrder = true;
    }

    // Tanggal pertama & terakhir
    if (new Date(orderDate) < new Date(c.firstOrderDate)) {
      c.firstOrderDate = orderDate;
    }
    if (new Date(orderDate) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = orderDate;
    }

    // Frekuensi Garmen
    const garment = order.garment || (order.items && order.items[0]?.garment);
    if (garment) {
      c.garmentCounts[garment] = (c.garmentCounts[garment] || 0) + orderQty;
    }

    // Simpan snapshot order untuk riwayat
    c.ordersList.push({
      id: order.id || order.order_number,
      date: orderDate,
      status: order.status || 'pending',
      channel: channel,
      amount: orderAmount,
      qty: orderQty,
      productName: order.productName || order.sku || 'Kaos TeeStock',
      items: order.items || [],
      trackingNo: order.tracking_number || order.trackingNo || null
    });
  });

  // Tahap Finalisasi: Hitung AOV, Tentukan Tiering, dan Tagging
  const customers = Array.from(customerMap.values()).map((c) => {
    const aov = c.completedOrders > 0 ? Math.round(c.ltv / c.completedOrders) : 0;
    const daysSinceLastOrder = getDaysSinceDate(c.lastOrderDate, referenceDate);

    // Preferensi Garmen Teratas
    let preferredGarment = 'NSA Heavyweight 24s';
    let maxGarmentCount = 0;
    Object.entries(c.garmentCounts).forEach(([g, count]) => {
      if (count > maxGarmentCount) {
        maxGarmentCount = count;
        preferredGarment = g;
      }
    });

    // Penentuan Tier
    let tier = 'regular';
    let tierLabel = 'Pelanggan Reguler';
    let badgeColor = 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';

    if (c.hasResellerOrder || c.totalPcs >= 12) {
      tier = 'reseller';
      tierLabel = 'Mitra Reseller/Grosir';
      badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    } else if (c.ltv >= 300000 || c.completedOrders >= 3) {
      tier = 'vip';
      tierLabel = 'VIP Ritel';
      badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    } else if (daysSinceLastOrder > 60 && c.completedOrders > 0) {
      tier = 'churn_risk';
      tierLabel = 'Perhatian / Churn Risk';
      badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    } else if (daysSinceLastOrder <= 30 && c.completedOrders <= 1) {
      tier = 'new';
      tierLabel = 'Pelanggan Baru';
      badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }

    // Urutkan riwayat order dari yang terbaru
    c.ordersList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Susun Tag Ringkas
    const tags = [];
    if (tier === 'reseller') tags.push('Reseller B2B');
    if (tier === 'vip') tags.push('High LTV');
    if (c.completedOrders >= 2) tags.push('Repeat Buyer');
    if (tier === 'new') tags.push('Baru');
    if (tier === 'churn_risk') tags.push('Tidak Aktif >60 Hari');

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      rawPhone: c.rawPhone,
      city: c.city,
      address: c.address,
      totalOrders: c.totalOrders,
      completedOrders: c.completedOrders,
      totalPcs: c.totalPcs,
      ltv: c.ltv,
      aov: aov,
      firstOrderDate: c.firstOrderDate,
      lastOrderDate: c.lastOrderDate,
      daysSinceLastOrder: daysSinceLastOrder,
      tier: tier,
      tierLabel: tierLabel,
      badgeColor: badgeColor,
      preferredGarment: preferredGarment,
      channels: Array.from(c.channels),
      tags: tags,
      orders: c.ordersList
    };
  });

  // Urutkan default: LTV tertinggi
  return customers.sort((a, b) => b.ltv - a.ltv);
}

/**
 * Kalkulasi 4 Executive KPI Ribbon Cards untuk CRM
 */
export function calculateCustomerKpis(customers = []) {
  if (!Array.isArray(customers) || customers.length === 0) {
    return {
      totalCustomers: 0,
      totalLtv: 0,
      resellerCount: 0,
      vipCount: 0,
      vipAndResellerCount: 0,
      overallAov: 0,
      repeatCustomerRate: 0,
      churnRiskCount: 0,
      newCustomerCount: 0
    };
  }

  const totalCustomers = customers.length;
  let totalLtv = 0;
  let totalCompletedOrders = 0;
  let resellerCount = 0;
  let vipCount = 0;
  let repeatCount = 0;
  let churnRiskCount = 0;
  let newCustomerCount = 0;

  customers.forEach(c => {
    totalLtv += c.ltv || 0;
    totalCompletedOrders += c.completedOrders || 0;
    if (c.tier === 'reseller') resellerCount += 1;
    if (c.tier === 'vip') vipCount += 1;
    if (c.completedOrders >= 2) repeatCount += 1;
    if (c.tier === 'churn_risk') churnRiskCount += 1;
    if (c.tier === 'new') newCustomerCount += 1;
  });

  const overallAov = totalCompletedOrders > 0
    ? Math.round(totalLtv / totalCompletedOrders)
    : 0;

  const repeatCustomerRate = totalCustomers > 0
    ? Math.round((repeatCount / totalCustomers) * 100)
    : 0;

  return {
    totalCustomers,
    totalLtv,
    resellerCount,
    vipCount,
    vipAndResellerCount: resellerCount + vipCount,
    overallAov,
    repeatCustomerRate,
    churnRiskCount,
    newCustomerCount
  };
}

/**
 * Template WhatsApp Generator untuk Customer Engagement & Retention
 */
export const WHATSAPP_TEMPLATES = [
  {
    id: 'unboxing_care',
    title: 'Unboxing & SOP Perawatan Kaos',
    description: 'Panduan cuci kaos NSA & rawat sablon DTF 155°C + voucher repeat order 10%',
    badge: 'Retensi'
  },
  {
    id: 'reseller_restock',
    title: 'Tawaran Restock Mitra Reseller',
    description: 'Promo grosir lusinan kaos polos/grafis DTF dengan prioritas heat press same-day',
    badge: 'B2B Grosir'
  },
  {
    id: 'vip_early_access',
    title: 'Akses Eksklusif VIP Drop',
    description: 'Undangan akses awal rilisan desain baru terbatas sebelum launching publik',
    badge: 'VIP'
  },
  {
    id: 'churn_reactivation',
    title: 'Reaktivasi Pelanggan Kangen',
    description: 'Kupon comeback Rp 20.000 + bonus stiker pack untuk pelanggan tidak aktif',
    badge: 'Win-Back'
  }
];

/**
 * Menghasilkan teks WhatsApp siap kirim yang dipersonalisasi
 */
export function generateCustomerWhatsAppText(customer, templateType = 'unboxing_care') {
  if (!customer) return '';

  const name = customer.name || 'Kak';
  const latestOrder = (customer.orders && customer.orders[0]) || null;
  const orderId = latestOrder?.id ? `(#${latestOrder.id})` : '';
  const lastDateFormatted = customer.lastOrderDate ? customer.lastOrderDate.slice(0, 10) : '';

  switch (templateType) {
    case 'unboxing_care':
      return `Halo Kak ${name}! 👋\n\nTerima kasih banyak sudah memesan di TeeStock Apparel ${orderId}. Semoga paketnya mendarat dengan selamat ya!\n\n👕 *Tips Perawatan Kaos NSA & Sablon DTF TeeStock*:\n1. Cuci kaos dengan posisi sablon di bagian dalam (inside-out).\n2. Gunakan air dingin dan deterjen lembut (jangan gunakan pemutih keras).\n3. Hindari setrika langsung pada sablon (setrika dari bagian dalam / lapisi kain).\n4. Jemur di tempat teduh, hindari sinar terik matahari langsung terlalu lama.\n\n🎁 Sebagai apresiasi kami, nikmati diskon 10% untuk pesanan berikutnya dengan voucher: *VIPREPEAT10*\nKatalog store kami: https://teestockapparel.vercel.app\n\nJika ada kendala jahitan atau sablon, langsung balas chat ini ya Kak!`;

    case 'reseller_restock':
      return `Halo Kak ${name} (Mitra Reseller TeeStock)! 📦✨\n\nBagaimana perputaran stok apparel di tempat Kakak saat ini?\n\nKami baru saja update stok batch baru untuk kaos polos NSA (Softstyle 30s & Heavyweight 24s) serta katalog cetak DTF 58 cm resolusi HD 300 DPI.\n\n🔥 *Penawaran Spesial Restock Mitra*:\n- Minimal order 12 pcs: Dapatkan harga tiering grosir spesial + slot heat press prioritas.\n- Bonus free kemasan polymailer tebal & sticker pack MultiGraph.\n\nKakak mau kami kirimkan katalog desain terbaru atau butuh restock warna apa minggu ini? Biar kami siapkan slot produksinya! 🚀`;

    case 'vip_early_access':
      return `Halo Kak ${name}! 👑\n\nSebagai pelanggan VIP setia di TeeStock Apparel, kami ingin memberikan *Akses Eksklusif Awal (VIP Early Access)* untuk koleksi Graphic Drop edisi terbaru kami sebelum rilis publik!\n\n✨ Dicetak terbatas pada bahan premium NSA Heavyweight 24s dengan standar press 155°C teflon finish.\n\nAmankan size dan desain incaran Kakak terlebih dahulu:\n👉 https://teestockapparel.vercel.app\n\nGunakan kode apresiasi VIP Kakak: *VIPDROP15* (Potongan 15%).\nSlot cetak terbatas ya Kak!`;

    case 'churn_reactivation':
      return `Halo Kak ${name}! 👋\n\nSudah cukup lama nih sejak pesanan terakhir Kakak di TeeStock (${lastDateFormatted}). Kami kangen bikin kaos bareng Kakak!\n\nBulan ini kami menghadirkan pembaruan formula tinta DTF lebih lembut dan varian warna baru NSA.\n\n🎁 *Spesial untuk Kakak Hari Ini*:\nGunakan kode kupon *BACKTOSTYLE* untuk diskon Rp 20.000 + BONUS MultiGraph Sticker Pack untuk pesanan berikutnya.\n\nYuk intip koleksi terbaru kami di https://teestockapparel.vercel.app. Semoga harimu menyenangkan Kak!`;

    default:
      return `Halo Kak ${name}! 👋 Ada yang bisa kami bantu seputar pesanan TeeStock Apparel?`;
  }
}

/**
 * Menghasilkan URL langsung ke WhatsApp web/app
 */
export function getCustomerWhatsAppUrl(customer, templateType = 'unboxing_care') {
  if (!customer?.phone) return '';
  const text = generateCustomerWhatsAppText(customer, templateType);
  return `https://wa.me/${customer.phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Ekspor Database Pelanggan ke CSV 11 Kolom dengan UTF-8 BOM
 */
export function exportCustomersCsv(customers = []) {
  const headers = [
    'ID Pelanggan',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Kota',
    'Tier Pelanggan',
    'Total Pesanan',
    'Total Kaos (Pcs)',
    'Akumulasi LTV (IDR)',
    'Rata-Rata Order (AOV)',
    'Tanggal Order Terakhir',
    'Hari Sejak Order Terakhir'
  ];

  const rows = customers.map(c => [
    `"${c.id || ''}"`,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${c.phone || c.rawPhone || ''}"`,
    `"${(c.city || '').replace(/"/g, '""')}"`,
    `"${c.tierLabel || c.tier || ''}"`,
    c.completedOrders || 0,
    c.totalPcs || 0,
    c.ltv || 0,
    c.aov || 0,
    `"${(c.lastOrderDate || '').slice(0, 10)}"`,
    c.daysSinceLastOrder ?? 0
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Database-Pelanggan-TeeStock-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}
