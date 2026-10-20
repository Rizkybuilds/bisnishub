'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  formatIllustrativePrice,
  type PreviewProduct,
  type PreviewSize,
  type PreviewGarmentColor,
  type PreviewPrintTone,
} from '../data/products';
import { ShirtIllustration, type ConceptDesign } from './RetailShowcase';
import { useDemoCart } from '../features/demo-commerce';

export function ProductDetailViewer({ product }: { product: PreviewProduct }) {
  const [selectedColor, setSelectedColor] = useState<PreviewGarmentColor>(
    product.previewColors[0] ?? {
      id: 'forest-ink',
      name: 'Forest Ink',
      tone: 'ink',
      hex: '#263129',
      description: 'Hijau gelap earthy khas TeeStock.',
    },
  );
  const [selectedSize, setSelectedSize] = useState<PreviewSize>('L');
  const [selectedPrintTone, setSelectedPrintTone] = useState<PreviewPrintTone>(
    product.previewPrintTones[0] ?? {
      id: 'standard-screen',
      name: 'Standard Contrast',
      description: 'Warna cetak kontras tegas.',
    },
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { addItem } = useDemoCart();

  const conceptDesign: ConceptDesign = {
    id: product.conceptDesignId,
    name: product.title,
    series: product.series,
    lineOne: product.lineOne,
    lineTwo: product.lineTwo,
    caption: product.tagline,
    palette: product.palette,
    motif: product.motif,
  };

  const formattedPrice = formatIllustrativePrice(product.illustrativePriceIdr);

  const handleAddToDemoCart = () => {
    const result = addItem(
      product.slug,
      selectedColor.id,
      selectedSize,
      selectedPrintTone.id,
      1,
    );
    if (result.success) {
      setFeedbackNotice({ type: 'success', message: result.notice });
      setTimeout(() => setFeedbackNotice(null), 6000);
    } else {
      setFeedbackNotice({ type: 'error', message: result.error });
      setTimeout(() => setFeedbackNotice(null), 6000);
    }
  };

  return (
    <article className="retail-pdp" aria-labelledby="pdp-title">
      <nav className="retail-pdp-crumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop">The Edit</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="retail-pdp-grid">
        {/* Left Column: Visual Mockup Showcase */}
        <section
          className="retail-pdp-visual"
          aria-label={`Visual studi desain ${product.title}`}
        >
          <div className={`retail-pdp-art art-${product.palette}`}>
            <span className="retail-pdp-watermark">
              TS / SELECTS — {product.series.toUpperCase()}
            </span>
            <ShirtIllustration
              design={conceptDesign}
              tone={selectedColor.tone}
            />
            <div className="retail-pdp-badge-row">
              <span className="retail-badge-preview">STUDI DESAIN</span>
              <span className="retail-badge-tone">
                Warna: {selectedColor.name} • {selectedPrintTone.name} (Konsep)
              </span>
            </div>
          </div>
          <p className="retail-pdp-visual-note">
            Visual warna garmen di atas merupakan simulasi studio. Opsi karakter
            cetak merupakan eksplorasi konseptual studio dan tidak dirender
            secara visual. Hasil produksi cetak aktual baru dapat diverifikasi
            saat sampling fisik workshop.
          </p>
        </section>

        {/* Right Column: Information, Variant Selector & Status */}
        <section className="retail-pdp-content">
          <header className="retail-pdp-header">
            <span className="retail-overline">
              TEESTOCK SELECTS / {product.series.toUpperCase()}
            </span>
            <h1 id="pdp-title" className="retail-pdp-title">
              {product.title}
            </h1>
            <p className="retail-pdp-tagline">{product.tagline}</p>
            <div className="retail-pdp-price-row">
              <span className="retail-pdp-price">{formattedPrice}</span>
              <span className="retail-pdp-price-badge">
                Simulasi Harga UX • Bukan Harga Rilis
              </span>
            </div>
            <p className="retail-pdp-price-disclaimer">
              Nominal di atas murni nilai simulasi untuk pengujian tata letak
              antarmuka (UX testing value). Harga jual resmi belum ditetapkan
              dan menunggu persetujuan komersial.
            </p>
          </header>

          {/* Honest Status Banner */}
          <div className="retail-status-box" role="status">
            <span className="retail-availability-dot" aria-hidden="true" />
            <div>
              <strong>Tahap Preview Desain.</strong> Belum Menerima Pesanan.
              Produk ini merupakan studi kurasi desain dan belum dibuka untuk
              pemesanan retail atau transaksi checkout. Kami sedang menyiapkan
              rilis kurasi resmi.
            </div>
          </div>

          {/* Color Variant Selector (Native Radio Group with proper Fieldset/Legend) */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Warna Apparel (Preview):</span>
              <strong className="retail-variant-value">
                {selectedColor.name}
              </strong>
            </legend>
            <div className="retail-color-options">
              {product.previewColors.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <label
                    key={color.id}
                    className={`retail-color-btn ${isSelected ? 'is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`color-${product.slug}`}
                      value={color.id}
                      checked={isSelected}
                      onChange={() => setSelectedColor(color)}
                      className="retail-sr-radio"
                      aria-label={`Pilih warna ${color.name} (${color.tone === 'ink' ? 'gelap' : 'terang'})`}
                    />
                    <span
                      className="retail-color-swatch"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className="retail-color-name">{color.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="retail-variant-help">{selectedColor.description}</p>
          </fieldset>

          {/* Size Variant Selector (Native Radio Group & Direct Legend First Child) */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Ukuran Apparel (Preview):</span>
              <strong className="retail-variant-value">{selectedSize}</strong>
            </legend>

            <div className="retail-size-guide-row">
              <button
                type="button"
                className="retail-size-guide-btn"
                aria-expanded={isSizeGuideOpen}
                aria-controls="size-guide-panel"
                onClick={() => setIsSizeGuideOpen((v) => !v)}
              >
                {isSizeGuideOpen
                  ? 'Tutup panduan estimasi ukuran'
                  : 'Panduan estimasi ukuran'}
                <span aria-hidden="true"> ↗</span>
              </button>
            </div>

            <div className="retail-size-options">
              {product.previewSizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <label
                    key={size}
                    className={`retail-size-btn ${isSelected ? 'is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`size-${product.slug}`}
                      value={size}
                      checked={isSelected}
                      onChange={() => setSelectedSize(size)}
                      className="retail-sr-radio"
                      aria-label={`Pilih ukuran ${size}`}
                    />
                    <span>{size}</span>
                  </label>
                );
              })}
            </div>

            {/* Size Guide Disclosure Panel */}
            {isSizeGuideOpen && (
              <div
                id="size-guide-panel"
                className="retail-size-guide-panel"
                tabIndex={-1}
              >
                <div className="retail-size-guide-head">
                  <h4>Catatan Estimasi Ukuran (Konsep Awal)</h4>
                  <span className="retail-tag-pending">
                    BELUM TERVERIFIKASI
                  </span>
                </div>
                <p>
                  Pilihan ukuran S &ndash; XXL pada tahap pratinjau ini
                  disediakan untuk pengujian antarmuka dan penataan tata letak
                  visual.
                </p>
                <p>
                  Karakteristik fitting, toleransi jahit, dan dimensi pola
                  garmen aktual belum diuji secara fisik di workshop.
                </p>
                <p className="retail-guide-footnote">
                  Tabel ukuran presisi (lebar dada, panjang badan, dan panjang
                  lengan dalam cm) belum tersedia dan baru akan diterbitkan
                  resmi saat peluncuran batch produksi yang telah lolos quality
                  control.
                </p>
              </div>
            )}
          </fieldset>

          {/* Print Finish Selection (Conceptual, Non-Rendered) */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Karakteristik Cetak (Eksplorasi Konsep):</span>
              <strong className="retail-variant-value">
                {selectedPrintTone.name}
              </strong>
            </legend>
            <div className="retail-print-options">
              {product.previewPrintTones.map((tone) => {
                const isSelected = selectedPrintTone.id === tone.id;
                return (
                  <label
                    key={tone.id}
                    className={`retail-tone-btn ${isSelected ? 'is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`treatment-${product.slug}`}
                      value={tone.id}
                      checked={isSelected}
                      onChange={() => setSelectedPrintTone(tone)}
                      className="retail-sr-radio"
                      aria-label={`Pilih treatment ${tone.name}`}
                    />
                    <span>{tone.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="retail-variant-help">
              <strong>
                Eksplorasi Konseptual (Tidak Dirender pada Pratinjau):
              </strong>{' '}
              {selectedPrintTone.description} Pilihan ini merupakan eksplorasi
              kurasi studio dan tidak mengubah rendering grafis pada visual di
              atas.
            </p>
          </fieldset>

          {/* Demo Commerce Simulation Action Area */}
          <div className="retail-demo-cart-action-box">
            <button
              type="button"
              className="retail-btn-demo-cart"
              onClick={handleAddToDemoCart}
              aria-label={`Tambahkan ${product.title} (${selectedColor.name}, ukuran ${selectedSize}) ke keranjang simulasi`}
            >
              Tambahkan ke Keranjang Simulasi <span aria-hidden="true">🛒</span>
            </button>
            {feedbackNotice && feedbackNotice.type === 'success' && (
              <div
                className="retail-demo-cart-success"
                role="status"
                aria-live="polite"
              >
                <span>✓ {feedbackNotice.message}</span>
                <Link href="/demo/cart" className="retail-demo-cart-link">
                  Buka Keranjang Simulasi <span aria-hidden="true">↗</span>
                </Link>
              </div>
            )}
            {feedbackNotice && feedbackNotice.type === 'error' && (
              <div
                className="retail-demo-cart-error"
                role="alert"
                aria-live="assertive"
              >
                <span>⚠️ {feedbackNotice.message}</span>
              </div>
            )}
            <p className="retail-demo-cart-disclaimer">
              Aksi di atas murni simulasi alur retail dalam memori browser.
              Tidak ada data yang dikirim ke server dan tidak ada pesanan
              komersial yang dibuat.
            </p>
          </div>

          {/* Non-Transactional Real-Purchase Call to Action Area (Always Disabled) */}
          <div className="retail-pdp-action-area">
            <button
              type="button"
              className="retail-action-disabled"
              disabled
              aria-disabled="true"
            >
              Tahap Preview Desain • Belum Dijual
            </button>
            <p className="retail-pdp-action-disclaimer">
              Fitur keranjang belanja dan checkout dinonaktifkan hingga
              peluncuran koleksi resmi TeeStock.
            </p>
          </div>

          {/* Story & Specifications Disclosure */}
          <section
            className="retail-pdp-details"
            aria-labelledby="pdp-details-heading"
          >
            <h3 id="pdp-details-heading" className="retail-detail-heading">
              Cerita &amp; Konsep Desain
            </h3>
            <p className="retail-pdp-story">{product.story}</p>

            <h3 className="retail-detail-heading">
              Status Spesifikasi &amp; Material
            </h3>
            <div className="retail-spec-card">
              <div className="retail-spec-row">
                <span className="retail-spec-k">Spesifikasi Bahan</span>
                <span className="retail-spec-v">
                  Belum Ditetapkan (Eksplorasi konsep studio — komposisi kain
                  &amp; gramasi menunggu pengujian fisik sampel workshop)
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Teknik Grafis</span>
                <span className="retail-spec-v">
                  Rencana Kurasi Studio (Metode cetak &amp; finishing sablon
                  belum disetujui komersial)
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Status Persetujuan</span>
                <span className="retail-spec-v">
                  Tahap Pratinjau Desain • Belum ada vendor, sampel fisik, atau
                  harga yang disetujui secara komersial
                </span>
              </div>
            </div>

            <h3 className="retail-detail-heading">Panduan Perawatan</h3>
            <p className="retail-care-intro">
              Belum Diterbitkan — Panduan resmi akan disusun setelah uji cuci
              sampel fisik selesai:
            </p>
            <ul className="retail-care-list">
              {product.careGuidelinesPending.map((care, idx) => (
                <li key={idx}>{care}</li>
              ))}
            </ul>
          </section>

          {/* Back navigation */}
          <div className="retail-pdp-footer-nav">
            <Link href="/shop" className="retail-back-link">
              <span aria-hidden="true">← </span>Kembali ke The Edit (Semua
              Konsep)
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
