import { supabase } from './supabase';

/**
 * Fallback preset vouchers jika koneksi Supabase atau migrasi tabel belum dijalankan
 */
const FALLBACK_VOUCHERS = [
  {
    code: 'WELCOME10',
    title: 'Diskon Perdana 10%',
    description: 'Potongan 10% untuk pesanan perdana pelanggan baru',
    type: 'discount',
    discount_type: 'percent',
    discount_value: 10,
    min_order: 0,
    target_role: 'all',
    is_active: true,
  },
  {
    code: 'TEESTOCKDROP',
    title: 'Potongan Rp 10.000 Edisi Drop',
    description: 'Potongan Rp 10.000 untuk pembelian minimal Rp 89.000',
    type: 'discount',
    discount_type: 'fixed',
    discount_value: 10000,
    min_order: 89000,
    target_role: 'all',
    is_active: true,
  },
  {
    code: 'FREESHIP15',
    title: 'Subsidi Ongkir Rp 15.000',
    description: 'Gratis subsidi ongkos kirim Rp 15.000 dengan minimal belanja Rp 150.000',
    type: 'free_shipping',
    discount_type: 'fixed',
    discount_value: 15000,
    min_order: 150000,
    target_role: 'all',
    is_active: true,
  },
  {
    code: 'FOUNDER30',
    title: 'Apresiasi Founder Drop Rp 20.000 OFF',
    description: 'Harga perdana Rp 79.000 khusus 30 pembeli pertama Drop #01 Origins',
    type: 'discount',
    discount_type: 'fixed',
    discount_value: 20000,
    min_order: 99000,
    target_role: 'all',
    is_active: true,
  },
];

/**
 * Validasi kode voucher untuk keranjang belanja
 * @param {string} rawCode - Kode voucher yang dimasukkan pengguna
 * @param {number} cartTotal - Nilai total belanjaan
 * @param {string} userRole - Role pengguna ('visitor', 'member', 'partner', 'admin')
 */
export async function validateVoucher(rawCode, cartTotal, userRole = 'member') {
  if (!rawCode || !rawCode.trim()) {
    return { valid: false, message: 'Masukkan kode voucher.' };
  }

  const code = rawCode.trim().toUpperCase();

  try {
    // 1. Cek voucher di database Supabase
    const { data: dbVoucher, error } = await supabase
      .from('ts_vouchers')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();

    const voucher = dbVoucher || FALLBACK_VOUCHERS.find(v => v.code === code);

    if (!voucher) {
      return { valid: false, message: `Kode voucher "${code}" tidak ditemukan atau sudah tidak aktif.` };
    }

    // 2. Cek tanggal kedaluwarsa
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      return { valid: false, message: 'Voucher ini sudah melewati masa berlaku.' };
    }

    // 2b. Cek batas penggunaan total (kuota voucher)
    if (voucher.usage_limit && Number(voucher.used_count || 0) >= Number(voucher.usage_limit)) {
      return { valid: false, message: 'Kuota penggunaan voucher ini sudah habis.' };
    }

    // 3. Cek pembatasan role
    if (voucher.target_role && voucher.target_role !== 'all') {
      if (voucher.target_role === 'partner' && userRole !== 'partner' && userRole !== 'admin') {
        return { valid: false, message: 'Voucher ini khusus untuk akun Mitra Dropship/Reseller.' };
      }
    }

    // 4. Cek minimal belanja
    if (voucher.min_order && cartTotal < Number(voucher.min_order)) {
      return { 
        valid: false, 
        message: `Minimal belanja untuk voucher ini adalah Rp ${Number(voucher.min_order).toLocaleString('id-ID')}.` 
      };
    }

    // 5. Hitung besaran diskon
    let discountAmount = 0;
    if (voucher.discount_type === 'percent') {
      discountAmount = Math.round(cartTotal * (Number(voucher.discount_value) / 100));
      if (voucher.max_discount && discountAmount > Number(voucher.max_discount)) {
        discountAmount = Number(voucher.max_discount);
      }
    } else {
      discountAmount = Math.min(Number(voucher.discount_value), cartTotal);
    }

    return {
      valid: true,
      voucher,
      discountAmount,
      message: `Voucher "${voucher.code}" berhasil digunakan! Hemat Rp ${discountAmount.toLocaleString('id-ID')}.`,
    };
  } catch (err) {
    console.warn('Voucher validation fallback:', err);
    // Cek fallback lokal
    const fallback = FALLBACK_VOUCHERS.find(v => v.code === code);
    if (fallback) {
      let discountAmount = fallback.discount_type === 'percent'
        ? Math.round(cartTotal * (fallback.discount_value / 100))
        : Math.min(fallback.discount_value, cartTotal);

      return {
        valid: true,
        voucher: fallback,
        discountAmount,
        message: `Voucher "${fallback.code}" aktif! Hemat Rp ${discountAmount.toLocaleString('id-ID')}.`,
      };
    }
    return { valid: false, message: 'Gagal memvalidasi voucher. Coba lagi.' };
  }
}

/**
 * Ambil daftar voucher aktif yang dapat dilihat pengguna
 */
export async function getActiveVouchers(userRole = 'all') {
  try {
    const { data, error } = await supabase
      .from('ts_vouchers')
      .select('*')
      .eq('is_active', true)
      .order('discount_value', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.filter(v => v.target_role === 'all' || v.target_role === userRole);
    }
  } catch (err) {
    console.warn('Get vouchers notice:', err);
  }
  return FALLBACK_VOUCHERS;
}
