/**
 * TeeStock — Cloud Supabase Health & Table Verification CLI
 * Menampilkan status koneksi dan keberadaan 16 tabel + view TeeStock di Supabase Cloud.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tovslowsopqtuxmrogeu.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

const TABLES = [
  { name: 'ts_products', group: 'E-Commerce' },
  { name: 'ts_unit_economics', group: 'E-Commerce' },
  { name: 'ts_inventory', group: 'Operasional' },
  { name: 'ts_orders', group: 'Operasional' },
  { name: 'ts_order_items', group: 'Operasional' },
  { name: 'ts_user_profiles', group: 'User & Auth' },
  { name: 'ts_subscribers', group: 'Marketing' },
  { name: 'ts_vouchers', group: 'Marketing' },
  { name: 'ts_voucher_usage', group: 'Marketing' },
  { name: 'ts_defects', group: 'Operasional' },
  { name: 'ts_partner_applications', group: 'Kemitraan' },
  { name: 'ts_reviews', group: 'Marketing' },
  { name: 'ts_settings', group: 'Sistem' },
  // Founder Hub System (New)
  { name: 'ts_procurements', group: 'Founder Hub' },
  { name: 'ts_cash_ledger', group: 'Founder Hub' },
  { name: 'ts_fixed_assets', group: 'Founder Hub' },
  { name: 'ts_capital_investments', group: 'Founder Hub' },
];

async function checkHealth() {
  console.log('='.repeat(55));
  console.log('🏛️  TEESTOCK SUPABASE TABLE STATUS CHECKER');
  console.log('Target URL:', SUPABASE_URL);
  console.log('='.repeat(55));

  let activeCount = 0;
  let missingCount = 0;

  for (const { name, group } of TABLES) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${name}?select=*&limit=1`, {
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${ANON_KEY}`
        }
      });

      if (res.status === 200 || res.status === 401 || res.status === 403) {
        // 200 = accessible, 401/403 = table exists but protected by RLS
        console.log(`✅ [${group.padEnd(12)}] ${name.padEnd(26)} -> AKTIF (Status ${res.status})`);
        activeCount++;
      } else if (res.status === 404) {
        console.log(`❌ [${group.padEnd(12)}] ${name.padEnd(26)} -> BELUM DIBUAT (404 Not Found)`);
        missingCount++;
      } else {
        console.log(`⚠️ [${group.padEnd(12)}] ${name.padEnd(26)} -> Status: ${res.status}`);
      }
    } catch (err) {
      console.error(`💥 [${group.padEnd(12)}] ${name.padEnd(26)} -> Network Error: ${err.message}`);
    }
  }

  console.log('='.repeat(55));
  console.log(`📊 Total: ${activeCount} Aktif | ${missingCount} Belum Dibuat dari ${TABLES.length} Tabel`);
  
  if (missingCount > 0) {
    console.log('\n💡 LANGKAH UPDATE:');
    console.log('1. Buka Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new');
    console.log('2. Buka file: bisnis/teestock/database/migration_founder_system.sql');
    console.log('3. Copy seluruh kodenya, paste di SQL Editor, lalu klik "Run".');
  } else {
    console.log('\n🎉 SELURUH TABEL DATABASE TELAH LENGKAP & AKTIF 100%!');
  }
}

checkHealth();
