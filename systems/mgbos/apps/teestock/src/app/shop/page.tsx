import type { Metadata } from 'next';
import Link from 'next/link';
import { ConceptGallery } from '../../components/RetailShowcase';

export const metadata: Metadata = {
  title: 'The Edit — TeeStock Selects Active Collection',
  description:
    'Koleksi apparel grafis terkurasi TeeStock Selects. Kaos Cotton Combed Premium 24s dengan cetak DTF tahan cuci dan garansi retur 100%.',
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
            TEESTOCK ARCHIVE // THE RETAIL EDIT // DROP 001
          </span>
          <h1 id="shop-heading">
            Heavyweight <em>silhouettes.</em>
          </h1>
        </div>
        <p>
          Katalog kaos streetwear terkurasi. 100% Cotton Combed 24s gramasi 185 GSM dengan sablon DTF dual-press 155°C berdaya rekat elastis. Pilih artikel favoritmu dan pesan langsung via WhatsApp resmi.
        </p>
      </section>

      {/* Promotional Banner */}
      <div className="retail-banner-promo" role="status">
        <span className="retail-banner-promo-badge">PROMO LAUNCH</span>
        <div className="retail-banner-promo-text">
          Gunakan kode voucher{' '}
          <span className="retail-banner-promo-code">HEMAT10</span> untuk diskon
          10%, atau{' '}
          <span className="retail-banner-promo-code">BELI2HEMAT</span> untuk
          potongan Rp 20.000 (min. 2 pcs).
        </div>
      </div>

      <ConceptGallery />

      <section className="retail-shop-end" aria-labelledby="shop-end-heading">
        <span className="retail-overline">EKOSISTEM APPAREL LENGKAP</span>
        <h2 id="shop-end-heading">
          Punya Desain Sendiri atau Ingin <em>Bermitra?</em>
        </h2>
        <p>
          Selain koleksi kurasi ritel di atas, TeeStock membuka peluang
          kolaborasi tanpa modal untuk Kreator (royalti per pcs) dan program
          Dropshipper white-label untuk penjual fashion.
        </p>
        <div className="retail-actions">
          <Link href="/mitra" className="retail-action-primary">
            Program Mitra Kreator &amp; Dropship <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/custom" className="retail-action-quiet">
            Layanan Sablon Custom <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
