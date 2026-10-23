import Link from 'next/link';
import { ConceptGallery, HeroGarments } from '../components/RetailShowcase';

export default function Home() {
  return (
    <div className="retail-home">
      {/* Raw Streetwear Editorial Hero Section */}
      <section
        className="retail-hero retail-wrap"
        aria-labelledby="retail-hero-heading"
      >
        <div className="retail-hero-content">
          <span className="retail-overline">
            <span className="retail-overline-mark" /> ARCHIVE 2026 // BANDUNG APPAREL LAB
          </span>
          <h1 id="retail-hero-heading">
            Heavyweight
            <br />
            <em>streetwear,</em>
            <br />
            raw editorial.
          </h1>
          <p className="retail-hero-description">
            Standar garmen distro independen. Cotton Combed 24s gramasi 185 GSM dengan sablon DTF dual-press 155°C. Katalog ritel terkurasi, inkubator karya kreator independen, dan dropship white-label tanpa modal.
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
            <span>DROP 001 // THE RETAIL EDIT</span>
            <span>
              BANDUNG, WEST JAVA <span aria-hidden="true">●</span> ID
            </span>
          </div>
        </div>
        <div
          className="retail-hero-art"
          aria-label="Koleksi konsep kaos TeeStock Drop 001"
        >
          <div className="retail-hero-frame-marks">
            <span className="frame-mark-tl">[LOOKBOOK // NO. 001]</span>
            <span className="frame-mark-tr">[DTF 155°C]</span>
            <span className="frame-mark-bl">[COMBED 24S / 185 GSM]</span>
            <span className="frame-mark-br">[STATUS: IN CATALOG]</span>
          </div>
          <HeroGarments />
        </div>
      </section>

      {/* Raw Industrial Ticker */}
      <section className="retail-ticker" aria-label="Spesifikasi TeeStock">
        <div className="retail-ticker-inner">
          <span>100% COTTON COMBED 24S</span>
          <span aria-hidden="true">✳</span>
          <span>155°C DUAL-HEAT DTF SABLON</span>
          <span aria-hidden="true">✳</span>
          <span>COTTON BUREAU CREATOR MODEL</span>
          <span aria-hidden="true">✳</span>
          <span>WHITE-LABEL DROPSHIP ENGINE</span>
          <span aria-hidden="true">✳</span>
          <span>BANDUNG APPAREL LAB</span>
          <span aria-hidden="true">✳</span>
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
            <span className="retail-overline">THE EDIT // DROP 001 ARCHIVE</span>
            <h2 id="retail-collection-heading">
              Curated <em>silhouettes.</em>
            </h2>
          </div>
          <p>
            Eksplorasi rilisan kaos grafis berkarakter tajam. Pilih warna kain, periksa detail presisi sablon, dan temukan artikel favoritmu.
          </p>
        </div>
        <ConceptGallery compact />
      </section>

      {/* 3 Core Ecosystem Portals: Shop, Creator, Reseller (Raw Lookbook Dossiers) */}
      <section
        id="editorial-dossiers"
        className="retail-wrap"
        style={{ paddingBlock: '64px 32px' }}
        aria-labelledby="portals-heading"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">
              [TIGA PINTU EKOSISTEM TEESTOCK]
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
              <span className="retail-dossier-tag">THE RETAIL EDIT</span>
            </div>
            <strong className="retail-dossier-title">
              Katalog Ritel
              <br />
              <em>Heavyweight.</em>
            </strong>
            <p className="retail-dossier-desc">
              Koleksi kaos grafis terkurasi. 100% Cotton Combed 24s 185 GSM, sablon DTF elastis tahan uji 60+ cuci, kalkulator ukuran presisi, dan voucher promo rilis aktif.
            </p>
            <div className="retail-dossier-spec">
              <span>HARGA RITEL: RP 99.000</span>
              <span>STATUS: PREVIEW ACTIVE</span>
            </div>
            <span className="retail-dossier-action">
              Jelajahi The Edit <span aria-hidden="true">↗</span>
            </span>
          </Link>

          {/* Door 2: Creator Merch Hub */}
          <Link href="/creator" className="retail-dossier-card">
            <div className="retail-dossier-header">
              <span className="retail-dossier-num">02</span>
              <span className="retail-dossier-tag" style={{ color: '#ff5500', borderColor: 'rgba(255,85,0,0.3)' }}>
                CREATOR PLATFORM
              </span>
            </div>
            <strong className="retail-dossier-title">
              Karya Kreator,
              <br />
              <em style={{ color: '#ff5500' }}>Nol Modal.</em>
            </strong>
            <p className="retail-dossier-desc">
              Model Cotton Bureau untuk ilustrator &amp; desainer independen. Upload desainmu, kurasi pre-press 7+ tahun, kami cetak &amp; kirim satuan. Royalti bersih flat Rp 24.000/pcs.
            </p>
            <div className="retail-dossier-spec">
              <span>ROYALTI: RP 24.000 / PCS</span>
              <span>RISIKO MODAL: RP 0</span>
            </div>
            <span className="retail-dossier-action" style={{ color: '#ff5500' }}>
              Masuk Creator Hub <span aria-hidden="true">↗</span>
            </span>
          </Link>

          {/* Door 3: Reseller & Dropship */}
          <Link href="/reseller" className="retail-dossier-card">
            <div className="retail-dossier-header">
              <span className="retail-dossier-num">03</span>
              <span className="retail-dossier-tag" style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)' }}>
                WHITE-LABEL DROPSHIP
              </span>
            </div>
            <strong className="retail-dossier-title">
              Brand Milikmu,
              <br />
              <em style={{ color: '#38bdf8' }}>Mesin Kami.</em>
            </strong>
            <p className="retail-dossier-desc">
              Infrastruktur suplai dropship untuk seller TikTok Shop &amp; Shopee. Modal grosir Rp 75.000/pcs, kemasan polymailer polos tanpa atribut TeeStock, bebas tentukan tokomu.
            </p>
            <div className="retail-dossier-spec">
              <span>MODAL GROSIR: RP 75.000</span>
              <span>KEMASAN: WHITE-LABEL POLOS</span>
            </div>
            <span className="retail-dossier-action" style={{ color: '#38bdf8' }}>
              Buka Reseller Portal <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Garment Anatomy & Lab Tech-Pack Section (No Cheesy Emojis) */}
      <section
        className="retail-techpack-section retail-wrap"
        aria-label="Standar Pengerjaan &amp; Garment Tech-Pack"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">
              [TECHNICAL APPAREL SPECIFICATIONS]
            </span>
            <h2>
              Garment Anatomy <em>&amp; Lab Standards.</em>
            </h2>
          </div>
          <p>
            Standar pengerjaan workshop cetak dan jahit garmen distro Bandung dengan spesifikasi teknis transparan.
          </p>
        </div>

        <div className="retail-techpack-grid">
          <div className="retail-techpack-card">
            <div className="retail-techpack-code">SPEC // 01</div>
            <span className="retail-techpack-label">FABRIC KNIT</span>
            <strong className="retail-techpack-title">100% Cotton Combed 24s</strong>
            <p className="retail-techpack-desc">
              Single Jersey gramasi 185-190 GSM. Serat katun panjang disisir halus, sejuk di iklim tropis, daya serap tinggi, dan tidak menerawang.
            </p>
          </div>
          <div className="retail-techpack-card">
            <div className="retail-techpack-code">SPEC // 02</div>
            <span className="retail-techpack-label">COLLAR ARCHITECTURE</span>
            <strong className="retail-techpack-title">2.5cm Spandex Heavy Rib</strong>
            <p className="retail-techpack-desc">
              Rib kerah leher elastis dengan jahitan rantai ganda (twin-needle chainstitch). Tahan melar dan anti-keriting (anti bacon collar) pasca cuci berulang.
            </p>
          </div>
          <div className="retail-techpack-card">
            <div className="retail-techpack-code">SPEC // 03</div>
            <span className="retail-techpack-label">PRINT MATRIX</span>
            <strong className="retail-techpack-title">Dual-Press DTF 155°C</strong>
            <p className="retail-techpack-desc">
              Film poliuretan premium dengan double-heat press (15s press + cold peel + 8s curing). Tahan uji cuci mesin 60+ cycle tanpa retak atau luntur.
            </p>
          </div>
          <div className="retail-techpack-card">
            <div className="retail-techpack-code">SPEC // 04</div>
            <span className="retail-techpack-label">FACTORY WARRANTY</span>
            <strong className="retail-techpack-title">100% Replacement Guarantee</strong>
            <p className="retail-techpack-desc">
              Komitmen kualitas workshop: jika ditemukan cacat cetak atau cacat kain dari workshop produksi kami, pesanan langsung diganti baru.
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
