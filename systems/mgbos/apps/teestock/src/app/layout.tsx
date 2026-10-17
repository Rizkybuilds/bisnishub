import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'TeeStock — Apparel Ecosystem & Production',
    template: '%s | TeeStock',
  },
  description:
    'Ekosistem produksi dan kustomisasi apparel terpadu untuk kebutuhan personal, brand, dan pengadaan organisasi.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a href="#main-content" className="skip-link">
          Menuju ke konten utama
        </a>
        <Header />
        <main id="main-content" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
