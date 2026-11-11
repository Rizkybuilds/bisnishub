'use server';

import { validateGuestCheckout } from '../../lib/guest-checkout';
import { createGuestOrder } from '../../lib/checkout.server';
import type { GuestOrderResult } from '../../lib/checkout.server';

export async function submitGuestCheckoutAction(
  input: unknown,
): Promise<GuestOrderResult> {
  const checked = validateGuestCheckout(input);
  if (!checked.ok) return { success: false, error: checked.error };
  return createGuestOrder(checked.value);
}
