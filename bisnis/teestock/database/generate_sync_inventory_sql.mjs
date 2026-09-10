import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GARMENT_TYPES, SIZES } from '../web/src/constants/garments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSql() {
  let sql = `-- ====================================================================
-- TEESTOCK APPAREL & FOUNDER HUB — SINKRONISASI REAL DATABASE INVENTORI
-- Target Supabase: https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new
-- Tabel Target: ts_inventory & ts_settings
-- ====================================================================

BEGIN;

-- 1. PEMBARUAN ROW LEVEL SECURITY (RLS) POLICIES
-- Memberikan akses baca publik & izin update dari aplikasi web
ALTER TABLE public.ts_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_inventory" ON public.ts_inventory;
DROP POLICY IF EXISTS "public_read_inventory" ON public.ts_inventory;
DROP POLICY IF EXISTS "manage_inventory_all" ON public.ts_inventory;

CREATE POLICY "public_read_inventory" ON public.ts_inventory FOR SELECT USING (true);
CREATE POLICY "manage_inventory_all" ON public.ts_inventory FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ts_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_settings" ON public.ts_settings;
DROP POLICY IF EXISTS "anon_read_settings" ON public.ts_settings;
DROP POLICY IF EXISTS "manage_settings_all" ON public.ts_settings;

CREATE POLICY "anon_read_settings" ON public.ts_settings FOR SELECT USING (true);
CREATE POLICY "manage_settings_all" ON public.ts_settings FOR ALL USING (true) WITH CHECK (true);

-- Pastikan modul transaksi finansial juga bisa di-update
ALTER TABLE public.ts_procurements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all_procurements" ON public.ts_procurements;
DROP POLICY IF EXISTS "manage_procurements_all" ON public.ts_procurements;
CREATE POLICY "manage_procurements_all" ON public.ts_procurements FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ts_cash_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all_cash_ledger" ON public.ts_cash_ledger;
DROP POLICY IF EXISTS "manage_cash_ledger_all" ON public.ts_cash_ledger;
CREATE POLICY "manage_cash_ledger_all" ON public.ts_cash_ledger FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ts_fixed_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_fixed_assets" ON public.ts_fixed_assets;
DROP POLICY IF EXISTS "manage_fixed_assets_all" ON public.ts_fixed_assets;
CREATE POLICY "manage_fixed_assets_all" ON public.ts_fixed_assets FOR ALL USING (true) WITH CHECK (true);

-- 2. INSERT / UPSERT MASTER INVENTORI STOK KAOS POLOS NSA (324 SKUS)
INSERT INTO public.ts_inventory (
  sku_item, item_type, brand, color, size, unit_measure, stock_qty, min_stock_alert, cost_per_unit, supplier
) VALUES
`;

  const values = [];
  const matrix = {
    supplies: {
      polymailer: 120,
      sticker: 150,
      care_card: 100,
      hangtag: 100,
      teflon_sheet: 5,
      lakban: 6
    },
    dtf_films: {},
    nsa_softstyle_30s: {},
    nsa_heavyweight_24s: {}
  };

  // A. Blank Garments
  Object.entries(GARMENT_TYPES).forEach(([gKey, gObj]) => {
    if (gKey === 'supplies') return;
    if (!matrix[gKey]) matrix[gKey] = {};
    const colors = gObj.colors || [];
    colors.forEach(colObj => {
      const col = colObj.name;
      if (!matrix[gKey][col]) matrix[gKey][col] = {};
      SIZES.forEach(sz => {
        const cleanCol = col.toUpperCase().replace(/\s+/g, '');
        const sku = `${gObj.code || 'NSA'}-${cleanCol}-${sz}`;
        // Buffer stok: kaos hitam & putih ukuran M & L stok 8-12, lainnya 2-4
        let defaultStock = 3;
        if ((col === 'Hitam' || col === 'Putih')) {
          if (sz === 'L') defaultStock = 12;
          else if (sz === 'M') defaultStock = 8;
          else if (sz === 'XL') defaultStock = 6;
        }

        matrix[gKey][col][sz] = defaultStock;
        const cost = gObj.baseCost || 38000;
        const brand = gObj.name.replace(/'/g, "''");
        values.push(`('${sku}', 'blank_tshirt', '${brand}', '${col}', '${sz}', 'pcs', ${defaultStock}, 3, ${cost}, 'Distributor Resmi NSA')`);
      });
    });
  });

  // B. DTF Roll & Film Sheets
  values.push(`('DTF-ROLL-58CM', 'dtf_film', 'Roll Film DTF 58 cm x 100 m', 'Transparan', 'Roll 58 cm', 'meter', 35, 10, 30000, 'Vendor DTF Partner')`);
  const dtfGraphics = [
    { sku: 'TS-PRO-001', name: 'Commit & Pray', ready: 6, cost: 12000 },
    { sku: 'TS-PRO-002', name: 'Architects Blueprint', ready: 4, cost: 12000 },
    { sku: 'TS-KOM-001', name: '7 Summits 3000 MDPL', ready: 5, cost: 12000 },
    { sku: 'TS-KOM-002', name: 'Born to Hike', ready: 4, cost: 12000 },
    { sku: 'TS-LOK-001', name: 'Wong Jowo Ojo Ilang', ready: 5, cost: 12000 },
    { sku: 'TS-LOK-002', name: 'Urang Sunda Kujang', ready: 4, cost: 12000 },
    { sku: 'TS-REC-001', name: 'Crisis with Iced Coffee', ready: 5, cost: 12000 },
    { sku: 'TS-FAN-001', name: 'Neo Tokyo 1988', ready: 4, cost: 12000 }
  ];
  dtfGraphics.forEach(d => {
    matrix.dtf_films[d.sku] = {
      name: d.name,
      size: 'A3 (30x40 cm)',
      ready: d.ready,
      min: 2,
      unitCost: d.cost,
      category: 'graphic'
    };
    values.push(`('${d.sku}', 'dtf_film', 'Film DTF ${d.name}', 'Sablon DTF', 'A3', 'lembar', ${d.ready}, 2, ${d.cost}, 'Vendor DTF Partner')`);
  });

  // C. Supplies & MultiGraph Packaging
  values.push(`('MAT-POLY-30X40', 'supplies', 'Polymailer Hitam Doff 30x40', 'Hitam Doff', '30x40 cm', 'pcs', 120, 20, 800, 'MultiGraph Packaging & Printing')`);
  values.push(`('MAT-STICKER-VP', 'supplies', 'Stiker Vinyl Unboxing 6x6 cm', 'Vinyl Matte', '6x6 cm', 'pcs', 150, 25, 600, 'MultiGraph Printing')`);
  values.push(`('MAT-CARE-A6', 'supplies', 'Care Card & Thank You Insert A6', 'Kraft 260 gsm', 'A6', 'pcs', 100, 20, 400, 'MultiGraph Printing')`);
  values.push(`('MAT-HANGTAG-01', 'supplies', 'Hangtag Distro Kraft Tebal', 'Kraft', 'Standard', 'pcs', 100, 20, 500, 'MultiGraph Printing')`);
  values.push(`('MAT-TEFLON-SHEET', 'supplies', 'Kertas Teflon Heat Press', 'PTFE Sheet', '40x50 cm', 'lembar', 5, 2, 25000, 'Vendor Alat Sablon')`);
  values.push(`('MAT-LAKBAN-FRAGILE', 'supplies', 'Lakban Fragile & Bening', 'Bening', '100 m', 'roll', 6, 2, 15000, 'Toko ATK')`);

  sql += values.join(',\n') + '\n';
  sql += `ON CONFLICT (sku_item) DO UPDATE SET
  stock_qty = EXCLUDED.stock_qty,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  updated_at = NOW();

-- 3. INITIALIZE INVENTORY_MATRIX DI TS_SETTINGS DENGAN DATA LENGKAP
INSERT INTO public.ts_settings (key, value, updated_at)
VALUES (
  'inventory_matrix',
  '${JSON.stringify(matrix).replace(/'/g, "''")}'::jsonb,
  NOW()
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

COMMIT;
`;

  const outputPath = path.join(__dirname, 'sync_inventory.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  console.log('✅ Berhasil membuat file SQL:', outputPath);
  console.log('Total item tercatat dalam seed:', values.length);
}

generateSql();
