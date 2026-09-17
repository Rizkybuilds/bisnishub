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
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { getActiveVouchers } from '../../services/vouchersApi';
import { getUserOrders } from '../../services/ordersApi';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';

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

  // Fetch only this user's orders
  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      getUserOrders(user.id, profile?.phone).then(res => {
        setUserOrders(res || []);
        setLoadingOrders(false);
      });
    } else {
      setUserOrders([]);
    }
  }, [user, profile?.phone]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

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
          <Button size="lg" variant="glow" onClick={() => openAuthModal()}>
            Masuk atau Daftar Sekarang
          </Button>
          <Link to="/katalog">
            <Button size="lg" variant="secondary">
              Lihat Katalog Dulu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEOHead
        title="Akun Saya & Riwayat Pesanan | TeeStock"
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
          <Button size="sm" variant="outline" icon={LogOut} onClick={() => signOut()}>
            Keluar
          </Button>
        </div>
      </div>

      {/* ─── Navigation Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-ts-border pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Riwayat Pesanan ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Alamat Pengiriman</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-ts-terracotta text-white shadow-sm'
              : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Voucher &amp; Kupon</span>
        </button>

        <button
          onClick={() => setActiveTab('partner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
        <div className="space-y-4 animate-in fade-in duration-300">
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
                <Button size="md" variant="glow" icon={ShoppingBag}>
                  Mulai Belanja Kaos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => {
                const statusMap = {
                  pending: { label: 'Menunggu Konfirmasi', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30' },
                  dtf: { label: 'Cetak Film DTF HD', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30' },
                  press: { label: 'Heat Press 155°C', color: 'bg-ts-terracotta/20 text-ts-terracotta border-ts-terracotta/40' },
                  pack: { label: 'QC & Studio Packing', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30' },
                  shipped: { label: 'Sedang Dikirim Kurir', color: 'bg-ts-teal/20 text-ts-teal border-ts-teal/40' },
                  review: { label: 'Pesanan Selesai', color: 'bg-ts-green/15 text-ts-green border-ts-green/30' },
                };
                const statusInfo = statusMap[order.status] || statusMap.pending;

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-ts-surface border border-ts-border shadow-sm space-y-4 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ts-border pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ts-terracotta px-2.5 py-1 rounded-lg bg-ts-terracotta/10 border border-ts-terracotta/30">
                          {order.id}
                        </span>
                        <span className="text-xs text-ts-muted">
                          {formatDate(order.date)}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-ts-krem">
                          {order.productName || order.sku || 'Kaos TeeStock'}
                        </h4>
                        <p className="text-xs text-ts-kremMuted">
                          {order.garment || 'NSA Softstyle 30s'} • Warna: {order.color || 'Hitam'} • Ukuran: {order.size || 'L'} • Qty: {order.qty || 1} pcs
                        </p>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <span className="text-[10px] text-ts-muted block">Total Pembayaran</span>
                        <span className="font-mono text-base font-black text-ts-green">
                          {formatRupiah(order.price || 99000)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-ts-muted">
                      <Link to="/tracking" className="text-ts-terracotta hover:underline font-bold flex items-center gap-1">
                        <span>Lacak Progres Detail &rarr;</span>
                      </Link>
                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Halo TeeStock! Mau tanya update pesanan saya ${order.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ts-muted hover:text-ts-krem flex items-center gap-1"
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
        <form onSubmit={handleSaveProfile} className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border shadow-sm space-y-6 animate-in fade-in duration-300 transition-colors">
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
              label="Nama Lengkap Penerima"
              placeholder="Contoh: Budi Santoso"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Nomor WhatsApp (Aktif)"
              placeholder="0812-xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Kota / Kabupaten"
              placeholder="Contoh: Bandung"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
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
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ts-krem mb-1.5">Alamat Lengkap</label>
            <textarea
              placeholder="Jalan, No. Rumah, RT/RW, Patokan..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full bg-ts-surfaceHover/50 border border-ts-border rounded-2xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" size="md" variant="glow" icon={Save} disabled={savingProfile}>
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
                    onClick={() => handleCopyVoucher(v.code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ts-terracotta hover:bg-ts-terracotta/90 text-white text-xs font-bold transition-all cursor-pointer"
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
              <span className="text-xs font-bold text-ts-krem block">Harga Khusus Mitra</span>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Mendapatkan margin Rp 20.000 - Rp 30.000 per kaos dengan harga modal dropship Rp 74.000 - Rp 87.000 per pcs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border space-y-2">
              <span className="text-xs font-bold text-ts-krem block">Pengiriman White-Label</span>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Nama dan nomor pengirim di label paket menggunakan nama toko/brand kamu sendiri. Bebas atribut TeeStock.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-ts-mustard/15 to-transparent border border-ts-mustard/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-ts-krem">Ajukan Upgrade ke Akun Mitra Dropship</h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">
                Proses aktivasi manual dan kurasi selektif untuk memastikan kemitraan berkualitas.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Halo TeeStock! Saya ${profile?.full_name || user?.email} ingin mengajukan upgrade akun ke Mitra Dropshipper/Reseller TeeStock.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-ts-mustard hover:bg-ts-mustard/90 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Ajukan via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
