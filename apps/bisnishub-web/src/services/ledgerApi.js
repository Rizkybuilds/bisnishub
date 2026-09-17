/**
 * BisnisHub Multi-Unit Financial Ledger & Treasury Engine (CFO Suite)
 * 
 * Mengisolasi saldo kas, arus kas, dan pencatatan keuangan secara ketat antara:
 * 1. TeeStock Apparel (Ritel & POD)
 * 2. MultiGraph Printing (Maklon & Kemasan B2B)
 * 3. Holding Reserve Treasury (Cadangan Modal & Beli Mesin)
 * 4. Dompet Ekuitas Founder (Injeksi Modal vs Prive Resmi)
 */
import { supabase } from './supabase.js';

const STORAGE_KEY = 'bisnishub_multiunit_ledger_v2';

export const WALLETS = {
  teestock: {
    id: 'wallet_teestock',
    name: 'Kas Operasional TeeStock',
    unit: 'teestock',
    bank: 'BCA Bisnis (TeeStock)',
    color: '#D95D39',
    badge: 'TeeStock Apparel'
  },
  multigraph: {
    id: 'wallet_multigraph',
    name: 'Kas Maklon MultiGraph',
    unit: 'multigraph',
    bank: 'BCA Maklon (MultiGraph)',
    color: '#10B981',
    badge: 'MultiGraph Print'
  },
  holding: {
    id: 'wallet_holding',
    name: 'Holding Reserve Treasury',
    unit: 'holding',
    bank: 'Kas Cadangan & Investasi Mesin',
    color: '#38BDF8',
    badge: 'Holding Treasury'
  },
  founder: {
    id: 'wallet_founder',
    name: 'Dompet Ekuitas Founder (Rizky)',
    unit: 'founder',
    bank: 'Rekening Pribadi Founder',
    color: '#D9A441',
    badge: 'Ekuitas / Prive'
  }
};

export const TRANSACTION_CATEGORIES = [
  { id: 'sales_retail', label: 'Penjualan Ritel Kaos (Web/WA)', unit: 'teestock', type: 'CASH_IN' },
  { id: 'custom_apparel', label: 'Pesanan Custom Sablon', unit: 'teestock', type: 'CASH_IN' },
  { id: 'blank_garment', label: 'Bahan Kaos Polos NSA Cititex', unit: 'teestock', type: 'CASH_OUT' },
  { id: 'dtf_printing', label: 'Cetak DTF Roll 58cm', unit: 'teestock', type: 'CASH_OUT' },
  { id: 'design_license', label: 'Beli Lisensi Desain (Etsy/Freelance)', unit: 'teestock', type: 'CASH_OUT' },
  { id: 'unboxing_packaging', label: 'Beli Paket Kemasan MultiGraph', unit: 'teestock', type: 'CASH_OUT' },
  { id: 'press_electricity', label: 'Listrik Heat Press 155°C & Studio', unit: 'teestock', type: 'CASH_OUT' },
  { id: 'payment_fee', label: 'Fee Payment Gateway (Midtrans 1.5%)', unit: 'teestock', type: 'CASH_OUT' },
  
  { id: 'b2b_packaging_dp', label: 'DP Cetak Kemasan Klien B2B (50-100%)', unit: 'multigraph', type: 'CASH_IN' },
  { id: 'b2b_packaging_settle', label: 'Pelunasan Cetak Kemasan B2B', unit: 'multigraph', type: 'CASH_IN' },
  { id: 'internal_supply_revenue', label: 'Pendapatan Pasokan Kemasan ke TeeStock', unit: 'multigraph', type: 'CASH_IN' },
  { id: 'raw_materials_packaging', label: 'Bahan Polymailer, Karton & Stiker', unit: 'multigraph', type: 'CASH_OUT' },
  { id: 'vendor_offset_maklon', label: 'Maklon Cetak Offset / Laser A3+', unit: 'multigraph', type: 'CASH_OUT' },
  
  { id: 'holding_profit_allocation', label: 'Alokasi Laba Ditahan ke Holding', unit: 'holding', type: 'CASH_IN' },
  { id: 'capex_machine_savings', label: 'Tabungan Beli Mesin In-House', unit: 'holding', type: 'CASH_IN' },
  { id: 'capex_purchase', label: 'Realisasi Pembelian Mesin/Aset', unit: 'holding', type: 'CASH_OUT' },
  { id: 'emergency_buffer', label: 'Penyaluran Dana Darurat', unit: 'holding', type: 'CASH_OUT' },
  
  { id: 'capital_injection', label: 'Injeksi Modal Pribadi Founder', unit: 'founder', type: 'CASH_IN' },
  { id: 'owner_prive', label: 'Penarikan Prive / Gaji Pemilik', unit: 'founder', type: 'CASH_OUT' },
  { id: 'operational_general', label: 'Operasional Umum & Logistik', unit: 'all', type: 'CASH_OUT' }
];

