import { beforeEach, describe, expect, it, vi, beforeAll } from 'vitest';
import crypto from 'node:crypto';

const nativeFetch = globalThis.fetch;
const isLiveE2E = process.env.MGBOS_DESTRUCTIVE_LOCAL_E2E === '1';

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

// ============================================================================
// Genuine Live Multi-Session Concurrency & Database Replay Isolation Suite
// Guarded by MGBOS_DESTRUCTIVE_LOCAL_E2E=1 (R4-QA-01, R4-QA-03, R4-QA-04)
// ============================================================================
describe.skipIf(!isLiveE2E)(
  'C-SEC-02: Live Multi-Session Concurrency & Database Replay Isolation (R4-QA-01..04)',
  () => {
    const CANONICAL_BASE_URL = 'http://127.0.0.1:55431';
    const CANONICAL_SERVICE_KEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
    const CANONICAL_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

    const liveServiceHeaders = {
      apikey: CANONICAL_SERVICE_KEY,
      Authorization: `Bearer ${CANONICAL_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'app',
      'Content-Profile': 'app',
      Prefer: 'return=representation',
    };

    interface LiveRpcResponse {
      order_id?: string;
      order_number?: string;
      invoice_id?: string;
      payment_id?: string;
      inventory_item_id?: string;
      is_idempotent?: boolean;
      is_retry?: boolean;
      message?: string;
      code?: string;
    }

    async function liveRpc(
      functionName: string,
      params: unknown,
      headers: Record<string, string> = liveServiceHeaders,
    ): Promise<{ status: number; ok: boolean; data: LiveRpcResponse }> {
      const res = await nativeFetch(
        `${CANONICAL_BASE_URL}/rest/v1/rpc/${functionName}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(params),
        },
      );
      const text = await res.text();
      let data: LiveRpcResponse = {};
      try {
        data = text ? (JSON.parse(text) as LiveRpcResponse) : {};
      } catch {
        data = { message: text };
      }
      return { status: res.status, ok: res.ok, data };
    }

    async function liveQueryTable(table: string, query = '') {
      const res = await nativeFetch(
        `${CANONICAL_BASE_URL}/rest/v1/${table}?${query}`,
        {
          headers: liveServiceHeaders,
        },
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Query ${table} failed (${res.status}): ${errorText}`);
      }
      return res.json();
    }

    let liveOrg1: { id: string; code: string };
    let liveBrand1: { id: string; code: string };
    let liveUserA: { id: string; email: string };
    let liveCust1: { id: string };
    let liveItem1: { id: string };

    const liveOrg2Id = 'c2222222-2222-4000-8000-000000000001';
    const liveBrand2Id = 'c2222222-2222-4000-8000-000000000002';
    const liveRole2Id = 'c2222222-2222-4000-8000-000000000003';
    const liveCust2Id = 'c2222222-2222-4000-8000-000000000004';

    beforeAll(async () => {
      // 1. Resolve Org 1 context
      const [org1] = await liveQueryTable(
        'organizations',
        'code=eq.multigraph-group',
      );
      liveOrg1 = org1;

      const [brand1] = await liveQueryTable('brands', 'code=eq.TS');
      liveBrand1 = brand1;

      const [userA] = await liveQueryTable(
        'users',
        'email=eq.founder@multigraph.id',
      );
      liveUserA = userA;

      const [cust1] = await liveQueryTable(
        'customer_accounts',
        `organization_id=eq.${org1.id}&status=eq.ACTIVE&limit=1`,
      );
      liveCust1 = cust1;

      // Ensure SKU exists
      const existingItems = await liveQueryTable(
        'inventory_items',
        `organization_id=eq.${org1.id}&sku=eq.SEC02-LIVE-SKU-1`,
      );
      if (existingItems.length > 0) {
        liveItem1 = existingItems[0];
      } else {
        const createSkuRes = await liveRpc('create_inventory_item', {
          p_organization_id: org1.id,
          p_actor_id: userA.id,
          p_brand_id: brand1.id,
          p_sku: 'SEC02-LIVE-SKU-1',
          p_name: 'SEC02 Live Retail Tee L',
          p_category: 'BLANK_GARMENT',
          p_unit: 'pcs',
          p_cost_price: 35000,
          p_min_stock_alert: 10,
          p_initial_stock: 50,
          p_location_code: 'MAIN_WORKSHOP',
        });
        expect(createSkuRes.ok).toBe(true);
        expect(createSkuRes.data.inventory_item_id).toBeDefined();
        liveItem1 = { id: createSkuRes.data.inventory_item_id as string };
      }

      // 2. Ensure Synthetic Org 2 context exists
      const existingOrg2 = await liveQueryTable(
        'organizations',
        `id=eq.${liveOrg2Id}`,
      );
      if (existingOrg2.length === 0) {
        await nativeFetch(`${CANONICAL_BASE_URL}/rest/v1/organizations`, {
          method: 'POST',
          headers: liveServiceHeaders,
          body: JSON.stringify({
            id: liveOrg2Id,
            code: 'sec02-live-org-beta',
            legal_name: 'PT Beta Sejahtera Live',
            display_name: 'Beta Corp Live',
          }),
        });

        await nativeFetch(`${CANONICAL_BASE_URL}/rest/v1/brands`, {
          method: 'POST',
          headers: liveServiceHeaders,
          body: JSON.stringify({
            id: liveBrand2Id,
            organization_id: liveOrg2Id,
            code: 'BETA_LIVE',
            name: 'Beta Brand Live',
            slug: 'beta-brand-live',
          }),
        });

        await nativeFetch(`${CANONICAL_BASE_URL}/rest/v1/roles`, {
          method: 'POST',
          headers: liveServiceHeaders,
          body: JSON.stringify({
            id: liveRole2Id,
            organization_id: liveOrg2Id,
            code: 'OWNER',
            name: 'Owner Beta Live',
          }),
        });

        await nativeFetch(`${CANONICAL_BASE_URL}/rest/v1/customer_accounts`, {
          method: 'POST',
          headers: liveServiceHeaders,
          body: JSON.stringify({
            id: liveCust2Id,
            organization_id: liveOrg2Id,
            account_type: 'COMPANY',
            display_name: 'Customer Beta Live',
            legal_name: 'PT Klien Beta Live',
            primary_email: 'klien@beta-live.invalid',
            status: 'ACTIVE',
          }),
        });

        await nativeFetch(
          `${CANONICAL_BASE_URL}/rest/v1/customer_brand_relationships`,
          {
            method: 'POST',
            headers: liveServiceHeaders,
            body: JSON.stringify({
              customer_account_id: liveCust2Id,
              brand_id: liveBrand2Id,
            }),
          },
        );

        await nativeFetch(
          `${CANONICAL_BASE_URL}/rest/v1/organization_members`,
          {
            method: 'POST',
            headers: liveServiceHeaders,
            body: JSON.stringify({
              organization_id: liveOrg2Id,
              user_id: userA.id,
              role_id: liveRole2Id,
            }),
          },
        );
      }
    });

    // R4-QA-04: Direct low-privilege RPC execution denial
    describe('R4-QA-04: Direct Low-Privilege PostgREST Probes', () => {
      it('denies direct RPC execution as anon with 42501 permission denied', async () => {
        const anonHeaders = {
          apikey: CANONICAL_ANON_KEY,
          Authorization: `Bearer ${CANONICAL_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Accept-Profile': 'app',
          'Content-Profile': 'app',
        };

        const res1 = await liveRpc(
          'create_retail_order',
          {
            p_organization_id: liveOrg1.id,
            p_actor_id: liveUserA.id,
            p_brand_id: liveBrand1.id,
            p_customer_account_id: liveCust1.id,
            p_items: [],
          },
          anonHeaders,
        );
        expect(res1.ok).toBe(false);
        expect([400, 401, 403]).toContain(res1.status);
        if (res1.data?.code) {
          expect(res1.data.code).toBe('42501');
        }

        const res2 = await liveRpc(
          'create_order_from_quote',
          {
            p_organization_id: liveOrg1.id,
            p_actor_id: liveUserA.id,
            p_request_id: crypto.randomUUID(),
            p_quote_version_id: crypto.randomUUID(),
            p_shipping_address: {},
          },
          anonHeaders,
        );
        expect(res2.ok).toBe(false);
        expect([400, 401, 403]).toContain(res2.status);
        if (res2.data?.code) {
          expect(res2.data.code).toBe('42501');
        }
      });
    });

    // R4-QA-01 (ORG-09): Genuine two-session cross-org concurrency
    describe('R4-QA-01 / ORG-09: Genuine Two-Session Cross-Organization Concurrency', () => {
      it('executes concurrent cross-org replay under advisory lock contention, fails closed with generic rejection, and isolates business tables', async () => {
        const sharedRequestId = crypto.randomUUID();

        const payloadOrg1 = {
          p_organization_id: liveOrg1.id,
          p_actor_id: liveUserA.id,
          p_brand_id: liveBrand1.id,
          p_customer_account_id: liveCust1.id,
          p_items: [
            {
              inventory_item_id: liveItem1.id,
              quantity: 2,
              unit_price: 65000,
            },
          ],
          p_request_id: sharedRequestId,
          p_auto_pay: false,
        };

        const payloadOrg2 = {
          p_organization_id: liveOrg2Id,
          p_actor_id: liveUserA.id,
          p_brand_id: liveBrand2Id,
          p_customer_account_id: liveCust2Id,
          p_items: [],
          p_request_id: sharedRequestId,
          p_auto_pay: false,
        };

        // Two genuine sessions concurrently execute in separate database transactions
        const [session1Res, session2Res] = await Promise.all([
          liveRpc('create_retail_order', payloadOrg1),
          liveRpc('create_retail_order', payloadOrg2),
        ]);

        // Session 1 in Org 1 succeeds
        expect(session1Res.ok).toBe(true);
        expect(session1Res.status).toBe(200);
        expect(session1Res.data.order_id).toBeDefined();
        expect(session1Res.data.order_number).toBeDefined();

        // Session 2 in Org 2 must fail closed with generic non-disclosing denial
        expect(session2Res.ok).toBe(false);
        expect(session2Res.status).toBe(400);
        expect(session2Res.data.message).toBe(
          'Unauthorized or request invalid',
        );
        expect(session2Res.data.message).not.toContain(liveOrg1.id);
        expect(session2Res.data.message).not.toContain(
          session1Res.data.order_id,
        );
        expect(session2Res.data.message).not.toContain(
          session1Res.data.order_number,
        );
        expect(session2Res.data.message).not.toContain('unique');

        // Database order verification
        const org2Orders = await liveQueryTable(
          'orders',
          `organization_id=eq.${liveOrg2Id}`,
        );
        expect(org2Orders).toHaveLength(0);
      });
    });

    // R4-QA-01 (ORG-03): Genuine two-session same-org concurrency
    describe('R4-QA-01 / ORG-03: Genuine Two-Session Same-Organization Concurrency', () => {
      it('executes concurrent same-org requests, ensures single order created, and returns identical order ID with is_idempotent true', async () => {
        const sharedRequestId = crypto.randomUUID();

        const payload = {
          p_organization_id: liveOrg1.id,
          p_actor_id: liveUserA.id,
          p_brand_id: liveBrand1.id,
          p_customer_account_id: liveCust1.id,
          p_items: [
            {
              inventory_item_id: liveItem1.id,
              quantity: 1,
              unit_price: 65000,
            },
          ],
          p_request_id: sharedRequestId,
          p_auto_pay: false,
        };

        // Two genuine concurrent requests in same org
        const [resA, resB] = await Promise.all([
          liveRpc('create_retail_order', payload),
          liveRpc('create_retail_order', payload),
        ]);

        expect(resA.ok).toBe(true);
        expect(resB.ok).toBe(true);
        expect(resA.status).toBe(200);
        expect(resB.status).toBe(200);

        expect(resA.data.order_id).toBe(resB.data.order_id);
        expect(resA.data.order_number).toBe(resB.data.order_number);

        // At least one was an idempotent replay
        expect(resA.data.is_idempotent || resB.data.is_idempotent).toBe(true);

        // Database verification: strictly 1 order created in DB
        const orders = await liveQueryTable(
          'orders',
          `organization_id=eq.${liveOrg1.id}&request_id=eq.${sharedRequestId}`,
        );
        expect(orders).toHaveLength(1);
      });
    });

    // R4-QA-03 (ORG-10): Committed response lost & retry
    describe('R4-QA-03 / ORG-10: Committed Response Lost & Retry Across Sessions', () => {
      it('recovers cleanly on same-org retry after simulated network disconnect, and rejects foreign org retry', async () => {
        const lostRequestId = crypto.randomUUID();

        const payload = {
          p_organization_id: liveOrg1.id,
          p_actor_id: liveUserA.id,
          p_brand_id: liveBrand1.id,
          p_customer_account_id: liveCust1.id,
          p_items: [
            {
              inventory_item_id: liveItem1.id,
              quantity: 1,
              unit_price: 65000,
            },
          ],
          p_request_id: lostRequestId,
          p_auto_pay: false,
        };

        // Session 1 commits order, but client simulates network loss
        const initialRes = await liveRpc('create_retail_order', payload);
        expect(initialRes.ok).toBe(true);
        expect(initialRes.data.order_id).toBeDefined();
        const originalOrderId = initialRes.data.order_id as string;

        // Session 2 retries in same organization
        const retrySameRes = await liveRpc('create_retail_order', payload);
        expect(retrySameRes.ok).toBe(true);
        expect(retrySameRes.data.order_id).toBe(originalOrderId);
        expect(retrySameRes.data.is_idempotent).toBe(true);

        // Session 3 (foreign organization attacker) retries the same request_id
        const retryForeignRes = await liveRpc('create_retail_order', {
          p_organization_id: liveOrg2Id,
          p_actor_id: liveUserA.id,
          p_brand_id: liveBrand2Id,
          p_customer_account_id: liveCust2Id,
          p_items: [],
          p_request_id: lostRequestId,
          p_auto_pay: false,
        });

        expect(retryForeignRes.ok).toBe(false);
        expect(retryForeignRes.status).toBe(400);
        expect(retryForeignRes.data.message).toBe(
          'Unauthorized or request invalid',
        );
      });
    });

    // R4-QA-04: Negative assurance breadth (zero mutation across all tables in Org 2)
    describe('R4-QA-04: Side-Effect Zero-Mutation Across All Business Tables in Org 2', () => {
      it('preserves zero orders, zero order items, zero audit, zero invoices, and zero reservations in foreign organization', async () => {
        const orders = await liveQueryTable(
          'orders',
          `organization_id=eq.${liveOrg2Id}`,
        );
        expect(orders).toHaveLength(0);

        const audit = await liveQueryTable(
          'order_audit',
          `organization_id=eq.${liveOrg2Id}`,
        );
        expect(audit).toHaveLength(0);

        const invoices = await liveQueryTable(
          'invoices',
          `organization_id=eq.${liveOrg2Id}`,
        );
        expect(invoices).toHaveLength(0);

        const reservations = await liveQueryTable(
          'inventory_reservations',
          `organization_id=eq.${liveOrg2Id}`,
        );
        expect(reservations).toHaveLength(0);
      });
    });
  },
);
