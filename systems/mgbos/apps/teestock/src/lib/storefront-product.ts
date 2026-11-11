export type StorefrontSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface StorefrontVariant {
  sku: string;
  size: StorefrontSize;
  color: string;
  priceIdr: number;
}

export interface StorefrontDetails {
  material: string;
  fit: string;
  care: string;
  productionDays: number;
  sizeChart: Array<{ size: StorefrontSize; widthCm: number; lengthCm: number }>;
}

export interface StorefrontProduct {
  slug: string;
  title: string;
  collectionName: string;
  description: string;
  mockupUrl: string;
  variants: StorefrontVariant[];
  details: StorefrontDetails;
}

export const SIZE_ORDER: readonly StorefrontSize[] = [
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

export function formatProductPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getVariant(
  variants: readonly StorefrontVariant[],
  color: string,
  size: StorefrontSize,
): StorefrontVariant | undefined {
  return variants.find(
    (variant) => variant.color === color && variant.size === size,
  );
}

export function availableColors(
  variants: readonly StorefrontVariant[],
): string[] {
  return [...new Set(variants.map((variant) => variant.color))];
}

export function availableSizes(
  variants: readonly StorefrontVariant[],
): StorefrontSize[] {
  return SIZE_ORDER.filter((size) =>
    variants.some((variant) => variant.size === size),
  );
}

/** A variant is presented only after the corresponding measurements are verified. */
export function isCompleteProductDetails(
  value: unknown,
  variants: readonly StorefrontVariant[],
): value is StorefrontDetails {
  if (typeof value !== 'object' || value === null) return false;
  const d = value as Partial<StorefrontDetails>;
  if (
    typeof d.material !== 'string' ||
    d.material.trim().length < 3 ||
    typeof d.fit !== 'string' ||
    d.fit.trim().length < 3 ||
    typeof d.care !== 'string' ||
    d.care.trim().length < 10 ||
    !Number.isInteger(d.productionDays) ||
    (d.productionDays ?? 0) < 1 ||
    (d.productionDays ?? 0) > 45 ||
    !Array.isArray(d.sizeChart)
  )
    return false;
  const seen = new Set<string>();
  for (const row of d.sizeChart) {
    if (
      !row ||
      !SIZE_ORDER.includes(row.size) ||
      seen.has(row.size) ||
      !Number.isFinite(row.widthCm) ||
      row.widthCm < 20 ||
      row.widthCm > 150 ||
      !Number.isFinite(row.lengthCm) ||
      row.lengthCm < 20 ||
      row.lengthCm > 150
    ) {
      return false;
    }
    seen.add(row.size);
  }
  return variants.every((variant) => seen.has(variant.size));
}
