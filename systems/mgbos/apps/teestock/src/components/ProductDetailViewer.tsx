'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  formatIllustrativePrice,
  evaluatePromoDiscount,
  buildWhatsAppOrderUrl,
  type PreviewProduct,
  type PreviewSize,
  type PreviewGarmentColor,
  type PreviewPrintTone,
  type PromoRule,
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
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [userHeight, setUserHeight] = useState<string>('');
  const [userWeight, setUserWeight] = useState<string>('');
  const [sizeRecommendation, setSizeRecommendation] = useState<{
    size: PreviewSize;
    note: string;
  } | null>(null);

  // Dynamic promo engine state
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{
    promo: PromoRule;
    discountAmount: number;
  } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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

  const unitPrice = product.illustrativePriceIdr;
  const compareAtPrice = product.compareAtPriceIdr;
  const subtotal = unitPrice * quantity;
  const discountAmount = appliedPromo?.discountAmount ?? 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setAppliedPromo(null);
      setPromoMessage(null);
      return;
    }

    const result = evaluatePromoDiscount(subtotal, quantity, promoInput);
    if (result.error) {
      setAppliedPromo(null);
      setPromoMessage({ type: 'error', text: result.error });
    } else if (result.appliedPromo) {
      setAppliedPromo({
        promo: result.appliedPromo,
        discountAmount: result.discountAmount,
      });
      setPromoMessage({
        type: 'success',
        text: `Voucher ${result.appliedPromo.code} aktif: Hemat Rp ${result.discountAmount.toLocaleString('id-ID')}!`,
      });
    }
  };

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(userHeight, 10);
    const w = parseInt(userWeight, 10);

    if (isNaN(h) || isNaN(w) || h < 100 || w < 30) {
      return;
    }

    let recSize: PreviewSize = 'L';
    let note = '';

    if (w >= 85 || h >= 185) {
      recSize = 'XXL';
      note = 'Fitting oversized / longgar nyaman.';
    } else if (w >= 75 || h >= 178) {
      recSize = 'XL';
      note = 'Siluet santai proporsional.';
    } else if (w >= 65 || h >= 170) {
      recSize = 'L';
      note = 'Pola reguler pas di dada dan bahu.';
    } else if (w >= 54 || h >= 162) {
      recSize = 'M';
      note = 'Fitting standar harian.';
    } else {
      recSize = 'S';
      note = 'Siluet ramping proporsional.';
    }

    setSizeRecommendation({ size: recSize, note });
    setSelectedSize(recSize);
  };

  const handleAddToDemoCart = () => {
    const result = addItem(
      product.slug,
      selectedColor.id,
      selectedSize,
      selectedPrintTone.id,
      quantity,
    );
    if (result.success) {
      setFeedbackNotice({ type: 'success', message: result.notice });
      setTimeout(() => setFeedbackNotice(null), 6000);
    } else {
      setFeedbackNotice({ type: 'error', message: result.error });
      setTimeout(() => setFeedbackNotice(null), 6000);
    }
  };

  const whatsAppOrderUrl = buildWhatsAppOrderUrl({
    productTitle: product.title,
    colorName: selectedColor.name,
    size: selectedSize,
    quantity,
    unitPriceIdr: unitPrice,
    promoCode: appliedPromo?.promo.code,
    discountAmount: appliedPromo?.discountAmount,
  });

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
          aria-label={`Visual garmen ${product.title}`}
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
              <span className="retail-badge-available">SIAP CETAK DTF</span>
              <span className="retail-badge-tone">
                Warna: {selectedColor.name} • {selectedPrintTone.name}
              </span>
            </div>
          </div>
          <p className="retail-pdp-visual-note">
            Visual mockup di atas menggunakan rasio cetak presisi. Setiap lembar
            kaos dicetak menggunakan mesin DTF format besar dengan tinta pigment
            tekstur lembut dan curing press 155°C.
          </p>
        </section>

        {/* Right Column: Information, Variant Selector & Commerce Action */}
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
              <span className="retail-pdp-price">
                {formatIllustrativePrice(unitPrice)}
              </span>
              {compareAtPrice && compareAtPrice > unitPrice && (
                <span className="retail-pdp-compare-price">
                  {formatIllustrativePrice(compareAtPrice)}
                </span>
              )}
              <span className="retail-badge-available">
                Stok Bahan Baku Siap
              </span>
            </div>
          </header>

          {/* Real-time Order & Delivery Status */}
          <div className="retail-status-box" role="status">
            <span className="retail-availability-dot" aria-hidden="true" />
            <div>
              <strong>Produksi Cepat (Print-on-Demand).</strong> Pesanan
              diproses dan dicetak dalam 1–2 hari kerja setelah konfirmasi via
              WhatsApp. Garansi tukar barang 100% jika ada cacat cetak atau kain.
            </div>
          </div>

          {/* Color Variant Selector */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Warna Kaos:</span>
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
                      aria-label={`Pilih warna ${color.name}`}
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

          {/* Size Variant Selector & Size Guide / Recommendation Calculator */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Ukuran Kaos:</span>
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
                  ? 'Tutup kalkulator & tabel ukuran'
                  : 'Kalkulator rekomendasi & tabel ukuran'}
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

            {/* Size Guide Disclosure Panel with Interactive Calculator */}
            {isSizeGuideOpen && (
              <div
                id="size-guide-panel"
                className="retail-size-guide-panel"
                tabIndex={-1}
              >
                <div className="retail-calc-card">
                  <h4 className="retail-calc-title">
                    Kalkulator Rekomendasi Ukuran
                  </h4>
                  <form
                    onSubmit={handleCalculateSize}
                    className="retail-calc-inputs"
                  >
                    <div className="retail-calc-field">
                      <label htmlFor="user-height">Tinggi Badan (cm)</label>
                      <input
                        id="user-height"
                        type="number"
                        placeholder="Contoh: 172"
                        value={userHeight}
                        onChange={(e) => setUserHeight(e.target.value)}
                        min={100}
                        max={220}
                      />
                    </div>
                    <div className="retail-calc-field">
                      <label htmlFor="user-weight">Berat Badan (kg)</label>
                      <input
                        id="user-weight"
                        type="number"
                        placeholder="Contoh: 68"
                        value={userWeight}
                        onChange={(e) => setUserWeight(e.target.value)}
                        min={30}
                        max={180}
                      />
                    </div>
                    <button type="submit" className="retail-promo-btn">
                      Hitung Ukuran
                    </button>
                  </form>

                  {sizeRecommendation && (
                    <div className="retail-calc-result" role="status">
                      Ukuran yang disarankan:{' '}
                      <strong>{sizeRecommendation.size}</strong> &bull;{' '}
                      {sizeRecommendation.note} (Ukuran otomatis dipilih)
                    </div>
                  )}
                </div>

                <h4 style={{ marginTop: 16, fontSize: 13, fontWeight: 700 }}>
                  Tabel Dimensi Kaos Standar (Regular Streetwear Fit)
                </h4>
                <table className="retail-size-table">
                  <thead>
                    <tr>
                      <th>Ukuran</th>
                      <th>Lebar Dada (cm)</th>
                      <th>Panjang Kaos (cm)</th>
                      <th>Perkiraan BB (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>S</strong>
                      </td>
                      <td>48</td>
                      <td>70</td>
                      <td>45 - 55 kg</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>M</strong>
                      </td>
                      <td>50</td>
                      <td>72</td>
                      <td>55 - 65 kg</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>L</strong>
                      </td>
                      <td>53</td>
                      <td>74</td>
                      <td>65 - 75 kg</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>XL</strong>
                      </td>
                      <td>56</td>
                      <td>76</td>
                      <td>75 - 85 kg</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>XXL</strong>
                      </td>
                      <td>59</td>
                      <td>78</td>
                      <td>85 - 100 kg</td>
                    </tr>
                  </tbody>
                </table>
                <p className="retail-guide-footnote">
                  Toleransi ukuran jahit konveksi: ±1-2 cm. Bahan Cotton Combed
                  24s reaktif dengan susut minimal sesudah dicuci.
                </p>
              </div>
            )}
          </fieldset>

          {/* Print Finish Tone Selection */}
          <fieldset className="retail-variant-group">
            <legend className="retail-variant-label">
              <span>Karakteristik Sablon:</span>
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
              {selectedPrintTone.description}
            </p>
          </fieldset>

          {/* Quantity Selector */}
          <div className="retail-qty-row">
            <span className="retail-qty-label">Jumlah Pesanan:</span>
            <div className="retail-qty-controls">
              <button
                type="button"
                className="retail-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Kurangi jumlah pesanan"
              >
                -
              </button>
              <span className="retail-qty-val" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="retail-qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tambah jumlah pesanan"
              >
                +
              </button>
            </div>
            {quantity >= 2 && (
              <span
                style={{ fontSize: 12, color: '#1e592f', fontWeight: 600 }}
              >
                (Gunakan voucher BELI2HEMAT untuk diskon Rp 20.000!)
              </span>
            )}
          </div>

          {/* Promo Code Input Box */}
          <div className="retail-promo-card">
            <div className="retail-promo-title">
              <span>Punya Kode Voucher Promo?</span>
              <span style={{ color: '#7a827b', fontWeight: 500 }}>
                Coba: HEMAT10 / BELI2HEMAT
              </span>
            </div>
            <div className="retail-promo-input-group">
              <input
                type="text"
                className="retail-promo-input"
                placeholder="Masukkan kode promo"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                aria-label="Kode Voucher Diskon"
              />
              <button
                type="button"
                className="retail-promo-btn"
                onClick={handleApplyPromo}
              >
                Gunakan
              </button>
            </div>
            {promoMessage && (
              <div
                className={`retail-promo-feedback is-${promoMessage.type}`}
                role="status"
              >
                {promoMessage.text}
              </div>
            )}
          </div>

          {/* Direct Commerce Order CTA */}
          <div className="retail-pdp-action-area">
            <a
              href={whatsAppOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="retail-whatsapp-cta"
            >
              <span>Pesan Langsung via WhatsApp <span aria-hidden="true">↗</span></span>
              <span>&bull;</span>
              <span>{formatIllustrativePrice(finalTotal)}</span>
            </a>
            <p className="retail-pdp-action-disclaimer">
              Pesan terformat otomatis dikirim ke admin WhatsApp TeeStock. Anda
              dapat berdiskusi tentang varian, lokasi pengiriman, dan pembayaran.
            </p>
          </div>

          {/* Demo Commerce Simulation Action Area (Preserved for Testing) */}
          <div className="retail-demo-cart-action-box" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="retail-btn-demo-cart"
              onClick={handleAddToDemoCart}
              aria-label={`Simulasi: Tambahkan ${product.title} ke keranjang demo`}
            >
              Tambahkan ke Keranjang Demo <span aria-hidden="true">↗</span>
            </button>
            {feedbackNotice && feedbackNotice.type === 'success' && (
              <div
                className="retail-demo-cart-success"
                role="status"
                aria-live="polite"
              >
                <span>✓ {feedbackNotice.message}</span>
                <Link href="/demo/cart" className="retail-demo-cart-link">
                  Buka Keranjang Demo <span aria-hidden="true">↗</span>
                </Link>
              </div>
            )}
            {feedbackNotice && feedbackNotice.type === 'error' && (
              <div
                className="retail-demo-cart-error"
                role="alert"
                aria-live="assertive"
              >
                <span>[INFO] {feedbackNotice.message}</span>
              </div>
            )}
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
              Spesifikasi Material &amp; Produksi
            </h3>
            <div className="retail-spec-card">
              <div className="retail-spec-row">
                <span className="retail-spec-k">Bahan Kaos</span>
                <span className="retail-spec-v">
                  100% Cotton Combed Premium 24s (Gramasi 185-190 gsm, Lembut,
                  Adem &amp; Menyerap Keringat)
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Teknologi Sablon</span>
                <span className="retail-spec-v">
                  Direct-to-Film (DTF) Double Press 155°C (Warna Solid, Lentur,
                  Detail Presisi &amp; Tahan Cuci)
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Standar Jahitan</span>
                <span className="retail-spec-v">
                  Jahit Rantai Standar Distro, Rib Leher Elastis Anti-Melar,
                  Overdeck 3 Jarum
                </span>
              </div>
              <div className="retail-spec-row">
                <span className="retail-spec-k">Jaminan Kualitas</span>
                <span className="retail-spec-v">
                  100% Garansi Retur / Ganti Baru jika Ditemukan Cacat Cetak
                  atau Kerusakan Kain
                </span>
              </div>
            </div>

            <h3 className="retail-detail-heading">Panduan Perawatan Kaos</h3>
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
              Koleksi)
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
