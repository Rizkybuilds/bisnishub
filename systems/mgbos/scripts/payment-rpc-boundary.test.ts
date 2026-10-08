import { beforeEach, describe, expect, it, vi } from 'vitest';

const sessionMock = vi.fn();
const invalidateMock = vi.fn();

vi.mock('@/lib/session.server', () => ({
  requireAuth: () => sessionMock(),
}));

vi.mock('@/lib/env.server', () => ({
  serverEnvironment: {
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-sec01',
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
  recordPaymentAction,
  allocateExistingPaymentAction,
  revertPaymentAction,
} from '../apps/mgbos/src/app/(app)/payments/actions';
import { createRetailOrderAction } from '../apps/mgbos/src/app/(app)/orders/actions';

const VALID_UUID_ORG = '11111111-1111-4000-8000-000000000001';
const VALID_UUID_USER = '22222222-2222-4000-8000-000000000002';
const VALID_UUID_BRAND = '33333333-3333-4000-8000-000000000003';
const VALID_UUID_CUST = '44444444-4444-4000-8000-000000000004';
const VALID_UUID_INV = '55555555-5555-4000-8000-000000000005';
const VALID_UUID_PAY = '66666666-6666-4000-8000-000000000006';
const VALID_UUID_ITEM = '77777777-7777-4000-8000-000000000007';

const ownerSession = {
  organization: { id: VALID_UUID_ORG },
  user: { id: VALID_UUID_USER },
  role: { code: 'OWNER' },
  activeBrand: { id: VALID_UUID_BRAND, code: 'TS', name: 'TeeStock' },
};

const financeSession = {
  organization: { id: VALID_UUID_ORG },
  user: { id: VALID_UUID_USER },
  role: { code: 'FINANCE' },
  activeBrand: { id: VALID_UUID_BRAND, code: 'TS', name: 'TeeStock' },
};

const salesSession = {
  organization: { id: VALID_UUID_ORG },
  user: { id: VALID_UUID_USER },
  role: { code: 'SALES' },
  activeBrand: { id: VALID_UUID_BRAND, code: 'TS', name: 'TeeStock' },
};

describe('SEC-01: Payment RPC Boundary & Application Compatibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue(ownerSession);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/brands?')) {
          return Promise.resolve(
            new Response(JSON.stringify([{ id: VALID_UUID_BRAND }]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        if (url.includes('/rpc/record_payment_and_allocate')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                payment_id: VALID_UUID_PAY,
                payment_number: 'TS-PAY-2026-000001',
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }
        if (url.includes('/rpc/allocate_existing_payment')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                allocation_id: '88888888-8888-4000-8000-000000000008',
                status: 'ALLOCATED',
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }
        if (url.includes('/rpc/revert_payment')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                payment_id: VALID_UUID_PAY,
                status: 'REVERSED',
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }
        if (url.includes('/rpc/create_retail_order')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                order_id: '99999999-9999-4000-8000-000000000009',
                order_number: 'TS-RO-2026-000001',
                invoice_id: VALID_UUID_INV,
                payment_id: VALID_UUID_PAY,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Not found' }), { status: 404 }),
        );
      }),
    );
  });

  describe('recordPaymentAction', () => {
    const validInput = {
      brandId: VALID_UUID_BRAND,
      paymentMethod: 'BANK_TRANSFER',
      amount: 1500000,
      paymentDate: '2026-10-08',
      referenceNumber: 'REF-12345',
      destinationBank: 'BCA',
      destinationAccountNumber: '1234567890',
      payerName: 'PT Mitra Sukses',
      payerBank: 'Mandiri',
      payerAccountNumber: '0987654321',
      proofFileUrl: 'https://storage.local/proofs/p1.pdf',
      notes: 'Pembayaran DP invoice',
      allocations: [{ invoiceId: VALID_UUID_INV, amount: 1500000 }],
      customerAccountId: VALID_UUID_CUST,
    };

    it('denies execution when caller has SALES role (application authorization gate)', async () => {
      sessionMock.mockResolvedValue(salesSession);

      const result = await recordPaymentAction(validInput);

      expect(result.error).toBeDefined();
      expect(result.success).toBeUndefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('rejects invalid payload violating schema constraints', async () => {
      const invalidInput = { ...validInput, amount: -500 };

      const result = await recordPaymentAction(invalidInput);

      expect(result.error).toBeDefined();
      expect(result.success).toBeUndefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('executes successfully for FINANCE role using service_role authority and verified session actor', async () => {
      sessionMock.mockResolvedValue(financeSession);

      const result = await recordPaymentAction(validInput);

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe(VALID_UUID_PAY);

      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/record_payment_and_allocate',
      );

      // Verify service_role key is used
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer test-service-role-key-sec01');
      expect(headers.apikey).toBe('test-service-role-key-sec01');

      // Verify actor identity is anchored to authenticated session
      const body = JSON.parse(init.body as string);
      expect(body.p_organization_id).toBe(VALID_UUID_ORG);
      expect(body.p_actor_id).toBe(VALID_UUID_USER);
      expect(body.p_amount).toBe('1500000');
    });
  });

  describe('allocateExistingPaymentAction', () => {
    const validAllocInput = {
      paymentId: VALID_UUID_PAY,
      invoiceId: VALID_UUID_INV,
      amount: 500000,
      notes: 'Alokasi tambahan',
    };

    it('denies execution when caller has SALES role', async () => {
      sessionMock.mockResolvedValue(salesSession);

      const result = await allocateExistingPaymentAction(validAllocInput);

      expect(result.error).toBeDefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('executes successfully for OWNER role with service_role header', async () => {
      sessionMock.mockResolvedValue(ownerSession);

      const result = await allocateExistingPaymentAction(validAllocInput);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/allocate_existing_payment',
      );
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer test-service-role-key-sec01');

      const body = JSON.parse(init.body as string);
      expect(body.p_actor_id).toBe(VALID_UUID_USER);
      expect(body.p_payment_id).toBe(VALID_UUID_PAY);
    });
  });

  describe('revertPaymentAction', () => {
    const validRevertInput = {
      paymentId: VALID_UUID_PAY,
      reason: 'Pembatalan transaksi pembayaran salah catat',
    };

    it('denies execution when caller has SALES role', async () => {
      sessionMock.mockResolvedValue(salesSession);

      const result = await revertPaymentAction(validRevertInput);

      expect(result.error).toBeDefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('executes successfully for OWNER role with service_role header', async () => {
      sessionMock.mockResolvedValue(ownerSession);

      const result = await revertPaymentAction(validRevertInput);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe('http://127.0.0.1:55431/rest/v1/rpc/revert_payment');
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer test-service-role-key-sec01');

      const body = JSON.parse(init.body as string);
      expect(body.p_actor_id).toBe(VALID_UUID_USER);
      expect(body.p_reason).toBe('Pembatalan transaksi pembayaran salah catat');
    });
  });

  describe('createRetailOrderAction with autoPay', () => {
    const validRetailOrderInput = {
      customerAccountId: VALID_UUID_CUST,
      brandId: VALID_UUID_BRAND,
      items: [
        {
          inventoryItemId: VALID_UUID_ITEM,
          quantity: 2,
          unitPrice: '150000',
          discountTotal: '0',
        },
      ],
      shippingAddress: {
        recipient_name: 'Budi Pembeli',
        phone: '081234567890',
        street: 'Jl. Merdeka No. 1',
        city: 'Bandung',
      },
      shippingCost: '20000',
      autoPay: true,
      paymentMethod: 'CASH' as const,
    };

    it('executes retail order with autoPay via service_role to create order and payment', async () => {
      sessionMock.mockResolvedValue(ownerSession);

      const result = await createRetailOrderAction(validRetailOrderInput);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/create_retail_order',
      );
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer test-service-role-key-sec01');

      const body = JSON.parse(init.body as string);
      expect(body.p_auto_pay).toBe(true);
      expect(body.p_actor_id).toBe(VALID_UUID_USER);
    });
  });
});
