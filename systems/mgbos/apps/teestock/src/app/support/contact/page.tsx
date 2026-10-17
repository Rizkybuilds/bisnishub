import type { Metadata } from 'next';
import Link from 'next/link';
import { NoticeBox } from '../../../components/NoticeBox';

export const metadata: Metadata = {
  title: 'Bantuan & Kontak',
  description:
    'Informasi bantuan, panduan persiapan konsultasi pesanan, dan status operasional saluran resmi TeeStock.',
};

export default function ContactPage() {
  return (
    <div className="container">
      {/* Header section */}
      <section className="section" aria-labelledby="contact-heading">
        <span className="eyebrow">TeeStock / Support &amp; Contact</span>
        <h1 id="contact-heading">
          Informasi Layanan, Bantuan, &amp; Saluran Resmi
        </h1>
        <p className="lead-text">
          Transparansi dan ketertiban adalah prioritas kami. Halaman ini
          menjelaskan status operasional saluran komunikasi resmi dan langkah
          persiapan sebelum mengajukan kebutuhan apparel Anda.
        </p>

        <div className="btn-group">
          <Link href="/custom" className="btn btn-secondary">
            Lihat Layanan Custom
          </Link>
          <Link href="/business" className="btn btn-secondary">
            Lihat Solusi Bisnis
          </Link>
          <Link href="/" className="btn btn-secondary">
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Honest Contact Activation Status (S0-A Public Activation Gate) */}
      <section className="section" aria-labelledby="status-heading">
        <h2
          id="status-heading"
          style={{ fontSize: '1.4rem', marginBottom: '16px' }}
        >
          Status Operasional Saluran Kontak
        </h2>

        <NoticeBox
          variant="warning"
          title="Status Aktivasi Saluran Langsung: Belum Dibuka untuk Publik"
        >
          <p style={{ marginBottom: '12px' }}>
            Saluran kontak daring langsung (seperti nomor WhatsApp layanan
            pelanggan, telepon kantor, atau email publik) saat ini{' '}
            <strong>belum diaktifkan</strong> pada repositori ini dan belum
            memiliki operator penanggung jawab yang diverifikasi secara
            operasional.
          </p>
          <p style={{ marginBottom: '12px' }}>
            Sesuai kebijakan integritas TeeStock, kami{' '}
            <strong>tidak menampilkan</strong> tombol inert, tautan pesan yang
            tidak diawasi, atau nomor kontak perkiraan. Seluruh komunikasi resmi
            akan dibuka secara terjadwal setelah penanggung jawab operasional
            diverifikasi oleh pemilik sistem (Owner).
          </p>
          <p
            style={{ fontSize: '0.875rem', color: 'var(--color-warning-text)' }}
          >
            Catatan Tata Kelola: Ini merupakan gerbang aktivasi publik
            (public-activation gate). Kandidat rilis S0-A ini menyajikan
            informasi faktual tanpa menyimulasikan saluran yang belum siap.
          </p>
        </NoticeBox>
      </section>

      {/* Pre-Consultation Preparation Checklist */}
      <section className="section" aria-labelledby="checklist-heading">
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow">Panduan Mandiri</span>
          <h2 id="checklist-heading">Daftar Persiapan Konsultasi</h2>
          <p>
            Sebelum menghubungi tim kami saat saluran dibuka, siapkan rincian
            berikut agar proses evaluasi kebutuhan Anda berjalan efektif:
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3 className="card-title">1. Spesifikasi Garmen &amp; Warna</h3>
            <p className="card-body">
              Tentukan jenis model pakaian yang diminati (kaos oblong, polo
              berkerah, hoodie, atau jaket) serta warna kain dasar yang
              diinginkan.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">2. Kuantiti Kebutuhan</h3>
            <p className="card-body">
              Perkiraan total jumlah unit pesanan (pcs). Jika sudah memiliki
              rincian sebaran ukuran (S, M, L, XL, XXL), cantumkan untuk akurasi
              HPP.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">3. File Desain &amp; Penempatan</h3>
            <p className="card-body">
              Periksa apakah Anda sudah memiliki file vektor/raster resolusi
              tinggi, atau membutuhkan arahan tata letak dari tim kami.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">4. Target Waktu &amp; Lokasi Kirim</h3>
            <p className="card-body">
              Kapan pakaian tersebut harus tiba di lokasi penggunaan (in-hand
              date) dan kota tujuan distribusi pengiriman.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section" aria-labelledby="faq-heading">
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow">Pertanyaan Umum</span>
          <h2 id="faq-heading">Frequently Asked Questions (FAQ)</h2>
          <p>
            Jawaban faktual seputar batasan layanan, alur tinjauan, dan komitmen
            operasional kami.
          </p>
        </div>

        <div className="card" style={{ padding: '0 24px' }}>
          <div className="faq-item">
            <h3 className="faq-question">
              Apakah pemesanan custom bisa dalam jumlah satuan?
            </h3>
            <p className="faq-answer">
              Layanan kustomisasi terpandu kami mengutamakan pesanan dengan
              volume terencana untuk menjaga efisiensi workshop dan mutu
              aplikasi cetak. Ketentuan kuota minimal akan diumumkan resmi saat
              saluran interaksi dibuka.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">
              Berapa lama estimasi pengerjaan produksi?
            </h3>
            <p className="faq-answer">
              Waktu pengerjaan bergantung pada ketersediaan bahan mentah di
              gudang, teknik aplikasi (DTF, sablon manual, atau bordir), serta
              antrean produksi aktif. Estimasi jadwal diberikan secara
              transparan pada dokumen penawaran resmi (quotation).
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">
              Apakah harga yang tertera di website sudah mengikat?
            </h3>
            <p className="faq-answer">
              Situs ini tidak menampilkan harga belanja langsung karena setiap
              proyek memiliki variabel teknis yang unik. Penawaran harga resmi
              yang mengikat hanya diterbitkan setelah tim kami meninjau
              spesifikasi garmen dan artwork Anda.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">
              Bagaimana jika file artwork saya belum berformat vektor?
            </h3>
            <p className="faq-answer">
              Anda tetap dapat berkonsultasi. Tim kami dapat memeriksa file
              gambar raster resolusi tinggi (min. 300 DPI) atau membantu
              mengidentifikasi apakah desain memerlukan penyesuaian teknis
              sebelum proses cetak dijalankan.
            </p>
          </div>

          <div className="faq-item" style={{ borderBottom: 'none' }}>
            <h3 className="faq-question">
              Apakah tersedia sampel sebelum produksi massal?
            </h3>
            <p className="faq-answer">
              Untuk pengadaan korporat atau pesanan dalam volume tertentu,
              prosedur pembuatan sampel (proofing) dapat disepakati bersama
              dalam klausul penawaran resmi sebelum batch penuh dikerjakan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
