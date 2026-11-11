import Link from 'next/link';
import { listPublishedProducts } from '../lib/published-catalog.server';
import type { StorefrontProduct } from '../lib/storefront-product';
import { PublishedProductGrid } from './PublishedProductGrid';

export async function PublishedCatalog({
  products: supplied,
  featured = false,
}: {
  products?: StorefrontProduct[];
  featured?: boolean;
} = {}) {
  const products = supplied ?? (await listPublishedProducts());
  if (products.length === 0) return null;
  return (
    <section
      className={
        'ts-public-catalog' + (featured ? ' ts-public-catalog-featured' : '')
      }
      aria-labelledby="ts-live-catalog-title"
    >
      <div className="ts-public-kicker">TEESTOCK / CURATED RELEASES</div>
      <div className="ts-public-catalog-head">
        <h2 id="ts-live-catalog-title">The collection.</h2>
        <div>
          <p>
            Desain terpilih, bahan dan ukuran berdasarkan sampel yang sudah
            diperiksa. Checkout online masih disiapkan.
          </p>
          {featured && (
            <Link href="/shop" className="ts-public-all-products">
              Lihat semua produk <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </div>
      <PublishedProductGrid products={products} compact={featured} />
    </section>
  );
}
