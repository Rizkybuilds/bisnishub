import type { Metadata } from 'next';
import './globals.css';
import './retail.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DemoCartProvider } from '../features/demo-commerce';

export const metadata: Metadata = {
  title: {
    default: 'TeeStock — Curated Everyday Apparel',
    template: '%s | TeeStock',
  },
  description:
    'Jelajahi TeeStock Selects, eksplorasi graphic apparel untuk keseharian. Saat ini koleksi masih berupa preview visual dan belum tersedia untuk dibeli.',
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
        <DemoCartProvider>
          <Header />
          <main id="main-content" className="site-main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </DemoCartProvider>
      </body>
    </html>
  );
}