// Live Mode: Seluruh data transaksi fiktif telah dibersihkan
export const STARTER_TRANSACTIONS = [];

/**
 * Fetch all cash transactions from Supabase or localStorage
 */
export async function getCashTransactions() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ts_cash_ledger')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (!error && data && data.length > 0) {
        // Filter out legacy mockup transactions
        const liveRows = data.filter(d => !d.id?.startsWith('tx-2609-00') && !d.transaction_no?.startsWith('TX-CAP-001') && !d.transaction_no?.startsWith('TX-CAPEX-001'));
        return liveRows.map(mapFromSupabase);
      }
    } catch (err) {
      console.warn('Supabase getCashTransactions fallback:', err.message);
    }
  }

  if (typeof localStorage !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const clean = parsed.filter(t => !t.id?.startsWith('tx-2609-00') && !t.transactionNo?.startsWith('TX-CAP-001') && !t.transactionNo?.startsWith('TX-CAPEX-001'));
        return clean;
      } catch (e) {
        console.error("Failed to parse local cash ledger", e);
      }
    }
  }
  return [];
}

/**
 * Record a new cash transaction with multi-wallet support
 */
export async function recordCashTransaction(txData) {
  const newTx = {
    id: txData.id || `tx-${Date.now()}`,
    transactionNo: txData.transactionNo || `TX-${Date.now().toString().slice(-6)}`,
    date: txData.date || new Date().toISOString().slice(0, 10),
    businessUnit: txData.businessUnit || 'teestock', // teestock | multigraph | holding | founder
    type: txData.type || 'CASH_IN', // CASH_IN | CASH_OUT | INTER_TRANSFER | CAPITAL_INJECTION | FOUNDER_PRIVE
    category: txData.category || 'sales_retail',
    amount: Number(txData.amount) || 0,
    sourceWallet: txData.sourceWallet || 'wallet_teestock',
    destinationWallet: txData.destinationWallet || 'wallet_teestock',
    relatedId: txData.relatedId || '',
    proofReceiptRef: txData.proofReceiptRef || '',
    description: txData.description || 'Transaksi kas multi-unit',
    settlementStatus: txData.settlementStatus || 'cleared', // cleared | pending
    createdAt: txData.createdAt || new Date().toISOString()
  };

  if (supabase) {
    try {
      await supabase.from('ts_cash_ledger').insert([mapToSupabase(newTx)]);
    } catch (err) {
      console.warn('Supabase recordCashTransaction warning:', err.message);
    }
  }

  const current = await getCashTransactions();
  const updated = [newTx, ...current];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Record synchronized Inter-Unit Transfer
 * Example: TeeStock pays MultiGraph for unboxing pack (Rp 60.000)
 */
export async function recordInterUnitTransfer({ fromUnit, toUnit, amount, description, proofRef, relatedId }) {
  const fromWallet = `wallet_${fromUnit}`;
  const toWallet = `wallet_${toUnit}`;
  const amt = Number(amount);

  return await recordCashTransaction({
    transactionNo: `TX-INTER-${Date.now().toString().slice(-5)}`,
    date: new Date().toISOString().slice(0, 10),
    businessUnit: fromUnit,
    type: 'INTER_TRANSFER',
    category: fromUnit === 'teestock' && toUnit === 'multigraph' ? 'unboxing_packaging' : 'inter_unit_transfer',
    amount: amt,
    sourceWallet: fromWallet,
    destinationWallet: toWallet,
    relatedId: relatedId || `SETTLE-${fromUnit.toUpperCase()}-${toUnit.toUpperCase()}`,
    proofReceiptRef: proofRef || `INTERNAL-TRANSFER-${Date.now().toString().slice(-4)}`,
    description: description || `Transfer internal dari ${WALLETS[fromUnit]?.name || fromUnit} ke ${WALLETS[toUnit]?.name || toUnit}`,
    settlementStatus: 'cleared'
  });
}

/**
 * Calculate isolated balances for each individual unit
 */
export function calculateMultiUnitBalances(transactions = []) {
  let teestockBalance = 0;
  let multigraphBalance = 0;
  let holdingBalance = 0;
  
  let totalFounderInjected = 0;
  let totalFounderPrive = 0;
  let pendingSettlementTotal = 0;

  transactions.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    const isCleared = tx.settlementStatus !== 'pending';

    // Track pending settlements (e.g. gateway payments pending transfer to bank)
    if (tx.settlementStatus === 'pending') {
      pendingSettlementTotal += amt;
    }

    // Capital Injection & Prive Tracking
    if (tx.type === 'CAPITAL_INJECTION' || tx.category === 'capital_injection') {
      totalFounderInjected += amt;
      if (tx.destinationWallet === 'wallet_teestock' || tx.businessUnit === 'teestock') {
        if (isCleared) teestockBalance += amt;
      } else if (tx.destinationWallet === 'wallet_multigraph' || tx.businessUnit === 'multigraph') {
        if (isCleared) multigraphBalance += amt;
      } else {
        if (isCleared) holdingBalance += amt;
      }
      return;
    }

    if (tx.type === 'FOUNDER_PRIVE' || tx.category === 'owner_prive') {
      totalFounderPrive += amt;
      if (tx.sourceWallet === 'wallet_teestock' || tx.businessUnit === 'teestock') {
        if (isCleared) teestockBalance -= amt;
      } else if (tx.sourceWallet === 'wallet_multigraph' || tx.businessUnit === 'multigraph') {
        if (isCleared) multigraphBalance -= amt;
      } else {
        if (isCleared) holdingBalance -= amt;
      }
      return;
    }

    // Inter-Unit Transfers
    if (tx.type === 'INTER_TRANSFER') {
      if (isCleared) {
        if (tx.sourceWallet === 'wallet_teestock') teestockBalance -= amt;
        if (tx.sourceWallet === 'wallet_multigraph') multigraphBalance -= amt;
        if (tx.sourceWallet === 'wallet_holding') holdingBalance -= amt;

        if (tx.destinationWallet === 'wallet_teestock') teestockBalance += amt;
        if (tx.destinationWallet === 'wallet_multigraph') multigraphBalance += amt;
        if (tx.destinationWallet === 'wallet_holding') holdingBalance += amt;
      }
      return;
    }

    // Regular Cash In / Cash Out
    if (tx.businessUnit === 'teestock') {
      if (tx.type === 'CASH_IN') {
        if (isCleared) teestockBalance += amt;
      } else if (tx.type === 'CASH_OUT') {
        if (isCleared) teestockBalance -= amt;
      }
    } else if (tx.businessUnit === 'multigraph') {
      if (tx.type === 'CASH_IN') {
        if (isCleared) multigraphBalance += amt;
      } else if (tx.type === 'CASH_OUT') {
        if (isCleared) multigraphBalance -= amt;
      }
    } else if (tx.businessUnit === 'holding') {
      if (tx.type === 'CASH_IN') {
        if (isCleared) holdingBalance += amt;
      } else if (tx.type === 'CASH_OUT') {
        if (isCleared) holdingBalance -= amt;
      }
    }
  });

  const totalConsolidatedLiquidity = teestockBalance + multigraphBalance + holdingBalance;
  const netFounderEquity = totalFounderInjected - totalFounderPrive;

  return {
    teestock: {
      balance: teestockBalance,
      wallet: WALLETS.teestock
    },
    multigraph: {
      balance: multigraphBalance,
      wallet: WALLETS.multigraph
    },
    holding: {
      balance: holdingBalance,
      wallet: WALLETS.holding
    },
    founder: {
      injected: totalFounderInjected,
      prive: totalFounderPrive,
      netEquity: netFounderEquity,
      wallet: WALLETS.founder
    },
    totalConsolidatedLiquidity,
    pendingSettlementTotal
  };
}

