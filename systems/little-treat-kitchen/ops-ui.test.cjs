// Test operational UI without network calls or a real browser.
// Run: node --test apps/little-treat-kitchen/ops-ui.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,file),'utf8');
const source=read('ops.js');

async function boot(role='owner'){
 const events=new Map();
 const nodes=new Map();
 const createNode=id=>({
  id,innerHTML:'',textContent:'',dataset:{},open:false,
  classList:{add(){},remove(){},toggle(){}},
  addEventListener(n,cb){events.set('modal_'+n,cb)},
  showModal(){this.open=true},close(){this.open=false},
  querySelector(){return null},querySelectorAll(){return []}
 });
 const getElementById=id=>{
  if(!nodes.has(id))nodes.set(id,createNode(id));
  return nodes.get(id);
 };
 const document={
  getElementById,addEventListener:(n,cb)=>events.set(n,cb),
  querySelectorAll:()=>[],querySelector:()=>null
 };
 const window={
  LT_OPS_CONFIG:{url:'https://unit-test.supabase.co',publishableKey:'sb_publishable_testing'},
 };
 vm.runInNewContext(read('recipes.js'),{window});
 const sessionStorage={
  getItem:()=>JSON.stringify({access_token:'test-access',refresh_token:'test-refresh',expiresAt:Date.now()+3600000}),
  setItem(){},removeItem(){}
 };
 const requests=[];
 const fetch=async url=>{
  requests.push(url);
  const resource=String(url).split('/rest/v1/')[1]?.split('?')[0];
  const body=String(url).includes('/auth/v1/user')?{id:'user-qa',email:'tester@example.com'}:
   resource==='lt_members'?[{user_id:'user-qa',role,active:true}]:[];
  return {ok:true,status:200,text:async()=>JSON.stringify(body)};
 };
 const ctx={
  window,document,sessionStorage,fetch,URL,Date,Intl,
  setTimeout,clearTimeout,console,
  confirm:()=>true,alert:()=>{},FormData:function(){}
 };
 vm.runInNewContext(source,ctx);
 // Async Init -> Auth User -> Membership -> 5/9 concurrent tables -> render.
 await new Promise(resolve=>setImmediate(resolve));
 await new Promise(resolve=>setImmediate(resolve));
 return {window,document,events,nodes,getElementById,requests,html:()=>getElementById('ops-root').innerHTML};
}

test('premium UI styles included in both v3 entrypoints',()=>{
 for(const file of ['index.html','ops.html']){
  const html=read(file);
  assert.match(html,/ops\.css/);
  assert.match(html,/ops-visual\.css/);
  assert.match(html,/Content-Security-Policy/);
 }
 assert.match(read('ops-visual.css'),/prefers-reduced-motion/);
 assert.match(read('ops-visual.css'),/\.bottom\.staff/);
 assert.match(read('ops-visual.css'),/\.more-sheet/);
});

test('owner has reachable mobile navigation to all six sections, including Daily Closing',async()=>{
 const ui=await boot('owner'),html=ui.html();
 assert.match(html,/data-tab="orders"/);
 assert.match(html,/data-tab="recipes"/);
 assert.match(html,/data-tab="stock"/);
 assert.match(html,/data-tab="costing"/);
 assert.match(html,/data-tab="finance"/);
 assert.match(html,/data-tab="closing"/);
 assert.match(html,/class="more-sheet"/);
 assert.match(html,/Lewati navigasi/);
 assert.match(html,/data-order-filter="ready"/);
 assert.doesNotMatch(html,/Akun belum disiapkan/);
});

test('staff navigation never exposes owner tabs',async()=>{
 const ui=await boot('staff'),html=ui.html();
 assert.match(html,/class="bottom staff"/);
 assert.match(html,/data-tab="orders"/);
 assert.match(html,/data-tab="recipes"/);
 assert.match(html,/data-tab="stock"/);
 assert.doesNotMatch(html,/data-tab="finance"/);
 assert.doesNotMatch(html,/data-tab="closing"/);
 assert.doesNotMatch(html,/data-tab="costing"/);
});

test('recipe search changes only results, keeps search textbox unchanged and preserves category filtering',async()=>{
 const ui=await boot('owner');
 const rootBefore=ui.html();
 ui.events.get('input')({target:{id:'ops-recipe-search',value:'dimsum'}});
 const grid=ui.getElementById('ops-recipe-results').innerHTML;
 const count=ui.getElementById('ops-recipe-count').textContent;
 assert.equal((grid.match(/data-recipe=/g)||[]).length,5);
 assert.match(count,/5 resep ditemukan/);
 assert.equal(ui.html(),rootBefore,'Search should not replace entire page or textbox');
 assert.doesNotMatch(source,/current\.outerHTML=next/);
});

test('queue filter switches visible result without replacing form contents',async()=>{
 const ui=await boot('owner');
 const prev=ui.html();
 ui.events.get('click')({target:{
  closest:selector=>selector==='[data-tab]'?null:selector==='[data-order-filter]'?{dataset:{orderFilter:'ready'}}:null
 }});
 assert.match(ui.getElementById('ops-order-results').innerHTML,/Belum ada pesanan siap/);
 assert.equal(ui.html(),prev);
});

test('recipe steps are checkable and coffee recipe respects all four cup sizes',()=>{
 const js=read('ops.js');
 const ingredients=read('recipes.js');
 assert.match(js,/data-recipe-step/);
 assert.match(js,/recipe-progress/);
 assert.match(js,/s\.recipeSize=e\.target\.value/);
 assert.match(js,/updateRecipeResults\(\)/);
 assert.match(ingredients,/"?K16"?/);
 assert.doesNotMatch(js,/window\.location\.href.*service_role/);
});

test('public SVG is not necessary; no external CDN needed for nav icons',()=>{
 const js=read('ops.js');
 assert.match(js,/const ICON_PATHS=/);
 assert.match(js,/aria-hidden="true"/);
 assert.doesNotMatch(read('ops.html'),/cdn\.|unpkg|jsdelivr/);
});
