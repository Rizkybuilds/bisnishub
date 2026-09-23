import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { before, after, beforeEach, afterEach, test } from 'node:test';

const db = new PGlite();
const root = new URL('../../../', import.meta.url);
const migration = ['20260922_audit_hardening.sql', '20260923_transaction_guards.sql']
  .map(name => readFileSync(new URL(`bisnis/teestock/database/migrations/${name}`, root), 'utf8')).join('\n');
const schema = readFileSync(new URL('bisnis/teestock/database/schema.sql', root), 'utf8');
const admin = '00000000-0000-4000-8000-000000000001';
const member = '00000000-0000-4000-8000-000000000002';
const newcomer = '00000000-0000-4000-8000-000000000003';
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
async function identity(role, id = '') {
  assert.ok(['anon', 'authenticated', 'service_role'].includes(role));
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,true),set_config('request.jwt.claim.role',$2,true)", [id, role]);
  await db.exec(`SET LOCAL ROLE ${role}`);
}
async function rejected(action, pattern) {
  await db.exec('SAVEPOINT expected_failure');
  await assert.rejects(action, pattern);
  await db.exec('ROLLBACK TO SAVEPOINT expected_failure');
}
async function order(number = 'TS-TEST', method = 'manual_qris') {
  const id = crypto.randomUUID();
  await db.query(`INSERT INTO ts_orders(id,order_number,customer_name,total_amount,subtotal,shipping_fee,unique_code,status,payment_method)
    VALUES($1,$2,'Test Customer',110123,100000,10000,123,'pending_payment',$3)`, [id, number, method]);
  return id;
}

