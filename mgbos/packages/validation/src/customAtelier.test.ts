import { describe, expect, it } from 'vitest';
import { customAtelierRequirementSchema } from './customAtelier';
import { atelierMissingInformation } from '@mgbos/domain';
const fixture = {
  schemaCode: 'teestock.custom_atelier.v1',
  garment: {
    type: 'T-Shirt',
    fit: 'Regular',
    material: 'Cotton Combed 24s',
    color: 'Hitam',
    gsm: null,
    blankPreference: '',
  },
  sizes: { S: 1, M: 2, L: 3, XL: 3, XXL: 1 },
  decorations: [
    {
      location: 'Front',
      method: 'DTF',
      widthCm: 20,
      heightCm: 30,
      colors: null,
      artworkReference: 'design-v1',
      notes: '',
    },
  ],
  customization: 'Polybag satuan',
};
const parse = (specification: unknown, quantity = 10, unit = 'PCS') =>
  customAtelierRequirementSchema.safeParse({ specification, quantity, unit });
describe('Custom Atelier contract', () => {
  it('accepts complete structured apparel and reports no missing information', () => {
    const result = parse(fixture);
    expect(result.success).toBe(true);
    if (result.success)
      expect(atelierMissingInformation(result.data.specification)).toEqual([]);
  });
  it('retains unknown sizes and flags incomplete information', () => {
    const result = parse({ ...fixture, sizes: null, decorations: [] });
    expect(result.success).toBe(true);
    if (result.success)
      expect(atelierMissingInformation(result.data.specification)).toContain(
        'Rincian ukuran',
      );
  });
  it('rejects a mismatched size sum', () =>
    expect(parse(fixture, 11).success).toBe(false));
  it('rejects fractional and negative size quantities', () => {
    for (const S of [-1, 0.5])
      expect(
        parse({ ...fixture, sizes: { ...fixture.sizes, S } }).success,
      ).toBe(false);
  });
  it('rejects incomplete and unsupported sizes', () => {
    expect(parse({ ...fixture, sizes: { S: 10 } }).success).toBe(false);
    expect(
      parse({ ...fixture, sizes: { ...fixture.sizes, XXXL: 0 } }).success,
    ).toBe(false);
  });
  it('rejects zero, missing and overflowing total quantity and non PCS units', () => {
    for (const quantity of [0, -1, 1.5, 2147483648])
      expect(parse({ ...fixture, sizes: null }, quantity).success).toBe(false);
    expect(parse(fixture, 10, 'BOX').success).toBe(false);
  });
  it('rejects blank material and unknown schema versions', () => {
    expect(
      parse({ ...fixture, garment: { ...fixture.garment, material: '  ' } })
        .success,
    ).toBe(false);
    expect(
      parse({ ...fixture, schemaCode: 'teestock.custom_atelier.v2' }).success,
    ).toBe(false);
  });
  it('rejects duplicate positions and invalid dimensions', () => {
    expect(
      parse({
        ...fixture,
        decorations: [fixture.decorations[0], fixture.decorations[0]],
      }).success,
    ).toBe(false);
    expect(
      parse({
        ...fixture,
        decorations: [{ ...fixture.decorations[0], widthCm: -1 }],
      }).success,
    ).toBe(false);
  });
});
