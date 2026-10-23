'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShirtIllustration, conceptDesigns } from './RetailShowcase';

export function NotionInteractiveHub() {
  const [activePersona, setActivePersona] = useState<'retail' | 'creator' | 'reseller'>('retail');
  const [selectedTeeTone, setSelectedTeeTone] = useState<'ink' | 'chalk'>('ink');

  // Creator Royalty Calculator State
  const [creatorPcs, setCreatorPcs] = useState<number>(50);
  const royaltyPerPcs = 24000;
  const totalRoyalty = creatorPcs * royaltyPerPcs;

  // Reseller Cuan Calculator State
  const [resellerPcsPerDay, setResellerPcsPerDay] = useState<number>(3);
  const [resellerSellPrice, setResellerSellPrice] = useState<number>(109000);
  const wholesaleBasePrice = 75000;
  const marginPerPcs = resellerSellPrice - wholesaleBasePrice;
  const monthlyResellerPcs = resellerPcsPerDay * 30;
  const monthlyResellerProfit = monthlyResellerPcs * marginPerPcs;

  // Size Recommender State
  const [userHeight, setUserHeight] = useState<number>(172);
  const [userWeight, setUserWeight] = useState<number>(66);
  const [fitPreference, setFitPreference] = useState<'regular' | 'oversized'>('regular');
  const [showSizeTable, setShowSizeTable] = useState<boolean>(false);

  const computeRecommendedSize = () => {
    let baseSize: 'S' | 'M' | 'L' | 'XL' | 'XXL' = 'M';
    if (userHeight < 165 || userWeight < 56) baseSize = 'S';
    else if (userHeight <= 172 && userWeight <= 66) baseSize = 'M';
    else if (userHeight <= 178 && userWeight <= 76) baseSize = 'L';
    else if (userHeight <= 184 && userWeight <= 86) baseSize = 'XL';
    else baseSize = 'XXL';

    if (fitPreference === 'oversized') {
      if (baseSize === 'S') return 'M';
      if (baseSize === 'M') return 'L';
      if (baseSize === 'L') return 'XL';
      return 'XXL';
    }
    return baseSize;
  };

  const recommendedSize = computeRecommendedSize();

  const sizeMetrics: Record<'S' | 'M' | 'L' | 'XL' | 'XXL', { width: number; length: number }> = {
    S: { width: 48, length: 68 },
    M: { width: 50, length: 70 },
    L: { width: 53, length: 73 },
    XL: { width: 56, length: 75 },
    XXL: { width: 59, length: 78 },
  };

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah kain Cotton Combed 24s terasa panas atau menerawang?',
      a: 'Tidak. Cotton Combed 24s memiliki gramasi 185 GSM yang merupakan titik seimbang ideal untuk iklim tropis Indonesia—cukup tebal sehingga tidak tembus pandang, namun tetap sangat sejuk dan lembut menyerap keringat.',
    },
    {
      q: 'Bagaimana ketahanan sablon DTF saat dicuci di mesin cuci?',
      a: 'Sablon DTF TeeStock menggunakan tinta pigmen elastis berstandar industri dengan pematangan oven ganda pada suhu 155°C. Sablon menyatu ke serat kain, lentur saat ditarik, dan tahan lebih dari 60 kali pencucian tanpa retak.',
    },
    {
      q: 'Bagaimana alur kerja untuk desainer mendapatkan royalti Rp 24.000/pcs?',
      a: 'Sangat mudah: kamu cukup mengunggah file desain beresolusi 300 DPI. Tim kami yang menanggung seluruh modal kain, proses cetak, dan pengiriman ke pembeli. Setiap kali karyamu terjual 1 potong, kamu menerima flat royalti bersih Rp 24.000.',
    },
    {
      q: 'Apakah paket dropship benar-benar tidak mencantumkan nama TeeStock?',
      a: '100% white-label murni. Di label resi ekspedisi (J&T, SiCepat, SPX, JNE) dan kemasan polymailer polos, yang tercantum adalah nama toko dan nomor WhatsApp tokomu sebagai pihak pengirim.',
    },
    {
      q: 'Bagaimana jika pesanan yang diterima pembeli terdapat cacat produksi?',
      a: 'Kami memberikan Garansi Ganti Baru 100%. Jika ada cacat sablon, bolong pada kain, atau kesalahan ukuran dari workshop kami, barang langsung diganti baru tanpa biaya tambahan sama sekali.',
    },
  ];

  const featuredTee = conceptDesigns[0];

  return (
    <div className="notion-interactive-wrap retail-wrap">
      {/* 1. Persona Tab Switcher (Notion Segmented Control) */}
      <section className="notion-persona-section" aria-labelledby="persona-heading">
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">PILIH PERAN KAMU</span>
            <h2 id="persona-heading">
              Satu platform. <em>Tiga solusi terintegrasi.</em>
            </h2>
          </div>
          <p>
            Pilih jalur yang paling relevan dengan kebutuhanmu untuk melihat kalkulasi nilai dan alur kerja langsung.
          </p>
        </div>

        {/* Notion-style Segmented Tabs */}
        <div className="notion-segmented-bar" role="tablist" aria-label="Pilihan Peran Pengguna">
          <button
            type="button"
            role="tab"
            aria-selected={activePersona === 'retail'}
            className={'notion-tab-pill' + (activePersona === 'retail' ? ' active' : '')}
            onClick={() => setActivePersona('retail')}
          >
            <span>🛍️</span>
            <strong>Pembeli Ritel</strong>
            <span className="notion-tab-sub">Koleksi Siap Pakai</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activePersona === 'creator'}
            className={'notion-tab-pill' + (activePersona === 'creator' ? ' active' : '')}
            onClick={() => setActivePersona('creator')}
          >
            <span>🎨</span>
            <strong>Kreator & Desainer</strong>
            <span className="notion-tab-sub">Royalti Rp 24k/pcs</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activePersona === 'reseller'}
            className={'notion-tab-pill' + (activePersona === 'reseller' ? ' active' : '')}
            onClick={() => setActivePersona('reseller')}
          >
            <span>📦</span>
            <strong>Reseller & Dropship</strong>
            <span className="notion-tab-sub">Modal Rp 75k/pcs</span>
          </button>
        </div>

        {/* Tab 1 Content: Retail Shopper */}
        {activePersona === 'retail' && (
          <div className="notion-tab-content">
            <div className="notion-tab-grid">
              <div className="notion-tab-card">
                <div className="notion-card-tag">KATALOG RITEL THE EDIT</div>
                <h3>Kaos Grafis Harian dengan Kualitas Garmen Terbaik</h3>
                <p>
                  Koleksi artikel terkurasi dengan bahan katun Combed 24s berdaya tahan tinggi.
                  Potongan pas, nyaman dipakai seharian, dan gambar sablon tajam tanpa efek kaku di dada.
                </p>

                {/* Notion Callout Box */}
                <div className="notion-callout-box">
                  <span className="notion-callout-icon">💡</span>
                  <div className="notion-callout-body">
                    <strong>Voucher Spesial Peluncuran:</strong>
                    <p>
                      Gunakan kode <code className="notion-code">HEMAT10</code> untuk diskon 10%, atau kode{' '}
                      <code className="notion-code">BELI2HEMAT</code> untuk potongan langsung Rp 20.000 saat belanja 2 kaos atau lebih.
                    </p>
                  </div>
                </div>

                <div className="notion-property-list">
                  <div className="notion-property-item">
                    <span className="notion-property-key">Bahan:</span>
                    <span className="notion-property-val">100% Cotton Combed 24s (185 GSM)</span>
                  </div>
                  <div className="notion-property-item">
                    <span className="notion-property-key">Sablon:</span>
                    <span className="notion-property-val">Direct-to-Film Dual Heat Press 155°C</span>
                  </div>
                  <div className="notion-property-item">
                    <span className="notion-property-key">Harga Ritel:</span>
                    <span className="notion-property-val" style={{ fontWeight: 700, color: '#191919' }}>
                      Rp 99.000 <small style={{ color: '#9ca3af', textDecoration: 'line-through', fontWeight: 400 }}>Rp 129.000</small>
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/shop" className="retail-action-primary">
                    Lihat Seluruh Koleksi Ritel <span aria-hidden="true">↗</span>
                  </Link>
                  <Link href="/shop/slow-sunday" className="retail-action-quiet">
                    Detail Artikel Contoh <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="notion-tee-preview-box">
                <div className="notion-tee-header">
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}>ARTIKEL UNGGULAN</span>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 750, color: '#191919' }}>
                      {featuredTee?.name ?? 'Slow Sunday'}
                    </h4>
                  </div>
                  <div className="notion-swatch-pills">
                    <button
                      type="button"
                      className={'notion-swatch-btn' + (selectedTeeTone === 'ink' ? ' active' : '')}
                      onClick={() => setSelectedTeeTone('ink')}
                      aria-label="Warna Hitam (Forest Ink)"
                    >
                      Hitam
                    </button>
                    <button
                      type="button"
                      className={'notion-swatch-btn' + (selectedTeeTone === 'chalk' ? ' active' : '')}
                      onClick={() => setSelectedTeeTone('chalk')}
                      aria-label="Warna Krem (Chalk Bone)"
                    >
                      Krem
                    </button>
                  </div>
                </div>
                <div className="notion-tee-art-stage">
                  {featuredTee && <ShirtIllustration design={featuredTee} tone={selectedTeeTone} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Creator Hub (Cotton Bureau Model) */}
        {activePersona === 'creator' && (
          <div className="notion-tab-content">
            <div className="notion-tab-grid">
              <div className="notion-tab-card">
                <div className="notion-card-tag" style={{ color: '#2563eb', background: '#eff6ff', borderColor: '#bfdbfe' }}>
                  MODEL KEMITRAAN KREATOR
                </div>
                <h3>Rilis Merchandise Brand Sendiri Tanpa Modal di Depan</h3>
                <p>
                  Kamu desainer atau ilustrator? Jangan biarkan modal jutaan menghambat karyamu.
                  Upload karya grafismu, kami cetak on-demand dan kirim satuan saat ada pesanan. Kamu terima royalti bersih transparan.
                </p>

                {/* Notion Callout Box */}
                <div className="notion-callout-box" style={{ background: '#eff6ff', borderColor: '#dbeafe' }}>
                  <span className="notion-callout-icon">🎨</span>
                  <div className="notion-callout-body">
                    <strong>Komitmen Kreator:</strong>
                    <p>
                      Hak cipta 100% tetap milikmu. Flat royalti <strong>Rp 24.000 per pcs</strong> langsung ditransfer ke rekeningmu setiap penjualan, tanpa potongan tersembunyi.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/creator" className="retail-action-primary">
                    Buka Portal Kreator & Form Karya <span aria-hidden="true">↗</span>
                  </Link>
                  <Link href="/creator#simulasi-royalti" className="retail-action-quiet">
                    Pelajari Syarat File 300 DPI <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Live Royalty Simulator */}
              <div className="notion-calc-card">
                <span className="notion-calc-badge">SIMULATOR ROYALTI KREATOR</span>
                <h4>Estimasi Penghasilan Bulanan</h4>
                <div className="notion-slider-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#4b5563' }}>Estimasi penjualan per bulan:</span>
                    <strong style={{ fontSize: 15, color: '#191919' }}>{creatorPcs} Kaos</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={creatorPcs}
                    onChange={(e) => setCreatorPcs(Number(e.target.value))}
                    className="notion-range-slider"
                    aria-label="Estimasi penjualan bulanan"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    <span>10 pcs/bln</span>
                    <span>150 pcs/bln</span>
                    <span>300 pcs/bln</span>
                  </div>
                </div>

                <div className="notion-result-box">
                  <span style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                    Total Royalti Bersih Masuk Rekening:
                  </span>
                  <div className="notion-result-number">
                    Rp {totalRoyalty.toLocaleString('id-ID')}
                    <small>/bulan</small>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 600, display: 'block', marginTop: 6 }}>
                    ✓ Rp 24.000 × {creatorPcs} pcs terjual
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3 Content: Reseller & Dropshipper */}
        {activePersona === 'reseller' && (
          <div className="notion-tab-content">
            <div className="notion-tab-grid">
              <div className="notion-tab-card">
                <div className="notion-card-tag" style={{ color: '#059669', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                  WHITE-LABEL DROPSHIP ENGINE
                </div>
                <h3>Buka Toko Apparel Distro di TikTok & Shopee</h3>
                <p>
                  Jual kaos distro premium dengan brand tokomu sendiri. Tidak perlu stok kain, tidak perlu mesin sablon.
                  Kami sediakan harga modal grosir Rp 75.000/pcs dan kami kirimkan ke pembeli dengan resi atas nama tokomu.
                </p>

                {/* Notion Callout Box */}
                <div className="notion-callout-box" style={{ background: '#ecfdf5', borderColor: '#d1fae5' }}>
                  <span className="notion-callout-icon">🛡️</span>
                  <div className="notion-callout-body">
                    <strong>100% White-Label & Tanpa Minimum Order:</strong>
                    <p>
                      Bisa dropship satuan (1 pcs). Kemasan polymailer polos tanpa logo TeeStock. Garansi retur ganti baru jika ada cacat produksi.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/reseller" className="retail-action-primary">
                    Buka Portal Reseller & Form Toko <span aria-hidden="true">↗</span>
                  </Link>
                  <Link href="/reseller#simulasi-cuan" className="retail-action-quiet">
                    Pelajari Unit Economics <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Live Reseller Profit Simulator */}
              <div className="notion-calc-card">
                <span className="notion-calc-badge" style={{ color: '#059669', background: '#ecfdf5' }}>
                  KALKULATOR LABA RESELLER
                </span>
                <h4>Estimasi Keuntungan Bersih Tokomu</h4>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                    Pilih target harga jual tokomu:
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[99000, 109000, 129000].map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setResellerSellPrice(price)}
                        className={'notion-price-btn' + (resellerSellPrice === price ? ' active' : '')}
                      >
                        Rp {price.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="notion-slider-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#4b5563' }}>Volume penjualan harian:</span>
                    <strong style={{ fontSize: 15, color: '#191919' }}>{resellerPcsPerDay} pcs / hari ({monthlyResellerPcs} pcs/bln)</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={resellerPcsPerDay}
                    onChange={(e) => setResellerPcsPerDay(Number(e.target.value))}
                    className="notion-range-slider"
                    aria-label="Volume penjualan harian"
                  />
                </div>

                <div className="notion-result-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <span style={{ fontSize: 12, color: '#166534', display: 'block', marginBottom: 4 }}>
                    Estimasi Laba Bersih Tokomu per Bulan:
                  </span>
                  <div className="notion-result-number" style={{ color: '#15803d' }}>
                    Rp {monthlyResellerProfit.toLocaleString('id-ID')}
                    <small>/bulan</small>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#166534', fontWeight: 600, display: 'block', marginTop: 6 }}>
                    ✓ Laba per pcs: Rp {marginPerPcs.toLocaleString('id-ID')} (Jual Rp {resellerSellPrice.toLocaleString('id-ID')} - Modal Rp 75k)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Interactive Size Recommender Widget (Notion Style) */}
      <section className="notion-size-section" aria-labelledby="size-heading">
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">PANDUAN UKURAN INTERAKTIF</span>
            <h2 id="size-heading">
              Kalkulator <em>ukuran presisi.</em>
            </h2>
          </div>
          <p>
            Ragu memilih ukuran? Masukkan tinggi dan berat badanmu untuk mendapatkan rekomendasi ukuran garmen yang paling proporsional.
          </p>
        </div>

        <div className="notion-size-widget">
          <div className="notion-size-inputs">
            <div className="notion-input-field">
              <label htmlFor="user-height-input">
                Tinggi Badan: <strong>{userHeight} cm</strong>
              </label>
              <input
                id="user-height-input"
                type="range"
                min="150"
                max="195"
                value={userHeight}
                onChange={(e) => setUserHeight(Number(e.target.value))}
                className="notion-range-slider"
              />
              <div className="notion-range-ticks">
                <span>150 cm</span>
                <span>170 cm</span>
                <span>195 cm</span>
              </div>
            </div>

            <div className="notion-input-field">
              <label htmlFor="user-weight-input">
                Berat Badan: <strong>{userWeight} kg</strong>
              </label>
              <input
                id="user-weight-input"
                type="range"
                min="45"
                max="110"
                value={userWeight}
                onChange={(e) => setUserWeight(Number(e.target.value))}
                className="notion-range-slider"
              />
              <div className="notion-range-ticks">
                <span>45 kg</span>
                <span>75 kg</span>
                <span>110 kg</span>
              </div>
            </div>

            <div className="notion-input-field">
              <label>Preferensi Gaya Potongan:</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className={'notion-fit-btn' + (fitPreference === 'regular' ? ' active' : '')}
                  onClick={() => setFitPreference('regular')}
                >
                  Regular Fit (Pas Standar)
                </button>
                <button
                  type="button"
                  className={'notion-fit-btn' + (fitPreference === 'oversized' ? ' active' : '')}
                  onClick={() => setFitPreference('oversized')}
                >
                  Oversized Fit (Santai/Lebar)
                </button>
              </div>
            </div>
          </div>

          <div className="notion-size-result-card">
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              REKOMENDASI UKURAN KAMU
            </span>
            <div className="notion-size-pill">
              SIZE {recommendedSize}
            </div>
            <p style={{ fontSize: 13, color: '#4b5563', margin: '12px 0 16px', lineHeight: 1.5 }}>
              Berdasarkan tinggi {userHeight} cm dan berat {userWeight} kg dengan preferensi {fitPreference === 'oversized' ? 'oversized santai' : 'standar pas'}.
            </p>
            <div className="notion-size-metrics-box">
              <div className="notion-size-metric-col">
                <span>Lebar Dada</span>
                <strong>{sizeMetrics[recommendedSize].width} cm</strong>
              </div>
              <div className="notion-size-metric-col">
                <span>Panjang Kaos</span>
                <strong>{sizeMetrics[recommendedSize].length} cm</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSizeTable(!showSizeTable)}
              className="notion-size-table-toggle"
            >
              {showSizeTable ? 'Tutup Tabel Seluruh Ukuran ▲' : 'Lihat Tabel Seluruh Ukuran (S - XXL) ▼'}
            </button>
          </div>
        </div>

        {/* Expandable Full Size Table */}
        {showSizeTable && (
          <div className="notion-size-table-wrap">
            <table className="notion-table">
              <thead>
                <tr>
                  <th>Ukuran</th>
                  <th>Lebar Dada</th>
                  <th>Panjang Kaos</th>
                  <th>Panjang Lengan</th>
                  <th>Estimasi Berat Badan</th>
                </tr>
              </thead>
              <tbody>
                <tr className={recommendedSize === 'S' ? 'highlight-row' : ''}>
                  <td><strong>S</strong></td>
                  <td>48 cm</td>
                  <td>68 cm</td>
                  <td>21 cm</td>
                  <td>45 - 55 kg</td>
                </tr>
                <tr className={recommendedSize === 'M' ? 'highlight-row' : ''}>
                  <td><strong>M</strong></td>
                  <td>50 cm</td>
                  <td>70 cm</td>
                  <td>22 cm</td>
                  <td>56 - 65 kg</td>
                </tr>
                <tr className={recommendedSize === 'L' ? 'highlight-row' : ''}>
                  <td><strong>L</strong></td>
                  <td>53 cm</td>
                  <td>73 cm</td>
                  <td>23 cm</td>
                  <td>66 - 76 kg</td>
                </tr>
                <tr className={recommendedSize === 'XL' ? 'highlight-row' : ''}>
                  <td><strong>XL</strong></td>
                  <td>56 cm</td>
                  <td>75 cm</td>
                  <td>24 cm</td>
                  <td>77 - 86 kg</td>
                </tr>
                <tr className={recommendedSize === 'XXL' ? 'highlight-row' : ''}>
                  <td><strong>XXL</strong></td>
                  <td>59 cm</td>
                  <td>78 cm</td>
                  <td>25 cm</td>
                  <td>87 - 105 kg</td>
                </tr>
              </tbody>
            </table>
            <span style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
              * Toleransi jahit konveksi: ±1-2 cm. Bahan 100% Cotton Combed preshrunk tidak menyusut drastis setelah pencucian.
            </span>
          </div>
        )}
      </section>

      {/* 3. Notion-Style FAQ Accordion */}
      <section className="notion-faq-section" aria-labelledby="faq-heading">
        <div className="retail-section-heading">
          <div>
            <span className="retail-overline">FAQ & BANTUAN</span>
            <h2 id="faq-heading">
              Pertanyaan yang <em>sering diajukan.</em>
            </h2>
          </div>
          <p>
            Semua hal yang perlu kamu ketahui tentang material, sablon, alur royalti kreator, dan kemitraan dropship.
          </p>
        </div>

        <div className="notion-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className={'notion-accordion-item' + (isOpen ? ' open' : '')}>
                <button
                  type="button"
                  className="notion-accordion-header"
                  aria-expanded={isOpen}
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                >
                  <span className="notion-accordion-q">{faq.q}</span>
                  <span className="notion-accordion-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="notion-accordion-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
