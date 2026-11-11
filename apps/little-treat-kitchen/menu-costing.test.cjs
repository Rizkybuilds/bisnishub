const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const window={};
vm.runInNewContext(read('recipes.js'),{window});
vm.runInNewContext(read('menu-costing.js'),{window});
const C=window.LT_COSTING,d=window.LT_KITCHEN_DATA;
const sql=read('ops/sql/20261111_menu_hpp_seed.sql');
const match=sql.match(/\$catalog\$\n([\s\S]*?)\n\$catalog\$::jsonb/);
assert.ok(match,'seed uses snapshot JSON sourced from recipes');
const data=JSON.parse(match[1]);

test('SOP source stays 30 identities; 64 coffee sizes plus banana and dimsum',()=>{
 assert.equal(d.coffee.length,16);assert.equal(d.banana.length,9);assert.equal(d.dimsum.length,5);
 assert.equal(data.length,78);
 assert.equal(data.filter(x=>x.category==='coffee').length,64);
 assert.equal(data.filter(x=>x.category==='banana').length,9);
 assert.equal(data.filter(x=>x.category==='dimsum').length,5);
 assert.equal(new Set(data.map(x=>x.sku)).size,data.length);
 assert.equal(new Set(data.map(x=>x.recipe_key)).size,30);
 assert.equal(data.reduce((s,x)=>s+x.ingredients.length,0),634);
 assert.equal(new Set(data.flatMap(x=>x.ingredients.map(m=>m.name))).size,45);
});

test('all SOP quantities are preserved for every cup size and banana/dimsum',()=>{
 const cupSizes=[12,14,16,22];
 for(const recipe of d.coffee){
  for(let i=0;i<4;i++){
   const sku=recipe.id+'-'+cupSizes[i];const entry=data.find(x=>x.sku===sku);
   assert.ok(entry,sku);
   assert.equal(entry.recipe_key,recipe.id);
   for(const ingredient of recipe.ingredients){
    const name=ingredient.name.startsWith('Air ')?'Air bersih':ingredient.name;
    const item=entry.ingredients.find(x=>x.name===name);
    assert.ok(item,sku+' '+name);
    assert.equal(item.qty,ingredient.values[i],sku+' '+name);
   }
   assert.equal(entry.ingredients.find(x=>x.name==='Cup '+cupSizes[i]+' oz').qty,1);
  }
 }
 for(const source of [...d.banana,...d.dimsum]){
  const entry=data.find(x=>x.sku===source.id);
  assert.ok(entry,source.id);
  assert.ok(entry.ingredients.length>=source.ingredients.length,source.id);
  assert.ok(entry.ingredients.every(m=>m.qty>0&&['pcs','g','ml'].includes(m.unit)),source.id);
 }
});

test('unsized coffee templates are hidden from the operator menu',()=>{
 const products=[
  {id:'template',sku:'K01',recipe_key:'K01',category:'coffee',name:'Iced Milk Latte'},
  ...[12,14,16,22].map(size=>({id:String(size),sku:'K01-'+size,recipe_key:'K01',category:'coffee',name:'Iced Milk Latte · '+size+' oz'})),
  {id:'banana',sku:'P01',recipe_key:'P01',category:'banana',name:'Original Crispy'}
 ];
 const list=C.sellable(products);assert.equal(list.length,5);
 assert.deepEqual(Array.from(C.groups(products),g=>g.key),['K01','P01']);
 assert.deepEqual(Array.from(C.groups(products)[0].items.map(p=>C.sizeOf(p))),[12,14,16,22]);
 assert.equal(C.groups(products,'latte').length,1);
 assert.equal(C.groups(products,'','banana').length,1);
});

test('HPP: a missing cost is never interpreted as zero or as production-ready',()=>{
 const product={id:'p',price:22000,active:false};
 const bom=[{product_id:'p',material_id:'milk',qty_per_unit:180},{product_id:'p',material_id:'cup',qty_per_unit:1}];
 const materials=[{id:'milk',name:'Susu UHT',unit:'ml'},{id:'cup',name:'Cup 14 oz',unit:'pcs'}];
 let calc=C.calculate(product,bom,materials,[],[]);
 assert.equal(calc.actualHpp,null);assert.equal(calc.planningHpp,null);assert.equal(calc.missingActual,2);
 calc=C.calculate(product,bom,materials,
  [{material_id:'milk',avg_cost_per_unit:20}],
  [{material_id:'cup',cost_per_unit:500,supplier:'Test seller'}]);
 assert.equal(calc.actualHpp,null);
 assert.equal(calc.planningHpp,4100);
 assert.equal(calc.missingActual,1);
 assert.equal(calc.parts[1].costSource,'quote');
 assert.equal(calc.isReady,false);
 calc=C.calculate(product,bom,materials,
  [{material_id:'milk',avg_cost_per_unit:20},{material_id:'cup',avg_cost_per_unit:450}],[]);
 assert.equal(calc.actualHpp,4050);assert.equal(calc.isReady,true);
});

test('price simulation uses user-supplied marketplace fee, fixed charges and promo',()=>{
 const v=C.simulate({hpp:9000,price:20000,percentFee:20,flatFee:1000,discount:500,overhead:1500,targetProfit:4500});
 assert.ok(v);
 assert.equal(v.fee,5000);
 assert.equal(v.payout,14500);
 assert.equal(v.contribution,4000);
 assert.equal(v.margin,20);
 assert.equal(v.breakeven,15000);
 assert.equal(v.targetPrice,20625);
 assert.equal(C.simulate({hpp:1,price:10,percentFee:100,flatFee:0,discount:0,overhead:0,targetProfit:0}),null);
});

test('schema never provides fabricated cost, prevents unsized coffee activation',()=>{
 assert.match(sql,/price,active\)[\s\S]*?,0,false/);
 assert.match(sql,/lt_material_quotes_owner/);
 assert.match(sql,/lt_product_activation_guard/);
 assert.match(sql,/lt_bom_active_guard/);
 assert.match(sql,/new\.sku ~ '\^K\[0-9\]\{2\}\$'/);
 assert.match(sql,/avg_cost_per_unit<=0/);
 assert.match(sql,/lt_material_quotes enable row level security/);
 assert.doesNotMatch(sql,/insert into public\.lt_material_costs/);
 const app=read('ops.js');
 assert.match(app,/lt_material_quotes/);
 assert.match(app,/ops-quote/);
 assert.match(app,/renderPricingPreview/);
 assert.match(app,/marketplace/);
 assert.match(read('index.html'),/menu-costing\.js/);
 assert.match(read('ops.html'),/menu-costing\.js/);
});
