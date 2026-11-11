import type { Metadata } from 'next';
import { checkoutEnabled } from '../../lib/checkout.server';
import { GuestCheckoutForm } from './GuestCheckoutForm';
import '../cart.css';

export const metadata: Metadata = {
  title: 'Guest Checkout — TeeStock',
  description:
    'Pengambilan mandiri dan pembayaran manual, tanpa payment gateway.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <GuestCheckoutForm enabled={checkoutEnabled()} />;
}
