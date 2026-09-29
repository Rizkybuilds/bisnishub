import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Cloud, 
  Database, 
  CheckCircle2, 
  RefreshCw,
  Phone,
  Save,
  QrCode,
  Sparkles,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Download,
  Upload,
  FileText,
  Sliders,
  Store,
  CreditCard,
  Layers,
  Zap,
  Check,
  Copy,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '@bisnishub/shared/components/ui/Card';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { Input } from '@bisnishub/shared/components/ui/Input';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { testSupabaseConnection } from '@bisnishub/shared/services/supabase';
import { 
  getAppEnvironment, 
  setAppEnvironment, 
  getSecurityAuditChecklist, 
  calculateSettingsKpis,
  exportSettingsSnapshotJson,
  importSettingsSnapshotJson
} from '@bisnishub/shared/services/settingsApi';

export function SettingsPage() {
  const { supabaseStatus, showToast, purgeAllDemoData } = useAdmin();
  const { storeSettings, updateStoreSettings } = useStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'payment' | 'cloud' | 'security'

  // App Environment State
  const [envMode, setEnvMode] = useState(() => getAppEnvironment());

  // Cloud integration states
  const [sbUrl] = useState(import.meta.env.VITE_SUPABASE_URL || 'https://tovslowsopqtuxmrogeu.supabase.co');
  const [sbKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4');
  const [cldName] = useState(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'teestock');
  const [cldKey] = useState(import.meta.env.VITE_CLOUDINARY_API_KEY || '492858172948192');
  const [showKey, setShowKey] = useState(false);
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

  const [savingQris, setSavingQris] = useState(false);
  const [savingStore, setSavingStore] = useState(false);

  // Sync state if context changes
  useEffect(() => {
    if (storeSettings) {
      if (storeSettings.storeWhatsapp) setWhatsapp(storeSettings.storeWhatsapp);
      if (storeSettings.shopeeUrl) setShopee(storeSettings.shopeeUrl);
      if (storeSettings.tiktokUrl) setTiktok(storeSettings.tiktokUrl);
      if (storeSettings.instagramUrl) setInstagram(storeSettings.instagramUrl);
      if (storeSettings.qrisMerchantName) setQrisName(storeSettings.qrisMerchantName);
      if (storeSettings.qrisNmid) setQrisNmid(storeSettings.qrisNmid);
      if (storeSettings.qrisImageUrl !== undefined) setQrisImageUrl(storeSettings.qrisImageUrl);
      if (storeSettings.bankName) setBankName(storeSettings.bankName);
      if (storeSettings.bankAccountNo !== undefined) setBankAccountNo(storeSettings.bankAccountNo);
      if (storeSettings.bankAccountHolder) setBankAccountHolder(storeSettings.bankAccountHolder);
    }
  }, [storeSettings]);

  // Executive Settings KPIs
  const kpis = useMemo(() => {
    const isConn = testResult ? testResult.connected : (supabaseStatus?.connected ?? true);
    return calculateSettingsKpis({
      storeWhatsapp: whatsapp,
      bankName,
      qrisMerchantName: qrisName
    }, envMode, isConn);
  }, [whatsapp, bankName, qrisName, envMode, testResult, supabaseStatus]);

  // Security Checklist
  const securityChecklist = useMemo(() => getSecurityAuditChecklist(), []);

  // Switch Environment Mode
  const handleToggleEnvMode = (newMode) => {
    const saved = setAppEnvironment(newMode);
    setEnvMode(saved);
    if (showToast) {
      showToast(
        saved === 'production'
          ? '🛡️ Mode Operasional dialihkan ke: Produksi (Live)'
          : '🧪 Mode Operasional dialihkan ke: Sandbox (Testing)',
        'info'
      );
    }
  };

  // Test Supabase Connection
  const handleTestSupabase = async () => {
    setTesting(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
    if (showToast) {
      showToast(res.message, res.connected ? 'success' : 'error');
    }
  };

  // Save Store Contact Settings
  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    setSavingStore(true);
    try {
      const res = await updateStoreSettings({
        storeWhatsapp: whatsapp.trim(),
        shopeeUrl: shopee.trim(),
        tiktokUrl: tiktok.trim(),
        instagramUrl: instagram.trim()
      });
      if (res?.success) {
        if (showToast) showToast("✅ Profil & kontak toko tersimpan ke Cloud Supabase!", "success");
      } else {
        if (showToast) showToast("ℹ️ Tersimpan di browser lokal (cek koneksi Cloud Supabase).", "info");
      }
    } catch (err) {
      if (showToast) showToast("Gagal menyimpan ke cloud: " + (err.message || err), "error");
    } finally {
      setSavingStore(false);
    }
  };

  // Save QRIS & Bank Settings
  const handleSaveQrisSettings = async (e) => {
    e.preventDefault();
    setSavingQris(true);
    try {
      const res = await updateStoreSettings({
        qrisMerchantName: qrisName.trim(),
        qrisNmid: qrisNmid.trim(),
        qrisImageUrl: qrisImageUrl.trim(),
        bankName: bankName.trim(),
        bankAccountNo: bankAccountNo.trim(),
        bankAccountHolder: bankAccountHolder.trim()
      });
      if (res?.success) {
        if (showToast) showToast("✅ Konfigurasi QRIS & Rekening tersimpan ke Cloud Supabase!", "success");
      } else {
        if (showToast) showToast("ℹ️ Tersimpan di browser lokal (cek koneksi Cloud Supabase).", "info");
      }
    } catch (err) {
      if (showToast) showToast("Gagal menyimpan ke cloud: " + (err.message || err), "error");
    } finally {
      setSavingQris(false);
    }
  };

  // Export Snapshot JSON
  const handleExportSnapshot = () => {
    try {
      exportSettingsSnapshotJson({
        storeWhatsapp: whatsapp,
        shopeeUrl: shopee,
        tiktokUrl: tiktok,
        instagramUrl: instagram,
        qrisMerchantName: qrisName,
        qrisNmid: qrisNmid,
        qrisImageUrl,
        bankName,
        bankAccountNo,
        bankAccountHolder
      }, envMode);
      if (showToast) showToast('Snapshot konfigurasi sistem berhasil diekspor ke JSON!', 'success');
    } catch (e) {
      if (showToast) showToast('Gagal mengekspor snapshot konfigurasi', 'error');
    }
  };

  // Import Snapshot JSON
  const handleImportSnapshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        const res = importSettingsSnapshotJson(text);
        if (res.success && res.settings) {
          await updateStoreSettings(res.settings);
          if (res.environment) setEnvMode(res.environment);
          if (showToast) showToast('✅ Snapshot konfigurasi berhasil dipulihkan!', 'success');
        } else {
          if (showToast) showToast('Gagal memulihkan snapshot: ' + res.error, 'error');
        }
      } catch (err) {
        if (showToast) showToast('Gagal membaca file snapshot JSON', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Topbar */}
      <AdminTopbar
        title="Pengaturan Toko, Integrasi Cloud & System Hardening"
        subtitle="Kelola Profil WhatsApp Toko, Gateway Pembayaran QRIS 0%, Database Supabase Singapore & Proteksi RLS"
        badge="Pusat Kontrol Sistem"
      />

      {/* Quick Action Header & Environment Indicator */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 -mt-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            envMode === 'production'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${envMode === 'production' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {envMode === 'production' ? 'Mode Produksi (Live)' : 'Mode Sandbox (Testing)'}
          </span>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            PostgreSQL 15 • Cloudinary WebP • 0% Fee QRIS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportSnapshot}
            className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            Ekspor Snapshot JSON
          </Button>

          <label className="inline-flex items-center">
            <input 
              type="file" 
              accept=".json"
              onChange={handleImportSnapshot}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Pulihkan Snapshot
            </span>
          </label>
        </div>
      </div>

      {/* 4 Executive KPI Ribbon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Cloud Supabase */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Database Sentral</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span className="truncate">{kpis.cloudDatabase.value}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{kpis.cloudDatabase.subtitle}</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: QRIS Payment */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Gateway Pembayaran</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold tracking-tight text-white">
              {kpis.paymentGateway.value}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{kpis.paymentGateway.subtitle}</span>
            </div>
          </div>
        </Card>

        {/* KPI 3: Media CDN */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cloud Media CDN</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold tracking-tight text-white">
              {kpis.mediaCdn.value}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{kpis.mediaCdn.subtitle}</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Security & Environment */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Keamanan Sistem</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold tracking-tight text-white">
              {kpis.environment.value}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{kpis.environment.subtitle}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-white/[0.08] flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1 -mb-px">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'store'
                ? 'border-[#F15A24] text-[#F15A24]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Profil Toko & Kontak CS</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'payment'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pembayaran QRIS & Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'cloud'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Integrasi Cloud (Supabase & CDN)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'security'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Keamanan & Hardening Audit</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROFIL TOKO & KONTAK PENJUALAN */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#121215] border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Profil Toko & Saluran Penjualan Resmi</h3>
                  <p className="text-xs text-slate-400">Nomor WhatsApp penerima order dan tautan etalase marketplace untuk pembeli</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                Aktif
              </span>
            </div>

            <form onSubmit={handleSaveStoreSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Nomor WhatsApp Resmi Toko (Penerima Order) *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 085220274968"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                    required
                  />
                  <p className="text-[11px] text-slate-500">
                    Otomatis dialirkan ke template tombol WhatsApp checkout pembeli di storefront.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Link Toko Shopee
                  </label>
                  <input
                    type="url"
                    placeholder="https://shopee.co.id/teestock"
                    value={shopee}
                    onChange={(e) => setShopee(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Tautan alternatif bagi pembeli yang menginginkan opsi gratis ongkir e-commerce.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Link Profil TikTok Shop
                  </label>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@teestock.id"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Kanal video pendek dan keranjang kuning live shopping.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Link Profil Instagram
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/teestock.id"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Portofolio visual dan link bio Instagram resmi brand.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/[0.08]">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={savingStore}
                  className="bg-[#F15A24] hover:bg-[#d94e1d] text-white font-semibold text-xs px-4 py-2"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {savingStore ? 'Menyimpan ke Cloud...' : 'Simpan Kontak Toko'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 2: PEMBAYARAN QRIS & BANK */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#121215] border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Konfigurasi Pembayaran QRIS Manual & Bank</h3>
                  <p className="text-xs text-slate-400">Atur identitas merchant QRIS dan sistem kode unik verifikasi 3 digit (0% fee)</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                0% Gateway Fee
              </span>
            </div>

            <form onSubmit={handleSaveQrisSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Nama Merchant QRIS Terdaftar *
                  </label>
                  <input
                    type="text"
                    placeholder="TeeStock Apparel"
                    value={qrisName}
                    onChange={(e) => setQrisName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    NMID QRIS (National Merchant ID)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: ID102609070001"
                    value={qrisNmid}
                    onChange={(e) => setQrisNmid(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    URL Gambar Barcode QRIS Resmi (Scannable)
                  </label>
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/.../qris-teestock.jpg atau /qris-master.png"
                    value={qrisImageUrl}
                    onChange={(e) => setQrisImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Upload gambar barcode QRIS Anda ke Cloudinary / hosting dan tempel URL-nya di sini agar pembeli dapat langsung scan barcode di modal checkout.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Nama Bank Alternatif (Manual Transfer)
                  </label>
                  <input
                    type="text"
                    placeholder="BCA / Mandiri / BNI / BRI"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Nomor Rekening Bank
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 8830123456"
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Atas Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rizky / TeeStock Apparel"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Unique Code Explainer Callout */}
              <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-slate-300 space-y-1.5">
                <div className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sistem Verifikasi Otomatis Kode Unik 3 Digit (CFO Zero-Fee Rule)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Setiap transaksi checkout website akan menghasilkan nominal dengan 3 digit unik acak (contoh: +342). Anda cukup mencocokkan mutasi rekening bank/e-wallet dengan kode unik pesanan di antrean Kanban Admin tanpa perlu membayar biaya potongan payment gateway (1.5–3%).
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/[0.08]">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={savingQris}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {savingQris ? 'Menyimpan ke Cloud...' : 'Simpan Pengaturan QRIS'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 3: INTEGRASI CLOUD (SUPABASE & CDN) */}
      {activeTab === 'cloud' && (
        <div className="space-y-6">
          {/* Supabase Cloud Card */}
          <Card className="p-6 bg-[#121215] border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Supabase Cloud PostgreSQL (Singapore Region)</h3>
                  <p className="text-xs text-slate-400">Database sentral transaksi, inventori, antrean order kanban, dan katalog produk</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terkoneksi (Singapore)
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={sbUrl}
                  readOnly
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-sky-300 font-mono select-all focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Supabase Public Anon Key (Protected by RLS)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    {showKey ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={sbKey}
                  readOnly
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-slate-300 font-mono select-all focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleTestSupabase}
                disabled={testing}
                className="bg-white/5 hover:bg-white/10 border-white/10 text-xs text-slate-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${testing ? 'animate-spin text-sky-400' : ''}`} />
                {testing ? "Menguji Koneksi..." : "Uji Latensi Koneksi Supabase"}
              </Button>

              {testResult && (
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${testResult.connected ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {testResult.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {testResult.message}
                </span>
              )}
            </div>
          </Card>

          {/* Cloudinary CDN Card */}
          <Card className="p-6 bg-[#121215] border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cloudinary Media CDN</h3>
                  <p className="text-xs text-slate-400">Penyimpanan mockup produk dengan kompresi WebP otomatis untuk Core Web Vitals</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cloud Name
                </label>
                <input
                  type="text"
                  value={cldName}
                  readOnly
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-sky-300 font-mono select-all focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={cldKey}
                  readOnly
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-slate-300 font-mono select-all focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 bg-black/40 border border-white/[0.06] rounded-xl text-xs text-slate-400 space-y-1">
              <div className="font-bold text-white">Petunjuk Upload Preset:</div>
              <p className="leading-relaxed">
                Pastikan Anda telah membuat Upload Preset bertipe <strong>Unsigned</strong> bernama <code className="text-sky-300">teestock_preset</code> di dashboard Cloudinary (Settings &rarr; Upload &rarr; Add upload preset).
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: KEAMANAN SISTEM & HARDENING */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Environment Mode Switch Card */}
          <Card className="p-6 bg-[#121215] border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Mode Operasional Sistem (Environment)</h3>
                  <p className="text-xs text-slate-400">Pilih antara mode pengujian simulasi internal atau mode operasional transaksi live</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Sandbox */}
              <button
                type="button"
                onClick={() => handleToggleEnvMode('sandbox')}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  envMode === 'sandbox'
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Mode Sandbox (Testing)
                  </span>
                  {envMode === 'sandbox' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal untuk pengujian fitur baru, simulasi checkout toko, dan latihan tim tanpa memengaruhi pembukuan kas bank riil.
                </p>
              </button>

              {/* Option 2: Production */}
              <button
                type="button"
                onClick={() => handleToggleEnvMode('production')}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  envMode === 'production'
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Mode Produksi (Live)
                  </span>
                  {envMode === 'production' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seluruh pesanan tercatat resmi ke Buku Kas, stok inventori terpotong nyata, dan alur QRIS mengikat pembeli riil.
                </p>
              </button>
            </div>
          </Card>

          {/* Security Guardrails Checklist */}
          <Card className="p-6 bg-[#121215] border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Audit Hardening Keamanan (5 Guardrails Terverifikasi)
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-semibold border border-purple-500/30">
                100% Lulus Audit
              </span>
            </div>

            <div className="divide-y divide-white/5 space-y-2">
              {securityChecklist.map((item) => (
                <div key={item.id} className="pt-2 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                      {item.desc}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Live Clean Slate & Data Purge Card */}
      <Card className="p-6 bg-[#121215] border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-[#121215] to-black/60 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Pembersihan Data Demo & Fresh Start (Live Clean Slate)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400">
                  Sistem Bersih
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Bersihkan seluruh cache transaksi fiktif, PO pengadaan lama, aset capex demo, defect simulasi, dan antrean pesanan uji coba.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Data Master Tetap Aman:
            </div>
            <p className="text-slate-400 leading-relaxed">
              Katalog produk Drop #01, varian katun NSA (24s & 30s), konfigurasi QRIS, dan template HPP tidak akan dihapus. Anda tetap memiliki referensi produk siap jual.
            </p>
          </div>

          <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Data Transaksi Dinolkan:
            </div>
            <p className="text-slate-400 leading-relaxed">
              PO pengadaan bahan, mutasi buku kas masuk/keluar, antrean order kanban, dan catatan cacat QC akan dikosongkan bersih ke 0.
            </p>
          </div>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-rose-500/10">
          <p className="text-xs text-slate-400 italic">
            Gunakan tombol ini sebelum Anda mulai mencatat pesanan riil pertama atau belanja bahan perdana.
          </p>
          <Button
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-rose-950/50"
            onClick={() => {
              if (window.confirm("⚠️ KONFIRMASI PEMBERSIHAN DATA:\n\nApakah Anda yakin ingin menghapus seluruh data fiktif (pengadaan, mutasi kas, aset demo, order uji coba)?\n\nSistem akan kembali ke status 100% bersih untuk operasional live.")) {
                purgeAllDemoData();
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan Semua Data Demo & Reset ke 0
          </Button>
        </div>
      </Card>
    </div>
  );
}
