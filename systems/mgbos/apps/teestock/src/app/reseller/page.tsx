'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResellerPage() {
  const [dailySales, setDailySales] = useState<number>(5);
  const [sellPrice, setSellPrice] = useState<number>(99000);
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [channel, setChannel] = useState('TikTok Shop & Shopee');
  const [city, setCity] = useState('');

  const baseCost = 75000;
  const marginPerPcs = Math.max(0, sellPrice - baseCost);
  const monthlyPcs = dailySales * 30;
  const monthlyProfit = monthlyPcs * marginPerPcs;

  const waNumber =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    '6281200000000';
  const cleanNumber = waNumber.replace(/[^0-9]/g, '');

  const waOnboardingMessage =
    `Halo Tim Kemitraan TeeStock, saya ingin mendaftar Program Reseller / White-Label Dropship:\n\n` +
    `• Nama Toko: ${storeName.trim() || '-'}\n` +
    `• Nama Owner: ${ownerName.trim() || '-'}\n` +
    `• Saluran Penjualan: ${channel}\n` +
    `• Kota Asal: ${city.trim() || '-'}\n` +
    `• Target Harga Jual: Rp ${sellPrice.toLocaleString('id-ID')}/pcs\n` +
    `• Estimasi Volume: ${dailySales} pcs/hari (${monthlyPcs} pcs/bulan)\n\n` +
    `Mohon dibantu akses katalog foto mockup polos, SOP pengiriman resi otomatis, dan pricelist lengkap. Terima kasih!`;

  const waOnboardingUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waOnboardingMessage)}`;

  return (
    <div className="retail-wrap" style={{ paddingBlock: '40px 80px' }}>
      {/* Breadcrumb */}
      <nav className="retail-shop-crumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Reseller &amp; Dropship</span>
      </nav>

      {/* Hero Header */}
      <section className="retail-shop-hero" aria-labelledby="reseller-hero-heading">
        <div>
          <span className="retail-overline">
            TEESTOCK DROPSHIP ENGINE / WHITE-LABEL APPAREL
          </span>
          <h1 id="reseller-hero-heading">
            Bangun Brand Kaos Streetwear <em>Atas Nama Tokomu Sendiri.</em>
          </h1>
        </div>
        <p>
          Buka toko apparel di <strong>TikTok Shop, Shopee, atau Instagram</strong> tanpa investasi
          mesin cetak ratusan juta rupiah atau tumpukan stok kain. Kami sediakan kaos Cotton Combed
          24s standar distro dengan sablon DTF double-press bersuhu 155°C seharga modal grosir{' '}
          <strong>Rp 75.000 / pcs</strong>. Kami kirim satuan langsung ke pembelimu dengan nama tokomu
          sebagai pengirim.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <a
            href="#onboarding-form"
            className="retail-action-primary"
            style={{ textDecoration: 'none' }}
          >
            Daftar Reseller Sekarang <span aria-hidden="true">↓</span>
          </a>
          <a
            href="#simulasi-cuan"
            className="retail-action-quiet"
            style={{ textDecoration: 'none' }}
          >
            Kalkulator Cuan Reseller <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* 4-Pillar Reseller Advantages */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          margin: '36px 0',
        }}
        aria-label="Keunggulan Program Reseller"
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            01 // 100% WHITE-LABEL
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#191919' }}>
            100% Pengiriman White-Label
          </strong>
          <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
            Nama toko dan nomor kontak tokomu yang tercetak di resi ekspedisi (J&amp;T, SiCepat,
            JNE, SPX). Tidak ada stiker, logo, atau atribut TeeStock di paket luar.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            02 // ZERO MOQ DROPSHIP
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#191919' }}>
            Bisa Dropship Satuan (1 Pcs)
          </strong>
          <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
            Tidak ada batas Minimum Order Quantity (MOQ). Satu pesanan masuk di tokomu tetap kami
            cetak dan kirim dengan dedikasi serta kualitas yang sama.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            03 // FULL MARGIN CONTROL
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#191919' }}>
            Bebas Atur Harga &amp; Promo
          </strong>
          <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
            Harga modal tetap Rp 75.000/pcs. Kamu bebas menjual di harga Rp 99.000 (untung Rp
            24.000) hingga Rp 129.000 (untung Rp 54.000). Margin keuntungan 100% milikmu.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            04 // REPUTATION GUARANTEE
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#191919' }}>
            Garansi Retur Cacat Produksi
          </strong>
          <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
            Jika pembeli tokomu menerima kaos bolong atau sablon terkelupas, kami ganti baru tanpa
            biaya tambahan. Reputasi toko dan rating bintang 5 tokomu tetap terlindungi.
          </p>
        </div>
      </section>

      {/* Transparent Unit Economics Breakdown */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 28,
          marginBottom: 36,
        }}
        aria-labelledby="cost-breakdown-heading"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <span className="retail-overline" style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
              [STRUKTUR MODAL &amp; UNIT ECONOMICS]
            </span>
            <h2 id="cost-breakdown-heading" style={{ fontSize: 22, margin: '6px 0 0', color: '#191919' }}>
              Transparansi Biaya Produksi per Pcs
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 13, color: '#4b5563' }}>Harga Modal Grosir Reseller:</span>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--ts-accent-lime, #c8f902)',
              }}
            >
              Rp 75.000 <span style={{ fontSize: 14, fontWeight: 500 }}>/ pcs</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14,
          }}
        >
          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: 12, color: '#4b5563', display: 'block' }}>Kain Kaos</span>
            <strong style={{ fontSize: 14, color: '#191919' }}>Cotton Combed 24s</strong>
            <span style={{ fontSize: 12, color: '#71717a', display: 'block', marginTop: 2 }}>
              Gramasi 185 gsm, reaktif lembut
            </span>
          </div>

          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: 12, color: '#4b5563', display: 'block' }}>Sablon DTF Premium</span>
            <strong style={{ fontSize: 14, color: '#191919' }}>Double Press 155°C</strong>
            <span style={{ fontSize: 12, color: '#71717a', display: 'block', marginTop: 2 }}>
              Tinta elastis tahan kucek &amp; mesin
            </span>
          </div>

          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: 12, color: '#4b5563', display: 'block' }}>Area Sablon</span>
            <strong style={{ fontSize: 14, color: '#191919' }}>Hingga Ukuran A3</strong>
            <span style={{ fontSize: 12, color: '#71717a', display: 'block', marginTop: 2 }}>
              28 x 40 cm detail tajam 300 DPI
            </span>
          </div>

          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: 12, color: '#4b5563', display: 'block' }}>Pengemasan &amp; QC</span>
            <strong style={{ fontSize: 14, color: '#191919' }}>Polymailer Polos</strong>
            <span style={{ fontSize: 12, color: '#71717a', display: 'block', marginTop: 2 }}>
              Termasuk plastik OPP bening &amp; label
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Reseller Cuan Simulator */}
      <section
        id="simulasi-cuan"
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 28,
          marginBottom: 36,
        }}
        aria-labelledby="simulasi-reseller-heading"
      >
        <span className="retail-overline" style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
          [KALKULATOR CUAN DROPSHIP]
        </span>
        <h2 id="simulasi-reseller-heading" style={{ fontSize: 22, margin: '8px 0 16px', color: '#191919' }}>
          Simulasi Margin &amp; Keuntungan Tokomu
        </h2>
        <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 20 }}>
          Atur harga jual retail tokomu dan target penjualan harian untuk menghitung laba bersih yang
          bisa kamu kantongi setiap bulannya.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div>
            <label
              htmlFor="reseller-sales-slider"
              style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#191919' }}
            >
              Target Terjual: <strong>{dailySales} pcs / hari</strong> ({monthlyPcs} pcs / bulan)
            </label>
            <input
              id="reseller-sales-slider"
              type="range"
              min={1}
              max={50}
              value={dailySales}
              onChange={(e) => setDailySales(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>

          <div>
            <label
              htmlFor="reseller-price-select"
              style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#191919' }}
            >
              Harga Jual ke Pembelimu: <strong>Rp {sellPrice.toLocaleString('id-ID')}</strong>
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[89000, 99000, 109000, 129000].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setSellPrice(price)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    background: sellPrice === price ? '#38bdf8' : '#f9fafb',
                    color: sellPrice === price ? '#000000' : '#191919',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Rp {price.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f9fafb',
            padding: '20px 24px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 12, color: '#4b5563', display: 'block' }}>
              Margin per Kaos (Rp {sellPrice.toLocaleString('id-ID')} - Rp {baseCost.toLocaleString('id-ID')}):{' '}
              <strong style={{ color: '#38bdf8' }}>Rp {marginPerPcs.toLocaleString('id-ID')} / pcs</strong>
            </span>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--ts-accent-lime, #c8f902)',
                marginTop: 4,
              }}
            >
              Rp {monthlyProfit.toLocaleString('id-ID')}
              <span style={{ fontSize: 15, fontWeight: 500, color: '#4b5563' }}> / bulan laba bersih</span>
            </div>
          </div>
          {monthlyProfit >= 2500000 && (
            <div
              style={{
                background: '#1c2718',
                border: '1px solid #c8f902',
                padding: '10px 16px',
                borderRadius: 6,
                fontSize: 13,
                color: '#c8f902',
                fontWeight: 700,
              }}
            >
              [MILESTONE] Laba tokomu telah melampaui milestone target transisi (Rp 2.500.000/bln)!
            </div>
          )}
        </div>
      </section>

      {/* Onboarding Intake Form */}
      <section
        id="onboarding-form"
        style={{
          background: '#ffffff',
          border: '1px solid #38bdf8',
          borderRadius: 8,
          padding: 32,
          marginBottom: 36,
        }}
        aria-labelledby="onboarding-heading"
      >
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 28px' }}>
          <span className="retail-badge-available" style={{ background: '#082f49', color: '#38bdf8', border: '1px solid #38bdf8' }}>
            ONBOARDING RESELLER
          </span>
          <h2 id="onboarding-heading" style={{ fontSize: 24, margin: '12px 0 8px', color: '#191919' }}>
            Formulir Pendaftaran Reseller &amp; Dropship
          </h2>
          <p style={{ fontSize: 14, color: '#4b5563' }}>
            Daftarkan tokomu untuk mendapatkan akses katalog foto mockup polos dan SOP input resi
            otomatis marketplace.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(waOnboardingUrl, '_blank');
          }}
          style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <div>
            <label
              htmlFor="store-name"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#191919' }}
            >
              Nama Toko / Brand Tokomu <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <input
              id="store-name"
              type="text"
              required
              placeholder="Contoh: UrbanStyle Apparel / DistroKeren ID"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                fontSize: 14,
                background: '#f9fafb',
                color: '#191919',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="owner-name"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#191919' }}
            >
              Nama Pemilik / Contact Person <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <input
              id="owner-name"
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                fontSize: 14,
                background: '#f9fafb',
                color: '#191919',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="channel-select"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#191919' }}
            >
              Saluran Penjualan Utama
            </label>
            <select
              id="channel-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                fontSize: 14,
                background: '#f9fafb',
                color: '#191919',
              }}
            >
              <option value="TikTok Shop & Shopee">TikTok Shop &amp; Shopee</option>
              <option value="Shopee Marketplace">Shopee Marketplace</option>
              <option value="TikTok Shop Live & Video">TikTok Shop Live &amp; Video</option>
              <option value="Instagram & WhatsApp Catalog">Instagram &amp; WhatsApp Catalog</option>
              <option value="Tokopedia / Lazada">Tokopedia / Lazada</option>
              <option value="Website Sendiri / Komunitas">Website Sendiri / Komunitas</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="city-input"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#191919' }}
            >
              Kota / Domisili Toko <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <input
              id="city-input"
              type="text"
              required
              placeholder="Contoh: Bandung, Surabaya, Jakarta Barat, Solo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                fontSize: 14,
                background: '#f9fafb',
                color: '#191919',
              }}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              type="submit"
              className="retail-whatsapp-cta"
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 15,
                background: 'var(--ts-accent-lime, #c8f902)',
                color: '#000000',
                fontWeight: 800,
              }}
            >
              <span>Hubungkan Toko via WhatsApp Reseller <span aria-hidden="true">↗</span></span>
            </button>
            <span
              style={{
                display: 'block',
                fontSize: 12,
                color: '#71717a',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Data form di atas akan diformat otomatis menjadi format pesan pendaftaran WhatsApp resmi.
            </span>
          </div>
        </form>
      </section>

      {/* Reseller FAQ */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 28,
        }}
        aria-labelledby="reseller-faq-heading"
      >
        <span className="retail-overline" style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
          [PERTANYAAN UMUM RESELLER]
        </span>
        <h2 id="reseller-faq-heading" style={{ fontSize: 20, margin: '8px 0 20px', color: '#191919' }}>
          Hal yang Perlu Diketahui Seputar Dropship
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#f9fafb', padding: 16, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 4, color: '#191919' }}>
              Q: Apakah bisa menggunakan sistem resi otomatis (cashless) dari Shopee atau TikTok Shop?
            </strong>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
              Bisa. Cukup kirimkan file label resi pengiriman (PDF resi otomatis) yang didownload dari
              seller center ke admin fulfillment kami. Tim kami akan mencetak resi tersebut dan
              menempelkannya langsung di paket pesananmu.
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: 16, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 4, color: '#191919' }}>
              Q: Berapa lama waktu pengerjaan dari order masuk sampai diserahkan ke kurir?
            </strong>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
              Pesanan reguler diproses dalam 1x24 jam hingga 2x24 jam kerja (tergantung antrean DTF
              dan waktu masuk order). Pesanan sebelum jam 12.00 siang diprioritaskan cetak pada hari
              yang sama.
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: 16, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 4, color: '#191919' }}>
              Q: Apakah saya diberikan bahan promosi atau foto produk?
            </strong>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
              Ya. Setiap reseller terverifikasi mendapatkan link Google Drive berisi foto flatlay,
              on-model mockup tanpa watermark, serta template video konten 9:16 siap posting di
              TikTok dan Instagram Reels.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
