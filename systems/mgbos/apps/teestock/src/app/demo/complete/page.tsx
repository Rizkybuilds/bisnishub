'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDemoCart } from '../../../features/demo-commerce';

export default function DemoCompletePage() {
  const router = useRouter();
  const { state, resetSimulation } = useDemoCart();

  const handleStartNewSimulation = () => {
    resetSimulation();
    router.push('/shop');
  };

  return (
    <div className="retail-demo-page">
      <div className="retail-wrap">
        <nav className="retail-pdp-crumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Simulasi Selesai</span>
        </nav>

        <div className="retail-complete-card">
          {state.isSimulationCompleted ? (
            <div className="retail-complete-content" role="status">
              <div className="retail-complete-badge" aria-hidden="true">
                ✓
              </div>
              <span className="retail-overline">
                TEESTOCK SELECTS / DEMO SELESAI
              </span>
              <h1 className="retail-complete-title">
                Simulasi Selesai — Tidak Ada Pesanan atau Pembayaran yang
                Dibuat.
              </h1>
              <p className="retail-complete-lead">
                Terima kasih telah mencoba simulasi alur pemilihan apparel,
                keranjang, dan pratinjau checkout retail TeeStock Selects.
              </p>

              <div className="retail-complete-facts-card">
                <h3>Kepastian Batasan Non-Transaksional:</h3>
                <ul className="retail-complete-facts-list">
                  <li>
                    <strong>Tanpa Penarikan Dana:</strong> Tidak ada tagihan,
                    rekening virtual, atau transaksi finansial apa pun yang
                    dijalankan.
                  </li>
                  <li>
                    <strong>Tanpa Pesanan Komersial:</strong> Tidak ada nomor
                    order atau pengiriman fisik yang diterbitkan ke workshop
                    produksi.
                  </li>
                  <li>
                    <strong>Murni Pengujian UX:</strong> Data pilihan keranjang
                    hanya disimpan dalam memori browser untuk menguji antarmuka
                    dan kenyamanan pengguna.
                  </li>
                </ul>
              </div>

              <div className="retail-complete-actions">
                <button
                  type="button"
                  className="retail-btn-primary"
                  onClick={handleStartNewSimulation}
                >
                  Mulai Uji Simulasi Baru <span aria-hidden="true">↺</span>
                </button>
                <Link href="/" className="retail-btn-secondary">
                  Kembali ke Beranda <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="retail-complete-empty" role="status">
              <div className="retail-demo-empty-icon" aria-hidden="true">
                ℹ️
              </div>
              <h2>Belum Ada Simulasi yang Diselesaikan</h2>
              <p>
                Halaman ini hanya menampilkan hasil akhir setelah Anda
                menyelesaikan alur pada tahap simulasi checkout.
              </p>
              <div className="retail-complete-actions">
                <Link href="/shop" className="retail-btn-primary">
                  Jelajahi The Edit Catalog <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
