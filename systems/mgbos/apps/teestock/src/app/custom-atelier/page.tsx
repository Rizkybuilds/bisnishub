import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '../../components/Badge';
import { NoticeBox } from '../../components/NoticeBox';

export const metadata: Metadata = {
  title: 'Custom Atelier (TeeStock Custom)',
  description:
    'Halaman deep-link Custom Atelier TeeStock. Akses informasi kustomisasi pakaian, tinjauan artwork, dan alur konsultasi.',
};

export default function CustomAtelierPage() {
  return (
    <div className="container">
      {/* Deep Link Backward-Compatibility Banner */}
      <section
        className="section"
        style={{ marginBottom: '32px' }}
        aria-label="Pemberitahuan Navigasi"
      >
        <NoticeBox
          variant="info"
          title="Tautan Terpelihara: Custom Atelier kini menjadi bagian dari TeeStock Custom"
        >
          <p>
            Alamat URL <code>/custom-atelier</code> dipertahankan untuk
            memastikan tautan lama dan penanda peramban tetap berfungsi. Seluruh
            informasi kustomisasi pakaian terpadu kini dikelola melalui{' '}
            <Link href="/custom">Halaman Layanan Custom (/custom)</Link>.
          </p>
        </NoticeBox>
      </section>

      {/* Main Content */}
      <section className="section" aria-labelledby="atelier-heading">
        <span className="eyebrow">TeeStock / Custom Atelier</span>
        <h1 id="atelier-heading">Kustomisasi Garmen Berstandar Tinggi</h1>
        <p className="lead-text">
          Layanan Custom Atelier menghadirkan pengerjaan pakaian pesanan khusus
          dengan pilihan bahan katun combed hingga heavyweight, peninjauan
          artwork yang teliti, dan konsultasi manusia langsung.
        </p>

        <div className="btn-group">
          <Link href="/custom" className="btn btn-primary">
            Buka Halaman Custom Lengkap &rarr;
          </Link>
          <Link href="/support/contact" className="btn btn-secondary">
            Informasi Bantuan &amp; Kontak
          </Link>
          <Link href="/" className="btn btn-secondary">
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="section" aria-labelledby="highlights-heading">
        <div style={{ marginBottom: '24px' }}>
          <span className="eyebrow">Ikhtisar Layanan</span>
          <h2 id="highlights-heading">Poin Kunci Layanan Custom</h2>
        </div>

        <div className="grid-3">
          <div className="card">
            <div className="card-title">
              <h3>Bahan Terkurasi</h3>
              <Badge variant="active">Standar Mutu</Badge>
            </div>
            <p className="card-body">
              Pilihan katun combed 24s/30s hingga heavyweight 16s/20s dengan
              konstruksi jahitan rapi dan ketahanan cuci tinggi.
            </p>
          </div>

          <div className="card">
            <div className="card-title">
              <h3>Tinjauan Desain</h3>
              <Badge variant="active">Pra-Cetak</Badge>
            </div>
            <p className="card-body">
              Pengecekan resolusi, pemisahan warna, dan kesesuaian posisi
              sebelum produksi dijalankan tanpa biaya peninjauan awal.
            </p>
          </div>

          <div className="card">
            <div className="card-title">
              <h3>Alur Transparan</h3>
              <Badge variant="active">Assisted</Badge>
            </div>
            <p className="card-body">
              Tidak ada tagihan mendadak. Penawaran harga mengikat disepakati
              bersama sebelum proses produksi di workshop dimulai.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
