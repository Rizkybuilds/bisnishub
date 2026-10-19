import Link from 'next/link';
import { ConceptGallery, HeroGarments } from '../components/RetailShowcase';

export default function Home() {
  return (
    <div className="retail-home">
      <section
        className="retail-hero retail-wrap"
        aria-labelledby="retail-hero-heading"
      >
        <div className="retail-hero-content">
          <span className="retail-overline">
            <span className="retail-overline-mark" /> A CURATED APPAREL HOUSE /
            INDONESIA
          </span>
          <h1 id="retail-hero-heading">
            Everyday
            <br />
            <em>wear,</em>
            <br />
            extraordinary
            <br />
            feeling.
          </h1>
          <p className="retail-hero-description">
            Kaos grafis dengan sudut pandang yang berbeda. Karya terkurasi,
            siluet yang dipikirkan, dan cerita kecil yang ingin kamu bawa ke
            mana-mana.
          </p>
          <div className="retail-actions">
            <Link href="/shop" className="retail-action-primary">
              Jelajahi koleksi <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#retail-story" className="retail-action-quiet">
              Kenali TeeStock <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <div className="retail-hero-footnote">
            <span>01 / 03 — EDITORIAL PREVIEW</span>
            <span>
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </span>
          </div>
        </div>
        <div
          className="retail-hero-art"
          aria-label="Ilustrasi konsep kaos TeeStock, bukan foto barang jual"
        >
          <div className="retail-hero-ring" />
          <HeroGarments />
          <div className="retail-hero-roundel">
            <span>TEESTOCK</span>
            <strong>
              WEAR YOUR
              <br />
              OWN STORY.
            </strong>
            <span>EST. IN PROGRESS</span>
          </div>
          <span className="retail-hero-art-note">
            STUDY NO. 001 / ILLUSTRATIVE ONLY
          </span>
        </div>
      </section>

      <section className="retail-ticker" aria-label="Nilai TeeStock">
        <div className="retail-ticker-inner">
          <span>MAKE IT YOURS</span>
          <span aria-hidden="true">✳</span>
          <span>DESIGN WITH INTENTION</span>
          <span aria-hidden="true">✳</span>
          <span>EVERYDAY, YOUR WAY</span>
          <span aria-hidden="true">✳</span>
          <span>TEESTOCK SELECTS</span>
          <span aria-hidden="true">✳</span>
        </div>
      </section>

      <section
        className="retail-collection-section retail-wrap"
        id="collection"
        aria-labelledby="retail-collection-heading"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">THE EDIT / PREVIEW 001</span>
            <h2 id="retail-collection-heading">
              Made to <em>feel</em> like you.
            </h2>
          </div>
          <p>
            Eksplorasi gaya visual TeeStock. Pilih warna, intip detail dan
            temukan arah koleksi yang sedang dikembangkan.
          </p>
        </div>
        <ConceptGallery compact />
      </section>

      <section
        className="retail-story-section"
        id="retail-story"
        aria-labelledby="retail-story-heading"
      >
        <div className="retail-wrap retail-story-grid">
          <div className="retail-story-art">
            <span className="retail-story-stamp">MORE THAN A BLANK CANVAS</span>
            <div className="retail-story-shape">
              <span>
                TS<span className="retail-story-star">✳</span>
              </span>
            </div>
            <span className="retail-story-side">
              CURATED / CONSIDERED / EVERYDAY
            </span>
          </div>
          <div className="retail-story-content">
            <span className="retail-overline">NOT JUST ANOTHER TEE</span>
            <h2 id="retail-story-heading">
              Simple things.
              <br />
              <em>Big feelings.</em>
            </h2>
            <p>
              TeeStock lahir dari keyakinan bahwa pakaian sehari-hari bisa
              terasa personal. Tidak harus berlebihan. Tidak harus mengikuti
              semua tren. Cukup dipilih dengan baik dan dipakai dengan percaya
              diri.
            </p>
            <p>
              Di sini, kurasi desain dan perhatian pada kualitas garmen berjalan
              berdampingan. Dari ide visual hingga detail produk, semuanya
              dibuat lebih mudah untuk dijelajahi.
            </p>
            <Link href="/shop" className="retail-text-link">
              Explore the edit <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="retail-paths-section retail-wrap"
        aria-labelledby="retail-paths-heading"
      >
        <div className="retail-section-heading retail-paths-heading">
          <div>
            <span className="retail-overline">BEYOND THE COLLECTION</span>
            <h2 id="retail-paths-heading">
              Your idea, <em>our canvas.</em>
            </h2>
          </div>
          <p>
            Selain koleksi pilihan, kami juga menyiapkan pengalaman untuk karya
            personal dan kebutuhan apparel organisasi.
          </p>
        </div>
        <div className="retail-paths-grid">
          <Link href="/custom" className="retail-path-card retail-path-custom">
            <span>01 / CUSTOM APPAREL</span>
            <strong>
              Make it
              <br />
              <em>personal.</em>
            </strong>
            <span className="retail-path-bottom">
              Eksplorasi layanan custom <span aria-hidden="true">↗</span>
            </span>
          </Link>
          <Link
            href="/business"
            className="retail-path-card retail-path-business"
          >
            <span>02 / FOR BUSINESS</span>
            <strong>
              Wear it
              <br />
              <em>together.</em>
            </strong>
            <span className="retail-path-bottom">
              Solusi untuk tim & organisasi <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>

      <section
        className="retail-availability retail-wrap"
        aria-label="Informasi kesiapan katalog"
      >
        <span className="retail-availability-dot" />
        <div>
          <strong>Shop (Katalog Ritel) — Belum Tersedia</strong>
          <p>
            Visual yang ditampilkan adalah studi desain konseptual, bukan produk
            jual, stok nyata, atau penawaran harga. Pemesanan mandiri belum
            dibuka. Build Merch masih dalam Pengembangan.
          </p>
        </div>
        <Link href="/support/contact">
          Informasi layanan <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
