import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllPreviewProducts,
  getPreviewProductBySlug,
} from '../../../data/products';
import { ProductDetailViewer } from '../../../components/ProductDetailViewer';

export function generateStaticParams() {
  return getAllPreviewProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getPreviewProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan — TeeStock',
    };
  }

  return {
    title: `${product.title} — TeeStock Selects`,
    description: `${product.tagline} Eksplorasi desain studi retail TeeStock Selects (${product.series}). Preview desain kurasi, belum menerima pesanan komersial.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getPreviewProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="retail-shop retail-wrap">
      <ProductDetailViewer product={product} />
    </div>
  );
}
