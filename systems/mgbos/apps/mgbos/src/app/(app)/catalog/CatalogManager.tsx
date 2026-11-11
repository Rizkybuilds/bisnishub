'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type {
  CatalogProductInput,
  CatalogVariantInput,
} from '@mgbos/validation';
import { emptyCatalogProductDetails } from '@mgbos/validation';
import type { CatalogProductRow } from './data';
import { saveCatalogProductAction, uploadCatalogAssetAction } from './actions';

type Editor = CatalogProductInput;
const blankVariant = (): CatalogVariantInput => ({
  sku: '',
  size: 'L',
  color: 'Black',
  priceIdr: 0,
  costIdr: 0,
});
const emptyEditor = (): Editor => ({
  id: null,
  expectedVersion: 0,
  slug: '',
  title: '',
  collectionName: 'TeeStock Selects',
  description: '',
  details: { ...emptyCatalogProductDetails, sizeChart: [] },
  mockupPath: null,
  artworkPath: null,
  rightsStatus: 'PENDING',
  sampleStatus: 'PENDING',
  status: 'DRAFT',
  variants: [blankVariant()],
});
const fromRow = (row: CatalogProductRow): Editor => ({
  id: row.id,
  expectedVersion: row.version,
  slug: row.slug,
  title: row.title,
  collectionName: row.collection_name,
  description: row.description,
  details: {
    ...emptyCatalogProductDetails,
    ...row.details,
    sizeChart: row.details?.sizeChart ?? [],
  },
  mockupPath: row.mockup_path,
  artworkPath: row.artwork_path,
  rightsStatus: row.rights_status,
  sampleStatus: row.sample_status,
  status: row.status,
  variants: row.variants,
});

const formatIdr = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

