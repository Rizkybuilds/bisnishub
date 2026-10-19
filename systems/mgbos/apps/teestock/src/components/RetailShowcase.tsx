'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  { id: 'slow-sunday', name: 'Slow Sunday', series: 'Off-Duty', lineOne: 'SLOW', lineTwo: 'SUNDAY', caption: 'Ruang untuk bergerak lebih pelan.', palette: 'clay', motif: 'sun' },
  { id: 'making-things', name: 'Making Things', series: 'Studio Notes', lineOne: 'MAKING', lineTwo: 'THINGS', caption: 'Ide kecil, hari yang panjang.', palette: 'sage', motif: 'orbit' },
  { id: 'ordinary-magic', name: 'Ordinary Magic', series: 'Off-Duty', lineOne: 'ORDINARY', lineTwo: 'MAGIC', caption: 'Menemukan cerita di keseharian.', palette: 'lilac', motif: 'flower' },
  { id: 'stay-curious', name: 'Stay Curious', series: 'Studio Notes', lineOne: 'STAY', lineTwo: 'CURIOUS', caption: 'Rasa ingin tahu tidak pernah usang.', palette: 'sky', motif: 'waves' },
  { id: 'daylight-hours', name: 'Daylight Hours', series: 'Off-Duty', lineOne: 'DAYLIGHT', lineTwo: 'HOURS', caption: 'Untuk semua rencana yang spontan.', palette: 'butter', motif: 'spark' },
  { id: 'work-in-motion', name: 'Work in Motion', series: 'Studio Notes', lineOne: 'WORK IN', lineTwo: 'MOTION', caption: 'Selalu ada ruang untuk mencoba.', palette: 'rose', motif: 'grid' },
];

type ShirtTone = 'ink' | 'chalk';

export function ShirtIllustration({
  design,
  tone = 'ink',
  hero = false,
}: {
  design: ConceptDesign;
  tone?: ShirtTone;
  hero?: boolean;
}) {
  const fabric = tone === 'ink' ? '#263129' : '#f4f0e5';
  const stroke = tone === 'ink' ? '#16221b' : '#d4cdbd';
  const motif = tone === 'ink' ? '#f2eddc' : '#3a4235';
  const accent = tone === 'ink' ? '#c4dbac' : '#bd6345';
  const gradientId = 'fabric-' + design.id + '-' + tone + (hero ? '-hero' : '');

  return (
    <svg
      className="retail-shirt-svg"
      viewBox="0 0 420 430"
      role="img"
      aria-label={'Ilustrasi konsep kaos ' + design.name + ', warna ' + (tone === 'ink' ? 'gelap' : 'terang')}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="90%">
          <stop offset="0%" stopColor={tone === 'ink' ? '#445147' : '#ffffff'} />
          <stop offset="47%" stopColor={fabric} />
          <stop offset="100%" stopColor={tone === 'ink' ? '#1a2620' : '#ded8cc'} />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="397" rx="127" ry="16" fill="#101812" opacity=".11" />
      <path
        d="M139 56 L174 44 Q210 68 246 44 L281 56 L351 89 L373 163 L313 186 L291 145 L291 379 Q210 391 129 379 L129 145 L107 186 L47 163 L69 89 Z"
        fill={'url(#' + gradientId + ')'}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M173 45 Q210 95 247 45 L238 57 Q210 82 182 57 Z" fill={tone === 'ink' ? '#17251d' : '#d9d3c8'} stroke={stroke} strokeWidth="2" />
      <path d="M135 65 Q143 94 134 148 M286 65 Q277 94 286 148" fill="none" stroke={stroke} strokeWidth="2" opacity=".22" />
      <path d="M131 365 Q210 375 289 365" fill="none" stroke={stroke} strokeWidth="2" opacity=".35" />
      <g opacity=".96">
        {design.motif === 'sun' && (
          <>
            <circle cx="210" cy="179" r="43" fill={accent} />
            <path d="M168 188 H252 M174 200 H247" stroke={motif} strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {design.motif === 'orbit' && (
          <>
            <ellipse cx="210" cy="174" rx="70" ry="31" fill="none" stroke={accent} strokeWidth="8" transform="rotate(-25 210 174)" />
            <circle cx="210" cy="174" r="25" fill={motif} />
            <circle cx="266" cy="136" r="9" fill={accent} />
          </>
        )}
        {design.motif === 'flower' && (
          <>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="210" cy="141" rx="19" ry="34" fill={accent} transform={'rotate(' + a + ' 210 175)'} />
            ))}
            <circle cx="210" cy="175" r="20" fill={motif} />
          </>
        )}
        {design.motif === 'waves' && (
          <>
            <path d="M148 154 Q179 117 210 154 T272 154" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
            <path d="M148 178 Q179 141 210 178 T272 178" fill="none" stroke={motif} strokeWidth="10" strokeLinecap="round" />
            <path d="M148 201 Q179 164 210 201 T272 201" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          </>
        )}
        {design.motif === 'spark' && (
          <>
            <path d="M210 120 L224 158 L265 174 L224 190 L210 229 L195 190 L155 174 L195 158 Z" fill={accent} />
            <circle cx="155" cy="129" r="6" fill={motif} />
            <circle cx="266" cy="216" r="7" fill={motif} />
          </>
        )}
        {design.motif === 'grid' && (
          <>
            {[0, 1, 2, 3].map((n) => <path key={n} d={'M' + (164 + n * 30) + ' 128 V220'} stroke={accent} strokeWidth="3" />)}
            {[0, 1, 2, 3].map((n) => <path key={n} d={'M157 ' + (137 + n * 25) + ' H262'} stroke={accent} strokeWidth="3" />)}
            <circle cx="210" cy="174" r="23" fill={motif} />
          </>
        )}
        <text x="210" y="264" fill={motif} fontFamily="Arial, sans-serif" fontSize={design.lineOne.length > 7 ? '18' : '23'} fontWeight="800" letterSpacing="1.5" textAnchor="middle">{design.lineOne}</text>
        <text x="210" y="290" fill={motif} fontFamily="Arial, sans-serif" fontSize={design.lineTwo.length > 7 ? '18' : '23'} fontWeight="800" letterSpacing="1.5" textAnchor="middle">{design.lineTwo}</text>
        <text x="210" y="314" fill={motif} fontFamily="Arial, sans-serif" fontSize="8" letterSpacing="3" textAnchor="middle">TEESTOCK / STUDY</text>
      </g>
    </svg>
  );
}

