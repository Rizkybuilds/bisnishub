import { beforeEach, describe, expect, it, vi } from 'vitest';

const sessionMock = vi.fn();
const invalidateMock = vi.fn();

vi.mock('@/lib/session.server', () => ({
  requireAuth: () => sessionMock(),
}));

vi.mock('@/lib/env.server', () => ({
  serverEnvironment: {
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-sec02',
  },
}));

vi.mock('@/lib/env.client', () => ({
  publicEnvironment: {
    NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => invalidateMock(...args),
}));

import {
  createOrderFromQuoteAction,
  createRetailOrderAction,
} from '../apps/mgbos/src/app/(app)/orders/actions';

const ORG_1_ID = '11111111-1111-4000-8000-000000000001';
const ORG_2_ID = '22222222-2222-4000-8000-000000000002';
const USER_ACTOR_ID = '33333333-3333-4000-8000-000000000003';
const BRAND_ID = '44444444-4444-4000-8000-000000000004';
const CUST_ID = '55555555-5555-4000-8000-000000000005';
const QUOTE_VER_ID = '66666666-6666-4000-8000-000000000006';
const INV_ITEM_ID = '77777777-7777-4000-8000-000000000007';

const ORDER_ORG1_ID = '88888888-8888-4000-8000-000000000001';
const ORDER_ORG1_NUM = 'TS-O-2026-000001';
const INVOICE_ORG1_ID = '88888888-8888-4000-8000-000000000002';
const INVOICE_ORG1_NUM = 'TS-INV-2026-000001';

const salesSessionOrg1 = {
  organization: { id: ORG_1_ID },
  user: { id: USER_ACTOR_ID },
  role: { code: 'SALES' },
  activeBrand: { id: BRAND_ID, code: 'TS', name: 'TeeStock' },
};

const salesSessionOrg2 = {
  organization: { id: ORG_2_ID },
  user: { id: USER_ACTOR_ID },
  role: { code: 'SALES' },
  activeBrand: { id: BRAND_ID, code: 'BETA', name: 'Beta Brand' },
};

const qcSessionOrg1 = {
  organization: { id: ORG_1_ID },
  user: { id: USER_ACTOR_ID },
  role: { code: 'QC' },
  activeBrand: { id: BRAND_ID, code: 'TS', name: 'TeeStock' },
};

const validB2bInput = {
  quoteVersionId: QUOTE_VER_ID,
  shippingAddress: {
    recipient_name: 'Budi Purchasing',
    phone: '081234567890',
    street: 'Jl. Industri Garmen No. 12',
    city: 'Bandung',
  },
  notes: 'B2B order test',
};

const validRetailInput = {
  customerAccountId: CUST_ID,
  brandId: BRAND_ID,
  items: [
    {
      inventoryItemId: INV_ITEM_ID,
      quantity: 5,
      unitPrice: '65000',
      discountTotal: '0',
      notes: 'Retail test item',
    },
  ],
  shippingAddress: {
    recipient_name: 'Pelanggan Ritel',
    phone: '081234567890',
    street: 'Jl. Merdeka No. 5',
    city: 'Bandung',
  },
  shippingCost: '15000',
  autoPay: false,
};

describe('C-SEC-02: B2B and Retail Order Replay Organization Isolation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue(salesSessionOrg1);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/brands?')) {
          return Promise.resolve(
            new Response(JSON.stringify([{ id: BRAND_ID }]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        if (url.includes('/rpc/create_order_from_quote')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                order_id: ORDER_ORG1_ID,
                order_number: ORDER_ORG1_NUM,
                is_retry: false,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }
        if (url.includes('/rpc/create_retail_order')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                order_id: ORDER_ORG1_ID,
                order_number: ORDER_ORG1_NUM,
                invoice_id: INVOICE_ORG1_ID,
                invoice_number: INVOICE_ORG1_NUM,
                payment_id: null,
                payment_number: null,
                grand_total: 340000,
                status: 'CONFIRMED',
                is_idempotent: false,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }
        return Promise.resolve(new Response('Not found', { status: 404 }));
      }),
    );
  });

  // ==========================================================================
  // AC-001 (ORG-01): Authorized B2B Creation
  // ==========================================================================
  describe('AC-001 / ORG-01: Authorized B2B Order Creation', () => {
    it('creates B2B order under requested authenticated organization with service_role', async () => {
      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe(ORDER_ORG1_ID);
      expect(result.orderNumber).toBe(ORDER_ORG1_NUM);
      expect(result.isRetry).toBe(false);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toContain('/rpc/create_order_from_quote');

      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer test-service-role-key-sec02');

      const body = JSON.parse(init.body as string);
      expect(body.p_organization_id).toBe(ORG_1_ID);
      expect(body.p_actor_id).toBe(USER_ACTOR_ID);
      expect(body.p_quote_version_id).toBe(QUOTE_VER_ID);
    });
  });

  // ==========================================================================
  // AC-002 (ORG-02): Denied B2B Role
  // ==========================================================================
  describe('AC-002 / ORG-02: Denied B2B Role Rejection', () => {
    it('denies order creation before RPC when role lacks orders:create permission', async () => {
      sessionMock.mockResolvedValue(qcSessionOrg1);

      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.error).toBeDefined();
      expect(result.orderId).toBeUndefined();
      expect(result.orderNumber).toBeUndefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('surfaces database authorization exception without leaking order data', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: 'Not authorized to create orders' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.error).toBe('Not authorized to create orders');
      expect(result.orderId).toBeUndefined();
      expect(result.orderNumber).toBeUndefined();
    });
  });

  // ==========================================================================
  // AC-003 (ORG-03): Same-Organization B2B Retry
  // ==========================================================================
  describe('AC-003 / ORG-03: Same Actor & Org B2B Replay', () => {
    it('returns original owned order with isRetry = true', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            order_id: ORDER_ORG1_ID,
            order_number: ORDER_ORG1_NUM,
            is_retry: true,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe(ORDER_ORG1_ID);
      expect(result.orderNumber).toBe(ORDER_ORG1_NUM);
      expect(result.isRetry).toBe(true);
    });
  });

  // ==========================================================================
  // AC-004 (ORG-04): Foreign-Organization B2B Replay Denial
  // ==========================================================================
  describe('AC-004 / ORG-04: Foreign-Organization B2B Replay Denial', () => {
    it('fails closed with generic non-disclosing error when replaying cross-org', async () => {
      sessionMock.mockResolvedValue(salesSessionOrg2); // Caller in Org 2

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: 'Unauthorized or request invalid' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.error).toBe('Unauthorized or request invalid');
      expect(result.orderId).toBeUndefined();
      expect(result.orderNumber).toBeUndefined();
      expect(result.isRetry).toBeUndefined();
    });
  });

  // ==========================================================================
  // AC-005 (ORG-05): Authorized Retail Order Creation
  // ==========================================================================
  describe('AC-005 / ORG-05: Authorized Retail Order Creation', () => {
    it('creates retail order and issues invoice in requested organization', async () => {
      const result = await createRetailOrderAction(validRetailInput);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe(ORDER_ORG1_ID);
      expect(result.orderNumber).toBe(ORDER_ORG1_NUM);
      expect(result.invoiceId).toBe(INVOICE_ORG1_ID);
      expect(result.invoiceNumber).toBe(INVOICE_ORG1_NUM);

      const calls = vi.mocked(fetch).mock.calls;
      const retailCall = calls.find(([url]) =>
        (url as string).includes('/rpc/create_retail_order'),
      );
      expect(retailCall).toBeDefined();

      const [, init] = retailCall as [string, RequestInit];
      const body = JSON.parse(init.body as string);
      expect(body.p_organization_id).toBe(ORG_1_ID);
      expect(body.p_actor_id).toBe(USER_ACTOR_ID);
    });
  });

  // ==========================================================================
  // AC-006 (ORG-06): Retail Denied Role & Foreign Object
  // ==========================================================================
  describe('AC-006 / ORG-06: Retail Denied Role Rejection', () => {
    it('denies execution when role lacks orders:create permission', async () => {
      sessionMock.mockResolvedValue(qcSessionOrg1);

      const result = await createRetailOrderAction(validRetailInput);

      expect(result.error).toBeDefined();
      expect(result.orderId).toBeUndefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('surfaces active customer account required when foreign customer used', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: 'Active customer account required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createRetailOrderAction(validRetailInput);

      expect(result.error).toBe('Active customer account required');
      expect(result.orderId).toBeUndefined();
    });
  });

  // ==========================================================================
  // AC-007 (ORG-07): Retail Same-Org Replay vs Foreign Replay Denial
  // ==========================================================================
  describe('AC-007 / ORG-07: Retail Replay Isolation', () => {
    it('returns original owned order on same-org retail retry', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            order_id: ORDER_ORG1_ID,
            order_number: ORDER_ORG1_NUM,
            invoice_id: INVOICE_ORG1_ID,
            invoice_number: INVOICE_ORG1_NUM,
            payment_id: null,
            payment_number: null,
            grand_total: 340000,
            status: 'CONFIRMED',
            is_idempotent: true,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createRetailOrderAction(validRetailInput);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe(ORDER_ORG1_ID);
      expect(result.invoiceId).toBe(INVOICE_ORG1_ID);
    });

    it('denies foreign-org retail replay with generic error without leaking metadata', async () => {
      sessionMock.mockResolvedValue(salesSessionOrg2); // Org 2

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: 'Unauthorized or request invalid' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createRetailOrderAction(validRetailInput);

      expect(result.error).toBe('Unauthorized or request invalid');
      expect(result.orderId).toBeUndefined();
      expect(result.invoiceId).toBeUndefined();
    });
  });

  // ==========================================================================
  // AC-008 (ORG-08): Direct RPC Role/Grant & Boundary Integrity
  // ==========================================================================
  describe('AC-008 / ORG-08: RPC Privilege Boundary Integrity', () => {
    it('strictly passes service_role Authorization header and bound organization ID', async () => {
      await createOrderFromQuoteAction(validB2bInput);

      const [, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer test-service-role-key-sec02');

      const body = JSON.parse(init.body as string);
      expect(body.p_organization_id).toBe(ORG_1_ID);
    });
  });

  // ==========================================================================
  // AC-009 (ORG-09): Concurrent / Network Error Handling
  // ==========================================================================
  describe('AC-009 / ORG-09: Concurrent and Network Failure Handling', () => {
    it('returns fail-closed retry guidance on unexpected network disconnect', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(
        new Error('Network connection timeout'),
      );

      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.error).toContain(
        'idempotent token akan mencegah pesanan ganda',
      );
      expect(result.orderId).toBeUndefined();
    });
  });

  // ==========================================================================
  // AC-010 (ORG-10): Tenant Nondisclosure Verification
  // ==========================================================================
  describe('AC-010 / ORG-10: Tenant Nondisclosure Guarantee', () => {
    it('never leaks foreign organization or order identity in error strings', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: 'Unauthorized or request invalid' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const result = await createOrderFromQuoteAction(validB2bInput);

      expect(result.error).toBe('Unauthorized or request invalid');
      expect(result.error).not.toContain(ORG_1_ID);
      expect(result.error).not.toContain(ORDER_ORG1_ID);
      expect(result.error).not.toContain(ORDER_ORG1_NUM);
      expect(result.error).not.toContain('unique constraint');
    });
  });
});
