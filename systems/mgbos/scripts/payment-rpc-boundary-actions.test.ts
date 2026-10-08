import { describe, it, expect, vi, beforeAll } from 'vitest';
import crypto from 'node:crypto';

const isLiveE2E = process.env.MGBOS_DESTRUCTIVE_LOCAL_E2E === '1';

const hoisted = vi.hoisted(() => {
  return {
    BASE_URL: 'http://127.0.0.1:55431',
    PUBLISHABLE_KEY: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
    SERVICE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
    activeToken: '',
    cookieStore: {
      get: (name: string) => {
        if (name === 'mgbos_session') {
          return hoisted.activeToken
            ? { value: hoisted.activeToken }
            : undefined;
        }
        if (name === 'mgbos_active_brand') {
          return { value: 'TS' };
        }
        return undefined;
      },
    },
  };
});

vi.mock('../apps/mgbos/node_modules/next/headers.js', () => ({
  cookies: async () => hoisted.cookieStore,
  default: {
    cookies: async () => hoisted.cookieStore,
  },
}));

vi.mock('@/lib/env.server', () => ({
  serverEnvironment: {
    SUPABASE_SERVICE_ROLE_KEY: hoisted.SERVICE_KEY,
  },
}));

vi.mock('@/lib/env.client', () => ({
  publicEnvironment: {
    NEXT_PUBLIC_SUPABASE_URL: hoisted.BASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: hoisted.PUBLISHABLE_KEY,
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: () => {},
  default: {
    revalidatePath: () => {},
  },
}));

import {
  recordPaymentAction,
  allocateExistingPaymentAction,
  revertPaymentAction,
} from '../apps/mgbos/src/app/(app)/payments/actions';
import { createRetailOrderAction } from '../apps/mgbos/src/app/(app)/orders/actions';

const serviceHeaders = {
  apikey: hoisted.SERVICE_KEY,
  Authorization: `Bearer ${hoisted.SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Accept-Profile': 'app',
  'Content-Profile': 'app',
  Prefer: 'return=representation',
};

async function rpcService(functionName: string, params: unknown) {
  const res = await fetch(`${hoisted.BASE_URL}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Service RPC ${functionName} failed (${res.status}): ${errorText}`,
    );
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function queryTable(table: string, query = '') {
  const res = await fetch(`${hoisted.BASE_URL}/rest/v1/${table}?${query}`, {
    headers: serviceHeaders,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Query ${table} failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

describe.skipIf(!isLiveE2E)(
  'SEC-01: Genuine Next.js Server Action Application Integration Suite (SEC01-QA-001B)',
  () => {
    let ownerToken = '';
    let salesToken = '';
    let org: { id: string; code: string };
    let brand: { id: string; code: string };
    let founder: { id: string; email: string };
    let customer: { id: string };
    let orderId: string;
    let inv1Id: string;
    let inv2Id: string;
    let paymentId: string;
    let inventoryItemId: string;

    const runSuffix = Date.now().toString().slice(-6);

    beforeAll(async () => {
      // 1. Resolve master context
      const [orgRow] = await queryTable(
        'organizations',
        'code=eq.multigraph-group',
      );
      org = orgRow;
      const [brandRow] = await queryTable('brands', 'code=eq.TS');
      brand = brandRow;
      const [founderRow] = await queryTable(
        'users',
        'email=eq.founder@multigraph.id',
      );
      founder = founderRow;
      const [customerRow] = await queryTable(
        'customer_accounts',
        'status=eq.ACTIVE&limit=1',
      );
      customer = customerRow;

      // 2. Authenticate as OWNER
      const ownerAuthRes = await fetch(
        `${hoisted.BASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            apikey: hoisted.PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'founder@multigraph.id',
            password: 'mgbos-founder-2026',
          }),
        },
      );
      expect(ownerAuthRes.status).toBe(200);
      const ownerAuthData = await ownerAuthRes.json();
      ownerToken = ownerAuthData.access_token;
      expect(ownerToken).toBeDefined();

      // 3. Ensure test SALES user exists & authenticate
      const salesEmail = `sales-test-${runSuffix}@multigraph.id`;
      const salesAdminRes = await fetch(
        `${hoisted.BASE_URL}/auth/v1/admin/users`,
        {
          method: 'POST',
          headers: {
            apikey: hoisted.SERVICE_KEY,
            Authorization: `Bearer ${hoisted.SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: salesEmail,
            password: 'mgbos-sales-2026',
            email_confirm: true,
            user_metadata: { name: 'Test Sales Operator' },
          }),
        },
      );
      expect(salesAdminRes.status).toBe(200);
      const salesAuthUser = await salesAdminRes.json();

      // Provision in app.users and app.organization_members
      const appUserInsertRes = await fetch(
        `${hoisted.BASE_URL}/rest/v1/users`,
        {
          method: 'POST',
          headers: serviceHeaders,
          body: JSON.stringify({
            auth_user_id: salesAuthUser.id,
            name: 'Test Sales Operator',
            email: salesEmail,
            status: 'ACTIVE',
          }),
        },
      );
      const [appSalesUser] = await appUserInsertRes.json();

      const [salesRole] = await queryTable(
        'roles',
        `organization_id=eq.${org.id}&code=eq.SALES`,
      );

      await fetch(`${hoisted.BASE_URL}/rest/v1/organization_members`, {
        method: 'POST',
        headers: serviceHeaders,
        body: JSON.stringify({
          organization_id: org.id,
          user_id: appSalesUser.id,
          role_id: salesRole.id,
          status: 'ACTIVE',
        }),
      });

      // Login as SALES user
      const salesAuthRes = await fetch(
        `${hoisted.BASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            apikey: hoisted.PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: salesEmail,
            password: 'mgbos-sales-2026',
          }),
        },
      );
      expect(salesAuthRes.status).toBe(200);
      const salesAuthData = await salesAuthRes.json();
      salesToken = salesAuthData.access_token;
      expect(salesToken).toBeDefined();

      // 4. Setup commercial order and 2 invoices for payment flows
      const reqRes = await rpcService(
        'create_requirement_with_initial_version',
        {
          p_organization_id: org.id,
          p_brand_id: brand.id,
          p_title: `SEC-01 Action Test Order ${runSuffix}`,
          p_summary: '50 pcs Custom Tees for Server Action Testing',
          p_customer_account_id: customer.id,
          p_quantity: 50,
          p_actor_id: founder.id,
        },
      );

      await rpcService('transition_requirement_status', {
        p_organization_id: org.id,
        p_requirement_id: reqRes.requirement_id,
        p_target_status: 'READY',
        p_actor_id: founder.id,
      });

      const quoteRes = await rpcService('save_quote_version', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_request_id: crypto.randomUUID(),
        p_requirement_version_id: reqRes.version_id,
        p_customer_id: customer.id,
        p_unit_price: 100000,
        p_discount: 0,
        p_shipping: 0,
        p_costs: [
          {
            cost_type: 'GARMENT',
            description: 'Cotton Combed 24s Blanks',
            quantity: 50,
            unit_cost: 35000,
          },
        ],
        p_valid_until: new Date(Date.now() + 14 * 86400000)
          .toISOString()
          .split('T')[0],
        p_terms: 'DP 30%, Pelunasan sebelum kirim',
        p_lead_time: '7 working days',
        p_notes: 'SEC-01 action quote',
      });

      await rpcService('mark_quote_sent', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_version_id: quoteRes.version_id,
      });

      await rpcService('mark_quote_accepted', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_version_id: quoteRes.version_id,
        p_acceptance_method: 'WHATSAPP',
        p_notes: 'Approved for action testing',
      });

      const orderRes = await rpcService('create_order_from_quote', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_request_id: crypto.randomUUID(),
        p_quote_version_id: quoteRes.version_id,
        p_shipping_address: {
          recipient_name: 'PT ABC Procurement',
          phone: '081234567890',
          street: 'Jl. Riau No. 10',
          city: 'Bandung',
        },
      });
      orderId = orderRes.order_id;

      await rpcService('transition_order_status', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_order_id: orderId,
        p_target_status: 'ACTIVE',
        p_reason: 'Down payment commitment verified',
      });

      const inv1Res = await rpcService('create_invoice_for_order', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_order_id: orderId,
        p_invoice_type: 'DOWN_PAYMENT',
        p_amount_subtotal: 1500000,
        p_amount_shipping: 0,
        p_notes: 'Termin DP 30%',
      });
      inv1Id = inv1Res.invoice_id;
      await rpcService('issue_invoice', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_invoice_id: inv1Id,
      });

      const inv2Res = await rpcService('create_invoice_for_order', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_order_id: orderId,
        p_invoice_type: 'FINAL_PAYMENT',
        p_amount_subtotal: 1000000,
        p_amount_shipping: 0,
        p_notes: 'Termin Pelunasan Parsial',
      });
      inv2Id = inv2Res.invoice_id;
      await rpcService('issue_invoice', {
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_invoice_id: inv2Id,
      });

      // 5. Ensure inventory item exists for retail test
      let [existingInvItem] = await queryTable(
        'inventory_items',
        `sku=eq.TS-NSA-7200-BLK-L`,
      );
      if (!existingInvItem) {
        const invRes = await rpcService('create_inventory_item', {
          p_organization_id: org.id,
          p_actor_id: founder.id,
          p_brand_id: brand.id,
          p_sku: 'TS-NSA-7200-BLK-L',
          p_name: 'Kaos Polos NSA 7200 Black L',
          p_category: 'BLANK_GARMENT',
          p_unit: 'pcs',
          p_cost_price: 38000,
          p_initial_stock: 50,
          p_min_stock_alert: 10,
          p_location_code: 'MAIN_WORKSHOP',
          p_bin_location: 'RACK-A1',
        });
        existingInvItem = { id: invRes.inventory_item_id };
      }
      inventoryItemId = existingInvItem.id;
    });

    // -------------------------------------------------------------------------
    // Negative Path: Application Authorization Gates
    // -------------------------------------------------------------------------
    it('denies payment recording and reversal when caller has SALES role (application authorization gate)', async () => {
      // Set active cookie to SALES user's genuine JWT
      hoisted.activeToken = salesToken;

      const recordRes = await recordPaymentAction({
        brandId: brand.id,
        customerAccountId: customer.id,
        paymentMethod: 'BANK_TRANSFER',
        amount: '1500000',
        paymentDate: '2026-10-08',
        allocations: [{ invoiceId: inv1Id, amount: '1500000' }],
      });
      expect(recordRes.success).toBeUndefined();
      expect(recordRes.error).toContain(
        "tidak memiliki izin 'payments:record'",
      );

      const revertRes = await revertPaymentAction({
        paymentId: crypto.randomUUID(),
        reason: 'Sales attempt to revert payment',
      });
      expect(revertRes.success).toBeUndefined();
      expect(revertRes.error).toContain(
        "tidak memiliki izin 'payments:revert'",
      );
    });

    // -------------------------------------------------------------------------
    // Positive Flow A: recordPaymentAction with Genuine Session
    // -------------------------------------------------------------------------
    it('executes recordPaymentAction under genuine OWNER session and updates database state', async () => {
      // Set active cookie to OWNER's genuine JWT
      hoisted.activeToken = ownerToken;

      const result = await recordPaymentAction({
        brandId: brand.id,
        customerAccountId: customer.id,
        paymentMethod: 'BANK_TRANSFER',
        amount: '2500000',
        paymentDate: new Date().toISOString().slice(0, 10),
        referenceNumber: `ACT-TRF-${runSuffix}`,
        destinationBank: 'BCA',
        destinationAccountNumber: '7770123899',
        payerName: 'PT ABC Kreatif Nusantara',
        notes: 'Transfer verified via recordPaymentAction',
        allocations: [
          {
            invoiceId: inv1Id,
            amount: '1500000',
            notes: 'Alokasi penuh DP via recordPaymentAction',
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBeDefined();
      expect(result.paymentNumber).toMatch(/^TS-PAY-\d{4}-\d{6}$/);
      paymentId = result.paymentId!;

      // Verify DB postconditions
      const [dbPay] = await queryTable('payments', `id=eq.${paymentId}`);
      expect(dbPay.status).toBe('CONFIRMED');
      expect(Number(dbPay.amount)).toBe(2500000);
      expect(Number(dbPay.allocated_amount)).toBe(1500000);

      const [dbInv1] = await queryTable('invoices', `id=eq.${inv1Id}`);
      expect(dbInv1.status).toBe('PAID');
      expect(Number(dbInv1.amount_paid)).toBe(1500000);
      expect(Number(dbInv1.balance_due)).toBe(0);

      const allocs = await queryTable(
        'payment_allocations',
        `payment_id=eq.${paymentId}`,
      );
      expect(allocs.length).toBe(1);
      expect(allocs[0].invoice_id).toBe(inv1Id);

      const [payAudit] = await queryTable(
        'payment_audit',
        `payment_id=eq.${paymentId}&action=eq.payment.recorded`,
      );
      expect(payAudit).toBeDefined();

      const ledgerEntries = await queryTable(
        'financial_ledger_entries',
        `reference_id=eq.${paymentId}`,
      );
      expect(ledgerEntries.length).toBeGreaterThan(0);
    });

    // -------------------------------------------------------------------------
    // Positive Flow B: allocateExistingPaymentAction with Genuine Session
    // -------------------------------------------------------------------------
    it('executes allocateExistingPaymentAction under genuine OWNER session and updates database state', async () => {
      hoisted.activeToken = ownerToken;

      const result = await allocateExistingPaymentAction({
        paymentId: paymentId,
        invoiceId: inv2Id,
        amount: '1000000',
        notes: 'Alokasi pelunasan via allocateExistingPaymentAction',
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe(paymentId);

      // Verify DB postconditions
      const [dbPay] = await queryTable('payments', `id=eq.${paymentId}`);
      expect(Number(dbPay.allocated_amount)).toBe(2500000);

      const [dbInv2] = await queryTable('invoices', `id=eq.${inv2Id}`);
      expect(dbInv2.status).toBe('PAID');
      expect(Number(dbInv2.amount_paid)).toBe(1000000);
      expect(Number(dbInv2.balance_due)).toBe(0);

      const allocs = await queryTable(
        'payment_allocations',
        `payment_id=eq.${paymentId}`,
      );
      expect(allocs.length).toBe(2);

      const [payAudit] = await queryTable(
        'payment_audit',
        `payment_id=eq.${paymentId}&action=eq.payment.allocated`,
      );
      expect(payAudit).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // Positive Flow C: revertPaymentAction with Genuine Session
    // -------------------------------------------------------------------------
    it('executes revertPaymentAction under genuine OWNER session and rolls back invoices in database', async () => {
      hoisted.activeToken = ownerToken;

      const result = await revertPaymentAction({
        paymentId: paymentId,
        reason: 'Refund requested via revertPaymentAction',
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe(paymentId);

      // Verify DB postconditions
      const [dbPay] = await queryTable('payments', `id=eq.${paymentId}`);
      expect(dbPay.status).toBe('REVERSED');
      expect(Number(dbPay.allocated_amount)).toBe(0);

      const [dbInv1] = await queryTable('invoices', `id=eq.${inv1Id}`);
      expect(dbInv1.status).toBe('ISSUED');
      expect(Number(dbInv1.amount_paid)).toBe(0);
      expect(Number(dbInv1.balance_due)).toBe(1500000);

      const [dbInv2] = await queryTable('invoices', `id=eq.${inv2Id}`);
      expect(dbInv2.status).toBe('ISSUED');
      expect(Number(dbInv2.amount_paid)).toBe(0);
      expect(Number(dbInv2.balance_due)).toBe(1000000);

      const [revertAudit] = await queryTable(
        'payment_audit',
        `payment_id=eq.${paymentId}&action=eq.payment.reverted`,
      );
      expect(revertAudit).toBeDefined();

      const revertLedger = await queryTable(
        'financial_ledger_entries',
        `reference_id=eq.${paymentId}&entry_type=eq.PAYMENT_REVERSED`,
      );
      expect(revertLedger.length).toBeGreaterThan(0);
    });

    // -------------------------------------------------------------------------
    // Positive Flow D: createRetailOrderAction (autoPay=true) with Genuine Session
    // -------------------------------------------------------------------------
    it('executes createRetailOrderAction with autoPay=true under genuine OWNER session', async () => {
      hoisted.activeToken = ownerToken;

      const [stockBefore] = await queryTable(
        'inventory_levels',
        `inventory_item_id=eq.${inventoryItemId}`,
      );

      const result = await createRetailOrderAction({
        brandId: brand.id,
        customerAccountId: customer.id,
        items: [
          {
            inventoryItemId: inventoryItemId,
            quantity: 2,
            unitPrice: '75000',
            discountTotal: '0',
            notes: 'Retail item via createRetailOrderAction',
          },
        ],
        shippingCost: '0',
        notes: 'Walk-in cash retail order via action',
        autoPay: true,
        paymentMethod: 'CASH',
        paymentReference: `CASH-ACTION-${runSuffix}`,
      });

      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();
      expect(result.orderNumber).toMatch(/^TS-O-\d{4}-\d{6}$/);
      expect(result.invoiceId).toBeDefined();
      expect(result.paymentId).toBeDefined();
      expect(result.isPaid).toBe(true);

      // Verify DB postconditions
      const [dbOrder] = await queryTable('orders', `id=eq.${result.orderId}`);
      expect(dbOrder.status).toBe('CONFIRMED');
      expect(Number(dbOrder.grand_total)).toBe(150000);

      const [dbInvoice] = await queryTable(
        'invoices',
        `id=eq.${result.invoiceId}`,
      );
      expect(dbInvoice.status).toBe('PAID');
      expect(Number(dbInvoice.amount_paid)).toBe(150000);

      const [dbPayment] = await queryTable(
        'payments',
        `id=eq.${result.paymentId}`,
      );
      expect(dbPayment.status).toBe('CONFIRMED');
      expect(Number(dbPayment.amount)).toBe(150000);
      expect(Number(dbPayment.allocated_amount)).toBe(150000);

      const [stockAfter] = await queryTable(
        'inventory_levels',
        `inventory_item_id=eq.${inventoryItemId}`,
      );
      expect(Number(stockAfter.quantity_reserved)).toBe(
        Number(stockBefore.quantity_reserved) + 2,
      );

      const reservations = await queryTable(
        'inventory_reservations',
        `order_id=eq.${result.orderId}`,
      );
      expect(reservations.length).toBe(1);
      expect(Number(reservations[0].quantity)).toBe(2);

      const retailLedger = await queryTable(
        'financial_ledger_entries',
        `order_id=eq.${result.orderId}`,
      );
      expect(retailLedger.length).toBeGreaterThan(0);

      const [retailPayAudit] = await queryTable(
        'payment_audit',
        `payment_id=eq.${result.paymentId}`,
      );
      expect(retailPayAudit).toBeDefined();
    });
  },
);
