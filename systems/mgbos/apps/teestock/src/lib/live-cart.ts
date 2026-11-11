import type { StorefrontVariant } from './storefront-product';

export interface LiveCartLine {
  slug: string;
  sku: string;
  productTitle: string;
  color: string;
  size: StorefrontVariant['size'];
  priceIdr: number;
  quantity: number;
}

export const MAX_CART_LINES = 8;
export const MAX_PER_LINE = 10;
export const MAX_TOTAL_UNITS = 30;

export const cartLineKey = (line: Pick<LiveCartLine, 'slug' | 'sku'>) =>
  line.slug + ':' + line.sku;

export function isLiveCartLine(value: unknown): value is LiveCartLine {
  if (!value || typeof value !== 'object') return false;
  const x = value as Partial<LiveCartLine>;
  return (
    typeof x.slug === 'string' &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(x.slug) &&
    x.slug.length <= 80 &&
    typeof x.sku === 'string' &&
    /^[A-Z0-9-]{3,40}$/.test(x.sku) &&
    typeof x.productTitle === 'string' &&
    x.productTitle.length > 0 &&
    x.productTitle.length <= 120 &&
    typeof x.color === 'string' &&
    x.color.length > 1 &&
    x.color.length <= 50 &&
    (x.size === 'S' ||
      x.size === 'M' ||
      x.size === 'L' ||
      x.size === 'XL' ||
      x.size === 'XXL') &&
    Number.isSafeInteger(x.priceIdr) &&
    (x.priceIdr ?? 0) > 0 &&
    (x.priceIdr ?? 0) <= 9999999999 &&
    Number.isInteger(x.quantity) &&
    (x.quantity ?? 0) >= 1 &&
    (x.quantity ?? 0) <= MAX_PER_LINE
  );
}

export function normalizeCart(raw: unknown): LiveCartLine[] {
  if (!Array.isArray(raw)) return [];
  const result: LiveCartLine[] = [];
  const seen = new Set<string>();
  let units = 0;
  for (const item of raw) {
    if (!isLiveCartLine(item)) continue;
    const key = cartLineKey(item);
    if (
      seen.has(key) ||
      result.length >= MAX_CART_LINES ||
      units + item.quantity > MAX_TOTAL_UNITS
    )
      continue;
    const { slug, sku, productTitle, color, size, priceIdr, quantity } = item;
    result.push({ slug, sku, productTitle, color, size, priceIdr, quantity });
    seen.add(key);
    units += quantity;
  }
  return result;
}

export function cartTotal(lines: readonly LiveCartLine[]): number {
  return lines.reduce((sum, item) => sum + item.quantity * item.priceIdr, 0);
}

export function cartUnits(lines: readonly LiveCartLine[]): number {
  return lines.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(
  current: readonly LiveCartLine[],
  incoming: LiveCartLine,
): { lines: LiveCartLine[]; error?: string } {
  if (!isLiveCartLine(incoming))
    return { lines: [...current], error: 'Varian tidak valid.' };
  const original = normalizeCart([...current]);
  const key = cartLineKey(incoming);
  const existing = original.findIndex((line) => cartLineKey(line) === key);
  if (existing < 0 && original.length >= MAX_CART_LINES)
    return { lines: original, error: 'Maksimal delapan varian per pesanan.' };
  const requested =
    existing >= 0
      ? original[existing].quantity + incoming.quantity
      : incoming.quantity;
  if (
    requested > MAX_PER_LINE ||
    cartUnits(original) + incoming.quantity > MAX_TOTAL_UNITS
  )
    return {
      lines: original,
      error: 'Batas jumlah produk dalam keranjang terlampaui.',
    };
  if (existing < 0) return { lines: [...original, incoming] };
  return {
    lines: original.map((line, i) =>
      i === existing ? { ...incoming, quantity: requested } : line,
    ),
  };
}
