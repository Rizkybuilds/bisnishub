import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const snapshot = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const db = new PGlite();
const ident = s => '"' + s.replaceAll('"','""') + '"';
const views = new Set(snapshot.views.map(v=>v.viewname));
const tables = [...new Set(snapshot.columns.map(c=>c.table_name))].filter(t=>!views.has(t));
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.role',true),'') $$;
GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;`);
for (const table of tables) {
 const cols=snapshot.columns.filter(c=>c.table_name===table).sort((a,b)=>a.ordinal_position-b.ordinal_position);
 const sql=cols.map(c=>`${ident(c.column_name)} ${c.data_type}${c.data_type==='character varying'&&c.character_maximum_length?`(${c.character_maximum_length})`:c.data_type==='numeric'&&c.numeric_precision?`(${c.numeric_precision},${c.numeric_scale})`:''}${c.column_default?` DEFAULT ${c.column_default}`:''}${c.is_nullable==='NO'?' NOT NULL':''}`).join(',');
 await db.exec(`CREATE TABLE public.${ident(table)} (${sql})`);
}
for(const p of snapshot.data.ts_user_profiles) await db.query('INSERT INTO auth.users(id,email) VALUES($1,$2)',[p.id,p.email]);
for(const [table,rows] of Object.entries(snapshot.data)) {
 await db.query(`INSERT INTO public.${ident(table)} SELECT * FROM jsonb_populate_recordset(NULL::public.${ident(table)},$1::jsonb)`,[JSON.stringify(rows)]);
 assert.equal((await db.query(`SELECT count(*)::int n FROM public.${ident(table)}`)).rows[0].n,rows.length);
}
for(const c of [...snapshot.constraints].sort((a,b)=>Number(a.definition.startsWith('FOREIGN KEY'))-Number(b.definition.startsWith('FOREIGN KEY'))))
 await db.exec(`ALTER TABLE public.${ident(c.table)} ADD CONSTRAINT ${ident(c.name)} ${c.definition}`);
for(const f of snapshot.functions) await db.exec(f.definition);
for(const t of snapshot.triggers) await db.exec(t);
for(const v of snapshot.views) await db.exec(`CREATE VIEW public.${ident(v.viewname)} AS ${v.definition}`);
for(const g of snapshot.grants) {
 if(['postgres','anon','authenticated','service_role'].includes(g.grantee)) await db.exec(`GRANT ${g.privilege_type} ON public.${ident(g.table_name)} TO ${ident(g.grantee)}`);
}
for(const p of snapshot.policies) {
 await db.exec(`ALTER TABLE public.${ident(p.tablename)} ENABLE ROW LEVEL SECURITY`);
 await db.exec(`CREATE POLICY ${ident(p.policyname)} ON public.${ident(p.tablename)} AS ${p.permissive} FOR ${p.cmd} TO ${p.roles.map(ident).join(',')}${p.qual?` USING (${p.qual})`:''}${p.with_check?` WITH CHECK (${p.with_check})`:''}`);
}
console.log('Snapshot restored:',Object.fromEntries(Object.entries(snapshot.data).map(([k,v])=>[k,v.length])));
for(const name of ['20260922_audit_hardening.sql','20260923_transaction_guards.sql']) {
 await db.exec(readFileSync(new URL(`../../../bisnis/teestock/database/migrations/${name}`,import.meta.url),'utf8'));
 console.log('Applied locally:',name);
}
for(const [table,rows] of Object.entries(snapshot.data)) assert.equal((await db.query(`SELECT count(*)::int n FROM public.${ident(table)}`)).rows[0].n,rows.length);
await db.exec("BEGIN; SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claim.role','authenticated',true)");
assert.equal((await db.query('SELECT public.is_admin() value')).rows[0].value,false);
for(const table of ['ts_orders','ts_inventory','ts_cash_ledger','ts_procurements']) assert.equal((await db.query(`SELECT count(*)::int n FROM public.${ident(table)}`)).rows[0].n,0,`${table} leaks to non-admin`);
await db.exec('ROLLBACK');
console.log('PASS: snapshot restoration, both migrations, row preservation and non-admin isolation. Auth users are simulated; this is not a full Supabase disaster-recovery backup.');
await db.close();
