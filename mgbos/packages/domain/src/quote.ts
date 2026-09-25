export const QUOTE_COST_TYPES = [
  'GARMENT',
  'PRINTING',
  'EMBROIDERY',
  'LABEL',
  'PACKAGING',
  'SHIPPING',
  'VENDOR',
  'LABOR',
  'OTHER',
  'BUFFER',
] as const;
export const QUOTE_MONEY_MAX = 9223372036854775807n;
export type PricingGuard =
  'TARGET' | 'CAUTION' | 'WARNING' | 'APPROVAL_REQUIRED';
export function quotePricing(
  quantity: number,
  unitPrice: bigint,
  discount: bigint,
  shipping: bigint,
  cost: bigint,
) {
  if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 2147483647)
    throw new Error('Jumlah tidak valid');
  for (const amount of [unitPrice, discount, shipping, cost])
    if (amount < 0n || amount > QUOTE_MONEY_MAX)
      throw new Error('Nominal tidak valid');
  const subtotal = BigInt(quantity) * unitPrice;
  const revenue = subtotal - discount;
  const grandTotal = revenue + shipping;
  if (
    revenue <= 0n ||
    cost <= 0n ||
    subtotal > QUOTE_MONEY_MAX ||
    grandTotal > QUOTE_MONEY_MAX
  )
    throw new Error('Pendapatan dan HPP harus positif dan dalam batas nominal');
  const profit = revenue - cost;
  // Compare exact fractions, never rounded percentages, when enforcing the floor.
  const guard: PricingGuard =
    profit * 100n < revenue * 20n
      ? 'APPROVAL_REQUIRED'
      : profit * 100n < revenue * 25n
        ? 'WARNING'
        : profit * 100n < revenue * 30n
          ? 'CAUTION'
          : 'TARGET';
  const marginBps = (profit * 10000n) / revenue;
  return { subtotal, revenue, grandTotal, cost, profit, marginBps, guard };
}
