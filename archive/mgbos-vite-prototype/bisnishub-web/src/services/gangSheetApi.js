/**
 * Gang Sheet DTF 58 cm & Pre-Press Planning Services (TeeStock & MultiGraph OS)
 * Accurate Nesting Calculations, Executive KPIs, CSV Cut-List Manifest, and Vendor WhatsApp Dispatch
 */

import { VENDOR_DTF_RATES } from '@bisnishub/shared/constants/pricing';

/**
 * Dimensi standar artwork DTF (Lebar x Tinggi dalam cm) & Kapasitas per baris pada roll 58 cm
 */
export const DTF_DIMENSIONS = {
  a3_plus: { name: 'A3+ Graphic (30x42 cm)', widthCm: 30, heightCm: 42, perRow: 1, rowHeightCm: 44 },
  a3: { name: 'A3 Punggung (28x40 cm)', widthCm: 28, heightCm: 40, perRow: 2, rowHeightCm: 42 },
  a4: { name: 'A4 Depan (21x30 cm)', widthCm: 21, heightCm: 30, perRow: 2, rowHeightCm: 32 },
  a5: { name: 'A5 Sedang (14x20 cm)', widthCm: 14, heightCm: 20, perRow: 3, rowHeightCm: 22 },
  a6: { name: 'A6 / Logo Dada (9x9 cm)', widthCm: 9, heightCm: 9, perRow: 5, rowHeightCm: 11 },
  neck_tag: { name: 'Label Kerah Dalam (6x3 cm)', widthCm: 6, heightCm: 3, perRow: 8, rowHeightCm: 5 }
};

/**
 * 🧮 Kalkulasi Nesting Gang Sheet Presisi pada Roll Lebar Efektif 58 cm
 */
export function calculateAccurateGangSheet(orderItems = [], bufferItems = []) {
  const allItems = [...orderItems, ...bufferItems];
  const orderQty = orderItems.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  const bufferQty = bufferItems.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  const totalQty = orderQty + bufferQty;

  if (totalQty === 0) {
    return {
      totalQty: 0,
      orderQty: 0,
      bufferQty: 0,
      meters: 0,
      usedCm: 0,
      rollCapacityCm: 0,
      remainingCm: 0,
      usedPct: 0,
      rate: VENDOR_DTF_RATES?.meterRate || 30000,
      totalCost: 0,
      costPerPcs: 12000,
      bufferAssetValue: 0,
      orderItems: [],
      bufferItems: [],
      items: []
    };
  }

  // Hitung alokasi panjang roll (cm) berbasis estimasi baris
  let lengthCm = 0;

  allItems.forEach(item => {
    const qty = Number(item.qty) || 1;
    const sku = String(item.sku || '').toUpperCase();
    const sizeStr = String(item.size || item.printPreset || '').toLowerCase();

    let dimKey = 'a3';
    if (sku.startsWith('ACC-') || sizeStr.includes('kerah') || sizeStr.includes('label')) {
      dimKey = 'neck_tag';
    } else if (sizeStr.includes('logo') || sizeStr.includes('a6') || sizeStr.includes('saku')) {
      dimKey = 'a6';
    } else if (sizeStr.includes('a5')) {
      dimKey = 'a5';
    } else if (sizeStr.includes('a4')) {
      dimKey = 'a4';
    } else if (sizeStr.includes('a3_plus') || sizeStr.includes('a3+')) {
      dimKey = 'a3_plus';
    } else {
      dimKey = 'a3';
    }

    const spec = DTF_DIMENSIONS[dimKey] || DTF_DIMENSIONS.a3;
    const rowsNeeded = Math.ceil(qty / spec.perRow);
    lengthCm += rowsNeeded * spec.rowHeightCm;
  });

  // Tambah lead-in margin / batas potong roll 10 cm
  const usedCm = lengthCm + 10;
  const rawMeters = Math.max(1.0, usedCm / 100);
  // Bulatkan ke kelipatan 0.5 meter (1.0, 1.5, 2.0, 2.5, dst.) sesuai standar vendor percetakan DTF
  const meters = Math.ceil(rawMeters * 2) / 2;
  const rollCapacityCm = Math.round(meters * 100);
  const remainingCm = Math.max(0, rollCapacityCm - usedCm);
  const usedPct = rollCapacityCm > 0 ? Math.min(100, Math.round((usedCm / rollCapacityCm) * 100)) : 0;

  const rate = VENDOR_DTF_RATES?.meterRate || 30000;
  const totalCost = Math.round(meters * rate);
  const costPerPcs = totalQty > 0 ? Math.round(totalCost / totalQty) : 12000;

  const bufferAssetValue = bufferItems.reduce((sum, it) => {
    const cost = Number(it.unitCost) || 12000;
    const q = Number(it.qty) || 1;
    return sum + (cost * q);
  }, 0);

  return {
    totalQty,
    orderQty,
    bufferQty,
    meters,
    usedCm,
    rollCapacityCm,
    remainingCm,
    usedPct,
    rate,
    totalCost,
    costPerPcs,
    bufferAssetValue,
    orderItems,
    bufferItems,
    items: allItems
  };
}

/**
 * 📊 4 Executive KPI Ribbon Cards untuk Modul Gang Sheet
 */
