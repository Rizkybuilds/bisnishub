import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '../../components/Badge';
import { NoticeBox } from '../../components/NoticeBox';

export const metadata: Metadata = {
  title: 'Solusi Apparel Bisnis & B2B',
  description:
    'Pengadaan seragam, merchandise kantor, dan apparel event perusahaan dengan proses pengadaan formal dan standar kurasi material terencana.',
};

export default function BusinessPage() {
  return (
    <div className="container">
      {/* Header section */}
      <section className="section" aria-labelledby="business-heading">
        <span className="eyebrow">TeeStock / For Business</span>
        <h1 id="business-heading">
          Solusi Apparel Terstruktur untuk Organisasi, Event, dan Perusahaan.
        </h1>
        <p className="lead-text">
          Pengadaan seragam kerja, merchandise kantor, dan pakaian acara dengan
          standar garmen profesional, kejelasan spesifikasi teknis, dan
          koordinasi alur administrasi pengadaan.
        </p>

        <div className="btn-group">
          <Link href="/support/contact" className="btn btn-primary">
            Lihat Panduan &amp; Saluran Kontak
          </Link>
          <Link href="/" className="btn btn-secondary">
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Commercial Policy Notice */}
      <section className="section" aria-label="Ketentuan Komersial B2B">
        <NoticeBox
          variant="info"
          title="Prinsip Pengadaan B2B: Berdasarkan Peninjauan Kelayakan Nyata"
        >
          <p>
            TeeStock tidak menjanjikan harga flat otomatis atau kuota produksi
            instan tanpa review. Setiap pesanan korporat ditinjau berdasarkan
            volume bahan, teknik dekorasi, dan jadwal workshop untuk memberikan
            estimasi jadwal penyelesaian yang realistis. Tidak ada portal
            mandiri atau termin pembayaran tempo tanpa perjanjian kerja sama
            resmi (PKS).
          </p>
        </NoticeBox>
      </section>

      {/* Organization Use Cases */}
      <section className="section" aria-labelledby="cases-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Kategori Kebutuhan</span>
          <h2 id="cases-heading">Solusi untuk Berbagai Kebutuhan Organisasi</h2>
          <p>
            Pendekatan fleksibel yang disesuaikan dengan skala instansi,
            institusi pendidikan, hingga perusahaan rintisan dan korporat.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div className="card-title">
              <h3>Seragam &amp; Teamwear</h3>
              <Badge variant="active">B2B Core</Badge>
            </div>
            <p className="card-body">
              Polo bordir resmi, kemeja kerja lapangan, dan t-shirt kasual
              divisi dengan pilihan bahan katun yang nyaman, jahitan rapi, serta
              perhatian pada konsistensi warna antar batch produksi.
            </p>
          </div>

          <div className="card">
            <div className="card-title">
              <h3>Event &amp; Gathering Merch</h3>
              <Badge variant="active">Volume Proyek</Badge>
            </div>
            <p className="card-body">
              Kaos seragam acara, merchandise konferensi, dan kit festival
              dengan penjadwalan ketat dan pengemasan terkelola per ukuran atau
              divisi.
            </p>
          </div>

          <div className="card">
            <div className="card-title">
              <h3>Corporate Gift &amp; Kits</h3>
              <Badge variant="active">Onboarding</Badge>
            </div>
            <p className="card-body">
              Apparel premium (hoodie, jacket, tote bag kanvas) untuk paket
              selamat datang karyawan baru (welcome kit) atau cinderamata
              apresiasi rekanan bisnis.
            </p>
          </div>
        </div>
      </section>

      {/* Preparation Checklist for Business Buyers */}
      <section className="section" aria-labelledby="prep-heading">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Persiapan Pengadaan</span>
          <h2 id="prep-heading">Hal yang Perlu Disiapkan Sebelum Pengajuan</h2>
          <p>
            Informasi awal yang lengkap membantu tim kami memberikan analisis
            teknis dan estimasi penawaran secara lebih cepat.
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3 className="card-title">1. Spesifikasi Volume &amp; Jadwal</h3>
            <p className="card-body">
              Perkiraan kuantiti total (pcs) serta sebaran ukuran kasar jika
              sudah ada, serta target tanggal barang harus tiba di lokasi
              penggunaan (in-hand date).
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">2. Aset Brand &amp; Logo</h3>
            <p className="card-body">
              File logo resmi berformat vektor (PDF / AI / SVG) beserta kode
              warna brand (Pantone atau CMYK) jika memerlukan kecocokan warna
              presisi.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">3. Lokasi &amp; Titik Distribusi</h3>
            <p className="card-body">
              Kota atau alamat tujuan pengiriman barang, serta kebutuhan
              pengemasan khusus (misal: dipisah per cabang atau divisi
              penerima).
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">4. Kebutuhan Dokumen Finansial</h3>
            <p className="card-body">
              Kelengkapan administrasi yang dipersyaratkan oleh instansi Anda,
              seperti invoice resmi, kwitansi, surat perjanjian kerja (SPK),
              atau NPWP badan.
            </p>
          </div>
        </div>
      </section>

      {/* Next Action Box */}
      <section className="section" aria-labelledby="action-heading">
        <div className="card" style={{ padding: '32px' }}>
          <h2
            id="action-heading"
            style={{ fontSize: '1.4rem', marginBottom: '12px' }}
          >
            Konsultasikan Kebutuhan Organisasi Anda
          </h2>
          <p style={{ maxWidth: '680px', marginBottom: '20px' }}>
            Pelajari alur persiapan konsultasi dan periksa status verifikasi
            saluran resmi kami pada halaman Bantuan &amp; Kontak.
          </p>
          <div className="btn-group" style={{ marginTop: 0 }}>
            <Link href="/support/contact" className="btn btn-primary">
              Buka Informasi Bantuan &amp; Kontak
            </Link>
            <Link href="/custom" className="btn btn-secondary">
              Lihat Layanan Custom Personal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
