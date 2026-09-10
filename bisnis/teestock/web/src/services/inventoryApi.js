import { supabase } from './supabase';
import { INITIAL_INVENTORY_MATRIX } from '../constants/seedData';
import { GARMENT_TYPES } from '../constants/garments';

const LOCAL_STORAGE_KEY = 'teestock_inventory_matrix';

/**
 * Helper: Generate SKU standar untuk garmen polos NSA
 */
export function getBlankGarmentSku(garmentKey, color, size) {
  const gObj = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_heavyweight_24s;
  const cleanColor = (color || 'HITAM').toUpperCase().replace(/\s+/g, '');
  return `${gObj?.code || 'NSA'}-${cleanColor}-${size || 'L'}`;
}

/**
 * Helper: Generate SKU standar untuk kemasan & material operasional
 */
export function getSupplySku(supplyId) {
  switch (supplyId) {
    case 'polymailer': return 'MAT-POLY-30X40';
    case 'sticker': return 'MAT-STICKER-VP';
    case 'care_card': return 'MAT-CARE-A6';
    case 'hangtag': return 'MAT-HANGTAG-01';
    case 'teflon_sheet': return 'MAT-TEFLON-SHEET';
    case 'lakban': return 'MAT-LAKBAN-FRAGILE';
    default: return `MAT-${(supplyId || '').toUpperCase()}`;
  }
}

/**
 * 🔄 Helper: Merekonstruksi 2D matrix [garmentKey][color][size] dari baris ts_inventory di Supabase
 */
export function buildMatrixFromInventoryRows(rows = []) {
  const matrix = {
    supplies: {
      polymailer: 0,
      sticker: 0,
      care_card: 0,
      hangtag: 0,
      teflon_sheet: 0,
      lakban: 0
    },
    dtf_films: {},
    nsa_softstyle_30s: {},
    nsa_heavyweight_24s: {}
  };

  // Pre-initialize empty containers for all garment types
  Object.keys(GARMENT_TYPES).forEach(k => {
    if (k !== 'supplies') matrix[k] = {};
  });

  rows.forEach(r => {
    const itemType = r.item_type;
    const sku = r.sku_item || '';
    const qty = Math.max(0, Number(r.stock_qty) || 0);

    if (itemType === 'blank_tshirt') {
      // Tentukan garmentKey berdasarkan pola SKU atau nama model
      let gKey = 'nsa_softstyle_30s';
      if (sku.includes('24S') || r.brand?.includes('24s')) gKey = 'nsa_heavyweight_24s';
      else if (sku.includes('30S') || r.brand?.includes('30s')) gKey = 'nsa_softstyle_30s';
      else if (sku.includes('5480') || r.brand?.includes('5480')) gKey = 'nsa_heavy_longsleeve';
      else if (sku.includes('LS') || r.brand?.includes('Long Sleeve')) gKey = 'nsa_longsleeve';
      else if (sku.includes('HOD') || r.brand?.includes('Hoodie') || sku.includes('9500')) gKey = 'nsa_hoodie';
      else if (sku.includes('POL') || r.brand?.includes('Polo') || sku.includes('8100')) gKey = 'nsa_polo';
      else if (sku.includes('5400') || r.brand?.includes('20s')) gKey = 'nsa_heavyweight_20s';
      else if (sku.includes('7250') || r.brand?.includes('Ringer')) gKey = 'nsa_ringer';
      else if (sku.includes('7260') || r.brand?.includes('Raglan')) gKey = 'nsa_raglan';
      else if (sku.includes('9000') || r.brand?.includes('Crewneck')) gKey = 'nsa_crewneck';
      else if (sku.includes('2700') || r.brand?.includes('Dri-Fit')) gKey = 'nsa_drifit';
      else if (sku.includes('72Y00') || r.brand?.includes('Youth')) gKey = 'nsa_youth';

      if (!matrix[gKey]) matrix[gKey] = {};
      const col = r.color || 'Hitam';
      const sz = r.size || 'L';
      if (!matrix[gKey][col]) matrix[gKey][col] = {};
      matrix[gKey][col][sz] = qty;
    } else if (itemType === 'supplies' || itemType === 'packaging') {
      let supplyId = 'polymailer';
      if (sku.includes('POLY') || r.brand?.toLowerCase().includes('polymailer')) supplyId = 'polymailer';
      else if (sku.includes('STICKER') || r.brand?.toLowerCase().includes('stiker')) supplyId = 'sticker';
      else if (sku.includes('CARE') || r.brand?.toLowerCase().includes('care')) supplyId = 'care_card';
      else if (sku.includes('HANGTAG') || r.brand?.toLowerCase().includes('hangtag')) supplyId = 'hangtag';
      else if (sku.includes('TEFLON') || r.brand?.toLowerCase().includes('teflon')) supplyId = 'teflon_sheet';
      else if (sku.includes('LAKBAN') || r.brand?.toLowerCase().includes('lakban')) supplyId = 'lakban';
      matrix.supplies[supplyId] = qty;
    } else if (itemType === 'dtf_film') {
      matrix.dtf_films[sku] = {
        name: r.brand || sku,
        ready: qty,
        unitCost: Number(r.cost_per_unit) || 12000,
        min: Number(r.min_stock_alert) || 2
      };
    }
  });

  return matrix;
}

/**
 * 🌐 Ambil matriks stok inventori (Kaos polos NSA, DTF film, dan Supplies)
 * Prioritas: Tabel Relasional ts_inventory -> Cloud ts_settings -> LocalStorage -> INITIAL_INVENTORY_MATRIX
 */
