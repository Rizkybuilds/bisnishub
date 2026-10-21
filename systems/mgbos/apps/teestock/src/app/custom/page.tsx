import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '../../components/Badge';
import { NoticeBox } from '../../components/NoticeBox';

export const metadata: Metadata = {
  title: 'Layanan Custom Apparel',
  description:
    'Kustomisasi garmen berkualitas dengan peninjauan artwork transparan, pilihan bahan terkurasi, dan pendampingan manusia.',
};

export default function CustomPage() {
  return (
    <div className="container">
      {/* Header section */}
      <section className="section" aria-labelledby="custom-heading">
        <span className="eyebrow">TeeStock / Custom Apparel</span>
        <h1 id="custom-heading">
          Kustomisasi Apparel Berkualitas dengan Pendampingan Manusia.
        </h1>
        <p className="lead-text">
          Wujudkan kaos, sweater, dan pakaian dengan identitas Anda. Kami
          membantu Anda menavigasi pilihan bahan dan metode dekorasi tanpa beban
          teknis yang membingungkan.
        </p>

        <div className="btn-group">
          <Link href="/support/contact" className="btn btn-primary">
            Lihat Panduan Persiapan &amp; Kontak
          </Link>
          <Link href="/" className="btn btn-secondary">
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Reassurance Notice */}
      <section className="section" aria-label="Status Pemesanan Custom">
        <NoticeBox
          variant="info"
          title="Transparansi Proses: Tanpa Formulir Daring Otomatis"
        >
          <p>
            Untuk menghindari kesalahan teknis cetak atau salah pilih
            spesifikasi, TeeStock tidak menggunakan formulir pesanan instan
            tanpa verifikasi. Setiap proyek ditinjau oleh staf operasional untuk
            memastikan kesesuaian cetak, ketersediaan bahan, dan perkiraan
            jadwal yang realistis.
          </p>
        </NoticeBox>
      </section>

      {/* Supported Garment & Decoration Categories */}
      <section className="section" aria-labelledby="categories-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Pilihan Produk &amp; Teknik</span>
          <h2 id="categories-heading">Jenis Garmen &amp; Metode Dekorasi</h2>
          <p>
            Katalog garmen terkurasi dengan standar pola jahitan stabil dan
            kenyamanan pemakaian harian.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <h3 className="card-title">T-Shirt &amp; Kaos</h3>
            <p className="card-body">
              Pilihan Cotton Combed 24s/30s hingga Heavyweight Cotton 16s/20s
              dengan konstruksi leher rib kokoh dan pola Regular atau
              Boxy/Oversized.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Fleece &amp; Outerwear</h3>
            <p className="card-body">
              Hoodie pullover, crewneck sweatshirt, dan jaket resleting berbahan
              Cotton Fleece atau Baby Terry dengan gramasi tebal dan handfeel
              lembut.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Polo &amp; Kemeja</h3>
            <p className="card-body">
              Polo shirt CVC Pique dan kemeja kerja berbahan Cotton Drill yang
              rapi untuk identitas tim, seragam santai, atau merchandise
              komunitas.
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '24px' }}>
          <div className="card">
            <h3 className="card-title">DTF (Direct-to-Film)</h3>
            <p className="card-body">
              Teknologi cetak transfer resolusi tinggi untuk grafis full-color,
              gradasi rumit, dan desain visual dengan ketajaman detail yang
              jelas.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Sablon Manual Plastisol</h3>
            <p className="card-body">
              Pilihan ideal untuk grafis solid, warna tegas, dan volume produksi
              menengah hingga besar dengan karakter sablon klasik.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Bordir Komputer</h3>
            <p className="card-body">
              Aplikasi bordir presisi tinggi untuk logo dada, monogram, atau
              nama divisi pada polo, kemeja, dan jaket.
            </p>
          </div>
        </div>
      </section>

      {/* Artwork Readiness Guidance */}
      <section className="section" aria-labelledby="artwork-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Kesiapan Desain</span>
          <h2 id="artwork-heading">Panduan Kesiapan File Desain</h2>
          <p>
            Kami menerima pertanyaan Anda baik saat file sudah siap maupun saat
            masih berupa ide konsep.
          </p>
        </div>

        <div className="grid-2">
          <div
            className="card"
            style={{ borderLeft: '4px solid var(--color-signal)' }}
          >
            <div className="card-title">
              <h3>Sudah Memiliki Desain</h3>
              <Badge variant="active">Siap Cetak</Badge>
            </div>
            <p className="card-body">
              Jika Anda sudah memiliki file desain, siapkan format:
            </p>
            <ul
              style={{
                paddingLeft: '20px',
                color: 'var(--color-ink-muted)',
                fontSize: '0.925rem',
                marginBottom: '16px',
              }}
            >
              <li>
                Vektor: PDF, AI, atau SVG (font di-create outlines/convert to
                curve)
              </li>
              <li>
                Raster: PNG transparan dengan resolusi minimal 300 DPI pada
                ukuran asli
              </li>
              <li>
                Penempatan cetak yang diinginkan (dada kiri, depan tengah,
                punggung)
              </li>
            </ul>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-ink-subtle)',
                margin: 0,
              }}
            >
              Tim kami akan memverifikasi kesiapan teknis file sebelum proses
              produksi disepakati.
            </p>
          </div>

          <div
            className="card"
            style={{ borderLeft: '4px solid var(--color-neutral-400)' }}
          >
            <div className="card-title">
              <h3>Belum Memiliki Desain</h3>
              <Badge variant="unavailable">Perlu Konsultasi</Badge>
            </div>
            <p className="card-body">
              Anda tidak harus menjadi desainer untuk membuat pesanan custom.
              Cukup siapkan:
            </p>
            <ul
              style={{
                paddingLeft: '20px',
                color: 'var(--color-ink-muted)',
                fontSize: '0.925rem',
                marginBottom: '16px',
              }}
            >
              <li>Konsep ide, tulisan, atau pesan yang ingin dimuat</li>
              <li>Referensi visual atau contoh gaya yang disukai</li>
              <li>Rencana perkiraan warna kaos yang diinginkan</li>
            </ul>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-ink-subtle)',
                margin: 0,
              }}
            >
              Kami membantu mendiskusikan kelayakan tata letak dan penyesuaian
              produksi.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent 3-Step Milestone */}
      <section className="section" aria-labelledby="milestone-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Transparansi Komitmen</span>
          <h2 id="milestone-heading">Tiga Tonggak Tinjauan yang Jelas</h2>
          <p>
            Kami memisahkan antara pengajuan pertanyaan awal, tinjauan teknis,
            dan kesepakatan resmi agar Anda selalu memiliki kendali penuh.
          </p>
        </div>

        <div
          className="steps-container"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          <div className="step-item">
            <span className="step-number">A</span>
            <h3 className="step-title">1. Pertanyaan Dicatat</h3>
            <p className="step-desc">
              Kebutuhan garmen, jumlah, dan rencana penggunaan dicatat oleh tim
              untuk dipelajari. Ini belum merupakan pesanan aktif.
            </p>
          </div>

          <div className="step-item">
            <span className="step-number">B</span>
            <h3 className="step-title">2. Tinjauan Kelayakan</h3>
            <p className="step-desc">
              Tim produksi memeriksa ketersediaan bahan mentah, tingkat
              kerumitan sablon/bordir, dan jadwal antrean workshop.
            </p>
          </div>

          <div className="step-item">
            <span className="step-number">C</span>
            <h3 className="step-title">3. Penawaran Mengikat</h3>
            <p className="step-desc">
              Setelah spesifikasi disepakati, penawaran resmi (quotation)
              diterbitkan. Produksi hanya berjalan setelah ada persetujuan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Next Step Callout */}
      <section className="section" aria-labelledby="cta-heading">
        <div className="card" style={{ padding: '32px' }}>
          <h2
            id="cta-heading"
            style={{ fontSize: '1.4rem', marginBottom: '12px' }}
          >
            Langkah Selanjutnya
          </h2>
          <p style={{ maxWidth: '640px', marginBottom: '20px' }}>
            Ketahui panduan persiapan konsultasi dan status verifikasi saluran
            bantuan resmi kami pada halaman Bantuan &amp; Kontak.
          </p>
          <div className="btn-group" style={{ marginTop: 0 }}>
            <Link href="/support/contact" className="btn btn-primary">
              Buka Halaman Bantuan &amp; Kontak
            </Link>
            <Link href="/business" className="btn btn-secondary">
              Lihat Solusi Korporat (B2B)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
