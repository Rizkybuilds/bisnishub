/**
 * 🚚 TeeStock & MultiGraph Vendor Management API
 * Layanan database mitra vendor dan maklon percetakan/apparel,
 * agregasi belanja riil YTD dari pengadaan bahan (procurements),
 * generator pesan WhatsApp direct, dan ekspor CSV 12-kolom.
 */

import { INITIAL_VENDORS } from '../mockData';
import { normalizePhoneNumber } from './customersApi';

const LOCAL_STORAGE_VENDORS_KEY = 'bh_vendors';

export const VENDOR_CATEGORIES = {
  garment: { 
    id: 'garment', 
    label: 'Kaos Polos NSA', 
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
  },
  dtf_print: { 
    id: 'dtf_print', 
    label: 'DTF Roll 58cm', 
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
  },
  packaging: { 
    id: 'packaging', 
    label: 'Kemasan & Stiker', 
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
  },
  expedition: { 
    id: 'expedition', 
    label: 'Logistik & Resi', 
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
  }
};

/**
 * Format mata uang Rupiah
 */
export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
}

/**
 * Ambil daftar seluruh vendor dari localStorage atau fallback default
 */
export function getVendors() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_VENDORS_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(INITIAL_VENDORS));
      return INITIAL_VENDORS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_VENDORS;
  } catch (err) {
    console.warn("Could not read vendors from localStorage:", err);
    return INITIAL_VENDORS;
  }
}

/**
 * Simpan atau perbarui data vendor
 */
export function saveVendor(vendorData) {
  const current = getVendors();
  const cleanPhone = normalizePhoneNumber(vendorData.phone);
  
  let updated;
  if (vendorData.id && current.some(v => v.id === vendorData.id)) {
    updated = current.map(v => v.id === vendorData.id ? { ...v, ...vendorData, phone: cleanPhone } : v);
  } else {
    const newVendor = {
      ...vendorData,
      id: vendorData.id || `vnd-${Date.now()}`,
      phone: cleanPhone,
      rating: Number(vendorData.rating) || 5,
      status: vendorData.status || 'active'
    };
    updated = [newVendor, ...current];
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save vendor to localStorage:", e);
  }

  return updated;
}

/**
 * Hapus vendor berdasarkan ID
 */
export function deleteVendor(vendorId) {
  const current = getVendors();
  const updated = current.filter(v => v.id !== vendorId);
  try {
    localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save after vendor delete:", e);
  }
  return updated;
}

/**
 * Reset vendor ke konfigurasi default holding
 */
export function resetDefaultVendors() {
  try {
    localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(INITIAL_VENDORS));
  } catch (e) {}
  return INITIAL_VENDORS;
}

/**
 * Menghitung akumulasi belanja riil pengadaan (YTD Spend) untuk satu vendor
 */
export function calculateVendorSpend(vendor, procurements = []) {
  if (!vendor || !Array.isArray(procurements)) {
    return { totalSpend: 0, totalPoCount: 0, lastPoDate: null };
  }

  const vNameLower = (vendor.name || '').toLowerCase();
  const vCategory = vendor.category;

  // Filter procurements yang supplier atau itemType cocok
  const matchedPos = procurements.filter(p => {
    const pSupplier = (p.supplier || '').toLowerCase();
    const pItemType = p.itemType || '';
    const pSku = (p.itemSku || p.sku || '').toLowerCase();

    // 1. Cocok nama supplier
    if (pSupplier.includes(vNameLower) || vNameLower.includes(pSupplier)) {
      return true;
    }

    // 2. Keyword matching berdasarkan kategori vendor
    if (vCategory === 'garment' && (pSupplier.includes('cititex') || pSupplier.includes('nsa') || pItemType === 'blank_tshirt')) {
      return true;
    }
    if (vCategory === 'dtf_print' && (pSupplier.includes('dtf') || pSupplier.includes('senen') || pItemType === 'dtf_roll')) {
      return true;
    }
    if (vCategory === 'packaging' && (pSupplier.includes('polymailer') || pSupplier.includes('stiker') || pSupplier.includes('kemasan') || pItemType === 'packaging' || pItemType === 'sticker_vendor')) {
      return true;
    }

    return false;
  });

  const totalSpend = matchedPos.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const totalPoCount = matchedPos.length;

  // Cari tanggal PO terbaru
  let lastPoDate = null;
  if (matchedPos.length > 0) {
    matchedPos.sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0));
    lastPoDate = matchedPos[0].date || matchedPos[0].created_at || null;
  }

  return {
    totalSpend,
    totalPoCount,
    lastPoDate
  };
}

/**
 * Menghitung 4 Executive KPI Ribbon Cards untuk Modul Vendor
 */