export function getGangSheetKpis(gangSheet) {
  return {
    totalQty: gangSheet.totalQty || 0,
    orderQty: gangSheet.orderQty || 0,
    bufferQty: gangSheet.bufferQty || 0,
    meters: gangSheet.meters || 0,
    usedPct: gangSheet.usedPct || 0,
    remainingCm: gangSheet.remainingCm || 0,
    totalCost: gangSheet.totalCost || 0,
    costPerPcs: gangSheet.costPerPcs || 0,
    bufferAssetValue: gangSheet.bufferAssetValue || 0,
    rate: gangSheet.rate || 30000
  };
}

/**
 * 📥 Ekspor CSV Manifest Daftar Potong Gang Sheet (10 Kolom Ber-BOM UTF-8)
 */
export function exportGangSheetCutListCsv(gangSheet) {
  const headers = [
    'No',
    'Tipe Alokasi',
    'ID Pesanan / SKU',
    'Nama Desain / Item',
    'Spesifikasi Ukuran',
    'Jumlah (Lembar)',
    'Garmen Acuan',
    'Estimasi Biaya Satuan (Rp)',
    'Subtotal Biaya (Rp)',
    'Status Produksi'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = [];
  let rowIdx = 1;

  // Order Items
  (gangSheet.orderItems || []).forEach(o => {
    rows.push([
      rowIdx++,
      escapeCsv('Order Konsumen'),
      escapeCsv(o.id || o.sku || '-'),
      escapeCsv(o.productName || o.name || 'Kaos Grafis'),
      escapeCsv(o.size || 'A3 Punggung'),
      Number(o.qty) || 1,
      escapeCsv(`${o.garment || 'NSA'} (${o.color || ''} ${o.size || ''})`),
      gangSheet.costPerPcs || 12000,
      (gangSheet.costPerPcs || 12000) * (Number(o.qty) || 1),
      escapeCsv(o.status === 'dtf' ? 'Antrean Cetak DTF' : 'Pending')
    ].join(','));
  });

  // Buffer Items
  (gangSheet.bufferItems || []).forEach(b => {
    const unitCost = Number(b.unitCost) || gangSheet.costPerPcs || 12000;
    const qty = Number(b.qty) || 1;
    rows.push([
      rowIdx++,
      escapeCsv('Buffer Stok Studio'),
      escapeCsv(b.sku || '-'),
      escapeCsv(b.name || 'Artwork Buffer'),
      escapeCsv(b.size || 'A3'),
      qty,
      escapeCsv('Persediaan Gudang (Ready Stock)'),
      unitCost,
      unitCost * qty,
      escapeCsv('Siap Restock Gudang')
    ].join(','));
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TeeStock_GangSheet_CutList_${gangSheet.meters}m_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}

/**
 * 📲 Generator Teks Format Pemesanan WhatsApp ke Vendor DTF Meteran
 */
export function generateVendorWhatsAppText(gangSheet) {
  const now = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const rateStr = (gangSheet.rate || 30000).toLocaleString('id-ID');
  let text = `*ORDER CETAK DTF METERAN — TEESTOCK*\n`;
  text += `Tanggal: ${now}\n`;
  text += `Lebar Roll: 60 cm (Area Efektif 58 cm, Safe Margin 1.5 cm)\n`;
  text += `Estimasi Panjang: *${gangSheet.meters} Meter* (${gangSheet.usedCm} cm / ${gangSheet.rollCapacityCm} cm)\n`;
  text += `Estimasi Biaya: *Rp ${(gangSheet.totalCost || 0).toLocaleString('id-ID')}* (@Rp ${rateStr}/meter)\n`;
  text += `Tingkat Kepadatan: *${gangSheet.usedPct}%* (${gangSheet.remainingCm} cm sisa margin aman)\n`;
  text += `-----------------------------------------\n`;

  if (gangSheet.orderItems && gangSheet.orderItems.length > 0) {
    text += `*A. KEBUTUHAN PESANAN AKTIF (${gangSheet.orderQty || gangSheet.orderItems.length} pcs):*\n`;
    gangSheet.orderItems.forEach((item, index) => {
      text += `${index + 1}. [${item.sku || item.id || 'SKU'}] ${item.productName || item.name || 'Desain'} — ${item.garment || 'NSA 30s'} (${item.color || ''} ${item.size || ''}) x${item.qty || 1} pcs\n`;
    });
    text += `\n`;
  }

  if (gangSheet.bufferItems && gangSheet.bufferItems.length > 0) {
    text += `*B. BUFFER STOK & PENGISI ROLL 1 METER (${gangSheet.bufferQty || 0} lembar):*\n`;
    gangSheet.bufferItems.forEach((item, index) => {
      text += `${index + 1}. [${item.sku}] ${item.name} (${item.size || 'A3'}) x${item.qty} lembar\n`;
    });
    text += `\n`;
  }

  text += `-----------------------------------------\n`;
  text += `*Standar Pre-Flight COO:* Resolusi 300 DPI 1:1, Tinta Putih Pekat (White Underbase 100%), Jarak Antar Desain 10 mm, Hot/Cold Peel.\n`;
  text += `File cetak PDF/TIFF sudah diunggah ke link drive. Mohon konfirmasi jadwal cetak & total tagihannya ya kak. Terima kasih! 🙏`;

  return text;
}
