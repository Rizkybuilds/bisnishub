import type { Metadata } from 'next';
import Link from 'next/link';
import { ConceptGallery } from '../../components/RetailShowcase';
import { PublishedCatalog } from '../../components/PublishedCatalog';
import { listPublishedProducts } from '../../lib/published-catalog.server';
import '../catalog.css';

export const metadata: Metadata = {
  title: 'The Edit — TeeStock Collection & Studio Studies',
  description:
    'Katalog produk TeeStock yang terverifikasi dan arsip studi desain. Enam studi visual belum tersedia untuk dibeli.',
};

export default async function ShopPage() {
  const publishedProducts = await listPublishedProducts();

  return (
    <div className="retail-shop ts-r1-page ts-r1-shop retail-wrap">
      <nav className="ts-r1-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">The Edit</span>
      </nav>

      <section className="ts-r1-shop-intro" aria-labelledby="shop-heading">
        <div className="ts-r1-shop-intro-main">
          <span className="ts-r1-kicker">TEESTOCK / THE EDIT</span>
          <h1 id="shop-heading">
            A collection
            <br />
            <em>of perspectives.</em>
          </h1>
        </div>
        <div className="ts-r1-shop-intro-aside">
          <p>
            Graphic apparel dengan pemikiran di balik setiap desain. Produk yang
            telah diverifikasi dipisahkan dari studi visual studio.
          </p>
          <div className="ts-r1-shop-anchor-nav" aria-label="Bagian koleksi">
            <a href="#available-products">01 / RELEASES</a>
            <a href="#studio-studies">02 / STUDIO STUDIES</a>
          </div>
        </div>
      </section>

      <section
        className="ts-r1-shop-releases"
        id="available-products"
        aria-labelledby="r1-shop-release-heading"
      >
        <div className="ts-r1-section-top">
          <span className="ts-r1-kicker">01 / PRODUCT RELEASES</span>
          <span>
            {publishedProducts.length} VERIFIED PRODUCT
            {publishedProducts.length === 1 ? '' : 'S'}
          </span>
        </div>
        {publishedProducts.length ? (
          <>
            <h2 id="r1-shop-release-heading" className="ts-r1-release-title">
              Ready to explore.
            </h2>
            <PublishedCatalog products={publishedProducts} />
          </>
        ) : (
          <div className="ts-r1-release-empty">
            <div>
              <span className="ts-r1-empty-mark" aria-hidden="true">
                —
              </span>
              <h2 id="r1-shop-release-heading">Nothing released yet.</h2>
              <p>
                Produk akan muncul setelah artwork, lisensi, sampel fisik, dan
                detail ukuran lolos pemeriksaan. Tidak ada stok fiktif atau
                harga simulasi di bagian ini.
              </p>
            </div>
            <span className="ts-r1-status-line">
              <span aria-hidden="true" /> COLLECTION IN PREPARATION
            </span>
          </div>
        )}
      </section>

      <section
        className="ts-r1-shop-studies"
        id="studio-studies"
        aria-labelledby="r1-shop-studies-heading"
      >
        <div className="ts-r1-section-top">
          <span className="ts-r1-kicker">02 / STUDIO ARCHIVE</span>
          <span>EXPLORATION 001 — 006</span>
        </div>
        <div className="ts-r1-section-heading">
          <h2 id="r1-shop-studies-heading">
            Ideas before
            <br />
            they become things.
          </h2>
          <div className="ts-r1-section-aside">
            <p>
              Tahap Pratinjau Desain Studio. Enam konsep ilustratif ini belum
              menjadi produk terverifikasi dan tidak tersedia untuk dibeli.
              Halaman detailnya adalah simulasi pengalaman produk.
            </p>
            <span className="ts-r1-studies-disclaimer">
              CONCEPT STUDIES / NOT FOR SALE
            </span>
          </div>
        </div>
        <ConceptGallery />
      </section>

      <section className="ts-r1-shop-bottom" aria-label="Informasi pesanan">
        <span className="ts-r1-kicker">GOOD THINGS TAKE CONSIDERATION.</span>
        <p>
          Status produk dan harga komersial hanya berlaku untuk rilis
          terverifikasi. Checkout dan pembayaran masih nonaktif pada preview
          ini.
        </p>
        <Link className="ts-r1-inline-link" href="/support/contact">
          Ada pertanyaan? Hubungi kami <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
