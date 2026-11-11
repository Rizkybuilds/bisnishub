import type { Metadata } from 'next';
import { CartContents } from './CartContents';
import '../cart.css';

export const metadata: Metadata = {
  title: 'Keranjang — TeeStock',
  description:
    'Keranjang produk terkurasi TeeStock, terpisah dari studi desain simulasi.',
};

export default function CartPage() {
  return <CartContents />;
}
