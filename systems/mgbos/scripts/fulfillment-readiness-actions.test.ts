import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  invalidate: vi.fn(),
}));

vi.mock('../apps/mgbos/src/app/(app)/shipments/data', () => ({
  shipmentContext: mocks.context,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.invalidate,
}));

import { createDeliveryOrderAction } from '../apps/mgbos/src/app/(app)/shipments/actions';

const validOrderId = '00000000-0000-4000-8000-000000000001';
const validOrderItemId = '00000000-0000-4000-8000-000000000002';
const validSession = {
  organization: { id: 'trusted-org-uuid' },
  user: { id: 'trusted-actor-uuid' },
  role: { code: 'OPERATIONS' },
};

describe('Fulfillment Readiness Guard Action (P0-05)', () => {
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
            shipment_id: 'shipment-uuid-123',
            shipment_number: 'TS-DO-2026-000001',
            status: 'READY_TO_DISPATCH',
          }),
          { status: 200 },
        ),
      ),
    );
  });

  it('allows delivery order creation when work is ready (AC-01)', async () => {
    const res = await createDeliveryOrderAction({
      orderId: validOrderId,
      courierName: 'JNT',
      courierService: 'CARGO',
      items: [
        {
          orderItemId: validOrderItemId,
          quantity: 25,
        },
      ],
      packageWeightGrams: 3000,
      packageCount: 1,
    });

    expect(res.success).toBe(true);
    expect(res.shipmentNumber).toBe('TS-DO-2026-000001');
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/rpc/create_delivery_order');
    const body = JSON.parse(init.body as string);
    expect(body.p_order_id).toBe(validOrderId);
    expect(body.p_items[0].quantity).toBe(25);
    expect(mocks.invalidate).toHaveBeenCalledWith('/shipments');
    expect(mocks.invalidate).toHaveBeenCalledWith(`/orders/${validOrderId}`);
  });

  it('surfaces clear blocker message when production is unfinished (AC-02, AC-09)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message:
              'Cannot create delivery order: Production job TS-J-001 (job-uuid) for item "Kaos Sablon" is currently IN_PRODUCTION (required: READY_FOR_HANDOFF or COMPLETED)',
          }),
          { status: 400 },
        ),
      ),
    );

    const res = await createDeliveryOrderAction({
      orderId: validOrderId,
      courierName: 'JNT',
      items: [{ orderItemId: validOrderItemId, quantity: 20 }],
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toContain('is currently IN_PRODUCTION');
  });

  it('surfaces clear blocker message when QC is unresolved / ON_HOLD (AC-03..AC-05, AC-09)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message:
              'Cannot create delivery order: Production job TS-J-002 for order TS-O-01 has unresolved QC inspection TS-QC-001 with result REJECTED',
          }),
          { status: 400 },
        ),
      ),
    );

    const res = await createDeliveryOrderAction({
      orderId: validOrderId,
      courierName: 'JNT',
      items: [{ orderItemId: validOrderItemId, quantity: 20 }],
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toContain('unresolved QC inspection');
    expect(res.error).toContain('REJECTED');
  });

  it('surfaces ceiling error when requested quantity exceeds unshipped quota (AC-06)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message:
              'Requested quantity (30) exceeds remaining unshipped quota (20) for item Kaos Sablon',
          }),
          { status: 400 },
        ),
      ),
    );

    const res = await createDeliveryOrderAction({
      orderId: validOrderId,
      courierName: 'JNT',
      items: [{ orderItemId: validOrderItemId, quantity: 30 }],
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toContain('exceeds remaining unshipped quota');
  });

  it('rejects unauthorized actor without shipments:create permission', async () => {
    mocks.context.mockResolvedValue({
      session: {
        ...validSession,
        role: { code: 'VIEWER' },
      },
      endpoint: 'http://127.0.0.1:55431/rest/v1',
      headers: { apikey: 'test-key' },
    });

    const res = await createDeliveryOrderAction({
      orderId: validOrderId,
      courierName: 'JNT',
      items: [{ orderItemId: validOrderItemId, quantity: 10 }],
    });

    expect(res.success).toBeFalsy();
    expect(res.error).toContain('tidak memiliki izin');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects invalid payload format before network fetch', async () => {
    const res = await createDeliveryOrderAction({
      orderId: 'not-a-uuid',
      courierName: '',
      items: [],
    });

    expect(res.success).toBeFalsy();
    expect(fetch).not.toHaveBeenCalled();
  });
});
