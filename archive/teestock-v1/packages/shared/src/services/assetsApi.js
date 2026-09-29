/**
 * TeeStock Fixed Assets API (Pelacak Alat & Mesin Kerja / CAPEX)
 * Mengelola aset produktif jangka panjang: Mesin Heat Press, Printer, Perkakas Studio.
 * Dilengkapi mesin depresiasi garis lurus (Straight-Line Depreciation) sesuai standar PSAK & Fiskal.
 */
import { supabase } from './supabase';

const STORAGE_KEY = 'teestock_fixed_assets';

// Live Mode: Seluruh aset fiktif telah dibersihkan
const STARTER_ASSETS = [];

/**
 * Hitung Depresiasi Garis Lurus (Straight-Line Depreciation)
 * @param {Object} asset
 * @param {Date|string} targetDate
 */
export function calculateDepreciation(asset, targetDate = new Date()) {
  const purchaseCost = Number(asset.purchaseCost) || Number(asset.currentValue) || 0;
  const salvageValue = Number(asset.salvageValue) || 0;
  const usefulLifeMonths = Number(asset.usefulLifeMonths) || 48; // default 4 tahun
  const acqDate = asset.acquisitionDate ? new Date(asset.acquisitionDate) : new Date();
  const now = new Date(targetDate);

  // Basis yang dapat disusutkan
  const depreciableBase = Math.max(0, purchaseCost - salvageValue);

  // Beban depresiasi per bulan
  const monthlyDepreciation = usefulLifeMonths > 0 ? Math.round(depreciableBase / usefulLifeMonths) : 0;

  // Bulan berjalan sejak perolehan
  let elapsedMonths = (now.getFullYear() - acqDate.getFullYear()) * 12 + (now.getMonth() - acqDate.getMonth());
  if (elapsedMonths < 0) elapsedMonths = 0;

  // Bulan efektif yang telah disusutkan (tidak melebihi umur manfaat)
  const effectiveMonths = Math.min(usefulLifeMonths, elapsedMonths);

  // Akumulasi penyusutan
  const accumulatedDepreciation = Math.min(depreciableBase, effectiveMonths * monthlyDepreciation);

  // Nilai Buku Bersih (Net Book Value / NBV)
  const netBookValue = Math.max(salvageValue, purchaseCost - accumulatedDepreciation);

  // Sisa masa manfaat
  const remainingMonths = Math.max(0, usefulLifeMonths - effectiveMonths);

  // Prosentase penyusutan (0 - 100%)
  const progressPercent = usefulLifeMonths > 0 ? Math.min(100, Math.round((effectiveMonths / usefulLifeMonths) * 100)) : 100;

  return {
    purchaseCost,
    salvageValue,
    usefulLifeMonths,
    monthlyDepreciation,
    elapsedMonths,
    effectiveMonths,
    accumulatedDepreciation,
    netBookValue,
    remainingMonths,
    progressPercent,
    isFullyDepreciated: netBookValue <= salvageValue
  };
}

/**
 * Ringkasan Agregat Aset Tetap
 */
export function getFixedAssetsSummary(assets = []) {
  let totalAcquisitionCost = 0;
  let totalNetBookValue = 0;
  let totalAccumulatedDepreciation = 0;
  let totalMonthlyDepreciation = 0;
  let activeMachinesCount = 0;

  const activeAssets = assets.filter(a => a.status === 'active');

  activeAssets.forEach(a => {
    const dep = a.depreciation || calculateDepreciation(a);
    totalAcquisitionCost += Number(a.purchaseCost) || 0;
    totalNetBookValue += dep.netBookValue;
    totalAccumulatedDepreciation += dep.accumulatedDepreciation;
    totalMonthlyDepreciation += dep.monthlyDepreciation;
    if (a.category === 'machine') activeMachinesCount++;
  });

  return {
    totalAcquisitionCost,
    totalNetBookValue,
    totalAccumulatedDepreciation,
    totalMonthlyDepreciation,
    activeAssetsCount: activeAssets.length,
    activeMachinesCount
  };
}

export async function getFixedAssets() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ts_fixed_assets')
        .select('*')
        .order('acquisition_date', { ascending: false });

      if (!error && data && data.length > 0) {
        const liveRows = data.filter(a => !a.id?.startsWith('asset-00'));
        return liveRows.map(mapFromSupabase);
      }
    } catch (err) {
      console.warn('Supabase getFixedAssets fallback:', err.message);
    }
  }

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      const clean = parsed.filter(a => !a.id?.startsWith('asset-00'));
      return clean.map(a => {
        const dep = calculateDepreciation(a);
        return {
          ...a,
          currentValue: dep.netBookValue,
          depreciation: dep
        };
      });
    } catch (e) {
      console.error("Failed to parse local fixed assets", e);
    }
  }

  return [];
}

