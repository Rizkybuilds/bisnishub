import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  addToCart,
  cartTotal,
  normalizeCart,
} from '../apps/teestock/src/lib/live-cart';
import { validateGuestCheckout } from '../apps/teestock/src/lib/guest-checkout';

const line = {
  slug: 'f03-tee',
  sku: 'TS-F03-L',
  productTitle: 'TeeStock F03 Tee',
  color: 'Black',
  size: 'L' as const,
  priceIdr: 169000,
  quantity: 1,
};
const request = {
  requestId: 'f5c70dd2-05b1-43bd-9048-0b5094fb3b1c',
  name: 'Example Buyer',
  phone: '081234567891',
  email: '',
  honeypot: '',
  agreedToPickup: true,
  items: [
    {
      slug: line.slug,
      sku: line.sku,
      quantity: 1,
      expectedPriceIdr: line.priceIdr,
    },
  ],
};

describe('TeeStock F03 real cart', () => {
  it('keeps real cart prices as estimates and prevents duplicate lines', () => {
    const once = addToCart([], line);
    expect(once.error).toBeUndefined();
    const twice = addToCart(once.lines, line);
    expect(twice.error).toBeUndefined();
    expect(twice.lines).toHaveLength(1);
    expect(twice.lines[0]?.quantity).toBe(2);
    expect(cartTotal(twice.lines)).toBe(338000);
  });

  it('rejects more than ten of one SKU', () => {
    expect(addToCart([], { ...line, quantity: 11 }).error).toBeDefined();
    expect(addToCart([{ ...line, quantity: 10 }], line).error).toBeDefined();
  });

  it('sanitizes malformed local browser state', () => {
    expect(
      normalizeCart([{ ...line }, { ...line }, { ...line, priceIdr: -1 }]),
    ).toHaveLength(1);
    expect(normalizeCart({ polluted: true })).toEqual([]);
  });
});

describe('TeeStock F03 guest checkout contract', () => {
  it('validates a single pickup order with server-price expectations', () => {
    const result = validateGuestCheckout(request);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.items[0]?.expectedPriceIdr).toBe(169000);
  });

  it('rejects duplicate SKUs, fake customer amounts, and quantity abuse', () => {
    expect(
      validateGuestCheckout({
        ...request,
        items: [request.items[0], request.items[0]],
      }).ok,
    ).toBe(false);
    expect(
      validateGuestCheckout({
        ...request,
        items: [{ ...request.items[0], expectedPriceIdr: -1 }],
      }).ok,
    ).toBe(false);
    expect(
      validateGuestCheckout({
        ...request,
        items: [{ ...request.items[0], quantity: 40 }],
      }).ok,
    ).toBe(false);
  });

  it('rejects missing pickup agreement, bot honeypot and invalid identity', () => {
    expect(
      validateGuestCheckout({ ...request, agreedToPickup: false }).ok,
    ).toBe(false);
    expect(
      validateGuestCheckout({ ...request, honeypot: 'spam-link' }).ok,
    ).toBe(false);
    expect(validateGuestCheckout({ ...request, phone: 'abcd' }).ok).toBe(false);
    expect(
      validateGuestCheckout({ ...request, requestId: 'not-a-uuid' }).ok,
    ).toBe(false);
  });
});

describe('TeeStock F03 database migration structure', () => {
  it('keeps one transaction, privileged checkout RPC and both guards', () => {
    const migrationPath = new URL(
      '../supabase/migrations/20261111070000_teestock_guest_checkout_f03.sql',
      import.meta.url,
    );
    const migration = readFileSync(migrationPath, 'utf8');
    const count = (needle: string) => migration.split(needle).length - 1;
    expect(count('create function app.create_teestock_guest_order(')).toBe(1);
    expect(
      count('create function app.teestock_guest_order_payment_guard()'),
    ).toBe(1);
    expect(count('create function app.teestock_guest_production_guard()')).toBe(
      1,
    );
    expect(migration.match(/^commit;$/gm)).toHaveLength(1);
    expect(migration.trimEnd().endsWith('commit;')).toBe(true);
  });
});