before(async () => {
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users(id uuid PRIMARY KEY);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.role',true),'') $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
    INSERT INTO auth.users VALUES('${admin}'),('${member}'),('${newcomer}');`);
  // Use actual table definitions, without running the destructive reset or demo seeds.
  for (const match of schema.matchAll(/CREATE TABLE(?: IF NOT EXISTS)? [\s\S]*?\r?\n\);/g)) await db.exec(match[0]);
  await db.exec(`INSERT INTO ts_user_profiles(id,role) VALUES('${admin}','admin'),('${member}','member');
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon,authenticated,service_role;
    CREATE POLICY manage_orders_all ON ts_orders FOR ALL TO public USING(true) WITH CHECK(true);
    ALTER TABLE ts_user_profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY user_update_own_profile ON ts_user_profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
    CREATE POLICY user_read_own_profile ON ts_user_profiles FOR SELECT TO authenticated USING(id=auth.uid());`);
  await db.exec(migration);
}, { timeout: 60000 });
beforeEach(async () => { await db.exec('BEGIN'); });
afterEach(async () => { await db.exec('ROLLBACK'); });
after(async () => { await db.close(); });

test('migration can be reapplied without deleting existing rows', async () => {
  await db.exec('ROLLBACK');
  await order('TS-PRESERVE');
  await db.exec(migration);
  assert.equal((await one("SELECT count(*)::int n FROM ts_orders WHERE order_number='TS-PRESERVE'")).n,1);
  await db.exec('BEGIN');
});
test('function owner never turns a customer into an administrator', async () => {
  await identity('authenticated', member);
  assert.equal((await one('SELECT is_admin() value')).value,false);
  await rejected(() => db.exec("SELECT confirm_manual_payment('TS-TEST')"), /Administrator required/);
  await rejected(() => db.exec("UPDATE ts_user_profiles SET role='admin' WHERE id=auth.uid()"), /Only administrators/);
});
test('new members cannot insert an administrator profile', async () => {
  await identity('authenticated', newcomer);
  await rejected(() => db.query("INSERT INTO ts_user_profiles(id,role) VALUES($1,'admin')",[newcomer]), /row-level security/);
});
test('anonymous users cannot read orders or change catalog', async () => {
  await identity('anon');
  await rejected(() => db.exec('SELECT * FROM ts_orders'), /permission denied/);
  await rejected(() => db.exec("DELETE FROM ts_products"), /permission denied/);
  assert.deepEqual((await db.query('SELECT * FROM ts_products')).rows,[]);
});
test('manual payment posts product, courier, and code amounts exactly once', async () => {
  await order();
  await identity('authenticated',admin);
  await db.exec("SELECT confirm_manual_payment('TS-TEST'); SELECT confirm_manual_payment('TS-TEST');");
  assert.deepEqual(await one('SELECT count(*)::int n,sum(amount)::int total FROM ts_cash_ledger'),{n:3,total:110123});
  assert.equal((await one("SELECT amount::int amount FROM ts_cash_ledger WHERE category='sales_retail'")).amount,100000);
  assert.equal((await one("SELECT status FROM ts_orders WHERE order_number='TS-TEST'")).status,'pending');
});
test('manual confirmation cannot mark a gateway order paid', async () => {
  await order('TS-GATEWAY','midtrans_snap');
  await identity('authenticated',admin);
  await rejected(() => db.exec("SELECT confirm_manual_payment('TS-GATEWAY')"), /Gateway payment/);
});
test('production refuses unpaid orders', async () => {
  await order();
  await identity('authenticated',admin);
  await rejected(() => db.exec("SELECT transition_order('TS-TEST','dtf','[]')"), /Payment must be confirmed/);
});
test('insufficient stock rolls back all deductions and the order status', async () => {
  await order();
  await db.exec("INSERT INTO ts_inventory(sku_item,item_type,cost_per_unit,stock_qty) VALUES('A','supplies',100,3),('Z','supplies',100,0)");
  await identity('authenticated',admin);
  await db.exec("SELECT confirm_manual_payment('TS-TEST')");
  await rejected(() => db.query("SELECT transition_order('TS-TEST','dtf',$1)",[JSON.stringify([{sku:'A',qty:2},{sku:'Z',qty:1}])]), /Insufficient stock/);
  assert.equal((await one("SELECT stock_qty FROM ts_inventory WHERE sku_item='A'")).stock_qty,3);
  assert.equal((await one("SELECT status FROM ts_orders WHERE order_number='TS-TEST'")).status,'pending');
});
test('retrying a production transition does not deduct stock twice', async () => {
  await order();
  await db.exec("INSERT INTO ts_inventory(sku_item,item_type,cost_per_unit,stock_qty) VALUES('A','supplies',100,3)");
  await identity('authenticated',admin);
  await db.exec("SELECT confirm_manual_payment('TS-TEST')");
  for(let i=0;i<2;i++) await db.query("SELECT transition_order('TS-TEST','dtf',$1)",[JSON.stringify([{sku:'A',qty:2}])]);
  assert.equal((await one("SELECT stock_qty FROM ts_inventory WHERE sku_item='A'")).stock_qty,1);
});
test('procurement posts one receipt and one cash outflow in the selected unit', async () => {
  await db.exec("INSERT INTO ts_inventory(sku_item,item_type,cost_per_unit,stock_qty) VALUES('A','supplies',100,2)");
  await identity('authenticated',admin);
  await db.query(`INSERT INTO ts_procurements(procurement_no,item_type,item_name,supplier_name,qty,unit_cost,total_cost,payment_source,inventory_items)
    VALUES('PO-TEST','supplies','Paper','Vendor',2,200,400,'multigraph_bank',$1)`,[JSON.stringify([{sku:'A',qty:2,unit_cost:200}])]);
  assert.deepEqual(await one("SELECT stock_qty,cost_per_unit::int cost FROM ts_inventory WHERE sku_item='A'"),{stock_qty:4,cost:150});
  assert.deepEqual(await one('SELECT business_unit,amount::int amount FROM ts_cash_ledger'),{business_unit:'multigraph',amount:400});
  await rejected(() => db.exec("DELETE FROM ts_procurements WHERE procurement_no='PO-TEST'"), /proses koreksi/);
  await rejected(() => db.exec("UPDATE ts_procurements SET total_cost=1 WHERE procurement_no='PO-TEST'"), /proses koreksi/);
  assert.equal((await one('SELECT count(*)::int n FROM ts_procurements')).n,1);
  assert.equal((await one("SELECT stock_qty FROM ts_inventory WHERE sku_item='A'")).stock_qty,4);
});

test('unpaid manual cancellation preserves notes and is idempotent', async () => {
  await order();
  await db.exec("UPDATE ts_orders SET notes='Ukuran L' WHERE order_number='TS-TEST'");
  await identity('authenticated',admin);
  await db.exec("SELECT cancel_unpaid_order('TS-TEST','Pelanggan membatalkan'); SELECT cancel_unpaid_order('TS-TEST','Ulang')");
  assert.deepEqual(await one("SELECT status,notes FROM ts_orders WHERE order_number='TS-TEST'"),{status:'cancelled',notes:'Ukuran L | Dibatalkan: Pelanggan membatalkan'});
  assert.equal((await one('SELECT count(*)::int n FROM ts_cash_ledger')).n,0);
});
test('paid cancellation is rejected both via RPC and direct update', async () => {
  await order();
  await identity('authenticated',admin);
  await db.exec("SELECT confirm_manual_payment('TS-TEST')");
  await rejected(() => db.exec("SELECT cancel_unpaid_order('TS-TEST','')"), /sudah dibayar/);
  await rejected(() => db.exec("UPDATE ts_orders SET status='cancelled' WHERE order_number='TS-TEST'"), /rekonsiliasi/);
  assert.equal((await one("SELECT status FROM ts_orders WHERE order_number='TS-TEST'")).status,'pending');
});
test('gateway and historical orders require reconciliation before manual cancellation', async () => {
  await order('TS-GATEWAY','midtrans_snap');
  await order('TS-OLD');
  await db.exec("UPDATE ts_orders SET payment_reconciliation_required=true WHERE order_number='TS-OLD'");
  await identity('authenticated',admin);
  await rejected(() => db.exec("SELECT cancel_unpaid_order('TS-GATEWAY','')"), /penyedia pembayaran/);
  await rejected(() => db.exec("SELECT cancel_unpaid_order('TS-OLD','')"), /historis/);
});
test('members cannot cancel orders', async () => {
  await order();
  await identity('authenticated',member);
  await rejected(() => db.exec("SELECT cancel_unpaid_order('TS-TEST','')"), /Administrator required/);
});
