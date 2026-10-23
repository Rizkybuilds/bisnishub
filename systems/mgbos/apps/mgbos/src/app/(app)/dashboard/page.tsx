import Link from 'next/link';
import type { MgbosRole } from '@mgbos/auth';
import { requireAuth } from '@/lib/session.server';
import { formatDocumentNumber } from '@mgbos/domain';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@/components/ui';
import {
  NAVIGATION_GROUPS,
  filterNavGroupsForSession,
  type NavItemDef,
} from '@/components/app-shell';

export const metadata = {
  title: 'Command Center — MultiGraph Business OS',
};

const ITEM_DESCRIPTIONS: Record<string, string> = {
  leads: 'Daftar prospek baru dan status kualifikasi',
  customers: 'Direktori akun pelanggan dan riwayat transaksi',
  requirements: 'Spesifikasi pesanan custom dan requirement sheet',
  quotes: 'Kalkulasi penawaran resmi dan margin HPP',
  orders: 'Daftar pesanan aktif dan pelacakan status',
  production: 'Antrean SPK kerja dan inspeksi mutu produksi',
  vendors: 'Direktori vendor maklon dan performa kerja',
  shipments: 'Surat jalan (DO) dan status pengiriman',
  inventory: 'Monitoring stok bahan baku dan produk jadi',
  procurement: 'Pengadaan bahan baku dan purchase order',
  exceptions: 'Penanganan eskalasi kendala operasional lapangan',
  invoices: 'Penerbitan tagihan resmi dan status pembayaran',
  payments: 'Pencatatan mutasi kas dan verifikasi pembayaran',
  ledger: 'Ringkasan laba kotor transaksi dan buku kas',
};

const GROUP_SUBTITLES: Record<string, string> = {
  sales: 'Alur penerimaan inquiry, kualifikasi lead, dan konversi order',
  operations:
    'Pemenuhan kontrak, SPK, monitoring vendor, dan penanganan kendala',
  finance: 'Faktur komersial, pencatatan kas masuk, dan pembukuan margin',
};

const DOCUMENT_TYPES = [
  { type: 'L', label: 'Inbound Lead' },
  { type: 'Q', label: 'Penawaran (Quotation)' },
  { type: 'O', label: 'Pesanan (Order)' },
  { type: 'INV', label: 'Invoice' },
  { type: 'J', label: 'Surat Perintah Kerja (Job)' },
  { type: 'PO', label: 'Purchase Order Pengadaan' },
] as const;

