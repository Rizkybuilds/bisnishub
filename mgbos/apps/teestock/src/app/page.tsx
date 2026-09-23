import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <small>TEESTOCK</small>
      <h1>Ruang untuk ide berikutnya.</h1>
      <p>Aplikasi baru TeeStock sedang disiapkan.</p>
      <nav aria-label="Navigasi utama">
        <Link href="/custom-atelier">Custom Atelier</Link>
      </nav>
    </main>
  );
}
