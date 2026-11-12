const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {webcrypto}=require("node:crypto");
const {TextEncoder}=require("node:util");
const read=x=>fs.readFileSync(path.join(__dirname,x),"utf8");
async function boot(){
 const win={LT_OPS_CONFIG:{url:"https://unit-test.supabase.co",publishableKey:"sb_publishable_unit"}};
 vm.runInNewContext(read("recipes.js"),{window:win});
 vm.runInNewContext(read("menu-costing.js"),{window:win});
 const sql=read("ops/sql/20261111_menu_hpp_seed.sql");
 const catalog=JSON.parse(sql.match(/\$catalog\$\n([\s\S]*?)\n\$catalog\$::jsonb/)[1]);
 const materials=[...new Map(catalog.flatMap(x=>x.ingredients.map(y=>[y.name,{
  id:"m:"+y.name,name:y.name,unit:y.unit,qty_on_hand:0,min_stock:0,active:true
 }]))).values()];
 const products=catalog.map((p,i)=>({...p,id:"p"+i,price:0,active:false}));
 const bom=catalog.flatMap((p,i)=>p.ingredients.map(m=>({
  product_id:"p"+i,material_id:"m:"+m.name,qty_per_unit:m.qty
 })));
 const records={lt_products:products,lt_materials:materials,lt_bom:bom,
  lt_members:[{user_id:"owner",role:"owner",active:true}],
  lt_orders:[],lt_order_items:[],lt_order_financials:[],lt_material_costs:[],
  lt_purchases:[],lt_daily_closings:[],lt_payout_receipts:[],lt_material_quotes:[]};
 const events=new Map(),nodes=new Map();
 const get=id=>{if(!nodes.has(id))nodes.set(id,{
  id,innerHTML:"",textContent:"",dataset:{},value:"",open:false,
  classList:{add(){},remove(){},toggle(){}},
  addEventListener(name,cb){events.set(id+"-"+name,cb)},showModal(){this.open=true},close(){this.open=false},
  querySelector(){return null},querySelectorAll(){return[]}
 });return nodes.get(id)};
 const document={getElementById:get,
  addEventListener(name,cb){events.set(name,cb)},querySelector(){return null},querySelectorAll(){return[]}};
 const auth=JSON.stringify({access_token:"qa",refresh_token:"qa",expiresAt:Date.now()+4000000});
 const storage=new Map([["lt-v3-auth-session",auth]]);
 const sessionStorage={getItem:key=>storage.get(key)||null,setItem:(k,v)=>storage.set(k,v),removeItem:key=>storage.delete(key)};
 async function fetch(url,init={}){
  if(String(url).includes("/auth/v1/user"))return {ok:true,status:200,text:async()=>JSON.stringify({id:"owner",email:"owner@example.invalid"})};
  const name=String(url).split("/rest/v1/")[1]?.split("?")[0];
  let rows=records[name]||[];
  if(name==="lt_material_quotes"&&init.method==="POST"){
   const quote=JSON.parse(init.body);records.lt_material_quotes=[{
    ...quote,cost_per_unit:Number(quote.pack_cost)/Number(quote.pack_qty)}];
   rows=[];
  }
  return {ok:true,status:200,text:async()=>JSON.stringify(rows)};
 }
 vm.runInNewContext(read("ops.js"),{
  window:win,document,sessionStorage,fetch,
  URL,Date,Intl,TextEncoder,crypto:webcrypto,
  setTimeout,clearTimeout,console,confirm:()=>true,alert:()=>{},
  FormData:class{constructor(el){this.fields=Object.entries(el.fields||{})}entries(){return this.fields[Symbol.iterator]()}}
 });
 await new Promise(resolve=>setImmediate(resolve));await new Promise(resolve=>setImmediate(resolve));
 return {events,get,records,html:()=>get("ops-root").innerHTML};
}
test("owner can open Menu & HPP with 30 grouped recipes and cost forms",async()=>{
 const app=await boot();
 await app.events.get("click")({target:{closest:q=>q==="[data-tab]"?{dataset:{tab:"costing"}}:null}});
 const html=app.html();
 assert.equal((html.match(/class="lt-collection"/g)||[]).length,30);
 assert.match(html,/Simulasi harga marketplace/);
 assert.match(html,/lt-quote-material/);
 assert.match(html,/id="ops-quote"/);
 assert.match(html,/id="ops-bom"/);
 assert.match(html,/Kopi tersedia 4 ukuran/);
 assert.doesNotMatch(html,/Belum berhasil:/);
});
test("selecting a different coffee size shows source BOM and keeps draft prices off",async()=>{
 const app=await boot();
 const ev=app.events.get("click");
 await ev({target:{closest:q=>q==="[data-tab]"?{dataset:{tab:"costing"}}:null}});
 await ev({target:{closest:q=>q==="[data-cost-item]"?{dataset:{costItem:"p3"}}:null}});
 const html=app.html();
 assert.match(html,/Iced Milk Latte · 22 oz/);
 assert.match(html,/Cup 22 oz/);
 assert.match(html,/Belum tersedia/);
 assert.match(html,/Harga jual dasar/);
});
