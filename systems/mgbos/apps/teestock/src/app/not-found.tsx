import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="container"
      style={{ padding: '48px 20px', textAlign: 'center' }}
    >
      <span className="eyebrow">Status 404 / Navigasi</span>
      <h1 style={{ marginBottom: '16px' }}>Halaman Tidak Ditemukan</h1>
      <p
        className="lead-text"
        style={{ margin: '0 auto 32px', maxWidth: '580px' }}
      >
        Alamat yang Anda tuju mungkin salah ketik, telah diperbarui, atau belum
        tersedia pada rilis informasi saat ini. Silakan gunakan navigasi berikut
        untuk melanjutkan:
      </p>

      <div className="btn-group" style={{ justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">
          Kembali ke Beranda
        </Link>
        <Link href="/custom" className="btn btn-secondary">
          Layanan Custom
        </Link>
        <Link href="/business" className="btn btn-secondary">
          Solusi Bisnis (B2B)
        </Link>
        <Link href="/support/contact" className="btn btn-secondary">
          Bantuan &amp; Kontak
        </Link>
      </div>
    </div>
  );
}
