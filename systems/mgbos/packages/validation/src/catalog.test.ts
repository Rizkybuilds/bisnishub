import { describe, expect, it } from 'vitest';
import { catalogProductSchema } from './catalog';

const org = '11111111-1111-4111-8111-111111111111';
const brand = '22222222-2222-4222-8222-222222222222';
const product = {
  id: null,
  expectedVersion: 0,
  slug: 'f01-tee',
  title: 'TeeStock F01 Tee',
  collectionName: 'The Edit',
  description: 'A graphic tee.',
  mockupPath: null,
  artworkPath: null,
  rightsStatus: 'PENDING',
  sampleStatus: 'PENDING',
  status: 'DRAFT',
  variants: [
    {
      sku: 'TS-F01-BLK-L',
      size: 'L',
      color: 'Black',
      priceIdr: 159000,
      costIdr: 97000,
    },
  ],
} as const;

describe('TeeStock catalog product contract', () => {
  it('creates draft variants without publishing them', () => {
    expect(catalogProductSchema.safeParse(product).success).toBe(true);
    expect(
      catalogProductSchema.safeParse({ ...product, status: 'PUBLISHED' })
        .success,
    ).toBe(false);
  });

  it('allows publication only after rights, sampling and production assets', () => {
    const ready = {
      ...product,
      status: 'PUBLISHED',
      rightsStatus: 'APPROVED',
      sampleStatus: 'PASSED',
      mockupPath:
        org + '/' + brand + '/33333333-3333-4333-8333-333333333333.png',
      artworkPath:
        org + '/' + brand + '/44444444-4444-4444-8444-444444444444.pdf',
    };
    expect(catalogProductSchema.safeParse(ready).success).toBe(true);
    expect(
      catalogProductSchema.safeParse({
        ...ready,
        variants: [{ ...product.variants[0], costIdr: 0 }],
      }).success,
    ).toBe(false);
  });

  it('rejects duplicate SKUs, negative money, malformed slug and stale creation revisions', () => {
    const duplicate = [product.variants[0], product.variants[0]];
    expect(
      catalogProductSchema.safeParse({ ...product, variants: duplicate })
        .success,
    ).toBe(false);
    expect(
      catalogProductSchema.safeParse({
        ...product,
        variants: [{ ...product.variants[0], priceIdr: -100 }],
      }).success,
    ).toBe(false);
    expect(
      catalogProductSchema.safeParse({ ...product, slug: 'Bad Product' })
        .success,
    ).toBe(false);
    expect(
      catalogProductSchema.safeParse({ ...product, expectedVersion: 1 })
        .success,
    ).toBe(false);
  });

  it('rejects altered uploaded media path shapes', () => {
    expect(
      catalogProductSchema.safeParse({
        ...product,
        mockupPath: 'https://untrusted.example.com/mockup.svg',
      }).success,
    ).toBe(false);
  });
});
