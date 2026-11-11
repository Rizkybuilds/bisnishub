'use client';

import { useState } from 'react';
import {
  availableColors,
  availableSizes,
  formatProductPrice,
  getVariant,
  SIZE_ORDER,
} from '../lib/storefront-product';
import type {
  StorefrontProduct,
  StorefrontSize,
} from '../lib/storefront-product';

export function PublishedProductOptions({
  product,
}: {
  product: StorefrontProduct;
}) {
  const variants = product.variants;
  const colors = availableColors(variants);
  const sizes = availableSizes(variants);
  const [color, setColor] = useState(colors[0] ?? '');
  const [size, setSize] = useState<StorefrontSize>(
    variants.find((variant) => variant.color === colors[0])?.size ?? 'L',
  );

  const selected = getVariant(variants, color, size);
  const availableForColor = SIZE_ORDER.filter((candidate) =>
    variants.some(
      (variant) => variant.color === color && variant.size === candidate,
    ),
  );

  const chooseColor = (next: string) => {
    setColor(next);
    if (!getVariant(variants, next, size)) {
      const first = variants.find((variant) => variant.color === next);
      if (first) setSize(first.size);
    }
  };

  return (
    <div className="ts-pdp-options">
      <p className="ts-pdp-overline">PRODUK TERKURASI / MADE TO ORDER</p>
      <h1>{product.title}</h1>
      <p className="ts-pdp-price" aria-live="polite">
        {selected ? formatProductPrice(selected.priceIdr) : 'Pilih varian'}
      </p>
      <p className="ts-pdp-subtitle">
        Harga produk, belum termasuk ongkos kirim. Pembayaran online belum
        dibuka.
      </p>

      <div className="ts-pdp-selectors" aria-label="Pilihan varian produk">
        <fieldset className="ts-pdp-choice-group">
          <legend>
            Warna <span>{color}</span>
          </legend>
          <div className="ts-pdp-choice-list">
            {colors.map((option) => (
              <button
                type="button"
                key={option}
                className={
                  'ts-pdp-choice' + (color === option ? ' is-active' : '')
                }
                aria-pressed={color === option}
                onClick={() => chooseColor(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="ts-pdp-choice-group">
          <legend>
            Ukuran <span>{size}</span>
          </legend>
          <div className="ts-pdp-choice-list">
            {sizes.map((option) => {
              const exists = availableForColor.includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  className={
                    'ts-pdp-choice ts-pdp-choice-size' +
                    (size === option ? ' is-active' : '')
                  }
                  aria-pressed={size === option}
                  disabled={!exists}
                  title={
                    !exists
                      ? 'Kombinasi ukuran dan warna ini belum tersedia dalam katalog'
                      : undefined
                  }
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
        <p className="ts-pdp-sku">
          SKU varian: <strong>{selected?.sku ?? 'Belum dipilih'}</strong>
        </p>
      </div>

      <div className="ts-pdp-not-for-sale" role="status">
        <strong>Checkout belum tersedia</strong>
        <p>
          Detail dan harga produk ini berasal dari katalog TeeStock yang telah
          diverifikasi. Fitur pesanan dan pembayaran QRIS manual sedang
          dipersiapkan. Halaman ini belum menerima pembelian atau pembayaran.
        </p>
      </div>

      <div className="ts-pdp-details">
        <h2>Detail produk</h2>
        <dl>
          <div>
            <dt>Bahan</dt>
            <dd>{product.details.material}</dd>
          </div>
          <div>
            <dt>Potongan</dt>
            <dd>{product.details.fit}</dd>
          </div>
          <div>
            <dt>Metode produksi</dt>
            <dd>Made-to-order · DTF transfer</dd>
          </div>
          <div>
            <dt>Estimasi produksi</dt>
            <dd>
              {product.details.productionDays} hari kerja setelah pembayaran
              dikonfirmasi manual
            </dd>
          </div>
        </dl>
        <p className="ts-pdp-fineprint">
          Estimasi produksi bukan estimasi pengiriman. Hasil akhir dapat sedikit
          berbeda dari foto mockup karena pencahayaan dan proses produksi.
        </p>
      </div>

      <section
        className="ts-pdp-size-section"
        aria-labelledby="ts-pdp-size-title"
      >
        <div className="ts-pdp-section-heading">
          <h2 id="ts-pdp-size-title">Panduan ukuran</h2>
          <span>cm / diukur saat kaos dibentangkan</span>
        </div>
        <div className="ts-pdp-table-wrap">
          <table className="ts-pdp-size-table">
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Lebar dada</th>
                <th scope="col">Panjang badan</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ORDER.filter((candidate) =>
                product.details.sizeChart.some((row) => row.size === candidate),
              ).map((candidate) => {
                const measurement = product.details.sizeChart.find(
                  (row) => row.size === candidate,
                );
                return measurement ? (
                  <tr
                    key={candidate}
                    className={candidate === size ? 'is-selected' : ''}
                  >
                    <th scope="row">{candidate}</th>
                    <td>{measurement.widthCm}</td>
                    <td>{measurement.lengthCm}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
        <p className="ts-pdp-fineprint">
          Gunakan ukuran sentimeter sebagai acuan, bukan hanya label size.
          Toleransi produksi tidak ditetapkan hingga diverifikasi.
        </p>
      </section>

      <section
        className="ts-pdp-care-section"
        aria-labelledby="ts-pdp-care-title"
      >
        <h2 id="ts-pdp-care-title">Perawatan</h2>
        <p>{product.details.care}</p>
      </section>
    </div>
  );
}
