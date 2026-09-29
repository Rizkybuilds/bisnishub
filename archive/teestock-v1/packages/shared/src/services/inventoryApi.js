import { supabase } from './supabase.js';
import { INITIAL_INVENTORY_MATRIX } from '../constants/seedData.js';
import { GARMENT_TYPES, SIZES } from '../constants/garments.js';

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
function buildMatrixFromInventoryRows(rows = []) {
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

    if (!error && data) {
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
 * ⚡ Update / Upsert single row secara langsung ke tabel ts_inventory di Supabase
 * Menggunakan upsert (onConflict: sku_item) agar jika baris terhapus oleh user di database,
 * sistem secara otomatis membuat ulang (auto-healing) baris tersebut di Cloud.
 */
export async function updateDatabaseInventoryItem(skuItem, stockQty, costPerUnit, extraMeta = {}) {
  if (!skuItem) return;
  try {
    const qty = Math.max(0, parseInt(stockQty, 10) || 0);
    const payload = {
      sku_item: skuItem,
      stock_qty: qty,
      updated_at: new Date().toISOString()
    };
    if (costPerUnit) payload.cost_per_unit = Number(costPerUnit);

    // Siapkan atribut auto-healing jika baris belum ada di PostgreSQL
    if (skuItem.startsWith('NSA-')) {
      payload.item_type = 'blank_tshirt';
      payload.unit_measure = 'pcs';
      payload.supplier = 'Distributor Resmi NSA (Cititex)';
      const parts = skuItem.split('-');
      if (parts.length >= 4) {
        payload.brand = parts[1] === '30S' ? 'NSA Softstyle 30s' : parts[1] === '24S' ? 'NSA Heavyweight 24s' : `NSA ${parts[1]}`;
        payload.color = extraMeta.color || parts[2];
        payload.size = extraMeta.size || parts[parts.length - 1];
      }
      if (!payload.cost_per_unit) payload.cost_per_unit = 38000;
    } else if (skuItem.startsWith('MAT-')) {
      payload.item_type = 'supplies';
      payload.unit_measure = skuItem.includes('ROLL') || skuItem.includes('LAKBAN') ? 'roll' : 'pcs';
      payload.supplier = 'MultiGraph Packaging & Printing';
      payload.brand = extraMeta.name || skuItem;
      if (!payload.cost_per_unit) payload.cost_per_unit = 1000;
    } else if (skuItem.startsWith('DTF-') || skuItem.startsWith('TS-')) {
      payload.item_type = 'dtf_film';
      payload.unit_measure = skuItem.includes('ROLL') ? 'meter' : 'lembar';
      payload.brand = extraMeta.name || `Film DTF ${skuItem}`;
      payload.supplier = 'Vendor DTF Partner';
      if (!payload.cost_per_unit) payload.cost_per_unit = skuItem.includes('ROLL') ? 30000 : 12500;
    }

    const { error } = await supabase
      .from('ts_inventory')
      .upsert(payload, { onConflict: 'sku_item' });

    if (error) {
      console.warn(`Cloud upsert ts_inventory notice for ${skuItem}:`, error.message);
    }
  } catch (err) {
    console.warn(`Network error upserting ts_inventory for ${skuItem}:`, err.message);
  }
}

/**
 * 🔄 Sinkronisasi penuh & inisialisasi ulang seluruh 337 SKU ke Cloud PostgreSQL Supabase
 * Memastikan tabel ts_inventory dan ts_settings selalu memiliki struktur master lengkap
 * bahkan jika user pernah menghapus data di database secara manual.
 */
export async function syncFullInventoryToCloud() {
  const rows = [];
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

  // 1. Matriks Kaos Polos NSA
  Object.entries(GARMENT_TYPES).forEach(([gKey, gObj]) => {
    if (gKey === 'supplies') return;
    if (!matrix[gKey]) matrix[gKey] = {};
    const colors = gObj.colors || [];
    const sizes = gObj.sizes || SIZES || ["S", "M", "L", "XL", "2XL", "3XL"];
    colors.forEach(colObj => {
      const col = colObj.name;
      if (!matrix[gKey][col]) matrix[gKey][col] = {};
      const isWhite = col.toLowerCase() === 'white' || col.toLowerCase() === 'putih';
      const cost = isWhite ? (gObj.baseCostWhite || gObj.baseCost || 37000) : (gObj.baseCost || 37000);
      sizes.forEach(sz => {
        const cleanCol = col.toUpperCase().replace(/\s+/g, '');
        const sku = `${gObj.code || 'NSA'}-${cleanCol}-${sz}`;
        matrix[gKey][col][sz] = 0;
        rows.push({
          sku_item: sku,
          item_type: 'blank_tshirt',
          brand: gObj.name,
          color: col,
          size: sz,
          unit_measure: 'pcs',
          stock_qty: 0,
          min_stock_alert: 3,
          cost_per_unit: cost,
          supplier: 'Distributor Resmi NSA (Cititex)'
        });
      });
    });
  });

  // 2. DTF Graphic Films (Drop #01 + Roll)
  const dtfGraphics = [
    { sku: 'TS-STM-001', name: 'Raw Identity // Statement Tee', cost: 12500 },
    { sku: 'TS-STM-002', name: 'Quiet Confidence // Monolith Tee', cost: 12500 },
    { sku: 'TS-SUB-001', name: 'Tokyo Underground 94 // Bootleg Tee', cost: 12500 },
    { sku: 'TS-SUB-002', name: 'Echoes of Concrete // Skate Archive Tee', cost: 12500 },
    { sku: 'TS-OUT-001', name: 'Deep Forest // Expedition Tee', cost: 12500 },
    { sku: 'TS-OUT-002', name: 'Pine Needle // Botanical Archive Tee', cost: 12500 }
  ];
  dtfGraphics.forEach(d => {
    matrix.dtf_films[d.sku] = {
      name: d.name,
      size: 'A3 (30x40 cm)',
      ready: 0,
      min: 2,
      unitCost: d.cost,
      category: 'graphic'
    };
    rows.push({
      sku_item: d.sku,
      item_type: 'dtf_film',
      brand: `Film DTF ${d.name}`,
      color: 'Sablon DTF',
      size: 'A3',
      unit_measure: 'lembar',
      stock_qty: 0,
      min_stock_alert: 2,
      cost_per_unit: d.cost,
      supplier: 'Vendor DTF Partner'
    });
  });

  // Roll DTF
  matrix.dtf_films['DTF-ROLL-58CM'] = {
    name: 'Roll Film DTF 58 cm x 100 m',
    size: 'Roll 58 cm',
    ready: 0,
    min: 10,
    unitCost: 30000,
    category: 'roll'
  };
  rows.push({
    sku_item: 'DTF-ROLL-58CM',
    item_type: 'dtf_film',
    brand: 'Roll Film DTF 58 cm x 100 m',
    color: 'Transparan',
    size: 'Roll 58 cm',
    unit_measure: 'meter',
    stock_qty: 0,
    min_stock_alert: 10,
    cost_per_unit: 30000,
    supplier: 'Vendor DTF Partner'
  });

  // 3. Packaging & Operational Supplies
  const suppliesList = [
    { sku: 'MAT-POLY-30X40', brand: 'Polymailer Hitam Doff 30x40 cm', unit: 'pcs', cost: 800, min: 20 },
    { sku: 'MAT-STICKER-VP', brand: 'Stiker Vinyl Unboxing 6x6 cm', unit: 'pcs', cost: 600, min: 25 },
    { sku: 'MAT-CARE-A6', brand: 'Care Card & Thank You Insert A6', unit: 'pcs', cost: 400, min: 20 },
    { sku: 'MAT-HANGTAG-01', brand: 'Hangtag Distro Kraft Tebal', unit: 'pcs', cost: 500, min: 20 },
    { sku: 'MAT-TEFLON-SHEET', brand: 'Kertas Teflon Heat Press', unit: 'lembar', cost: 25000, min: 2 },
    { sku: 'MAT-LAKBAN-FRAGILE', brand: 'Lakban Fragile & Bening', unit: 'roll', cost: 15000, min: 2 }
  ];
  suppliesList.forEach(s => {
    rows.push({
      sku_item: s.sku,
      item_type: 'supplies',
      brand: s.brand,
      color: 'Standard',
      size: 'Standard',
      unit_measure: s.unit,
      stock_qty: 0,
      min_stock_alert: s.min,
      cost_per_unit: s.cost,
      supplier: 'MultiGraph Packaging & Printing'
    });
  });

  // Kirim upsert batch ke ts_inventory per 50 rows
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    await supabase.from('ts_inventory').upsert(chunk, { onConflict: 'sku_item' });
  }

  // Update ts_settings inventory_matrix
  await supabase.from('ts_settings').upsert({
    key: 'inventory_matrix',
    value: matrix,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });

  // Update local storage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matrix));
  }

  return matrix;
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
 * 📦 Batch Wholesale Restock: Tambah stok banyak warna & ukuran sekaligus dalam 1 nota pengadaan
 * itemsBreakdown: Array of { color, size, qty, unitCost, landedUnitCost }
 */
export function restockGarmentBatch(matrix, garmentKey, itemsBreakdown = []) {
  if (!itemsBreakdown || itemsBreakdown.length === 0) return matrix;

  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated[garmentKey]) updated[garmentKey] = {};

  const baseCost = GARMENT_TYPES[garmentKey]?.baseCost || 38000;

  itemsBreakdown.forEach(item => {
    const { color, size, qty, landedUnitCost } = item;
    const addQty = Number(qty) || 0;
    if (addQty <= 0 || !color || !size) return;

    if (!updated[garmentKey][color]) updated[garmentKey][color] = {};
    const current = Number(updated[garmentKey][color][size]) || 0;
    const nextQty = current + addQty;
    updated[garmentKey][color][size] = nextQty;

    // Sinkronkan ke real database tabel ts_inventory per SKU
    const sku = getBlankGarmentSku(garmentKey, color, size);
    updateDatabaseInventoryItem(sku, nextQty, landedUnitCost || baseCost);
  });

  saveInventoryMatrix(updated);
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
  let nextQty = 0;
  if (typeof raw === 'object' && raw !== null) {
    const current = Number(raw.ready ?? raw.qty ?? 0);
    nextQty = current + Number(qty);
    if ('ready' in raw) {
      raw.ready = nextQty;
    } else {
      raw.qty = nextQty;
    }
    updated.supplies[supplyId] = raw;
  } else {
    const current = Number(raw || 0);
    nextQty = current + Number(qty);
    updated.supplies[supplyId] = nextQty;
  }
  saveInventoryMatrix(updated);

  // Sinkronkan ke real database tabel ts_inventory
  const sku = getSupplySku(supplyId);
  updateDatabaseInventoryItem(sku, nextQty);

  return updated;
}

