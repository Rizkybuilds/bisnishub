import { expect, it } from 'vitest';
import { atelierSpecificationFromForm } from '../apps/mgbos/src/app/(app)/requirements/atelierForm';
it('maps native fields into a valid snapshot and ignores unselected decoration rows', () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    garmentType: 'T-Shirt',
    garmentFit: 'Regular',
    material: 'Cotton Combed 24s',
    baseColor: 'Hitam',
    sizeS: '10',
    decoration0Enabled: 'on',
    decoration0Method: 'DTF',
    decoration0widthCm: '20.5',
    decoration0heightCm: '30',
    decoration1Method: 'INVALID',
  }))
    form.set(key, value);
  const spec = atelierSpecificationFromForm(form);
  expect(spec.decorations[0]?.widthCm).toBe(20.5);
  expect(spec.sizes).toEqual({ S: 10, M: 0, L: 0, XL: 0, XXL: 0 });
  expect(spec.decorations).toHaveLength(1);
});
it('keeps blank size fields unknown instead of replacing them with zero quantities', () => {
  expect(atelierSpecificationFromForm(new FormData()).sizes).toBeNull();
});