export function ConceptGallery({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<'Semua' | ConceptDesign['series']>('Semua');
  const [tones, setTones] = useState<Record<string, ShirtTone>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = compact
    ? conceptDesigns.slice(0, 3)
    : conceptDesigns.filter((design) => filter === 'Semua' || design.series === filter);

  return (
    <div className="retail-gallery">
      {!compact && (
        <div className="retail-filter-row" role="group" aria-label="Saring konsep berdasarkan koleksi">
          {(['Semua', 'Studio Notes', 'Off-Duty'] as const).map((option) => (
            <button
              className={'retail-filter' + (filter === option ? ' is-selected' : '')}
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => { setFilter(option); setExpanded(null); }}
            >
              {option}
            </button>
          ))}
          <span className="retail-filter-count" aria-live="polite">{visible.length} konsep ditampilkan</span>
        </div>
      )}
      <div className="retail-products">
        {visible.map((design, index) => {
          const tone = tones[design.id] || 'ink';
          const open = expanded === design.id;
          return (
            <article className="retail-product" key={design.id}>
              <div className={'retail-product-art art-' + design.palette}>
                <span className="retail-product-index">{String(index + 1).padStart(2, '0')} / STUDY</span>
                <ShirtIllustration design={design} tone={tone} />
                <span className="retail-product-watermark">TS / SELECTS</span>
              </div>
              <div className="retail-product-info">
                <div>
                  <span className="retail-product-series">{design.series}</span>
                  <h3>{design.name}</h3>
                  <p>{design.caption}</p>
                </div>
                <div className="retail-swatch-row" role="group" aria-label={'Pilihan visual warna konsep ' + design.name}>
                  {(['ink', 'chalk'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={'retail-swatch retail-swatch-' + color + (tone === color ? ' selected' : '')}
                      aria-label={color === 'ink' ? 'Lihat warna hijau gelap' : 'Lihat warna krem'}
                      aria-pressed={tone === color}
                      onClick={() => setTones((current) => ({ ...current, [design.id]: color }))}
                    />
                  ))}
                </div>
              </div>
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
              {open && (
                <div className="retail-inline-detail" id={'detail-' + design.id}>
                  <p><strong>Konsep visual / eksplorasi desain.</strong> Belum merupakan produk terverifikasi atau penawaran untuk dibeli.</p>
                  <p>Visual warna adalah simulasi. Foto produk, ukuran, bahan, harga, dan ketersediaan akan ditampilkan setelah persetujuan katalog.</p>
                  <Link href="/support/contact">Status informasi layanan <span aria-hidden="true">↗</span></Link>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {compact && (
        <div className="retail-gallery-end">
          <Link className="retail-text-link" href="/shop">Lihat semua studi koleksi <span aria-hidden="true">↗</span></Link>
          <span>Konsep ilustratif • Belum tersedia untuk dibeli</span>
        </div>
      )}
    </div>
  );
}