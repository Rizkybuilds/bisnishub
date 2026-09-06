import { supabase } from './supabase';
import { INITIAL_INVENTORY_MATRIX } from '../constants/seedData';

const LOCAL_STORAGE_KEY = 'teestock_inventory_matrix';

export async function getInventoryMatrix() {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Ensure dtf_films exists even if user has previous cache in localStorage
      if (!parsed.dtf_films) {
        parsed.dtf_films = INITIAL_INVENTORY_MATRIX.dtf_films;
        saveInventoryMatrix(parsed);
      }
      return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_INVENTORY_MATRIX;
}

export function saveInventoryMatrix(matrix) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matrix));
  return matrix;
}

export function deductStock(matrix, garmentKey, color, size, qty = 1) {
  const updated = JSON.parse(JSON.stringify(matrix));
  if (updated[garmentKey]?.[color]?.[size] !== undefined) {
    updated[garmentKey][color][size] = Math.max(0, updated[garmentKey][color][size] - Number(qty));
    saveInventoryMatrix(updated);
  }
  return updated;
}

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
