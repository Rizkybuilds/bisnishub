/* Little Treat Operations v3 — authenticated by dedicated Supabase Auth.
   No offline finance mutations, no service keys, no demo "success" responses. */
(function(){
"use strict";
const root=document.getElementById("ops-root");
const modal=document.getElementById("ops-modal");
const modalBody=document.getElementById("ops-modal-body");
const toastEl=document.getElementById("ops-toast");
const DATA=window.LT_KITCHEN_DATA;
const CONFIG=window.LT_OPS_CONFIG||{};
const SK="lt-v3-auth-session";
const fmt=n=>"Rp "+Math.round(Number(n)||0).toLocaleString("id-ID");
const num=n=>Number(n||0).toLocaleString("id-ID",{maximumFractionDigits:3});
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateToday=()=>new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Jakarta",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const PRODUCT_CATEGORIES={coffee:"Kopi",banana:"Pisang",dimsum:"Dimsum",other:"Lainnya"};
const CHANNELS=["GoFood","GrabFood","ShopeeFood","Langsung","Lainnya"];
const ICON_PATHS={
 orders:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.7h6M9 9h6M9 13h6M9 17h4"/>',
 recipes:'<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23z"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5a2.5 2.5 0 0 1 2.5 2z"/>',
 stock:'<path d="m12 2 9 5-9 5-9-5zM3 7v10l9 5 9-5V7M12 12v10"/>',
 costing:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 8h10M8 12h2m4 0h2m-8 4h2m4 0h2"/>',
 finance:'<path d="M3 7V5a2 2 0 0 1 2-2h13v4"/><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M16 14h5M16 14h-1"/>',
 closing:'<path d="M3 3v18h18M7 16l4-5 3 2 5-7"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
 logout:'<path d="M10 17l5-5-5-5M15 12H3M12 3h5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-5"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'
};
const icon=name=>'<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(ICON_PATHS[name]||ICON_PATHS.more)+'</svg>';
const TABS=[
 {id:"orders",label:"Pesanan",icon:"orders",staff:true},
 {id:"recipes",label:"Resep",icon:"recipes",staff:true},
 {id:"stock",label:"Stok",icon:"stock",staff:true},
 {id:"costing",label:"HPP & Menu",icon:"costing",staff:false},
 {id:"finance",label:"Belanja",icon:"finance",staff:false},
 {id:"closing",label:"Daily Closing",icon:"closing",staff:false}
];

const s={session:null,user:null,role:null,tab:"orders",busy:false,err:"",
 data:{products:[],materials:[],bom:[],orders:[],items:[],financials:[],costs:[],purchases:[],closings:[]},
 cart:[],editFinance:null,recipeSize:"14",recipeSearch:"",recipeCategory:"all",orderFilter:"active",activeRecipeId:null};
let notifyTimer;
function notify(msg){toastEl.textContent=msg;toastEl.classList.add("active");clearTimeout(notifyTimer);notifyTimer=setTimeout(()=>toastEl.classList.remove("active"),3000)}
function setError(msg){s.err=String(msg||"");render()}
function configValid(){
 try{const u=new URL(CONFIG.url);const key=String(CONFIG.publishableKey||"");
 return u.protocol==="https:"&&/^[a-z0-9-]+\.supabase\.co$/.test(u.hostname)&&
 (key.startsWith("sb_publishable_")||(key.startsWith("eyJ")&&!key.includes("service_role")))&&!key.startsWith("sb_secret_");
 }catch(e){return false}
}
function base(){return String(CONFIG.url).replace(/\/+$/,"")}
function headers(auth=true){const h={"apikey":CONFIG.publishableKey,"Content-Type":"application/json","Accept":"application/json"};if(auth&&s.session)h.Authorization="Bearer "+s.session.access_token;return h}
async function jsonFetch(url,init={},retry=true){
 let resp;try{resp=await fetch(url,init)}catch(e){throw Error("Koneksi internet/Supabase gagal. Periksa jaringan dan coba ulang.")}
 const body=await resp.text();
 let result;try{result=body?JSON.parse(body):null}catch(e){result=body}
 if(resp.status===401&&retry&&s.session?.refresh_token){
   await refreshSession();
   return jsonFetch(url,{...init,headers:{...init.headers,Authorization:"Bearer "+s.session.access_token}},false);
 }
 if(!resp.ok)throw Error((result&&typeof result==="object"&&(result.message||result.msg||result.error_description||result.error))||("Permintaan ditolak ("+resp.status+")"));
 return result;
}
function saveSession(){if(s.session)sessionStorage.setItem(SK,JSON.stringify(s.session));else sessionStorage.removeItem(SK)}
async function refreshSession(){
 if(!s.session?.refresh_token)throw Error("Sesi berakhir, silakan masuk lagi.");
 const data=await jsonFetch(base()+"/auth/v1/token?grant_type=refresh_token",{
   method:"POST",headers:headers(false),body:JSON.stringify({refresh_token:s.session.refresh_token})
 },false);
 s.session={access_token:data.access_token,refresh_token:data.refresh_token,expiresAt:Date.now()+(data.expires_in||3600)*1000};
 saveSession();
}
async function ensureSession(){
 if(s.session&&Date.now()>s.session.expiresAt-90000)await refreshSession();
}
async function req(route,{method="GET",body=null,prefer=null,query=""}={}){
 await ensureSession();
 const h=headers();
 if(prefer)h.Prefer=prefer;
 const url=base()+"/rest/v1/"+route+query;
 return jsonFetch(url,{method,headers:h,body:body===null?undefined:JSON.stringify(body)});
}
const select=(table,query="?select=*")=>req(table,{query});
const rpc=(fn,body)=>req("rpc/"+fn,{method:"POST",body});
async function authLogin(email,password){
 const data=await jsonFetch(base()+"/auth/v1/token?grant_type=password",{method:"POST",headers:headers(false),body:JSON.stringify({email,password})},false);
 s.session={access_token:data.access_token,refresh_token:data.refresh_token,expiresAt:Date.now()+(data.expires_in||3600)*1000};
 saveSession();await verifyAccount();
}
async function verifyAccount(){
 await ensureSession();
 const user=await jsonFetch(base()+"/auth/v1/user",{headers:headers()});
 if(!user?.id)throw Error("Tidak berhasil memverifikasi identitas akun.");
 const entries=await select("lt_members","?select=user_id,role,active&user_id=eq."+encodeURIComponent(user.id));
 if(!entries?.length||!entries[0].active||!["owner","staff"].includes(entries[0].role)){
   s.session=null;saveSession();throw Error("Akun belum didaftarkan atau telah dinonaktifkan oleh pemilik.");
 }
 s.user=user;s.role=entries[0].role;
 if(s.role==="staff"&&!TABS.find(x=>x.id===s.tab)?.staff)s.tab="orders";
}
async function reload(){
 if(!s.session||!s.role)return;
 const core=await Promise.all([
  select("lt_products","?select=*&order=name.asc&limit=500"),
  select("lt_materials","?select=*&order=name.asc&limit=500"),
  select("lt_bom","?select=*&limit=3000"),
  select("lt_orders","?select=*&order=created_at.desc&limit=160"),
  select("lt_order_items","?select=*&limit=600")
 ]);
 [s.data.products,s.data.materials,s.data.bom,s.data.orders,s.data.items]=core;
 if(s.role==="owner"){
   const own=await Promise.all([
    select("lt_order_financials","?select=*&limit=600"),
    select("lt_material_costs","?select=*&limit=600"),
    select("lt_purchases","?select=*&order=purchased_on.desc&limit=200"),
    select("lt_daily_closings","?select=*&order=day.desc&limit=90")
   ]);
   [s.data.financials,s.data.costs,s.data.purchases,s.data.closings]=own;
 }else{
   [s.data.financials,s.data.costs,s.data.purchases,s.data.closings]=[[],[],[],[]];
 }
}
async function transact(f){
 if(s.busy)return;
 s.busy=true;s.err="";render();
 try{const out=await f();if(s.session)await reload();render();notify("Berhasil disimpan");return out}
 catch(e){s.err=e.message||String(e);render();return null}
 finally{s.busy=false;render()}
}
function showSetup(){
 root.innerHTML='<div class="auth-screen"><div class="auth-card"><div class="logo">lt<span>.</span></div><h1>Kitchen OS v3</h1><p>Fondasi aplikasi sudah tersedia, tetapi <b>database khusus Little Treat belum dihubungkan</b>. Tidak ada data demo yang akan dianggap sebagai transaksi asli.</p>'+
 '<div class="notice">Untuk mengaktifkan: buat Supabase project baru yang terpisah, jalankan SQL bootstrap terverifikasi, daftarkan akun owner, lalu isi <code>ops-config.js</code> dengan project URL dan publishable key. Jangan menaruh secret/service-role key.</div>'+
 '<p>Katalog resep lama tetap tersedia di aplikasi Kitchen OS v2 selama migrasi.</p></div></div>';
}
function showLogin(){
 root.innerHTML='<div class="auth-screen"><div class="auth-card">'+
 '<div class="logo">lt<span>.</span></div>'+
 '<div class="auth-decoration" style="margin-top:25px"><i aria-hidden="true"></i> Little Treat · Kitchen OS</div>'+
 '<h1>Selamat datang kembali.</h1>'+
 '<p>Masuk untuk mengelola pesanan, resep dan stok dapur dalam satu tempat. Gunakan akun yang sudah didaftarkan pemilik.</p>'+
 (s.err?'<div class="notice error" role="alert">'+esc(s.err)+'</div>':"")+
 '<form id="ops-login">'+
 field("Email",'<input type="email" name="email" required autocomplete="username" inputmode="email" placeholder="email@contoh.com" />')+
 field("Kata sandi",'<input type="password" name="password" required autocomplete="current-password" placeholder="Masukkan kata sandi" />')+
 '<button class="btn full" type="submit" '+(s.busy?"disabled aria-busy=\"true\"":"")+'>'+(s.busy?"Memverifikasi akun…":"Masuk ke Kitchen OS "+icon("arrow"))+'</button></form>'+
 '<div class="auth-footnote">'+icon("shield")+' Akun dan data operasional disimpan di Supabase khusus Little Treat.</div>'+
 '<p class="muted" style="margin-top:18px">Butuh resep sebelum login? <a href="./legacy.html">Buka panduan resep lama</a>. Data keuangan lama hanya tersimpan di browser asal.</p>'+
 '</div></div>';
}

function nav(){
 const visible=TABS.filter(x=>s.role==="owner"||x.staff);
 const primary=s.role==="owner"?["orders","recipes","stock","costing"]:["orders","recipes","stock"];
 const extra=visible.filter(x=>!primary.includes(x.id));
 const sideMenu=visible.map(x=>'<button type="button" data-tab="'+x.id+'" class="'+(x.id===s.tab?"active":"")+'" '+(x.id===s.tab?'aria-current="page"':"")+'>'+icon(x.icon)+'<span class="nav-label">'+esc(x.label)+'</span></button>').join("");
 const bottomMenu=visible.filter(x=>primary.includes(x.id)).map(x=>'<button type="button" data-tab="'+x.id+'" class="'+(x.id===s.tab?"active":"")+'" '+(x.id===s.tab?'aria-current="page"':"")+'>'+icon(x.icon)+'<span>'+esc(x.label)+'</span></button>').join("");
 const extraMenu=extra.length?'<details class="more-nav '+(extra.some(x=>x.id===s.tab)?"active":"")+'"><summary>'+icon("more")+'<span>Lainnya</span></summary>'+
 '<div class="more-sheet">'+extra.map(x=>'<button type="button" data-tab="'+x.id+'" class="'+(x.id===s.tab?"active":"")+'">'+icon(x.icon)+' '+esc(x.label)+'</button>').join("")+'</div></details>':"";
 return '<aside class="sidebar" aria-label="Navigasi utama">'+
 '<div class="head"><div class="logo">lt<span>.</span></div><div><div class="brand-name">little treat.</div><div class="brand-sub">KITCHEN OPERATIONS</div></div></div>'+
 '<div class="side-label">WORKSPACE</div><nav class="nav" aria-label="Menu Kitchen OS">'+sideMenu+'</nav>'+
 '<div class="sidebar-bottom"><span class="sync-note">Data terpusat · Supabase</span>'+
 '<strong>'+esc(s.role.toUpperCase())+'</strong><span class="profile-email">'+esc(s.user?.email||"")+'</span></div></aside>'+
 '<nav class="bottom" aria-label="Navigasi cepat">'+bottomMenu+extraMenu+'</nav>';
}
function wrap(title,desc,body){
 const dateLabel=new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Jakarta"}).format(new Date());
 const role=s.role==="owner"?"Pemilik":"Operator";
 const initial=String(s.user?.email||"O").slice(0,1).toUpperCase();
 root.innerHTML='<div class="shell">'+nav()+'<div class="main-wrap">'+
 '<header class="top">'+
 '<div class="mobile-brand"><span class="logo">lt<span>.</span></span><span>little treat.</span></div>'+
 '<div class="title">Kitchen OS <span aria-hidden="true"> / </span> <b>'+esc(title)+'</b></div>'+
 '<div class="right"><div class="user-chip"><span class="avatar" aria-hidden="true">'+esc(initial)+'</span><div><b>'+esc(role)+'</b><small>'+esc(s.user?.email||"")+'</small></div></div>'+
 '<button type="button" data-action="reload" class="btn secondary icon-btn" title="Muat data terbaru" aria-label="Muat data terbaru" '+(s.busy?"disabled":"")+'>'+icon("refresh")+'</button>'+
 '<button type="button" data-action="logout" class="btn secondary icon-btn" title="Keluar akun" aria-label="Keluar akun">'+icon("logout")+'</button></div></header>'+
 '<main class="main" id="ops-main" '+(s.busy?'aria-busy="true"':'')+'>'+
 '<div class="page-intro"><div><div class="eyebrow">LITTLE TREAT / KITCHEN OPERATIONS</div>'+
 '<h1>'+esc(title)+'</h1><p class="lead">'+esc(desc)+'</p></div>'+
 '<div class="page-aside"><strong>'+esc(dateLabel)+'</strong><span>Operasional Little Treat</span></div></div>'+
 (s.err?'<div class="notice error" role="alert"><b>Belum berhasil:</b> '+esc(s.err)+'</div>':"")+body+'</main></div></div>';
}

function stat(label,value,sub=""){return '<div class="metric"><small>'+esc(label)+'</small><strong>'+value+'</strong><span>'+esc(sub)+'</span></div>'}
function field(label,control,help=""){return '<label class="field"><span>'+label+'</span>'+control+(help?'<small>'+help+'</small>':"")+'</label>'}
function inp(name,placeholder="",type="text",extra=""){return '<input type="'+type+'" name="'+name+'" placeholder="'+esc(placeholder)+'" '+extra+'/>'}
function selectInput(name,options,extra=""){
 return '<select name="'+name+'" '+extra+'>'+options.map(([v,l])=>'<option value="'+esc(v)+'">'+esc(l)+'</option>').join("")+'</select>';
}
function productName(id){return s.data.products.find(x=>x.id===id)?.name||"Menu tidak ditemukan"}
function unitName(id){return s.data.materials.find(x=>x.id===id)?.name||"Bahan tidak ditemukan"}
const channelOpts=CHANNELS.map(x=>[x,x]);
const statusNames={new:"Baru",preparing:"Sedang dibuat",ready:"Siap diserahkan",handed_off:"Selesai",cancelled:"Dibatalkan"};
const statusClass={new:"orange",preparing:"orange",ready:"green",handed_off:"green",cancelled:"red"};
function statusBadge(status){return '<span class="badge '+(statusClass[status]||"")+'">'+esc(statusNames[status]||status)+'</span>'}
function rowsTable(headers,rows){
 if(!rows.length)return '<div class="empty">Belum ada data.</div>';
 return '<div class="table-wrap"><table class="table"><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join("")+'</tr></thead><tbody>'+rows.join("")+'</tbody></table></div>';
}
function panel(title,desc,body){return '<section class="panel"><h2>'+title+'</h2>'+(desc?'<p>'+desc+'</p>':"")+body+'</section>'}
function orderDetails(order){
 const lines=s.data.items.filter(x=>x.order_id===order.id);
 return lines.map(x=>esc(productName(x.product_id))+" × "+x.qty).join(" · ")||"Tidak ada item";
}
function filteredOrders(){
 const matches=o=>s.orderFilter==="all" ||
   (s.orderFilter==="active"&&["new","preparing","ready"].includes(o.status)) ||
   (s.orderFilter==="ready"&&o.status==="ready") ||
   (s.orderFilter==="completed"&&o.status==="handed_off");
 const priority={ready:0,preparing:1,new:2,handed_off:3,cancelled:4};
 return s.data.orders.filter(matches).slice().sort((a,b)=>{
   if(s.orderFilter==="active")return priority[a.status]-priority[b.status]||new Date(a.created_at)-new Date(b.created_at);
   return new Date(b.created_at)-new Date(a.created_at);
 }).slice(0,80);
}
function ordersList(){
 const orders=filteredOrders();
 if(!orders.length)return '<div class="empty">'+
  '<h3>'+({active:"Antrean masih kosong",ready:"Belum ada pesanan siap",completed:"Belum ada pesanan selesai",all:"Belum ada pesanan"})[s.orderFilter]+'</h3>'+
  '<p>Pesanan akan muncul di sini setelah disimpan atau setelah statusnya berubah. Perbarui data kalau ada pesanan dari perangkat lain.</p></div>';
 return orders.map(o=>{
  const buttons=o.status==="new"?'<button data-transition="start" data-id="'+o.id+'" class="btn status-action">'+icon("arrow")+' Mulai buat</button><button data-transition="cancel" data-id="'+o.id+'" class="btn warn">Batalkan</button>':
   o.status==="preparing"?'<button data-transition="ready" data-id="'+o.id+'" class="btn status-action">QC selesai · Siap '+icon("arrow")+'</button><button data-transition="cancel" data-id="'+o.id+'" class="btn warn">Batalkan</button>':
   o.status==="ready"?'<button data-transition="handoff" data-id="'+o.id+'" class="btn status-action">Serahkan ke driver '+icon("arrow")+'</button>':"";
  const time=new Date(o.created_at).toLocaleString("id-ID",{timeZone:"Asia/Jakarta",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
  return '<article class="item order-card status-'+esc(o.status)+'">'+
   '<div class="row"><div class="order-identity"><strong>'+esc(o.order_ref)+'</strong><small>'+esc(o.channel)+' · '+esc(time)+' WIB</small></div>'+statusBadge(o.status)+'</div>'+
   '<div class="order-products">'+esc(orderDetails(o))+'</div>'+
   (o.note?'<div class="order-note">Catatan pelanggan: '+esc(o.note)+'</div>':"")+
   (buttons?'<div class="actions">'+buttons+'</div>':"")+'</article>';
 }).join("");
}
function ordersView(){
 const counts=Object.fromEntries(["new","preparing","ready","handed_off"].map(k=>[k,s.data.orders.filter(o=>o.status===k).length]));
 const activeCount=counts.new+counts.preparing+counts.ready;
 const available=s.data.products.filter(p=>p.active&&Number(p.price)>0);
 const needsCatalog=s.role==="owner"&&s.data.products.length===0;
 const onboard=needsCatalog?
 '<div class="notice" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px">'+
 '<span><b>Mulai dari katalog.</b> Impor 30 menu, isi harga serta komposisi HPP, lalu aktifkan menu yang sudah siap dijual.</span>'+
 '<button type="button" class="btn secondary" data-tab="costing">Siapkan menu '+icon("arrow")+'</button></div>':"";
 const form=available.length?'<div class="form-grid">'+
 field("Channel penjualan",selectInput("channel",channelOpts,'id="o-channel"'))+
 field("Kode pesanan",inp("order_ref","Contoh GF-1024","text",'required maxlength="80"'))+
 field("Pilih menu",selectInput("product",available.map(p=>[p.id,p.name+" · "+fmt(p.price)])))+
 field("Jumlah porsi",inp("qty","1","number",'value="1" min="1" max="100" step="1" required'))+
 '<div class="full-row">'+field("Catatan khusus",'<textarea name="note" rows="2" maxlength="500" placeholder="Tanpa saus / catatan driver atau pelanggan"></textarea>')+'</div>'+
 '<div class="full-row actions" style="margin-top:3px"><button class="btn secondary" type="button" data-action="add-cart">+ Tambahkan ke pesanan</button></div></div>':
 '<div class="empty"><h3>Belum ada menu yang dapat dijual</h3><p>'+(s.role==="owner"?"Masuk ke HPP & Menu untuk mengatur harga, komposisi bahan, dan mengaktifkan menu.":"Minta pemilik menyiapkan katalog dan harga sebelum menerima pesanan.")+'</p>'+
 (s.role==="owner"?'<button type="button" class="btn secondary" data-tab="costing">Buka HPP & Menu '+icon("arrow")+'</button>':"")+'</div>';
 const cartRows=s.cart.map((r,i)=>'<div class="row item"><div><strong>'+esc(productName(r.product_id))+'</strong><br/><small>'+r.qty+' porsi</small></div>'+
 '<button type="button" class="btn warn" data-remove-cart="'+i+'" aria-label="Hapus '+esc(productName(r.product_id))+' dari pesanan">Hapus</button></div>').join("");
 const cartTotal=s.cart.reduce((a,r)=>{
   const p=s.data.products.find(x=>x.id===r.product_id);return a+(p?Number(p.price)*r.qty:0);
 },0);
 const cartHead=s.cart.length?'<div class="row" style="margin-top:20px"><strong style="font-size:13px">Ringkasan pesanan</strong><span class="badge">'+s.cart.reduce((n,r)=>n+r.qty,0)+' porsi</span></div>':"";
 const cartFoot=s.cart.length?'<div class="row" style="margin:12px 0 0;border-top:1px solid #eee5dc;padding-top:14px"><span class="muted">Estimasi dari harga katalog</span><strong>'+fmt(cartTotal)+'</strong></div>':"";
 const formPanel=panel("Pesanan baru","Masukkan pesanan dari aplikasi delivery atau penjualan langsung. Pastikan kode pesanan tidak tertukar.",
 '<form id="ops-new-order">'+form+'</form>'+cartHead+
 '<div class="stack" style="margin-top:12px">'+cartRows+'</div>'+cartFoot+
 '<div class="actions"><button class="btn full" type="button" data-action="submit-order" '+(!s.cart.length||s.busy?"disabled":"")+'>Simpan pesanan ('+s.cart.length+' jenis menu) '+icon("arrow")+'</button></div>');
 const filters=[
  ["active","Aktif ("+activeCount+")"],["ready","Siap ("+counts.ready+")"],
  ["completed","Selesai"],["all","Semua"]
 ];
 const queue=panel("Antrean dapur","Dahulukan pesanan siap antar, kemudian yang sedang dibuat dan yang baru masuk.",
 '<div class="queue-controls" role="group" aria-label="Filter status pesanan">'+filters.map(([id,label])=>
 '<button type="button" class="queue-filter '+(s.orderFilter===id?"active":"")+'" data-order-filter="'+id+'" aria-pressed="'+(s.orderFilter===id)+'">'+esc(label)+'</button>').join("")+'</div>'+
 '<div class="queue-list" id="ops-order-results" aria-live="polite">'+ordersList()+'</div>');
 return onboard+'<div class="metrics">'+stat("Pesanan baru",counts.new,"Menunggu dibuat")+stat("Sedang dibuat",counts.preparing,"Dalam proses dapur")+
 stat("Siap diserahkan",counts.ready,"Menunggu driver")+stat("Selesai (terlihat)",counts.handed_off,"Dari riwayat yang dimuat")+'</div>'+
 '<div class="two-col">'+formPanel+queue+'</div>';
}
function filteredRecipes(){
 return DATA.all.filter(x=>["coffee","banana","dimsum"].includes(x.category)&&
  (s.recipeCategory==="all"||x.category===s.recipeCategory)&&
  (!s.recipeSearch||[x.name,x.id,x.group,...(x.ingredients||[]).map(i=>i.name)]
    .join(" ").toLocaleLowerCase("id-ID").includes(s.recipeSearch.toLocaleLowerCase("id-ID"))));
}
function recipeCards(){
 const items=filteredRecipes();
 if(!items.length)return '<div class="empty recipe-list-empty"><h3>Resep tidak ditemukan</h3><p>Coba nama menu lain, jenis bahan, atau ubah kategori.</p></div>';
 const categoryVisual={coffee:"☕",banana:"🍌",dimsum:"🥟"};
 return items.map(x=>'<button type="button" class="recipe-card" data-recipe="'+esc(x.id)+'" aria-label="Buka resep '+esc(x.name)+'">'+
  '<span class="recipe-visual '+esc(x.category)+'" aria-hidden="true">'+categoryVisual[x.category]+'</span>'+
  '<span class="recipe-id">'+esc(x.id)+' · '+esc(PRODUCT_CATEGORIES[x.category])+'</span>'+
  '<h3>'+esc(x.name)+'</h3>'+
  '<span class="recipe-meta"><span>'+esc(x.group||"Resep per porsi")+'</span><span class="recipe-arrow" aria-hidden="true">↗</span></span></button>').join("");
}
function updateRecipeResults(){
 const grid=document.getElementById("ops-recipe-results");
 const count=document.getElementById("ops-recipe-count");
 if(grid)grid.innerHTML=recipeCards();
 if(count)count.textContent=filteredRecipes().length+" resep ditemukan";
}
function recipesView(){
 return panel("Cari menu dan bahan","Semua resep utama Little Treat tersedia tanpa harus membuka PDF satu per satu. Klik kartu untuk melihat takaran dan langkah.",
 '<div class="recipe-controls">'+
 field("Cari berdasarkan menu atau bahan",
  '<div style="position:relative"><span class="recipe-search-icon" aria-hidden="true">'+icon("search")+'</span>'+
  inp("recipeSearch","Misalnya: pisang, creamer, dimsum…","search",'id="ops-recipe-search" autocomplete="off" spellcheck="false" value="'+esc(s.recipeSearch)+'" aria-label="Cari resep dan bahan"')+'</div>')+
 field("Kategori",selectInput("recipeCategory",[["all","Semua menu"],["coffee","Kopi"],["banana","Pisang"],["dimsum","Dimsum"]],'id="ops-recipe-category"'))+'</div>'+
 '<div class="recipe-results-header"><strong>Katalog menu</strong><small id="ops-recipe-count" aria-live="polite">'+filteredRecipes().length+' resep ditemukan</small></div>'+
 '<div class="recipe-grid" id="ops-recipe-results">'+recipeCards()+'</div>')+
 '<div class="notice">Waktu kukus dimsum frozen perlu mengikuti petunjuk supplier dan hasil kalibrasi alat. Resep yang tampil adalah baseline operasional, bukan pengganti pemeriksaan kematangan.</div>';
}
function coffeeSteps(r){
 const names=r.ingredients.map(i=>i.name);
 const extra=names.filter(n=>!["Kopi instan murni","Air hangat","Susu UHT plain","Es batu"].includes(n));
 const steps=[
  "Periksa tiket: nama minuman, ukuran cup dan instruksi pelanggan. Siapkan timbangan, cup, bahan dan es yang bersih.",
  "Timbang kopi instan dan air hangat sesuai ukuran yang dipilih. Larutkan kopi sampai homogen."
 ];
 if(r.kind==="cocoa")steps.push("Campurkan kakao ke sebagian cairan hangat hingga tidak ada gumpalan.");
 if(extra.length)steps.push("Tambahkan dan ukur bahan pelengkap sesuai tabel: "+extra.join(", ")+". Aduk sampai merata.");
 if(r.kind==="jelly")steps.push("Masukkan jelly kopi dingin ke cup sebelum menambahkan es.");
 steps.push("Tuang susu UHT sesuai takaran, aduk hingga merata.");
 steps.push("Timbang es sesuai resep; tuang campuran minuman ke cup dan tutup/segel rapat.");
 if(r.kind==="biscuit")steps.push("Kemas biskuit secara terpisah agar tetap renyah saat dikirim.");
 steps.push("QC: cek ukuran, jumlah cup, instruksi pelanggan, kebocoran, kebersihan tutup dan label.");
 return steps;
}
function showRecipe(id){
 const r=DATA.all.find(x=>x.id===id);if(!r)return;
 s.activeRecipeId=id;
 const coffee=r.category==="coffee";
 const categoryVisual={coffee:"☕",banana:"🍌",dimsum:"🥟",prep:"🥣",sop:"📋"};
 let ingredients="";
 if(coffee){
  const index=["12","14","16","22"].indexOf(s.recipeSize);
  ingredients=r.ingredients.map(i=>'<tr><td>'+esc(i.name)+'</td><td>'+num(i.values[index])+' '+esc(i.unit)+'</td></tr>').join("");
 }else ingredients=(r.ingredients||[]).map(i=>'<tr><td>'+esc(i.name)+'</td><td>'+num(i.value)+' '+esc(i.unit)+'</td></tr>').join("");
 const steps=r.steps||(coffee?coffeeSteps(r):[]);
 modalBody.dataset.recipeId=id;
 modalBody.innerHTML=
 '<div class="recipe-header"><span class="recipe-visual" aria-hidden="true">'+(categoryVisual[r.category]||"🍴")+'</span>'+
 '<div><span class="recipe-id">'+esc(r.id)+' · '+esc(PRODUCT_CATEGORIES[r.category]||r.group)+'</span>'+
 '<h2>'+esc(r.name)+'</h2></div></div>'+
 '<p class="muted">'+esc(r.note||r.group||"Panduan per porsi")+'</p>'+
 (coffee?'<div class="actions">'+field("Ukuran cup",'<select id="ops-cup" aria-label="Pilih ukuran cup">'+["12","14","16","22"].map(v=>
 '<option '+(v===s.recipeSize?"selected":"")+' value="'+v+'">'+v+' oz</option>').join("")+'</select>')+'</div>':"")+
 '<h3>Bahan & takaran per porsi</h3><table class="recipe-ings"><tbody>'+ingredients+'</tbody></table>'+
 '<div class="row" style="align-items:center;margin-top:18px"><h3 style="margin:0">Langkah pembuatan</h3>'+
 '<span class="recipe-progress" id="recipe-progress" aria-live="polite">0 / '+steps.length+' selesai</span></div>'+
 '<ol class="recipe-steps" style="margin-top:16px">'+steps.map((step,i)=>
 '<li><span class="recipe-step-number">'+(i+1)+'</span>'+
 '<label class="recipe-step-label" for="recipe-step-'+i+'"><input class="recipe-step-check" id="recipe-step-'+i+'" type="checkbox" data-recipe-step="'+i+'"/>'+
 '<span class="recipe-step-content">'+esc(step)+'</span></label></li>').join("")+'</ol>'+
 (r.warning?'<div class="notice recipe-warning"><strong>Catatan keamanan & kualitas</strong><div>'+esc(r.warning)+'</div></div>':"");
 if(!modal.open)modal.showModal();
}
function stockView(){
 const rows=s.data.materials.map(m=>'<tr><td><strong>'+esc(m.name)+'</strong><small>'+esc(m.unit)+'</small></td><td>'+num(m.qty_on_hand)+' '+esc(m.unit)+'</td><td>'+num(m.min_stock)+'</td><td>'+(Number(m.qty_on_hand)<=Number(m.min_stock)?'<span class="badge orange">Perlu dibeli</span>':'<span class="badge green">Cukup</span>')+'</td></tr>');
 const wasteForm=s.data.materials.length?panel("Catat bahan rusak / terbuang","Bisa dicatat karyawan. Stok langsung berkurang dan biayanya masuk laporan pemilik, dengan identitas operator.",
'<form id="ops-waste" class="form-grid">'+
 field("Bahan",selectInput("material_id",s.data.materials.map(m=>[m.id,m.name+" ("+m.unit+", stok "+num(m.qty_on_hand)+")"])))+
 field("Jumlah terbuang",inp("qty","1","number",'min="0.001" step="0.001" required'))+
 field("Alasan",inp("note","Contoh: pisang terlalu matang","text",'maxlength="300" required'))+
 '<div class="full-row actions"><button type="submit" class="btn warn">Catat waste</button></div></form>'):"";
 const add=s.role==="owner"?panel("Daftarkan bahan/kemasan","Satuan gram (g), mililiter (ml), atau satuan buah/kemasan (pcs). Pilih satuan secara konsisten.",
 '<form id="ops-new-material" class="form-grid">'+field("Nama bahan",inp("name","Pisang kepok","text",'required maxlength="140"'))+
 field("Satuan",selectInput("unit",[["g","g"],["ml","ml"],["pcs","pcs"]]))+
 field("Stok minimum",inp("min_stock","0","number",'value="0" min="0" step="0.001"'))+
 '<div class="full-row actions"><button class="btn" type="submit">Tambah bahan</button></div></form>'):"";
 return '<div class="metrics">'+stat("Jenis bahan",s.data.materials.length)+stat("Perlu dibeli",s.data.materials.filter(m=>Number(m.qty_on_hand)<=Number(m.min_stock)).length)+'</div>'+
 panel("Persediaan real-time","Stok berkurang setelah pesanan dinyatakan siap; stok bertambah saat owner menerima pembelian.",rowsTable(["Nama bahan","Sisa tersedia","Stok minimum","Status"],rows))+wasteForm+add;
}
function costingView(){
 const prod=s.data.products,materials=s.data.materials,bom=s.data.bom,costs=s.data.costs;
 const costMap=Object.fromEntries(costs.map(x=>[x.material_id,Number(x.avg_cost_per_unit)]));
 const costProduct=p=>bom.filter(b=>b.product_id===p.id).reduce((a,b)=>a+Number(b.qty_per_unit)*(costMap[b.material_id]||0),0);
 const entries=prod.map(p=>'<tr><td><strong>'+esc(p.name)+'</strong><small>'+esc(p.sku)+' · '+esc(p.category)+'</small></td>'+
 '<td>'+fmt(p.price)+'</td><td>'+fmt(costProduct(p))+'</td><td>'+bom.filter(x=>x.product_id===p.id).length+' bahan</td><td>'+(!p.active?'<span class="badge orange">Nonaktif</span>':'<span class="badge green">Aktif</span>')+
 '<button type="button" class="linklike" data-edit-product="'+p.id+'">Atur</button></td></tr>');
 const productOptions=prod.map(p=>[p.id,p.name+" ("+p.sku+")"]);
 const matOptions=materials.map(m=>[m.id,m.name+" / "+m.unit]);
 const current=prod.find(p=>p.id===s.editFinance);
 const edit=current?panel("Atur menu: "+esc(current.name),"Harga harus berdasarkan biaya riil; aktifkan hanya saat BOM dan supplier bahan sudah tersedia.",
 '<form id="ops-edit-product" class="form-grid"><input type="hidden" name="id" value="'+current.id+'"/>'+
 field("Harga jual di aplikasi (Rp)",inp("price","25000","number",'value="'+Number(current.price)+'" min="0" step="100" required'))+
 field("Status",selectInput("active",[["false","Belum dijual"],["true","Aktif — dapat dipesan"]],'id="prod-active"'))+
 '<div class="full-row actions"><button class="btn" type="submit">Simpan harga & status</button></div></form>'):"";
 const bomForm=prod.length&&materials.length?panel("Komposisi HPP per porsi","Contoh: 2 pisang @80 g = 160 g bahan kepok. Air es, kemasan, minyak perlu masuk BOM jika menjadi biaya langsung.",
 '<form id="ops-bom" class="form-grid">'+field("Menu",selectInput("product_id",productOptions))+
 field("Bahan",selectInput("material_id",matOptions))+
 field("Takaran per satu menu",inp("qty_per_unit","Contoh: 160","number",'min="0.001" step="0.001" required'))+
 '<div class="full-row actions"><button type="submit" class="btn">Simpan komposisi</button></div></form>'):"";
 const bomTable=rowsTable(["Menu","Bahan","Takaran","Harga bahan / unit"],bom.map(b=>'<tr><td>'+esc(productName(b.product_id))+'</td><td>'+esc(unitName(b.material_id))+'</td><td>'+num(b.qty_per_unit)+'</td><td>'+fmt(costMap[b.material_id]||0)+'</td></tr>'));
 return '<div class="notice">HPP otomatis dihitung ketika pesanan ditandai <b>Siap</b>, dari BOM × harga rata-rata bahan. Menu tanpa BOM atau bahan yang stoknya kurang akan ditolak oleh database.</div>'+
 panel("Katalog jual & estimasi HPP","Impor katalog 30 resep sebagai nonaktif dengan harga 0, kemudian lengkapi harga, bahan dan komposisi sebelum dijual.",
 '<div class="actions"><button type="button" data-action="import-catalog" class="btn secondary">Impor 30 menu dasar</button></div>'+rowsTable(["Menu","Harga jual","Est. HPP","Komposisi","Status"],entries))+
 edit+bomForm+panel("Detail komposisi aktif","Daftar takaran BOM yang sudah disimpan.",bomTable);
}
function purchasesView(){
 const matOptions=[["","— Tidak terhubung stok —"],...s.data.materials.map(m=>[m.id,m.name+" / "+m.unit])];
 const history=s.data.purchases.map(p=>'<tr><td>'+esc(p.purchased_on)+'<strong style="display:block">'+esc(p.description)+'</strong></td><td>'+esc(p.kind)+'</td><td>'+fmt(p.amount)+'</td><td>'+
 (p.material_id&&!p.received_on?'<button data-receive="'+p.id+'" class="btn secondary">Terima barang</button>':p.material_id?'<span class="badge green">Sudah diterima</span>':'—')+'</td></tr>');
 return panel("Catat pembelian dan pengeluaran","Catat belanja bahan, kemasan, alat, atau biaya operasional yang sudah dibayar. Pembelian belum diterima tidak menambah stok.",
 '<form id="ops-purchase" class="form-grid">'+
 field("Tanggal bayar",inp("purchased_on","","date",'value="'+dateToday()+'" required'))+
 field("Kategori",selectInput("kind",[["ingredient","Bahan"],["packaging","Kemasan"],["equipment","Alat / aset"],["operating","Operasional"]],'id="purchase-kind"'))+
 field("Deskripsi",inp("description","Misal: Dimsum frozen isi 50","text",'required maxlength="200"'))+
 field("Total pembayaran (Rp)",inp("amount","100000","number",'min="1" step="1" required'))+
 field("Barang stok (opsional)",selectInput("material_id",matOptions))+
 field("Jumlah dalam satuan barang",inp("material_qty","50","number",'min="0.001" step="0.001"'))+
 field("Sudah diterima?",selectInput("received",[["no","Belum, menunggu dikirim"],["yes","Sudah diterima"]]))+
 field("Masa manfaat alat (bulan)",inp("asset_life_months","36","number",'min="1" max="240"'))+
 field("Nilai sisa alat (Rp)",inp("asset_salvage","0","number",'min="0" value="0" step="1"'))+
 field("Tanggal mulai pakai alat",inp("service_on","","date"))+
 '<div class="full-row actions"><button class="btn" type="submit">Simpan pembayaran</button></div></form>')+
 panel("Riwayat belanja","Untuk pembelian yang baru dibayar, tekan Terima Barang setelah barang ada di dapur.",rowsTable(["Tanggal / item","Kategori","Total","Status stok"],history));
}
function financeEditor(orderId){
 const f=s.data.financials.find(x=>x.order_id===orderId);
 if(!f)return "";
 const o=s.data.orders.find(x=>x.id===orderId);
 return panel("Rekonsiliasi pesanan: "+esc(o?.order_ref||""),"Masukkan fee dari laporan platform, diskon yang benar-benar ditanggung merchant, lalu konfirmasi. Jangan mengarang fee.",
 '<div class="metrics">'+stat("Nilai bruto",fmt(f.gross))+stat("HPP dari BOM",fmt(f.cogs))+'</div>'+
 '<form id="ops-financial" class="form-grid"><input type="hidden" name="order_id" value="'+orderId+'"/>'+
 field("Diskon merchant (Rp)",inp("discount","0","number",'value="'+Number(f.discount)+'" min="0" step="1" required'))+
 field("Biaya platform (Rp)",inp("platform_fee","0","number",'value="'+Number(f.platform_fee)+'" min="0" step="1" required'))+
 field("Biaya layanan/pembayaran (Rp)",inp("other_fee","0","number",'value="'+Number(f.other_fee)+'" min="0" step="1" required'))+
 field("Sudah cocok dengan laporan?",selectInput("fees_confirmed",[["false","Belum diverifikasi"],["true","Sudah sesuai laporan"]]))+
 field("Tanggal payout diterima (opsional)",inp("payout_received_at","","date",'value="'+esc(f.payout_received_at||"")+'"'))+
 '<div class="full-row actions"><button type="submit" class="btn">Simpan rekonsiliasi</button></div></form>');
}
function closingView(){
 const today=dateToday();
 const handed=s.data.orders.filter(o=>o.status==="handed_off");
 const recent=handed.slice(0,30).map(o=>{
  const f=s.data.financials.find(x=>x.order_id===o.id);
  return '<tr><td>'+esc(o.order_ref)+'<small>'+esc(o.channel)+'</small></td><td>'+fmt(f?.gross||0)+'</td><td>'+fmt(f?.cogs||0)+'</td>'+
  '<td>'+(f?.fees_confirmed?'<span class="badge green">Diverifikasi</span>':'<span class="badge orange">Belum cocok</span>')+
  '<button class="linklike" type="button" data-finance="'+o.id+'">Rekonsiliasi</button></td></tr>';
 });
 const closes=s.data.closings.slice(0,30).map(c=>{
  const contribution=Number(c.gross)-Number(c.discounts)-Number(c.platform_fees)-Number(c.other_fees)-Number(c.cogs)-Number(c.waste_cost||0)-Number(c.operating_expenses);
  return '<tr><td>'+esc(c.day)+'</td><td>'+c.orders_completed+'</td><td>'+fmt(c.gross)+'</td><td>'+fmt(contribution)+'</td>'+
  '<td>'+(c.missing_financials>0?'<span class="badge orange">'+c.missing_financials+' belum cocok</span>':'<span class="badge green">Cocok</span>')+'</td></tr>';
 });
 const assetExpenses=s.data.purchases.filter(p=>p.kind==="equipment"&&p.asset_life_months&&p.service_on);
 const monthlyDep=assetExpenses.reduce((a,p)=>{const start=p.service_on?.slice(0,7);const month=today.slice(0,7);
  if(!start)return a;const n=(Number(month.slice(0,4))-Number(start.slice(0,4)))*12+(Number(month.slice(5,7))-Number(start.slice(5,7)));
  return a+(n>=0&&n<p.asset_life_months?(Number(p.amount)-Number(p.asset_salvage))/p.asset_life_months:0);
 },0);
 return '<div class="notice">Daily closing menghitung pesanan yang sudah diserahkan, HPP dari BOM, biaya platform yang sudah dikonfirmasi, serta biaya operasional pada tanggal tersebut. <b>Hasil masih estimasi, bukan laba bersih atau laporan pajak.</b></div>'+
 '<div class="metrics">'+stat("Selesai (terlihat)",handed.length)+stat("Belum verifikasi fee",handed.filter(o=>!s.data.financials.find(f=>f.order_id===o.id)?.fees_confirmed).length)+
 stat("Penyusutan estimasi bulan ini",fmt(monthlyDep),"Belum dialokasikan ke daily closing")+'</div>'+
 panel("Daily Closing","Tutup/rekap kembali hari pilihan setelah cek transaksi dan payout. Catatan ditimpa jika hari itu direkap lagi.",
 '<form id="ops-close" class="form-grid">'+field("Tanggal",inp("day","","date",'value="'+today+'" required'))+
 field("Catatan",inp("note","Contoh: selisih cash Rp0","text",'maxlength="500"'))+
 '<div class="full-row actions"><button type="submit" class="btn">Hitung & simpan closing</button></div></form>')+
 (s.editFinance?financeEditor(s.editFinance):"")+
 panel("Rekonsiliasi penjualan","Isi potongan marketplace, lalu centang sudah sesuai laporan sebelum membuat closing final.",rowsTable(["Pesanan","Omzet","HPP","Status"],recent))+
 panel("Ringkasan harian tersimpan","Estimasi kontribusi = omzet − diskon − fee − HPP − biaya operasional; belum termasuk penyusutan, gaji, pajak.",
 rowsTable(["Tanggal","Order","Omzet","Est. kontribusi","Validasi"],closes));
}
function render(){
 if(!configValid()){showSetup();return}
 if(!s.user){showLogin();return}
 const tab=TABS.find(x=>x.id===s.tab);
 if(!tab||(s.role!=="owner"&&!tab.staff)){s.tab="orders"}
 const pages={
  orders:["Pesanan & produksi","Input order manual, ikuti proses dapur, lalu serahkan ke driver.",ordersView],
  recipes:["Panduan resep","Resep kopi, pisang, dimsum, premix dan operasional yang mudah dicari.",recipesView],
  stock:["Persediaan dapur","Ketersediaan bahan berdasarkan penerimaan dan pesanan yang diselesaikan.",stockView],
  costing:["Menu & HPP","Atur katalog, takaran bahan, harga jual dan biaya otomatis.",costingView],
  finance:["Belanja & aset","Catat pembayaran, barang diterima, dan aset tanpa transaksi otomatis.",purchasesView],
  closing:["Daily Closing","Rekonsiliasi pemasukan dan biaya harian, termasuk payout yang benar-benar cair.",closingView]
 };
 const [title,desc,fn]=pages[s.tab];wrap(title,desc,fn());
}
async function init(){
 if(!CONFIG||!configValid()){render();return}
 try{
  const raw=sessionStorage.getItem(SK);
  if(raw){s.session=JSON.parse(raw);await verifyAccount();await reload()}
 }catch(e){s.session=null;s.user=null;s.role=null;saveSession();s.err=e.message}
 render();
}
document.addEventListener("submit",async e=>{
 const id=e.target.id;
 if(!id.startsWith("ops-"))return;
 e.preventDefault();
 const form=Object.fromEntries(new FormData(e.target).entries());
 if(id==="ops-login"){await transact(async()=>{await authLogin(form.email,form.password);await reload()});return}
 if(id==="ops-waste"){
  if(!form.note.trim()){setError("Alasan waste wajib diisi");return}
  if(!confirm("Kurangi stok sebagai waste? Transaksi ini tidak bisa dibatalkan dari UI."))return;
  await transact(()=>rpc("lt_record_waste",{p_material_id:form.material_id,p_qty:Number(form.qty),p_note:form.note}));return;
 }
 if(s.role!=="owner"&&["ops-new-material","ops-edit-product","ops-bom","ops-purchase","ops-financial","ops-close"].includes(id)){setError("Akses owner diperlukan.");return}
 if(id==="ops-new-material"){
  await transact(()=>req("lt_materials",{method:"POST",body:{name:form.name,unit:form.unit,min_stock:Number(form.min_stock)},prefer:"return=minimal"}));
 }else if(id==="ops-edit-product"){
  await transact(async()=>{
   const p=s.data.products.find(x=>x.id===form.id);if(!p)throw Error("Menu tidak ditemukan");
   const price=Number(form.price);
   if(!Number.isFinite(price)||price<0)throw Error("Harga tidak valid.");
   const active=form.active==="true";
   if(active){
    const lines=s.data.bom.filter(x=>x.product_id===p.id);
    if(!lines.length||price<=0)throw Error("Lengkapi harga dan komposisi HPP sebelum mengaktifkan menu.");
    if(lines.some(x=>!s.data.costs.some(c=>c.material_id===x.material_id)))throw Error("Harga beli bahan belum tersedia. Catat pembelian bahan terlebih dahulu.");
   }
   await req("lt_products",{method:"PATCH",query:"?id=eq."+encodeURIComponent(form.id),body:{price,active},prefer:"return=minimal"});
  });
 }else if(id==="ops-bom"){
  await transact(()=>req("lt_bom",{method:"POST",query:"?on_conflict=product_id,material_id",body:{product_id:form.product_id,material_id:form.material_id,qty_per_unit:Number(form.qty_per_unit)},prefer:"resolution=merge-duplicates,return=minimal"}));
 }else if(id==="ops-purchase"){
  await transact(async()=>{
   const kind=form.kind;const isStock=["ingredient","packaging"].includes(kind)&&!!form.material_id;
   const isAsset=kind==="equipment";
   const body={
    p_description:form.description,p_kind:kind,p_amount:Number(form.amount),p_purchased_on:form.purchased_on,
    p_material_id:isStock?form.material_id:null,p_qty:isStock?Number(form.material_qty):null,
    p_received_on:isStock&&form.received==="yes"?dateToday():null,
    p_life_months:isAsset?Number(form.asset_life_months):null,p_salvage:isAsset?Number(form.asset_salvage||0):0,
    p_service_on:isAsset?(form.service_on||dateToday()):null
   };
   if(isStock&&(!Number.isFinite(body.p_qty)||body.p_qty<=0))throw Error("Jumlah bahan perlu diisi.");
   if(isAsset&&(!body.p_life_months||body.p_life_months<1))throw Error("Isi umur manfaat alat.");
   await rpc("lt_record_purchase",body);
  });
 }else if(id==="ops-financial"){
  await transact(async()=>{
   const f=s.data.financials.find(x=>x.order_id===form.order_id);if(!f)throw Error("Keuangan pesanan tidak ditemukan");
   const body={discount:Number(form.discount),platform_fee:Number(form.platform_fee),other_fee:Number(form.other_fee),
    fees_confirmed:form.fees_confirmed==="true",payout_received_at:form.payout_received_at||null};
   if(Object.values(body).slice(0,3).some(x=>x<0||!Number.isFinite(x))||body.discount+body.platform_fee+body.other_fee>Number(f.gross))throw Error("Potongan melebihi omzet.");
   await req("lt_order_financials",{method:"PATCH",query:"?order_id=eq."+encodeURIComponent(form.order_id),body,prefer:"return=minimal"});s.editFinance=null;
  });
 }else if(id==="ops-close"){
  await transact(()=>rpc("lt_close_day",{p_day:form.day,p_note:form.note||""}));
 }
});
document.addEventListener("click",async e=>{
 const tab=e.target.closest("[data-tab]");
 if(tab){if(s.role!=="owner"&&!TABS.find(x=>x.id===tab.dataset.tab)?.staff)return;s.tab=tab.dataset.tab;s.err="";s.editFinance=null;render();return}
 const b=e.target.closest("[data-action]");
 if(b){
  const action=b.dataset.action;
  if(action==="logout"){s.session=null;s.user=null;s.role=null;s.cart=[];saveSession();s.err="";render();return}
  if(action==="reload"){await transact(()=>Promise.resolve());return}
  if(action==="close-modal"){modal.close();return}
  if(action==="import-catalog"){
   if(s.role!=="owner")return;
   if(!confirm("Impor 30 menu sebagai nonaktif tanpa harga? Menu yang sudah ada tidak diubah."))return;
   await transact(async()=>req("lt_products",{method:"POST",query:"?on_conflict=sku",prefer:"resolution=ignore-duplicates,return=minimal",
      body:[...DATA.coffee,...DATA.banana,...DATA.dimsum].map(x=>({sku:x.id,name:x.name,category:x.category,recipe_key:x.id,price:0,active:false}))}));
  }
  if(action==="add-cart"){
   const form=document.getElementById("ops-new-order");
   if(!form)return;
   const i=Object.fromEntries(new FormData(form).entries());
   const qty=Number(i.qty);
   if(!i.product||!Number.isInteger(qty)||qty<1||qty>100){notify("Periksa menu dan jumlah");return}
   const found=s.cart.find(x=>x.product_id===i.product);
   if(found){if(found.qty+qty>100){notify("Maksimal 100 per menu");return}found.qty+=qty}
   else s.cart.push({product_id:i.product,qty});
   // keep channel, ref, note while refreshing cart portion.
   const info={channel:i.channel,ref:i.order_ref,note:i.note};
   render();
   const newForm=document.getElementById("ops-new-order");
   if(newForm){newForm.elements.channel.value=info.channel;newForm.elements.order_ref.value=info.ref;newForm.elements.note.value=info.note}
  }
  if(action==="submit-order"){
   const form=document.getElementById("ops-new-order");
   if(!form||!s.cart.length)return;
   const i=Object.fromEntries(new FormData(form).entries());
   await transact(async()=>{
    if(!i.order_ref.trim())throw Error("Isi kode pesanan.");
    await rpc("lt_create_order",{p_order_ref:i.order_ref.trim(),p_channel:i.channel,p_note:i.note||"",p_lines:s.cart.map(x=>({...x,note:""}))});
    s.cart=[];
   });
  }
 }
 const remove=e.target.closest("[data-remove-cart]");
 if(remove){s.cart.splice(Number(remove.dataset.removeCart),1);render();return}
 const transition=e.target.closest("[data-transition]");
 if(transition){if(!confirm("Konfirmasi tahap pesanan? "+transition.dataset.transition)){return}
  await transact(()=>rpc("lt_transition_order",{p_order_id:transition.dataset.id,p_action:transition.dataset.transition}));return}
 const recipe=e.target.closest("[data-recipe]");
 if(recipe){s.recipeSize="14";showRecipe(recipe.dataset.recipe);return}
 const edit=e.target.closest("[data-edit-product]");
 if(edit){if(s.role!=="owner")return;s.editFinance=edit.dataset.editProduct;render();const select=document.getElementById("prod-active");if(select){const p=s.data.products.find(x=>x.id===s.editFinance);select.value=p?.active?"true":"false"}return}
 const fin=e.target.closest("[data-finance]");
 if(fin){if(s.role!=="owner")return;s.editFinance=fin.dataset.finance;render();return}
 const receive=e.target.closest("[data-receive]");
 if(receive){if(s.role!=="owner")return;if(!confirm("Barang sudah benar-benar diterima dan sesuai nota?"))return;
  await transact(()=>rpc("lt_receive_purchase",{p_purchase_id:receive.dataset.receive,p_received_on:dateToday()}));return}
});
document.addEventListener("input",e=>{
 if(e.target.id==="ops-recipe-search"){s.recipeSearch=e.target.value;const next=recipesView();const main=document.querySelector("#ops-main");
   if(main){const current=main.querySelector(".panel");if(current)current.outerHTML=next}}
});
document.addEventListener("change",e=>{
 if(e.target.id==="ops-cup"){s.recipeSize=e.target.value;const id=modalBody.querySelector("h2")?.textContent;const recipe=DATA.all.find(x=>x.name===id);if(recipe)showRecipe(recipe.id)}
 if(e.target.id==="ops-recipe-category"){s.recipeCategory=e.target.value;render()}
});
modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});
init();
})();