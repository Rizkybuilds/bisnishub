import React, { useState } from 'react';
import { 
  Settings, 
  Cloud, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Phone,
  ShoppingBag,
  Share2,
  Save,
  QrCode,
  Sparkles
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { testSupabaseConnection } from '../../services/supabase';

export function SettingsPage() {
  const { supabaseStatus, showToast } = useAdmin();
  const { storeSettings, updateStoreSettings } = useStore();

  // Cloud integration states
  const [sbUrl, setSbUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [sbKey, setSbKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [cldName, setCldName] = useState(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '');
  const [cldKey, setCldKey] = useState(import.meta.env.VITE_CLOUDINARY_API_KEY || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Store contact states
  const [whatsapp, setWhatsapp] = useState(storeSettings?.storeWhatsapp || '085220274968');
  const [shopee, setShopee] = useState(storeSettings?.shopeeUrl || 'https://shopee.co.id');
  const [tiktok, setTiktok] = useState(storeSettings?.tiktokUrl || 'https://tiktok.com');
  const [instagram, setInstagram] = useState(storeSettings?.instagramUrl || 'https://instagram.com');

  // QRIS & Bank states
  const [qrisName, setQrisName] = useState(storeSettings?.qrisMerchantName || 'TeeStock Apparel');
  const [qrisNmid, setQrisNmid] = useState(storeSettings?.qrisNmid || 'ID102609070001');
  const [qrisImageUrl, setQrisImageUrl] = useState(storeSettings?.qrisImageUrl || '');
  const [bankName, setBankName] = useState(storeSettings?.bankName || 'BCA');
  const [bankAccountNo, setBankAccountNo] = useState(storeSettings?.bankAccountNo || '');
  const [bankAccountHolder, setBankAccountHolder] = useState(storeSettings?.bankAccountHolder || 'TeeStock Apparel');

  const handleSaveQrisSettings = (e) => {
    e.preventDefault();
    updateStoreSettings({
      qrisMerchantName: qrisName.trim(),
      qrisNmid: qrisNmid.trim(),
      qrisImageUrl: qrisImageUrl.trim(),
      bankName: bankName.trim(),
      bankAccountNo: bankAccountNo.trim(),
      bankAccountHolder: bankAccountHolder.trim()
    });
    showToast("✅ Konfigurasi QRIS dan rekening bank berhasil disimpan!");
  };

  const handleTestSupabase = async () => {
    setTesting(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
    showToast(res.message, res.connected ? 'success' : 'error');
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    updateStoreSettings({
      storeWhatsapp: whatsapp.trim(),
      shopeeUrl: shopee.trim(),
      tiktokUrl: tiktok.trim(),
      instagramUrl: instagram.trim()
    });
    showToast("✅ Pengaturan profil dan kontak toko berhasil disimpan!");
  };

  return (
    <div>
      <AdminTopbar
        title="Pengaturan Integrasi & Toko"
        subtitle="Kelola kontak WhatsApp toko, link marketplace, database Supabase, dan Cloudinary CDN"
      />

      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        {/* Store Profile & Contact Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ts-borderDim">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#4EFA8A] flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ts-krem">Profil Toko &amp; Saluran Penjualan</h3>
                <p className="text-xs text-ts-muted">Nomor WhatsApp dan link toko untuk checkout langsung pembeli</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-ts-green bg-ts-green/10 px-2 py-1 rounded">
              Aktif
            </span>
          </div>

          <form onSubmit={handleSaveStoreSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nomor WhatsApp Resmi Toko (Penerima Order)"
                placeholder="Contoh: 085220274968"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
              <Input
                label="Link Toko Shopee"
                placeholder="https://shopee.co.id/teestock"
                value={shopee}
                onChange={(e) => setShopee(e.target.value)}
              />
              <Input
                label="Link Profil TikTok Shop"
                placeholder="https://tiktok.com/@teestock.id"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
              />
              <Input
                label="Link Profil Instagram"
                placeholder="https://instagram.com/teestock.id"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-ts-borderDim">
              <Button type="submit" variant="primary" icon={Save}>
                Simpan Kontak Toko
              </Button>
            </div>
          </form>
        </Card>

        {/* QRIS Merchant Configuration Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ts-borderDim">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ts-krem">Konfigurasi Pembayaran QRIS Manual</h3>
                <p className="text-xs text-ts-muted">Atur identitas merchant QRIS dan sistem kode unik verifikasi 3 digit</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-ts-green bg-ts-green/10 px-2 py-1 rounded">
              0% Gateway Fee
            </span>
          </div>

          <form onSubmit={handleSaveQrisSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Merchant QRIS Terdaftar"
                placeholder="TeeStock Apparel"
                value={qrisName}
                onChange={(e) => setQrisName(e.target.value)}
                required
              />
              <Input
                label="NMID QRIS (National Merchant ID)"
                placeholder="Contoh: ID102609070001"
                value={qrisNmid}
                onChange={(e) => setQrisNmid(e.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label="URL Gambar Barcode QRIS Resmi (Scannable)"
                  placeholder="https://res.cloudinary.com/.../qris-teestock.jpg atau /qris-master.png"
                  value={qrisImageUrl}
                  onChange={(e) => setQrisImageUrl(e.target.value)}
                  helperText="Upload gambar barcode QRIS Anda ke Cloudinary / hosting dan tempel URL-nya di sini agar pembeli dapat langsung scan."
                />
              </div>
              <Input
                label="Nama Bank Alternatif (Manual Transfer)"
                placeholder="BCA / Mandiri / BNI / BRI"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <Input
                label="Nomor Rekening Bank"
                placeholder="Contoh: 1234567890"
                value={bankAccountNo}
                onChange={(e) => setBankAccountNo(e.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label="Atas Nama Pemilik Rekening"
                  placeholder="Contoh: Rizky / TeeStock Apparel"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-ts-kremMuted space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                <span>Sistem Verifikasi Otomatis Kode Unik 3 Digit</span>
              </div>
              <p>
                Setiap pembeli di website akan mendapatkan nominal tagihan dengan 3 digit unik acak (contoh: +342). Anda cukup mencocokkan mutasi rekening bank/e-wallet dengan kode unik pesanan di Kanban Admin tanpa perlu membayar biaya payment gateway.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-ts-borderDim">
              <Button type="submit" variant="primary" icon={Save}>
                Simpan Pengaturan QRIS
              </Button>
            </div>
          </form>
        </Card>

        {/* Supabase Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ts-borderDim">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ts-krem">Supabase Cloud PostgreSQL</h3>
                <p className="text-xs text-ts-muted">Database sentral transaksi, inventori, dan katalog TeeStock</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-ts-green bg-ts-green/10 px-2 py-1 rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terkoneksi (Singapore)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Supabase Project URL"
              value={sbUrl}
              onChange={(e) => setSbUrl(e.target.value)}
              readOnly
            />
            <Input
              label="Supabase Public Anon Key"
              value={sbKey}
              type="password"
              onChange={(e) => setSbKey(e.target.value)}
              readOnly
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              size="sm"
              variant="secondary"
              icon={testing ? RefreshCw : Cloud}
              onClick={handleTestSupabase}
              disabled={testing}
            >
              {testing ? "Menguji Koneksi..." : "Uji Koneksi Supabase"}
            </Button>

            {testResult && (
              <span className={`text-xs font-semibold ${testResult.connected ? 'text-ts-green' : 'text-ts-red'}`}>
                {testResult.message}
              </span>
            )}
          </div>
        </Card>

        {/* Cloudinary Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ts-borderDim">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ts-krem">Cloudinary Media CDN</h3>
                <p className="text-xs text-ts-muted">Penyimpanan mockup produk dengan kompresi WebP otomatis</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-ts-mustard bg-ts-mustard/10 px-2 py-1 rounded">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cloud Name"
              value={cldName}
              readOnly
            />
            <Input
              label="API Key"
              value={cldKey}
              readOnly
            />
          </div>

          <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl text-xs text-ts-muted space-y-1">
            <div className="font-bold text-ts-krem">Petunjuk Upload Preset:</div>
            <p>
              Pastikan Anda telah membuat Upload Preset bertipe <strong>Unsigned</strong> bernama <code>teestock_preset</code> di dashboard Cloudinary (Settings &rarr; Upload &rarr; Add upload preset).
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