/**
 * Potong stok kemasan & material operasional (polymailer, sticker, hangtag, care card, dll.)
 */
export function deductSupplyItem(matrix, supplyId, qty = 1) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (!updated.supplies) {
    updated.supplies = {};
  }
  const raw = updated.supplies[supplyId];
  let nextQty = 0;
  if (typeof raw === 'object' && raw !== null) {
    const current = Number(raw.ready ?? raw.qty ?? 0);
    nextQty = Math.max(0, current - Number(qty));
    if ('ready' in raw) {
      raw.ready = nextQty;
    } else {
      raw.qty = nextQty;
    }
    updated.supplies[supplyId] = raw;
  } else {
    const current = Number(raw || 0);
    nextQty = Math.max(0, current - Number(qty));
    updated.supplies[supplyId] = nextQty;
  }
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

/**
 * ⚖️ Stock Opname Resmi: Penyesuaian stok fisik terotorisasi dengan berita acara & audit trail
 */
export function adjustStockOpname(matrix, payload = {}) {
  const {
    itemType, // 'blank_tshirt' | 'dtf_film' | 'supplies'
    sku,
    garmentKey,
    color,
    size,
    supplyId,
    actualQty,
    reason = 'Stock Opname Fisik Berkala',
    adminName = 'Admin Studio'
  } = payload;

  const targetQty = Math.max(0, Number(actualQty) || 0);
  const updated = JSON.parse(JSON.stringify(matrix));
  let previousQty = 0;
  let resolvedSku = sku;
  let unitHpp = 0;

  if (itemType === 'blank_tshirt' && garmentKey && color && size) {
    if (!updated[garmentKey]) updated[garmentKey] = {};
    if (!updated[garmentKey][color]) updated[garmentKey][color] = {};
    previousQty = Number(updated[garmentKey][color][size]) || 0;
    updated[garmentKey][color][size] = targetQty;
    resolvedSku = resolvedSku || getBlankGarmentSku(garmentKey, color, size);
    const gObj = GARMENT_TYPES[garmentKey] || {};
    unitHpp = gObj.baseCost || (garmentKey.includes('24s') ? 42000 : 37000);
  } else if (itemType === 'dtf_film' && sku) {
    if (!updated.dtf_films) updated.dtf_films = {};
    if (!updated.dtf_films[sku]) {
      updated.dtf_films[sku] = { name: sku, ready: 0, min: 2, unitCost: 12000 };
    }
    previousQty = Number(updated.dtf_films[sku].ready) || 0;
    updated.dtf_films[sku].ready = targetQty;
    unitHpp = Number(updated.dtf_films[sku].unitCost) || 12000;
  } else if (itemType === 'supplies' && supplyId) {
    if (!updated.supplies) updated.supplies = {};
    const raw = updated.supplies[supplyId];
    if (typeof raw === 'object' && raw !== null) {
      previousQty = Number(raw.ready ?? raw.qty ?? 0);
      if ('ready' in raw) raw.ready = targetQty;
      else raw.qty = targetQty;
      updated.supplies[supplyId] = raw;
      unitHpp = Number(raw.unitCost) || 800;
    } else {
      previousQty = Number(raw) || 0;
      updated.supplies[supplyId] = targetQty;
      unitHpp = supplyId === 'polymailer' ? 800 : supplyId === 'sticker' ? 600 : supplyId === 'hangtag' ? 500 : 800;
    }
    resolvedSku = resolvedSku || getSupplySku(supplyId);
  }

  // Simpan matriks ke memory / local storage
  saveInventoryMatrix(updated);

  // Sinkronkan ke database Supabase
  if (resolvedSku) {
    updateDatabaseInventoryItem(resolvedSku, targetQty, unitHpp);
  }

  // Rekam log audit trail opname ke localStorage
  const diffQty = targetQty - previousQty;
  const financialImpact = diffQty * unitHpp;
  const opnameLog = {
    id: `OPN-${Date.now()}`,
    timestamp: new Date().toISOString(),
    itemType,
    sku: resolvedSku,
    previousQty,
    actualQty: targetQty,
    diffQty,
    unitHpp,
    financialImpact,
    reason,
    adminName
  };

  try {
    const existingLogs = JSON.parse(localStorage.getItem('ts_stock_opname_logs') || '[]');
    existingLogs.unshift(opnameLog);
    localStorage.setItem('ts_stock_opname_logs', JSON.stringify(existingLogs.slice(0, 100)));
  } catch (e) {
    console.warn('Failed saving stock opname log:', e);
  }

  return {
    updatedMatrix: updated,
    opnameLog
  };
}

