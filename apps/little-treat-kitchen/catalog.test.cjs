// Run: node --test apps/little-treat-kitchen/catalog.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'recipes.js'),'utf8'),context);
const {coffee,banana,dimsum,prep,ops,all}=context.window.LT_KITCHEN_DATA;
test('expected catalog sizes',()=>{
 assert.equal(coffee.length,16);
 assert.equal(banana.length,9);
 assert.equal(dimsum.length,5);
 assert.equal(prep.length,8);
 assert.equal(ops.length,5);
 assert.equal(all.length,43);
});
test('stable unique identifiers and complete recipe names',()=>{
 assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 for(const r of all){assert.ok(r.id);assert.ok(r.name);assert.ok(r.category)}
});
test('all cup recipes contain 4 valid gramations',()=>{
 for(const r of coffee){
  for(const i of r.ingredients){
   assert.equal(i.values.length,4,r.name+': '+i.name);
   for(const v of i.values)assert.ok(Number.isFinite(v)&&v>=0);
  }
 }
});
test('banana and dimsum portions are nonzero',()=>{
 for(const r of [...banana,...dimsum]){
  assert.ok(r.ingredients.length>0&&r.steps.length>0);
  for(const i of r.ingredients)assert.ok(Number.isFinite(i.value)&&i.value>0);
 }
});
test('app js parses in V8',()=>{new vm.Script(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'))});
