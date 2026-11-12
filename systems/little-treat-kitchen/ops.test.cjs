// Node 22: node --test apps/little-treat-kitchen/ops.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const sql=read('ops/sql/bootstrap.sql');
test('v3 auth operator scripts compile without bundler',()=>{
 for(const file of ['ops-config.js','ops.js','recipes.js'])assert.doesNotThrow(()=>new vm.Script(read(file)),file);
});
test('v3 static HTML includes CSP and no inline login handler',()=>{
 const html=read('ops.html');
 assert.match(html,/Content-Security-Policy/);
 assert.match(html,/script-src 'self'/);
 assert.match(html,/connect-src 'self' https:\/\/\*\.supabase\.co/);
 assert.match(html,/ops-config\.js/);
 assert.match(html,/ops\.js/);
 assert.doesNotMatch(html,/on(load|click|submit)=/i);
});
test('v3 UI refuses to simulate success without a configured database',()=>{
 const nodes=new Map();
 const fake=(id)=>({id,innerHTML:'',classList:{add(){},remove(){}},textContent:'',addEventListener(){}});
 const document={getElementById(id){if(!nodes.has(id))nodes.set(id,fake(id));return nodes.get(id)},addEventListener(){}};
 const context={window:{LT_OPS_CONFIG:{url:'',publishableKey:''},LT_KITCHEN_DATA:{all:[]}},document,sessionStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Intl,Date,URL};
 vm.runInNewContext(read('ops.js'),context);
 const html=nodes.get('ops-root').innerHTML;
 assert.match(html,/belum dihubungkan/);
 assert.match(html,/database khusus Little Treat/i);
 assert.doesNotMatch(html,/Berhasil disimpan/);
});
test('all operational tables have RLS and no anonymous select grants',()=>{
 for(const table of ['lt_members','lt_products','lt_materials','lt_material_costs','lt_bom','lt_orders','lt_order_items','lt_order_financials','lt_stock_moves','lt_purchases','lt_waste_events','lt_daily_closings']){
   assert.ok(sql.includes('alter table public.'+table+' enable row level security;'),table);
 }
 assert.match(sql,/revoke all on all tables in schema public from anon/);
 assert.doesNotMatch(sql,/grant select on public\.lt_order_financials to anon/i);
 assert.doesNotMatch(sql,/grant all on public\..* to anon/i);
});
test('staff only gets server-authenticated atomic order and stock transitions',()=>{
 for(const fn of ['lt_create_order','lt_transition_order','lt_record_purchase','lt_receive_purchase','lt_record_waste','lt_close_day']){
   assert.match(sql,new RegExp('create or replace function public\\.'+fn+'\\('));
   assert.match(sql,new RegExp('revoke all on function public\\.'+fn+'\\('));
 }
 assert.match(sql,/for update/);
 assert.match(sql,/qty_on_hand=qty_on_hand-v_mat.need/);
 assert.match(sql,/not exists\(select 1 from public\.lt_bom/);
 assert.match(sql,/order_id=p_order_id/);
 assert.match(sql,/Hanya owner/);
});
test('finance data withheld from staff and no direct write permissions to sales HPP',()=>{
 assert.match(sql,/create policy lt_fin_owner/);
 assert.match(sql,/create policy lt_cost_owner/);
 assert.match(sql,/create policy lt_purchase_owner/);
 assert.match(sql,/grant update\(discount,platform_fee,other_fee,fees_confirmed,payout_received_at,updated_at\)/);
 assert.doesNotMatch(sql,/grant update\(gross,cogs\)/);
 assert.doesNotMatch(sql,/grant update\(qty_on_hand\)/);
});
test('full recipe catalogue remains 30 items and is imported inactive',()=>{
 const c={window:{}};
 vm.runInNewContext(read('recipes.js'),c);
 const d=c.window.LT_KITCHEN_DATA;
 assert.equal(d.coffee.length,16);assert.equal(d.banana.length,9);assert.equal(d.dimsum.length,5);
 const js=read('ops.js');
 assert.match(js,/price:0,active:false/);
});
