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
  StatCard,
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

  return (
    <div>
      <PageHeader
        eyebrow={`${session.organization.displayName} • PUSAT KOMANDO OPERASIONAL`}
        title={`Selamat Datang, ${session.user.name}!`}
        description="Pusat kendali operasional MultiGraph Group — silakan pilih modul operasional atau gunakan pintasan alur kerja di bawah."
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
              Konteks operasional aktif saat ini. Anda dapat berpindah brand
              sewaktu-waktu melalui tombol di bagian atas.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant="accent" size="md">
              Brand: {session.activeBrand.code}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Verified Session Context Grid */}
      <div className="kpi-grid">
        <StatCard
          title="Konteks Brand"
          value={session.activeBrand.code}
          description={session.activeBrand.name}
          badge={<Badge variant="accent">Aktif</Badge>}
        />

        <StatCard
          title="Organisasi"
          value={session.organization.displayName}
          description="Holding Multi-Brand"
          badge={<Badge variant="default">Holding</Badge>}
        />

        <StatCard
          title="Peran Pengguna"
          value={session.role.code}
          description="Hak akses sesuai peran sistem"
          badge={<Badge variant="default">Role</Badge>}
        />

        <StatCard
          title="Modul Terbuka"
          value={`${totalPermittedModules} Modul`}
          description="Dapat diakses oleh peran Anda"
          badge={<Badge variant="info">Tersedia</Badge>}
        />
      </div>

      {/* Permission-filtered Operational Modules & Shortcuts */}
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