export function CatalogManager({
  products,
  storageBase,
}: {
  products: CatalogProductRow[];
  storageBase: string;
}) {
  const router = useRouter();
  const [editor, setEditor] = useState<Editor>(emptyEditor);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<'mockup' | 'artwork' | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const update = <K extends keyof Editor>(field: K, value: Editor[K]) =>
    setEditor((previous) => ({ ...previous, [field]: value }));
  const updateVariant = (
    index: number,
    field: keyof CatalogVariantInput,
    value: string | number,
  ) => {
    setEditor((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    }));
  };
  const updateDetail = <K extends keyof Editor['details']>(
    field: K,
    value: Editor['details'][K],
  ) =>
    setEditor((previous) => ({
      ...previous,
      details: { ...previous.details, [field]: value },
    }));
  const updateMeasurement = (
    size: CatalogVariantInput['size'],
    field: 'widthCm' | 'lengthCm',
    value: number,
  ) =>
    setEditor((previous) => {
      const original = previous.details.sizeChart.find(
        (row) => row.size === size,
      );
      const updated = {
        size,
        widthCm: 0,
        lengthCm: 0,
        ...original,
        [field]: value,
      };
      return {
        ...previous,
        details: {
          ...previous.details,
          sizeChart: [
            ...previous.details.sizeChart.filter((row) => row.size !== size),
            updated,
          ],
        },
      };
    });
  const offeredSizes = [
    ...new Set(editor.variants.map((variant) => variant.size)),
  ];

  const imageUrl = editor.mockupPath
    ? storageBase +
      '/storage/v1/object/public/teestock-mockups/' +
      editor.mockupPath
    : null;
  const ready =
    editor.rightsStatus === 'APPROVED' &&
    editor.sampleStatus === 'PASSED' &&
    !!editor.mockupPath &&
    !!editor.artworkPath &&
    editor.details.material.trim().length >= 3 &&
    editor.details.fit.trim().length >= 3 &&
    editor.details.care.trim().length >= 10 &&
    editor.details.productionDays >= 1 &&
    offeredSizes.every((size) => {
      const measurement = editor.details.sizeChart.find(
        (row) => row.size === size,
      );
      return (
        !!measurement && measurement.widthCm >= 20 && measurement.lengthCm >= 20
      );
    }) &&
    editor.variants.length > 0 &&
    editor.variants.every(
      (v) =>
        v.sku && v.priceIdr > 0 && v.costIdr > 0 && v.costIdr <= v.priceIdr,
    );

  const selectProduct = (row: CatalogProductRow) => {
    setEditor(fromRow(row));
    setError('');
    setNotice('');
  };
  const clearProduct = () => {
    setEditor(emptyEditor());
    setError('');
    setNotice('');
  };

  const upload = async (kind: 'mockup' | 'artwork', file?: File) => {
    if (!file) return;
    setError('');
    setNotice('');
    setUploading(kind);
    const form = new FormData();
    form.set('kind', kind);
    form.set('file', file);
    try {
      const result = await uploadCatalogAssetAction(form);
      if (!result.path) {
        setError(result.error ?? 'Upload gagal.');
      } else {
        update(kind === 'mockup' ? 'mockupPath' : 'artworkPath', result.path);
        setNotice(
          kind === 'mockup'
            ? 'Foto mockup berhasil diunggah.'
            : 'Artwork privat berhasil diunggah.',
        );
      }
    } catch {
      setError('Upload gagal. Coba lagi.');
    } finally {
      setUploading(null);
    }
  };
  const save = async (nextStatus: Editor['status']) => {
    if (busy || uploading) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await saveCatalogProductAction({
        ...editor,
        status: nextStatus,
      });
      if (!result.id || !result.version) {
        setError(result.error ?? 'Gagal menyimpan produk.');
      } else {
        setEditor((previous) => ({
          ...previous,
          id: result.id ?? null,
          expectedVersion: result.version ?? previous.expectedVersion,
          status: nextStatus,
        }));
        setNotice(
          nextStatus === 'PUBLISHED'
            ? 'Produk dipublikasikan. Katalog website akan membaca data terbaru.'
            : nextStatus === 'ARCHIVED'
              ? 'Produk diarsipkan.'
              : 'Draft tersimpan.',
        );
        router.refresh();
      }
    } catch {
      setError('Tidak dapat menyimpan. Periksa koneksi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ts-catalog">
      <div className="ts-catalog-head">
        <div>
          <p className="ts-kicker">TEESTOCK / COMMERCE</p>
          <h1>Product Catalog</h1>
          <p className="ts-muted">
            Dari draft studio menjadi koleksi nyata. Publikasi tidak
            mengaktifkan checkout.
          </p>
        </div>
        <button
          type="button"
          className="ts-button ts-button-dark"
          onClick={clearProduct}
        >
          + Produk baru
        </button>
      </div>

      <div className="ts-catalog-grid">
        <aside className="ts-catalog-list" aria-label="Daftar produk katalog">
          <div className="ts-catalog-list-head">
            <strong>Semua produk</strong>
            <span>{products.length} item</span>
          </div>
          {products.length === 0 ? (
            <p className="ts-muted ts-empty">
              Belum ada produk. Buat draft pertama di formulir.
            </p>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                type="button"
                className={
                  'ts-product-option' +
                  (editor.id === product.id ? ' is-selected' : '')
                }
                onClick={() => selectProduct(product)}
              >
                <span className="ts-product-option-title">{product.title}</span>
                <span className="ts-product-option-meta">
                  <span>{product.collection_name}</span>
                  <span
                    className={
                      'ts-status ts-status-' + product.status.toLowerCase()
                    }
                  >
                    {product.status === 'PUBLISHED'
                      ? 'Published'
                      : product.status === 'ARCHIVED'
                        ? 'Archived'
                        : 'Draft'}
                  </span>
                </span>
              </button>
            ))
          )}
        </aside>

        <section
          className="ts-catalog-editor"
          aria-labelledby="catalog-editor-title"
        >
          <div className="ts-editor-head">
            <div>
              <p className="ts-kicker">PRODUCT EDITOR</p>
              <h2 id="catalog-editor-title">
                {editor.id ? 'Edit produk' : 'Produk baru'}
              </h2>
            </div>
            <span className="ts-status">{editor.status}</span>
          </div>

          {error && (
            <p className="ts-message ts-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="ts-message ts-success" role="status">
              {notice}
            </p>
          )}

          <div className="ts-fields ts-fields-two">
            <label>
              Nama produk
              <input
                value={editor.title}
                maxLength={120}
                required
                onChange={(e) => update('title', e.target.value)}
                placeholder="Everyday Graphic Tee"
              />
            </label>
            <label>
              Slug URL
              <input
                value={editor.slug}
                maxLength={80}
                required
                onChange={(e) =>
                  update(
                    'slug',
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                  )
                }
                placeholder="everyday-graphic-tee"
              />
            </label>
          </div>
          <div className="ts-fields">
            <label>
              Collection
              <input
                value={editor.collectionName}
                maxLength={80}
                onChange={(e) => update('collectionName', e.target.value)}
              />
            </label>
            <label>
              Deskripsi dan detail produk
              <textarea
                rows={4}
                maxLength={3000}
                value={editor.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Story, bahan, spesifikasi dan estimasi produksi..."
              />
            </label>
          </div>

          <h3>01 / Visual & aset produksi</h3>
          <div className="ts-asset-grid">
            <label className="ts-asset-upload">
              <strong>Foto mockup publik</strong>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  width={340}
                  height={280}
                  unoptimized
                  alt="Mockup produk"
                />
              )}
              <span>
                {editor.mockupPath
                  ? 'Ganti foto'
                  : 'Unggah PNG, JPG, atau WebP (maks. 5 MB)'}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={!!uploading || busy}
                onChange={(e) => {
                  void upload('mockup', e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
              {uploading === 'mockup' && <em>Mengunggah...</em>}
            </label>
            <label className="ts-asset-upload">
              <strong>Artwork cetak privat</strong>
              <span className="ts-asset-icon" aria-hidden="true">
                ↥
              </span>
              <span>
                {editor.artworkPath
                  ? 'File cetak tersimpan — unggah untuk mengganti'
                  : 'Unggah artwork PNG/PDF (maks. 20 MB)'}
              </span>
              <input
                type="file"
                accept="image/png,application/pdf"
                disabled={!!uploading || busy}
                onChange={(e) => {
                  void upload('artwork', e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
              {uploading === 'artwork' && <em>Mengunggah...</em>}
              <small>File artwork tidak dipublikasikan di website.</small>
            </label>
          </div>

          <div className="ts-variant-head">
            <div>
              <h3>02 / Varian dan harga</h3>
              <p className="ts-muted">
                MTO (made-to-order). Stok fisik dikelola terpisah di Inventory.
              </p>
            </div>
            <button
              type="button"
              className="ts-button ts-button-light"
              disabled={editor.variants.length >= 40}
              onClick={() =>
                update('variants', [...editor.variants, blankVariant()])
              }
            >
              + Varian
            </button>
          </div>
          <div className="ts-variants">
            {editor.variants.map((variant, index) => (
              <div className="ts-variant" key={index}>
                <div className="ts-variant-top">
                  <strong>Varian {index + 1}</strong>
                  <button
                    type="button"
                    disabled={editor.variants.length === 1}
                    onClick={() =>
                      update(
                        'variants',
                        editor.variants.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Hapus
                  </button>
                </div>
                <div className="ts-variant-fields">
                  <label>
                    SKU
                    <input
                      value={variant.sku}
                      maxLength={40}
                      placeholder="TS-001-BLK-L"
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'sku',
                          e.target.value.toUpperCase(),
                        )
                      }
                    />
                  </label>
                  <label>
                    Ukuran
                    <select
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, 'size', e.target.value)
                      }
                    >
                      {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Warna
                    <input
                      value={variant.color}
                      maxLength={50}
                      onChange={(e) =>
                        updateVariant(index, 'color', e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Harga (Rp)
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={variant.priceIdr || ''}
                      onChange={(e) =>
                        updateVariant(index, 'priceIdr', Number(e.target.value))
                      }
                    />
                  </label>
                  <label>
                    HPP (Rp)
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={variant.costIdr || ''}
                      onChange={(e) =>
                        updateVariant(index, 'costIdr', Number(e.target.value))
                      }
                    />
                  </label>
                </div>
                {variant.priceIdr > 0 && (
                  <p className="ts-muted">
                    Margin kotor estimasi:{' '}
                    {formatIdr(variant.priceIdr - variant.costIdr)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <h3>03 / Spesifikasi produk dan panduan ukuran</h3>
          <p className="ts-muted">
            Isi berdasarkan sampel fisik yang sudah diperiksa, bukan asumsi.
            Ukuran dalam sentimeter; lebar dada diukur saat kaos dibentangkan.
          </p>
          <div className="ts-fields ts-fields-two ts-product-specs">
            <label>
              Material / komposisi kain
              <input
                value={editor.details.material}
                maxLength={160}
                placeholder="Contoh: 100% cotton combed 24s (setelah diverifikasi)"
                onChange={(event) =>
                  updateDetail('material', event.target.value)
                }
              />
            </label>
            <label>
              Fit / potongan
              <input
                value={editor.details.fit}
                maxLength={80}
                placeholder="Contoh: regular fit (hasil sampling)"
                onChange={(event) => updateDetail('fit', event.target.value)}
              />
            </label>
            <label>
              Estimasi produksi (hari kerja)
              <input
                type="number"
                min={0}
                max={45}
                step={1}
                value={editor.details.productionDays || ''}
                onChange={(event) =>
                  updateDetail('productionDays', Number(event.target.value))
                }
              />
            </label>
            <label>
              Petunjuk perawatan
              <textarea
                rows={3}
                maxLength={600}
                value={editor.details.care}
                placeholder="Tulis hanya instruksi yang telah diuji pada sampel"
                onChange={(event) => updateDetail('care', event.target.value)}
              />
            </label>
          </div>
          <div className="ts-size-chart-editor">
            <h3>Tabel ukuran (hasil pengukuran sampel)</h3>
            {offeredSizes.map((size) => {
              const current = editor.details.sizeChart.find(
                (row) => row.size === size,
              );
              return (
                <div className="ts-size-row" key={size}>
                  <strong>{size}</strong>
                  <label>
                    Lebar dada (cm)
                    <input
                      type="number"
                      min={20}
                      max={150}
                      step={0.5}
                      value={current?.widthCm || ''}
                      onChange={(event) =>
                        updateMeasurement(
                          size,
                          'widthCm',
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  <label>
                    Panjang badan (cm)
                    <input
                      type="number"
                      min={20}
                      max={150}
                      step={0.5}
                      value={current?.lengthCm || ''}
                      onChange={(event) =>
                        updateMeasurement(
                          size,
                          'lengthCm',
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <h3>04 / Kelayakan publikasi</h3>
          <div className="ts-fields ts-fields-two">
            <label>
              Hak komersial
              <select
                value={editor.rightsStatus}
                onChange={(e) =>
                  update(
                    'rightsStatus',
                    e.target.value as Editor['rightsStatus'],
                  )
                }
              >
                <option value="PENDING">Belum diverifikasi</option>
                <option value="APPROVED">Sudah diverifikasi</option>
              </select>
            </label>
            <label>
              Sampling & QC fisik
              <select
                value={editor.sampleStatus}
                onChange={(e) =>
                  update(
                    'sampleStatus',
                    e.target.value as Editor['sampleStatus'],
                  )
                }
              >
                <option value="PENDING">Belum lolos</option>
                <option value="PASSED">Lolos sampling</option>
              </select>
            </label>
          </div>
          <p className="ts-muted">
            Publikasi hanya menampilkan produk di katalog. Order dan QRIS akan
            diaktifkan pada fitur berikutnya.
          </p>

          <div className="ts-editor-actions">
            <button
              type="button"
              className="ts-button ts-button-light"
              disabled={busy || !!uploading}
              onClick={() => void save('DRAFT')}
            >
              {busy ? 'Menyimpan...' : 'Simpan draft'}
            </button>
            <button
              type="button"
              className="ts-button ts-button-dark"
              disabled={busy || !!uploading || !ready}
              title={
                ready
                  ? 'Publikasikan katalog'
                  : 'Lengkapi hak, sampel, aset, HPP, detail bahan dan tabel ukuran sebelum publikasi'
              }
              onClick={() => void save('PUBLISHED')}
            >
              Publikasikan produk
            </button>
            {editor.id && (
              <button
                type="button"
                className="ts-button ts-button-danger"
                disabled={busy || !!uploading}
                onClick={() => void save('ARCHIVED')}
              >
                Arsipkan
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
