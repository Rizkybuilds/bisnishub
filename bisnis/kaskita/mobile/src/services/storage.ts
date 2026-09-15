// ============================================================================
// PERSISTENT STORAGE SERVICE
// File: src/services/storage.ts
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet, Transaction, Budget, Category, SocialObligation } from '../types';

const STORAGE_KEYS = {
  WALLETS: '@kaskita_wallets',
  TRANSACTIONS: '@kaskita_transactions',
  BUDGETS: '@kaskita_budgets',
  OBLIGATIONS: '@kaskita_obligations',
};

// --- DEFAULT SYSTEM CATEGORIES ---
export const DEFAULT_CATEGORIES: Category[] = [
  // Expense
  { id: 'cat_food', name: 'Makanan & Minuman', type: 'EXPENSE', icon: '🍛' },
  { id: 'cat_transport', name: 'Transportasi & Bensin', type: 'EXPENSE', icon: '⛽' },
  { id: 'cat_shopping', name: 'Belanja Harian', type: 'EXPENSE', icon: '🛒' },
  { id: 'cat_bills', name: 'Tagihan Rumah Tangga', type: 'EXPENSE', icon: '⚡' },
  { id: 'cat_rt', name: 'Iuran RT & Lingkungan', type: 'EXPENSE', icon: '🏢' },
  { id: 'cat_arisan', name: 'Setoran Arisan', type: 'EXPENSE', icon: '🎲' },
  { id: 'cat_debt', name: 'Pembayaran Utang', type: 'EXPENSE', icon: '🤝' },
  { id: 'cat_leisure', name: 'Kopi & Hiburan', type: 'EXPENSE', icon: '☕' },
  // Income
  { id: 'cat_salary', name: 'Gaji & Upah Bulanan', type: 'INCOME', icon: '💼' },
  { id: 'cat_business', name: 'Hasil Jualan / Bisnis', type: 'INCOME', icon: '💰' },
  { id: 'cat_arisan_win', name: 'Tarikan Arisan (Menang)', type: 'INCOME', icon: '🏆' },
  { id: 'cat_receivable', name: 'Pelunasan Piutang Teman', type: 'INCOME', icon: '📥' },
];

// --- INITIAL SEED DATA ---
export const INITIAL_WALLETS: Wallet[] = [
  { id: 'w_cash', name: 'Kas Tunai', wallet_type: 'CASH', balance: 450000, icon: '💵', is_default: true },
  { id: 'w_bca', name: 'Bank BCA', wallet_type: 'BANK', balance: 11200000, icon: '🏦' },
  { id: 'w_gopay', name: 'GoPay', wallet_type: 'EWALLET', balance: 800000, icon: '📱' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't_1',
    wallet_id: 'w_bca',
    category_id: 'cat_food',
    category_name: 'Makanan & Minuman',
    category_icon: '🍛',
    type: 'EXPENSE',
    amount: 25000,
    description: 'Makan Siang Nasi Padang',
    transaction_date: '2026-09-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 't_2',
    wallet_id: 'w_cash',
    category_id: 'cat_transport',
    category_name: 'Transportasi & Bensin',
    category_icon: '⛽',
    type: 'EXPENSE',
    amount: 30000,
    description: 'Bensin Motor Beat',
    transaction_date: '2026-09-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 't_3',
    wallet_id: 'w_bca',
    category_id: 'cat_salary',
    category_name: 'Gaji & Upah Bulanan',
    category_icon: '💼',
    type: 'INCOME',
    amount: 8500000,
    description: 'Gaji Pokok Masuk',
    transaction_date: '2026-09-01',
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    category_id: 'cat_food',
    category_name: 'Makanan & Minuman',
    category_icon: '🍛',
    limit_amount: 2000000,
    period_month: '2026-09',
  },
  {
    category_id: 'cat_transport',
    category_name: 'Transportasi & Bensin',
    category_icon: '⛽',
    limit_amount: 600000,
    period_month: '2026-09',
  },
  {
    category_id: 'cat_rt',
    category_name: 'Iuran RT & Lingkungan',
    category_icon: '🏢',
    limit_amount: 300000,
    period_month: '2026-09',
  },
];

export const INITIAL_OBLIGATIONS: SocialObligation[] = [
  {
    id: 'ob_1',
    title: 'Iuran RT 05 (Sampah & Ronda)',
    type: 'RT_DUES',
    amount: 50000,
    due_date: 'Jatuh Tempo H-2',
    status: 'UNPAID',
    group_name: 'RT 05 Sukamaju',
  },
  {
    id: 'ob_2',
    title: 'Arisan Keluarga Putaran #5',
    type: 'ARISAN',
    amount: 100000,
    due_date: '20 Okt 2026',
    status: 'PAID',
    group_name: 'Arisan Keluarga Besar',
  },
  {
    id: 'ob_3',
    title: 'Pinjaman ke Doni (Servis Motor)',
    type: 'DEBT',
    amount: 150000,
    due_date: '28 Okt 2026',
    status: 'UNPAID',
    group_name: 'Pribadi',
  },
];

// --- STORAGE HELPERS ---

export async function loadWalletsFromStorage(): Promise<Wallet[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.WALLETS);
    return raw ? JSON.parse(raw) : INITIAL_WALLETS;
  } catch {
    return INITIAL_WALLETS;
  }
}

export async function saveWalletsToStorage(wallets: Wallet[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
}

export async function loadTransactionsFromStorage(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export async function saveTransactionsToStorage(txs: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
}

export async function loadBudgetsFromStorage(): Promise<Budget[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
    return raw ? JSON.parse(raw) : INITIAL_BUDGETS;
  } catch {
    return INITIAL_BUDGETS;
  }
}

export async function saveBudgetsToStorage(budgets: Budget[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

export async function loadObligationsFromStorage(): Promise<SocialObligation[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OBLIGATIONS);
    return raw ? JSON.parse(raw) : INITIAL_OBLIGATIONS;
  } catch {
    return INITIAL_OBLIGATIONS;
  }
}

export async function saveObligationsToStorage(obs: SocialObligation[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.OBLIGATIONS, JSON.stringify(obs));
}
