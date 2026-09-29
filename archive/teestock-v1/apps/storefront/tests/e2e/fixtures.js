import { test as base, expect } from '@playwright/test';

const appOrigin = 'http://127.0.0.1:43190';
const apiOrigin = 'http://127.0.0.1:43192';
const product = {
  sku: 'E2E-BLK-3600', name: 'NSA 3600 Fixture', series: 'blank',
  template: 'blank', status: 'active', price_retail: 65000,
  colors: 'Hitam', sizes: 'S, M, L, XL', curated_colors: ['Hitam'],
  file_path: '/logo-teestock.svg', description: 'Synthetic browser test product'
};

// Every browser context uses an in-memory backend. Unknown API calls fail the
// test instead of falling back to a remote service or silently succeeding.
export const test = base.extend({
  backend: [async ({ context }, use) => {
    const state = { checkouts: [], tracking: [], subscribers: [], unexpected: [], orders: new Map() };
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const json = body => route.fulfill({ json: body });
      if (url.origin === appOrigin) return route.continue();
      if (url.origin === apiOrigin) {
        const path = url.pathname;
        if (request.method() === 'GET' && path === '/rest/v1/ts_products') return json([product]);
        if (request.method() === 'GET' && path === '/rest/v1/ts_settings') return json([]);
        if (request.method() === 'GET' && path === '/rest/v1/ts_reviews') return json([]);
        if (request.method() === 'POST' && path === '/rest/v1/ts_subscribers') {
          const body = request.postDataJSON();
          state.subscribers.push(...body);
          return json({ id: 'e2e-subscriber', ...body[0] });
        }
        if (request.method() === 'GET' && path === '/rest/v1/ts_vouchers') {
          if (url.searchParams.get('code') !== 'eq.WELCOME10') return json(null);
          return json({ code: 'WELCOME10', is_active: true, discount_type: 'percent', discount_value: 10, target_role: 'all' });
        }
        if (request.method() === 'POST' && path === '/functions/v1/create-checkout') {
          const body = request.postDataJSON();
          state.checkouts.push(body);
          const orderNumber = `TS-E2E-${state.checkouts.length}`;
          const subtotal = body.items.reduce((sum, item) => sum + item.price * item.qty, 0);
          const discountAmount = body.voucherCode === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
          const shippingFee = body.shipping.fee;
          const uniqueCode = 123;
          const result = { orderNumber, orderUuid: '00000000-0000-4000-8000-000000000001',
            subtotal, discountAmount, shippingFee, shippingZone: body.shipping.zone,
            uniqueCode, grandTotal: subtotal - discountAmount + shippingFee + uniqueCode,
            items: body.items };
          state.orders.set(orderNumber, { body, result });
          return json({ status: 'success', data: result });
        }
        if (request.method() === 'POST' && path === '/functions/v1/track-order') {
          const body = request.postDataJSON();
          state.tracking.push(body);
          const order = state.orders.get(body.orderNumber);
          if (!order || body.phoneLast4 !== order.body.customer.phone.slice(-4)) {
            return json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
          }
          return json({ status: 'success', data: { order_number: body.orderNumber,
            status: 'pending_payment', customer_masked: 'Fixture Customer',
            created_at: '2026-09-28T00:00:00Z', items: order.body.items } });
        }
        state.unexpected.push(`${request.method()} ${path}`);
        return route.abort('blockedbyclient');
      }
      // External images/fonts/scripts are intentionally unavailable. In
      // particular no payment, analytics, storage or production API is allowed.
      if (['fetch', 'xhr'].includes(request.resourceType())) {
        state.unexpected.push(`${request.method()} ${url.origin}${url.pathname}`);
      }
      return route.abort('blockedbyclient');
    });
    await context.routeWebSocket('**/*', socket => {
      if (new URL(socket.url()).origin === appOrigin.replace('http:', 'ws:')) {
        socket.connectToServer();
      } else {
        state.unexpected.push(`WebSocket ${new URL(socket.url()).origin}`);
        socket.close();
      }
    });
    await use(state);
    expect(state.unexpected, 'No unhandled or external API requests').toEqual([]);
  }, { auto: true }]
});
export { expect };
