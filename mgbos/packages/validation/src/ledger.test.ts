import { describe, it, expect } from 'vitest';
import { recordActualJobCostSchema } from './ledger';

describe('MGBOS-016: Ledger Validation Schema', () => {
  it('successfully parses valid actual cost input with zero-float bigint coercion', () => {
    const parsed = recordActualJobCostSchema.parse({
      jobId: '11111111-2222-4333-8444-555555555555',
      actualCost: '4500000',
      notes: 'Vendor konveksi invoice settled',
    });

    expect(parsed.jobId).toBe('11111111-2222-4333-8444-555555555555');
    expect(parsed.actualCost).toBe(4_500_000n);
    expect(parsed.notes).toBe('Vendor konveksi invoice settled');
  });

  it('rejects invalid UUID for jobId', () => {
    const res = recordActualJobCostSchema.safeParse({
      jobId: 'invalid-job-id',
      actualCost: 1000,
    });
    expect(res.success).toBe(false);
  });

  it('handles number and bigint inputs seamlessly', () => {
    const parsedNum = recordActualJobCostSchema.parse({
      jobId: '11111111-2222-4333-8444-555555555555',
      actualCost: 250000,
    });
    expect(parsedNum.actualCost).toBe(250_000n);

    const parsedBig = recordActualJobCostSchema.parse({
      jobId: '11111111-2222-4333-8444-555555555555',
      actualCost: 500000n,
    });
    expect(parsedBig.actualCost).toBe(500_000n);
  });
});
