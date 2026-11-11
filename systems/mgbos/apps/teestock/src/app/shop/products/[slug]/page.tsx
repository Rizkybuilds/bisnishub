import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listPublishedProducts } from '../../../../lib/published-catalog.server';
import { formatIllustrativePrice } from '../../../../data/products';
import '../../../catalog.css';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { title: 'Produk tidak ditemukan' };
  const [product] = await listPublishedProducts(slug);
  if (!product) return { title: 'Produk tidak ditemukan' };
  return { title: product.title + ' — TeeStock', description: product.description.slice(0, 160) };
}

export default async function CatalogProductPage({ params }: Params) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) notFound();
  const [product] = await listPublishedProducts(slug);
  if (!product) notFound();

  return (
    <article className="ts-public-detail retail-wrap">
      <nav className="ts-public-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">The Edit</Link> / <span>{product.title}</span>
      </nav>
      <div className="ts-public-detail-grid">
        <div className="ts-public-detail-media">
          <Image src={product.mockupUrl} width={900} height={1080} alt={'Foto mockup ' + product.title} unoptimized priority />
          <p>Foto representasi produk. Warna dan hasil cetak aktual dapat sedikit bervariasi.</p>
        </div>
        <div className="ts-public-detail-info">
          <p className="ts-public-kicker">{product.collectionName.toUpperCase()} / TEESTOCK</p>
          <h1>{product.title}</h1>
          <p className="ts-public-price">Mulai {formatIllustrativePrice(Math.min(...product.variants.map((variant) => variant.priceIdr)))}</p>
          <p className="ts-public-description">{product.description}</p>
          <h2>Varian tersedia</h2>
          <div className="ts-public-variant-list">
            {product.variants.map((variant) => (
              <div key={variant.sku} className="ts-public-variant-row">
                <span><strong>{variant.size}</strong> · {variant.color}</span>
                <strong>{formatIllustrativePrice(variant.priceIdr)}</strong>
              </div>
            ))}
          </div>
          <div className="ts-public-checkout-note" role="status">
            <strong>Checkout online belum dibuka.</strong>
            <p>Produk ini telah terkurasi dan menggunakan produksi made-to-order.
              Fitur pemesanan serta pembayaran QRIS manual sedang dipersiapkan.
              Tidak ada pembayaran yang dapat dilakukan dari halaman ini.</p>
          </div>
          <Link href="/shop" className="ts-public-return">← Kembali ke katalog</Link>
        </div>
      </div>
    </article>
  );
}