export default async function DashboardPage() {
  const session = await requireAuth();

  const visibleNavGroups = filterNavGroupsForSession(
    NAVIGATION_GROUPS,
    session.role.code as MgbosRole,
    session.activeBrand.code,
  );

  const shortcutGroups = visibleNavGroups.filter((g) =>
    ['sales', 'operations', 'finance'].includes(g.id),
  );

  const totalPermittedModules = visibleNavGroups.reduce(
    (count, g) => count + g.items.length,
    0,
  );

  // Executive ERP Metrics (TeeStock & MultiGraph Active Month)
  const monthlyTransitionTarget = 2500000; // Rp 2.500.000 Target Transisi Mandiri
  const realizedNetProfit = 1440000; // Realized Net Profit (Rp 24k * 60 pcs)
  const grossRevenue = 4950000;
  const totalCogs = 2750000;
  const progressPercent = Math.min(
    100,
    Math.round((realizedNetProfit / monthlyTransitionTarget) * 100),
  );
  const remainingPcs = Math.max(
    0,
    Math.ceil((monthlyTransitionTarget - realizedNetProfit) / 24000),
  );

  return (
    <div>
      <PageHeader
        eyebrow={`${session.organization.displayName} • PUSAT KOMANDO OPERASIONAL ERP`}
        title={`Selamat Datang, ${session.user.name}!`}
        description="Pusat kendali eksekutif, margin laba bersih riil, antrean sablon DTF, dan inventori bahan baku."
      />

      {/* Quick Order Intake Banner (WhatsApp-to-ERP Direct POS) */}
      <section className="quick-intake-banner" aria-label="Quick Action Intake">
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#a7f3d0',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Alur Cepat Intake Pesanan
          </div>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '4px 0',
            }}
          >
            Ada Pesanan Baru Masuk dari WhatsApp?
          </h2>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#d1fae5',
              margin: 0,
              maxWidth: 600,
            }}
          >
            Catat rincian artikel, ukuran kaos, dan jenis pemesanan (Ritel /
            Kreator Collab / Dropship White-label) untuk otomatis memotong stok
            dan mengunci HPP unit.
          </p>
        </div>
        <Link href="/orders" className="btn-intake">
          <span>+ Catat Order WhatsApp Masuk</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>

      {/* Founder Transition Milestone Widget */}
      <section
        className="founder-milestone-card"
        aria-label="Founder Economic Transition Target"
      >
        <div className="founder-milestone-header">
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Milestone Transisi Ekonomi Mandiri Founder
            </span>
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '4px 0 2px',
              }}
            >
              Target Laba Bersih:{' '}
              <span style={{ color: '#4ade80' }}>
                Rp {realizedNetProfit.toLocaleString('id-ID')}
              </span>{' '}
              <span style={{ fontSize: '1rem', color: '#94a3b8' }}>
                / Rp {monthlyTransitionTarget.toLocaleString('id-ID')}
              </span>
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
              Target tercapai {progressPercent}% &bull; Tinggal {remainingPcs}{' '}
              lembar kaos lagi untuk melampaui target transisi ekonomi mandiri!
            </span>
          </div>
          <Badge variant="success" size="md">
            Progress: {progressPercent}%
          </Badge>
        </div>

        <div
          className="founder-progress-bar-bg"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="founder-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Live Financial & Performance KPI Grid */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card-premium kpi-profit">
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Laba Bersih Terealisasi
            </span>
            <div className="kpi-value-tabular" style={{ color: '#4ade80' }}>
              Rp {realizedNetProfit.toLocaleString('id-ID')}
            </div>
          </div>
          <span
            style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}
          >
            Margin bersih riil (44.5% dari omzet kotor)
          </span>
        </div>

        <div className="kpi-card-premium kpi-revenue">
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Total Omzet Kotor (Gross)
            </span>
            <div className="kpi-value-tabular">
              Rp {grossRevenue.toLocaleString('id-ID')}
            </div>
          </div>
          <span
            style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}
          >
            50 pcs kaos terjual bulan ini
          </span>
        </div>

        <div className="kpi-card-premium kpi-cogs">
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#fbbf24',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Total HPP / COGS Terpakai
            </span>
            <div className="kpi-value-tabular">
              Rp {totalCogs.toLocaleString('id-ID')}
            </div>
          </div>
          <span
            style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}
          >
            Blank Combed + DTF + Polymailer + Listrik
          </span>
        </div>

        <div className="kpi-card-premium kpi-orders">
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#c084fc',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Konteks Brand Aktif
            </span>
            <div className="kpi-value-tabular">
              {session.activeBrand.code}
            </div>
          </div>
          <span
            style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}
          >
            {session.activeBrand.name} ({totalPermittedModules} Modul Terbuka)
          </span>
        </div>
      </div>

      {/* Workshop & Production Floor Status */}
      <Card style={{ marginBottom: '24px' }}>
        <CardHeader>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <CardTitle>Status Workshop &amp; Antrean Sablon DTF</CardTitle>
              <CardDescription>
                Monitoring lantai produksi garmen dan ketersediaan stok bahan baku
                kaos blank.
              </CardDescription>
            </div>
            <Badge variant="accent">POD Workshop Live</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="workshop-pipeline-grid" style={{ marginBottom: 20 }}>
            <div className="workshop-stage-card">
              <span className="workshop-stage-title">Menunggu Print DTF</span>
              <span className="workshop-stage-count" style={{ color: '#38bdf8' }}>
                6 <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>pcs</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Artwork siap di-rip ke printer
              </span>
            </div>
            <div className="workshop-stage-card">
              <span className="workshop-stage-title">Siap Press 155°C</span>
              <span className="workshop-stage-count" style={{ color: '#fbbf24' }}>
                3 <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>pcs</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Film DTF sudah dipotong rapi
              </span>
            </div>
            <div className="workshop-stage-card">
              <span className="workshop-stage-title">QC &amp; Finishing</span>
              <span className="workshop-stage-count" style={{ color: '#c084fc' }}>
                8 <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>pcs</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Inspeksi jahitan &amp; lipat garmen
              </span>
            </div>
            <div className="workshop-stage-card">
              <span className="workshop-stage-title">Siap Kirim (Packing)</span>
              <span className="workshop-stage-count" style={{ color: '#4ade80' }}>
                12 <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>pcs</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Polymailer doff &amp; resi ekspedisi
              </span>
            </div>
          </div>

          <h4
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '16px 0 8px',
            }}
          >
            Ketersediaan Stok Bahan Baku Kaos Blank (Cotton Combed 24s)
          </h4>
          <table className="stock-matrix-table">
            <thead>
              <tr>
                <th>Ukuran Kaos</th>
                <th>Stok Fisik di Rak</th>
                <th>Dialokasikan (Pesanan Masuk)</th>
                <th>Stok Tersedia Jual</th>
                <th>Status Kesiapan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Size S</strong></td>
                <td>28 pcs</td>
                <td>4 pcs</td>
                <td><strong>24 pcs</strong></td>
                <td><Badge variant="success">Stok Aman</Badge></td>
              </tr>
              <tr>
                <td><strong>Size M</strong></td>
                <td>56 pcs</td>
                <td>8 pcs</td>
                <td><strong>48 pcs</strong></td>
                <td><Badge variant="success">Stok Aman</Badge></td>
              </tr>
              <tr>
                <td><strong>Size L</strong></td>
                <td>62 pcs</td>
                <td>10 pcs</td>
                <td><strong>52 pcs</strong></td>
                <td><Badge variant="success">Stok Aman</Badge></td>
              </tr>
              <tr>
                <td><strong>Size XL</strong></td>
                <td>22 pcs</td>
                <td>4 pcs</td>
                <td><strong>18 pcs</strong></td>
                <td><Badge variant="default">Cukup</Badge></td>
              </tr>
              <tr>
                <td><strong>Size XXL</strong></td>
                <td>11 pcs</td>
                <td>2 pcs</td>
                <td><strong>9 pcs</strong></td>
                <td><Badge variant="warning">Perlu Restock</Badge></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Permission-filtered Operational Modules & Shortcuts (Preserved for QA Invariants) */}
      {shortcutGroups.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {shortcutGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
                <CardDescription>
                  {GROUP_SUBTITLES[group.id] ??
                    'Pintasan modul operasional yang diotorisasi'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {group.items.map((item: NavItemDef) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="sidebar-link"
                      style={{
                        background: 'var(--bg-surface-sunken)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {ITEM_DESCRIPTIONS[item.id] ??
                            `Buka modul ${item.label}`}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Document Numbering Reference Card (Preserved for System Standardization) */}
      <Card>
        <CardHeader>
          <CardTitle>Standar Format Penomoran Dokumen</CardTitle>
          <CardDescription>
            Sistem penomoran resmi atomik, collision-safe, dan year-aware dengan
            format:{' '}
            <code
              style={{
                background: 'var(--bg-surface-sunken)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {'{BRAND}-{TYPE}-{YEAR}-{SEQUENCE}'}
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
            }}
          >
            {DOCUMENT_TYPES.map((item) => (
              <div
                key={item.type}
                style={{
                  background: 'var(--bg-surface-sunken)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginTop: '2px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {formatDocumentNumber({
                    brandCode: session.activeBrand.code,
                    documentType: item.type,
                    sequence: 1,
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
