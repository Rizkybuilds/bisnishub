import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <small>MGBOS / FOUNDATION</small>
      <h1>MultiGraph Business OS</h1>
      <p>
        Fondasi aplikasi siap dikembangkan. Belum ada data bisnis yang
        terhubung.
      </p>
      <p>
        Modul organisasi dan akses pengguna akan tersedia pada tahap berikutnya.
      </p>
      <nav aria-label="Navigasi utama">
        <Link href="/health">Status aplikasi</Link>
      </nav>
    </main>
  );
}
