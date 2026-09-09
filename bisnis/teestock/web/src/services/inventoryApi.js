import { supabase } from './supabase';
import { INITIAL_INVENTORY_MATRIX } from '../constants/seedData';

const LOCAL_STORAGE_KEY = 'teestock_inventory_matrix';

/**
 * 🌐 Ambil matriks stok inventori (Kaos polos NSA, DTF film, dan Supplies)
 * Prioritas: Cloud Supabase (ts_settings) -> LocalStorage -> INITIAL_INVENTORY_MATRIX
 */
export async function getInventoryMatrix() {
  // 1. Coba ambil dari Cloud Supabase
  try {
    const { data, error } = await supabase
      .from('ts_settings')
      .select('value')
      .eq('key', 'inventory_matrix')
      .maybeSingle();

    if (!error && data && data.value && typeof data.value === 'object') {
      const cloudMatrix = data.value;
      if (!cloudMatrix.dtf_films) {
        cloudMatrix.dtf_films = INITIAL_INVENTORY_MATRIX.dtf_films;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudMatrix));
      return cloudMatrix;
    }
  } catch (err) {
    console.warn('Cloud inventory fetch fallback:', err.message);
  }

  // 2. Fallback ke penyimpanan lokal browser
  const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (!parsed.dtf_films) {
        parsed.dtf_films = INITIAL_INVENTORY_MATRIX.dtf_films;
        saveInventoryMatrix(parsed);
      }
      return parsed;
    } catch (e) {
      console.error('Error parsing local inventory matrix:', e);
    }
  }

  // 3. Fallback ke seed awal
  return INITIAL_INVENTORY_MATRIX;
}

/**
 * 💾 Simpan matriks inventori ke LocalStorage & Cloud Supabase (ts_settings)
 */
export function saveInventoryMatrix(matrix) {
  if (!matrix) return matrix;

  // Update localStorage seketika untuk responsivitas instan antarmuka UI
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matrix));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Sinkronkan ke Cloud Supabase di latar belakang (non-blocking)
  try {
    supabase
      .from('ts_settings')
      .upsert({
        key: 'inventory_matrix',
        value: matrix,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })
      .then(({ error }) => {
        if (error) {
          console.warn('Sync inventory to Supabase notice:', error.message);
        }
      })
      .catch((syncErr) => {
        console.warn('Network sync inventory error:', syncErr);
      });
  } catch (err) {
    // Non-blocking network safety
  }

  return matrix;
}

/**
 * Potong stok garmen kaos polos (NSA Softstyle, Heavyweight, Longsleeve, dll.)
 */
export function deductStock(matrix, garmentKey, color, size, qty = 1) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (updated[garmentKey]?.[color]?.[size] !== undefined) {
    updated[garmentKey][color][size] = Math.max(0, updated[garmentKey][color][size] - Number(qty));
    saveInventoryMatrix(updated);
  }
  return updated;
}

/**
 * Potong stok film DTF studio siap press untuk SKU desain grafis tertentu
 */
export function deductDtfFilm(matrix, sku, qty = 1) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated.dtf_films) {
    updated.dtf_films = JSON.parse(JSON.stringify(INITIAL_INVENTORY_MATRIX.dtf_films || {}));
  }

  if (updated.dtf_films[sku]) {
    updated.dtf_films[sku].ready = Math.max(0, (updated.dtf_films[sku].ready || 0) - Number(qty));
    saveInventoryMatrix(updated);
  }
  return updated;
}

/**
 * Tambah / restok lembar film DTF per SKU
 */
export function restockDtfFilm(matrix, sku, qty = 1, unitCost = 12000, name = '') {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated.dtf_films) {
    updated.dtf_films = JSON.parse(JSON.stringify(INITIAL_INVENTORY_MATRIX.dtf_films || {}));
  }

  if (!updated.dtf_films[sku]) {
    updated.dtf_films[sku] = {
      name: name || sku,
      size: 'A3 (30x40 cm)',
      ready: 0,
      min: 2,
      unitCost: Number(unitCost) || 12000,
      category: 'graphic'
    };
  }

  updated.dtf_films[sku].ready = (updated.dtf_films[sku].ready || 0) + Number(qty);
  if (unitCost) {
    updated.dtf_films[sku].unitCost = Number(unitCost);
  }
  saveInventoryMatrix(updated);
  return updated;
}

/**
 * Restok satu batch film DTF meteran sekaligus (dari Gang Sheet Builder)
 */
export function restockDtfBatch(matrix, batchItems = []) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated.dtf_films) {
    updated.dtf_films = JSON.parse(JSON.stringify(INITIAL_INVENTORY_MATRIX.dtf_films || {}));
  }

  batchItems.forEach(item => {
    const sku = item.sku;
    if (!sku) return;
    const qty = Number(item.qty || 1);
    const unitCost = Number(item.unitCost || 12000);
    const name = item.name || sku;
    const size = item.size || 'A3 (30x40 cm)';
    const category = item.category || 'graphic';

    if (!updated.dtf_films[sku]) {
      updated.dtf_films[sku] = {
        name,
        size,
        ready: 0,
        min: 2,
        unitCost,
        category
      };
    }

    updated.dtf_films[sku].ready = (updated.dtf_films[sku].ready || 0) + qty;
    updated.dtf_films[sku].unitCost = unitCost;
  });

  saveInventoryMatrix(updated);
  return updated;
}