/**
 * 📊 Helper: Menghitung statistik eksekutif inventori (Valuasi Aset, Pcs Ready, DTF, SKU Kritis)
 */
export function calculateInventoryStats(matrix = {}) {
  let totalInventoryValue = 0;
  let totalBlankGarmentPcs = 0;
  let blankGarmentValue = 0;
  let totalDtfSheets = 0;
  let totalDtfAssetValue = 0;
  let totalSuppliesUnits = 0;
  let suppliesValue = 0;
  let criticalSkuCount = 0;
  let totalSkuCount = 0;

  // 1. Kaos Polos
  Object.entries(matrix).forEach(([gKey, colData]) => {
    if (gKey === 'supplies' || gKey === 'dtf_films') return;
    const gObj = GARMENT_TYPES[gKey];
    if (!gObj) return;
    const unitHpp = gObj.baseCost || (gKey.includes('24s') ? 42000 : 37000);

    Object.entries(colData || {}).forEach(([colName, szData]) => {
      Object.entries(szData || {}).forEach(([sz, count]) => {
        const qty = Number(count) || 0;
        totalBlankGarmentPcs += qty;
        blankGarmentValue += qty * unitHpp;
        totalSkuCount += 1;
        if (qty <= 2) {
          criticalSkuCount += 1;
        }
      });
    });
  });

  // 2. DTF Films
  if (matrix.dtf_films) {
    Object.entries(matrix.dtf_films).forEach(([sku, film]) => {
      const ready = Number(film.ready) || 0;
      const unitCost = Number(film.unitCost) || 12000;
      const min = Number(film.min) || 2;
      totalDtfSheets += ready;
      totalDtfAssetValue += ready * unitCost;
      totalSkuCount += 1;
      if (ready <= min) {
        criticalSkuCount += 1;
      }
    });
  }

  // 3. Supplies
  if (matrix.supplies) {
    Object.entries(matrix.supplies).forEach(([key, s]) => {
      const count = typeof s === 'object' && s !== null
        ? (Number(s.ready ?? s.qty) || 0)
        : (Number(s) || 0);
      const defaultRate = key === 'polymailer' ? 800 : key === 'sticker' ? 600 : key === 'hangtag' ? 500 : 800;
      const unitCost = typeof s === 'object' && s?.unitCost ? Number(s.unitCost) : defaultRate;
      const minStock = 50;
      totalSuppliesUnits += count;
      suppliesValue += count * unitCost;
      totalSkuCount += 1;
      if (count <= minStock) {
        criticalSkuCount += 1;
      }
    });
  }

  totalInventoryValue = blankGarmentValue + totalDtfAssetValue + suppliesValue;

  return {
    totalInventoryValue,
    totalBlankGarmentPcs,
    blankGarmentValue,
    totalDtfSheets,
    totalDtfAssetValue,
    totalSuppliesUnits,
    suppliesValue,
    criticalSkuCount,
    totalSkuCount
  };
}