/**
 * Calculate Unit P&L and Margin Diagnostics
 */
export function calculateUnitPnl(transactions = [], unit = 'teestock') {
  let revenue = 0;
  let cogs = 0;
  let opex = 0;
  let capex = 0;

  const unitTxs = transactions.filter(t => t.businessUnit === unit);

  unitTxs.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'CASH_IN' && tx.category !== 'capital_injection') {
      revenue += amt;
    } else if (tx.type === 'CASH_OUT' || tx.type === 'INTER_TRANSFER') {
      if (['blank_garment', 'dtf_printing', 'unboxing_packaging', 'raw_materials_packaging', 'vendor_offset_maklon', 'procurement'].includes(tx.category)) {
        cogs += amt;
      } else if (['capex_purchase', 'capex_machine_savings'].includes(tx.category)) {
        capex += amt;
      } else if (tx.category !== 'owner_prive') {
        opex += amt;
      }
    }
  });

  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - opex;
  const netMarginPercent = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0;
  const grossMarginPercent = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : 0;

  return {
    unit,
    revenue,
    cogs,
    grossProfit,
    opex,
    capex,
    netProfit,
    grossMarginPercent: Number(grossMarginPercent),
    netMarginPercent: Number(netMarginPercent),
    transactionCount: unitTxs.length
  };
}

