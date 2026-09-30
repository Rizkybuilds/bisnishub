import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  invalidate: vi.fn(),
}));

vi.mock('../apps/mgbos/src/app/(app)/orders/data', () => ({
  orderContext: mocks.context,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.invalidate,
}));

import { transitionOrderStatusAction } from '../apps/mgbos/src/app/(app)/orders/actions';

const validOrderId = '00000000-0000-4000-8000-000000000001';
const validSession = {
  organization: { id: 'trusted-org-uuid' },
  user: { id: 'trusted-actor-uuid' },
  role: { code: 'OWNER' },
};

describe('Order Lifecycle Server Action (transitionOrderStatusAction, P0-02)', () => {
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
            order_id: validOrderId,
            order_number: 'TS-O-2026-000001',
            previous_status: 'CONFIRMED',
            new_status: 'ACTIVE',
            is_no_op: false,
          }),
          { status: 200 },
        ),
      ),
    );
  });

  it('rejects invalid payload before database access (AC-02)', async () => {
    const res = await transitionOrderStatusAction({
      orderId: 'not-a-uuid',
      targetStatus: 'ACTIVE',
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toBe('ID pesanan tidak valid');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects illegal status string before database access', async () => {
    const res = await transitionOrderStatusAction({
      orderId: validOrderId,
      targetStatus: 'FAKE_STATUS',
    });

    expect(res.success).toBeFalsy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('derives organization and actor from authenticated session (AC-06)', async () => {
    const res = await transitionOrderStatusAction({
      orderId: validOrderId,
      targetStatus: 'ACTIVE',
      reason: 'Kickoff production',
    });

    expect(res.success).toBe(true);
    expect(res.orderNumber).toBe('TS-O-2026-000001');
    expect(res.newStatus).toBe('ACTIVE');

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(url).toBe('http://127.0.0.1:55431/rest/v1/rpc/transition_order_status');
    const body = JSON.parse(String(options?.body));

    expect(body.p_organization_id).toBe('trusted-org-uuid');
    expect(body.p_actor_id).toBe('trusted-actor-uuid');
    expect(body.p_order_id).toBe(validOrderId);
    expect(body.p_target_status).toBe('ACTIVE');
    expect(body.p_reason).toBe('Kickoff production');
  });

  it('rejects unauthorized roles (SALES, QC, OPERATIONS, FINANCE) (AC-05)', async () => {
    for (const unauthorizedRole of ['SALES', 'QC', 'OPERATIONS', 'FINANCE']) {
      vi.clearAllMocks();
      mocks.context.mockResolvedValue({
        session: { ...validSession, role: { code: unauthorizedRole } },
        endpoint: 'http://127.0.0.1:55431/rest/v1',
        headers: {},
      });

      const res = await transitionOrderStatusAction({
        orderId: validOrderId,
        targetStatus: 'ACTIVE',
      });

      expect(res.success).toBeFalsy();
      expect(res.error).toContain('Akses ditolak');
      expect(fetch).not.toHaveBeenCalled();
    }
  });

  it('revalidates paths on successful status transition', async () => {
    const res = await transitionOrderStatusAction({
      orderId: validOrderId,
      targetStatus: 'ACTIVE',
    });

    expect(res.success).toBe(true);
    expect(mocks.invalidate).toHaveBeenCalledWith('/orders');
    expect(mocks.invalidate).toHaveBeenCalledWith(`/orders/${validOrderId}`);
  });

  it('propagates database completion guard failure to caller (AC-07)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message:
              'Cannot complete order: 2 active production job(s) remain unfinished',
          }),
          { status: 400 },
        ),
      ),
    );

    const res = await transitionOrderStatusAction({
      orderId: validOrderId,
      targetStatus: 'COMPLETED',
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toBe(
      'Cannot complete order: 2 active production job(s) remain unfinished',
    );
    expect(mocks.invalidate).not.toHaveBeenCalled();
  });
});
