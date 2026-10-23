'use client';

import { useState } from 'react';
import Link from 'next/link';

type DirectionKey = 'neo-brutalist' | 'craft-atelier' | 'bento-tech';

interface DirectionConfig {
  key: DirectionKey;
  name: string;
  subtitle: string;
  inspiration: string;
  vibes: string[];
  tokens: {
    bg: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    badgeBg: string;
    badgeText: string;
  };
  typography: {
    fontFamily: string;
    headingStyle: string;
    monoStyle: string;
    bodyStyle: string;
  };
  sampleHeadline: string;
  sampleSubhead: string;
}

const directions: Record<DirectionKey, DirectionConfig> = {
  'neo-brutalist': {
    key: 'neo-brutalist',
    name: '01 / Neo-Brutalist Streetwear',
    subtitle: 'Raw, High-Contrast, Hype & Acid Accent',
    inspiration: 'Dribbble Trending Streetwear, Stüssy, Brain Dead, Dover Street Market',
    vibes: ['Industrial Grid', 'Acid Lime (#C8F902)', 'Sharp 0-2px Radius', 'Technical Monospace'],
    tokens: {
      bg: '#0a0a0c',
      surface: '#131417',
      border: '#2a2c33',
      textPrimary: '#ffffff',
      textSecondary: '#8a8f98',
      accent: '#c8f902',
      accentHover: '#b5e000',
      badgeBg: '#1c1f10',
      badgeText: '#c8f902',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      headingStyle: 'font-extrabold tracking-tighter uppercase',
      monoStyle: 'font-mono text-xs uppercase tracking-widest',
      bodyStyle: 'text-sm leading-relaxed',
    },
    sampleHeadline: 'CURATED GRAPHIC APPAREL / NO BULLSHIT',
    sampleSubhead: 'Drop 01 aktif. Cotton Combed 24s heavy-duty, sablon DTF 155°C curing ganda. Royalti kreator Rp 24k flat.',
  },
  'craft-atelier': {
    key: 'craft-atelier',
    name: '02 / Modern Craft Atelier',
    subtitle: 'Quiet Luxury, Warm Paper, Refined Editorial',
    inspiration: 'Cotton Bureau 2026, Aimé Leon Dore, Studio Nicholson, Kinfolk',
    vibes: ['Warm Alabaster (#FBFBF9)', 'Terracotta (#B8533B)', 'Serif Italic Headlines', 'Generous Whitespace'],
    tokens: {
      bg: '#fbfbf9',
      surface: '#ffffff',
      border: '#e6e1d8',
      textPrimary: '#1a1918',
      textSecondary: '#6e6a64',
      accent: '#b8533b',
      accentHover: '#9c432d',
      badgeBg: '#f5ebe6',
      badgeText: '#b8533b',
    },
    typography: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      headingStyle: 'font-normal tracking-tight',
      monoStyle: 'font-sans text-xs tracking-wider uppercase',
      bodyStyle: 'text-sm font-sans leading-relaxed',
    },
    sampleHeadline: 'Everyday wear, crafted with intention.',
    sampleSubhead: 'Kurasi karya visual desainer Indonesia dalam kanvas garmen berkualitas tinggi. Lembut, bernapas, dan tahan lama.',
  },
  'bento-tech': {
    key: 'bento-tech',
    name: '03 / Bento-Tech Merch Engine',
    subtitle: 'Modular Glass, Precision Metrics, 21st.dev / Linear Vibe',
    inspiration: '21st.dev Components, Linear.app, Teenage Engineering, Vercel',
    vibes: ['Pitch Dark (#09090b)', 'Electric Cyan / Blue (#38bdf8)', 'Frosted Glass Cards', 'Subtle Glows & Bento Grid'],
    tokens: {
      bg: '#09090b',
      surface: '#121217',
      border: '#27272a',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      accent: '#38bdf8',
      accentHover: '#0ea5e9',
      badgeBg: '#082f49',
      badgeText: '#38bdf8',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingStyle: 'font-bold tracking-tight',
      monoStyle: 'font-mono text-xs tracking-tight',
      bodyStyle: 'text-sm text-zinc-400 leading-relaxed',
    },
    sampleHeadline: 'The Next-Gen Merch & Apparel Engine.',
    sampleSubhead: 'Cetak on-demand zero stock dengan arsitektur ERP real-time. Hitung HPP, margin laba bersih, dan automasi resi ekspedisi.',
  },
};

