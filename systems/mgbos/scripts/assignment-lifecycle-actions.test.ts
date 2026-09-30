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

import {
  acceptProductionAssignmentAction,
  declineProductionAssignmentAction,
  cancelProductionAssignmentAction,
  reassignProductionJobAction,
} from '../apps/mgbos/src/app/(app)/production/actions';

const validJobId = '00000000-0000-4000-8000-000000000001';
const validAssignmentId = '00000000-0000-4000-8000-000000000002';
const validVendorId = '00000000-0000-4000-8000-000000000003';
const validSession = {
  organization: { id: 'trusted-org-uuid' },
  user: { id: 'trusted-actor-uuid' },
  role: { code: 'OPERATIONS' },
};

describe('Production Assignment Lifecycle Actions (P0-04)', () => {
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
        new Response(
          JSON.stringify({
            assignment_id: validAssignmentId,
            status: 'ACCEPTED',
            already_accepted: false,
          }),
          { status: 200 },
        ),
      ),
    );
  });

  describe('acceptProductionAssignmentAction (AC-01..AC-04, AC-12)', () => {
    it('calls accept_production_assignment RPC with correct payload', async () => {
      const res = await acceptProductionAssignmentAction({
        assignmentId: validAssignmentId,
      });

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/rpc/accept_production_assignment');
      const body = JSON.parse(init.body as string);
      expect(body).toEqual({
        p_organization_id: 'trusted-org-uuid',
        p_actor_id: 'trusted-actor-uuid',
        p_assignment_id: validAssignmentId,
      });
      expect(mocks.invalidate).toHaveBeenCalledWith('/production');
    });

    it('rejects invalid assignment UUID format before RPC call', async () => {
      const res = await acceptProductionAssignmentAction({
        assignmentId: 'not-a-uuid',
      });

      expect(res.success).toBeFalsy();
      expect(res.error).toBe('ID penugasan tidak valid');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('rejects unauthorized actor without production:update permission (AC-10)', async () => {
      mocks.context.mockResolvedValue({
        session: {
          ...validSession,
          role: { code: 'FINANCE' },
        },
        endpoint: 'http://127.0.0.1:55431/rest/v1',
        headers: { apikey: 'test-key' },
      });

      const res = await acceptProductionAssignmentAction({
        assignmentId: validAssignmentId,
      });

      expect(res.success).toBeFalsy();
      expect(res.error).toContain('tidak memiliki izin');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('handles duplicate acceptance safely from RPC response (AC-12)', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              assignment_id: validAssignmentId,
              status: 'ACCEPTED',
              already_accepted: true,
            }),
            { status: 200 },
          ),
        ),
      );

      const res = await acceptProductionAssignmentAction({
        assignmentId: validAssignmentId,
      });

      expect(res.success).toBe(true);
    });
  });

  describe('declineProductionAssignmentAction (AC-05..AC-07)', () => {
    it('calls decline_production_assignment RPC with reason', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              assignment_id: validAssignmentId,
              status: 'DECLINED',
            }),
            { status: 200 },
          ),
        ),
      );

      const res = await declineProductionAssignmentAction({
        assignmentId: validAssignmentId,
        reason: 'Vendor kapasitas penuh',
      });

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/rpc/decline_production_assignment');
      const body = JSON.parse(init.body as string);
      expect(body).toEqual({
        p_organization_id: 'trusted-org-uuid',
        p_actor_id: 'trusted-actor-uuid',
        p_assignment_id: validAssignmentId,
        p_reason: 'Vendor kapasitas penuh',
      });
      expect(mocks.invalidate).toHaveBeenCalledWith('/production');
    });

    it('returns backend error if decline fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              message: 'Cannot decline assignment with status ACCEPTED',
            }),
            { status: 400 },
          ),
        ),
      );

      const res = await declineProductionAssignmentAction({
        assignmentId: validAssignmentId,
        reason: 'Vendor menolak',
      });

      expect(res.success).toBeFalsy();
      expect(res.error).toBe('Cannot decline assignment with status ACCEPTED');
    });
  });

  describe('cancelProductionAssignmentAction', () => {
    it('calls cancel_production_assignment RPC with reason', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              assignment_id: validAssignmentId,
              status: 'CANCELLED',
            }),
            { status: 200 },
          ),
        ),
      );

      const res = await cancelProductionAssignmentAction({
        assignmentId: validAssignmentId,
        reason: 'Order dibatalkan customer',
      });

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/rpc/cancel_production_assignment');
      const body = JSON.parse(init.body as string);
      expect(body.p_reason).toBe('Order dibatalkan customer');
    });
  });

  describe('reassignProductionJobAction (AC-08)', () => {
    it('calls reassign_production_job RPC with new assignment details and reason', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify('new-assignment-uuid-456'), { status: 200 }),
        ),
      );

      const res = await reassignProductionJobAction({
        jobId: validJobId,
        executorType: 'VENDOR',
        vendorId: validVendorId,
        assignedCost: 4500000n,
        reason: 'Alihkan ke vendor cadangan',
      });

      expect(res.success).toBe(true);
      expect(res.jobId).toBe(validJobId);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/rpc/reassign_production_job');
      const body = JSON.parse(init.body as string);
      expect(body).toEqual({
        p_organization_id: 'trusted-org-uuid',
        p_actor_id: 'trusted-actor-uuid',
        p_job_id: validJobId,
        p_executor_type: 'VENDOR',
        p_vendor_id: validVendorId,
        p_vendor_name: null,
        p_assigned_brand_id: null,
        p_assigned_cost: '4500000',
        p_notes: null,
        p_reason: 'Alihkan ke vendor cadangan',
      });
      expect(mocks.invalidate).toHaveBeenCalledWith('/production');
      expect(mocks.invalidate).toHaveBeenCalledWith(`/production/${validJobId}`);
    });
  });
});
