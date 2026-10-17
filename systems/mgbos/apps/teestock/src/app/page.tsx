import Link from 'next/link';
import { Badge } from '../components/Badge';
import { NoticeBox } from '../components/NoticeBox';

export default function Home() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="section" aria-labelledby="hero-heading">
        <span className="eyebrow">TeeStock / Apparel Ecosystem</span>
        <h1 id="hero-heading">
          Pondasi Produksi &amp; Kustomisasi Garmen yang Rapi, Andal, dan
          Terkurasi.
        </h1>
        <p className="lead-text">
          TeeStock menghubungkan kebutuhan apparel berkualitas — dari proyek
          custom personal hingga seragam dan merchandise korporat — dengan
          proses tinjauan manusia yang transparan dan tertib.
        </p>

        <div className="btn-group">
          <Link href="/custom" className="btn btn-primary">
            Jelajahi Layanan Custom
          </Link>
          <Link href="/business" className="btn btn-secondary">
            Kebutuhan Organisasi &amp; Bisnis
          </Link>
        </div>
      </section>

      {/* Operational Mode Reassurance Notice */}
      <section className="section" aria-label="Pemberitahuan Layanan">
        <NoticeBox
          variant="info"
          title="Fase CX-S0-A: Konsultasi Terpandu (Assisted Entry)"
        >
          <p>
            Sistem TeeStock saat ini memfasilitasi orientasi layanan dan
            konsultasi terpandu. Kami memastikan kelayakan bahan baku,
            spesifikasi aplikasi cetak, dan jadwal sebelum menerbitkan penawaran
            resmi. Formulir transaksi instan atau checkout mandiri belum
            diaktifkan pada fase ini.
          </p>
        </NoticeBox>
      </section>

      {/* Four Core Customer Jobs */}
      <section className="section" aria-labelledby="jobs-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Navigasi Kebutuhan</span>
          <h2 id="jobs-heading">Empat Fokus Utama Layanan</h2>
          <p>
            Struktur layanan kami dirancang berdasarkan kebutuhan nyata Anda,
            bukan kompleksitas organisasi internal.
          </p>
        </div>

        <div className="grid-2">
          {/* Card 1: Custom */}
          <div className="card">
            <div className="card-title">
              <h3>Custom Apparel</h3>
              <Badge variant="active">Aktif — Konsultasi</Badge>
            </div>
            <p className="card-body">
              Kustomisasi pakaian untuk kebutuhan personal, komunitas, dan label
              independen. Kami membantu pengecekan kesiapan file artwork,
              pilihan bahan katun berkualitas, dan opsi cetak yang tepat.
            </p>
            <Link href="/custom" className="card-link">
              Pelajari Layanan Custom &rarr;
            </Link>
          </div>

          {/* Card 2: For Business */}
          <div className="card">
            <div className="card-title">
              <h3>For Business</h3>
              <Badge variant="active">Aktif — B2B</Badge>
            </div>
            <p className="card-body">
              Pengadaan seragam kerja, merchandise kantor, dan apparel acara
              korporat. Fleksibilitas kuantiti, kejelasan spesifikasi produksi,
              dan pemenuhan dokumen administrasi pengadaan.
            </p>
            <Link href="/business" className="card-link">
              Pelajari Solusi Bisnis &rarr;
            </Link>
          </div>

          {/* Card 3: Shop */}
          <div className="card">
            <div className="card-title">
              <h3>Shop (Katalog Ritel)</h3>
              <Badge variant="unavailable">Belum Tersedia</Badge>
            </div>
            <p className="card-body">
              Katalog belanja langsung retail dan koleksi esensial sedang
              dipersiapkan. Transaksi belanja mandiri belum dibuka untuk publik
              guna menjaga kepastian suplai garmen.
            </p>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-ink-subtle)',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Informasional (Bukan Titik Pembelian)
            </span>
          </div>

          {/* Card 4: Build Merch */}
          <div className="card">
            <div className="card-title">
              <h3>Build Merch</h3>
              <Badge variant="unavailable">Pengembangan</Badge>
            </div>
            <p className="card-body">
              Dukungan produksi merchandise terintegrasi bagi kreator konten dan
              komunitas kreatif. Program kemitraan dan kuota kolaborasi akan
              dibuka secara bertahap.
            </p>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-ink-subtle)',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Program Kemitraan Mendatang
            </span>
          </div>
        </div>
      </section>

      {/* Process Preview: How It Works */}
      <section className="section" aria-labelledby="process-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Alur Kerja Sama</span>
          <h2 id="process-heading">Bagaimana Pemesanan Terpandu Berjalan</h2>
          <p>
            Empat tahapan terstruktur memastikan pesanan Anda diproses sesuai
            ekspektasi tanpa kejutan biaya atau spesifikasi.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <span className="step-number">01</span>
            <h3 className="step-title">Konsultasi Kebutuhan</h3>
            <p className="step-desc">
              Sampaikan jenis garmen, perkiraan jumlah (pcs), dan target waktu
              penggunaan yang Anda rencanakan.
            </p>
          </div>

          <div className="step-item">
            <span className="step-number">02</span>
            <h3 className="step-title">Tinjauan Kelayakan</h3>
            <p className="step-desc">
              Tim kami meninjau kesiapan file desain, ketersediaan bahan, serta
              kecocokan metode cetak secara teknis.
            </p>
          </div>

          <div className="step-item">
            <span className="step-number">03</span>
            <h3 className="step-title">Penawaran Resmi</h3>
            <p className="step-desc">
              Dokumen penawaran harga (quotation) mengikat dan detail
              spesifikasi disepakati bersama sebelum produksi.
            </p>
          </div>

          <div className="step-item">
            <span className="step-number">04</span>
            <h3 className="step-title">Produksi &amp; QC</h3>
            <p className="step-desc">
              Pesanan diproduksi dengan kontrol kualitas berkala dan pembaruan
              progres hingga paket siap dikirim.
            </p>
          </div>
        </div>
      </section>

      {/* Support & Contact Direction */}
      <section className="section" aria-labelledby="contact-heading">
        <div className="card" style={{ padding: '32px' }}>
          <span className="eyebrow">Bantuan &amp; Dukungan</span>
          <h2
            id="contact-heading"
            style={{ fontSize: '1.5rem', marginBottom: '12px' }}
          >
            Siap Mempersiapkan Kebutuhan Anda?
          </h2>
          <p style={{ maxWidth: '680px', marginBottom: '20px' }}>
            Pelajari panduan persiapan sebelum konsultasi dan ketahui status
            aktivasi saluran dukungan resmi kami. Kami menjaga transparansi
            proses agar Anda mendapatkan pelayanan yang akurat.
          </p>
          <div>
            <Link href="/support/contact" className="btn btn-secondary">
              Buka Informasi Bantuan &amp; Kontak &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
