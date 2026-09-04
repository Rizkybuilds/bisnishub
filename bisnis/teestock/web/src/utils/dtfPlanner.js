import { VENDOR_DTF_RATES } from "../constants/pricing";

/**
 * Calculates roll length (meters) and costs based on ready items
 */
export function calculateGangSheet(orderItems) {
  const totalQty = orderItems.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  
  if (totalQty === 0) {
    return {
      totalQty: 0,
      meters: 0,
      totalCost: 0,
      costPerPcs: 12750,
      items: []
    };
  }

  // Estimasi: 2 artwork A3 muat bersebelahan atau berurutan dalam ~58 cm lebar cetak x 42 cm panjang roll
  const meters = (Math.ceil(totalQty / 2) * 0.42 + 0.1).toFixed(2);
  const totalCost = Math.round(parseFloat(meters) * VENDOR_DTF_RATES.meterRate);
  const costPerPcs = Math.round(totalCost / totalQty);

  return {
    totalQty,
    meters: parseFloat(meters),
    totalCost,
    costPerPcs,
    items: orderItems
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

  let text = `*ORDER CETAK DTF METERAN — TEESTOCK*\n`;
  text += `Tanggal: ${now}\n`;
  text += `Lebar Roll: 60 cm (Area Efektif 58 cm)\n`;
  text += `Estimasi Panjang: ${gangSheet.meters} Meter\n`;
  text += `Estimasi Biaya: Rp ${(gangSheet.totalCost).toLocaleString('id-ID')} (@Rp 85.000/meter)\n`;
  text += `-----------------------------------------\n`;
  text += `*RINCIAN FILE & DESAIN:*\n`;

  gangSheet.items.forEach((item, index) => {
    text += `${index + 1}. [${item.sku || 'SKU'}] ${item.productName || item.sku} — ${item.garment || 'NSA 30s'} (${item.color} ${item.size}) x${item.qty} pcs\n`;
  });

  text += `-----------------------------------------\n`;
  text += `*Catatan Vendor:* Raster DTF HD, Tinta Putih pekat (White Underbase 100%), Hot/Cold Peel. File siap cetak sudah diatur di Google Drive/Email.\n`;
  text += `Mohon konfirmasi total dan nomor rekening. Terima kasih!`;

  return text;
}
