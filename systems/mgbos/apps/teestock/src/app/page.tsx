import Link from 'next/link';
import { ConceptGallery, HeroGarments } from '../components/RetailShowcase';

export default function Home() {
  return (
    <div className="retail-home">
      {/* Modern Simple Notion-Style Hero Section */}
      <section
        className="retail-hero retail-wrap"
        aria-labelledby="retail-hero-heading"
      >
        <div className="retail-hero-content">
          <span className="retail-overline">
            <span className="retail-overline-mark" /> TEESTOCK ✳ EVERYDAY GRAPHIC APPAREL
          </span>
          <h1 id="retail-hero-heading">
            Kaos grafis esensial,
            <br />
            <em>dibuat dengan cermat.</em>
          </h1>
          <p className="retail-hero-description">
            Koleksi pakaian harian berbahan 100% Cotton Combed 24s dengan sablon DTF berkualitas tinggi. Sederhana, nyaman dipakai, dan dibuat untuk menemani aktivitasmu setiap hari.
          </p>
          <div className="retail-actions">
            <Link href="/shop" className="retail-action-primary">
              Jelajahi koleksi <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#editorial-dossiers" className="retail-action-quiet">
              Tiga Pintu Ekosistem <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <div className="retail-hero-footnote">
            <span>EDISI 001 // THE EDIT CATALOG</span>
            <span>
              BANDUNG, INDONESIA <span aria-hidden="true">●</span> ID
            </span>
          </div>
        </div>
        <div
          className="retail-hero-art"
          aria-label="Koleksi konsep kaos TeeStock Edisi 001"
        >
          <HeroGarments />
        </div>
      </section>

      {/* Modern Clean Ticker */}
      <section className="retail-ticker" aria-label="Spesifikasi TeeStock">
        <div className="retail-ticker-inner">
          <span>100% Cotton Combed 24s</span>
          <span aria-hidden="true">✳</span>
          <span>Sablon DTF Dual-Press 155°C</span>
          <span aria-hidden="true">✳</span>
          <span>Model Royalti Kreator Rp 24k/pcs</span>
          <span aria-hidden="true">✳</span>
          <span>Dropship White-Label Satuan</span>
          <span aria-hidden="true">✳</span>
          <span>Garansi Retur Ganti Baru 100%</span>
        </div>
      </section>

      {/* Catalog Drop Preview */}
      <section
        className="retail-collection-section retail-wrap"
        id="collection"
        aria-labelledby="retail-collection-heading"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">THE EDIT // EDISI 001</span>
            <h2 id="retail-collection-heading">
              Koleksi <em>pilihan.</em>
            </h2>
          </div>
          <p>
            Eksplorasi desain kaos grafis harian. Pilih warna kain, lihat detail bahan, dan temukan artikel yang cocok untuk gayamu.
          </p>
        </div>
        <ConceptGallery compact />
      </section>

      {/* 3 Core Ecosystem Portals: Shop, Creator, Reseller (Notion Card Style) */}
      <section
        id="editorial-dossiers"
        className="retail-wrap"
        style={{ paddingBlock: '56px 28px' }}
        aria-labelledby="portals-heading"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">
              TIGA PINTU EKOSISTEM
            </span>
            <h2 id="portals-heading">
              Satu Ekosistem. <em>Tiga Peran.</em>
            </h2>
          </div>
          <p>
            Pilih jalur yang sesuai dengan kebutuhanmu: katalog kaos grafis retail terkurasi, kolaborasi
            merch desainer tanpa modal (Cotton Bureau Model), atau dropship white-label untuk toko apparel-mu.
          </p>
        </div>

        <div className="retail-dossiers-grid">
          {/* Door 1: Retail Shop */}
          <Link href="/shop" className="retail-dossier-card">
            <div className="retail-dossier-header">
              <span className="retail-dossier-num">01</span>
              <span className="retail-dossier-tag">KATALOG RITEL</span>
            </div>
            <strong className="retail-dossier-title">
              The Curated
              <br />
              <em>Edit.</em>
            </strong>
            <p className="retail-dossier-desc">
              Koleksi kaos grafis terkurasi siap pakai. 100% Cotton Combed 24s lembut, sablon DTF awet dicuci, panduan ukuran akurat, dan diskon promo aktif.
            </p>
            <div className="retail-dossier-spec">
              <span>HARGA RITEL: RP 99.000</span>
              <span>STATUS: KATALOG AKTIF</span>
            </div>
            <span className="retail-dossier-action">
              Jelajahi The Edit <span aria-hidden="true">↗</span>
            </span>
          </Link>

          {/* Door 2: Creator Merch Hub */}
          <Link href="/creator" className="retail-dossier-card">
            <div className="retail-dossier-header">
              <span className="retail-dossier-num">02</span>
              <span className="retail-dossier-tag">CREATOR HUB</span>
            </div>
            <strong className="retail-dossier-title">
              Karya Kreator,
              <br />
              <em>Nol Modal.</em>
            </strong>
            <p className="retail-dossier-desc">
              Model Cotton Bureau untuk ilustrator &amp; desainer. Upload karyamu tanpa modal, kami cetak &amp; kirim pesanan satuan, kamu terima flat royalti bersih Rp 24.000/pcs.
            </p>
            <div className="retail-dossier-spec">
              <span>ROYALTI: RP 24.000 / PCS</span>
              <span>MODAL DI DEPAN: RP 0</span>
            </div>
            <span className="retail-dossier-action">
              Masuk Creator Hub <span aria-hidden="true">↗</span>
            </span>
          </Link>

          {/* Door 3: Reseller & Dropship */}
          <Link href="/reseller" className="retail-dossier-card">
            <div className="retail-dossier-header">
              <span className="retail-dossier-num">03</span>
              <span className="retail-dossier-tag">WHITE-LABEL DROPSHIP</span>
            </div>
            <strong className="retail-dossier-title">
              Brand Milikmu,
              <br />
              <em>Mesin Kami.</em>
            </strong>
            <p className="retail-dossier-desc">
              Suplai kaos distro untuk toko TikTok Shop &amp; Shopee milikmu. Modal grosir Rp 75.000/pcs, kemasan polymailer polos tanpa atribut TeeStock, bebas atur tokomu.
            </p>
            <div className="retail-dossier-spec">
              <span>MODAL GROSIR: RP 75.000</span>
              <span>KEMASAN: POLOS WHITE-LABEL</span>
            </div>
            <span className="retail-dossier-action">
              Buka Reseller Portal <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Craftsmanship & Standards Section (Notion Properties Style) */}
      <section
        className="retail-techpack-section retail-wrap"
        aria-label="Standar Pengerjaan &amp; Garment Tech-Pack"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">
              STANDAR PRODUKSI
            </span>
            <h2>
              Kualitas bahan <em>&amp; pengerjaan.</em>
            </h2>
          </div>
          <p>
            Setiap produk dikerjakan dengan standar workshop konveksi dan sablon distro Bandung.
          </p>
        </div>

        <div className="retail-techpack-grid">
          <div className="retail-techpack-card">
            <span className="retail-techpack-code">01 // BAHAN</span>
            <strong className="retail-techpack-title">100% Cotton Combed 24s</strong>
            <p className="retail-techpack-desc">
              Gramasi seimbang 185 GSM. Serat katun alami yang halus, adem saat cuaca panas, menyerap keringat, dan tidak menerawang.
            </p>
          </div>
          <div className="retail-techpack-card">
            <span className="retail-techpack-code">02 // KERAH</span>
            <strong className="retail-techpack-title">Rib Spandex 2.5cm</strong>
            <p className="retail-techpack-desc">
              Kerah leher elastis dengan jahitan rantai ganda (twin-needle). Menjaga bentuk kerah tetap rapi dan tidak melar pasca dicuci.
            </p>
          </div>
          <div className="retail-techpack-card">
            <span className="retail-techpack-code">03 // SABLON</span>
            <strong className="retail-techpack-title">DTF Dual-Press 155°C</strong>
            <p className="retail-techpack-desc">
              Menggunakan tinta pigmen premium dengan proses pematangan oven ganda pada suhu 155°C. Warna solid, lentur, dan tahan cuci berkali-kali.
            </p>
          </div>
          <div className="retail-techpack-card">
            <span className="retail-techpack-code">04 // GARANSI</span>
            <strong className="retail-techpack-title">Garansi Ganti Baru 100%</strong>
            <p className="retail-techpack-desc">
              Komitmen penuh: jika pesanan yang kamu terima memiliki cacat sablon atau cacat kain dari workshop, langsung kami ganti baru tanpa biaya tambahan.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Link Paths */}
      <section
        className="retail-paths-section retail-wrap"
        aria-labelledby="retail-paths-heading"
      >
        <div className="retail-section-heading retail-paths-heading">
          <div>
            <span className="retail-overline">LAYANAN LAINNYA</span>
            <h2 id="retail-paths-heading">
              Kebutuhan custom <em>&amp; bisnis.</em>
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
              Sablon Kaos
              <br />
              <em>Custom.</em>
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
              Seragam &amp;
              <br />
              <em>Merchandise.</em>
            </strong>
            <span className="retail-path-bottom">
              Solusi untuk tim &amp; organisasi <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Catalog Availability Notice */}
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