/**
 * 📥 Ekspor Seluruh Matriks Inventori ke File CSV (11 Kolom Standar Opname Gudang)
 */
export function exportInventoryCsv(matrix = {}) {
  const rows = [];
  rows.push([
    'SKU Master',
    'Tipe Item',
    'Nama Model / Desain',
    'Varian Warna',
    'Ukuran',
    'Stok Sistem',
    'Satuan',
    'Estimasi HPP (Rp)',
    'Total Nilai Aset (Rp)',
    'Batas Aman Min',
    'Status Stok'
  ]);

  // 1. Kaos Polos
  Object.entries(matrix).forEach(([gKey, colData]) => {
    if (gKey === 'supplies' || gKey === 'dtf_films') return;
    const gObj = GARMENT_TYPES[gKey];
    if (!gObj) return;
    const unitHpp = gObj.baseCost || (gKey.includes('24s') ? 42000 : 37000);

    Object.entries(colData || {}).forEach(([colName, szData]) => {
      Object.entries(szData || {}).forEach(([sz, count]) => {
        const qty = Number(count) || 0;
        const sku = getBlankGarmentSku(gKey, colName, sz);
        const assetVal = qty * unitHpp;
        let status = 'Aman';
        if (qty === 0) status = 'Habis';
        else if (qty <= 2) status = 'Menipis';

        rows.push([
          sku,
          'Kaos Polos NSA',
          gObj.name || gKey,
          colName,
          sz,
          qty,
          'Pcs',
          unitHpp,
          assetVal,
          2,
          status
        ]);
      });
    });
  });

  // 2. DTF Films
  if (matrix.dtf_films) {
    Object.entries(matrix.dtf_films).forEach(([sku, film]) => {
      const ready = Number(film.ready) || 0;
      const unitCost = Number(film.unitCost) || 12000;
      const min = Number(film.min) || 2;
      const assetVal = ready * unitCost;
      let status = 'Aman';
      if (ready === 0) status = 'Habis';
      else if (ready <= min) status = 'Menipis';

      rows.push([
        sku,
        'Film DTF Siap Press',
        film.name || sku,
        'Full Color',
        film.size || 'A3',
        ready,
        sku.includes('ROLL') ? 'Meter' : 'Lembar',
        unitCost,
        assetVal,
        min,
        status
      ]);
    });
  }

  // 3. Supplies
  if (matrix.supplies) {
    Object.entries(matrix.supplies).forEach(([key, s]) => {
      const count = typeof s === 'object' && s !== null
        ? (Number(s.ready ?? s.qty) || 0)
        : (Number(s) || 0);
      const defaultRate = key === 'polymailer' ? 800 : key === 'sticker' ? 600 : key === 'hangtag' ? 500 : 800;
      const unitCost = typeof s === 'object' && s?.unitCost ? Number(s.unitCost) : defaultRate;
      const sku = getSupplySku(key);
      const assetVal = count * unitCost;
      const minStock = 50;
      let status = 'Aman';
      if (count === 0) status = 'Habis';
      else if (count <= minStock) status = 'Menipis';

      rows.push([
        sku,
        'Kemasan & Material',
        key.toUpperCase(),
        '-',
        '-',
        count,
        'Pcs',
        unitCost,
        assetVal,
        minStock,
        status
      ]);
    });
  }

  // Format to CSV string with quote escaping
  const csvContent = '\uFEFF' + rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `teestock_inventory_opname_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

