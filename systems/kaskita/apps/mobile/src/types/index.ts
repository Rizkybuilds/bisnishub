// ============================================================================
// MOBILE APPLICATION TYPES
// File: src/types/index.ts
// ============================================================================

export type WalletType = 'CASH' | 'BANK' | 'EWALLET';

export interface Wallet {
  id: string;
  name: string;
  wallet_type: WalletType;
  balance: number;
  icon: string;
  is_default?: boolean;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string; // YYYY-MM-DD
  created_at: string;
}

export interface Budget {
  category_id: string;
  category_name: string;
  category_icon: string;
  limit_amount: number;
  period_month: string; // YYYY-MM
}

export interface SocialObligation {
  id: string;
  title: string;
  type: 'RT_DUES' | 'ARISAN' | 'DEBT';
  amount: number;
  due_date: string; // e.g. "H-2", "20 Okt"
  status: 'UNPAID' | 'PAID';
  group_name: string;
}
