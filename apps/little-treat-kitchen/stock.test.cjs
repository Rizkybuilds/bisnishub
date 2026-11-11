// Run: node --test apps/little-treat-kitchen/*.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const finance=require('./finance-core.js');
const stock=require('./stock-core.js');
const shared=()=>finance.fresh();
function receive(d,name,qty,price,date='2026-11-02'){
 const p=finance.addPurchase({kind:'ingredient',date,name,qty,unit:'kg',unitPrice:price,shipping:0});
 d.purchases.push(p);stock.receivePurchase(d,p);return p;
}
test('v1 backups migrate forward without losing purchases and sales',()=>{
 const older={version:1,sales:[],purchases:[finance.addPurchase({kind:'operating',name:'LPG',date:'2026-11-04',qty:1,unitPrice:22000})],plans:[]};
 const v2=finance.validateImport(JSON.stringify(older));
 assert.equal(v2.version,2);assert.equal(v2.purchases.length,1);
 assert.deepEqual(v2.stockItems,[]);assert.deepEqual(v2.stockMoves,[]);assert.deepEqual(v2.capitalEvents,[]);
});
test('purchases automatically receive stock and weighted average is correct',()=>{
 const d=shared();
 receive(d,'Pisang kepok',4,20000);
 receive(d,'Pisang kepok',6,30000,'2026-11-03');
 assert.equal(d.stockItems.length,1);
 assert.equal(d.stockMoves.length,2);
 const s=stock.snapshot(d,d.stockItems[0].id);
 assert.equal(s.onHand,10);assert.equal(s.avgCost,26000);assert.equal(s.value,260000);
 assert.equal(stock.stockOverview(d).totalValue,260000);
});
test('stock consumed for production differs from cost of products sold',()=>{
 const d=shared();receive(d,'Pisang',5,10000);
 const id=d.stockItems[0].id;
 stock.useStock(d,{itemId:id,type:'use',date:'2026-11-04',qty:2,note:'Produksi'});
 const s=stock.snapshot(d,id);
 assert.equal(s.onHand,3);assert.equal(s.consumed,20000);
 assert.equal(finance.monthly(d,'2026-11').profit,0); // HPP posted at sale, not stock withdrawal
 d.sales.push(finance.addSale({date:'2026-11-04',channel:'Langsung',gross:40000,cogs:20000,payoutDate:'2026-11-04'}));
 assert.equal(finance.monthly(d,'2026-11').profit,20000);
});
test('wasted stock becomes operating loss, without double purchase expense',()=>{
 const d=shared();receive(d,'Pisang',5,10000);
 const id=d.stockItems[0].id;
 stock.useStock(d,{itemId:id,type:'waste',date:'2026-11-08',qty:1});
 let m=finance.monthly(d,'2026-11');
 assert.equal(m.wasteCost,10000);assert.equal(m.profit,-10000);
 assert.equal(m.cashOut,50000);
 assert.equal(finance.monthly(d,'2026-12').wasteCost,0);
});
test('negative stock and backdated deductions are rejected',()=>{
 const d=shared();receive(d,'Pisang',3,10000,'2026-11-02');
 const id=d.stockItems[0].id;
 assert.throws(()=>stock.useStock(d,{itemId:id,type:'use',date:'2026-11-03',qty:4}),/tidak mencukupi/);
 stock.useStock(d,{itemId:id,type:'use',date:'2026-11-03',qty:2});
 assert.throws(()=>stock.useStock(d,{itemId:id,type:'waste',date:'2026-11-01',qty:1}),/tidak mencukupi/);
 assert.equal(stock.snapshot(d,id).onHand,1);
});
test('cannot void received purchase after part of stock used',()=>{
 const d=shared(),p=receive(d,'Pisang',3,10000);
 const id=d.stockItems[0].id;
 stock.useStock(d,{itemId:id,type:'use',date:'2026-11-03',qty:1});
 assert.throws(()=>stock.voidReceipt(d,p.id,'Salah nota'),/Tidak bisa batalkan/);
 assert.equal(d.stockMoves.filter(m=>!m.voidedAt).length,2);
});
test('opening inventory is a one-off non-cash event',()=>{
 const d=shared();const it=stock.createItem(d,{name:'Cup 14 oz',unit:'pcs',category:'packaging',minQty:10});
 stock.addOpening(d,{date:'2026-11-01',itemId:it.id,qty:20,unitCost:500});
 assert.equal(stock.snapshot(d,it.id).value,10000);
 assert.equal(finance.monthly(d,'2026-11').cashOut,0);
 assert.throws(()=>stock.addOpening(d,{date:'2026-11-02',itemId:it.id,qty:20,unitCost:500}));
 stock.adjustMin(d,it.id,25);
 assert.equal(stock.stockOverview(d).lowItems,1);
});
test('capital and owner draws move cash, never profit',()=>{
 const d=shared();
 d.capitalEvents.push(stock.capitalEvent({type:'capital_in',date:'2026-11-01',amount:500000}));
 d.capitalEvents.push(stock.capitalEvent({type:'owner_draw',date:'2026-11-02',amount:100000}));
 const m=finance.monthly(d,'2026-11');
 assert.equal(m.capitalIn,500000);assert.equal(m.ownerDraw,100000);
 assert.equal(m.cashIn,500000);assert.equal(m.cashOut,100000);
 assert.equal(m.cashFlow,400000);assert.equal(m.profit,0);
});
test('v2 stock backup validation catches invalid entries',()=>{
 const d=shared();receive(d,'Pisang',5,10000);
 assert.equal(finance.validateImport(JSON.stringify(d)).stockItems.length,1);
 const bad=JSON.parse(JSON.stringify(d));bad.stockMoves[0].qty=-1;
 assert.throws(()=>finance.validateImport(JSON.stringify(bad)));
});
