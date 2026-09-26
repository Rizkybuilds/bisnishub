'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DemoDesignInput } from '@mgbos/validation';
import { saveDesign } from './actions';

const templates: DemoDesignInput[] = [
  {
    code: 'DEMO-STUDIO',
    title: 'Studio Hours',
    theme: 'CREATIVE',
    story: 'Eksplorasi tipografi kehidupan kreatif.',
    placement: 'FRONT',
  },
  {
    code: 'DEMO-PIXEL',
    title: 'Pixel Playground',
    theme: 'CREATIVE',
    story: 'Komposisi grid dan bentuk digital.',
    placement: 'BACK',
  },
  {
    code: 'DEMO-OFFLINE',
    title: 'Offline Mode',
    theme: 'CREATIVE',
    story: 'Ruang istirahat dari layar.',
    placement: 'FRONT',
  },
  {
    code: 'DEMO-BREW',
    title: 'Slow Brew',
    theme: 'COFFEE',
    story: 'Ritual seduh pagi.',
    placement: 'FRONT',
  },
  {
    code: 'DEMO-DAILY',
    title: 'Daily Dose',
    theme: 'COFFEE',
    story: 'Catatan kecil tentang kopi.',
    placement: 'BACK',
  },
  {
    code: 'DEMO-AFTER',
    title: 'After Hours',
    theme: 'COFFEE',
    story: 'Percakapan setelah kedai tutup.',
    placement: 'FRONT',
  },
  {
    code: 'DEMO-BLANK',
    title: 'Blank Essential',
    theme: 'BASIC',
    story: 'Contoh pendukung kaos polos; belum merupakan SKU stok.',
    placement: 'NONE',
  },
  {
    code: 'DEMO-CUSTOM',
    title: 'Community Atelier',
    theme: 'CUSTOM',
    story: 'Contoh brief komunitas fiktif.',
    placement: 'BACK',
  },
];
export function DesignForm({
  initial,
  assetId = null,
  expected = 0,
}: {
  initial?: DemoDesignInput;
  assetId?: string | null;
  expected?: number;
}) {
  const [data, setData] = useState<DemoDesignInput>(initial ?? templates[0]!);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<string | null>(null);
  const alert = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const update = (patch: Partial<DemoDesignInput>) => {
    setData({ ...data, ...patch });
    request.current = null;
  };
  return (
    <form
      className="requirement-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        request.current ??= crypto.randomUUID();
        try {
          const result = await saveDesign({
            requestId: request.current,
            assetId,
            expected,
            data,
          });
          if (result.id) {
            router.push('/designs/' + result.id);
            router.refresh();
          } else {
            setError(result.error ?? 'Gagal menyimpan.');
            requestAnimationFrame(() => alert.current?.focus());
          }
        } catch {
          setError('Sesi atau koneksi tidak tersedia. Muat ulang halaman.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <fieldset
        disabled={busy}
        style={{ border: 0, padding: 0, display: 'grid', gap: 16 }}
      >
        {!assetId && (
          <label>
            Isi dari template DEMO
            <select
              className="form-input"
              defaultValue="0"
              onChange={(e) => update(templates[Number(e.target.value)]!)}
            >
              {templates.map((t, i) => (
                <option value={i} key={t.code}>
                  {t.title} · {t.theme}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Kode DEMO
          <input
            className="form-input"
            value={data.code}
            readOnly={!!assetId}
            required
            maxLength={37}
            onChange={(e) => update({ code: e.target.value })}
          />
        </label>
        <label>
          Judul desain
          <input
            className="form-input"
            value={data.title}
            required
            minLength={2}
            maxLength={120}
            onChange={(e) => update({ title: e.target.value })}
          />
        </label>
        <label>
          Tema
          <select
            className="form-input"
            value={data.theme}
            onChange={(e) =>
              update({ theme: e.target.value as DemoDesignInput['theme'] })
            }
          >
            <option value="CREATIVE">Creative & digital</option>
            <option value="COFFEE">Coffee culture</option>
            <option value="BASIC">Polos</option>
            <option value="CUSTOM">Custom atelier</option>
          </select>
        </label>
        <label>
          Rencana placement
          <select
            className="form-input"
            value={data.placement}
            onChange={(e) =>
              update({
                placement: e.target.value as DemoDesignInput['placement'],
              })
            }
          >
            <option value="FRONT">Depan</option>
            <option value="BACK">Belakang</option>
            <option value="NONE">Tanpa cetak</option>
          </select>
        </label>
        <label>
          Cerita / brief
          <textarea
            className="form-input"
            value={data.story}
            rows={4}
            maxLength={2000}
            onChange={(e) => update({ story: e.target.value })}
          />
        </label>
        <p>
          Semua data adalah simulasi. Template mengisi formulir; klik simpan
          untuk menambahkannya ke library lokal.
        </p>
        <button className="btn-primary" type="submit">
          {busy
            ? 'Menyimpan…'
            : assetId
              ? 'Simpan revisi baru'
              : 'Simpan desain DEMO'}
        </button>
      </fieldset>
      {error && (
        <p ref={alert} tabIndex={-1} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
