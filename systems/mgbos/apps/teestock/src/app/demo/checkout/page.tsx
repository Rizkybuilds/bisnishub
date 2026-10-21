'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDemoCart } from '../../../features/demo-commerce';
import { formatIllustrativePrice } from '../../../data/products';

export default function DemoCheckoutPage() {
  const router = useRouter();
  const { state, summary, completeSimulation } = useDemoCart();

  const handleFinishSimulation = () => {
    const success = completeSimulation();
    if (success) {
      router.push('/demo/complete');
    }
  };

  return (
    <div className="retail-demo-page">
      <div className="retail-wrap">
        <nav className="retail-pdp-crumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <Link href="/demo/cart">Keranjang Simulasi</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Simulasi Checkout</span>
        </nav>

        <header className="retail-demo-header">
          <span className="retail-overline">
            TEESTOCK SELECTS / DEMO COMMERCE
          </span>
          <h1 className="retail-demo-title">Reviu Simulasi Checkout</h1>
          <p className="retail-demo-tagline">
            Eksplorasi langkah reviu pesanan retail sebelum tahap produksi
            resmi.
          </p>
        </header>

        {/* Prominent Disclosure Banner */}
        <div
          className="retail-demo-banner"
          role="region"
          aria-label="Pemberitahuan Simulasi Checkout"
        >
          <div className="retail-demo-banner-head">
            <span className="retail-tag-simulation">SIMULASI DEMO</span>
            <strong>
              Ini simulasi checkout. Tidak ada pesanan atau pembayaran
              sungguhan.
            </strong>
          </div>
          <p>
            Halaman ini murni demonstrasi arsitektur reviu pesanan front-end.
            Kami sengaja tidak meminta nama, email, nomor HP, atau alamat
            pengiriman (tanpa pengumpulan data pribadi / PII).
          </p>
          <p className="retail-demo-banner-note">
            <em>
              Tidak ada pembayaran via QRIS, Virtual Account, kartu kredit, atau
              transfer bank. Mengklik tombol di bawah hanya menyelesaikan
              simulasi interaksi.
            </em>
          </p>
        </div>

        {summary.isEmpty ? (
          <div className="retail-demo-empty" role="status">
            <div className="retail-demo-empty-icon" aria-hidden="true">
              ⚠️
            </div>
            <h2>Tidak ada item untuk di-review</h2>
            <p>
              Keranjang simulasi Anda kosong. Silakan pilih produk dari katalog
              The Edit terlebih dahulu untuk melanjutkan simulasi checkout.
            </p>
            <div className="retail-demo-empty-actions">
              <Link href="/shop" className="retail-btn-primary">
                Kembali ke Katalog <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="retail-demo-grid">
            {/* Order Review List */}
            <section
              className="retail-demo-lines"
              aria-label="Reviu item pesanan simulasi"
            >
              <div className="retail-demo-lines-header">
                <h2>Reviu Produk ({summary.totalQuantity} pcs)</h2>
                <Link href="/demo/cart" className="retail-link-edit">
                  Ubah di Keranjang ✎
                </Link>
              </div>

              <ul className="retail-demo-review-list">
                {state.lines.map((line) => {
                  const lineTotal = line.unitPriceIdr * line.quantity;
                  return (
                    <li key={line.id} className="retail-demo-review-item">
                      <div className="retail-review-details">
                        <span className="retail-demo-line-series">
                          {line.series}
                        </span>
                        <h3 className="retail-review-title">
                          {line.productTitle}
                        </h3>
                        <p className="retail-review-meta">
                          Warna: <strong>{line.colorName}</strong> • Ukuran:{' '}
                          <strong>{line.size}</strong> • Karakter:{' '}
                          <strong>{line.printToneName}</strong>
                        </p>
                      </div>
                      <div className="retail-review-pricing">
                        <span className="retail-review-qty">
                          {line.quantity} ×{' '}
                          {formatIllustrativePrice(line.unitPriceIdr)}
                        </span>
                        <strong className="retail-review-total">
                          {formatIllustrativePrice(lineTotal)}
                        </strong>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="retail-review-status-card">
                <h3>Keterangan Parameter Komersial</h3>
                <div className="retail-spec-card">
                  <div className="retail-spec-row">
                    <span className="retail-spec-k">Status Pesanan</span>
                    <span className="retail-spec-v">
                      Simulasi Pengujian Front-End (Tidak Mengikat)
                    </span>
                  </div>
                  <div className="retail-spec-row">
                    <span className="retail-spec-k">Metode Pengiriman</span>
                    <span className="retail-spec-v">
                      Belum Dipilih (Menunggu Integrasi Logistik)
                    </span>
                  </div>
                  <div className="retail-spec-row">
                    <span className="retail-spec-k">Metode Pembayaran</span>
                    <span className="retail-spec-v">
                      Dinonaktifkan (Tahap Preview Katalog)
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Demo Action Sidebar */}
            <aside
              className="retail-demo-summary"
              aria-label="Konfirmasi simulasi"
            >
              <div className="retail-summary-card">
                <h2 className="retail-summary-title">Ringkasan Biaya</h2>
                <div className="retail-summary-row">
                  <span>Subtotal Ilustratif</span>
                  <span>{summary.formattedIllustrativeSubtotal}</span>
                </div>
                <div className="retail-summary-row">
                  <span>Biaya Pengiriman</span>
                  <span className="retail-tag-muted">Belum Dihitung</span>
                </div>
                <div className="retail-summary-row">
                  <span>Pajak (PPN)</span>
                  <span className="retail-tag-muted">Belum Dihitung</span>
                </div>
                <div className="retail-summary-row retail-summary-total-row">
                  <span>Estimasi Subtotal</span>
                  <strong className="retail-summary-price">
                    {summary.formattedIllustrativeSubtotal}
                  </strong>
                </div>

                <div className="retail-summary-disclaimers">
                  <p className="retail-summary-note">
                    Mengklik tombol di bawah ini hanya menyelesaikan pengujian
                    alur antarmuka demo. Tidak ada dana yang ditarik dan tidak
                    ada data yang disimpan.
                  </p>
                </div>

                <div className="retail-summary-action">
                  <button
                    type="button"
                    className="retail-btn-primary retail-btn-block"
                    onClick={handleFinishSimulation}
                  >
                    Selesaikan Simulasi Demo <span aria-hidden="true">✓</span>
                  </button>
                  <Link
                    href="/demo/cart"
                    className="retail-btn-secondary retail-btn-block"
                  >
                    ← Kembali ke Keranjang
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
