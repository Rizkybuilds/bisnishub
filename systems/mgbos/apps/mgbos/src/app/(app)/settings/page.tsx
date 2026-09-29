import { requireAuth } from '@/lib/session.server';

export const metadata = {
  title: 'Holding Configuration — MultiGraph Business OS',
};

const BRANDS = [
  {
    code: 'TS',
    name: 'TeeStock',
    slug: 'teestock',
    domain: 'teestockapparel.com',
    desc: 'Everyday Curated Graphic Apparel & Merch House',
  },
  {
    code: 'MG',
    name: 'MultiGraph',
    slug: 'multigraph',
    domain: 'multigraph.id',
    desc: 'General & Commercial Printing Partner',
  },
  {
    code: 'NP',
    name: 'NeoPack',
    slug: 'neopack',
    domain: 'neopack.id',
    desc: 'Retail & Food Packaging Solution',
  },
  {
    code: 'PP',
    name: 'Pack Point',
    slug: 'packpoint',
    domain: 'packpoint.id',
    desc: 'Corrugated Box & Industrial Packaging',
  },
  {
    code: 'SQ',
    name: 'Squeegee Studios',
    slug: 'squeegee',
    domain: 'squeegeestudios.com',
    desc: 'High-volume Screen Printing Studio',
  },
];

const CHANNELS = [
  { code: 'WHATSAPP', name: 'WhatsApp Official', type: 'MESSAGING' },
  { code: 'WEBSITE', name: 'Official Website Storefront', type: 'WEB' },
  { code: 'INSTAGRAM_DM', name: 'Instagram Direct Message', type: 'SOCIAL' },
  { code: 'DIRECT_SALES', name: 'Direct Sales & Offline', type: 'DIRECT' },
  { code: 'MARKETPLACE', name: 'Online Marketplace', type: 'MARKETPLACE' },
];

const ROLES = [
  {
    code: 'OWNER',
    name: 'Owner',
    desc: 'Founder & Executive Sole Decision Maker with full system control',
  },
  {
    code: 'ADMIN',
    name: 'Administrator',
    desc: 'General Operations & System Configuration Administrator',
  },
  {
    code: 'SALES',
    name: 'Sales Representative',
    desc: 'Leads ingestion, qualification, and quoter negotiation',
  },
  {
    code: 'OPERATIONS',
    name: 'Operations Specialist',
    desc: 'Production routing, vendor assignments, and fulfillment',
  },
  {
    code: 'FINANCE',
    name: 'Finance Specialist',
    desc: 'Invoicing, payment recording, and analytical margin ledger',
  },
  {
    code: 'QC',
    name: 'QC Inspector',
    desc: 'Quality control checklist and defect audit inspection',
  },
];

export default async function SettingsPage() {
  const session = await requireAuth();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <small style={{ color: '#38bdf8', fontWeight: 600 }}>
          MGBOS-002 / HOLDING CONFIGURATION
        </small>
        <h1
          style={{ fontSize: '1.85rem', margin: '6px 0 8px', color: '#f8fafc' }}
        >
          Multi-Brand Holding Configuration
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
          Konfigurasi entitas organisasi, brand operasional, kanal transaksi,
          dan peran otoritas sistem.
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">1. Organisasi Induk (Holding)</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
            >
              NAMA RESMI
            </div>
            <div
              style={{ fontSize: '1rem', color: '#f1f5f9', fontWeight: 600 }}
            >
              {session.organization.displayName}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
            >
              KODE ORGANISASI
            </div>
            <div
              style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 600 }}
            >
              {session.organization.code}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
            >
              ZONA WAKTU
            </div>
            <div style={{ fontSize: '1rem', color: '#f1f5f9' }}>
              Asia/Jakarta (WIB)
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
            >
              MATA UANG DASAR
            </div>
            <div style={{ fontSize: '1rem', color: '#f1f5f9' }}>
              IDR (Rupiah Penuh - BigInt)
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">2. Core Brands (5 Pilar Usaha)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>KODE</th>
                <th>NAMA BRAND</th>
                <th>DOMAIN UTAMA</th>
                <th>DESKRIPSI OPERASIONAL</th>
              </tr>
            </thead>
            <tbody>
              {BRANDS.map((brand) => (
                <tr key={brand.code}>
                  <td style={{ fontWeight: 700, color: '#38bdf8' }}>
                    {brand.code}
                  </td>
                  <td style={{ fontWeight: 600 }}>{brand.name}</td>
                  <td>
                    <code>{brand.domain}</code>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {brand.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">3. Kanal Transaksi (Channels)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>KODE</th>
                <th>NAMA KANAL</th>
                <th>TIPE KANAL</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((ch) => (
                <tr key={ch.code}>
                  <td style={{ fontWeight: 700, color: '#4ade80' }}>
                    {ch.code}
                  </td>
                  <td>{ch.name}</td>
                  <td>
                    <span className="topbar-badge">{ch.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">4. Peran Akses &amp; Otoritas (Roles)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>KODE</th>
                <th>NAMA PERAN</th>
                <th>DESKRIPSI TANGGUNG JAWAB</th>
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.code}>
                  <td style={{ fontWeight: 700, color: '#facc15' }}>
                    {r.code}
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {r.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
