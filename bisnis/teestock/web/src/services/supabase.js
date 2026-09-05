import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[TeeStock] VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY belum diatur!\n' +
    'Salin .env.example ke .env.local dan isi dengan credentials Supabase kamu.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Check whether Supabase connection is currently active and reachable
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('ts_products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { connected: true, message: 'Terhubung ke Cloud Supabase Singapore' };
  } catch (err) {
    console.warn('Supabase offline fallback:', err.message);
    return { connected: false, message: err.message || 'Menggunakan penyimpanan lokal (Offline mode)' };
  }
}