export default function DesignSystemExplorationPage() {
  const [selectedKey, setSelectedKey] = useState<DirectionKey>('neo-brutalist');
  const [activeSize, setActiveSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const current = directions[selectedKey];
  const t = current.tokens;

  return (
    <div style={{ minHeight: '100vh', background: '#0e1013', color: '#e2e8f0', padding: '32px 16px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header / Context Switcher */}
      <div style={{ maxWidth: 1280, margin: '0 auto 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #232730', paddingBottom: 20 }}>
          <div>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
              LAB EKSPLORASI UI/UX &amp; DESIGN SYSTEM TEESTOCK
            </span>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Perbandingan 3 Arah Desain Global (Dribbble &amp; 21st.dev)
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Beralih secara live antar 3 arah gaya visual untuk melihat perbedaan warna, tipografi, komponen kartu produk, dan 3 pintu masuk ekosistem.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b', marginRight: 4 }}>Simulasi Viewport:</span>
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              style={{
                background: viewMode === 'desktop' ? '#38bdf8' : '#1e2430',
                color: viewMode === 'desktop' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: 4,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🖥️ Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              style={{
                background: viewMode === 'mobile' ? '#38bdf8' : '#1e2430',
                color: viewMode === 'mobile' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: 4,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              📱 Mobile (375px)
            </button>
          </div>
        </div>

        {/* 3 Interactive Tab Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14, margin: '20px 0 32px' }}>
          {(Object.keys(directions) as DirectionKey[]).map((key) => {
            const dir = directions[key];
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                style={{
                  background: isSelected ? '#1b2230' : '#12161f',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid #232730',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isSelected && (
                  <span style={{ position: 'absolute', top: 10, right: 10, background: '#38bdf8', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                    AKTIF DIPILIH
                  </span>
                )}
                <span style={{ fontSize: 11, color: isSelected ? '#38bdf8' : '#64748b', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                  {dir.name.split('/')[0]}
                </span>
                <strong style={{ fontSize: 16, color: '#ffffff', display: 'block', margin: '4px 0 2px' }}>
                  {dir.name.split('/')[1]?.trim()}
                </strong>
                <span style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 10 }}>
                  {dir.subtitle}
                </span>

                {/* Color Swatch Preview Dots */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: dir.tokens.bg, border: '1px solid #475569' }} title="Background" />
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: dir.tokens.surface, border: '1px solid #475569' }} title="Surface Card" />
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: dir.tokens.accent }} title="Accent" />
                  <span style={{ fontSize: 11, color: '#64748b', marginLeft: 4 }}>{dir.tokens.accent}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div
        style={{
          maxWidth: viewMode === 'desktop' ? 1280 : 420,
          margin: '0 auto',
          background: t.bg,
          color: t.textPrimary,
          border: `1px solid ${t.border}`,
          borderRadius: viewMode === 'mobile' ? 24 : 12,
          padding: viewMode === 'mobile' ? '24px 16px' : '40px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Direction Specification Meta Banner */}
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.accent, fontWeight: 800 }}>
              INSPIRASI: {current.inspiration}
            </span>
            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>
              Vibes: {current.vibes.join(' • ')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, background: t.badgeBg, color: t.badgeText, padding: '4px 10px', borderRadius: 4, fontWeight: 700 }}>
              Aksen: {t.accent}
            </span>
            <span style={{ fontSize: 11, background: t.surface, color: t.textSecondary, border: `1px solid ${t.border}`, padding: '4px 10px', borderRadius: 4, fontFamily: 'monospace' }}>
              BG: {t.bg}
            </span>
          </div>
        </div>

        {/* 1. Brand Navbar Mock */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${t.border}`,
            paddingBottom: 16,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: '-0.06em',
                color: t.textPrimary,
                fontFamily: current.typography.fontFamily,
              }}
            >
              TEESTOCK<span style={{ color: t.accent }}>.</span>
            </span>
            <span
              style={{
                fontSize: 10,
                background: t.badgeBg,
                color: t.badgeText,
                padding: '2px 6px',
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 4,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              EST. 2026
            </span>
          </div>

          <div style={{ display: viewMode === 'mobile' ? 'none' : 'flex', gap: 20, fontSize: 13 }}>
            <span style={{ color: t.textPrimary, fontWeight: 700, cursor: 'pointer' }}>Shop (The Edit)</span>
            <span style={{ color: t.textSecondary, cursor: 'pointer' }}>Creator Hub</span>
            <span style={{ color: t.textSecondary, cursor: 'pointer' }}>Reseller</span>
            <span style={{ color: t.textSecondary, cursor: 'pointer' }}>Standar Cetak</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={{
                background: t.accent,
                color: selectedKey === 'craft-atelier' ? '#ffffff' : '#000000',
                border: 'none',
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 6,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: selectedKey === 'neo-brutalist' ? '0.05em' : 'normal',
                textTransform: selectedKey === 'neo-brutalist' ? 'uppercase' : 'none',
              }}
            >
              Jelajahi Katalog ↗
            </button>
          </div>
        </nav>

        {/* 2. Hero Section Mock */}
        <section style={{ marginBottom: 44 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: t.accent,
              fontWeight: 800,
              display: 'block',
              marginBottom: 8,
              fontFamily: 'monospace',
            }}
          >
            [STUDIO RELEASE 001 / CURATED STREETWEAR]
          </span>
          <h2
            style={{
              fontSize: viewMode === 'mobile' ? 28 : selectedKey === 'craft-atelier' ? 44 : 52,
              lineHeight: 1.05,
              margin: '0 0 16px',
              fontFamily: current.typography.fontFamily,
              color: t.textPrimary,
              letterSpacing: selectedKey === 'craft-atelier' ? '-0.02em' : '-0.05em',
            }}
          >
            {current.sampleHeadline}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: t.textSecondary,
              maxWidth: 620,
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            {current.sampleSubhead}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={{
                background: t.accent,
                color: selectedKey === 'craft-atelier' ? '#ffffff' : '#000000',
                border: 'none',
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 6,
                padding: '12px 24px',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Lihat Katalog Ritel (Rp 99.000)
            </button>
            <button
              type="button"
              style={{
                background: 'transparent',
                color: t.textPrimary,
                border: `1px solid ${t.border}`,
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 6,
                padding: '12px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ajukan Desain (Royalti Rp 24k)
            </button>
          </div>
        </section>

        {/* 3. The 3 Core Portal Doors in This Design System */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: t.textPrimary }}>
              Tiga Pintu Ekosistem
            </h3>
            <span style={{ fontSize: 11, color: t.textSecondary, fontFamily: 'monospace' }}>
              ENTRY_POINTS.CONFIG
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'mobile' ? '1fr' : 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {/* Door 1: Retail Shop */}
            <div
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 10, color: t.accent, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  01 / RETAIL SHOP
                </span>
                <strong style={{ fontSize: 18, color: t.textPrimary, display: 'block', margin: '8px 0 6px' }}>
                  The Curated Edit
                </strong>
                <p style={{ fontSize: 12, color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  Katalog kaos grafis harian. Combed 24s, sablon DTF tahan cuci, promo voucher aktif.
                </p>
              </div>
              <div style={{ marginTop: 20, paddingTop: 12, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>Buka Shop</span>
                <span style={{ color: t.accent, fontWeight: 800 }}>↗</span>
              </div>
            </div>

            {/* Door 2: Creator Merch Hub */}
            <div
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 10, color: t.accent, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  02 / CREATOR MERCH
                </span>
                <strong style={{ fontSize: 18, color: t.textPrimary, display: 'block', margin: '8px 0 6px' }}>
                  Cotton Bureau Model
                </strong>
                <p style={{ fontSize: 12, color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  Nol modal awal. Kami yang urus produksi dan cetak, kamu terima royalti Rp 24.000/pcs.
                </p>
              </div>
              <div style={{ marginTop: 20, paddingTop: 12, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>Ajukan Desain</span>
                <span style={{ color: t.accent, fontWeight: 800 }}>↗</span>
              </div>
            </div>

            {/* Door 3: Reseller Dropship */}
            <div
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: selectedKey === 'neo-brutalist' ? 0 : 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 10, color: t.accent, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  03 / WHITE-LABEL DROPSHIP
                </span>
                <strong style={{ fontSize: 18, color: t.textPrimary, display: 'block', margin: '8px 0 6px' }}>
                  Modal Grosir Rp 75k
                </strong>
                <p style={{ fontSize: 12, color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  Untuk seller TikTok &amp; Shopee. Kemasan polos, resi atas nama tokomu, bebas atur harga.
                </p>
              </div>
              <div style={{ marginTop: 20, paddingTop: 12, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>Daftar Reseller</span>
                <span style={{ color: t.accent, fontWeight: 800 }}>↗</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Product Card Component Demo */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: t.textPrimary }}>
              Komponen Kartu Produk (PDP / PLP Card)
            </h3>
            <span style={{ fontSize: 11, color: t.textSecondary, fontFamily: 'monospace' }}>
              COMPONENT: &lt;ProductHypeCard /&gt;
            </span>
          </div>

          <div
            style={{
              maxWidth: 420,
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: selectedKey === 'neo-brutalist' ? 0 : 10,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Visual Canvas Mock */}
            <div
              style={{
                height: 240,
                background: selectedKey === 'neo-brutalist' ? '#18191e' : selectedKey === 'craft-atelier' ? '#ede9e1' : '#18181b',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                padding: 16,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: t.badgeBg,
                  color: t.badgeText,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: selectedKey === 'neo-brutalist' ? 0 : 4,
                  fontFamily: 'monospace',
                }}
              >
                LIMITED CAPSULE
              </span>

              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  fontSize: 10,
                  padding: '3px 6px',
                  borderRadius: 4,
                  backdropFilter: 'blur(4px)',
                }}
              >
                PROMO: HEMAT10
              </span>

              {/* T-Shirt Graphic Icon / Art */}
              <div style={{ fontSize: 64, filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.3))' }}>
                👕
              </div>
              <span style={{ fontSize: 11, color: t.textSecondary, marginTop: 8, fontFamily: 'monospace' }}>
                [COTTON COMBED 24S / BLACK VINTAGE]
              </span>
            </div>

            {/* Product Details & Actions */}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <strong style={{ fontSize: 16, color: t.textPrimary }}>
                  Slow Sunday — Botanical Edition
                </strong>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, textDecoration: 'line-through', color: t.textSecondary, display: 'block' }}>
                    Rp 129.000
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: t.accent }}>
                    Rp 99.000
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: t.textSecondary, margin: '0 0 16px', lineHeight: 1.5 }}>
                Grafis terkurasi desainer indie. Sablon DTF elastis double-press 155°C, bebas pecah dicuci mesin.
              </p>

              {/* Quick Size Selector */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: t.textSecondary, display: 'block', marginBottom: 6, fontWeight: 700 }}>
                  PILIH UKURAN:
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setActiveSize(size)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: selectedKey === 'neo-brutalist' ? 0 : 4,
                        border: activeSize === size ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
                        background: activeSize === size ? t.accent : 'transparent',
                        color: activeSize === size ? (selectedKey === 'craft-atelier' ? '#fff' : '#000') : t.textPrimary,
                        cursor: 'pointer',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order via WhatsApp Direct CTA */}
              <button
                type="button"
                style={{
                  width: '100%',
                  background: t.accent,
                  color: selectedKey === 'craft-atelier' ? '#ffffff' : '#000000',
                  border: 'none',
                  borderRadius: selectedKey === 'neo-brutalist' ? 0 : 6,
                  padding: '10px 0',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>💬 Pesan Langsung via WhatsApp ({activeSize})</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. Tradeoff & Recommendation Card */}
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: 20,
            fontSize: 13,
            color: t.textSecondary,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: t.textPrimary, display: 'block', marginBottom: 6, fontSize: 14 }}>
            💡 Analisis Karakter &amp; Rekomendasi untuk TeeStock:
          </strong>
          {selectedKey === 'neo-brutalist' && (
            <p style={{ margin: 0 }}>
              <strong>Kekuatan:</strong> Sangat disukai oleh audiens streetwear muda (Gen Z, komunitas distro/hypebeast, desainer grafis). Kontras tinggi membuat visual kaos dan warna sablon DTF langsung mencolok di layar monitor &amp; HP.<br />
              <strong>Catatan:</strong> Tone terasa lebih agresif dan rebel; cocok jika TeeStock ingin tampil sebagai independent street brand sekelas Stüssy / Brain Dead.
            </p>
          )}
          {selectedKey === 'craft-atelier' && (
            <p style={{ margin: 0 }}>
              <strong>Kekuatan:</strong> Sangat dekat dengan DNA asli Cotton Bureau &amp; Aimé Leon Dore. Menonjolkan keahlian 7 tahun pra-cetak, rasa kain premium, dan nilai kurasi karya seni visual.<br />
              <strong>Catatan:</strong> Nuansa hangat (warm paper &amp; terracotta) memberikan rasa nyaman dan eksklusif, sangat tepat jika targetnya adalah pecinta seni grafis dan pembeli mature yang mementingkan kualitas bahan.
            </p>
          )}
          {selectedKey === 'bento-tech' && (
            <p style={{ margin: 0 }}>
              <strong>Kekuatan:</strong> Memberikan kesan platform modern super canggih seperti Linear / 21st.dev / Vercel. Sangat kuat untuk meyakinkan Reseller &amp; Dropshipper bahwa sistem ERP TeeStock cepat, otomatis, dan transparan.<br />
              <strong>Catatan:</strong> Cocok jika TeeStock ingin mengedepankan identitas sebagai &quot;Tech-Enabled Apparel Engine&quot; di mana pembeli ritel, kreator, dan reseller saling terhubung lewat sistem presisi tinggi.
            </p>
          )}
        </div>
      </div>

      {/* Footer Navigation Back to App */}
      <div style={{ maxWidth: 1280, margin: '32px auto 0', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'underline' }}>
          ← Kembali ke Beranda TeeStock
        </Link>
      </div>
    </div>
  );
}