/**
 * Calculate Daily Burn Rate & Runway in Months
 */
export function calculateRunwayAndBurnRate(transactions = [], totalLiquidity = 0) {
  // Find transactions in the last 30 days
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const recentExpenses = transactions.filter(t => {
    const txTime = new Date(t.date).getTime();
    return txTime >= thirtyDaysAgo && (t.type === 'CASH_OUT' || t.type === 'INTER_TRANSFER') && t.category !== 'owner_prive';
  });

  const totalExpenseLast30Days = recentExpenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const dailyBurnRate = Math.round(totalExpenseLast30Days / 30);
  const monthlyBurnRate = dailyBurnRate * 30;

  const runwayMonths = monthlyBurnRate > 0 
    ? (totalLiquidity / monthlyBurnRate).toFixed(1) 
    : '99+';

  return {
    dailyBurnRate,
    monthlyBurnRate,
    runwayMonths: Number(runwayMonths),
    totalExpenseLast30Days
  };
}

/**
 * Backward-compatible Ledger Summary calculation
 */
export function calculateLedgerSummary(transactions = []) {
  let totalCashIn = 0;
  let totalCashOut = 0;
  let totalInjected = 0;
  let totalPrive = 0;
  let bankBalance = 0;
  let qrisBalance = 0;

  transactions.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    const type = tx.type;
    const cat = tx.category;

    if (type === 'CASH_IN') {
      totalCashIn += amt;
    } else if (type === 'CASH_OUT') {
      totalCashOut += amt;
    }

    if (cat === 'personal_injection' || cat === 'capital_injection' || type === 'CAPITAL_INJECTION') {
      totalInjected += amt;
    }

    if (cat === 'owner_prive' || type === 'FOUNDER_PRIVE') {
      totalPrive += amt;
    }

    // Rough account allocation if available
    const src = tx.sourceAccount || tx.sourceWallet || '';
    const dst = tx.destinationAccount || tx.destinationWallet || '';

    if (dst.includes('bank') || dst.includes('teestock') || dst.includes('multigraph')) {
      bankBalance += type === 'CASH_IN' ? amt : -amt;
    }
    if (src.includes('qris') || dst.includes('qris')) {
      qrisBalance += type === 'CASH_IN' ? amt : -amt;
    }
  });

  const netCashLiquidity = totalCashIn - totalCashOut;
  const netFounderEquityInjected = totalInjected - totalPrive;

  return {
    totalCashIn,
    totalCashOut,
    netCashLiquidity,
    totalInjected,
    totalPrive,
    netFounderEquityInjected,
    bankBalance: Math.max(0, bankBalance),
    qrisBalance: Math.max(0, qrisBalance)
  };
}

