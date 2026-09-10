/**
 * TeeStock Cash Ledger API (Buku Kas Satu Pintu)
 * Memisahkan secara ketat Kas Bisnis vs Dompet Pribadi Founder.
 * Mengelola arus kas masuk (penjualan, modal masuk), kas keluar (belanja bahan, operasional),
 * dan penarikan prive founder.
 */
import { supabase } from './supabase';

const STORAGE_KEY = 'teestock_cash_ledger';

const STARTER_TRANSACTIONS = [
  {
    id: 'tx-001',
    transactionNo: 'TX-CAP-001',
    date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10),
    type: 'CASH_IN',
    category: 'personal_injection',
    amount: 5000000,
    sourceAccount: 'dompet_pribadi',
    destinationAccount: 'bank_teestock',
    relatedId: 'CAP-2609-001',
    description: 'Injeksi modal awal founder ke rekening operasional TeeStock',
    isPersonalWallet: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'tx-002',
    transactionNo: 'TX-CAP-002',
    date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10),
    type: 'CASH_OUT',
    category: 'capex_equipment',
    amount: 2500000,
    sourceAccount: 'bank_teestock',
    destinationAccount: 'Vendor Alat Sablon',
    relatedId: 'ASSET-PRESS-01',
    description: 'Pembelian Aset Tetap: Mesin Heat Press High-Pressure 38x38 cm',
    isPersonalWallet: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'tx-003',
    transactionNo: 'TX-PO-260901',
    date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10),
    type: 'CASH_OUT',
    category: 'procurement',
    amount: 435000,
    sourceAccount: 'bank_teestock',
    destinationAccount: 'Distributor Resmi NSA',
    relatedId: 'PO-2609-001',
    description: 'Belanja Bahan: NSA Softstyle 30s Black L (1 Lusin)',
    isPersonalWallet: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'tx-004',
    transactionNo: 'TX-PO-260902',
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    type: 'CASH_OUT',
    category: 'procurement',
    amount: 750000,
    sourceAccount: 'bank_teestock',
    destinationAccount: 'Vendor DTF Partner',
    relatedId: 'PO-2609-002',
    description: 'Belanja Bahan: Roll Film DTF 58 cm (25 meter)',
    isPersonalWallet: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'tx-005',
    transactionNo: 'TX-ORD-260901',
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    type: 'CASH_IN',
    category: 'sales_order',
    amount: 99000,
    sourceAccount: 'qris_midtrans',
    destinationAccount: 'bank_teestock',
    relatedId: 'SHOP-2609-001',
    description: 'Penjualan Pesanan: Commit & Pray (Budi Santoso)',
    isPersonalWallet: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function getCashTransactions() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ts_cash_ledger')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapFromSupabase);
      }
    } catch (err) {
      console.warn('Supabase getCashTransactions fallback:', err.message);
    }
  }

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse local cash ledger", e);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_TRANSACTIONS));
  return STARTER_TRANSACTIONS;
}

export async function addCashTransaction(txData) {
  const newTx = {
    id: txData.id || `tx-${Date.now()}`,
    transactionNo: txData.transactionNo || `TX-${Date.now().toString().slice(-6)}`,
    date: txData.date || new Date().toISOString().slice(0, 10),
    type: txData.type || 'CASH_IN', // CASH_IN | CASH_OUT
    category: txData.category || 'sales_order', // sales_order, procurement, capex_equipment, personal_injection, owner_prive, operational
    amount: Number(txData.amount) || 0,
    sourceAccount: txData.sourceAccount || 'bank_teestock',
    destinationAccount: txData.destinationAccount || '',
    relatedId: txData.relatedId || '',
    description: txData.description || 'Transaksi kas',
    isPersonalWallet: Boolean(txData.isPersonalWallet),
    createdAt: txData.createdAt || new Date().toISOString()
  };

  if (supabase) {
    try {
      await supabase.from('ts_cash_ledger').insert([mapToSupabase(newTx)]);
    } catch (err) {
      console.warn('Supabase addCashTransaction warning:', err.message);
    }
  }

  const current = await getCashTransactions();
  const updated = [newTx, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function calculateLedgerSummary(transactions = []) {
  let totalCashIn = 0;
  let totalCashOut = 0;
  let totalInjected = 0;
  let totalPrive = 0;
  let bankBalance = 0;
  let qrisBalance = 0;

  transactions.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'CASH_IN') {
      totalCashIn += amt;
      if (tx.category === 'personal_injection') {
        totalInjected += amt;
      }
      if (tx.destinationAccount === 'bank_teestock' || tx.sourceAccount === 'bank_teestock') {
        bankBalance += amt;
      }
      if (tx.sourceAccount === 'qris_midtrans') {
        qrisBalance += amt;
      }
    } else if (tx.type === 'CASH_OUT') {
      totalCashOut += amt;
      if (tx.category === 'owner_prive') {
        totalPrive += amt;
      }
      if (tx.sourceAccount === 'bank_teestock') {
        bankBalance -= amt;
      }
    }
  });

  const netCashLiquidity = totalCashIn - totalCashOut;
  const netFounderEquityInjected = totalInjected - totalPrive;

  return {
    totalCashIn,
    totalCashOut,
    netCashLiquidity,
    bankBalance: Math.max(0, netCashLiquidity),
    qrisBalance,
    totalInjected,
    totalPrive,
    netFounderEquityInjected
  };
}

function mapFromSupabase(row) {
  return {
    id: row.id,
    transactionNo: row.transaction_no,
    date: row.transaction_date,
    type: row.type,
    category: row.category,
    amount: Number(row.amount),
    sourceAccount: row.source_account,
    destinationAccount: row.destination_account,
    relatedId: row.related_id,
    description: row.description,
    isPersonalWallet: Boolean(row.is_personal_wallet),
    createdAt: row.created_at
  };
}

function mapToSupabase(item) {
  return {
    id: item.id.includes('-') && item.id.length === 36 ? item.id : undefined,
    transaction_no: item.transactionNo,
    transaction_date: item.date,
    type: item.type,
    category: item.category,
    amount: item.amount,
    source_account: item.sourceAccount,
    destination_account: item.destinationAccount,
    related_id: item.relatedId,
    description: item.description,
    is_personal_wallet: item.isPersonalWallet,
    created_at: item.createdAt
  };
}
