/**
 * MultiGraph Business OS — Vendor Network Domain Service (MGBOS-013)
 * Pure domain contracts for external supplier directory and rate cards.
 */

export const VENDOR_CATEGORIES = [
  'GARMENT_SUPPLIER',
  'PRINT_STUDIO',
  'EMBROIDERY',
  'PACKAGING',
  'TRIMS_LABELS',
  'LOGISTICS',
  'OTHER',
] as const;

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

export const VENDOR_PAYMENT_TERMS = [
  'COD',
  'NET_7',
  'NET_14',
  'NET_30',
  'DP_50_50',
] as const;

export type VendorPaymentTerms = (typeof VENDOR_PAYMENT_TERMS)[number];

export const VENDOR_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;

export type VendorStatus = (typeof VENDOR_STATUSES)[number];

export const RATE_CARD_UNITS = [
  'meter',
  'pcs',
  'cm',
  'sheet',
  'roll',
  'lot',
] as const;

export type RateCardUnit = (typeof RATE_CARD_UNITS)[number];

export const VENDOR_MONEY_MAX = 9223372036854775807n;

export function validateRateCardCost(
  unitCost: bigint,
  minOrderQuantity: number,
) {
  if (unitCost < 0n || unitCost > VENDOR_MONEY_MAX) {
    throw new Error('Biaya satuan rate card tidak valid');
  }

  if (minOrderQuantity < 1) {
    throw new Error('Minimum order kuantitas harus minimal 1');
  }

  return { unitCost, minOrderQuantity };
}

export function calculateVendorEstimatedCost(
  unitCost: bigint,
  quantity: number,
): bigint {
  if (quantity < 0) {
    throw new Error('Kuantitas pengerjaan tidak boleh negatif');
  }

  return unitCost * BigInt(quantity);
}
