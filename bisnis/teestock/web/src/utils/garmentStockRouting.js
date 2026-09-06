/**
 * TeeStock Apparel — Garment Stock & JIT Routing Engine
 * 
 * Mengelola arsitektur inventaris hibrida:
 * 1. Tier 1: Fast-Moving Studio Buffer (Stok Fisik di Rumah/Studio: NSA 24s/30s Hitam & Putih M, L, XL) -> SLA H+0 (Kirim Hari Ini)
 * 2. Tier 2: Cititex Vendor JIT (Virtual Warehouse Cititex: Warna lain & model spesifik) -> SLA H+1 (Kirim Besok)
 */

/**
 * Cek apakah varian produk termasuk dalam buffer stock fisik studio
 * @param {string} garmentNameOrKey - Nama atau key jenis garmen (cth: "NSA Softstyle 30s", "nsa_heavyweight_24s", "TS-BLK-7200")
 * @param {string} color - Pilihan warna (cth: "Hitam", "Putih", "Charcoal")
 * @param {string} size - Ukuran kaos (cth: "M", "L", "XL")
 * @returns {boolean}
 */
export function isFastMovingBuffer(garmentNameOrKey = '', color = '', size = '') {
  const gStr = String(garmentNameOrKey).toLowerCase();
  const cStr = String(color).toLowerCase();
  const sStr = String(size).toUpperCase().trim();

  // 1. Cek Model Garmen: Hanya Softstyle 30s (3600) & Heavyweight 24s (7200)
  const isSoftstyle = gStr.includes('30s') || gStr.includes('softstyle') || gStr.includes('3600');
  const isHeavyweight24s = gStr.includes('24s') || gStr.includes('7200') || gStr.includes('premium cotton');

  if (!isSoftstyle && !isHeavyweight24s) {
    return false;
  }

  // 2. Cek Warna: Hanya warna netral primer (Hitam & Putih)
  const isBlack = cStr.includes('hitam') || cStr.includes('black');
  const isWhite = cStr.includes('putih') || cStr.includes('white');

  if (!isBlack && !isWhite) {
    return false;
  }

  // 3. Cek Ukuran: Hanya ukuran fast-moving (M, L, XL)
  const isFastSize = sStr === 'M' || sStr === 'L' || sStr === 'XL';
  return isFastSize;
}

/**
 * Dapatkan informasi SLA dan badge ketersediaan untuk antarmuka pengguna (Storefront)
 */
export function getFulfillmentSLA(garmentNameOrKey = '', color = '', size = '', isBlank = false) {
  const isStudioStock = isFastMovingBuffer(garmentNameOrKey, color, size);

  if (isStudioStock) {
    return {
      type: 'studio_buffer',
      isStudioStock: true,
      badgeLabel: '⚡ Ready Stock di Studio',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      tagText: 'Kirim Hari Ini (Order < 14.00)',
      heading: isBlank 
        ? '⚡ Ready Stock di Studio • Kirim Hari Ini' 
        : '⚡ Bahan Ready di Studio • Siap Langsung Press',
      subtext: isBlank
        ? 'Stok fisik tersedia di rak studio kami. Pesanan sebelum 14:00 WIB langsung dikemas dan dikirim hari ini.'
        : 'Kaos polos tersedia di rak studio. Langsung masuk antrean heat press dan siap dikirim H+0/H+1.'
    };
  }

  return {
    type: 'vendor_cititex',
    isStudioStock: false,
    badgeLabel: '🏢 Gudang Pusat Cititex',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    tagText: 'Dikemas 24 Jam (Kirim H+1)',
    heading: '🏢 Stok Gudang Pusat Cititex • Dikemas 24 Jam (Kirim H+1)',
    subtext: 'Tersedia di jaringan gudang cabang resmi New States Apparel Cititex. Ditarik JIT harian, dipacking rapi, dan dikirim H+1.'
  };
}

/**
 * Rekap seluruh pesanan aktif yang memerlukan penarikan garmen dari cabang Cititex
 * @param {Array} orders - Daftar pesanan dari database / state admin
 */
export function aggregateVendorPickupList(orders = []) {
  // Hanya ambil pesanan yang masih dalam proses produksi (belum pack/shipped)
  const activeOrders = orders.filter(o => 
    o.status === 'pending' || o.status === 'dtf' || o.status === 'press'
  );

  const pickupMap = new Map();
  let totalPcs = 0;

  activeOrders.forEach(order => {
    const garment = order.garment || 'NSA Softstyle 30s';
    const color = order.color || 'Hitam';
    const size = order.size || 'L';
    const qty = Number(order.qty || 1);

    // Jika BUKAN stok studio, berarti harus ditarik dari Cititex
    if (!isFastMovingBuffer(garment, color, size)) {
      const key = `${garment}:::${color}:::${size}`;
      totalPcs += qty;

      if (pickupMap.has(key)) {
        const entry = pickupMap.get(key);
        entry.qty += qty;
        entry.orderIds.push(order.id);
      } else {
        pickupMap.set(key, {
          garment,
          color,
          size,
          qty,
          orderIds: [order.id]
        });
      }
    }
  });

  const items = Array.from(pickupMap.values()).sort((a, b) => b.qty - a.qty);

  // Buat draft teks pemesanan WhatsApp otomatis ke sales cabang Cititex
  const dateStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date());
  let waMessage = `Halo Admin Cititex,\nSaya dari *TeeStock Apparel* mau order / pickup garmen polos hari ini (${dateStr}):\n\n`;

  if (items.length === 0) {
    waMessage += `(Belum ada antrean penarikan garmen hari ini)\n`;
  } else {
    items.forEach((it, idx) => {
      waMessage += `${idx + 1}. *${it.garment}* — Warna: ${it.color}, Size: ${it.size} = *${it.qty} pcs* (Ref Order: ${it.orderIds.join(', ')})\n`;
    });
    waMessage += `\n*Total: ${totalPcs} pcs*\nMohon infokan kesiapan barang untuk pickup sore ini ya. Terima kasih! 🙏`;
  }

  return {
    totalPcs,
    items,
    activeOrdersCount: activeOrders.length,
    waMessage
  };
}
