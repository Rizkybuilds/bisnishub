import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'TeeStock',
  description: 'MGBOS repository foundation',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