export const addCashTransaction = recordCashTransaction;

/**
 * Enterprise Valuation & Holding Growth Engine (CFO Standard)
 * Menghitung valuasi bisnis menggunakan 3 metode standar:
 * 1. Net Asset Value (NAV / Nilai Buku Riil Kasat Mata)
 * 2. Earnings / SDE Multiple (Seller's Discretionary Earnings)
 * 3. Revenue Multiple (GMV Disetahunkan)
 */
export function calculateBusinessValuation({
  founderWealth = {},
  multiUnitBalances = {},
  teestockPnl = {},
  multigraphPnl = {},
  orders = [],
  cashTransactions = []
}) {
  // 1. Floor Valuation: Net Asset Value (NAV)
  const cashLiquidity = multiUnitBalances.totalConsolidatedLiquidity || founderWealth.netCashLiquidity || 0;
  const inventoryValue = founderWealth.totalInventoryValue || 0;
  const fixedAssetsValue = founderWealth.fixedAssetsValue || 0;
  const totalBookValueNAV = cashLiquidity + inventoryValue + fixedAssetsValue;

  // 2. Annualized Revenue & Orders Run-Rate
  const teestockRevenue = teestockPnl.revenue || 0;
  const multigraphRevenue = multigraphPnl.revenue || 0;
  const totalHoldingRevenueSample = teestockRevenue + multigraphRevenue;
  
  // Proyeksi Annualized Revenue (Basis konservatif: minimal sample x 12 atau Rp 35.000.000 run rate awal)
  const annualizedRevenue = Math.max(35000000, totalHoldingRevenueSample * 12);
  const revenueMultiple = 1.5; // Multiple standar apparel & custom merchandise bootstrap
  const revenueValuation = Math.round(annualizedRevenue * revenueMultiple);

  // 3. SDE (Seller's Discretionary Earnings) Valuation
  const totalNetProfitSample = (teestockPnl.netProfit || 0) + (multigraphPnl.netProfit || 0);
  const founderPrive = founderWealth.totalPrive || 0;
  // SDE tahunan = (Net Profit x 12) + Prive diskresioner pemilik
  const annualizedSDE = Math.max(15000000, (totalNetProfitSample * 12) + (founderPrive * 2));
  const sdeMultiple = 2.8; // Multiple UKM apparel / percetakan dengan repeat order
  const sdeValuation = Math.round(annualizedSDE * sdeMultiple);

  // 4. Weighted Fair Enterprise Valuation (Nilai Valuasi Wajar Konsolidasi)
  // Komposisi bobot: 40% Aset Nyata (NAV) + 40% Kemampuan Hasilkan Laba (SDE) + 20% Skala Omset
  const fairEnterpriseValuation = Math.round(
    (totalBookValueNAV * 0.40) + 
    (sdeValuation * 0.40) + 
    (revenueValuation * 0.20)
  );

  // 5. Growth Metrics
  const netFounderEquity = founderWealth.netFounderEquity || 4500000;
  const totalWealthGrowth = fairEnterpriseValuation - netFounderEquity;
  const wealthGrowthRatio = netFounderEquity > 0 
    ? ((fairEnterpriseValuation / netFounderEquity)).toFixed(2) 
    : '1.0';
  const wealthGrowthPercent = netFounderEquity > 0
    ? (((fairEnterpriseValuation - netFounderEquity) / netFounderEquity) * 100).toFixed(1)
    : '0.0';

  // 6. Holding Valuation Milestones
  const milestones = [
    {
      level: 1,
      name: 'Tahap 1: Bootstrap Foundation (Saat Ini)',
      targetValuation: 25000000,
      achieved: fairEnterpriseValuation >= 25000000,
      badge: 'Fase Validasi Pasar',
      desc: 'Peluncuran perdana Drop #01 TeeStock, maklon kemasan MultiGraph, kas operasional positif tanpa utang.'
    },
    {
      level: 2,
      name: 'Tahap 2: In-House DTF Machine Scale',
      targetValuation: 120000000,
      achieved: fairEnterpriseValuation >= 120000000,
      badge: 'Fase Efisiensi Mesin',
      desc: 'Realisasi pembelian mesin DTF roll 58cm in-house (Rp 65 Jt) di Holding Treasury, memangkas HPP DTF hingga 40%.'
    },
    {
      level: 3,
      name: 'Tahap 3: Multi-Unit Synergy Holding',
      targetValuation: 500000000,
      achieved: fairEnterpriseValuation >= 500000000,
      badge: 'Fase Ekosistem Penuh',
      desc: 'Aktivasi penuh Neo Pack (Kemasan Retail B2B) dan Squeegee Studios (Sablon Manual), kapasitas >1.000 order/bulan.'
    }
  ];

  return {
    totalBookValueNAV,
    cashLiquidity,
    inventoryValue,
    fixedAssetsValue,
    annualizedRevenue,
    revenueMultiple,
    revenueValuation,
    annualizedSDE,
    sdeMultiple,
    sdeValuation,
    fairEnterpriseValuation,
    netFounderEquity,
    totalWealthGrowth,
    wealthGrowthRatio: Number(wealthGrowthRatio),
    wealthGrowthPercent: Number(wealthGrowthPercent),
    milestones
  };
}


