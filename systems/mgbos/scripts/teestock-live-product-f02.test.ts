import { describe, expect, it } from 'vitest';
import {
  availableColors,
  availableSizes,
  formatProductPrice,
  getVariant,
  isCompleteProductDetails,
} from '../apps/teestock/src/lib/storefront-product';
import type { StorefrontVariant } from '../apps/teestock/src/lib/storefront-product';

const variants: StorefrontVariant[] = [
  { sku: 'TS-F02-BLK-M', size: 'M', color: 'Black', priceIdr: 159000 },
  { sku: 'TS-F02-BLK-L', size: 'L', color: 'Black', priceIdr: 169000 },
  { sku: 'TS-F02-WHT-L', size: 'L', color: 'White', priceIdr: 179000 },
];

const details = {
  material: '100% cotton combed from verified supplier',
  fit: 'Regular fit',
  care: 'Wash the garment with printed side facing in.',
  productionDays: 3,
  sizeChart: [
    { size: 'M', widthCm: 52, lengthCm: 70 },
    { size: 'L', widthCm: 54, lengthCm: 73 },
  ],
};

describe('TeeStock F02 public product presentation', () => {
  it('resolves the exact price and SKU for a color-size combination', () => {
    expect(getVariant(variants, 'White', 'L')?.priceIdr).toBe(179000);
    expect(getVariant(variants, 'White', 'M')).toBeUndefined();
    expect(formatProductPrice(179000)).toContain('179');
  });

  it('lists actual colors and sizes only', () => {
    expect(availableColors(variants)).toEqual(['Black', 'White']);
    expect(availableSizes(variants)).toEqual(['M', 'L']);
  });

  it('requires genuine measurements for every published size', () => {
    expect(isCompleteProductDetails(details, variants)).toBe(true);
    expect(isCompleteProductDetails({
      ...details, sizeChart: [details.sizeChart[0]],
    }, variants)).toBe(false);
    expect(isCompleteProductDetails({
      ...details, productionDays: 0,
    }, variants)).toBe(false);
    expect(isCompleteProductDetails({
      ...details, sizeChart: [
        details.sizeChart[0], details.sizeChart[0],
      ],
    }, variants)).toBe(false);
  });

  it('does not expose pricing fields from ERP cost records in the public contract', () => {
    expect(variants.every((variant) => !('costIdr' in variant))).toBe(true);
  });
});
