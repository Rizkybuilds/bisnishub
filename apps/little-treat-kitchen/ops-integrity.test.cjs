// Little Treat WP-01 — Node 22, read-only browser harness and SQL assertions.
// Live database acceptance is performed separately with temporary transaction + ROLLBACK.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const {TextEncoder}=require('node:util');
const source=fs.readFileSync(path.join(__dirname,'ops.js'),'utf8');
const sql=fs.readFileSync(path.join(__dirname,'ops/sql/20261111_wp01_integrity.sql'),'utf8');

function makeApp(mode='normal'){
 const events=new Map(),nodes=new Map(),storage=new Map();
 const calls={payout:[],rows:[]};
 const mk=id=>({id,innerHTML:'',textContent:'',open:false,dataset:{},
  classList:{add(){},remove(){},toggle(){}},addEventListener(name,cb){events.set(id+'-'+name,cb)},
  showModal(){this.open=true},close(){this.open=false},
  querySelector(){return null},querySelectorAll(){return []}});
 const document={
  getElementById(id){if(!nodes.has(id))nodes.set(id,mk(id));return nodes.get(id)},
  addEventListener(name,cb){events.set(name,cb)},
  querySelector(){return null},querySelectorAll(){return []}
 };
 const sessionStorage={
  getItem(key){return storage.get(key)||null},
  setItem(key,value){storage.set(key,String(value))},
  removeItem(key){storage.delete(key)}
 };
 sessionStorage.setItem('lt-v3-auth-session',JSON.stringify({
  access_token:'unit-test',refresh_token:'unit-refresh',expiresAt:Date.now()+3600000
 }));
 let failAfterWrite=false, throwAfterCommit=false, accepted=0;
 async function fetch(url,init={}){
  const resource=String(url).split('/rest/v1/')[1]?.split('?')[0];
  const response=(status,body)=>({ok:status>=200&&status<300,status,
    text:async()=>JSON.stringify(body)});
  if(String(url).includes('/auth/v1/user'))return response(200,{id:'owner-fixture',email:'fixture@example.invalid'});
  if(resource==='lt_members')return response(200,[{user_id:'owner-fixture',role:'owner',active:true}]);
  if(resource==='rpc/lt_record_payout'){
   const body=JSON.parse(init.body);
   calls.payout.push(body);
   if(calls.rows.length===0){
    calls.rows.push({id:'sample-payout',amount:body.p_amount,statement_ref:body.p_statement_ref,
      received_on:body.p_received_on,channel:body.p_channel});
    accepted++;
   }
   if(mode==='lost-response-once'&&calls.payout.length===1)throw Error('connection broke after commit');
   failAfterWrite=mode==='refresh-fails';
   return response(200,'sample-payout');
  }
  if(resource==='lt_payout_receipts'){
   if(failAfterWrite)return response(500,{message:'Temporary read error'});
   return response(200,calls.rows);
  }
  return response(200,[]);
 }
 const win={LT_OPS_CONFIG:{url:'https://unit-test.supabase.co',publishableKey:'sb_publishable_unit'},
   LT_KITCHEN_DATA:{coffee:[],banana:[],dimsum:[],all:[]}};
 const FormData=class {constructor(el){this.fields=Object.entries(el.formFields||{})}entries(){return this.fields[Symbol.iterator]()}};
 vm.runInNewContext(source,{document,window:win,sessionStorage,fetch,crypto:webcrypto,TextEncoder,
  URL,Date,Intl,FormData,console,confirm:()=>true,alert:()=>{},
  setTimeout:()=>0,clearTimeout:()=>{}});
 return {
  document,events,sessionStorage,calls,accepted:()=>accepted,
  html:()=>document.getElementById('ops-root').innerHTML,
  async ready(){for(let i=0;i<5;i++)await new Promise(resolve=>setImmediate(resolve))},
  async submitPayout(){
   const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
   const el={id:'ops-payout',formFields:{
    channel:'GoFood',received_on:today,amount:'19001',
    statement_ref:'TRANSFER-2026-001',note:'Bank received'
   }};
   await events.get('submit')({target:el,preventDefault(){}});
  }
 };
}

test('SQL protects actual cash table and unique receipts behind owner RLS',()=>{
 assert.match(sql,/create table if not exists public\.lt_payout_receipts/);
 assert.match(sql,/alter table public\.lt_payout_receipts enable row level security/);
 assert.match(sql,/revoke all on public\.lt_payout_receipts from public,anon,authenticated/);
 assert.match(sql,/create policy lt_payout_owner_read/);
 assert.match(sql,/unique index if not exists lt_payout_receipts_ref_unique/);
 assert.match(sql,/lt_private\.claim_mutation/);
 assert.match(sql,/on conflict\(request_id\) do nothing/);
 for(const name of ['lt_record_purchase_v2','lt_record_waste_v2','lt_create_order_v2','lt_record_payout']){
  assert.match(sql,new RegExp('create or replace function public\\.'+name+'\\('));
  assert.match(sql,new RegExp('revoke all on function public\\.'+name+'\\('));
 }
 assert.match(sql,/select coalesce\(sum\(amount\),0\) into v_payout from public\.lt_payout_receipts/);
 assert.doesNotMatch(sql,/sum\(gross-discount-platform_fee-other_fee\)/);
});

test('a saved payout is never reported as a failed write when data refresh fails',async()=>{
 const app=makeApp('refresh-fails');await app.ready();
 assert.match(app.html(),/Daily Closing/);
 await app.submitPayout();
 assert.equal(app.calls.payout.length,1);
 assert.equal(app.accepted(),1);
 assert.match(app.html(),/Sudah tersimpan:/);
 assert.match(app.html(),/data terbaru gagal dimuat/);
 assert.doesNotMatch(app.html(),/Belum berhasil:/);
 const persisted=JSON.parse(app.sessionStorage.getItem('lt-v3-pending-operations')||'{}');
 assert.equal(Object.keys(persisted).length,0,'completed operation ID is cleared');
});

test('lost HTTP response retries with SAME request UUID, without recording twice',async()=>{
 const app=makeApp('lost-response-once');await app.ready();
 await app.submitPayout();
 assert.match(app.html(),/Hasil permintaan belum dapat dipastikan/);
 assert.match(app.html(),/data-clear-pending/);
 const pending=JSON.parse(app.sessionStorage.getItem('lt-v3-pending-operations')||'{}');
 assert.equal(Object.keys(pending).length,1);
 await app.submitPayout();
 assert.equal(app.calls.payout.length,2);
 assert.equal(app.calls.payout[0].p_request_id,app.calls.payout[1].p_request_id);
 assert.equal(app.accepted(),1,'backend fixture accepted exactly once');
 assert.doesNotMatch(app.html(),/data-clear-pending/);
});

test('UI uses only idempotent RPCs for high-risk writes; no per-order payout shortcut',()=>{
 for(const endpoint of ['lt_record_purchase_v2','lt_record_waste_v2','lt_create_order_v2','lt_record_payout']){
  assert.ok(source.includes('"'+endpoint+'"'),endpoint);
 }
 assert.doesNotMatch(source,/rpc\("lt_record_purchase",/);
 assert.doesNotMatch(source,/rpc\("lt_record_waste",/);
 assert.doesNotMatch(source,/rpc\("lt_create_order",/);
 assert.doesNotMatch(source,/payout_received_at:form\./);
 assert.match(source,/lt_payout_receipts/);
 assert.match(source,/Periksa catatan di halaman terkait/);
});
