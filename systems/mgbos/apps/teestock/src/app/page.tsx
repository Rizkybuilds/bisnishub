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

      {/* 3 Core Ecosystem Portals: Shop, Creator, Reseller (Bento-Grid Architecture) */}
      <section
        className="retail-wrap"
        style={{ paddingBlock: '48px 24px' }}
        aria-labelledby="portals-heading"
      >
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline" style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
              [TIGA PINTU EKOSISTEM TEESTOCK]
            </span>
            <h2 id="portals-heading" style={{ color: '#fafafa' }}>
              Satu Ekosistem. <em style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>Tiga Peran.</em>
            </h2>
          </div>
          <p style={{ color: '#a1a1aa' }}>
            Pilih jalur yang sesuai dengan kebutuhanmu: katalog kaos grafis retail terkurasi, kolaborasi
            merch desainer tanpa modal (Cotton Bureau Model), atau dropship white-label untuk toko apparel-mu.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            marginTop: 24,
          }}
        >
          {/* Door 1: Retail Shop */}
          <Link
            href="/shop"
            className="retail-path-card"
            style={{
              background: '#121217',
              border: '1px solid #27272a',
              textDecoration: 'none',
              borderRadius: 8,
              minHeight: 340,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
              01 / RETAIL SHOP
            </span>
            <strong style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '20px 0', color: '#fafafa' }}>
              The Curated
              <br />
              <em style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>Edit.</em>
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Katalog rilisan kaos grafis terkurasi. 100% Cotton Combed 24s lembut, sablon DTF
              tahan cuci, kalkulator ukuran presisi, dan promo voucher aktif.
            </p>
            <span className="retail-path-bottom" style={{ marginTop: 'auto', borderTopColor: '#27272a', color: '#fafafa' }}>
              Jelajahi The Edit <span aria-hidden="true" style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>↗</span>
            </span>
          </Link>

          {/* Door 2: Creator Merch Hub */}
          <Link
            href="/creator"
            className="retail-path-card"
            style={{
              background: '#121217',
              border: '1px solid #27272a',
              textDecoration: 'none',
              borderRadius: 8,
              minHeight: 340,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: '#ff5500', fontFamily: 'monospace' }}>
              02 / CREATOR MERCH (COTTON BUREAU MODEL)
            </span>
            <strong style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '20px 0', color: '#fafafa' }}>
              Karya Seni,
              <br />
              <em style={{ color: '#ff5500' }}>Bebas Modal.</em>
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Khusus desainer &amp; ilustrator independen. Nol modal di depan, kurasi pre-press 7+
              tahun, dan flat royalti bersih Rp 24.000/pcs per penjualan.
            </p>
            <span className="retail-path-bottom" style={{ marginTop: 'auto', borderTopColor: '#27272a', color: '#fafafa' }}>
              Masuk Creator Hub <span aria-hidden="true" style={{ color: '#ff5500' }}>↗</span>
            </span>
          </Link>

          {/* Door 3: Reseller & Dropship */}
          <Link
            href="/reseller"
            className="retail-path-card"
            style={{
              background: '#121217',
              border: '1px solid #27272a',
              textDecoration: 'none',
              borderRadius: 8,
              minHeight: 340,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
              03 / WHITE-LABEL DROPSHIP
            </span>
            <strong style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '20px 0', color: '#fafafa' }}>
              Brand Anda,
              <br />
              <em style={{ color: '#38bdf8' }}>Modal Rp 75k.</em>
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Dropship kaos distro untuk seller TikTok &amp; Shopee. Modal grosir Rp 75.000/pcs,
              kemasan polos tanpa logo TeeStock, dan bebas atur harga tokomu.
            </p>
            <span className="retail-path-bottom" style={{ marginTop: 'auto', borderTopColor: '#27272a', color: '#fafafa' }}>
              Buka Reseller Portal <span aria-hidden="true" style={{ color: '#38bdf8' }}>↗</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Craftsmanship & Standards Section (Bento Grid) */}
      <section
        className="retail-wrap"
        style={{
          marginBlock: '32px 48px',
          background: '#121217',
          border: '1px solid #27272a',
          borderRadius: 8,
          padding: 28,
        }}
        aria-label="Standar Pengerjaan TeeStock"
      >
        <span className="retail-overline" style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
          [STANDAR KUALITAS &amp; CRAFTSMANSHIP]
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginTop: 16,
          }}
        >
          <div style={{ background: '#18181f', padding: 18, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--ts-accent-lime, #c8f902)', display: 'block', marginBottom: 4 }}>
              [FABRIC: COMBED 24S]
            </span>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 6, color: '#fafafa' }}>
              🧵 100% Cotton Combed 24s
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Gramasi seimbang 185 gsm. Tidak menerawang, adem di kulit tropis, dan lembut dicuci berulang kali.
            </p>
          </div>
          <div style={{ background: '#18181f', padding: 18, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--ts-accent-lime, #c8f902)', display: 'block', marginBottom: 4 }}>
              [PRESS: 155°C DUAL]
            </span>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 6, color: '#fafafa' }}>
              🔥 DTF Double Press 155°C
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Proses curing oven dan pengepresan ganda pada suhu stabil 155°C untuk memastikan daya rekat pigmen maksimal.
            </p>
          </div>
          <div style={{ background: '#18181f', padding: 18, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--ts-accent-lime, #c8f902)', display: 'block', marginBottom: 4 }}>
              [CALIBRATION: 7YR EXPERT]
            </span>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 6, color: '#fafafa' }}>
              🎯 7+ Tahun Pre-Press Craft
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Dikelola oleh praktisi cetak berpengalaman, mengkalibrasi gamut warna CMYK agar karya visual tidak pudar.
            </p>
          </div>
          <div style={{ background: '#18181f', padding: 18, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--ts-accent-lime, #c8f902)', display: 'block', marginBottom: 4 }}>
              [WARRANTY: 100% REPLACEMENT]
            </span>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 6, color: '#fafafa' }}>
              ✨ 100% Garansi Ganti Baru
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Komitmen tanpa kompromi: ada cacat sablon atau cacat kain dari workshop, langsung kami kirim ganti baru.
            </p>
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
