'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MitraPage() {
  const [dailySales, setDailySales] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'kreator' | 'dropship'>('kreator');

  const monthlyPcs = dailySales * 30;
  // Margin per pcs: Rp 24.000
  const monthlyProfit = monthlyPcs * 24000;

  const waNumber =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    '6281200000000';
  const cleanNumber = waNumber.replace(/[^0-9]/g, '');

  const waMessage =
    `Halo Admin TeeStock, saya tertarik untuk mendaftar Program Kemitraan (${activeTab === 'kreator' ? 'Kreator Desain' : 'Reseller / Dropshipper'}).\n\n` +
    `Estimasi target penjualan saya: ${dailySales} pcs/hari (${monthlyPcs} pcs/bulan).\n` +
    `Mohon informasi panduan teknis dan alur pendaftarannya. Terima kasih!`;

  const waRegistrationUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="retail-wrap" style={{ paddingBlock: '40px 80px' }}>
      {/* Breadcrumb */}
      <nav className="retail-shop-crumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Program Mitra</span>
      </nav>

      {/* Header Hero */}
      <section className="retail-shop-hero" aria-labelledby="mitra-heading">
        <div>
          <span className="retail-overline">
            TEESTOCK PARTNERSHIP / CREATORS &amp; RESELLERS
          </span>
          <h1 id="mitra-heading">
            Bangun Bisnis Apparel <em>Tanpa Beban Modal.</em>
          </h1>
        </div>
        <p>
          TeeStock menghubungkan Kreator bertalenta dan Reseller aktif dengan
          fasilitas produksi Print-on-Demand (POD) berstandar industri. Kamu
          fokus pada karya dan penjualan—kami yang urus stok bahan, sablon DTF,
          packing, dan pengiriman.
        </p>
      </section>

      {/* Mode Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          margin: '24px 0 32px',
          borderBottom: '1px solid #dcd7ca',
          paddingBottom: 12,
        }}
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kreator'}
          onClick={() => setActiveTab('kreator')}
          className={`retail-promo-btn ${activeTab === 'kreator' ? '' : 'retail-action-quiet'}`}
          style={{
            background: activeTab === 'kreator' ? 'var(--retail-forest)' : '#eee9dd',
            color: activeTab === 'kreator' ? '#ffffff' : 'var(--retail-ink)',
            padding: '10px 20px',
            borderRadius: 6,
            fontWeight: 700,
          }}
        >
          🎨 Jalur Kreator (Collab Merch)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dropship'}
          onClick={() => setActiveTab('dropship')}
          className={`retail-promo-btn ${activeTab === 'dropship' ? '' : 'retail-action-quiet'}`}
          style={{
            background: activeTab === 'dropship' ? 'var(--retail-forest)' : '#eee9dd',
            color: activeTab === 'dropship' ? '#ffffff' : 'var(--retail-ink)',
            padding: '10px 20px',
            borderRadius: 6,
            fontWeight: 700,
          }}
        >
          📦 Jalur Reseller &amp; Dropshipper
        </button>
      </div>

      {/* Content for Selected Track */}
      {activeTab === 'kreator' && (
        <section
          aria-label="Detail Program Kreator"
          style={{
            background: '#ffffff',
            border: '1px solid #dcd7ca',
            borderRadius: 8,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span className="retail-badge-available">NOL MODAL AWAL</span>
              <h2 style={{ fontSize: 22, marginTop: 8 }}>
                Kreator &amp; Desainer Independen
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, color: '#636b64' }}>
                Bagi Hasil Royalti:
              </span>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'var(--retail-forest)',
                }}
              >
                Rp 24.000{' '}
                <span style={{ fontSize: 14, fontWeight: 500 }}>/ pcs</span>
              </div>
            </div>
          </div>

          <p style={{ margin: '16px 0', color: '#434c44', lineHeight: 1.6 }}>
            Kirimkan karya grafis terbaikmu. Tim pre-press kami yang
            berpengalaman lebih dari 7 tahun akan memastikan warna CMYK dan
            detail vektor tampil sempurna pada sablon DTF. Setiap kaos yang
            terjual memberikan royalti langsung tanpa perlu memikirkan stok atau
            pembayaran di depan.
          </p>

          <div style={{ margin: '16px 0' }}>
            <Link
              href="/creator"
              className="retail-text-link"
              style={{ fontWeight: 700 }}
            >
              Buka Portal Khusus Creator Hub &amp; Formulir Pengajuan Karya <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginTop: 20,
            }}
          >
            <div
              style={{
                background: '#f9f7f2',
                padding: 16,
                borderRadius: 6,
                border: '1px solid #e2ded4',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                1. Bebas Risiko Finansial
              </strong>
              <span style={{ fontSize: 13, color: '#555' }}>
                Tidak perlu modal beli kain gelondongan atau nyetok kaos jadi.
                Sistem POD mencetak hanya saat pesanan masuk.
              </span>
            </div>
            <div
              style={{
                background: '#f9f7f2',
                padding: 16,
                borderRadius: 6,
                border: '1px solid #e2ded4',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                2. Kualitas Terjamin 100%
              </strong>
              <span style={{ fontSize: 13, color: '#555' }}>
                Cotton Combed 24s premium lembut dan sablon tahan cuci. Kami
                tanggung jawab penuh jika ada komplain cacat cetak.
              </span>
            </div>
            <div
              style={{
                background: '#f9f7f2',
                padding: 16,
                borderRadius: 6,
                border: '1px solid #e2ded4',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                3. Transparansi Real-Time
              </strong>
              <span style={{ fontSize: 13, color: '#555' }}>
                Atribusi penjualan via kode link/kupon unik kreator tercatat
                otomatis di backend ERP kami.
              </span>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'dropship' && (
        <section
          aria-label="Detail Program Dropshipper"
          style={{
            background: '#ffffff',
            border: '1px solid #dcd7ca',
            borderRadius: 8,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span className="retail-badge-available">
                WHITE-LABEL RESELLER
              </span>
              <h2 style={{ fontSize: 22, marginTop: 8 }}>
                Jual Apparel dengan Nama Tokomu Sendiri
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, color: '#636b64' }}>
                Harga Modal Kemitraan:
              </span>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'var(--retail-forest)',
                }}
              >
                Rp 75.000{' '}
                <span style={{ fontSize: 14, fontWeight: 500 }}>/ pcs</span>
              </div>
            </div>
          </div>

          <p style={{ margin: '16px 0', color: '#434c44', lineHeight: 1.6 }}>
            Ingin jualan kaos streetwear di TikTok Shop, Shopee, atau Instagram
            tanpa punya mesin cetak? Dapatkan harga modal grosir Rp 75.000/pcs
            dengan kebebasan menentukan harga jual ke customermu (rekomendasi:
            Rp 99.000 – Rp 129.000). Paket dikirim dengan label pengirim tokomu.
          </p>

          <div style={{ margin: '16px 0' }}>
            <Link
              href="/reseller"
              className="retail-text-link"
              style={{ fontWeight: 700 }}
            >
              Buka Portal Khusus Reseller &amp; Formulir Onboarding White-Label <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginTop: 20,
            }}
          >
            <div
              style={{
                background: '#f9f7f2',
                padding: 16,
                borderRadius: 6,
                border: '1px solid #e2ded4',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                1. Pengiriman White-Label
              </strong>
              <span style={{ fontSize: 13, color: '#555' }}>
                Nama tokomu tertulis di resi ekspedisi (J&amp;T, SiCepat, JNE).
                Tidak ada stiker atau logo TeeStock di kemasan luar.
              </span>
            </div>
            <div
              style={{
                background: '#f9f7f2',
                padding: 16,
                borderRadius: 6,
                border: '1px solid #e2ded4',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                2. Bisa Dropship Satuan (1 Pcs)
              </strong>
              <span style={{ fontSize: 13, color: '#555' }}>
                Tidak ada batas minimum pesanan. Pesan 1 lembar tetap kami layani
                dan proses secara cepat.
              </span>
            </div>
            <div
              style={{
                background: '#f9f7f2',
                padding: 16,
                borderRadius: 6,
                border: '1px solid #e2ded4',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                3. Fleksibilitas Margin Penuh
              </strong>
              <span style={{ fontSize: 13, color: '#555' }}>
                Kamu bebas menentukan harga jual sendiri sesuai target pasar dan
                daya beli audiens tokomu.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Cuan Simulator */}
      <section
        style={{
          background: '#f5f1e8',
          border: '1px solid #d9d4c7',
          borderRadius: 8,
          padding: 24,
          marginBottom: 36,
        }}
        aria-labelledby="simulasi-heading"
      >
        <span className="retail-overline">SIMULASI KEUNTUNGAN BULANAN</span>
        <h2 id="simulasi-heading" style={{ fontSize: 20, margin: '8px 0 16px' }}>
          Hitung Potensi Penghasilan Kemitraanmu
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="sales-slider"
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Target Penjualan Harian: <strong>{dailySales} pcs / hari</strong> (
            {monthlyPcs} pcs / bulan)
          </label>
          <input
            id="sales-slider"
            type="range"
            min={1}
            max={50}
            value={dailySales}
            onChange={(e) => setDailySales(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--retail-forest)' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            padding: '16px 20px',
            borderRadius: 6,
            border: '1px solid #e0dad0',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontSize: 12, color: '#636b64', display: 'block' }}>
              Estimasi Keuntungan Bersih (Margin Rp 24.000/pcs):
            </span>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--retail-forest)',
              }}
            >
              Rp {monthlyProfit.toLocaleString('id-ID')}
              <span style={{ fontSize: 14, fontWeight: 500, color: '#636b64' }}>
                {' '}
                / bulan
              </span>
            </div>
          </div>
          {monthlyProfit >= 2500000 && (
            <div
              style={{
                background: '#eaf5ec',
                border: '1px solid #c2e2c8',
                padding: '6px 12px',
                borderRadius: 4,
                fontSize: 12,
                color: '#1e592f',
                fontWeight: 700,
              }}
            >
              🎯 Melampaui target transisi ekonomi mandiri (Rp 2.500.000/bln)!
            </div>
          )}
        </div>
      </section>

      {/* Registration CTA via WhatsApp */}
      <section
        style={{
          textAlign: 'center',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
          Siap Bergabung Bersama TeeStock?
        </h3>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
          Hubungi admin kemitraan kami via WhatsApp untuk mendapatkan formulir
          pendaftaran, template artwork mockup, dan katalog harga reseller.
        </p>
        <a
          href={waRegistrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="retail-whatsapp-cta"
          style={{ maxWidth: 380, margin: '0 auto' }}
        >
          <span>💬 Daftar Kemitraan via WhatsApp</span>
        </a>
      </section>
    </div>
  );
}
