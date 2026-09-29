import Link from 'next/link';
import { designContext, readDesigns } from './data';
import { DesignForm } from './DesignForm';

export default async function DesignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; theme?: string }>;
}) {
  const ctx = await designContext();
  const params = await searchParams;
  const rows = await readDesigns(ctx);
  const q = (typeof params.q === 'string' ? params.q : '').slice(0, 120);
  const theme = typeof params.theme === 'string' ? params.theme : '';
  const filtered = rows.slice(0, 200).filter((row) => {
    const version = row.design_asset_versions.find(
      (v) => v.version_number === row.current_version,
    );
    return (
      version &&
      (!theme || version.theme === theme) &&
      (row.code + ' ' + version.title).toLowerCase().includes(q.toLowerCase())
    );
  });
  return (
    <div>
      <h1>Library Desain TeeStock</h1>
      <p>
        DEMO · Eksplorasi curated, polos dan custom. Belum siap untuk penjualan
        atau publikasi.
      </p>
      <form className="requirement-form" method="get">
        <label>
          Cari judul atau kode
          <input
            className="form-input"
            name="q"
            defaultValue={q}
            maxLength={120}
          />
        </label>
        <label>
          Tema
          <select className="form-input" name="theme" defaultValue={theme}>
            <option value="">Semua tema</option>
            <option value="CREATIVE">Creative & digital</option>
            <option value="COFFEE">Coffee culture</option>
            <option value="BASIC">Polos</option>
            <option value="CUSTOM">Custom atelier</option>
          </select>
        </label>
        <button className="btn-secondary">Cari desain</button>
        <Link href="/designs">Reset pencarian</Link>
      </form>
      {rows.length > 200 && (
        <p role="status">
          Menampilkan 200 desain terbaru. Pencarian terbatas pada daftar ini.
        </p>
      )}
      <section
        aria-label="Daftar desain"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
          gap: 16,
          margin: '24px 0',
        }}
      >
        {filtered.map((row) => {
          const v = row.design_asset_versions.find(
            (v) => v.version_number === row.current_version,
          )!;
          return (
            <article className="card" key={row.id}>
              <p>DEMO · {v.theme} · DRAFT</p>
              <h2>
                <Link href={'/designs/' + row.id}>{v.title}</Link>
              </h2>
              <p>
                {row.code} · Revisi {row.current_version}
              </p>
              <p>{v.story}</p>
              <p>Master, hak penggunaan, dan sampel belum diverifikasi.</p>
            </article>
          );
        })}
        {!filtered.length && (
          <p>
            {rows.length
              ? 'Tidak ada desain yang sesuai pencarian.'
              : 'Library masih kosong. Pilih template atau tulis ide pertama di bawah.'}
          </p>
        )}
      </section>
      <section className="card">
        <h2>Tambah desain DEMO</h2>
        <DesignForm />
      </section>
    </div>
  );
}
