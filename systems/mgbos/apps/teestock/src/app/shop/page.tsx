import type { Metadata } from 'next';
import Link from 'next/link';
import { ConceptGallery } from '../../components/RetailShowcase';
import { PublishedCatalog } from '../../components/PublishedCatalog';
import '../catalog.css';

export const metadata: Metadata = {
  title: 'The Edit — TeeStock Products & Studio Studies',
  description:
    'Jelajahi produk TeeStock terkurasi dan eksplorasi desain studio. Checkout online belum tersedia.',
};

export default function ShopPage() {
  return (
    <div className="retail-shop retail-wrap">
      <div className="retail-shop-crumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <span>The Edit</span>
      </div>
      <section className="retail-shop-hero" aria-labelledby="shop-heading">
        <div>
          <span className="retail-overline">
            TEESTOCK SELECTS / STUDIES 001—006
          </span>
          <h1 id="shop-heading">
            Find your <em>everyday.</em>
          </h1>
        </div>
        <p>
          Produk TeeStock terkurasi dan enam studi desain studio. Produk yang sudah
          disiapkan bisa dilihat di bawah; checkout online menyusul.
        </p>
      </section>
      <PublishedCatalog />
      <div className="retail-shop-notice" role="status">
        <span className="retail-availability-dot" aria-hidden="true" />
        <span>
          <strong>Studi Desain Studio.</strong> Enam konsep berikut adalah
          eksplorasi visual, bukan produk yang tersedia untuk dibeli.
          Checkout komersial belum dibuka.
        </span>
      </div>
      <ConceptGallery />
      <section className="retail-shop-end" aria-labelledby="shop-end-heading">
        <span className="retail-overline">THE COLLECTION WILL TAKE SHAPE</span>
        <h2 id="shop-end-heading">
          Good things take <em>intention.</em>
        </h2>
        <p>
          Kami sedang menyiapkan pengalaman belanja yang terkurasi. Sementara
          itu, kamu bisa mengenal layanan lain dari TeeStock atau kembali
          menjelajahi cerita kami.
        </p>
        <div className="retail-actions">
          <Link href="/custom" className="retail-action-primary">
            Layanan Custom <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/" className="retail-action-quiet">
            Kembali ke beranda <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
