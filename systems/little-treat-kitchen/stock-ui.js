/* Stock and owner capital interface; no server storage, shared finance JSON only. */
(function(){
"use strict";
const engine=window.LT_STOCK_CORE;
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rup=n=>"Rp "+Math.round(Number(n)||0).toLocaleString("id-ID");
const num=n=>Number((Number(n)||0).toFixed(3)).toLocaleString("id-ID");
const endOfMonth=m=>new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5,7)),0)).toISOString().slice(0,10);
const empty='<p class="fin-empty">Belum ada catatan.</p>';
const smallTable=(headers,body)=>body.length?'<div class="fin-table-scroll"><table class="fin-table"><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join("")+'</tr></thead><tbody>'+body.join("")+'</tbody></table></div>':empty;
const formRow=(title,content)=>'<label class="fin-field"><span>'+title+'</span>'+content+'</label>';
const card=(title,subtitle,content)=>'<div class="fin-panel"><div class="fin-panel-title"><h2>'+title+'</h2><p>'+subtitle+'</p></div>'+content+'</div>';
const opt=(name,unit,id,count)=>'<option value="'+escape(id)+'">'+escape(name)+' ('+num(count)+' '+escape(unit)+')</option>';
function renderStock(data,month,today){
 engine.init(data);
 const info=engine.stockOverview(data,endOfMonth(month)),items=info.rows;
 const incoming=items.filter(x=>x.onHand<=x.minQty);
 const options=items.map(x=>opt(x.name,x.unit,x.id,x.onHand)).join("");
 const rows=items.map(x=>'<tr><td><strong>'+escape(x.name)+'</strong><small>'+escape(x.category==="ingredient"?"Bahan baku":"Kemasan")+' • '+escape(x.unit)+'</small></td>'+
 '<td>'+num(x.onHand)+' '+escape(x.unit)+(x.onHand<=x.minQty?'<small>⚠ Perlu dibeli</small>':"")+'</td>'+
 '<td>'+num(x.minQty)+' '+escape(x.unit)+'</td><td>'+rup(x.value)+'</td><td><button type="button" class="fin-link" data-stock-act="minimum" data-id="'+escape(x.id)+'">Ubah batas</button></td></tr>');
 const movements=(data.stockMoves||[]).filter(x=>x.date.startsWith(month)&&!x.voidedAt).slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,40);
 const logs=movements.map(x=>{
  const item=data.stockItems.find(i=>i.id===x.itemId);
  return '<tr><td>'+escape(x.date)+'</td><td>'+escape(item?.name||"?")+'</td><td>'+escape(({in:"Masuk",opening:"Saldo awal",use:"Dipakai",waste:"Terbuang"})[x.type])+' · '+num(x.qty)+' '+escape(item?.unit||"")+'</td><td>'+escape(x.note||"—")+'</td></tr>';
 });
 const addForm='<form id="lt-add-item" class="fin-grid-form">'+
 formRow("Nama bahan/kemasan",'<input name="name" maxlength="120" required placeholder="Contoh: Pisang kepok"/>')+
 formRow("Kategori",'<select name="category"><option value="ingredient">Bahan baku</option><option value="packaging">Kemasan</option></select>')+
 formRow("Satuan",'<input name="unit" maxlength="32" required placeholder="pcs, kg, liter…" value="pcs"/>')+
 formRow("Peringatan stok minimum",'<input name="minQty" type="number" min="0" step="0.001" value="0" required/>')+
 '<div class="fin-form-actions"><button class="fin-button primary" type="submit">+ Tambah barang</button></div></form>';
 const moveForm='<form id="lt-stock-move" class="fin-grid-form">'+
 formRow("Tanggal",'<input name="date" type="date" value="'+today+'" required/>')+
 formRow("Bahan/kemasan",'<select name="itemId">'+options+'</select>')+
 formRow("Aktivitas",'<select name="type" id="lt-stock-type"><option value="use">Digunakan produksi</option><option value="waste">Rusak/terbuang</option><option value="opening">Saldo awal (sekali saja)</option></select>')+
 formRow("Jumlah",'<input name="qty" type="number" min="0.001" max="10000000" step="0.001" value="1" required/>')+
 '<div class="fin-form-wide" id="lt-stock-opening-price" hidden>'+formRow("Harga satuan stok awal (Rp)",'<input name="unitCost" type="number" min="0" step="0.01" value="0"/>')+'</div>'+
 formRow("Catatan",'<input name="note" maxlength="300" placeholder="Order / pemakaian / waste"/>')+
 '<div class="fin-form-actions"><button class="fin-button primary" type="submit">Simpan pergerakan</button></div></form>';
 return '<div class="fin-summary-strip"><div><span>Jumlah jenis barang</span><strong>'+info.totalItems+'</strong></div><div><span>Stok perlu dibeli</span><strong>'+info.lowItems+' jenis</strong></div><div><span>Nilai stok estimasi</span><strong>'+rup(info.totalValue)+'</strong></div></div>'+
 (incoming.length?'<div class="fin-alert">Stok di bawah ambang: '+escape(incoming.slice(0,7).map(i=>i.name).join(", "))+'.</div>':"")+
 card("Daftar stok — "+escape(month),"Jumlah akhir bulan pilihan. Nilai stok adalah estimasi dari harga rata-rata pembelian.",smallTable(["Barang","Sisa stok","Minimum","Estimasi nilai","Aksi"],rows))+
 card("Tambahkan barang baru","Pembelian kategori bahan/kemasan otomatis membuat atau menambah stok dengan nama dan satuan yang sama.",addForm)+
 card("Catat pemakaian, waste, atau stok awal","Stok lama sebelum aplikasi ini bisa dimasukkan sebagai saldo awal. Jangan masukkan pembelian yang sudah otomatis tercatat lagi.",
 items.length?moveForm:empty)+
 card("Riwayat stok","40 pergerakan terakhir untuk bulan pilihan.",smallTable(["Tanggal","Barang","Aktivitas","Catatan"],logs))+
 '<div class="fin-alert"><b>Perhatian:</b> pergerakan stok tidak otomatis mengganti HPP per penjualan. Masukkan HPP aktual saat mencatat pesanan supaya laporan laba tidak keliru. Belum terhubung ke marketplace.</div>';
}
function renderCapital(data,month,today){
 engine.init(data);
 const m=engine.cashSummary(data,month);
 const rows=data.capitalEvents.filter(x=>x.date.startsWith(month)&&!x.voidedAt).slice().sort((a,b)=>b.date.localeCompare(a.date))
 .map(x=>'<tr><td>'+escape(x.date)+'</td><td>'+escape(x.type==="capital_in"?"Modal disetor":"Prive pemilik")+'</td><td>'+rup(x.amount)+'</td><td>'+escape(x.note||"—")+'</td></tr>');
 const form='<form id="lt-capital" class="fin-grid-form">'+
 formRow("Tanggal",'<input name="date" type="date" value="'+today+'" required/>')+
 formRow("Jenis",'<select name="type"><option value="capital_in">Setoran modal pemilik</option><option value="owner_draw">Pengambilan pribadi / prive</option></select>')+
 formRow("Nominal (Rp)",'<input name="amount" type="number" min="1" max="10000000000" step="1" value="0" required/>')+
 formRow("Catatan",'<input name="note" maxlength="300" placeholder="Transfer modal pribadi"/>')+
 '<div class="fin-form-actions"><button class="fin-button primary" type="submit">Simpan pergerakan modal</button></div></form>';
 return '<div class="fin-summary-strip"><div><span>Modal masuk</span><strong>'+rup(m.capitalIn)+'</strong></div><div><span>Prive</span><strong>'+rup(m.ownerDraw)+'</strong></div><div><span>Perubahan kas oleh pemilik</span><strong>'+rup(m.net)+'</strong></div></div>'+
 card("Modal dan pengambilan pribadi","Modal masuk dan prive memengaruhi kas tetapi bukan omzet atau beban operasional.",form)+
 card("Riwayat modal/prive",month,smallTable(["Tanggal","Jenis","Nilai","Keterangan"],rows))+
 '<div class="fin-alert">Utang/pinjaman, bunga, dan pengembalian modal investor belum didukung. Jangan catat pinjaman sebagai penjualan.</div>';
}
function bind(getData,save,refresh,toast){
 document.addEventListener("change",e=>{if(e.target.id==="lt-stock-type"){const f=document.getElementById("lt-stock-opening-price");if(f)f.hidden=e.target.value!=="opening"}});
 document.addEventListener("submit",e=>{
  if(!["lt-add-item","lt-stock-move","lt-capital"].includes(e.target.id))return;
  e.preventDefault();
  const data=getData(),i=Object.fromEntries(new FormData(e.target).entries());
  try{
   if(e.target.id==="lt-add-item")engine.createItem(data,i);
   else if(e.target.id==="lt-stock-move"){
    if(i.type==="opening")engine.addOpening(data,i);else engine.useStock(data,i);
   }else data.capitalEvents.push(engine.capitalEvent(i));
   save();toast("Data tersimpan");refresh();
  }catch(err){alert("Tidak tersimpan: "+err.message)}
 });
 document.addEventListener("click",e=>{
  const b=e.target.closest("[data-stock-act]");if(!b)return;
  if(b.dataset.stockAct==="minimum"){
   const data=getData(),item=data.stockItems.find(x=>x.id===b.dataset.id);
   if(!item)return;
   const n=prompt("Stok minimum untuk "+item.name+" ("+item.unit+"):",String(item.minQty));
   if(n===null)return;
   try{engine.adjustMin(data,item.id,n);save();toast("Ambang stok diperbarui");refresh()}catch(err){alert(err.message)}
  }
 });
}
window.LT_STOCK_UI={renderStock,renderCapital,bind};
})();