export async function getInventoryMatrix() {
  // 1. Coba ambil langsung dari tabel relasional ts_inventory di Cloud Supabase
  try {
    const { data, error } = await supabase
      .from('ts_inventory')
      .select('*')
      .order('sku_item');

    if (!error && data && data.length > 0) {
      const reconstructed = buildMatrixFromInventoryRows(data);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reconstructed));
      }
      return reconstructed;
    }
  } catch (err) {
    console.warn('Cloud ts_inventory fetch notice:', err.message);
  }

  // 2. Fallback kedua: Ambil dari ts_settings (inventory_matrix)
  try {
    const { data, error } = await supabase
      .from('ts_settings')
      .select('value')
      .eq('key', 'inventory_matrix')
      .maybeSingle();

    if (!error && data?.value && typeof data.value === 'object' && Object.keys(data.value).length > 0) {
      const cloudMatrix = data.value;
      if (!cloudMatrix.dtf_films) cloudMatrix.dtf_films = INITIAL_INVENTORY_MATRIX.dtf_films;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudMatrix));
      }
      return cloudMatrix;
    }
  } catch (err) {
    console.warn('Cloud ts_settings inventory fetch notice:', err.message);
  }

  // 3. Fallback ketiga: LocalStorage browser
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

  // 4. Fallback ke seed awal
  return INITIAL_INVENTORY_MATRIX;
}

/**
 * ⚡ Update single row secara langsung ke tabel ts_inventory di Supabase
 */
export async function updateDatabaseInventoryItem(skuItem, stockQty, costPerUnit) {
  if (!skuItem) return;
  try {
    const payload = {
      stock_qty: Math.max(0, parseInt(stockQty, 10) || 0),
      updated_at: new Date().toISOString()
    };
    if (costPerUnit) payload.cost_per_unit = Number(costPerUnit);

    const { error } = await supabase
      .from('ts_inventory')
      .update(payload)
      .eq('sku_item', skuItem);

    if (error) {
      console.warn(`Cloud update ts_inventory notice for ${skuItem}:`, error.message);
    }
  } catch (err) {
    console.warn(`Network error updating ts_inventory for ${skuItem}:`, err.message);
  }
}

/**
 * 💾 Simpan matriks inventori ke LocalStorage, ts_settings, dan sinkronisasi baris ts_inventory
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
    const nextQty = Math.max(0, updated[garmentKey][color][size] - Number(qty));
    updated[garmentKey][color][size] = nextQty;
    saveInventoryMatrix(updated);

    // Sinkronkan ke real database tabel ts_inventory
    const sku = getBlankGarmentSku(garmentKey, color, size);
    updateDatabaseInventoryItem(sku, nextQty);
  }
  return updated;
}

/**
 * Tambah stok garmen kaos polos (Restok dari Pengadaan Bahan)
 */
export function restockBlankGarment(matrix, garmentKey, color, size, qty = 1) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated[garmentKey]) updated[garmentKey] = {};
  if (!updated[garmentKey][color]) updated[garmentKey][color] = {};
  const current = Number(updated[garmentKey][color][size]) || 0;
  const nextQty = current + Number(qty);
  updated[garmentKey][color][size] = nextQty;
  saveInventoryMatrix(updated);

  // Sinkronkan ke real database tabel ts_inventory
  const sku = getBlankGarmentSku(garmentKey, color, size);
  const cost = GARMENT_TYPES[garmentKey]?.baseCost || 38000;
  updateDatabaseInventoryItem(sku, nextQty, cost);

  return updated;
}

/**
 * Tambah / restok kemasan & material operasional (polymailer, sticker, hangtag, care card, dll.)
 */
export function restockSupplyItem(matrix, supplyId, qty = 1) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated.supplies) {
    updated.supplies = {};
  }
  const raw = updated.supplies[supplyId];
  const current = typeof raw === 'object' && raw !== null ? Number(raw.qty || 0) : Number(raw || 0);
  const nextQty = current + Number(qty);
  updated.supplies[supplyId] = nextQty;
  saveInventoryMatrix(updated);

  // Sinkronkan ke real database tabel ts_inventory
  const sku = getSupplySku(supplyId);
  updateDatabaseInventoryItem(sku, nextQty);

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
    const nextQty = Math.max(0, (updated.dtf_films[sku].ready || 0) - Number(qty));
    updated.dtf_films[sku].ready = nextQty;
    saveInventoryMatrix(updated);

    // Sinkronkan ke real database tabel ts_inventory
    updateDatabaseInventoryItem(sku, nextQty);
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

  const nextQty = (updated.dtf_films[sku].ready || 0) + Number(qty);
  updated.dtf_films[sku].ready = nextQty;
  if (unitCost) {
    updated.dtf_films[sku].unitCost = Number(unitCost);
  }
  saveInventoryMatrix(updated);

  // Sinkronkan ke real database tabel ts_inventory
  updateDatabaseInventoryItem(sku, nextQty, unitCost);

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

    const nextQty = (updated.dtf_films[sku].ready || 0) + qty;
    updated.dtf_films[sku].ready = nextQty;
    updated.dtf_films[sku].unitCost = unitCost;

    // Sinkronkan ke real database tabel ts_inventory
    updateDatabaseInventoryItem(sku, nextQty, unitCost);
  });

  saveInventoryMatrix(updated);
  return updated;
}
