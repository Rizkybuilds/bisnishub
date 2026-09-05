import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tovslowsopqtuxmrogeu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

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
