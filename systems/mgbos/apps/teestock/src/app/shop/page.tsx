import type { Metadata } from 'next';
import Link from 'next/link';
import { ConceptGallery } from '../../components/RetailShowcase';

export const metadata: Metadata = {
  title: 'The Edit — TeeStock Selects Preview Catalog',
  description:
    'Jelajahi pratinjau kurasi apparel grafis TeeStock Selects. Buka halaman studi produk untuk eksplorasi varian ukuran dan visual garmen.',
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
          Enam studi visual untuk menjelajahi arah TeeStock Selects. Pilih warna
          dan ukuran favorit Anda untuk memesan langsung melalui layanan resmi
          WhatsApp kami.
        </p>
      </section>
      <div className="retail-shop-notice" role="status">
        <span className="retail-availability-dot" aria-hidden="true" />
        <span>
          <strong>Layanan Pemesanan Aktif.</strong> Koleksi apparel dapat
          dipesan langsung melalui tombol WhatsApp pada setiap halaman detail
          produk.
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
