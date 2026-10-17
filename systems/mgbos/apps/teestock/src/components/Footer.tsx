import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-logo" style={{ marginBottom: '12px' }}>
              <span>TeeStock</span>
              <span className="brand-tag">Apparel</span>
            </div>
            <p
              style={{
                maxWidth: '380px',
                fontSize: '0.9rem',
                marginBottom: '16px',
              }}
            >
              Ekosistem produksi dan kustomisasi apparel terpadu dengan standar
              kualitas terkurasi, tinjauan proses manusia yang transparan, dan
              orientasi kebutuhan yang jelas.
            </p>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-ink-subtle)',
              }}
            >
              Bagian dari platform bisnis MultiGraph Business OS (MGBOS).
            </p>
          </div>

          <div>
            <h3 className="footer-col-title">Layanan</h3>
            <ul className="footer-links">
              <li>
                <Link href="/custom">Custom Apparel</Link>
              </li>
              <li>
                <Link href="/custom-atelier">Custom Atelier (Deep Link)</Link>
              </li>
              <li>
                <Link href="/business">Solusi Bisnis & B2B</Link>
              </li>
              <li>
                <Link href="/support/contact">Bantuan & Kontak</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Katalog & Sistem</h3>
            <ul className="footer-links">
              <li>
                <span style={{ color: 'var(--color-ink-subtle)' }}>
                  Shop (Katalog Ritel — Segera)
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--color-ink-subtle)' }}>
                  Build Merch (Dalam Pengembangan)
                </span>
              </li>
              <li>
                <Link href="/health">Status Sistem (/health)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} TeeStock. Seluruh hak cipta dilindungi.
          </div>
          <div>
            Fase CX-S0-A: Pengenalan informasi &amp; konsultasi terpandu.
          </div>
        </div>
      </div>
    </footer>
  );
}
