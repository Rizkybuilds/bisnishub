import { supabase } from './supabase';

export const DEFAULT_STORE_SETTINGS = {
  storeWhatsapp: '085220274968',
  shopeeUrl: 'https://shopee.co.id',
  tiktokUrl: 'https://tiktok.com',
  instagramUrl: 'https://instagram.com',
  qrisMerchantName: 'TeeStock Apparel',
  qrisNmid: 'ID102609070001',
  qrisImageUrl: '',
  bankName: 'BCA',
  bankAccountNo: '',
  bankAccountHolder: 'TeeStock Apparel'
};

const LOCAL_STORAGE_SETTINGS_KEY = 'teestock_store_settings';

/**
 * 🌐 Ambil pengaturan toko dari Cloud Supabase (ts_settings)
 * dengan sinkronisasi otomatis ke localStorage pembeli.
 */
export async function getStoreSettings() {
  let cached = { ...DEFAULT_STORE_SETTINGS };
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (local) {
      cached = { ...cached, ...JSON.parse(local) };
    }
  } catch (e) {
    // Ignore JSON parse error
  }

  try {
    const { data, error } = await supabase
      .from('ts_settings')
      .select('key, value');

    if (!error && data && data.length > 0) {
      let merged = { ...cached };
      data.forEach(row => {
        if (row && row.value && typeof row.value === 'object') {
          merged = { ...merged, ...row.value };
        }
      });

      // Normalisasi nomor CS default
      if (merged.storeWhatsapp === '081280000581' || !merged.storeWhatsapp) {
        merged.storeWhatsapp = '085220274968';
      }

      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Gagal memuat ts_settings dari Supabase, menggunakan cache lokal:', err);
  }

  return cached;
}

/**
 * 💾 Simpan pengaturan toko ke Cloud Supabase (ts_settings) & localStorage
 */
export async function saveStoreSettings(newSettings) {
  let current = { ...DEFAULT_STORE_SETTINGS };
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (local) {
      current = { ...current, ...JSON.parse(local) };
    }
  } catch (e) {}

  const merged = { ...current, ...newSettings };

  // Normalisasi nomor kontak
  if (merged.storeWhatsapp === '081280000581' || !merged.storeWhatsapp) {
    merged.storeWhatsapp = '085220274968';
  }

  // Update localStorage terlebih dahulu untuk UX instan
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
  } catch (e) {}

  // Kirim ke Supabase Cloud tabel ts_settings
  try {
    const contactPayload = {
      storeWhatsapp: merged.storeWhatsapp,
      shopeeUrl: merged.shopeeUrl,
      tiktokUrl: merged.tiktokUrl,
      instagramUrl: merged.instagramUrl
    };

    const qrisPayload = {
      qrisMerchantName: merged.qrisMerchantName,
      qrisNmid: merged.qrisNmid,
      qrisImageUrl: merged.qrisImageUrl,
      bankName: merged.bankName,
      bankAccountNo: merged.bankAccountNo,
      bankAccountHolder: merged.bankAccountHolder
    };

    const rows = [
      { key: 'store_contact', value: contactPayload, updated_at: new Date().toISOString() },
      { key: 'payment_qris', value: qrisPayload, updated_at: new Date().toISOString() }
    ];

    const { error } = await supabase
      .from('ts_settings')
      .upsert(rows, { onConflict: 'key' });

    if (error) {
      console.warn('Peringatan: Gagal menyimpan pengaturan ke cloud Supabase (cek RLS/tabel):', error.message);
      return { success: false, error: error.message, data: merged };
    }

    return { success: true, data: merged };
  } catch (err) {
    console.warn('Error jaringan saat menyimpan pengaturan ke Supabase:', err);
    return { success: false, error: err.message, data: merged };
  }
}
