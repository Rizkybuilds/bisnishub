import { supabase } from './supabase';
import { GARMENT_TYPES } from '../constants/garments';

const LOCAL_STORAGE_KEY = 'ts_defects_cache';

export const DEFECT_TYPES = {
  heat_press_failed: {
    id: 'heat_press_failed',
    label: 'Gagal Heat Press Studio (Kaos + Film Rusak)',
    defaultStage: 'internal_press',
    color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description: 'Sablon miring, lem tidak rekat, kain gosong atau mengelupas saat press in-house'
  },
  dtf_print: {
    id: 'dtf_print',
    label: 'Sablon DTF Cacat / Buram / Kurang Lem',
    defaultStage: 'vendor_dtf',
    color: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    description: 'Tinta blobor, lem bubuk bolong, underbase putih bergeser dari vendor cetak DTF'
  },
  garment_flaw: {
    id: 'garment_flaw',
    label: 'Garmen NSA Cacat / Bolong / Noda Pabrik',
    defaultStage: 'vendor_nsa',
    color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: 'Jahitan lepas, benang terputus, lubang jarum atau noda minyak pabrik dari supplier NSA'
  },
  shipping_return: {
    id: 'shipping_return',
    label: 'Retur Ekspedisi / Paket Rusak Pengiriman',
    defaultStage: 'courier',
    color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    description: 'Polymailer sobek, paket hilang, atau kemasan basah saat pengiriman kurir'
  },
  packaging_damaged: {
    id: 'packaging_damaged',
    label: 'Kemasan Polymailer / Stiker Rusak',
    defaultStage: 'internal_press',
    color: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
    description: 'Kemasan rusak saat proses packing QC akhir'
  }
};

export const RESPONSIBLE_PARTIES = {
  internal_press: { id: 'internal_press', label: 'Internal Studio Press & QC' },
  vendor_dtf: { id: 'vendor_dtf', label: 'Vendor Cetak DTF' },
  vendor_nsa: { id: 'vendor_nsa', label: 'Distributor Kaos NSA' },
  courier: { id: 'courier', label: 'Kurir Ekspedisi' }
};

