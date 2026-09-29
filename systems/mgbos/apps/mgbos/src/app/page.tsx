import Link from 'next/link';
import { getSession } from '@/lib/session.server';

export default async function Home() {
  const session = await getSession();

  return (
    <main>
      <small>MGBOS / OPERATING SYSTEM</small>
      <h1>MultiGraph Business OS</h1>
      <p>
        Pusat Komando Operasional &amp; ERP Terpadu MultiGraph Group Holding
        (TeeStock, MultiGraph, NeoPack, Pack Point, Squeegee Studios).
      </p>

      {session ? (
        <div style={{ marginTop: '24px' }}>
          <p style={{ color: '#4ade80' }}>
            Sesi aktif terdeteksi: <strong>{session.user.name}</strong> (
            {session.role.code})
          </p>
          <nav aria-label="Navigasi utama">
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{ padding: '8px 16px' }}
            >
              Buka Command Center →
            </Link>
            <Link href="/health">Status Aplikasi</Link>
          </nav>
        </div>
      ) : (
        <div style={{ marginTop: '24px' }}>
          <p>
            Silakan masuk dengan akun Founder untuk mengakses modul operasional,
            sales pipeline, dan pencatatan kas.
          </p>
          <nav aria-label="Navigasi utama">
            <Link
              href="/login"
              className="btn-primary"
              style={{ padding: '8px 16px' }}
            >
              Masuk ke Command Center →
            </Link>
            <Link href="/health">Status Aplikasi</Link>
          </nav>
        </div>
      )}
    </main>
  );
}
