import { describe, expect, it } from 'vitest';
import { demoDesignSchema, saveDemoDesignSchema } from './design';
const data = {
  code: 'DEMO-01',
  title: 'Studio hours',
  theme: 'CREATIVE',
  story: '',
  placement: 'FRONT',
};
describe('demo design contract', () => {
  it('allows labeled metadata only', () => {
    expect(demoDesignSchema.safeParse(data).success).toBe(true);
    expect(
      demoDesignSchema.safeParse({ ...data, code: 'LIVE-01' }).success,
    ).toBe(false);
    expect(
      demoDesignSchema.safeParse({ ...data, theme: 'UNKNOWN' }).success,
    ).toBe(false);
  });
  it('requires an expected revision for existing designs', () => {
    const requestId = '00000000-0000-4000-8000-000000000001';
    expect(
      saveDemoDesignSchema.safeParse({
        requestId,
        assetId: null,
        expected: 0,
        data,
      }).success,
    ).toBe(true);
    expect(
      saveDemoDesignSchema.safeParse({
        requestId,
        assetId: requestId,
        expected: 0,
        data,
      }).success,
    ).toBe(false);
  });
});