export const CLAIM_STATUSES = {
  unclaimed: { id: 'unclaimed', label: 'Belum Diklaim', color: 'bg-zinc-800 text-zinc-400 border-white/[0.08]' },
  claimed_pending: { id: 'claimed_pending', label: 'Klaim Diajukan (Pending)', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  reimbursed: { id: 'reimbursed', label: 'Diganti / Reimbursed', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  internal_absorbed: { id: 'internal_absorbed', label: 'Diserap Internal Studio', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' }
};

/**
 * 🧮 Hitung Kerugian Riil HPP Scrap secara otomatis berdasarkan garmen dan film DTF
 */
export function calculateDefectLoss({
  defectType = 'heat_press_failed',
  garmentKey = 'nsa_softstyle_30s',
  qty = 1,
  unitGarmentCost = null,
  unitDtfCost = 12000
}) {
  const count = Math.max(1, Number(qty) || 1);

  // 1. Garment Cost
  let garmentHpp = 0;
  if (defectType === 'heat_press_failed' || defectType === 'garment_flaw' || defectType === 'shipping_return') {
    if (unitGarmentCost !== null && !isNaN(Number(unitGarmentCost))) {
      garmentHpp = Number(unitGarmentCost);
    } else {
      const gObj = GARMENT_TYPES[garmentKey];
      const isHeavy = garmentKey?.includes('24s') || garmentKey?.includes('heavy');
      garmentHpp = gObj?.baseCost || (isHeavy ? 42000 : 37000);
    }
  }

  // 2. DTF Film Cost
  let dtfHpp = 0;
  if (defectType === 'heat_press_failed' || defectType === 'dtf_print' || defectType === 'shipping_return') {
    dtfHpp = Number(unitDtfCost) || 12000;
  }

  // 3. Operational handling / electricity buffer per piece (for heat press failure)
  const opCost = defectType === 'heat_press_failed' ? 1000 : 0;

  const totalUnitLoss = garmentHpp + dtfHpp + opCost;
  const totalCostLoss = totalUnitLoss * count;

  return {
    garmentHpp,
    dtfHpp,
    opCost,
    totalUnitLoss,
    totalCostLoss
  };
}

/**
 * 📥 Ambil daftar defect dari Supabase (dengan cache localStorage)
 */
export async function getDefects() {
  try {
    const { data, error } = await supabase
      .from('ts_defects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map(d => ({
        id: d.id,
        sku: d.sku,
        orderId: d.order_id,
        defectType: d.defect_type || 'dtf_print',
        garmentKey: d.garment_key || 'nsa_softstyle_30s',
        garmentColor: d.garment_color || 'Hitam',
        garmentSize: d.garment_size || 'L',
        qty: Number(d.qty || 1),
        costLoss: Number(d.cost_loss || 0),
        responsibleStage: d.responsible_stage || 'vendor_dtf',
        claimStatus: d.claim_status || 'unclaimed',
        resolutionNotes: d.resolution_notes || '',
        date: d.created_at || new Date().toISOString()
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase getDefects network notice:', err);
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Failed reading defects cache:', e);
  }

  return [];
}

/**
 * 💾 Simpan catatan defect baru ke Supabase & localStorage
 */
export async function saveDefect(record) {
  const newRecord = {
    id: record.id || `def-${Date.now()}`,
    sku: record.sku || 'TS-PRO-001',
    orderId: record.orderId || null,
    defectType: record.defectType || 'heat_press_failed',
    garmentKey: record.garmentKey || 'nsa_softstyle_30s',
    garmentColor: record.garmentColor || 'Hitam',
    garmentSize: record.garmentSize || 'L',
    qty: Number(record.qty || 1),
    costLoss: Number(record.costLoss || 0),
    responsibleStage: record.responsibleStage || 'internal_press',
    claimStatus: record.claimStatus || 'unclaimed',
    resolutionNotes: record.resolutionNotes || '',
    date: record.date || new Date().toISOString()
  };

  // 1. Update cache lokal
  try {
    const existing = await getDefects();
    const updated = [newRecord, ...existing.filter(d => d.id !== newRecord.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local save defect error:', e);
  }

  // 2. Kirim ke Supabase
  try {
    await supabase.from('ts_defects').upsert([{
      id: newRecord.id,
      sku: newRecord.sku,
      order_id: newRecord.orderId,
      defect_type: newRecord.defectType,
      garment_key: newRecord.garmentKey,
      garment_color: newRecord.garmentColor,
      garment_size: newRecord.garmentSize,
      qty: newRecord.qty,
      cost_loss: newRecord.costLoss,
      responsible_stage: newRecord.responsibleStage,
      claim_status: newRecord.claimStatus,
      resolution_notes: newRecord.resolutionNotes
    }], { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase defect insert fallback:', err);
  }

  return newRecord;
}

/**
 * 🔄 Update status klaim garansi vendor (misal: unclaimed -> claimed_pending -> reimbursed)
 */
export async function updateDefectClaimStatus(id, newStatus) {
  try {
    const existing = await getDefects();
    const updated = existing.map(d => {
      if (d.id === id) {
        return { ...d, claimStatus: newStatus };
      }
      return d;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    await supabase
      .from('ts_defects')
      .update({ claim_status: newStatus })
      .eq('id', id);

    return updated;
  } catch (err) {
    console.warn('Update defect claim status error:', err);
    throw err;
  }
}

/**
 * 🗑️ Hapus catatan defect
 */
export async function deleteDefect(id) {
  try {
    const existing = await getDefects();
    const filtered = existing.filter(d => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

    await supabase.from('ts_defects').delete().eq('id', id);
    return filtered;
  } catch (err) {
    console.warn('Delete defect error:', err);
    throw err;
  }
}

/**
 * 📥 Ekspor Laporan Cacat & Scrap ke CSV (12 Kolom Standar QC & Finansial)
 */
export function exportDefectsCsv(defects = []) {
  const headers = [
    'No',
    'ID Defect',
    'Tanggal',
    'No Order Terkait',
    'SKU Desain / Item',
    'Varian Garmen (Warna / Ukuran)',
    'Jenis Cacat',
    'Jumlah (Pcs)',
    'Kerugian HPP (Rp)',
    'Pihak Bertanggung Jawab',
    'Status Klaim Vendor',
    'Catatan / Solusi QC'
  ];

  const rows = defects.map((d, index) => {
    const typeObj = DEFECT_TYPES[d.defectType] || { label: d.defectType };
    const partyObj = RESPONSIBLE_PARTIES[d.responsibleStage] || { label: d.responsibleStage };
    const claimObj = CLAIM_STATUSES[d.claimStatus] || { label: d.claimStatus };
    const garmentInfo = d.garmentColor && d.garmentSize 
      ? `${d.garmentColor} (${d.garmentSize})` 
      : '-';

    return [
      index + 1,
      d.id,
      d.date ? d.date.slice(0, 10) : '-',
      d.orderId || '-',
      d.sku || '-',
      garmentInfo,
      typeObj.label,
      d.qty || 1,
      d.costLoss || 0,
      partyObj.label,
      claimObj.label,
      d.resolutionNotes || '-'
    ];
  });

  const csvContent = '\uFEFF' + [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `teestock_scrap_defects_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
