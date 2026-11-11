/* Owner-side finance workspace. Device-local until Supabase Auth/RLS is provisioned. */
(function(){
"use strict";
const core=window.LT_FIN_CORE;
const KEY="little-treat-finance-local-v1";
const tags={ingredient:"Bahan baku",packaging:"Kemasan",equipment:"Alat / aset",operating:"Biaya operasional"};
const views={belanja:[["plans","Daftar kebutuhan"],["purchases","Catat pembelian"],["purchaselog","Riwayat belanja"]],keuangan:[["dashboard","Ringkasan"],["sales","Catat penjualan"],["assets","Aset & penyusutan"],["ledger","Riwayat"],["backup","Backup data"]]};
const state={view:"belanja",sub:{belanja:"plans",keuangan:"dashboard"},month:core.currentMonth(),data:core.fresh(),invalidStorage:false,realize:null};
const qs=(s)=>document.querySelector(s);
const fmt=n=>"Rp "+Math.round(Number(n)||0).toLocaleString("id-ID");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=s=>Number(s||0);
function load(){try{const raw=localStorage.getItem(KEY);if(raw)state.data=core.validateImport(raw)}catch(e){state.invalidStorage=true;console.error("Finance data unreadable:",e.message)}}
function save(){if(state.invalidStorage)throw Error("Data sebelumnya tidak dapat dibaca. Jangan ditimpa: ekspor data mentah atau periksa penyimpanan browser.");localStorage.setItem(KEY,JSON.stringify(state.data))}
function toast(t){const el=qs("#toast");if(!el)return;el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2700)}
const domError=s=>'<div class="fin-alert fin-alert-error">'+esc(s)+'</div>';
const rowEmpty=()=>'<div class="fin-empty">Belum ada catatan. Tambahkan transaksi pertama untuk memulai.</div>';
const catOpts=(selected="ingredient")=>Object.keys(tags).map(x=>'<option value="'+x+'" '+(x===selected?"selected":"")+'>'+esc(tags[x])+'</option>').join("");
const dateOpts=(v)=>esc(v||core.today());
const field=(title,input,desc="")=>'<label class="fin-field"><span>'+title+'</span>'+input+(desc?'<small>'+desc+'</small>':"")+'</label>';
const textInput=(name,placeholder,required=true,value="")=>'<input name="'+name+'" maxlength="140" placeholder="'+esc(placeholder)+'" value="'+esc(value)+'" '+(required?"required":"")+'/>';
const numInput=(name,value=0,opts="")=>'<input type="number" name="'+name+'" step="1" min="0" max="10000000000" value="'+value+'" '+opts+'/>';
const monthLabel=m=>new Date(m+"-01T12:00:00Z").toLocaleDateString("id-ID",{month:"long",year:"numeric",timeZone:"UTC"});
const table=(headers,rows)=>rows.length?'<div class="fin-table-scroll"><table class="fin-table"><thead><tr>'+headers.map(t=>'<th>'+t+'</th>').join("")+'</tr></thead><tbody>'+rows.join("")+'</tbody></table></div>':rowEmpty();
const badge=(label,color="")=>'<span class="fin-tag '+color+'">'+esc(label)+'</span>';
const groupCards=(arr)=>arr.map(([label,num,sub])=>'<div class="fin-metric"><span>'+esc(label)+'</span><strong>'+num+'</strong><small>'+esc(sub||"")+'</small></div>').join("");
function shell(title,desc,inner){
 const tabset=views[state.view];
 const monthDisplay='<label class="fin-month"><span>Bulan laporan</span><input aria-label="Pilih bulan laporan" type="month" data-fin-month value="'+state.month+'"/></label>';
 return '<div class="fin-shell"><div class="fin-head"><div><div class="eyebrow">LITTLE TREAT / OWNER WORKSPACE</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+monthDisplay+'</div>'+
 '<div class="fin-alert"><b>Data hanya tersimpan di perangkat/browser ini.</b> Belum tersinkron antar-HP, tanpa akun/login, dan bukan sistem akuntansi pajak. Jangan gunakan pada HP karyawan bersama. Ekspor backup rutin.</div>'+
 '<div class="fin-tabs" role="tablist" aria-label="Fitur '+esc(state.view)+'">'+tabset.map(([id,l])=>'<button type="button" data-fin-tab="'+id+'" class="'+(state.sub[state.view]===id?"active":"")+'">'+l+'</button>').join("")+'</div>'+inner+'</div>';
}
function renderPlans(){
 const plans=state.data.plans,open=plans.filter(x=>!x.done),done=plans.filter(x=>x.done);
 const sum=open.reduce((a,x)=>a+x.qty*x.unitPrice,0);
 const list=table(["Kebutuhan","Kategori / Prioritas","Estimasi","Tindakan"],
  [...open,...done].map(p=>'<tr class="'+(p.done?"fin-done":"")+'"><td><strong>'+esc(p.name)+'</strong><small>'+esc(p.qty+" "+p.unit+" • "+(p.supplier||"Supplier belum ditentukan"))+'</small></td><td>'+badge(tags[p.kind])+' '+badge(p.priority,p.priority==="Mendesak"?"urgent":"")+'</td><td>'+fmt(p.qty*p.unitPrice)+'</td><td>'+(p.done?badge("Sudah dibeli","ok"):'<button class="fin-link" data-fin-act="realize" data-fin-id="'+esc(p.id)+'">Realisasikan →</button>')+'</td></tr>'));
 return '<div class="fin-summary-strip"><div><span>Belum dibeli</span><strong>'+open.length+' kebutuhan</strong></div><div><span>Estimasi anggaran</span><strong>'+fmt(sum)+'</strong></div><div><span>Sudah dibeli</span><strong>'+done.length+' kebutuhan</strong></div></div>'+
 '<div class="fin-panel"><div class="fin-panel-title"><h2>Tambah daftar kebutuhan</h2><p>Daftar belanja tidak memengaruhi kas sampai direalisasikan.</p></div>'+
 '<form id="fin-plan" class="fin-grid-form">'+field("Nama barang",textInput("name","Contoh: Pisang kepok, steamer, cup 14 oz"))+
 field("Kategori",'<select name="kind">'+catOpts()+'</select>')+
 field("Jumlah",numInput("qty",1,'step="0.01" min="0.01" required'))+
 field("Satuan",textInput("unit","kg / pcs / pak / liter",true,"pcs"))+
 field("Estimasi harga satuan",numInput("unitPrice",0,"required"))+
 field("Prioritas",'<select name="priority"><option>Normal</option><option>Penting</option><option>Mendesak</option></select>')+
 field("Supplier (opsional)",textInput("supplier","Nama toko",false))+
 '<div class="fin-form-actions"><button class="fin-button primary" type="submit">+ Tambahkan kebutuhan</button></div></form></div>'+
 '<div class="fin-panel"><div class="fin-panel-title"><h2>Daftar belanja</h2><p>Klik Realisasikan setelah barang benar-benar dibeli.</p></div>'+list+'</div>';
}
function renderPurchases(){
 const p=state.realize?state.data.plans.find(x=>x.id===state.realize):null;
 const opt=p||{name:"",kind:"ingredient",qty:1,unit:"pcs",unitPrice:0,supplier:""};
 return '<div class="fin-panel"><div class="fin-panel-title"><h2>Catat pembelian aktual</h2><p>Hanya catat barang yang sudah dibayar. Ongkos kirim masuk total perolehan.</p></div>'+
 (p?'<div class="fin-alert">Realisasi rencana: <b>'+esc(p.name)+'</b>. Setelah transaksi disimpan, daftar kebutuhan otomatis ditandai dibeli.</div>':"")+
 '<form id="fin-purchase" class="fin-grid-form">'+
 '<input type="hidden" name="planId" value="'+esc(p?.id||"")+'"/>'+
 field("Tanggal bayar",'<input type="date" name="date" value="'+core.today()+'" required/>')+
 field("Kategori",'<select id="fin-purchase-kind" name="kind">'+catOpts(opt.kind)+'</select>')+
 field("Nama barang / biaya",textInput("name","Contoh: Dimsum frozen isi 50",true,opt.name))+
 field("Supplier",textInput("supplier","Nama toko / pemasok",false,opt.supplier))+
 field("Jumlah",numInput("qty",opt.qty,'step="0.01" min="0.01" required'))+
 field("Satuan",textInput("unit","kg / pcs / pak / liter",true,opt.unit))+
 field("Harga satuan (Rp)",numInput("unitPrice",opt.unitPrice,"required"))+
 field("Ongkos kirim/tambahan (Rp)",numInput("shipping",0,"required"))+
 '<div class="fin-form-wide" id="fin-asset-fields" '+(opt.kind!=="equipment"?'hidden':"")+'>'+
 '<div class="fin-grid-form fin-grid-inline">'+
 field("Umur manfaat alat (bulan)",'<input type="number" name="lifeMonths" value="36" min="1" max="240"/>')+
 field("Nilai sisa alat (Rp)",numInput("residual",0))+
 field("Mulai dipakai",'<input type="date" name="serviceDate" value="'+core.today()+'"/>')+
 '</div><p class="fin-hint">Metode garis lurus per bulan, mulai bulan alat dipakai. Nilai sisa adalah estimasi nilai akhir alat, bukan uang keluar saat pembelian.</p></div>'+
 field("Catatan (opsional)",textInput("note","Contoh: nota 104, dibayar tunai",false))+
 '<div class="fin-form-actions"><button type="submit" class="fin-button primary">Simpan pembelian</button></div></form></div>'+
 '<div class="fin-alert">Pembelian <b>bahan dan kemasan</b> adalah pengeluaran kas/pengadaan persediaan. Biaya produk terjual dicatat melalui HPP pada transaksi penjualan agar tidak dihitung dua kali sebagai beban laba.</div>';
}
function renderPurchaseLog(){
 const list=state.data.purchases.filter(x=>x.date.startsWith(state.month)).slice().sort((a,b)=>b.date.localeCompare(a.date));
 return '<div class="fin-panel"><div class="fin-panel-title"><h2>Riwayat pembelian — '+monthLabel(state.month)+'</h2><p>Transaksi dibatalkan tetap disimpan dalam jejak riwayat.</p></div>'+
 table(["Tanggal / barang","Kategori / pemasok","Total dibayar","Status"],list.map(x=>'<tr class="'+(x.voidedAt?"fin-done":"")+'"><td>'+esc(x.date)+'<strong>'+esc(x.name)+'</strong><small>'+esc(x.qty+" "+x.unit+" @ "+fmt(x.unitPrice))+'</small></td><td>'+badge(tags[x.kind])+'<small>'+esc(x.supplier)+'</small></td><td>'+fmt(x.total)+'</td><td>'+(x.voidedAt?badge("Dibatalkan","urgent"):'<button data-fin-act="void-purchase" data-fin-id="'+esc(x.id)+'" class="fin-link">Batalkan</button>')+'</td></tr>'))+
 '</div>';
}
function renderDashboard(){
 const m=core.monthly(state.data,state.month),series=core.pastMonths(state.month,6).reverse().map(month=>core.monthly(state.data,month));
 const max=Math.max(1,...series.map(x=>x.revenue)); const recent=state.data.sales.filter(x=>!x.voidedAt&&x.date.startsWith(state.month));
 const byChannel=Object.entries(recent.reduce((acc,s)=>(acc[s.channel]=(acc[s.channel]||0)+core.netRevenue(s),acc),{})).sort((a,b)=>b[1]-a[1]);
 return '<div class="fin-metrics">'+groupCards([
  ["Omzet kotor",fmt(m.gross),m.orderCount+" order"],
  ["Pendapatan bersih",fmt(m.revenue),"setelah diskon merchant & refund"],
  ["Estimasi laba operasional",fmt(m.profit),"setelah HPP, biaya, penyusutan"],
  ["Arus kas periode",fmt(m.cashFlow),"kas masuk − pembayaran keluar"]
 ])+'</div>'+
 '<div class="fin-two-columns"><div class="fin-panel"><div class="fin-panel-title"><h2>Tren pendapatan bersih</h2><p>Enam bulan terakhir. Bukan uang kas yang sudah cair.</p></div><div class="fin-chart">'+series.map(x=>'<div class="fin-bar-row"><span>'+esc(x.month.slice(5)+"/"+x.month.slice(2,4))+'</span><div><i style="width:'+Math.max(0,100*x.revenue/max).toFixed(2)+'%"></i></div><strong>'+fmt(x.revenue)+'</strong></div>').join("")+'</div></div>'+
 '<div class="fin-panel"><div class="fin-panel-title"><h2>Omzet per channel</h2><p>Penjualan dari pesanan bulan ini.</p></div>'+
 (byChannel.length?byChannel.map(([name,n])=>'<div class="fin-channel"><span>'+esc(name)+'</span><strong>'+fmt(n)+'</strong></div>').join(""):rowEmpty())+'</div></div>'+
 '<div class="fin-panel"><div class="fin-panel-title"><h2>Rekonsiliasi laba dan kas</h2><p>Dua angka ini wajar berbeda: bahan/alat dibeli hari ini bisa digunakan selama beberapa periode.</p></div>'+
 '<div class="fin-reconcile">'+[
  ["Pendapatan setelah diskon & refund",m.revenue],
  ["Potongan platform & biaya pembayaran",-m.fees],
  ["HPP produk terjual (diisi saat penjualan)",-m.cogs],
  ["Biaya operasional bulan ini",-m.operational],
  ["Penyusutan alat bulan ini",-m.depreciation],
  ["Estimasi laba operasional",m.profit],
  ["Payout penjualan yang benar-benar diterima",m.cashIn],
  ["Semua pembayaran belanja & alat",-m.cashOut],
  ["Arus kas periode",m.cashFlow],
 ].map(([title,n],i)=>'<div class="fin-reconcile-row '+([5,8].includes(i)?"strong":"")+'"><span>'+title+'</span><strong>'+fmt(n)+'</strong></div>').join("")+'</div>'+
 '<p class="fin-hint">Payout belum diterima dari semua penjualan: '+fmt(m.pending)+'. Tanpa data HPP yang benar, biaya tenaga kerja, pajak, dan saldo awal kas, laporan ini belum menjadi laporan keuangan lengkap.</p></div>';
}
function renderSales(){
 return '<div class="fin-panel"><div class="fin-panel-title"><h2>Catat penjualan yang sudah terjadi</h2><p>Boleh satu baris per order, atau rekap per hari dan platform dengan seluruh potongan sudah dijumlahkan.</p></div>'+
 '<form id="fin-sale" class="fin-grid-form">'+
 field("Tanggal penjualan",'<input name="date" type="date" value="'+core.today()+'" required/>')+
 field("Channel",'<select name="channel">'+core.CHANNELS.map(x=>'<option>'+x+'</option>').join("")+'</select>')+
 field("Jumlah order",'<input type="number" name="orders" min="1" max="10000" value="1" required/>')+
 field("Omzet kotor (Rp)",numInput("gross",0,"required"))+
 field("Diskon ditanggung merchant (Rp)",numInput("discount",0,"required"))+
 field("Refund / pengembalian (Rp)",numInput("refund",0,"required"))+
 field("Biaya platform (Rp)",numInput("platformFee",0,"required"))+
 field("Biaya layanan/pembayaran lain (Rp)",numInput("otherFee",0,"required"))+
 field("Total HPP pesanan (Rp)",numInput("cogs",0,"required"),"Bahan terpakai + kemasan + biaya langsung yang dimasukkan ke standar HPP.")+
 field("Status payout",'<select name="payoutStatus" id="fin-payout-status"><option value="pending">Belum cair</option><option value="paid">Sudah diterima</option></select>')+
 '<div class="fin-form-wide" id="fin-payout-date" hidden>'+field("Tanggal uang diterima",'<input name="payoutDate" type="date" value="'+core.today()+'"/>')+'</div>'+
 field("Catatan",textInput("note","ID pesanan / nomor settlement",false))+
 '<div class="fin-form-actions"><button type="submit" class="fin-button primary">Simpan penjualan</button></div></form>'+
 '</div><div class="fin-alert">Contoh: omzet Rp50.000 − diskon merchant Rp5.000 − fee platform Rp10.000 = penerimaan yang diharapkan Rp35.000. Baru dihitung kas masuk saat payout ditandai sudah diterima. HPP berbeda dari pembelian stok.</div>';
}
function renderAssets(){
 const assets=state.data.purchases.filter(x=>!x.voidedAt&&x.kind==="equipment"&&x.date<=state.month+"-31").sort((a,b)=>b.date.localeCompare(a.date));
 const dep=assets.reduce((a,x)=>a+core.depreciation(x,state.month),0);
 return '<div class="fin-summary-strip"><div><span>Jumlah aset tercatat</span><strong>'+assets.length+' alat</strong></div><div><span>Penyusutan bulan ini</span><strong>'+fmt(dep)+'</strong></div><div><span>Nilai buku akhir bulan</span><strong>'+fmt(assets.reduce((a,x)=>a+core.bookValue(x,state.month),0))+'</strong></div></div>'+
 '<div class="fin-panel"><div class="fin-panel-title"><h2>Register aset & penyusutan</h2><p>Metode garis lurus mulai bulan digunakan. Untuk membeli alat baru gunakan menu Belanja → Catat pembelian → Alat / aset.</p></div>'+
 table(["Alat / tanggal","Harga perolehan","Umur / nilai sisa","Penyusutan bulanan","Nilai buku"],assets.map(x=>'<tr><td><strong>'+esc(x.name)+'</strong><small>'+esc(x.date)+" • "+esc(x.serviceDate)+'</small></td><td>'+fmt(x.total)+'</td><td>'+esc(x.lifeMonths)+' bln / '+fmt(x.residual)+'</td><td>'+fmt(core.depreciation(x,state.month))+'</td><td>'+fmt(core.bookValue(x,state.month))+'</td></tr>'))+
 '</div><div class="fin-alert">Penyusutan bulanan adalah alokasi nilai alat dalam laporan pengelolaan, <b>bukan pembayaran tunai baru setiap bulan</b>. Kebijakan pembulatan dan umur manfaat untuk pembukuan pajak perlu disesuaikan dengan aturan yang berlaku.</div>';
}
function renderLedger(){
 const ss=state.data.sales.filter(x=>x.date.startsWith(state.month)).sort((a,b)=>b.date.localeCompare(a.date));
 return '<div class="fin-panel"><div class="fin-panel-title"><h2>Riwayat penjualan — '+monthLabel(state.month)+'</h2><p>Pembatalan dicatat tanpa menghapus transaksi asli.</p></div>'+
 table(["Tanggal / channel","Omzet","Potongan","Payout & status","Tindakan"],ss.map(s=>'<tr class="'+(s.voidedAt?"fin-done":"")+'"><td>'+esc(s.date)+'<strong>'+esc(s.channel)+'</strong><small>'+esc(s.orders)+' order</small></td><td>'+fmt(s.gross)+'</td><td>'+fmt(s.discount+s.refund+s.platformFee+s.otherFee)+'</td><td>'+fmt(core.netPayout(s))+'<small>'+(s.payoutDate?"Diterima "+esc(s.payoutDate):"Belum cair")+'</small></td><td>'+(s.voidedAt?badge("Dibatalkan","urgent"):'<div class="fin-row-actions">'+(!s.payoutDate?'<button class="fin-link" data-fin-act="payout" data-fin-id="'+esc(s.id)+'">Tandai cair</button>':"")+'<button class="fin-link danger" data-fin-act="void-sale" data-fin-id="'+esc(s.id)+'">Batalkan</button></div>')+'</td></tr>'))+
 '</div>';
}
function downloadText(content,filename,type){
 const blob=new Blob([content],{type});const href=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=href;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(href),1200);
}
function renderBackup(){
 const s=state.data;
 return '<div class="fin-panel"><div class="fin-panel-title"><h2>Cadangkan data keuangan</h2><p>Simpan file di Drive pribadi owner, bukan di chat grup karyawan.</p></div>'+
 '<div class="fin-summary-strip"><div><span>Transaksi penjualan</span><strong>'+s.sales.length+'</strong></div><div><span>Transaksi belanja</span><strong>'+s.purchases.length+'</strong></div><div><span>Daftar kebutuhan</span><strong>'+s.plans.length+'</strong></div></div>'+
 '<div class="fin-backup-actions">'+
 '<button type="button" class="fin-button primary" data-fin-act="export">Unduh backup JSON</button>'+
 '<button type="button" class="fin-button" data-fin-act="csv-sales">Ekspor penjualan CSV</button>'+
 '<button type="button" class="fin-button" data-fin-act="csv-purchases">Ekspor belanja CSV</button></div>'+
 '<div class="fin-import"><h3>Memulihkan backup</h3><p>Import akan <b>mengganti seluruh data pada perangkat ini</b>. Ekspor backup terbaru sebelum melakukan import.</p>'+
 '<input type="file" accept=".json,application/json" id="fin-import-file"/><button type="button" class="fin-button" data-fin-act="import">Import backup JSON</button></div></div>'+
 '<div class="fin-alert"><b>Belum aman untuk kerja multi-perangkat.</b> HP istri dan HP pemilik tidak tersinkron. Jangan gunakan import sebagai cara menggabungkan data dari dua perangkat. Fase berikutnya memerlukan Supabase Auth + RLS dan peran owner/staff.</div>';
}
function render(container,view){
 state.view=view;
 if(state.invalidStorage){container.innerHTML=shell("Data keuangan perlu dipulihkan","Data tersimpan tidak dapat dibaca. Tidak ada perubahan otomatis.",domError("Penyimpanan lokal rusak/tidak cocok. Jangan menginput transaksi baru di browser ini sampai dilakukan pemulihan."));return}
 const sub=state.sub[view];let body;
 if(view==="belanja"){body=sub==="plans"?renderPlans():sub==="purchases"?renderPurchases():renderPurchaseLog();container.innerHTML=shell("Belanja & kebutuhan.","Rencanakan bahan, kemasan, alat dan biaya operasional. Pisahkan anggaran dari pembelian aktual.",body)}
 else{body=sub==="dashboard"?renderDashboard():sub==="sales"?renderSales():sub==="assets"?renderAssets():sub==="ledger"?renderLedger():renderBackup();container.innerHTML=shell("Keuangan Little Treat.","Pantau penjualan, payout marketplace, kas keluar, aset dan estimasi laba.",body)}
}
function rerender(){const root=qs("#main");if(root&&["belanja","keuangan"].includes(state.view))render(root,state.view)}
function inputs(form){return Object.fromEntries(new FormData(form).entries())}
function record(form,type){
 if(state.invalidStorage)throw Error("Data lama perlu dipulihkan.");
 const i=inputs(form);if(type==="plan")state.data.plans.unshift(core.addPlan(i));
 if(type==="purchase"){
  const row=core.addPurchase(i);state.data.purchases.unshift(row);
  if(i.planId){const plan=state.data.plans.find(x=>x.id===i.planId);if(plan){plan.done=true;plan.linkedPurchaseId=row.id;}}
  state.realize=null;
 }
 if(type==="sale")state.data.sales.unshift(core.addSale({...i,payoutDate:i.payoutStatus==="paid"?i.payoutDate:null}));
 save();toast(type==="sale"?"Penjualan dicatat":type==="plan"?"Kebutuhan ditambahkan":"Pembelian dicatat");rerender();
}
function handleAction(btn){
 const action=btn.dataset.finAct,id=btn.dataset.finId;
 if(action==="realize"){
  state.realize=id;state.sub.belanja="purchases";rerender();qs("#fin-purchase")?.scrollIntoView({behavior:"smooth",block:"center"});return;
 }
 if(action==="void-purchase"||action==="void-sale"){
  const reason=prompt("Alasan pembatalan transaksi (wajib):");if(reason===null)return;
  if(!reason.trim()){toast("Alasan pembatalan wajib diisi.");return}
  if(!confirm("Batalkan transaksi ini? Riwayat asli tetap disimpan."))return;
  core.voidRecord(state.data,action==="void-sale"?"sales":"purchases",id,reason);
  // If a purchase for a shopping plan is cancelled, restore the plan.
  if(action==="void-purchase"){state.data.plans.forEach(x=>{if(x.linkedPurchaseId===id){x.done=false;x.linkedPurchaseId=null}})}
  save();rerender();toast("Transaksi dibatalkan");return;
 }
 if(action==="payout"){
  const s=state.data.sales.find(x=>x.id===id);if(!s||s.voidedAt)return;
  const date=prompt("Tanggal payout benar-benar diterima (YYYY-MM-DD):",core.today());if(date===null)return;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||date<s.date){toast("Tanggal payout tidak valid.");return}
  if(!confirm("Konfirmasi uang sudah diterima di rekening/kas?"))return;
  s.payoutDate=date;save();rerender();toast("Payout dicatat");return;
 }
 if(action==="export"){downloadText(JSON.stringify(state.data,null,2),"little-treat-backup-"+core.today()+".json","application/json");toast("Backup JSON diunduh");return}
 if(action==="csv-sales"){
  const fields=["id","date","channel","orders","gross","discount","refund","platformFee","otherFee","cogs","payoutDate","note","voidedAt","voidReason"];
  downloadText(core.toCsv(state.data.sales,fields),"little-treat-sales-"+core.today()+".csv","text/csv;charset=utf-8");return;
 }
 if(action==="csv-purchases"){
  const fields=["id","date","kind","name","qty","unit","unitPrice","shipping","total","supplier","lifeMonths","residual","serviceDate","voidedAt","voidReason"];
  downloadText(core.toCsv(state.data.purchases,fields),"little-treat-purchases-"+core.today()+".csv","text/csv;charset=utf-8");return;
 }
 if(action==="import"){
  const file=qs("#fin-import-file")?.files?.[0];
  if(!file){toast("Pilih file backup JSON dulu.");return}
  if(file.size>3e6){toast("File backup terlalu besar.");return}
  file.text().then(text=>{
   const next=core.validateImport(text);
   if(!confirm("Import akan menimpa semua transaksi pada perangkat ini. Sudah backup data sebelumnya?"))return;
   localStorage.setItem(KEY,JSON.stringify(next));state.data=next;state.invalidStorage=false;rerender();toast("Backup berhasil dipulihkan");
  }).catch(e=>{alert("Import ditolak: "+e.message)});
 }
}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-fin-tab]");if(tab){state.sub[state.view]=tab.dataset.finTab;state.realize=null;rerender();return}
 const btn=e.target.closest("[data-fin-act]");if(btn){try{handleAction(btn)}catch(err){alert(err.message)}}
});
document.addEventListener("change",e=>{
 if(e.target.matches("[data-fin-month]")){state.month=e.target.value||core.currentMonth();rerender()}
 if(e.target.id==="fin-purchase-kind"){const box=qs("#fin-asset-fields");if(box)box.hidden=e.target.value!=="equipment"}
 if(e.target.id==="fin-payout-status"){const box=qs("#fin-payout-date");if(box)box.hidden=e.target.value!=="paid"}
});
document.addEventListener("submit",e=>{
 const kind={"fin-plan":"plan","fin-purchase":"purchase","fin-sale":"sale"}[e.target.id];if(!kind)return;
 e.preventDefault();try{record(e.target,kind)}catch(err){alert("Tidak disimpan: "+err.message)}
});
window.addEventListener("storage",e=>{if(e.key===KEY){load();rerender();toast("Data berubah dari tab lain. Periksa transaksi terbaru.")}});
load();
window.LT_FINANCE={render};
})();