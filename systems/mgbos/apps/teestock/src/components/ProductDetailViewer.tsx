'use client';

import { useState } from 'react';
import Link from 'next/link';
import type {
  PreviewProduct,
  PreviewSize,
  PreviewGarmentColor,
  PreviewPrintTone,
} from '../data/products';
import { ShirtIllustration, type ConceptDesign } from './RetailShowcase';

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

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.illustrativePriceIdr);

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
                {selectedColor.name} • {selectedPrintTone.name}
              </span>
            </div>
          </div>
          <p className="retail-pdp-visual-note">
            Visual warna dan proporsi grafis di atas merupakan simulasi studio.
            Hasil produksi cetak garmen aktual dapat memiliki sedikit perbedaan
            karakter tekstur.
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
                Estimasi Retail Preview
              </span>
            </div>
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

          {/* Color Variant Selector */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Warna Apparel (Preview):</span>
              <strong className="retail-variant-value">
                {selectedColor.name}
              </strong>
            </legend>
            <div
              className="retail-color-options"
              role="radiogroup"
              aria-label="Pilihan warna garmen"
            >
              {product.previewColors.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`retail-color-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Pilih warna ${color.name} (${color.tone === 'ink' ? 'gelap' : 'terang'})`}
                  >
                    <span
                      className="retail-color-swatch"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className="retail-color-name">{color.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="retail-variant-help">{selectedColor.description}</p>
          </fieldset>

          {/* Size Variant Selector */}
          <fieldset className="retail-variant-group">
            <div className="retail-size-header">
              <legend className="retail-variant-label">
                <span>Ukuran:</span>
                <strong className="retail-variant-value">{selectedSize}</strong>
              </legend>
              <button
                type="button"
                className="retail-size-guide-btn"
                aria-expanded={isSizeGuideOpen}
                aria-controls="size-guide-panel"
                onClick={() => setIsSizeGuideOpen((v) => !v)}
              >
                {isSizeGuideOpen ? 'Tutup panduan ukuran' : 'Panduan ukuran'}
                <span aria-hidden="true"> ↗</span>
              </button>
            </div>

            <div
              className="retail-size-options"
              role="radiogroup"
              aria-label="Pilihan ukuran kaos"
            >
              {product.previewSizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`retail-size-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Pilih ukuran ${size}`}
                  >
                    {size}
                  </button>
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
                  <h4>Catatan Estimasi Ukuran TeeStock</h4>
                  <span className="retail-tag-pending">
                    VERIFIKASI PRODUKSI
                  </span>
                </div>
                <p>
                  Pola potongan dirancang dengan fitting reguler-santai (tubular
                  relaxed fit).
                </p>
                <ul className="retail-guide-list">
                  <li>
                    <strong>S &amp; M:</strong> Pas untuk siluet standar harian.
                  </li>
                  <li>
                    <strong>L &amp; XL:</strong> Siluet relaxed dengan ruang
                    gerak lebih leluasa.
                  </li>
                  <li>
                    <strong>XXL:</strong> Siluet boxy santai dengan drape kain
                    berbobot.
                  </li>
                </ul>
                <p className="retail-guide-footnote">
                  Tabel ukuran presisi (lebar dada, panjang badan, dan panjang
                  lengan dalam cm) akan diterbitkan resmi saat peluncuran batch
                  produksi pertama.
                </p>
              </div>
            )}
          </fieldset>

          {/* Print Finish Selection */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Treatment Cetak Grafis:</span>
              <strong className="retail-variant-value">
                {selectedPrintTone.name}
              </strong>
            </legend>
            <div
              className="retail-print-options"
              role="radiogroup"
              aria-label="Pilihan karakter cetak"
            >
              {product.previewPrintTones.map((tone) => {
                const isSelected = selectedPrintTone.id === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`retail-tone-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedPrintTone(tone)}
                  >
                    <span>{tone.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="retail-variant-help">
              {selectedPrintTone.description}
            </p>
          </fieldset>

          {/* Non-Transactional Call to Action Area */}
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
              Spesifikasi Garmen &amp; Material
            </h3>
            <div className="retail-spec-card">
              <div className="retail-spec-row">
                <span className="retail-spec-k">Bahan Utama</span>
                <span className="retail-spec-v">
                  100% Cotton Combed (Sedang dalam uji gramasi sample)
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Teknik Grafis</span>
                <span className="retail-spec-v">
                  Direct-to-Film (DTF) High-Definition Screen Tone
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Status Batch</span>
                <span className="retail-spec-v">
                  Uji Coba Pra-Produksi / Design Study
                </span>
              </div>
            </div>

            <h3 className="retail-detail-heading">Panduan Perawatan</h3>
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
