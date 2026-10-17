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
              kurasi material, tinjauan proses transparan, dan kejelasan alur
              pemesanan.
            </p>
          </div>

          <div>
            <h3 className="footer-col-title">Layanan</h3>
            <ul className="footer-links">
              <li>
                <Link href="/custom">Custom Apparel</Link>
              </li>
              <li>
                <Link href="/custom-atelier">Custom Atelier</Link>
              </li>
              <li>
                <Link href="/business">Solusi Bisnis &amp; B2B</Link>
              </li>
              <li>
                <Link href="/support/contact">Bantuan &amp; Kontak</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Katalog &amp; Informasi</h3>
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
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} TeeStock. Seluruh hak cipta dilindungi.
          </div>
          <div>Informasi layanan &amp; konsultasi terpandu.</div>
        </div>
      </div>
    </footer>
  );
}