export async function saveFixedAsset(assetData) {
  const dep = calculateDepreciation({
    purchaseCost: Number(assetData.purchaseCost) || 0,
    salvageValue: Number(assetData.salvageValue) || 0,
    usefulLifeMonths: Number(assetData.usefulLifeMonths) || 48,
    acquisitionDate: assetData.acquisitionDate
  });

  const newAsset = {
    id: assetData.id || `asset-${Date.now()}`,
    assetName: assetData.assetName,
    businessUnit: assetData.businessUnit || 'teestock',
    category: assetData.category || 'machine',
    acquisitionDate: assetData.acquisitionDate || new Date().toISOString().slice(0, 10),
    purchaseCost: Number(assetData.purchaseCost) || 0,
    salvageValue: Number(assetData.salvageValue) || 0,
    usefulLifeMonths: Number(assetData.usefulLifeMonths) || 48,
    currentValue: dep.netBookValue,
    depreciation: dep,
    status: assetData.status || 'active',
    location: assetData.location || 'TeeStock Central Studio (Depok)',
    notes: assetData.notes || '',
    paymentSource: assetData.paymentSource || 'wallet_holding'
  };

  if (supabase) {
    try {
      await supabase.from('ts_fixed_assets').upsert([mapToSupabase(newAsset)]);
    } catch (err) {
      console.warn('Supabase saveFixedAsset warning:', err.message);
    }
  }

  const current = await getFixedAssets();
  const existingIdx = current.findIndex(a => a.id === newAsset.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newAsset;
  } else {
    updated = [newAsset, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteFixedAsset(id) {
  if (supabase) {
    try {
      await supabase.from('ts_fixed_assets').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteFixedAsset warning:', err.message);
    }
  }

  const current = await getFixedAssets();
  const updated = current.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getTotalFixedAssetsValue(assets = []) {
  return assets
    .filter(a => a.status === 'active')
    .reduce((sum, a) => {
      if (a.depreciation) return sum + a.depreciation.netBookValue;
      if (a.purchaseCost !== undefined) {
        const dep = calculateDepreciation(a);
        return sum + dep.netBookValue;
      }
      return sum + (Number(a.currentValue) || 0);
    }, 0);
}

/**
 * Unduh Jadwal Depresiasi Aset sebagai file CSV (12 Kolom PSAK)
 */
export function exportAssetsDepreciationCsv(assets = []) {
  const headers = [
    'ID Aset',
    'Nama Aset / Mesin',
    'Unit Bisnis',
    'Kategori',
    'Lokasi',
    'Tanggal Perolehan',
    'Harga Perolehan (IDR)',
    'Nilai Residu (IDR)',
    'Umur Manfaat (Bulan)',
    'Beban Depresiasi / Bln (IDR)',
    'Akumulasi Depresiasi (IDR)',
    'Nilai Buku Bersih (IDR)',
    'Status'
  ];

  const rows = assets.map(a => {
    const dep = a.depreciation || calculateDepreciation(a);
    return [
      `"${a.id || ''}"`,
      `"${(a.assetName || '').replace(/"/g, '""')}"`,
      `"${(a.businessUnit || 'teestock').toUpperCase()}"`,
      `"${a.category || 'machine'}"`,
      `"${(a.location || '').replace(/"/g, '""')}"`,
      `"${a.acquisitionDate || ''}"`,
      a.purchaseCost || 0,
      a.salvageValue || 0,
      a.usefulLifeMonths || 48,
      dep.monthlyDepreciation || 0,
      dep.accumulatedDepreciation || 0,
      dep.netBookValue || 0,
      `"${a.status || 'active'}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Jadwal-Depresiasi-Aset-BisnisHub-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function mapFromSupabase(row) {
  let businessUnit = 'teestock';
  let usefulLifeMonths = 48;
  let salvageValue = 0;
  let paymentSource = 'wallet_holding';
  let cleanNotes = row.notes || '';

  if (cleanNotes.includes('[CAPEX_META:')) {
    try {
      const match = cleanNotes.match(/\[CAPEX_META:(.*?)\]/);
      if (match && match[1]) {
        const meta = JSON.parse(match[1]);
        if (meta.businessUnit) businessUnit = meta.businessUnit;
        if (meta.usefulLifeMonths) usefulLifeMonths = Number(meta.usefulLifeMonths);
        if (meta.salvageValue !== undefined) salvageValue = Number(meta.salvageValue);
        if (meta.paymentSource) paymentSource = meta.paymentSource;
        cleanNotes = cleanNotes.replace(/\[CAPEX_META:.*?\]/, '').trim();
      }
    } catch (e) {
      console.warn('Failed to parse CAPEX_META from notes', e);
    }
  }

  const assetObj = {
    id: row.id,
    assetName: row.asset_name,
    businessUnit,
    category: row.category,
    acquisitionDate: row.acquisition_date,
    purchaseCost: Number(row.purchase_cost),
    salvageValue,
    usefulLifeMonths,
    currentValue: Number(row.current_value),
    status: row.status,
    location: row.location,
    notes: cleanNotes,
    paymentSource
  };

  const dep = calculateDepreciation(assetObj);
  assetObj.currentValue = dep.netBookValue;
  assetObj.depreciation = dep;
  return assetObj;
}

function mapToSupabase(item) {
  const metaTag = `[CAPEX_META:${JSON.stringify({
    businessUnit: item.businessUnit || 'teestock',
    usefulLifeMonths: Number(item.usefulLifeMonths) || 48,
    salvageValue: Number(item.salvageValue) || 0,
    paymentSource: item.paymentSource || 'wallet_holding'
  })}]`;

  const mergedNotes = item.notes 
    ? `${item.notes.replace(/\[CAPEX_META:.*?\]/, '').trim()} ${metaTag}`.trim()
    : metaTag;

  return {
    id: item.id && item.id.includes('-') && item.id.length === 36 ? item.id : undefined,
    asset_name: item.assetName,
    category: item.category,
    acquisition_date: item.acquisitionDate,
    purchase_cost: item.purchaseCost,
    current_value: item.currentValue,
    status: item.status,
    location: item.location,
    notes: mergedNotes
  };
}
