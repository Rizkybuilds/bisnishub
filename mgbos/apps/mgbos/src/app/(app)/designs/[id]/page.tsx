import Link from 'next/link';
import { notFound } from 'next/navigation';
import { designContext, readDesigns } from '../data';
import { DesignForm } from '../DesignForm';

export default async function DesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await designContext();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [row] = await readDesigns(ctx, id);
  if (!row) notFound();
  const versions = row.design_asset_versions.sort(
    (a, b) => b.version_number - a.version_number,
  );
  const current = versions.find(
    (v) => v.version_number === row.current_version,
  );
  if (!current) notFound();
  return (
    <div>
      <Link href="/designs">← Library Desain</Link>
      <h1>{current.title}</h1>
      <p>
        {row.code} · DEMO · DRAFT · Revisi {row.current_version}
      </p>
      <section className="card">
        <h2>Belum siap dijual</h2>
        <p>
          Ini metadata simulasi, bukan file artwork. Master, bukti hak, sampel
          produksi, varian, resep dan harga belum tersedia. Tidak ada publikasi
          ke toko live.
        </p>
      </section>
      <section className="card">
        <h2>Revisi metadata</h2>
        <DesignForm
          key={row.current_version}
          assetId={row.id}
          expected={row.current_version}
          initial={{
            code: row.code,
            title: current.title,
            theme: current.theme,
            story: current.story,
            placement: current.placement,
          }}
        />
      </section>
      <section className="card">
        <h2>Riwayat revisi</h2>
        <ol>
          {versions.map((v) => (
            <li key={v.version_number}>
              <h3>
                Revisi {v.version_number} · {v.title}
              </h3>
              <p>
                {v.theme} · {v.placement}
              </p>
              <p>{v.story || 'Tanpa cerita.'}</p>
              <p>
                <time dateTime={v.created_at}>
                  {new Date(v.created_at).toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta',
                  })}{' '}
                  WIB
                </time>{' '}
                · Aktor {v.created_by}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