function mapFromSupabase(row) {
  return {
    id: row.id,
    transactionNo: row.transaction_no,
    date: row.transaction_date,
    businessUnit: row.business_unit || 'teestock',
    type: row.type,
    category: row.category,
    amount: Number(row.amount),
    sourceWallet: row.source_wallet || row.source_account || 'wallet_teestock',
    destinationWallet: row.destination_wallet || row.destination_account || 'wallet_teestock',
    relatedId: row.related_id,
    proofReceiptRef: row.proof_receipt_ref || '',
    description: row.description,
    settlementStatus: row.settlement_status || 'cleared',
    createdAt: row.created_at
  };
}

function mapToSupabase(item) {
  const payload = {
    transaction_no: item.transactionNo,
    transaction_date: item.date,
    type: item.type,
    category: item.category,
    amount: item.amount,
    source_account: item.sourceWallet,
    destination_account: item.destinationWallet,
    related_id: item.relatedId,
    description: item.description,
    created_at: item.createdAt
  };
  if (item.businessUnit) payload.business_unit = item.businessUnit;
  if (item.proofReceiptRef) payload.proof_receipt_ref = item.proofReceiptRef;
  if (item.settlementStatus) payload.settlement_status = item.settlementStatus;
  if (item.id && item.id.includes('-') && item.id.length === 36) payload.id = item.id;
  return payload;
}
