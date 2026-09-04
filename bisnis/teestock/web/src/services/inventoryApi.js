import { supabase } from './supabase';
import { INITIAL_INVENTORY_MATRIX } from '../constants/seedData';

const LOCAL_STORAGE_KEY = 'teestock_inventory_matrix';

export async function getInventoryMatrix() {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
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
