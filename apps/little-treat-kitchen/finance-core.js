/* Little Treat Finance Core v1 — management ledger, device-local. No tax compliance implied. */
(function(root,factory){
 const core=factory();root.LT_FIN_CORE=core;
 if(typeof module==="object"&&module.exports)module.exports=core;
})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const VERSION=1,MAX_ROWS=15000;
 const KINDS=["ingredient","packaging","equipment","operating"];
 const CHANNELS=["GoFood","GrabFood","ShopeeFood","Langsung","Lainnya"];
 const PRIORITIES=["Normal","Penting","Mendesak"];
 const cap=(n,max)=>Math.max(0,Math.min(max,Number(n)||0));
 const rup=n=>Math.round(cap(n,1e12));
 const sane=(s,max=150)=>String(s??"").trim().slice(0,max);
 const validDate=d=>typeof d==="string" && /^\d{4}-\d{2}-\d{2}$/.test(d)&& !Number.isNaN(Date.parse(d+"T12:00:00Z")) && new Date(d+"T12:00:00Z").toISOString().slice(0,10)===d;
 const monthOf=d=>d.slice(0,7);
 const today=()=>new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Jakarta",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const currentMonth=()=>today().slice(0,7);
 const uuid=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"lt-"+Date.now()+"-"+Math.random().toString(36).slice(2,10);
 const fresh=()=>({version:VERSION,sales:[],purchases:[],plans:[]});
 function positive(n,max=1e10){const v=Number(n);if(!Number.isFinite(v)||v<=0||v>max)throw Error("Jumlah harus lebih besar dari 0 dan dalam batas yang wajar.");return v}
 function amount(n,max=1e10){const v=Number(n);if(!Number.isFinite(v)||v<0||v>max)throw Error("Nominal harus angka Rupiah ≥ 0 dan dalam batas yang wajar.");return Math.round(v)}
 function checkDate(d){if(!validDate(d))throw Error("Tanggal tidak valid.");return d}
 function addPlan(input){
  const quantity=positive(input.qty,1000000),unitPrice=amount(input.unitPrice);
  if(!KINDS.includes(input.kind))throw Error("Kategori belanja tidak valid.");
  if(!sane(input.name))throw Error("Nama kebutuhan wajib diisi.");
  return {id:uuid(),kind:input.kind,name:sane(input.name),qty:quantity,unit:sane(input.unit||"pcs",32),unitPrice,priority:PRIORITIES.includes(input.priority)?input.priority:"Normal",supplier:sane(input.supplier||""),note:sane(input.note||"",500),done:false,linkedPurchaseId:null,createdAt:new Date().toISOString()};
 }
 function addPurchase(input){
  const qty=positive(input.qty,1000000), unitPrice=amount(input.unitPrice), shipping=amount(input.shipping||0,1e9);
  if(!KINDS.includes(input.kind))throw Error("Kategori pembelian tidak valid.");
  if(!sane(input.name))throw Error("Nama pembelian wajib diisi.");
  const date=checkDate(input.date),total=rup(qty*unitPrice+shipping);
  if(total<=0||total>1e11)throw Error("Total pembelian tidak valid.");
  const base={id:uuid(),date,kind:input.kind,name:sane(input.name),qty,unit:sane(input.unit||"pcs",32),unitPrice,shipping,total,supplier:sane(input.supplier||""),note:sane(input.note||"",500),createdAt:new Date().toISOString(),voidedAt:null,voidReason:null};
  if(input.kind==="equipment"){
   const life=Number(input.lifeMonths),residual=amount(input.residual||0),start=checkDate(input.serviceDate||date);
   if(!Number.isInteger(life)||life<1||life>240)throw Error("Umur manfaat alat harus 1–240 bulan.");
   if(residual>=total)throw Error("Nilai sisa harus lebih kecil dari harga perolehan alat.");
   if(start<date)throw Error("Tanggal mulai pakai tidak boleh sebelum tanggal pembelian.");
   Object.assign(base,{lifeMonths:life,residual,serviceDate:start});
  }
  return base;
 }
 function addSale(input){
  const date=checkDate(input.date),gross=amount(input.gross),discount=amount(input.discount||0),refund=amount(input.refund||0),platformFee=amount(input.platformFee||0),otherFee=amount(input.otherFee||0),cogs=amount(input.cogs||0);
  const orders=Number(input.orders||1);
  if(!CHANNELS.includes(input.channel))throw Error("Channel penjualan tidak valid.");
  if(!Number.isInteger(orders)||orders<1||orders>10000)throw Error("Jumlah pesanan tidak valid.");
  if(gross<=0||gross<discount+refund)throw Error("Omzet harus lebih besar dari diskon dan refund.");
  const revenue=gross-discount-refund;
  if(platformFee+otherFee>revenue)throw Error("Potongan biaya tidak boleh melebihi penjualan bersih.");
  const payoutDate=input.payoutDate?checkDate(input.payoutDate):null;
  if(payoutDate&&payoutDate<date)throw Error("Payout tidak boleh sebelum tanggal penjualan.");
  return {id:uuid(),date,channel:input.channel,orders,gross,discount,refund,platformFee,otherFee,cogs,payoutDate,note:sane(input.note||"",500),createdAt:new Date().toISOString(),voidedAt:null,voidReason:null};
 }
 const netRevenue=s=>s.gross-s.discount-s.refund;
 const netPayout=s=>netRevenue(s)-s.platformFee-s.otherFee;
 const contribution=s=>netPayout(s)-s.cogs;
 function depreciation(asset,month){
  if(!asset||asset.kind!=="equipment"||asset.voidedAt||!asset.lifeMonths||!asset.serviceDate)return 0;
  const y=Number(month.slice(0,4)),m=Number(month.slice(5,7));
  const aY=Number(asset.serviceDate.slice(0,4)),aM=Number(asset.serviceDate.slice(5,7));
  const idx=(y-aY)*12+(m-aM);
  if(idx<0||idx>=asset.lifeMonths)return 0;
  const base=asset.total-asset.residual;
  // Decimal monthly values avoid cumulative rounding distortion in book value.
  return base/asset.lifeMonths;
 }
 function bookValue(asset,month){
  if(asset.kind!=="equipment")return 0;
  let count=(Number(month.slice(0,4))-Number(asset.serviceDate.slice(0,4)))*12+
            (Number(month.slice(5,7))-Number(asset.serviceDate.slice(5,7)))+1;
  count=Math.max(0,Math.min(asset.lifeMonths,count));
  return Math.max(asset.residual,asset.total-(asset.total-asset.residual)*count/asset.lifeMonths);
 }
 function monthly(data,month){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))throw Error("Bulan laporan tidak valid.");
  const ss=data.sales.filter(x=>!x.voidedAt&&monthOf(x.date)===month);
  const pp=data.purchases.filter(x=>!x.voidedAt&&monthOf(x.date)===month);
  const gross=ss.reduce((a,s)=>a+s.gross,0),discount=ss.reduce((a,s)=>a+s.discount,0),refund=ss.reduce((a,s)=>a+s.refund,0);
  const revenue=gross-discount-refund,fees=ss.reduce((a,s)=>a+s.platformFee+s.otherFee,0),cogs=ss.reduce((a,s)=>a+s.cogs,0);
  const missingHpp=ss.filter(s=>s.cogs===0).length;
  const operational=pp.filter(p=>p.kind==="operating").reduce((a,p)=>a+p.total,0);
  const depreciationMonth=data.purchases.filter(x=>!x.voidedAt&&x.kind==="equipment").reduce((a,x)=>a+depreciation(x,month),0);
  const cashIn=data.sales.filter(x=>!x.voidedAt&&x.payoutDate&&monthOf(x.payoutDate)===month).reduce((a,s)=>a+netPayout(s),0);
  const cashOut=pp.reduce((a,p)=>a+p.total,0);
  const pending=data.sales.filter(x=>!x.voidedAt&&!x.payoutDate).reduce((a,s)=>a+netPayout(s),0);
  const assets=data.purchases.filter(x=>x.kind==="equipment"&&!x.voidedAt&&x.date<=month+"-31");
  const assetBook=assets.reduce((a,x)=>a+bookValue(x,month),0);
  return {month,orderCount:ss.reduce((a,s)=>a+s.orders,0),saleCount:ss.length,gross,discount,refund,revenue,fees,cogs,missingHpp,contribution:revenue-fees-cogs,operational,depreciation:depreciationMonth,profit:revenue-fees-cogs-operational-depreciationMonth,cashIn,cashOut,cashFlow:cashIn-cashOut,pending,assetBook, purchases:pp.length,assets:assets.length};
 }
 function pastMonths(month,n){
  const [y,m]=month.split("-").map(Number);return Array.from({length:n},(_,i)=>{const dt=new Date(Date.UTC(y,m-1-i,1));return dt.toISOString().slice(0,7)});
 }
 function voidRecord(data,collection,id,reason){
  if(!["sales","purchases"].includes(collection))throw Error("Jenis transaksi salah.");
  const row=data[collection].find(x=>x.id===id);if(!row||row.voidedAt)throw Error("Transaksi tidak ditemukan/ sudah dibatalkan.");
  if(!sane(reason))throw Error("Alasan pembatalan wajib diisi.");
  row.voidedAt=new Date().toISOString();row.voidReason=sane(reason,250);
  return row;
 }
 function validateImport(text){
  if(typeof text!=="string"||text.length>3e6)throw Error("Backup terlalu besar.");
  let data;try{data=JSON.parse(text)}catch(e){throw Error("File bukan JSON valid.");}
  if(!data||data.version!==VERSION||!Array.isArray(data.sales)||!Array.isArray(data.purchases)||!Array.isArray(data.plans))throw Error("Versi atau struktur backup tidak cocok.");
  if(data.sales.length+data.purchases.length+data.plans.length>MAX_ROWS)throw Error("Terlalu banyak transaksi.");
  const ids=new Set();
  for(const [type,records] of [["sales",data.sales],["purchases",data.purchases],["plans",data.plans]]){
    for(const x of records){
      if(!x||typeof x!=="object"||!sane(x.id)||ids.has(x.id))throw Error("Ada ID transaksi kosong/duplikat.");
      ids.add(x.id);
      if(type==="plans"){
       if(!KINDS.includes(x.kind)||!sane(x.name)||!positive(x.qty)||amount(x.unitPrice)<0||typeof x.done!=="boolean")throw Error("Data rencana belanja rusak.");
      }else{
       checkDate(x.date);
       if(type==="purchases"){
        if(!KINDS.includes(x.kind)||!sane(x.name)||!positive(x.qty)||!Number.isFinite(x.total)||x.total<=0)throw Error("Data pembelian rusak.");
        if(x.kind==="equipment"){if(!Number.isInteger(x.lifeMonths)||x.lifeMonths<1||x.lifeMonths>240||!validDate(x.serviceDate)||x.residual<0||x.residual>=x.total)throw Error("Data aset rusak.");}
       }else{
        if(!CHANNELS.includes(x.channel)||!Number.isInteger(x.orders)||x.orders<1||!Number.isFinite(x.gross)||x.gross<0)throw Error("Data penjualan rusak.");
        ["discount","refund","platformFee","otherFee","cogs"].forEach(k=>amount(x[k]));
        if(x.gross<x.discount+x.refund+x.platformFee+x.otherFee)throw Error("Angka penjualan tidak konsisten.");
        if(x.payoutDate)checkDate(x.payoutDate);
       }
      }
    }
  }
  return {version:VERSION,sales:data.sales,purchases:data.purchases,plans:data.plans};
 }
 function toCsv(records,fields){
  const enc=v=>'"'+String(v??"").replace(/"/g,'""').replace(/^[=+\-@]/,"'$&")+'"';
  return "\ufeff"+fields.map(enc).join(",")+"\n"+records.map(x=>fields.map(f=>enc(x[f])).join(",")).join("\n");
 }
 return {VERSION,KINDS,CHANNELS,PRIORITIES,fresh,addPlan,addPurchase,addSale,monthly,contribution,netRevenue,netPayout,depreciation,bookValue,pastMonths,voidRecord,validateImport,toCsv,currentMonth,today,rup};
});