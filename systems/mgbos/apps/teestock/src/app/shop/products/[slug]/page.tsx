import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listPublishedProducts } from '../../../../lib/published-catalog.server';
import { PublishedProductOptions } from '../../../../components/PublishedProductOptions';
import { checkoutEnabled } from '../../../../lib/checkout.server';
import '../../../catalog.css';
import '../../../cart.css';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { title: 'Produk tidak ditemukan', robots: { index: false } };
  }
  const [product] = await listPublishedProducts(slug);
  if (!product)
    return { title: 'Produk tidak ditemukan', robots: { index: false } };
  return {
    title: product.title + ' — TeeStock',
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title + ' — TeeStock',
      description: product.description.slice(0, 160),
      images: [
        { url: product.mockupUrl, alt: 'Mockup produk ' + product.title },
      ],
    },
  };
}

export default async function CatalogProductPage({ params }: Params) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) notFound();
  const [product] = await listPublishedProducts(slug);
  if (!product) notFound();

  return (
    <article className="ts-public-detail retail-wrap">
      <nav className="ts-public-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link> <span aria-hidden="true">/</span>{' '}
        <Link href="/shop">The Edit</Link> <span aria-hidden="true">/</span>{' '}
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="ts-public-detail-grid">
        <div className="ts-public-detail-media">
          <Image
            src={product.mockupUrl}
            width={900}
            height={1080}
            alt={'Foto mockup produk ' + product.title}
            unoptimized
            priority
          />
          <p>
            Foto mockup produk. Kombinasi warna yang dipilih belum memiliki foto
            terpisah; lihat label warna dan detail varian sebelum membeli.
          </p>
          <div className="ts-public-product-story">
            <span className="ts-public-kicker">
              {product.collectionName.toUpperCase()} / TEESTOCK
            </span>
            <h2>Behind the design.</h2>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="ts-public-detail-info">
          <PublishedProductOptions product={product} checkoutEnabled={checkoutEnabled()} />
          <Link href="/shop" className="ts-public-return">
            ← Kembali ke The Edit
          </Link>
        </div>
      </div>
    </article>
  );
}
