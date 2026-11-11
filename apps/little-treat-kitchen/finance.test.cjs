// Run: node --test apps/little-treat-kitchen/finance.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('./finance-core.js');

test('shop plan has no accounting effect until purchased',()=>{
 const d=core.fresh(),p=core.addPlan({name:'Cup plastik',qty:50,unit:'pcs',unitPrice:600,kind:'packaging'});
 d.plans.push(p);
 const m=core.monthly(d,'2026-11');
 assert.equal(m.cashOut,0);assert.equal(m.profit,0);
 assert.equal(p.qty*p.unitPrice,30000);
});
test('inventory purchases only hit cash; HPP charged only on sale',()=>{
 const d=core.fresh();
 d.purchases.push(core.addPurchase({kind:'ingredient',name:'Pisang',date:'2026-11-01',qty:3,unit:'kg',unitPrice:15000,shipping:5000}));
 let m=core.monthly(d,'2026-11');assert.equal(m.cashOut,50000);assert.equal(m.profit,0);
 d.sales.push(core.addSale({channel:'GoFood',date:'2026-11-04',orders:2,gross:100000,discount:10000,refund:0,platformFee:20000,otherFee:0,cogs:30000,payoutDate:'2026-11-06'}));
 m=core.monthly(d,'2026-11');
 assert.equal(m.revenue,90000);assert.equal(m.cashIn,70000);
 assert.equal(m.cogs,30000);assert.equal(m.profit,40000);
});
test('unsettled revenue impacts profit but not cash receipt',()=>{
 const d=core.fresh();
 d.sales.push(core.addSale({channel:'GrabFood',date:'2026-11-01',gross:50000,discount:0,refund:0,platformFee:10000,cogs:20000}));
 const m=core.monthly(d,'2026-11');
 assert.equal(m.cashIn,0);assert.equal(m.pending,40000);assert.equal(m.profit,20000);
});
test('asset monthly depreciation and book value over life',()=>{
 const d=core.fresh();
 const asset=core.addPurchase({kind:'equipment',name:'Steamer',date:'2026-11-01',serviceDate:'2026-12-01',lifeMonths:36,residual:80000,qty:1,unitPrice:800000});
 d.purchases.push(asset);
 assert.equal(core.depreciation(asset,'2026-11'),0);
 assert.equal(core.depreciation(asset,'2026-12'),20000);
 assert.equal(core.bookValue(asset,'2026-12'),780000);
 assert.equal(core.bookValue(asset,'2029-11'),80000);
 assert.equal(core.depreciation(asset,'2029-12'),0);
 assert.equal(core.monthly(d,'2026-11').cashOut,800000);
 assert.equal(core.monthly(d,'2026-12').cashOut,0);
 assert.equal(core.monthly(d,'2026-12').profit,-20000);
});
test('operational expense hits cash and profit, equipment does not hit profit immediately',()=>{
 const d=core.fresh();
 d.purchases.push(core.addPurchase({kind:'operating',date:'2026-11-03',name:'Listrik',qty:1,unitPrice:25000}));
 const m=core.monthly(d,'2026-11');
 assert.equal(m.operational,25000);assert.equal(m.profit,-25000);assert.equal(m.cashOut,25000);
});
test('voided transactions stay in audit trail but disappear from totals',()=>{
 const d=core.fresh();
 const p=core.addPurchase({kind:'packaging',date:'2026-11-03',name:'Kemasan',qty:10,unitPrice:1000});
 d.purchases.push(p);
 core.voidRecord(d,'purchases',p.id,'Salah input');
 assert.equal(d.purchases.length,1);assert.equal(d.purchases[0].voidReason,'Salah input');
 assert.equal(core.monthly(d,'2026-11').cashOut,0);
});
test('backup round trip and rejects invalid data and duplicate IDs',()=>{
 const d=core.fresh();
 d.sales.push(core.addSale({date:'2026-11-01',channel:'Langsung',gross:20000,orders:1,payoutDate:'2026-11-01'}));
 assert.equal(core.validateImport(JSON.stringify(d)).sales.length,1);
 assert.throws(()=>core.validateImport('not json'));
 d.purchases.push({...d.sales[0],kind:'ingredient',name:'Dupe',total:100});
 assert.throws(()=>core.validateImport(JSON.stringify(d)));
});
test('reject unsafe sale math, equipment lifetime, and future-before-purchase service',()=>{
 assert.throws(()=>core.addSale({date:'2026-11-01',channel:'GoFood',gross:10000,discount:12000}));
 assert.throws(()=>core.addPurchase({date:'2026-11-01',kind:'equipment',name:'Alat',qty:1,unitPrice:100000,lifeMonths:0}));
 assert.throws(()=>core.addPurchase({date:'2026-11-01',kind:'equipment',name:'Alat',qty:1,unitPrice:100000,lifeMonths:12,serviceDate:'2026-10-01'}));
});
