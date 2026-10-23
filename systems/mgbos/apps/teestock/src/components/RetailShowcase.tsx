'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getPreviewProductBySlug,
  formatIllustrativeShortPrice,
} from '../data/products';

export type ConceptDesign = {
  id: string;
  name: string;
  series: 'Studio Notes' | 'Off-Duty';
  lineOne: string;
  lineTwo: string;
  caption: string;
  palette: 'clay' | 'sage' | 'lilac' | 'sky' | 'butter' | 'rose';
  motif: 'sun' | 'orbit' | 'flower' | 'waves' | 'spark' | 'grid';
};

export const conceptDesigns: ConceptDesign[] = [
  {
    id: 'slow-sunday',
    name: 'Slow Sunday',
    series: 'Off-Duty',
    lineOne: 'SLOW',
    lineTwo: 'SUNDAY',
    caption: 'Ruang untuk bergerak lebih pelan.',
    palette: 'clay',
    motif: 'sun',
  },
  {
    id: 'making-things',
    name: 'Making Things',
    series: 'Studio Notes',
    lineOne: 'MAKING',
    lineTwo: 'THINGS',
    caption: 'Ide kecil, hari yang panjang.',
    palette: 'sage',
    motif: 'orbit',
  },
  {
    id: 'ordinary-magic',
    name: 'Ordinary Magic',
    series: 'Off-Duty',
    lineOne: 'ORDINARY',
    lineTwo: 'MAGIC',
    caption: 'Menemukan cerita di keseharian.',
    palette: 'lilac',
    motif: 'flower',
  },
  {
    id: 'stay-curious',
    name: 'Stay Curious',
    series: 'Studio Notes',
    lineOne: 'STAY',
    lineTwo: 'CURIOUS',
    caption: 'Rasa ingin tahu tidak pernah usang.',
    palette: 'sky',
    motif: 'waves',
  },
  {
    id: 'daylight-hours',
    name: 'Daylight Hours',
    series: 'Off-Duty',
    lineOne: 'DAYLIGHT',
    lineTwo: 'HOURS',
    caption: 'Untuk semua rencana yang spontan.',
    palette: 'butter',
    motif: 'spark',
  },
  {
    id: 'work-in-motion',
    name: 'Work in Motion',
    series: 'Studio Notes',
    lineOne: 'WORK IN',
    lineTwo: 'MOTION',
    caption: 'Selalu ada ruang untuk mencoba.',
    palette: 'rose',
    motif: 'grid',
  },
];

type ShirtTone = 'ink' | 'chalk';

export function HeroGarments() {
  const heroBackDesign = conceptDesigns[2];
  const heroFrontDesign = conceptDesigns[0];

  return (
    <>
      <div className="retail-hero-tee retail-hero-tee-back">
        {heroBackDesign ? (
          <ShirtIllustration design={heroBackDesign} tone="chalk" hero />
        ) : null}
      </div>
      <div className="retail-hero-tee retail-hero-tee-front">
        {heroFrontDesign ? (
          <ShirtIllustration design={heroFrontDesign} tone="ink" hero />
        ) : null}
      </div>
    </>
  );
}

