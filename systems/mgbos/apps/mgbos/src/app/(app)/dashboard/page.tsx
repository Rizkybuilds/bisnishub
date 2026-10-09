import Link from 'next/link';
import { requireAuth } from '@/lib/session.server';
import { formatDocumentNumber } from '@mgbos/domain';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Badge,
} from '@/components/ui';

export const metadata = {
  title: 'Command Center — MultiGraph Business OS',
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

  return (
    <div>
      <PageHeader
        eyebrow={`${session.organization.displayName} • PUSAT KOMANDO OPERASIONAL`}
        title={`Selamat Datang, ${session.user.name}!`}
        description="Pusat kendali operasional MultiGraph Group — ekosistem industri percetakan, apparel, dan kemasan retail."
      />

      {/* Active Brand Context Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)',
          borderColor: '#0284c7',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#7dd3fc',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Konteks Brand Aktif Saat Ini
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#ffffff',
                marginTop: '4px',
              }}
            >
              {session.activeBrand.name} ({session.activeBrand.code})
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#bae6fd',
                marginTop: '4px',
              }}
            >
              Semua modul, order, dan mutasi data berjalan di bawah konteks
              brand ini.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant="accent" size="md">
              Konteks: {session.activeBrand.code}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Operational Stats Grid */}
      <div className="kpi-grid">
        <StatCard
          title="Konteks Brand"
          value={session.activeBrand.code}
          description={session.activeBrand.name}
          badge={<Badge variant="accent">Terpilih</Badge>}
        />

        <StatCard
          title="Unit Holding"
          value="5 Brand"
          description="TS, MG, NP, PP, SQ"
          badge={<Badge variant="default">Multi-Brand</Badge>}
        />

        <StatCard
          title="Kanal Transaksi"
          value="5 Kanal"
          description="WA, Web, Direct, IG, Marketplace"
          badge={<Badge variant="default">Terhubung</Badge>}
        />

        <StatCard
          title="Peran Otoritas"
          value={session.role.code}
          description="Akses Operasional Penuh"
          badge={<Badge variant="success">Aktif</Badge>}
        />
      </div>

      {/* Operational Modules & Quick Shortcuts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Penjualan &amp; Pipeline</CardTitle>
            <CardDescription>
              Alur penerimaan inquiry, kualifikasi lead, dan konversi order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Link
                href="/leads"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Leads &amp; Inquiries
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Daftar prospek baru dan status kualifikasi
                  </div>
                </div>
              </Link>
              <Link
                href="/customers"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Pelanggan (Customer 360)
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Direktori akun pelanggan dan riwayat transaksi
                  </div>
                </div>
              </Link>
              <Link
                href="/requirements"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Kebutuhan Pesanan
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Spesifikasi pesanan custom dan requirement sheet
                  </div>
                </div>
              </Link>
              <Link
                href="/quotes"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Penawaran &amp; HPP
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Kalkulasi penawaran resmi dan margin batas CFO
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operasional &amp; Produksi</CardTitle>
            <CardDescription>
              Pemenuhan kontrak, SPK, monitoring vendor, dan penanganan kendala
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Link
                href="/orders"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Kontrak Pesanan (Orders)
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Daftar pesanan aktif dan pelacakan status
                  </div>
                </div>
              </Link>
              <Link
                href="/production"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Produksi &amp; QC
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Antrean SPK kerja dan inspeksi mutu produksi
                  </div>
                </div>
              </Link>
              <Link
                href="/vendors"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Jaringan Vendor
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Direktori vendor maklon dan rating performa
                  </div>
                </div>
              </Link>
              <Link
                href="/exceptions"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Operational Exceptions
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Penanganan eskalasi kendala operasional lapangan
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keuangan &amp; Kas</CardTitle>
            <CardDescription>
              Faktur komersial, pencatatan kas masuk, dan pembukuan margin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Link
                href="/invoices"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Invoice &amp; Piutang
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Penerbitan tagihan resmi dan status pembayaran
                  </div>
                </div>
              </Link>
              <Link
                href="/payments"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Pembayaran &amp; Kas Masuk
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Pencatatan mutasi kas dan verifikasi pembayaran
                  </div>
                </div>
              </Link>
              <Link
                href="/ledger"
                className="sidebar-link"
                style={{
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Buku Kas &amp; Margin
                  </div>
                  <div
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Ringkasan laba kotor transaksi dan arus kas
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Numbering Reference Card */}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {DOCUMENT_TYPES.map((item) => (
              <div
                key={item.type}
                style={{
                  background: 'var(--bg-surface-sunken)',
                  padding: '12px 14px',
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
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginTop: '4px',
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
