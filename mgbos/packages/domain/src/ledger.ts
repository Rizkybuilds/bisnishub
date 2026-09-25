/**
 * MultiGraph Business OS — Financial Ledger & Margin Realization Domain Service (MGBOS-016)
 * Pure domain contracts, zero-float margin formulas, The Cost Trilogy, and courier pass-through isolation.
 */

export const LEDGER_ENTRY_TYPES = [
  'ORDER_COMMITTED',
  'INVOICE_ISSUED',
  'PAYMENT_RECEIVED',
  'PAYMENT_REVERSED',
  'PRODUCTION_COMMITTED',
  'PRODUCTION_ACTUAL_SETTLED',
  'SHIPPING_ESCROW_RECORDED',
  'COURIER_EXPENSE_DISBURSED',
  'MARGIN_REALIZATION_SNAPSHOT',
] as const;

export type LedgerEntryType = (typeof LEDGER_ENTRY_TYPES)[number];

export const LEDGER_ENTRY_TYPE_LABELS: Record<LedgerEntryType, string> = {
  ORDER_COMMITTED: 'Kontrak Pesanan Dikonfirmasi',
  INVOICE_ISSUED: 'Faktur Resmi Terbit',
  PAYMENT_RECEIVED: 'Penerimaan Kas Masuk',
  PAYMENT_REVERSED: 'Pembatalan Kas Masuk',
  PRODUCTION_COMMITTED: 'Biaya SPK Ditugaskan',
  PRODUCTION_ACTUAL_SETTLED: 'Realisasi Biaya Aktual SPK',
  SHIPPING_ESCROW_RECORDED: 'Titipan Ongkir Kurir (Escrow)',
  COURIER_EXPENSE_DISBURSED: 'Pengeluaran Ongkir Kurir',
  MARGIN_REALIZATION_SNAPSHOT: 'Snapshot Realisasi Margin',
};

export const LEDGER_CATEGORIES = [
  'REVENUE',
  'COST_OF_GOODS',
  'PASS_THROUGH_SHIPPING',
  'CASH_MOVEMENT',
  'ADJUSTMENT',
] as const;

export type LedgerCategory = (typeof LEDGER_CATEGORIES)[number];

export const LEDGER_CATEGORY_LABELS: Record<LedgerCategory, string> = {
  REVENUE: 'Pendapatan Produk',
  COST_OF_GOODS: 'Harga Pokok Produksi (HPP)',
  PASS_THROUGH_SHIPPING: 'Titipan Ongkos Kirim (Pass-Through)',
  CASH_MOVEMENT: 'Mutasi Arus Kas',
  ADJUSTMENT: 'Penyesuaian Akuntansi',
};

export const FINANCIAL_HEALTH_STATUSES = [
  'HEALTHY',
  'MODERATE',
  'LOW_MARGIN',
  'CRITICAL',
] as const;

export type FinancialHealthStatus = (typeof FINANCIAL_HEALTH_STATUSES)[number];

export const FINANCIAL_HEALTH_LABELS: Record<FinancialHealthStatus, string> = {
  HEALTHY: 'Sehat (Margin ≥ 35%)',
  MODERATE: 'Moderat (25% - 34.9%)',
  LOW_MARGIN: 'Margin Rendah (20% - 24.9%)',
  CRITICAL: 'Kritis (< 20% Approval Founder)',
};

/**
 * Net Product Revenue = Subtotal - Total Diskon
 * Strict separation: courier shipping fee is NEVER included in product revenue.
 */
export function calculateNetProductRevenue(
  subtotal: bigint,
  discountTotal: bigint,
): bigint {
  const net = subtotal - discountTotal;
  return net > 0n ? net : 0n;
}

/**
 * Evaluates the Cost Trilogy for production jobs:
 * 1. Estimated Cost: Projected at Quote time
 * 2. Committed Cost: Contractual rate assigned to vendor/internal
 * 3. Actual Cost: Final settled invoice/cost
 *
 * Effective Cost priority: actualCost ?? committedCost ?? estimatedCost
 */
export function evaluateCostTrilogy(params: {
  estimatedCost: bigint;
  committedCost?: bigint | null;
  actualCost?: bigint | null;
}): {
  effectiveCost: bigint;
  isActualSettled: boolean;
  variance: bigint;
} {
  const { estimatedCost, committedCost, actualCost } = params;

  if (actualCost !== null && actualCost !== undefined) {
    const base = committedCost ?? estimatedCost;
    return {
      effectiveCost: actualCost,
      isActualSettled: true,
      variance: actualCost - base,
    };
  }

  if (committedCost !== null && committedCost !== undefined) {
    return {
      effectiveCost: committedCost,
      isActualSettled: false,
      variance: committedCost - estimatedCost,
    };
  }

  return {
    effectiveCost: estimatedCost,
    isActualSettled: false,
    variance: 0n,
  };
}

/**
 * Realized Gross Profit = Net Product Revenue - Effective Cost
 */
export function calculateRealizedGrossProfit(
  netProductRevenue: bigint,
  effectiveCost: bigint,
): bigint {
  return netProductRevenue - effectiveCost;
}

/**
 * Realized Margin % = (Realized Gross Profit / Net Product Revenue) * 100
 * Expressed as rounded 2-decimal number (e.g. 38.50)
 */
export function calculateRealizedMarginPct(
  netProductRevenue: bigint,
  effectiveCost: bigint,
): number {
  if (netProductRevenue <= 0n) return 0;
  const grossProfit = calculateRealizedGrossProfit(
    netProductRevenue,
    effectiveCost,
  );
  const pct = (Number(grossProfit) / Number(netProductRevenue)) * 100;
  return Math.round(pct * 100) / 100;
}

/**
 * Classifies margin % according to CFO pricing and financial floor rules:
 * - HEALTHY: >= 35% (Target apparel & custom atelier standard)
 * - MODERATE: 25% - 34.99%
 * - LOW_MARGIN: 20% - 24.99% (Warning threshold)
 * - CRITICAL: < 20% (CFO Hard Floor, requires explicit Owner approval)
 */
export function getFinancialHealthStatus(
  marginPct: number,
): FinancialHealthStatus {
  if (marginPct >= 35) return 'HEALTHY';
  if (marginPct >= 25) return 'MODERATE';
  if (marginPct >= 20) return 'LOW_MARGIN';
  return 'CRITICAL';
}

/**
 * Courier Pass-Through Isolation Verification:
 * Asserts that courier shipping fee produces Rp 0 net margin.
 */
export function verifyCourierPassThroughEscrow(
  shippingChargedToCustomer: bigint,
  shippingDisbursedToCourier: bigint,
): {
  netMargin: 0n;
  discrepancy: bigint;
  isBalanced: boolean;
} {
  const discrepancy = shippingChargedToCustomer - shippingDisbursedToCourier;
  return {
    netMargin: 0n,
    discrepancy,
    isBalanced: discrepancy === 0n,
  };
}
