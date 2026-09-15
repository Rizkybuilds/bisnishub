// ============================================================================
// KASKITA GLOBAL STATE & CONTEXT PROVIDER
// File: src/context/AppContext.tsx
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Wallet, Transaction, Budget, Category, SocialObligation, TransactionType } from '../types';
import {
  DEFAULT_CATEGORIES,
  loadWalletsFromStorage,
  saveWalletsToStorage,
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
  loadBudgetsFromStorage,
  saveBudgetsToStorage,
  loadObligationsFromStorage,
  saveObligationsToStorage,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_OBLIGATIONS,
} from '../services/storage';

export type TabType = 'home' | 'transactions' | 'budget' | 'community';

interface AppContextType {
  // States
  wallets: Wallet[];
  transactions: Transaction[];
  budgets: Budget[];
  obligations: SocialObligation[];
  categories: Category[];
  activeTab: TabType;
  showBalance: boolean;
  isLoading: boolean;
  totalNetWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;

  // Actions
  setActiveTab: (tab: TabType) => void;
  toggleBalanceVisibility: () => void;
  addWallet: (newWallet: Omit<Wallet, 'id'>) => Promise<Wallet>;
  addTransaction: (txData: {
    wallet_id: string;
    category_id: string;
    type: TransactionType;
    amount: number;
    description: string;
    transaction_date?: string;
  }) => Promise<Transaction>;
  payObligation: (obligationId: string, walletId: string) => Promise<boolean>;
  updateBudget: (categoryId: string, limitAmount: number) => Promise<void>;
  resetToDefaultData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [obligations, setObligations] = useState<SocialObligation[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from storage on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [storedWallets, storedTxs, storedBudgets, storedObs] = await Promise.all([
        loadWalletsFromStorage(),
        loadTransactionsFromStorage(),
        loadBudgetsFromStorage(),
        loadObligationsFromStorage(),
      ]);
      setWallets(storedWallets);
      setTransactions(storedTxs);
      setBudgets(storedBudgets);
      setObligations(storedObs);
    } catch (err) {
      console.error('Failed to load storage data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Aggregated Financial Metrics
  const totalNetWorth = wallets.reduce((sum, w) => sum + w.balance, 0);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.transaction_date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter((t) => t.type === 'EXPENSE' && t.transaction_date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const toggleBalanceVisibility = () => {
    setShowBalance((prev) => !prev);
  };

  // Add a new wallet
  const addWallet = async (newWalletData: Omit<Wallet, 'id'>): Promise<Wallet> => {
    const newWallet: Wallet = {
      ...newWalletData,
      id: `w_${Date.now()}`,
    };
    const updated = [...wallets, newWallet];
    setWallets(updated);
    await saveWalletsToStorage(updated);
    return newWallet;
  };

  // Add transaction with automatic wallet balance updating
  const addTransaction = async (txData: {
    wallet_id: string;
    category_id: string;
    type: TransactionType;
    amount: number;
    description: string;
    transaction_date?: string;
  }): Promise<Transaction> => {
    const targetCategory = categories.find((c) => c.id === txData.category_id);
    const dateStr = txData.transaction_date || new Date().toISOString().slice(0, 10);

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      wallet_id: txData.wallet_id,
      category_id: txData.category_id,
      category_name: targetCategory?.name || 'Lain-lain',
      category_icon: targetCategory?.icon || '💳',
      type: txData.type,
      amount: txData.amount,
      description: txData.description,
      transaction_date: dateStr,
      created_at: new Date().toISOString(),
    };

    // Update wallet balance
    const updatedWallets = wallets.map((w) => {
      if (w.id === txData.wallet_id) {
        const delta = txData.type === 'INCOME' ? txData.amount : -txData.amount;
        return { ...w, balance: Math.max(0, w.balance + delta) };
      }
      return w;
    });

    const updatedTxs = [newTx, ...transactions];

    setWallets(updatedWallets);
    setTransactions(updatedTxs);

    await Promise.all([
      saveWalletsToStorage(updatedWallets),
      saveTransactionsToStorage(updatedTxs),
    ]);

    return newTx;
  };

  // Zero Double-Entry: Pay Obligation -> Mark paid + Deduct wallet + Record transaction
  const payObligation = async (obligationId: string, walletId: string): Promise<boolean> => {
    const ob = obligations.find((o) => o.id === obligationId);
    if (!ob || ob.status === 'PAID') return false;

    // Pick appropriate category based on obligation type
    let catId = 'cat_rt';
    if (ob.type === 'ARISAN') catId = 'cat_arisan';
    if (ob.type === 'DEBT') catId = 'cat_debt';

    // 1. Mark obligation as PAID
    const updatedObligations = obligations.map((o) =>
      o.id === obligationId ? { ...o, status: 'PAID' as const } : o
    );

    // 2. Record Expense transaction
    const targetCategory = categories.find((c) => c.id === catId);
    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      wallet_id: walletId,
      category_id: catId,
      category_name: targetCategory?.name || ob.title,
      category_icon: targetCategory?.icon || '🏢',
      type: 'EXPENSE',
      amount: ob.amount,
      description: `Bayar ${ob.title}`,
      transaction_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
    };

    // 3. Deduct wallet balance
    const updatedWallets = wallets.map((w) => {
      if (w.id === walletId) {
        return { ...w, balance: Math.max(0, w.balance - ob.amount) };
      }
      return w;
    });

    const updatedTxs = [newTx, ...transactions];

    setObligations(updatedObligations);
    setWallets(updatedWallets);
    setTransactions(updatedTxs);

    await Promise.all([
      saveObligationsToStorage(updatedObligations),
      saveWalletsToStorage(updatedWallets),
      saveTransactionsToStorage(updatedTxs),
    ]);

    return true;
  };

  // Update or add monthly budget
  const updateBudget = async (categoryId: string, limitAmount: number) => {
    const targetCategory = categories.find((c) => c.id === categoryId);
    const existing = budgets.find((b) => b.category_id === categoryId);
    let updated: Budget[];

    if (existing) {
      updated = budgets.map((b) =>
        b.category_id === categoryId ? { ...b, limit_amount: limitAmount } : b
      );
    } else {
      updated = [
        ...budgets,
        {
          category_id: categoryId,
          category_name: targetCategory?.name || 'Kategori',
          category_icon: targetCategory?.icon || '📁',
          limit_amount: limitAmount,
          period_month: currentMonth,
        },
      ];
    }

    setBudgets(updated);
    await saveBudgetsToStorage(updated);
  };

  // Reset to default sample data (useful for dev & testing)
  const resetToDefaultData = async () => {
    setWallets(INITIAL_WALLETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setObligations(INITIAL_OBLIGATIONS);

    await Promise.all([
      saveWalletsToStorage(INITIAL_WALLETS),
      saveTransactionsToStorage(INITIAL_TRANSACTIONS),
      saveBudgetsToStorage(INITIAL_BUDGETS),
      saveObligationsToStorage(INITIAL_OBLIGATIONS),
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        wallets,
        transactions,
        budgets,
        obligations,
        categories,
        activeTab,
        showBalance,
        isLoading,
        totalNetWorth,
        monthlyIncome,
        monthlyExpense,
        setActiveTab,
        toggleBalanceVisibility,
        addWallet,
        addTransaction,
        payObligation,
        updateBudget,
        resetToDefaultData,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
