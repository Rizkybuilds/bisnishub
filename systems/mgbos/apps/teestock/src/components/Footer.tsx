import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer retail-footer ts-r1-footer">
      <div className="retail-wrap">
        <div className="ts-r1-footer-main">
          <div className="ts-r1-footer-identity">
            <span className="ts-r1-kicker">
              TEESTOCK / INDEPENDENT APPAREL STUDIO
            </span>
            <strong className="ts-r1-footer-wordmark">TeeStock</strong>
            <p>Good design, worn daily. A wardrobe for ideas worth keeping.</p>
          </div>
          <nav className="ts-r1-footer-nav" aria-label="Footer navigation">
            <div>
              <h2>Explore</h2>
              <Link href="/shop">
                The Edit <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/shop#studio-studies">
                Studio archive <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/#retail-story">
                Our point of view <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div>
              <h2>More from TeeStock</h2>
              <Link href="/custom">Custom apparel</Link>
              <Link href="/business">For business</Link>
              <Link href="/support/contact">Help &amp; contact</Link>
            </div>
            <div>
              <h2>Current status</h2>
              <p>Retail collection preview</p>
              <p>Pemesanan belum dibuka</p>
              <Link href="/shop">
                View the studio studies <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </nav>
        </div>
        <div className="ts-r1-footer-bottom">
          <span>
            © {new Date().getFullYear()} TEESTOCK. ALL RIGHTS RESERVED.
          </span>
          <span>DESIGNED TO BE WORN. MADE TO MEAN SOMETHING.</span>
          <Link href="#main-content">BACK TO TOP ↑</Link>
        </div>
      </div>
    </footer>
  );
}
