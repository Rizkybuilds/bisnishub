'use client';

import Link from 'next/link';
import { useDemoCart } from '../../../features/demo-commerce';
import { formatIllustrativePrice } from '../../../data/products';
import { generateWhatsAppCartOrderUrl } from '../../../lib/whatsapp';

export default function DemoCartPage() {
  const { state, summary, updateQuantity, removeItem, clearCart } =
    useDemoCart();

  return (
    <div className="retail-demo-page">
      <div className="retail-wrap">
        <nav className="retail-pdp-crumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <Link href="/shop">The Edit</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Keranjang Simulasi</span>
        </nav>

        <header className="retail-demo-header">
          <span className="retail-overline">
            TEESTOCK SELECTS / DEMO COMMERCE
          </span>
          <h1 className="retail-demo-title">Keranjang Simulasi Retail</h1>
          <p className="retail-demo-tagline">
            Uji coba antarmuka reviu pilihan garmen sebelum tahap checkout.
          </p>
        </header>

        {/* Prominent Simulation Disclosure Banner */}
        <div
          className="retail-demo-banner"
          role="region"
          aria-label="Pemberitahuan Simulasi"
        >
          <div className="retail-demo-banner-head">
            <span className="retail-tag-simulation">SIMULASI FRONTEND</span>
            <strong>Pratinjau Alur Demo Keranjang Belanja</strong>
          </div>
          <p>
            Halaman ini merupakan simulasi interaksi antarmuka dalam memori
            browser Anda. Tidak ada data yang dikirim ke server backend, tidak
            ada reservasi stok, dan tidak ada pesanan komersial yang dibuat.
          </p>
          <p className="retail-demo-banner-note">
            <em>
              Catatan: Memuat ulang halaman (browser reload) akan mengatur ulang
              (reset) keranjang simulasi ini ke kondisi awal.
            </em>
          </p>
        </div>

        {summary.isEmpty ? (
          <div className="retail-demo-empty" role="status">
            <div className="retail-demo-empty-icon" aria-hidden="true">
              🛒
            </div>
            <h2>Keranjang simulasi Anda masih kosong</h2>
            <p>
              Pilih salah satu studi desain apparel pada katalog The Edit untuk
              menguji penambahan item ke dalam simulasi keranjang belanja ini.
            </p>
            <div className="retail-demo-empty-actions">
              <Link href="/shop" className="retail-btn-primary">
                Jelajahi The Edit Catalog <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="retail-demo-grid">
            {/* Line items list */}
            <section
              className="retail-demo-lines"
              aria-label="Daftar item keranjang simulasi"
            >
              <div className="retail-demo-lines-header">
                <h2>Item Terpilih ({summary.totalQuantity})</h2>
                <button
                  type="button"
                  className="retail-btn-clear"
                  onClick={clearCart}
                  aria-label="Kosongkan semua item dari keranjang simulasi"
                >
                  Kosongkan Keranjang
                </button>
              </div>

              <ul className="retail-demo-line-list">
                {state.lines.map((line) => {
                  const lineTotal = line.unitPriceIdr * line.quantity;
                  return (
                    <li key={line.id} className="retail-demo-line-item">
                      <div className={`retail-demo-thumb art-${line.palette}`}>
                        <span className="retail-thumb-text">
                          {line.colorTone === 'ink' ? 'DARK' : 'LIGHT'}
                        </span>
                      </div>
                      <div className="retail-demo-line-info">
                        <span className="retail-demo-line-series">
                          {line.series}
                        </span>
                        <h3 className="retail-demo-line-title">
                          <Link href={`/shop/${line.productSlug}`}>
                            {line.productTitle}
                          </Link>
                        </h3>
                        <div className="retail-demo-line-specs">
                          <span>
                            Warna: <strong>{line.colorName}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Ukuran: <strong>{line.size}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Treatment: <strong>{line.printToneName}</strong>
                          </span>
                        </div>
                        <div className="retail-demo-line-price">
                          {formatIllustrativePrice(line.unitPriceIdr)}{' '}
                          <small>(Simulasi UX)</small>
                        </div>
                      </div>

                      <div className="retail-demo-line-controls">
                        <div
                          className="retail-qty-stepper"
                          role="group"
                          aria-label={`Jumlah untuk ${line.productTitle}`}
                        >
                          <button
                            type="button"
                            className="retail-qty-btn"
                            disabled={line.quantity <= 1}
                            onClick={() =>
                              updateQuantity(line.id, line.quantity - 1)
                            }
                            aria-label={`Kurangi jumlah ${line.productTitle}`}
                          >
                            −
                          </button>
                          <span
                            className="retail-qty-value"
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className="retail-qty-btn"
                            disabled={line.quantity >= 10}
                            onClick={() =>
                              updateQuantity(line.id, line.quantity + 1)
                            }
                            aria-label={`Tambah jumlah ${line.productTitle}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="retail-demo-line-subtotal">
                          {formatIllustrativePrice(lineTotal)}
                        </div>

                        <button
                          type="button"
                          className="retail-btn-remove"
                          onClick={() => removeItem(line.id)}
                          aria-label={`Hapus ${line.productTitle} (${line.colorName}, ${line.size})`}
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="retail-demo-lines-footer">
                <Link href="/shop" className="retail-back-link">
                  <span aria-hidden="true">← </span>Tambah Desain Lain dari
                  Katalog
                </Link>
              </div>
            </section>

            {/* Subtotal & Proceed Summary */}
            <aside
              className="retail-demo-summary"
              aria-label="Ringkasan simulasi"
            >
              <div className="retail-summary-card">
                <h2 className="retail-summary-title">Ringkasan Simulasi</h2>
                <div className="retail-summary-row">
                  <span>Total Produk</span>
                  <span>{summary.totalQuantity} pcs</span>
                </div>
                <div className="retail-summary-row">
                  <span>Subtotal Simulasi</span>
                  <strong className="retail-summary-price">
                    {summary.formattedIllustrativeSubtotal}
                  </strong>
                </div>

                <div className="retail-summary-disclaimers">
                  <p>
                    <strong>Pajak &amp; Bea:</strong> Belum dihitung (tahap
                    simulasi).
                  </p>
                  <p>
                    <strong>Ongkos Kirim:</strong> Belum dihitung (menunggu
                    integrasi kurir logistik).
                  </p>
                  <p className="retail-summary-note">
                    Total di atas murni simulasi interaksi front-end dan bukan
                    tagihan pembayaran.
                  </p>
                </div>

                <div className="retail-summary-action">
                  <a
                    href={generateWhatsAppCartOrderUrl(state.lines)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retail-btn-whatsapp-order retail-btn-block"
                    style={{ marginBottom: '12px', textAlign: 'center' }}
                  >
                    <span className="retail-whatsapp-icon" aria-hidden="true">
                      💬
                    </span>
                    Pesan via WhatsApp Sekarang
                  </a>
                  <Link
                    href="/demo/checkout"
                    className="retail-btn-primary retail-btn-block"
                  >
                    Lanjut ke Simulasi Checkout{' '}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
