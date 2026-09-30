import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  invalidate: vi.fn(),
}));

vi.mock('../apps/mgbos/src/app/(app)/production/data', () => ({
  productionContext: mocks.context,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.invalidate,
}));

import { assignProductionJobAction } from '../apps/mgbos/src/app/(app)/production/actions';

const validJobId = '00000000-0000-4000-8000-000000000001';
const validVendorId = '00000000-0000-4000-8000-000000000002';
const validBrandId = '00000000-0000-4000-8000-000000000003';
const validSession = {
  organization: { id: 'trusted-org-uuid' },
  user: { id: 'trusted-actor-uuid' },
  role: { code: 'OPERATIONS' },
};

describe('Vendor-Backed Production Assignment Action (P0-03)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.context.mockResolvedValue({
      session: validSession,
      endpoint: 'http://127.0.0.1:55431/rest/v1',
      headers: { apikey: 'test-key' },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify('assignment-uuid-123'), { status: 200 }),
      ),
    );
  });

  it('rejects invalid payload before database access', async () => {
    const res = await assignProductionJobAction({
      jobId: 'invalid-uuid',
      executorType: 'VENDOR',
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toBe('ID job tidak valid');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects vendor assignment missing both vendorId and vendorName', async () => {
    const res = await assignProductionJobAction({
      jobId: validJobId,
      executorType: 'VENDOR',
      assignedCost: 500000n,
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toContain('Pelaksana wajib ditentukan');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('derives organization and actor from session and passes vendor_id to RPC (AC-01, AC-02)', async () => {
    const res = await assignProductionJobAction({
      jobId: validJobId,
      executorType: 'VENDOR',
      vendorId: validVendorId,
      vendorName: 'PT Mulia Blanks Garmen',
      assignedCost: 450000n,
      notes: 'Pengerjaan 50 pcs kaos',
    });

    expect(res.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(url).toBe('http://127.0.0.1:55431/rest/v1/rpc/assign_production_job');

    const body = JSON.parse(String(options?.body));
    expect(body.p_organization_id).toBe('trusted-org-uuid');
    expect(body.p_actor_id).toBe('trusted-actor-uuid');
    expect(body.p_job_id).toBe(validJobId);
    expect(body.p_executor_type).toBe('VENDOR');
    expect(body.p_vendor_id).toBe(validVendorId);
    expect(body.p_vendor_name).toBe('PT Mulia Blanks Garmen');
    expect(body.p_assigned_cost).toBe('450000');
    expect(body.p_notes).toBe('Pengerjaan 50 pcs kaos');
  });

  it('handles canonical internal holding brand assignment (AC-06)', async () => {
    const res = await assignProductionJobAction({
      jobId: validJobId,
      executorType: 'INTERNAL',
      assignedBrandId: validBrandId,
      assignedCost: 350000n,
    });

    expect(res.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);

    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0]?.[1]?.body));
    expect(body.p_executor_type).toBe('INTERNAL');
    expect(body.p_assigned_brand_id).toBe(validBrandId);
    expect(body.p_vendor_id).toBeNull();
  });

  it('rejects unauthorized roles (SALES, FINANCE, QC)', async () => {
    for (const unauthorizedRole of ['SALES', 'FINANCE', 'QC']) {
      vi.clearAllMocks();
      mocks.context.mockResolvedValue({
        session: { ...validSession, role: { code: unauthorizedRole } },
        endpoint: 'http://127.0.0.1:55431/rest/v1',
        headers: {},
      });

      const res = await assignProductionJobAction({
        jobId: validJobId,
        executorType: 'VENDOR',
        vendorId: validVendorId,
        assignedCost: 450000n,
      });

      expect(res.success).toBeFalsy();
      expect(res.error).toContain('Akses ditolak');
      expect(fetch).not.toHaveBeenCalled();
    }
  });

  it('propagates inactive vendor database error to caller (AC-03)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: 'Vendor CV Sablon Tutup is not ACTIVE (status: INACTIVE)',
          }),
          { status: 400 },
        ),
      ),
    );

    const res = await assignProductionJobAction({
      jobId: validJobId,
      executorType: 'VENDOR',
      vendorId: validVendorId,
      assignedCost: 450000n,
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toBe(
      'Vendor CV Sablon Tutup is not ACTIVE (status: INACTIVE)',
    );
  });
});
