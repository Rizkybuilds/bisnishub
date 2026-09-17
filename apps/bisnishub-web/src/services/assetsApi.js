/**
 * TeeStock Fixed Assets API (Pelacak Alat & Mesin Kerja / CAPEX)
 * Mengelola aset produktif jangka panjang: Mesin Heat Press, Printer, Perkakas Studio.
 */
import { supabase } from './supabase';

const STORAGE_KEY = 'teestock_fixed_assets';

// Live Mode: Seluruh aset fiktif telah dibersihkan
const STARTER_ASSETS = [];

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
      return clean;
    } catch (e) {
      console.error("Failed to parse local fixed assets", e);
    }
  }

  return [];
}

export async function saveFixedAsset(assetData) {
  const newAsset = {
    id: assetData.id || `asset-${Date.now()}`,
    assetName: assetData.assetName,
    category: assetData.category || 'machine',
    acquisitionDate: assetData.acquisitionDate || new Date().toISOString().slice(0, 10),
    purchaseCost: Number(assetData.purchaseCost) || 0,
    currentValue: Number(assetData.currentValue) || Number(assetData.purchaseCost) || 0,
    status: assetData.status || 'active',
    location: assetData.location || 'TeeStock Central Studio (Depok)',
    notes: assetData.notes || ''
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
    .reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
}

function mapFromSupabase(row) {
  return {
    id: row.id,
    assetName: row.asset_name,
    category: row.category,
    acquisitionDate: row.acquisition_date,
    purchaseCost: Number(row.purchase_cost),
    currentValue: Number(row.current_value),
    status: row.status,
    location: row.location,
    notes: row.notes
  };
}

function mapToSupabase(item) {
  return {
    id: item.id.includes('-') && item.id.length === 36 ? item.id : undefined,
    asset_name: item.assetName,
    category: item.category,
    acquisition_date: item.acquisitionDate,
    purchase_cost: item.purchaseCost,
    current_value: item.currentValue,
    status: item.status,
    location: item.location,
    notes: item.notes
  };
}
