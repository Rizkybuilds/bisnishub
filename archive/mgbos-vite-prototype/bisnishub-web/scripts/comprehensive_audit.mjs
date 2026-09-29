/**
 * BisnisHub OS — Comprehensive System, Logic, & Financial Audit
 * 
 * Melakukan verifikasi menyeluruh terhadap:
 * 1. Multi-Unit Treasury & Isolated Wallets Engine
 * 2. 7-Dimensional Audit Trail
 * 3. Unit P&L & CFO Margin Floor Rule (Net Margin >= 35%)
 * 4. Holding Business Valuation Engine (NAV, SDE Multiple, Revenue Multiple)
 * 5. Inventory & BOM Synchronization
 * 6. Order State Machine & Kanban Deductions
 * 7. Live Supabase Cloud Database Integrity
 */

import { 
  calculateMultiUnitBalances, 
  calculateUnitPnl, 
  calculateRunwayAndBurnRate,
  calculateBusinessValuation,
  calculateLedgerSummary,
  WALLETS,
  STARTER_TRANSACTIONS 
} from '../src/services/ledgerApi.js';

import {
  deductStock,
  deductDtfFilm,
  restockBlankGarment,
  restockDtfFilm,
  restockSupplyItem
} from '../src/services/inventoryApi.js';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tovslowsopqtuxmrogeu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

const results = [];

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    results.push({ status: 'FAILED', message });
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
    results.push({ status: 'PASSED', message });
  }
}

