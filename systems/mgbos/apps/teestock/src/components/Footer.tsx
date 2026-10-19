import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer retail-footer">
      <div className="retail-wrap">
        <div className="retail-footer-intro">
          <span className="retail-overline">A BETTER EVERYDAY STARTS HERE</span>
          <strong>TeeStock<span aria-hidden="true">✳</span></strong>
          <p>Curated apparel for everyday stories. Koleksi pilihan, ide yang personal, dan pengalaman yang dipikirkan dengan baik.</p>
        </div>
        <div className="retail-footer-cols">
          <div>
            <h3>Explore</h3>
            <Link href="/shop">The Edit</Link>
            <Link href="/">Our Story</Link>
          </div>
          <div>
            <h3>Services</h3>
            <Link href="/custom">Custom Apparel</Link>
            <Link href="/business">For Business</Link>
            <Link href="/custom-atelier">Custom Atelier</Link>
          </div>
          <div>
            <h3>Information</h3>
            <Link href="/support/contact">Bantuan &amp; Kontak</Link>
            <span>Retail collection preview</span>
            <span>Pemesanan belum dibuka</span>
          </div>
        </div>
        <div className="retail-footer-bottom">
          <span>© {new Date().getFullYear()} TeeStock. All rights reserved.</span>
          <span>DESIGNED WITH INTENTION / MADE FOR EVERYDAY</span>
        </div>
      </div>
    </footer>
  );
}