export function ShirtIllustration({
  design,
  tone = 'ink',
  hero = false,
}: {
  design: ConceptDesign;
  tone?: ShirtTone;
  hero?: boolean;
}) {
  const isInk = tone === 'ink';
  // Authentic heavy streetwear palette: Washed Obsidian Charcoal vs Vintage Heavy Bone
  const fabricBase = isInk ? '#16171b' : '#ede8dd';
  const fabricHighlight = isInk ? '#24252e' : '#f9f7f2';
  const fabricShadow = isInk ? '#0c0d10' : '#d2cbbd';
  const seamStroke = isInk ? '#2a2b33' : '#b8b1a2';
  const stitchStroke = isInk ? '#32343e' : '#c5bea0';
  const collarInner = isInk ? '#101114' : '#dfd9cb';

  // Refined Notion-palette graphic inks
  const printPrimary = isInk ? '#ffffff' : '#191919';
  const printAccent = isInk ? '#2383e2' : '#2563eb';
  const printMuted = isInk ? '#9ca3af' : '#6b7280';
  const gradientId = 'garment-' + design.id + '-' + tone + (hero ? '-hero' : '');

  return (
    <svg
      className="retail-shirt-svg"
      viewBox="0 0 420 440"
      role="img"
      aria-label={
        'Ilustrasi konsep kaos ' +
        design.name +
        ', warna ' +
        (isInk ? 'gelap' : 'terang')
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Realistic dimensional lighting for heavyweight boxy drape */}
        <linearGradient id={gradientId} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={fabricHighlight} />
          <stop offset="35%" stopColor={fabricBase} />
          <stop offset="75%" stopColor={fabricBase} />
          <stop offset="100%" stopColor={fabricShadow} />
        </linearGradient>
        {/* Soft realistic floor shadow */}
        <radialGradient id={'shadow-' + gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Realistic floor drop shadow */}
      <ellipse
        cx="210"
        cy="420"
        rx="145"
        ry="15"
        fill={'url(#shadow-' + gradientId + ')'}
      />

      {/* Main Streetwear Boxy Garment Body (Heavy Drop-Shoulder Silhouette) */}
      <path
        d="M 125,58 L 165,48 Q 210,68 255,48 L 295,58 L 372,92 L 392,175 L 332,196 L 312,152 L 312,398 Q 210,412 108,398 L 108,152 L 88,196 L 28,175 L 48,92 Z"
        fill={'url(#' + gradientId + ')'}
        stroke={seamStroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Drop Shoulder Seam Details */}
      <path
        d="M 125,58 L 108,152 M 295,58 L 312,152"
        stroke={seamStroke}
        strokeWidth="1.5"
        strokeDasharray="4,2"
        opacity="0.6"
      />

      {/* Sleeve Hem Turnbacks & Twin-Needle Stitch */}
      <path
        d="M 33,160 L 83,178 M 387,160 L 337,178"
        stroke={stitchStroke}
        strokeWidth="1.5"
        strokeDasharray="3,2"
        opacity="0.75"
      />

      {/* Body Bottom Hem Twin-Needle Stitch */}
      <path
        d="M 110,384 Q 210,396 310,384"
        stroke={stitchStroke}
        strokeWidth="1.5"
        strokeDasharray="3,2"
        opacity="0.75"
      />

      {/* Back Inner Neckline & Interior Woven Label */}
      <path
        d="M 165,48 Q 210,68 255,48 Q 210,36 165,48 Z"
        fill={collarInner}
        stroke={seamStroke}
        strokeWidth="1.5"
      />
      {/* Woven Brand Label Tag */}
      <rect
        x="192"
        y="42"
        width="36"
        height="18"
        rx="2"
        fill={isInk ? '#08080a' : '#ffffff'}
        stroke={isInk ? '#33333d' : '#cccccc'}
        strokeWidth="1"
      />
      <text
        x="210"
        y="50"
        fill={printPrimary}
        fontFamily="monospace"
        fontSize="5"
        fontWeight="800"
        letterSpacing="0.8"
        textAnchor="middle"
      >
        TEESTOCK
      </text>
      <text
        x="210"
        y="56"
        fill={printAccent}
        fontFamily="monospace"
        fontSize="4"
        fontWeight="700"
        textAnchor="middle"
      >
        24S / L
      </text>

      {/* Front 2.5cm Heavy Ribbed Crewneck Collar */}
      <path
        d="M 165,48 Q 210,102 255,48 L 246,59 Q 210,88 174,59 Z"
        fill={isInk ? '#1e1f26' : '#ded8cc'}
        stroke={seamStroke}
        strokeWidth="2"
      />

      {/* Subtle Chest Drape Shading */}
      <path
        d="M 135,160 Q 210,210 285,160"
        fill="none"
        stroke={fabricShadow}
        strokeWidth="3"
        opacity="0.35"
      />

      {/* HIGH-IMPACT STREETWEAR GRAPHIC SABLON (DTF DUAL-PRESS 155°C) */}
      <g className="retail-shirt-print" opacity="0.98">
        {design.id === 'slow-sunday' && (
          <g transform="translate(210, 225)">
            {/* Raw Industrial Halftone Box & Star */}
            <rect
              x="-65"
              y="-75"
              width="130"
              height="150"
              fill="none"
              stroke={printAccent}
              strokeWidth="1.5"
              strokeDasharray="6,3"
            />
            {/* Graphic Badge */}
            <path
              d="M 0,-50 L 12,-18 L 48,-18 L 18,4 L 30,38 L 0,16 L -30,38 L -18,4 L -48,-18 L -12,-18 Z"
              fill={printAccent}
              opacity="0.9"
            />
            <circle cx="0" cy="-6" r="16" fill={isInk ? '#16171b' : '#ede8dd'} />
            <text
              x="0"
              y="-2"
              fill={printPrimary}
              fontFamily="Arial, sans-serif"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
            >
              24S
            </text>
            {/* Bold Streetwear Typography */}
            <text
              x="0"
              y="32"
              fill={printPrimary}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="22"
              letterSpacing="2"
              textAnchor="middle"
            >
              SLOW SUNDAY
            </text>
            <text
              x="0"
              y="45"
              fill={printMuted}
              fontFamily="monospace"
              fontSize="7"
              letterSpacing="1.5"
              textAnchor="middle"
            >
              [OFF-DUTY ARCHIVE // DROP 001]
            </text>
            {/* Barcode Graphic */}
            <path
              d="M -35,52 H 35 M -35,56 H 35"
              stroke={printPrimary}
              strokeWidth="2"
              strokeDasharray="2,3,1,2,4,2,1,3"
            />
          </g>
        )}

        {design.id === 'making-things' && (
          <g transform="translate(210, 225)">
            {/* Blueprint Technical Dial & Crosshairs */}
            <circle
              cx="0"
              cy="-16"
              r="46"
              fill="none"
              stroke={printAccent}
              strokeWidth="2"
            />
            <circle
              cx="0"
              cy="-16"
              r="34"
              fill="none"
              stroke={printPrimary}
              strokeWidth="1"
              strokeDasharray="4,2"
            />
            <path
              d="M 0,-70 V 38 M -54,-16 H 54"
              stroke={printMuted}
              strokeWidth="1"
            />
            <circle cx="0" cy="-16" r="14" fill={printAccent} />
            <text
              x="0"
              y="-12"
              fill={isInk ? '#000000' : '#ffffff'}
              fontFamily="monospace"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
            >
              TS
            </text>
            {/* Bold Grotesque Header */}
            <text
              x="0"
              y="34"
              fill={printPrimary}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="20"
              letterSpacing="1"
              textAnchor="middle"
            >
              MAKING THINGS
            </text>
            <text
              x="0"
              y="46"
              fill={printMuted}
              fontFamily="monospace"
              fontSize="6.5"
              letterSpacing="1.2"
              textAnchor="middle"
            >
              6°54'S 107°36'E // BANDUNG ID
            </text>
          </g>
        )}

        {design.id === 'ordinary-magic' && (
          <g transform="translate(210, 225)">
            {/* Cyber-Botanical Streetwear Graphic (Brain Dead Style) */}
            <g transform="translate(0, -18)">
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-24"
                  rx="14"
                  ry="26"
                  fill={printAccent}
                  opacity="0.88"
                  transform={`rotate(${deg} 0 0)`}
                />
              ))}
              <circle
                cx="0"
                cy="0"
                r="18"
                fill={isInk ? '#09090b' : '#fafafa'}
                stroke={printPrimary}
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="9" fill={printPrimary} />
            </g>
            <text
              x="0"
              y="34"
              fill={printPrimary}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="21"
              letterSpacing="2"
              textAnchor="middle"
            >
              ORDINARY MAGIC
            </text>
            <text
              x="0"
              y="46"
              fill={printMuted}
              fontFamily="monospace"
              fontSize="6.5"
              letterSpacing="1.5"
              textAnchor="middle"
            >
              BOTANICAL EXPERIMENT // 24S COMBED
            </text>
          </g>
        )}

        {design.id === 'stay-curious' && (
          <g transform="translate(210, 225)">
            {/* Kinetic Radar & Soundwave Distortion */}
            <g transform="translate(0, -18)">
              <path
                d="M -50,-12 Q -25,-36 0,-12 T 50,-12"
                fill="none"
                stroke={printAccent}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M -50,4 Q -25,-20 0,4 T 50,4"
                fill="none"
                stroke={printPrimary}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M -50,20 Q -25,-4 0,20 T 50,20"
                fill="none"
                stroke={printAccent}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
            <text
              x="0"
              y="34"
              fill={printPrimary}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="22"
              letterSpacing="1.5"
              textAnchor="middle"
            >
              STAY CURIOUS
            </text>
            <text
              x="0"
              y="46"
              fill={printMuted}
              fontFamily="monospace"
              fontSize="6.5"
              letterSpacing="1.5"
              textAnchor="middle"
            >
              FREQUENCY: 185 GSM // HIGH-RES DTF
            </text>
          </g>
        )}

        {design.id === 'daylight-hours' && (
          <g transform="translate(210, 225)">
            {/* Brutalist Solar Burst */}
            <g transform="translate(0, -18)">
              <polygon
                points="0,-42 12,-12 42,0 12,12 0,42 -12,12 -42,0 -12,-12"
                fill={printAccent}
              />
              <circle cx="0" cy="0" r="14" fill={printPrimary} />
            </g>
            <text
              x="0"
              y="34"
              fill={printPrimary}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="20"
              letterSpacing="1.5"
              textAnchor="middle"
            >
              DAYLIGHT HOURS
            </text>
            <text
              x="0"
              y="46"
              fill={printMuted}
              fontFamily="monospace"
              fontSize="6.5"
              letterSpacing="1.5"
              textAnchor="middle"
            >
              SOLAR STUDY // EST. IN PROGRESS
            </text>
          </g>
        )}

        {design.id === 'work-in-motion' && (
          <g transform="translate(210, 225)">
            {/* Isometric Wireframe Box Graphic */}
            <g transform="translate(0, -18)">
              <polygon
                points="0,-32 30,-16 30,16 0,32 -30,16 -30,-16"
                fill="none"
                stroke={printAccent}
                strokeWidth="2.5"
              />
              <path
                d="M 0,-32 V 0 M 30,-16 L 0,0 M -30,-16 L 0,0 M 0,0 V 32"
                stroke={printPrimary}
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="7" fill={printAccent} />
            </g>
            <text
              x="0"
              y="34"
              fill={printPrimary}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="20"
              letterSpacing="1"
              textAnchor="middle"
            >
              WORK IN MOTION
            </text>
            <text
              x="0"
              y="46"
              fill={printMuted}
              fontFamily="monospace"
              fontSize="6.5"
              letterSpacing="1.2"
              textAnchor="middle"
            >
              CONTINUOUS APPAREL LAB
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

export function ConceptGallery({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<'Semua' | ConceptDesign['series']>(
    'Semua',
  );
  const [tones, setTones] = useState<Record<string, ShirtTone>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = compact
    ? conceptDesigns.slice(0, 3)
    : conceptDesigns.filter(
        (design) => filter === 'Semua' || design.series === filter,
      );

  return (
    <div className="retail-gallery">
      {!compact && (
        <div
          className="retail-filter-row"
          role="group"
          aria-label="Saring konsep berdasarkan koleksi"
        >
          {(['Semua', 'Studio Notes', 'Off-Duty'] as const).map((option) => (
            <button
              className={
                'retail-filter' + (filter === option ? ' is-selected' : '')
              }
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => {
                setFilter(option);
                setExpanded(null);
              }}
            >
              {option}
            </button>
          ))}
          <span className="retail-filter-count" aria-live="polite">
            {visible.length} konsep ditampilkan
          </span>
        </div>
      )}
      <div className="retail-products">
        {visible.map((design, index) => {
          const tone = tones[design.id] || 'ink';
          const open = expanded === design.id;
          const previewProduct = getPreviewProductBySlug(design.id);
          return (
            <article className="retail-product" key={design.id}>
              <div className={'retail-product-art art-' + design.palette}>
                <span className="retail-product-index">
                  {String(index + 1).padStart(2, '0')} / STUDY
                </span>
                <ShirtIllustration design={design} tone={tone} />
                <span className="retail-product-watermark">TS / SELECTS</span>
              </div>
              <div className="retail-product-info">
                <div>
                  <div className="retail-product-meta-row">
                    <span className="retail-product-series">
                      {design.series}
                    </span>
                    {previewProduct && (
                      <span className="retail-product-price-tag">
                        {formatIllustrativeShortPrice(
                          previewProduct.illustrativePriceIdr,
                        )}{' '}
                        <small>(Simulasi UX)</small>
                      </span>
                    )}
                  </div>
                  <h3>{design.name}</h3>
                  <p>{design.caption}</p>
                </div>
                <div
                  className="retail-swatch-row"
                  role="group"
                  aria-label={'Pilihan visual warna konsep ' + design.name}
                >
                  {(['ink', 'chalk'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        'retail-swatch retail-swatch-' +
                        color +
                        (tone === color ? ' selected' : '')
                      }
                      aria-label={
                        color === 'ink'
                          ? 'Lihat warna hijau gelap'
                          : 'Lihat warna krem'
                      }
                      aria-pressed={tone === color}
                      onClick={() =>
                        setTones((current) => ({
                          ...current,
                          [design.id]: color,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
              {previewProduct ? (
                <div className="retail-card-actions">
                  <Link
                    href={'/shop/' + design.id}
                    className="retail-product-pdp-link"
                    aria-label={'Buka halaman studi ' + design.name}
                  >
                    Detail Studi Produk <span aria-hidden="true">↗</span>
                  </Link>
                  <button
                    type="button"
                    className="retail-detail-toggle"
                    aria-expanded={open}
                    aria-controls={'detail-' + design.id}
                    onClick={() => setExpanded(open ? null : design.id)}
                  >
                    {open ? 'Tutup ringkasan' : 'Ringkasan'}
                    <span aria-hidden="true">{open ? '−' : '↓'}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="retail-detail-toggle"
                  aria-expanded={open}
                  aria-controls={'detail-' + design.id}
                  onClick={() => setExpanded(open ? null : design.id)}
                >
                  {open ? 'Tutup detail konsep' : 'Lihat detail konsep'}
                  <span aria-hidden="true">{open ? '−' : '↗'}</span>
                </button>
              )}
              {open && (
                <div
                  className="retail-inline-detail"
                  id={'detail-' + design.id}
                >
                  <p>
                    <strong>Konsep visual / eksplorasi desain.</strong> Belum
                    merupakan produk terverifikasi atau penawaran untuk dibeli.
                  </p>
                  <p>
                    Visual warna adalah simulasi. Foto produk, ukuran, bahan,
                    harga, dan ketersediaan akan ditampilkan setelah persetujuan
                    katalog.
                  </p>
                  {previewProduct && (
                    <Link
                      href={'/shop/' + design.id}
                      className="retail-inline-pdp-link"
                    >
                      Buka halaman produk dan uji opsi ukuran{' '}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  )}
                  <Link href="/support/contact">
                    Status informasi layanan <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {compact && (
        <div className="retail-gallery-end">
          <Link className="retail-text-link" href="/shop">
            Lihat semua studi koleksi <span aria-hidden="true">↗</span>
          </Link>
          <span>Konsep ilustratif • Belum tersedia untuk dibeli</span>
        </div>
      )}
    </div>
  );
}