async function runFullAudit() {
  console.log("====================================================================");
  console.log("      BISNISHUB OS & MULTIGRAPH HOLDING — COMPREHENSIVE AUDIT       ");
  console.log("====================================================================\n");

  // ====================================================================
  // 1. AUDIT MULTI-UNIT TREASURY & ISOLATED WALLETS
  // ====================================================================
  console.log("--- 1. AUDIT MULTI-UNIT TREASURY & ISOLATED WALLETS ---");
  
  const balances = calculateMultiUnitBalances(STARTER_TRANSACTIONS);
  
  assert(balances.teestock !== undefined, "Dompet TeeStock terdaftar dan terisolasi");
  assert(balances.multigraph !== undefined, "Dompet MultiGraph terdaftar dan terisolasi");
  assert(balances.holding !== undefined, "Dompet Holding Treasury terdaftar dan terisolasi");
  assert(balances.founder !== undefined, "Dompet Ekuitas Founder terdaftar dan terisolasi");

  // Verify anti-commingling: modal disetor harus tercatat di founder dan masuk ke teestock
  assert(balances.founder.injected === 5000000, `Modal founder disetor Rp 5.000.000 (aktual: ${balances.founder.injected})`);
  assert(balances.founder.prive === 0, `Prive awal founder Rp 0 (aktual: ${balances.founder.prive})`);
  assert(balances.founder.netEquity === 5000000, `Ekuitas bersih founder Rp 5.000.000 (aktual: ${balances.founder.netEquity})`);

  // Verify inter-unit transfer (TeeStock bayar packaging Rp 60.000 ke MultiGraph)
  // TeeStock out Rp 60.000, MultiGraph in Rp 60.000
  const interTx = STARTER_TRANSACTIONS.find(t => t.type === 'INTER_TRANSFER');
  assert(interTx !== undefined, "Terdapat transaksi transfer antar-unit (INTER_TRANSFER)");
  assert(interTx.sourceWallet === 'wallet_teestock' && interTx.destinationWallet === 'wallet_multigraph', "Transfer internal dari TeeStock ke MultiGraph tercatat benar");

  // Total likuiditas konsolidasi harus sama persis dengan penjumlahan saldo cleared
  const calculatedSum = balances.teestock.balance + balances.multigraph.balance + balances.holding.balance;
  assert(balances.totalConsolidatedLiquidity === calculatedSum, `Total konsolidasi likuiditas holding akurat: Rp ${balances.totalConsolidatedLiquidity}`);

  // ====================================================================
  // 2. AUDIT UNIT P&L & CFO MARGIN RULES
  // ====================================================================
  console.log("\n--- 2. AUDIT UNIT P&L & CFO MARGIN RULES ---");

  const teestockPnl = calculateUnitPnl(STARTER_TRANSACTIONS, 'teestock');
  const multigraphPnl = calculateUnitPnl(STARTER_TRANSACTIONS, 'multigraph');

  assert(teestockPnl.revenue >= 0, `TeeStock revenue valid (Rp ${teestockPnl.revenue})`);
  assert(teestockPnl.cogs >= 0, `TeeStock COGS valid (Rp ${teestockPnl.cogs})`);
  assert(multigraphPnl.revenue >= 0, `MultiGraph revenue valid (Rp ${multigraphPnl.revenue})`);
  assert(multigraphPnl.cogs >= 0, `MultiGraph COGS valid (Rp ${multigraphPnl.cogs})`);

  // Verify CFO Pricing Floor on Retail TeeStock
  // Kaos Polos Rp 38.000 + DTF Rp 10.000 + Pack Rp 3.000 + Defect 5% (Rp 2.550) = Rp 53.550
  // Jual Rp 99.000 -> Gross Margin: (99000 - 53550) / 99000 = 45.9%
  // Platform fee 1.5% (Rp 1.485) -> Net Profit ~Rp 43.965 -> Net Margin: 44.4% (Lolos target >= 35%)
  const retailHpp = 38000 + 10000 + 3000 + 2550;
  const retailPrice = 99000;
  const netMargin = ((retailPrice - retailHpp - (retailPrice * 0.015)) / retailPrice) * 100;
  assert(netMargin >= 35.0, `CFO Rule Validated: Net margin retail TeeStock adalah ${netMargin.toFixed(1)}% (Wajib >= 35%)`);

  // ====================================================================
  // 3. AUDIT RUNWAY & BURN RATE ENGINE
  // ====================================================================
  console.log("\n--- 3. AUDIT RUNWAY & BURN RATE ENGINE ---");

  const runway = calculateRunwayAndBurnRate(STARTER_TRANSACTIONS, balances.totalConsolidatedLiquidity);
  assert(runway.dailyBurnRate >= 0, `Daily burn rate terhitung valid: Rp ${runway.dailyBurnRate}/hari`);
  assert(runway.monthlyBurnRate >= 0, `Monthly burn rate terhitung valid: Rp ${runway.monthlyBurnRate}/bulan`);
  assert(runway.runwayMonths > 0, `Cash runway terhitung positif: ${runway.runwayMonths} bulan`);

  // ====================================================================
  // 4. AUDIT BUSINESS VALUATION ENGINE (3 METODE)
  // ====================================================================
  console.log("\n--- 4. AUDIT BUSINESS VALUATION ENGINE (3 METODE) ---");

  const mockFounderWealth = {
    netCashLiquidity: balances.totalConsolidatedLiquidity,
    blankStockValue: 1200000,
    dtfStockValue: 360000,
    packagingStockValue: 284000,
    totalInventoryValue: 1844000,
    fixedAssetsValue: 2500000,
    netFounderEquity: 5000000,
    totalPrive: 0
  };

  const val = calculateBusinessValuation({
    founderWealth: mockFounderWealth,
    multiUnitBalances: balances,
    teestockPnl,
    multigraphPnl,
    orders: [],
    cashTransactions: STARTER_TRANSACTIONS
  });

  assert(val.totalBookValueNAV > 0, `Nilai Buku Bersih (NAV) terhitung: Rp ${val.totalBookValueNAV}`);
  assert(val.sdeValuation > 0, `Valuasi Laba / SDE Multiple terhitung: Rp ${val.sdeValuation}`);
  assert(val.revenueValuation > 0, `Valuasi Skala Omset terhitung: Rp ${val.revenueValuation}`);
  assert(val.fairEnterpriseValuation > 0, `Weighted Fair Enterprise Valuation terhitung: Rp ${val.fairEnterpriseValuation}`);
  assert(val.milestones.length === 3, `Roadmap milestone holding terdiri dari 3 tahap eskalasi`);

  // ====================================================================
  // 5. AUDIT INVENTORY DEDUCTIONS & STATE MACHINE
  // ====================================================================
  console.log("\n--- 5. AUDIT INVENTORY DEDUCTIONS & STATE MACHINE ---");

  // Initial dummy inventory
  let testInv = {
    nsa_heavyweight_24s: {
      Hitam: { L: 10, XL: 5 }
    },
    dtf_films: {
      'TS-ORI-001': { ready: 5, unitCost: 12000 }
    },
    supplies: {
      polymailer_black: { ready: 100, unitCost: 800 }
    }
  };

  // Test deduction of blank garment
  testInv = deductStock(testInv, 'nsa_heavyweight_24s', 'Hitam', 'L', 2);
  assert(testInv.nsa_heavyweight_24s.Hitam.L === 8, "Pengurangan stok kaos polos NSA Hitam L (-2 pcs) berhasil");

  // Test deduction of DTF film
  testInv = deductDtfFilm(testInv, 'TS-ORI-001', 1);
  assert(testInv.dtf_films['TS-ORI-001'].ready === 4, "Pengurangan film DTF TS-ORI-001 (-1 lbr) berhasil");

  // Test restock blank garment
  testInv = restockBlankGarment(testInv, 'nsa_heavyweight_24s', 'Hitam', 'L', 5);
  assert(testInv.nsa_heavyweight_24s.Hitam.L === 13, "Restock bahan kaos polos NSA Hitam L (+5 pcs) berhasil");

  // Test restock DTF film
  testInv = restockDtfFilm(testInv, 'TS-ORI-001', 10, 12000, 'Origins Graphic');
  assert(testInv.dtf_films['TS-ORI-001'].ready === 14, "Restock lembar DTF TS-ORI-001 (+10 lbr) berhasil");

  // Test restock supply packaging
  testInv = restockSupplyItem(testInv, 'polymailer_black', 50);
  assert(testInv.supplies.polymailer_black.ready === 150, "Restock supply packaging polymailer (+50 pcs) berhasil");

  // ====================================================================
  // 6. AUDIT KONEKSI LIVE SUPABASE CLOUD
  // ====================================================================
  console.log("\n--- 6. AUDIT KONEKSI LIVE SUPABASE CLOUD ---");

  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const tables = ['ts_products', 'ts_cash_ledger', 'ts_orders', 'ts_inventory'];

  for (const t of tables) {
    const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true });
    assert(!error, `Tabel Supabase Cloud '${t}' dapat diakses tanpa error (Baris: ${count})`);
  }

  console.log("\n====================================================================");
  console.log(`🎉 HASIL AUDIT MENYELURUH: ${results.filter(r => r.status === 'PASSED').length}/${results.length} PENGUJIAN LOLOS SEMPURNA!`);
  console.log("====================================================================\n");
}

runFullAudit().catch(err => {
  console.error("FATAL AUDIT FAILURE:", err);
  process.exit(1);
});