export function calculateVendorKpis(vendors = [], procurements = []) {
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;

  let totalRatingSum = 0;
  let ratingCount = 0;
  const categoryCounts = { garment: 0, dtf_print: 0, packaging: 0, expedition: 0 };

  vendors.forEach(v => {
    if (v.rating) {
      totalRatingSum += Number(v.rating);
      ratingCount += 1;
    }
    if (categoryCounts[v.category] !== undefined) {
      categoryCounts[v.category] += 1;
    }
  });

  const averageRating = ratingCount > 0 ? Number((totalRatingSum / ratingCount).toFixed(1)) : 5.0;

  // Akumulasi total belanja pengadaan seluruh vendor
  const totalYtdSpend = Array.isArray(procurements)
    ? procurements.reduce((sum, p) => sum + (p.totalCost || 0), 0)
    : 0;

  // Cari kategori vendor dengan jumlah terbanyak
  let topCategory = 'garment';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      topCategory = cat;
    }
  });

  return {
    totalVendors,
    activeVendors,
    totalYtdSpend,
    averageRating,
    topCategory,
    topCategoryLabel: VENDOR_CATEGORIES[topCategory]?.label || 'Kaos Polos NSA',
    categoryCounts
  };
}

/**
 * Generator Pesan WhatsApp Siap Kirim ke PIC Vendor
 */
export function generateVendorWhatsAppMessage(vendor, messageType = 'stock_inquiry') {
  if (!vendor) return '';
  const pic = vendor.pic || 'Mas/Mbak PIC';
  const vName = vendor.name || 'Vendor Mitra';

  switch (messageType) {
    case 'stock_inquiry':
      return `Halo ${pic} (${vName})! 👋\nSaya Rizky dari TeeStock Apparel Studio.\n\nMau cek ketersediaan stok untuk batch hari ini apakah ada:\n- NSA Heavyweight 24s (Hitam & Putih, Size M, L, XL)\n- NSA Softstyle 30s (Hitam, Size M & L)\n\nApakah stoknya ready di gudang untuk kami ambil/pickup siang ini? Terima kasih banyak! 🙏`;

    case 'dtf_order':
      return `Halo ${pic} (${vName})! 🖨️✨\nDari TeeStock Studio ada antrean file cetak roll DTF lebar 58 cm siap kirim.\n\n• Format: TIFF 300 DPI 1:1 Transparan (Safe margin 1.5 cm)\n• Estimasi Panjang: Meteran roll baru\n• Kebutuhan: Urgent pengerjaan heat press in-house\n\nBoleh minta link Google Drive atau nomor WhatsApp operator mesin yang ready untuk terima file? Terima kasih! 🚀`;

    case 'payment_confirmation':
      return `Halo ${pic} (${vName})! 💳\nKami telah melakukan transfer pembayaran pengadaan TeeStock ke rekening resmi vendor:\n• Rekening Tujuan: ${vendor.bankAccount || 'Rekening Vendor'}\n\nMohon dicek mutasi masuknya ya. Bukti transfer kami lampirkan setelah pesan ini. Terima kasih atas kerjasamanya! 🙌`;

    default:
      return `Halo ${pic} (${vName})! Saya Rizky dari TeeStock Apparel & MultiGraph Holding. Mau koordinasi terkait pesanan bahan.`;
  }
}

/**
 * Menghasilkan direct URL WhatsApp ke kontak PIC vendor
 */
export function getVendorWhatsAppUrl(vendor, messageType = 'stock_inquiry') {
  const phone = vendor?.phone ? normalizePhoneNumber(vendor.phone) : '';
  const text = generateVendorWhatsAppMessage(vendor, messageType);
  if (!phone) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Ekspor Database Vendor ke CSV 12 Kolom dengan UTF-8 BOM
 */
export function exportVendorsCsv(vendors = [], procurements = []) {
  const headers = [
    'ID Vendor',
    'Nama Vendor',
    'Kategori Rantai Pasok',
    'Nama PIC',
    'No. WhatsApp',
    'Rekening Bank',
    'Alamat Lengkap',
    'Catatan Harga & Tarif',
    'Rating Performa',
    'Akumulasi Belanja YTD (Rp)',
    'Total PO Diterbitkan',
    'Status Operasional'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = vendors.map(v => {
    const spendInfo = calculateVendorSpend(v, procurements);
    const catLabel = VENDOR_CATEGORIES[v.category]?.label || v.category;

    return [
      escapeCsv(v.id),
      escapeCsv(v.name),
      escapeCsv(catLabel),
      escapeCsv(v.pic),
      escapeCsv(v.phone),
      escapeCsv(v.bankAccount),
      escapeCsv(v.address),
      escapeCsv(v.pricingNotes),
      v.rating || 5,
      spendInfo.totalSpend || 0,
      spendInfo.totalPoCount || 0,
      escapeCsv(v.status || 'active')
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
  link.setAttribute('download', `Database-Mitra-Vendor-TeeStock-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}
