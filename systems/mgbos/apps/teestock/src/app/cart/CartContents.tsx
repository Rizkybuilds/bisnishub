'use client';

import Link from 'next/link';
import { useLiveCart } from '../../components/LiveCartProvider';
import { cartLineKey } from '../../lib/live-cart';
import { formatProductPrice } from '../../lib/storefront-product';

export function CartContents() {
  const { lines, count, subtotal, loaded, setQuantity, remove } = useLiveCart();

  return (
    <div className="ts-cart-wrap">
      <div className="ts-checkout-heading">
        <span className="ts-public-kicker">TEESTOCK / YOUR EDIT</span>
        <h1>Keranjang.</h1>
        <p>Produk nyata yang kamu pilih, terpisah dari simulasi desain studio.</p>
      </div>
      {!loaded ? (
        <p className="ts-muted" role="status">Memuat keranjang…</p>
      ) : lines.length === 0 ? (
        <div className="ts-cart-empty">
          <h2>Keranjang masih kosong.</h2>
          <p>Jelajahi koleksi TeeStock untuk memilih desain dan ukuran.</p>
          <Link href="/shop" className="ts-cart-primary">Lihat koleksi ↗</Link>
        </div>
      ) : (
        <div className="ts-cart-layout">
          <section aria-label="Item keranjang" className="ts-cart-lines">
            <div className="ts-cart-lines-heading">
              <strong>{count} kaos</strong>
              <span>MADE TO ORDER</span>
            </div>
            {lines.map((line) => (
              <article className="ts-cart-line" key={cartLineKey(line)}>
                <div className="ts-cart-number">TS</div>
                <div className="ts-cart-line-body">
                  <Link href={'/shop/products/' + line.slug}>{line.productTitle}</Link>
                  <p>{line.color} / {line.size} · {line.sku}</p>
                  <strong>{formatProductPrice(line.priceIdr)}</strong>
                  <div className="ts-cart-line-controls">
                    <label>
                      Jumlah
                      <select
                        value={line.quantity}
                        onChange={(event) =>
                          setQuantity(cartLineKey(line), Number(event.target.value))
                        }
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" onClick={() => remove(cartLineKey(line))}>
                      Hapus
                    </button>
                  </div>
                </div>
                <strong className="ts-cart-line-total">
                  {formatProductPrice(line.priceIdr * line.quantity)}
                </strong>
              </article>
            ))}
          </section>
          <aside className="ts-cart-summary">
            <span className="ts-public-kicker">ORDER SUMMARY</span>
            <h2>Ringkasan.</h2>
            <div className="ts-cart-summary-row">
              <span>Subtotal ({count} kaos)</span>
              <strong>{formatProductPrice(subtotal)}</strong>
            </div>
            <div className="ts-cart-summary-row">
              <span>Pengambilan di workshop</span>
              <strong>Rp0</strong>
            </div>
            <div className="ts-cart-summary-total">
              <span>Estimasi total</span>
              <strong>{formatProductPrice(subtotal)}</strong>
            </div>
            <p>
              Harga dan ketersediaan divalidasi ulang saat checkout.
              Pengiriman kurir belum tersedia pada pilot ini.
            </p>
            <Link href="/checkout" className="ts-cart-primary">
              Lanjut ke data pesanan <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/shop" className="ts-cart-back">← Lanjut belanja</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
