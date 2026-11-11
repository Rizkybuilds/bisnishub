/* Little Treat stock & owner-capital helper. Separate from cashbook accounting. */
(function(root,factory){
  const api=factory();
  root.LT_STOCK_CORE=api;
  if(typeof module==="object"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis,function(){
"use strict";
const CATS=["ingredient","packaging"];
const MOVES=["in","opening","use","waste"];
const CAPITAL=["capital_in","owner_draw"];
const id=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"lts-"+Date.now()+"-"+Math.random().toString(36).slice(2,12);
const label=(s,n=120)=>String(s??"").trim().slice(0,n);
function qty(n){const v=Number(n);if(!Number.isFinite(v)||v<=0||v>1e7)throw Error("Jumlah harus lebih dari nol dan masuk akal.");return v}
function nonnegative(n){const v=Number(n);if(!Number.isFinite(v)||v<0||v>1e10)throw Error("Nominal tidak valid.");return v}
function date(s){if(typeof s!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(s)||Number.isNaN(Date.parse(s+"T12:00:00Z"))||new Date(s+"T12:00:00Z").toISOString().slice(0,10)!==s)throw Error("Tanggal tidak valid.");return s}
const init=data=>{if(!Array.isArray(data.stockItems))data.stockItems=[];if(!Array.isArray(data.stockMoves))data.stockMoves=[];if(!Array.isArray(data.capitalEvents))data.capitalEvents=[];return data};
const key=(name,unit,category)=>[name.trim().toLocaleLowerCase("id-ID"),unit.trim().toLowerCase(),category].join("|");
function newItem(input){
 if(!label(input.name))throw Error("Nama bahan wajib diisi.");
 if(!label(input.unit))throw Error("Satuan wajib diisi (pcs/kg/liter/dll).");
 if(!CATS.includes(input.category))throw Error("Kategori stok hanya bahan atau kemasan.");
 const minQty=nonnegative(input.minQty||0);
 return {id:id(),name:label(input.name),unit:label(input.unit,32),category:input.category,minQty,
    createdAt:new Date().toISOString(),archived:false};
}
function createItem(data,input){
 init(data);
 const item=newItem(input),itemKey=key(item.name,item.unit,item.category);
 if(data.stockItems.some(x=>key(x.name,x.unit,x.category)===itemKey))throw Error("Bahan dengan nama dan satuan tersebut sudah ada.");
 data.stockItems.push(item);
 return item;
}
function findOrCreateItem(data,p){
 init(data);
 const itemKey=key(p.name,p.unit,p.kind);
 let match=data.stockItems.find(x=>key(x.name,x.unit,x.category)===itemKey);
 if(!match)match=createItem(data,{name:p.name,unit:p.unit,category:p.kind,minQty:0});
 return match;
}
function getItem(data,itemId){
 init(data);
 const item=data.stockItems.find(x=>x.id===itemId);
 if(!item)throw Error("Barang tidak ditemukan di master stok.");
 return item;
}
function movement(input){
 if(!MOVES.includes(input.type))throw Error("Jenis perubahan stok tidak dikenal.");
 const unitPrice=nonnegative(input.unitCost??0);
 return {id:id(),itemId:label(input.itemId,120),date:date(input.date),type:input.type,qty:qty(input.qty),
 unitCost:unitPrice,linkedPurchaseId:label(input.linkedPurchaseId||"",120)||null,
 note:label(input.note||"",500),voidedAt:null,voidReason:null,createdAt:new Date().toISOString()};
}
/* Weighted average cost. Stock movements MUST be chronological by business date,
   then creation timestamp. A negative historical balance indicates corrupt import. */
function snapshot(data,itemId,throughDate="9999-12-31"){
 getItem(data,itemId);date(throughDate);
 const moves=(data.stockMoves||[]).filter(m=>m.itemId===itemId&&!m.voidedAt&&m.date<=throughDate)
  .slice().sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id));
 let onHand=0,value=0,received=0,consumed=0,wasted=0,valid=true;
 for(const m of moves){
  if(m.type==="in"||m.type==="opening"){
   onHand+=m.qty;value+=m.qty*m.unitCost;received+=m.qty;
  }else{
   if(m.qty>onHand+1e-8){valid=false;continue}
   const unitCost=onHand>0?value/onHand:0;
   const removal=m.qty*unitCost;
   onHand-=m.qty;value-=removal;
   if(m.type==="use")consumed+=removal;else wasted+=removal;
  }
 }
 if(onHand<1e-8){onHand=0;value=0}
 return {itemId,onHand,value,avgCost:onHand?value/onHand:0,received,consumed,wasted,valid};
}
function addOpening(data,input){
 const item=getItem(data,input.itemId);
 const m=movement({...input,type:"opening"});
 // If historic purchase receipts exist, adding opening is not safe accounting. Make explicit.
 if((data.stockMoves||[]).some(x=>x.itemId===item.id&&!x.voidedAt))throw Error("Saldo awal hanya boleh dimasukkan satu kali sebelum ada pergerakan untuk barang tersebut.");
 data.stockMoves.push(m);return m;
}
function receivePurchase(data,purchase){
 init(data);
 if(!CATS.includes(purchase.kind))return null;
 if(purchase.voidedAt)throw Error("Pembelian batal tidak dapat diterima sebagai stok.");
 if(data.stockMoves.some(m=>m.linkedPurchaseId===purchase.id&&!m.voidedAt))throw Error("Pembelian ini sudah tercatat masuk stok.");
 const item=findOrCreateItem(data,purchase);
 const m=movement({itemId:item.id,type:"in",date:purchase.date,qty:purchase.qty,
    unitCost:purchase.total/purchase.qty,linkedPurchaseId:purchase.id,note:"Penerimaan dari pembelian "+purchase.name});
 data.stockMoves.push(m);return {item,movement:m};
}
function useStock(data,input){
 init(data);getItem(data,input.itemId);
 if(!["use","waste"].includes(input.type))throw Error("Pilih pemakaian produksi atau terbuang.");
 const m=movement({...input,unitCost:0});
 const before=snapshot(data,input.itemId,input.date);
 if(!before.valid)throw Error("Riwayat stok tidak konsisten. Periksa input sebelumnya.");
 if(m.qty>before.onHand+1e-8)throw Error("Stok tidak mencukupi pada tanggal tersebut: sisa "+before.onHand+".");
 // Ensure that inserting backdated movement does not make subsequent balances negative.
 data.stockMoves.push(m);
 const after=snapshot(data,input.itemId);
 if(!after.valid){data.stockMoves.pop();throw Error("Pergerakan bertanggal mundur menyebabkan stok negatif pada transaksi sesudahnya.");}
 return m;
}
function adjustMin(data,itemId,minQty){const item=getItem(data,itemId);item.minQty=nonnegative(minQty);return item}
function stockOverview(data,throughDate="9999-12-31"){
 init(data);
 const rows=data.stockItems.filter(x=>!x.archived).map(item=>({...item,...snapshot(data,item.id,throughDate)}));
 return {rows,totalItems:rows.length,lowItems:rows.filter(x=>x.onHand<=x.minQty).length,
  totalValue:rows.reduce((s,x)=>s+x.value,0)};
}
function voidReceipt(data,purchaseId,reason){
 init(data);const m=data.stockMoves.find(x=>x.linkedPurchaseId===purchaseId&&!x.voidedAt);
 if(!m)return null;
 const current=snapshot(data,m.itemId);
 if(current.onHand+1e-8<m.qty)throw Error("Tidak bisa batalkan pembelian: sebagian stok sudah dipakai. Catat koreksi dengan riwayat terpisah.");
 m.voidedAt=new Date().toISOString();m.voidReason=label(reason,250);
 if(!snapshot(data,m.itemId).valid){m.voidedAt=null;m.voidReason=null;throw Error("Pembatalan membuat riwayat stok negatif.");}
 return m;
}
function capitalEvent(input){
 if(!CAPITAL.includes(input.type))throw Error("Jenis pergerakan modal tidak dikenal.");
 const value=nonnegative(input.amount);if(value<=0)throw Error("Jumlah modal/prive harus lebih besar dari nol.");
 return {id:id(),date:date(input.date),type:input.type,amount:Math.round(value),note:label(input.note,300),createdAt:new Date().toISOString(),voidedAt:null,voidReason:null};
}
function cashSummary(data,month){
 init(data);
 const events=data.capitalEvents.filter(x=>!x.voidedAt&&x.date.slice(0,7)===month);
 const capitalIn=events.filter(x=>x.type==="capital_in").reduce((s,x)=>s+x.amount,0);
 const ownerDraw=events.filter(x=>x.type==="owner_draw").reduce((s,x)=>s+x.amount,0);
 return {capitalIn,ownerDraw,net:capitalIn-ownerDraw};
}
function validate(data){
 init(data);
 if(data.stockItems.length+data.stockMoves.length+data.capitalEvents.length>20000)throw Error("Backup stok terlalu besar.");
 const items=new Set(),moveIds=new Set();
 for(const item of data.stockItems){
  if(!item||!label(item.id)||items.has(item.id)||!label(item.name)||!label(item.unit)||!CATS.includes(item.category)||!Number.isFinite(item.minQty)||item.minQty<0)throw Error("Data master stok tidak valid.");
  items.add(item.id);
 }
 for(const m of data.stockMoves){
  if(!m||!label(m.id)||moveIds.has(m.id)||!items.has(m.itemId)||!MOVES.includes(m.type)||!Number.isFinite(m.qty)||m.qty<=0||!Number.isFinite(m.unitCost)||m.unitCost<0)throw Error("Data pergerakan stok tidak valid.");
  date(m.date);moveIds.add(m.id);
 }
 for(const c of data.capitalEvents){
  if(!c||!label(c.id)||moveIds.has(c.id)||!CAPITAL.includes(c.type)||!Number.isFinite(c.amount)||c.amount<=0)throw Error("Data modal/prive tidak valid.");
  date(c.date);moveIds.add(c.id);
 }
 for(const item of data.stockItems)if(!snapshot(data,item.id).valid)throw Error("Backup memiliki stok historis negatif.");
 return data;
}
return {init,newItem,createItem,findOrCreateItem,addOpening,receivePurchase,useStock,snapshot,stockOverview,adjustMin,voidReceipt,capitalEvent,cashSummary,validate};
});