import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Tag, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Copy, 
  LogOut, 
  Save, 
  Sparkles, 
  ShoppingBag, 
  MessageSquare,
  Clock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@bisnishub/shared/context/AuthContext';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { Input } from '@bisnishub/shared/components/ui/Input';
import { formatRupiah, formatDate } from '@bisnishub/shared/utils/formatters';
import { getActiveVouchers } from '@bisnishub/shared/services/vouchersApi';
import { getUserOrders } from '@bisnishub/shared/services/ordersApi';
import { sanitizePhoneNumber } from '@bisnishub/shared/utils/whatsappTemplates';
import { SEOHead } from '@bisnishub/shared/components/common/SEOHead';

export const ORDER_STATUS_BADGES = {
  pending: { label: 'Menunggu Konfirmasi', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30', step: 1 },
  dtf: { label: 'Cetak Film DTF HD', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30', step: 2 },
  press: { label: 'Heat Press 155°C', color: 'bg-ts-terracotta/20 text-ts-terracotta border-ts-terracotta/40', step: 3 },
  pack: { label: 'QC & Studio Packing', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30', step: 4 },
  shipped: { label: 'Sedang Dikirim Kurir', color: 'bg-ts-teal/20 text-ts-teal border-ts-teal/40', step: 5 },
  completed: { label: 'Pesanan Selesai', color: 'bg-ts-green/15 text-ts-green border-ts-green/30', step: 6 },
  review: { label: 'Pesanan Selesai', color: 'bg-ts-green/15 text-ts-green border-ts-green/30', step: 6 },
};

/**
 * Pure validator for recipient profile updates
 */
export function validateProfileUpdate({
  fullName = '',
  phone = '',
  address = '',
  city = '',
  postalCode = ''
} = {}) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Nama lengkap penerima wajib diisi.';
  }

  const cleanPhone = (phone || '').trim().replace(/[\s-]/g, '');
  const phoneRegex = /^(08|\+628|628)[0-9]{8,12}$/;
  if (!cleanPhone) {
    errors.phone = 'Nomor WhatsApp wajib diisi.';
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.phone = 'Format nomor WhatsApp tidak valid (Gunakan 08xx atau 628xx, 10-14 digit).';
  }

  if (!address || !address.trim()) {
    errors.address = 'Alamat pengiriman lengkap wajib diisi.';
  }

  if (!city || !city.trim()) {
    errors.city = 'Kota atau kabupaten wajib diisi.';
  }

  if (postalCode && postalCode.trim() && !/^[0-9]{5}$/.test(postalCode.trim())) {
    errors.postalCode = 'Kode pos harus berupa 5 digit angka.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Pure order metrics summary
 */
export function formatAccountOrderSummary(orders = []) {
  const list = Array.isArray(orders) ? orders : [];
  const total = list.length;
  const completed = list.filter(o => o?.status === 'completed' || o?.status === 'review' || o?.status === 'shipped').length;
  const inProgress = total - completed;
  const totalSpent = list.reduce((sum, o) => sum + (Number(o?.price || o?.total || 0)), 0);

  return {
    totalOrders: total,
    completedOrders: completed,
    inProgressOrders: inProgress,
    totalSpent
  };
}

export function AccountPage() {
  const { user, profile, role, isAdmin, isPartner, isMember, updateProfile, signOut, openAuthModal } = useAuth();
  const { storeSettings } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'vouchers', 'partner'

  // User Orders state
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});

  // Vouchers state
  const [vouchers, setVouchers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.default_address || '');
      setCity(profile.city || '');
      setProvince(profile.province || '');
      setPostalCode(profile.postal_code || '');
    }
  }, [profile]);

  useEffect(() => {
    getActiveVouchers(role).then(setVouchers);
  }, [role]);

  // Fetch orders with local storage fallback integration
  useEffect(() => {
    let localSaved = [];
    try {
      const stored = localStorage.getItem('teestock_my_orders');
      if (stored) localSaved = JSON.parse(stored);
    } catch (_) {}

    if (user) {
      setLoadingOrders(true);
      getUserOrders(user.id, profile?.phone).then(res => {
        const fetched = res || [];
        const mergedMap = new Map();
        [...fetched, ...localSaved].forEach(item => {
          if (item && (item.id || item.order_number)) {
            const key = item.id || item.order_number;
            if (!mergedMap.has(key)) {
              mergedMap.set(key, item);
            }
          }
        });
        setUserOrders(Array.from(mergedMap.values()));
        setLoadingOrders(false);
      });
    } else {
      setUserOrders(localSaved);
    }
  }, [user, profile?.phone]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileMsg(null);

    const validation = validateProfileUpdate({
      fullName,
      phone,
      address,
      city,
      postalCode
    });

    if (!validation.isValid) {
      setProfileErrors(validation.errors);
      return;
    }

    setSavingProfile(true);

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      default_address: address.trim(),
      city: city.trim(),
      province: province.trim(),
      postal_code: postalCode.trim(),
    });

    setSavingProfile(false);
    if (!error) {
      setProfileMsg({ type: 'success', text: 'Data profil & alamat kirim berhasil diperbarui!' });
      setTimeout(() => setProfileMsg(null), 3000);
    } else {
      setProfileMsg({ type: 'error', text: 'Gagal memperbarui profil: ' + error.message });
    }
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const orderSummary = formatAccountOrderSummary(userOrders);

  // If visitor (not logged in), show attractive login prompt
  if (!isMember) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <SEOHead
          title="Masuk ke Akun Pelanggan | TeeStock"
          noindex={true}
          canonicalPath="/akun"
        />
        <div className="w-16 h-16 rounded-3xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center mx-auto border border-ts-terracotta/30 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ts-krem tracking-tight">
            Masuk ke Akun TeeStock Kamu
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md mx-auto leading-relaxed">
            Akses riwayat pesanan, kelola alamat pengiriman untuk checkout instan, dan klaim voucher diskon eksklusif.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" variant="glow" onClick={() => openAuthModal()} className="min-h-[44px]">
            Masuk atau Daftar Sekarang
          </Button>
          <Link to="/katalog">
            <Button size="lg" variant="secondary" className="min-h-[44px]">
              Lihat Katalog Dulu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEOHead
        title="Akun Saya &amp; Riwayat Pesanan | TeeStock"
        noindex={true}
        canonicalPath="/akun"
      />
      {/* ─── Profile Header Bar ─────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-ts-terracotta to-[#9E4620] flex items-center justify-center font-extrabold text-white text-2xl shadow-sm border border-ts-terracotta/30 shrink-0">
            {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'TS'}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="relative inline-flex rounded-full h-4 w-4 bg-ts-green border-2 border-ts-surface" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-ts-krem tracking-tight">
                {profile?.full_name || 'Member TeeStock'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30">
                {role}
              </span>
            </div>
            <p className="text-xs text-ts-kremMuted mt-0.5 font-mono">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button size="sm" variant="outline" icon={LogOut} onClick={() => signOut()} className="min-h-[44px]">
            Keluar
          </Button>
        </div>
      </div>

      {/* ─── Navigation Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-ts-border pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Riwayat Pesanan ({userOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Alamat Pengiriman</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vouchers')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Voucher &amp; Kupon</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('partner')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'partner'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Portal Kemitraan</span>
        </button>
      </div>

      {/* ─── TAB 1: RIWAYAT PESANAN ───────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Strip */}
          {userOrders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-ts-surface border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Total Pesanan</span>
                <span className="text-lg font-bold text-ts-krem font-mono">{orderSummary.totalOrders} order</span>
              </div>
              <div className="p-4 rounded-2xl bg-ts-surface border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Sedang Diproses</span>
                <span className="text-lg font-bold text-ts-mustard font-mono">{orderSummary.inProgressOrders} pesanan</span>
              </div>
              <div className="p-4 rounded-2xl bg-ts-surface border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Selesai / Terkirim</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{orderSummary.completedOrders} pesanan</span>
              </div>
              <div className="p-4 rounded-2xl bg-ts-surface border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Total Belanja</span>
                <span className="text-lg font-bold text-ts-green font-mono">{formatRupiah(orderSummary.totalSpent)}</span>
              </div>
            </div>
          )}

          {userOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-ts-surface border border-ts-border space-y-4 shadow-sm">
              <Package className="w-12 h-12 text-ts-muted mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ts-krem">Belum Ada Riwayat Pesanan</h3>
                <p className="text-xs text-ts-kremMuted max-w-sm mx-auto">
                  Kaos yang kamu pesan di website akan otomatis muncul di sini lengkap dengan progres cetak DTF dan resi pengiriman.
                </p>
              </div>
              <Link to="/katalog">
                <Button size="md" variant="glow" icon={ShoppingBag} className="min-h-[44px]">
                  Mulai Belanja Kaos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => {
                const statusInfo = ORDER_STATUS_BADGES[order.status] || ORDER_STATUS_BADGES.pending;

                return (
                  <div
                    key={order.id || order.order_number}
                    className="p-5 sm:p-6 rounded-3xl bg-ts-surface border border-ts-border shadow-sm space-y-4 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ts-border pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ts-terracotta px-2.5 py-1 rounded-lg bg-ts-terracotta/10 border border-ts-terracotta/30">
                          {order.id || order.order_number}
                        </span>
                        <span className="text-xs text-ts-muted">
                          {formatDate(order.date || order.created_at)}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-ts-krem">
                          {order.productName || order.sku || 'Kaos TeeStock Apparel'}
                        </h4>
                        <p className="text-xs text-ts-kremMuted">
                          {order.garment || 'NSA Heavyweight 24s'} • Warna: {order.color || 'Hitam'} • Ukuran: {order.size || 'L'} • Qty: {order.qty || 1} pcs
                        </p>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <span className="text-[10px] text-ts-muted block">Total Pembayaran</span>
                        <span className="font-mono text-base font-black text-ts-green">
                          {formatRupiah(order.price || order.total || 99000)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-ts-muted">
                      <Link to={`/tracking?order=${encodeURIComponent(order.id || order.order_number)}`} className="text-ts-terracotta hover:underline font-bold flex items-center gap-1 min-h-[44px]">
                        <span>Lacak Progres Detail &rarr;</span>
                      </Link>
                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Halo TeeStock! Mau tanya update pesanan saya ${order.id || order.order_number}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ts-muted hover:text-ts-krem flex items-center gap-1 min-h-[44px] px-2"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-ts-green" />
                        <span>Chat Admin</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: ALAMAT PENGIRIMAN ─────────────────────────── */}
      {activeTab === 'profile' && (
        <form noValidate onSubmit={handleSaveProfile} className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border shadow-sm space-y-6 animate-in fade-in duration-300 transition-colors">
          <div className="border-b border-ts-border pb-4">
            <h3 className="text-base font-bold text-ts-krem">Informasi Penerima &amp; Alamat Pengiriman</h3>
            <p className="text-xs text-ts-kremMuted mt-0.5">
              Data ini akan otomatis terisi saat kamu melakukan checkout pesanan berikutnya.
            </p>
          </div>

          {profileMsg && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              profileMsg.type === 'success' 
                ? 'bg-ts-green/15 border border-ts-green/30 text-ts-green' 
                : 'bg-red-500/15 border border-red-500/30 text-red-500'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Penerima *"
              placeholder="Contoh: Budi Santoso"
              value={fullName}
              error={profileErrors.fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (profileErrors.fullName) setProfileErrors(prev => ({ ...prev, fullName: null }));
              }}
            />
            <Input
              label="Nomor WhatsApp (Aktif) *"
              placeholder="0812-xxxx-xxxx"
              type="tel"
              value={phone}
              error={profileErrors.phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (profileErrors.phone) setProfileErrors(prev => ({ ...prev, phone: null }));
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Kota / Kabupaten *"
              placeholder="Contoh: Bandung"
              value={city}
              error={profileErrors.city}
              onChange={(e) => {
                setCity(e.target.value);
                if (profileErrors.city) setProfileErrors(prev => ({ ...prev, city: null }));
              }}
            />
            <Input
              label="Provinsi"
              placeholder="Jawa Barat"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
            <Input
              label="Kode Pos"
              placeholder="40123"
              value={postalCode}
              error={profileErrors.postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
                if (profileErrors.postalCode) setProfileErrors(prev => ({ ...prev, postalCode: null }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ts-krem">Alamat Lengkap Pengiriman *</label>
            <textarea
              placeholder="Jalan, No. Rumah, RT/RW, Patokan..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (profileErrors.address) setProfileErrors(prev => ({ ...prev, address: null }));
              }}
              rows={3}
              className={`w-full bg-ts-surfaceHover/50 border rounded-2xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta ${
                profileErrors.address ? 'border-red-500' : 'border-ts-border'
              }`}
            />
            {profileErrors.address && (
              <span className="text-[11px] text-red-400 font-mono block">
                {profileErrors.address}
              </span>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" size="md" variant="glow" icon={Save} disabled={savingProfile} className="min-h-[44px]">
              {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      )}

      {/* ─── TAB 3: VOUCHER & KUPON ───────────────────────────── */}
      {activeTab === 'vouchers' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="border-b border-ts-border pb-3">
            <h3 className="text-base font-bold text-ts-krem">Voucher &amp; Promo Aktif Kamu</h3>
            <p className="text-xs text-ts-kremMuted mt-0.5">
              Salin kode kupon dan tempelkan di keranjang belanja saat checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vouchers.map((v) => (
              <div
                key={v.code}
                className="p-5 rounded-3xl bg-ts-surface border border-ts-border shadow-sm flex flex-col justify-between space-y-4 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30 uppercase">
                      {v.type}
                    </span>
                    <Sparkles className="w-4 h-4 text-ts-mustard" />
                  </div>
                  <h4 className="text-base font-bold text-ts-krem">{v.title}</h4>
                  <p className="text-xs text-ts-kremMuted leading-relaxed">{v.description}</p>
                  {v.min_order > 0 && (
                    <span className="inline-block text-[10px] text-ts-muted">
                      Min. Belanja: {formatRupiah(v.min_order)}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-ts-border flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-ts-krem px-2.5 py-1 rounded-lg bg-ts-surfaceHover border border-ts-border">
                    {v.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyVoucher(v.code)}
                    className="min-h-[44px] min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-ts-terracotta hover:bg-ts-terracotta/90 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedCode === v.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: PORTAL KEMITRAAN ──────────────────────────── */}
      {activeTab === 'partner' && (
        <div className="max-w-3xl p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border shadow-sm space-y-6 animate-in fade-in duration-300 transition-colors">
          <div className="flex items-center justify-between border-b border-ts-border pb-4">
            <div>
              <h3 className="text-base font-bold text-ts-krem">Program Kemitraan Dropship &amp; Reseller</h3>
              <p className="text-xs text-ts-kremMuted mt-0.5">
                Mulai bisnis apparel tanpa modal stok dan mesin sablon dengan dukungan penuh TeeStock Studio.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-ts-mustard/20 text-ts-mustard border border-ts-mustard/30 uppercase">
              Tier: {profile?.partner_tier || 'Member Ritel'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border space-y-2">
              <span className="text-xs font-bold text-ts-krem block">Harga Modal Grosir VIP</span>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Mendapatkan margin Rp 24.000 - Rp 50.000 per kaos dengan modal mitra mulai Rp 65.000 - Rp 75.000 per pcs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border space-y-2">
              <span className="text-xs font-bold text-ts-krem block">Pengiriman White-Label</span>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Nama dan nomor pengirim di label paket menggunakan nama tokomu sendiri. Bebas dari atribut TeeStock.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-ts-mustard/15 to-transparent border border-ts-mustard/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-ts-krem">Ajukan Upgrade ke Akun Mitra Dropship</h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">
                Proses kurasi cepat 1x24 jam untuk pengaktifan tier harga grosir.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/partner" className="min-h-[44px]">
                <Button variant="secondary" size="sm" className="min-h-[44px]">
                  Pelajari Simulator
                </Button>
              </Link>
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Halo TeeStock! Saya ${profile?.full_name || user?.email} ingin mengajukan upgrade akun ke Mitra Dropshipper/Reseller TeeStock.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] shrink-0 px-5 py-2.5 rounded-xl bg-ts-mustard hover:bg-ts-mustard/90 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Ajukan via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
