import { VENDOR_DTF_RATES } from "../constants/pricing";

/**
 * Calculates roll length (meters) and costs based on order items and filler/buffer items
 */
export function calculateGangSheet(orderItems = [], bufferItems = []) {
  const allItems = [...orderItems, ...bufferItems];
  const totalQty = allItems.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  
  if (totalQty === 0) {
    return {
      totalQty: 0,
      meters: 0,
      totalCost: 0,
      costPerPcs: 12000,
      orderItems: [],
      bufferItems: [],
      items: []
    };
  }

  // Estimasi luas:
  // - A3 (28x40 cm) = 2 pcs muat dalam 42 cm panjang roll 58 cm
  // - Label kerah / logo kecil (6x3 s/d 8x8 cm) = 10 pcs muat dalam 15 cm panjang roll
  let lengthCm = 0;
  allItems.forEach(it => {
    const qty = Number(it.qty) || 1;
    const isSmall = it.sku?.startsWith('ACC-') || it.size?.includes('Kecil') || it.size?.includes('Saku');
    if (isSmall) {
      lengthCm += Math.ceil(qty / 6) * 8; // 6 labels per row
    } else {
      lengthCm += Math.ceil(qty / 2) * 42; // 2 A3 designs per row
    }
  });

  // Tambah margin lead-in / potong 10 cm, bulatkan minimal 1 meter
  const usedCm = lengthCm + 10;
  const rawMeters = Math.max(1.0, usedCm / 100);
  // Round to nearest 0.5 meter (1.0m, 1.5m, 2.0m, etc.)
  const meters = Math.ceil(rawMeters * 2) / 2;
  const rollCapacityCm = Math.round(meters * 100);
  const remainingCm = Math.max(0, rollCapacityCm - usedCm);
  const rate = VENDOR_DTF_RATES.meterRate || 30000;
  const totalCost = Math.round(meters * rate);
  const costPerPcs = totalQty > 0 ? Math.round(totalCost / totalQty) : 12000;

  return {
    totalQty,
    meters,
    usedCm,
    rollCapacityCm,
    remainingCm,
    rate,
    totalCost,
    costPerPcs,
    orderItems,
    bufferItems,
    items: allItems
  };
}

/**
 * Generate vendor dispatch WhatsApp message text
 */
export function generateVendorWhatsAppText(gangSheet) {
  const now = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  const rateStr = (gangSheet.rate || 30000).toLocaleString('id-ID');
  let text = `*ORDER CETAK DTF METERAN — TEESTOCK*\n`;
  text += `Tanggal: ${now}\n`;
  text += `Lebar Roll: 60 cm (Area Efektif 58 cm)\n`;
  text += `Estimasi Panjang: *${gangSheet.meters} Meter*\n`;
  text += `Estimasi Biaya: *Rp ${(gangSheet.totalCost).toLocaleString('id-ID')}* (@Rp ${rateStr}/meter)\n`;
  text += `-----------------------------------------\n`;

  if (gangSheet.orderItems && gangSheet.orderItems.length > 0) {
    text += `*A. KEBUTUHAN PESANAN AKTIF:*\n`;
    gangSheet.orderItems.forEach((item, index) => {
      text += `${index + 1}. [${item.sku || 'SKU'}] ${item.productName || item.sku} — ${item.garment || 'NSA 30s'} (${item.color} ${item.size}) x${item.qty} pcs\n`;
    });
    text += `\n`;
  }

  if (gangSheet.bufferItems && gangSheet.bufferItems.length > 0) {
    text += `*B. BUFFER STOK & PENGISI ROLL 1 METER:*\n`;
    gangSheet.bufferItems.forEach((item, index) => {
      text += `${index + 1}. [${item.sku}] ${item.name} (${item.size || 'A3'}) x${item.qty} lembar\n`;
    });
    text += `\n`;
  }

  text += `-----------------------------------------\n`;
  text += `*Catatan Vendor:* Raster DTF HD, Tinta Putih pekat (White Underbase 100%), Hot/Cold Peel. File PDF/TIFF 300 DPI sudah diatur di Google Drive/Email.\n`;
  text += `Mohon konfirmasi kesiapan cetak & total tagihannya ya kak. Terima kasih! 🙏`;

  return text;
}
