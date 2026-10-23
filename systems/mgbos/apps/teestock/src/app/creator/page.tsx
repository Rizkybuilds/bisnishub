'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreatorPage() {
  const [dailySales, setDailySales] = useState<number>(5);
  const [creatorName, setCreatorName] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [artworkTitle, setArtworkTitle] = useState('');
  const [baseColor, setBaseColor] = useState('Hitam (Black Vintage)');
  const [fileLink, setFileLink] = useState('');
  const [artworkStory, setArtworkStory] = useState('');

  const monthlyPcs = dailySales * 30;
  const royaltyPerPcs = 24000;
  const monthlyRoyalty = monthlyPcs * royaltyPerPcs;

  const waNumber =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    '6281200000000';
  const cleanNumber = waNumber.replace(/[^0-9]/g, '');

  const waSubmissionMessage =
    `Halo Tim Pre-Press TeeStock, saya ingin mengajukan desain untuk program Creator Merch (Cotton Bureau Model):\n\n` +
    `• Nama Kreator: ${creatorName.trim() || '-'}\n` +
    `• Media Sosial/Portofolio: ${socialHandle.trim() || '-'}\n` +
    `• Judul Karya: ${artworkTitle.trim() || '-'}\n` +
    `• Rekomendasi Kaos: ${baseColor}\n` +
    `• Tautan File Karya (300 DPI): ${fileLink.trim() || '-'}\n` +
    `• Cerita / Konsep: ${artworkStory.trim() || '-'}\n\n` +
    `Estimasi target audiens/penjualan: ${dailySales} pcs/hari (~Rp ${monthlyRoyalty.toLocaleString('id-ID')}/bulan royalti).\n` +
    `Mohon dibantu review kurasi dan digital mockup-nya. Terima kasih!`;

  const waSubmissionUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waSubmissionMessage)}`;

  return (
    <div className="retail-wrap" style={{ paddingBlock: '40px 80px' }}>
      {/* Breadcrumb */}
      <nav className="retail-shop-crumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Creator Hub</span>
      </nav>

      {/* Hero Header */}
      <section className="retail-shop-hero" aria-labelledby="creator-hero-heading">
        <div>
          <span className="retail-overline">
            TEESTOCK CREATOR ENGINE / COTTON BUREAU MODEL
          </span>
          <h1 id="creator-hero-heading">
            Karya Seni Kamu. <em>Nol Beban Modal.</em>
          </h1>
        </div>
        <p>
          TeeStock mengadopsi model kurasi boutique ala <strong>Cotton Bureau</strong> untuk
          ilustrator, desainer grafis, dan seniman visual Indonesia. Kamu cukup fokus
          berkarya—kami yang menanggung modal kain Cotton Combed 24s, kalibrasi warna sablon DTF
          dengan standar pre-press 7+ tahun, cetak on-demand, hingga pengiriman ke seluruh Nusantara.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <a
            href="#submit-form"
            className="retail-action-primary"
            style={{ textDecoration: 'none' }}
          >
            Ajukan Desain Sekarang <span aria-hidden="true">↓</span>
          </a>
          <a
            href="#royalti-simulasi"
            className="retail-action-quiet"
            style={{ textDecoration: 'none' }}
          >
            Simulasi Royalti Rp 24k/pcs <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* 4-Pillar Value Badges */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          margin: '36px 0',
        }}
        aria-label="Keunggulan Creator Hub"
      >
        <div
          style={{
            background: '#121217',
            border: '1px solid #27272a',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            01 // COPYRIGHT PROTECTED
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#fafafa' }}>
            Hak Cipta 100% Milikmu
          </strong>
          <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>
            Karya tetap sepenuhnya menjadi hak milik intelektual kamu. TeeStock hanya memegang hak
            lisensi non-eksklusif untuk mencetak pesanan apparel secara on-demand.
          </p>
        </div>

        <div
          style={{
            background: '#121217',
            border: '1px solid #27272a',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            02 // FLAT NET ROYALTY
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#fafafa' }}>
            Royalti Bersih Rp 24.000 / Pcs
          </strong>
          <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>
            Bukan komisi persentase kecil yang membingungkan. Setiap satu potong kaos karyamu yang
            terjual, kamu mendapatkan flat royalti bersih Rp 24.000 tanpa potongan biaya cetak lagi.
          </p>
        </div>

        <div
          style={{
            background: '#121217',
            border: '1px solid #27272a',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            03 // TECHNICAL PRE-PRESS
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#fafafa' }}>
            7+ Tahun Pre-Press Craft
          </strong>
          <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>
            Kami bukan sekadar print shop biasa. Tim teknis menguji gamut CMYK, kehalusan
            gradasi raster, dan parameter DTF double-press 155°C agar hasil cetak mendekati layar.
          </p>
        </div>

        <div
          style={{
            background: '#121217',
            border: '1px solid #27272a',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'var(--ts-accent-lime, #c8f902)', marginBottom: 8, letterSpacing: '0.12em' }}>
            04 // ZERO INVENTORY
          </span>
          <strong style={{ display: 'block', fontSize: 16, marginBottom: 8, color: '#fafafa' }}>
            Zero Inventory Risk
          </strong>
          <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>
            Tidak ada modal beli 50 kaos di depan yang belum tentu habis. Kami mencetak satuan saat
            ada pesanan masuk (POD), mengemas dengan rapi, dan menanggung garansi cacat produksi.
          </p>
        </div>
      </section>

      {/* 4-Step Cotton Bureau Workflow */}
      <section
        style={{
          background: '#121217',
          border: '1px solid #27272a',
          borderRadius: 8,
          padding: 28,
          marginBottom: 36,
        }}
        aria-labelledby="workflow-heading"
      >
        <span className="retail-overline" style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
          [ALUR KERJA SAMA / COTTON BUREAU PIPELINE]
        </span>
        <h2 id="workflow-heading" style={{ fontSize: 22, margin: '8px 0 20px', color: '#fafafa' }}>
          Dari File Kanvas ke Lemari Kolektor dalam 4 Langkah
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 20,
          }}
        >
          <div style={{ borderLeft: '3px solid var(--ts-accent-lime, #c8f902)', paddingLeft: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
              [FASE 01]
            </span>
            <h3 style={{ fontSize: 16, margin: '4px 0 8px', color: '#fafafa' }}>1. Kirim File Karya</h3>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, margin: 0 }}>
              Kirimkan desainmu dalam resolusi 300 DPI (format PNG transparan / AI / PSD) melalui
              formulir pengajuan di bawah ini.
            </p>
          </div>

          <div style={{ borderLeft: '3px solid var(--ts-accent-lime, #c8f902)', paddingLeft: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
              [FASE 02]
            </span>
            <h3 style={{ fontSize: 16, margin: '4px 0 8px', color: '#fafafa' }}>2. Kurasi &amp; Proofing</h3>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, margin: 0 }}>
              Tim pre-press kami memeriksa ketepatan warna, kepadatan tinta putih, dan keserasian
              dengan warna kain garmen dalam waktu 1x24 jam kerja.
            </p>
          </div>

          <div style={{ borderLeft: '3px solid var(--ts-accent-lime, #c8f902)', paddingLeft: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
              [FASE 03]
            </span>
            <h3 style={{ fontSize: 16, margin: '4px 0 8px', color: '#fafafa' }}>3. Peluncuran Capsule</h3>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, margin: 0 }}>
              Desainmu tayang di katalog ritel TeeStock (The Edit) dengan halaman produk khusus dan
              mockup beresolusi tinggi untuk dipromosikan ke komunitasmu.
            </p>
          </div>

          <div style={{ borderLeft: '3px solid var(--ts-accent-lime, #c8f902)', paddingLeft: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
              [FASE 04]
            </span>
            <h3 style={{ fontSize: 16, margin: '4px 0 8px', color: '#fafafa' }}>4. Royalti Masuk Rekening</h3>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, margin: 0 }}>
              Setiap kali ada order, sistem ERP kami mencatat otomatis. Royalti bersih Rp 24.000/pcs
              direkap dan ditransfer langsung tanpa potongan tersembunyi.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Royalty Simulator */}
      <section
        id="royalti-simulasi"
        style={{
          background: '#121217',
          border: '1px solid #27272a',
          borderRadius: 8,
          padding: 28,
          marginBottom: 36,
        }}
        aria-labelledby="simulasi-creator-heading"
      >
        <span className="retail-overline" style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
          [SIMULASI ESTIMASI ROYALTI]
        </span>
        <h2 id="simulasi-creator-heading" style={{ fontSize: 22, margin: '8px 0 16px', color: '#fafafa' }}>
          Berapa Potensi Royalti dari Komunitasmu?
        </h2>
        <p style={{ fontSize: 14, color: '#a1a1aa', marginBottom: 20 }}>
          Geser slider di bawah ini untuk melihat estimasi royalti bersih bulanan dengan asumsi
          royalti flat <strong>Rp 24.000</strong> per potong kaos yang terjual.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="creator-sales-slider"
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 8,
              color: '#fafafa',
            }}
          >
            Estimasi Terjual: <strong>{dailySales} pcs / hari</strong> ({monthlyPcs} pcs / bulan)
          </label>
          <input
            id="creator-sales-slider"
            type="range"
            min={1}
            max={50}
            value={dailySales}
            onChange={(e) => setDailySales(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--ts-accent-lime, #c8f902)' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#18181f',
            padding: '20px 24px',
            borderRadius: 6,
            border: '1px solid #27272a',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 12, color: '#a1a1aa', display: 'block' }}>
              Estimasi Royalti Bersih Kreator (Rp 24.000 x {monthlyPcs} pcs):
            </span>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--ts-accent-lime, #c8f902)',
                marginTop: 4,
              }}
            >
              Rp {monthlyRoyalty.toLocaleString('id-ID')}
              <span style={{ fontSize: 15, fontWeight: 500, color: '#a1a1aa' }}> / bulan</span>
            </div>
          </div>
          {monthlyRoyalty >= 2500000 && (
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
              [MILESTONE] Royalti ini telah mencapai target transisi kemandirian (Rp 2.500.000/bln)!
            </div>
          )}
        </div>
      </section>

      {/* Pre-Press Technical Specifications */}
      <section
        style={{
          background: '#121217',
          border: '1px solid #27272a',
          borderRadius: 8,
          padding: 28,
          marginBottom: 36,
        }}
        aria-labelledby="tech-specs-heading"
      >
        <span className="retail-overline" style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
          [STANDAR PRE-PRESS &amp; KUALITAS PRODUKSI]
        </span>
        <h2 id="tech-specs-heading" style={{ fontSize: 22, margin: '8px 0 16px', color: '#fafafa' }}>
          Panduan Teknis File Desain Siap Cetak
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
              [RESOLUTION]
            </span>
            <strong style={{ display: 'block', fontSize: 14, marginBottom: 4, color: '#fafafa' }}>
              Ukuran Kanvas &amp; Resolusi
            </strong>
            <span style={{ fontSize: 13, color: '#a1a1aa' }}>
              Area cetak maksimal A3 (28 cm x 40 cm). Resolusi wajib <strong>300 DPI</strong> dengan
              background transparan.
            </span>
          </div>

          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
              [FILE_FORMATS]
            </span>
            <strong style={{ display: 'block', fontSize: 14, marginBottom: 4, color: '#fafafa' }}>
              Format File
            </strong>
            <span style={{ fontSize: 13, color: '#a1a1aa' }}>
              Format yang didukung: <strong>PNG 300 DPI Transparan</strong>, Adobe Illustrator (.AI),
              atau Photoshop (.PSD) dengan layer terpisah.
            </span>
          </div>

          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
              [BLANK_SPEC]
            </span>
            <strong style={{ display: 'block', fontSize: 14, marginBottom: 4, color: '#fafafa' }}>
              Spesifikasi Garmen
            </strong>
            <span style={{ fontSize: 13, color: '#a1a1aa' }}>
              100% Ring Spun Cotton Combed 24s gramasi 180-190 gsm. Lembut, adem, jahitan rantai
              standar clothing line premium.
            </span>
          </div>

          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <span style={{ fontSize: 10, color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
              [DTF_CURING]
            </span>
            <strong style={{ display: 'block', fontSize: 14, marginBottom: 4, color: '#fafafa' }}>
              Sablon DTF Double Press 155°C
            </strong>
            <span style={{ fontSize: 13, color: '#a1a1aa' }}>
              Tinta pigmen elastis berdaya rekat tinggi. Melalui tahap curing oven &amp; press kedua
              pada suhu 155°C untuk ketahanan cuci maksimal.
            </span>
          </div>
        </div>
      </section>

      {/* Submission Intake Form */}
      <section
        id="submit-form"
        style={{
          background: '#121217',
          border: '1px solid var(--ts-accent-lime, #c8f902)',
          borderRadius: 8,
          padding: 32,
          marginBottom: 36,
        }}
        aria-labelledby="form-heading"
      >
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 28px' }}>
          <span className="retail-badge-available" style={{ background: '#1c1f10', color: '#c8f902', border: '1px solid #c8f902' }}>
            INTAKE KREATOR AKTIF
          </span>
          <h2 id="form-heading" style={{ fontSize: 24, margin: '12px 0 8px', color: '#fafafa' }}>
            Formulir Pengajuan Karya Desain
          </h2>
          <p style={{ fontSize: 14, color: '#a1a1aa' }}>
            Isi formulir di bawah ini untuk menghubungkan karyamu langsung ke tim kurasi &amp;
            pre-press kami via WhatsApp.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(waSubmissionUrl, '_blank');
          }}
          style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <div>
            <label
              htmlFor="creator-name"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#fafafa' }}
            >
              Nama Kreator / Alias Seni <span style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>*</span>
            </label>
            <input
              id="creator-name"
              type="text"
              required
              placeholder="Contoh: Alex Pratama (@alex_arts)"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #27272a',
                fontSize: 14,
                background: '#18181f',
                color: '#fafafa',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="social-handle"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#fafafa' }}
            >
              Tautan Portofolio / Instagram / ArtStation <span style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>*</span>
            </label>
            <input
              id="social-handle"
              type="text"
              required
              placeholder="Contoh: https://instagram.com/alex_arts atau @alex_arts"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #27272a',
                fontSize: 14,
                background: '#18181f',
                color: '#fafafa',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="artwork-title"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#fafafa' }}
            >
              Judul Karya Desain <span style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>*</span>
            </label>
            <input
              id="artwork-title"
              type="text"
              required
              placeholder="Contoh: Tokyo Cyber Ramen / Botanical Geometry 01"
              value={artworkTitle}
              onChange={(e) => setArtworkTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #27272a',
                fontSize: 14,
                background: '#18181f',
                color: '#fafafa',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="base-color"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#fafafa' }}
            >
              Rekomendasi Warna Kaos Dasar
            </label>
            <select
              id="base-color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #27272a',
                fontSize: 14,
                background: '#18181f',
                color: '#fafafa',
              }}
            >
              <option value="Hitam (Black Vintage)">Hitam (Black Vintage)</option>
              <option value="Putih (Natural Off-White)">Putih (Natural Off-White)</option>
              <option value="Forest Green (Hijau Botol Gelap)">Forest Green (Hijau Botol Gelap)</option>
              <option value="Sand Khaki (Krem Pasir)">Sand Khaki (Krem Pasir)</option>
              <option value="Navy Dark (Biru Dongker)">Navy Dark (Biru Dongker)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="file-link"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#fafafa' }}
            >
              Tautan File Mentah / Preview (Google Drive / WeTransfer / Dropbox){' '}
              <span style={{ color: 'var(--ts-accent-lime, #c8f902)' }}>*</span>
            </label>
            <input
              id="file-link"
              type="url"
              required
              placeholder="Pastikan akses link disetel ke 'Anyone with the link can view'"
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #27272a',
                fontSize: 14,
                background: '#18181f',
                color: '#fafafa',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="artwork-story"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#fafafa' }}
            >
              Cerita / Filosofi Singkat di Balik Karya
            </label>
            <textarea
              id="artwork-story"
              rows={3}
              placeholder="Ceritakan inspirasi atau pesan dari desain ini untuk dicantumkan pada deskripsi produk..."
              value={artworkStory}
              onChange={(e) => setArtworkStory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #27272a',
                fontSize: 14,
                fontFamily: 'inherit',
                background: '#18181f',
                color: '#fafafa',
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
              <span>Ajukan Desain via WhatsApp Pre-Press <span aria-hidden="true">↗</span></span>
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
              Data form di atas akan diformat otomatis menjadi pesan WhatsApp siap kirim ke kurator kami.
            </span>
          </div>
        </form>
      </section>

      {/* Creator FAQ */}
      <section
        style={{
          background: '#121217',
          border: '1px solid #27272a',
          borderRadius: 8,
          padding: 28,
        }}
        aria-labelledby="faq-heading"
      >
        <span className="retail-overline" style={{ color: 'var(--ts-accent-lime, #c8f902)', fontFamily: 'monospace' }}>
          [PERTANYAAN UMUM KREATOR]
        </span>
        <h2 id="faq-heading" style={{ fontSize: 20, margin: '8px 0 20px', color: '#fafafa' }}>
          Hal yang Sering Ditanyakan
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 4, color: '#fafafa' }}>
              Q: Apakah saya harus membayar biaya pendaftaran atau kurasi?
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Sama sekali tidak. Pendaftaran dan kurasi pre-press 100% gratis tanpa biaya apa pun.
              Kami berkolaborasi dengan sistem bagi hasil royalti saat karya terjual.
            </p>
          </div>

          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 4, color: '#fafafa' }}>
              Q: Kapan dan bagaimana royalti Rp 24.000/pcs dibayarkan?
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Rekap penjualan ditarik otomatis dari backend ERP setiap akhir bulan. Pembayaran ditransfer
              langsung ke rekening bank atau dompet digital (GoPay/OVO) terdaftar maksimal tanggal 5
              bulan berikutnya.
            </p>
          </div>

          <div style={{ background: '#18181f', padding: 16, borderRadius: 6, border: '1px solid #27272a' }}>
            <strong style={{ display: 'block', fontSize: 15, marginBottom: 4, color: '#fafafa' }}>
              Q: Bagaimana jika ada pembeli yang mengeluhkan kualitas cetak atau ukuran salah?
            </strong>
            <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              TeeStock menanggung garansi 100% penggantian baru untuk cacat produksi, kesalahan sablon,
              atau cacat kain. Royalti kreator tidak dipotong untuk retur yang disebabkan oleh kendala
              produksi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
