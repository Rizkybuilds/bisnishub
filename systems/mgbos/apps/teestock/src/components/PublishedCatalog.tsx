import Image from 'next/image';
import Link from 'next/link';
import { listPublishedProducts } from '../lib/published-catalog.server';
import { formatIllustrativePrice } from '../data/products';

export async function PublishedCatalog() {
  const products = await listPublishedProducts();
  if (products.length === 0) return null;
  return (
    <section className="ts-public-catalog" aria-labelledby="ts-live-catalog-title">
      <div className="ts-public-kicker">TEESTOCK / PRODUCT CATALOG</div>
      <div className="ts-public-catalog-head">
        <h2 id="ts-live-catalog-title">The collection.</h2>
        <p>Produk yang sudah lolos kurasi, pengecekan hak penggunaan, dan sampling fisik.
          Checkout online sedang disiapkan.</p>
      </div>
      <div className="ts-public-product-grid">
        {products.map((product) => {
          const prices = product.variants.map((v) => v.priceIdr);
          return (
            <article className="ts-public-product" key={product.slug}>
              <Link href={'/shop/products/' + product.slug} aria-label={'Lihat detail ' + product.title}>
                <div className="ts-public-product-image">
                  <Image src={product.mockupUrl} alt={'Mockup ' + product.title}
                    width={700} height={840} unoptimized />
                </div>
                <div className="ts-public-product-meta">
                  <span>{product.collectionName}</span>
                  <span>MADE TO ORDER</span>
                </div>
                <h3>{product.title}</h3>
                <p>Mulai {formatIllustrativePrice(Math.min(...prices))}</p>
                <span className="ts-public-product-link">Lihat detail produk →</span>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
