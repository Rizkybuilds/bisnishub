// P0 release gate for the static Little Treat Kitchen OS bundle.
// Run: node --test apps/little-treat-kitchen/release-gates.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,p),'utf8');
const entryNames=['index.html','ops.html'];
const published=['index.html','ops.html','ops.js','ops.css','ops-visual.css',
 'ops-config.js','recipes.js','menu-costing.js','icon.svg'];

test('entrypoints have a complete same-origin GitHub Pages bundle',()=>{
 for(const name of entryNames){
  const html=read(name);
  assert.match(html,/<html lang="id">/);
  assert.match(html,/id="ops-root"/);
  for(const href of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)){
   const target=href[1].slice(2).split('?')[0].split('#')[0];
   assert.ok(fs.existsSync(path.join(__dirname,target)),name+' missing '+target);
  }
  const scripts=[...html.matchAll(/<script\s+src="\.\/([^"?]+)(?:\?[^"]*)?"\s+defer><\/script>/g)].map(m=>m[1]);
  assert.deepEqual(scripts,['ops-config.js','recipes.js','menu-costing.js','ops.js']);
  assert.match(html,/script-src 'self'/);
  assert.match(html,/connect-src 'self' https:\/\/\*\.supabase\.co/);
  assert.doesNotMatch(html,/unsafe-inline|unsafe-eval|service_role|sb_secret_/);
 }
 for(const file of published) assert.ok(fs.existsSync(path.join(__dirname,file)),file);
});

test('only a public Supabase key is shipped; backend is isolated',()=>{
 const source=read('ops-config.js');
 const matches=source.match(/publishableKey:\s*"([^"]+)"/);
 assert.ok(matches,'Supabase publishable key configured');
 assert.match(matches[1],/^sb_publishable_/);
 assert.match(source,/https:\/\/[a-z0-9]+\.supabase\.co/);
 assert.doesNotMatch(source,/(?:publishableKey|secretKey|serviceRoleKey):\s*"(?:sb_secret_|eyJ[^"]*service_role)/);
});

test('public app has staff/owner and unauthenticated login boundaries',()=>{
 const js=read('ops.js');
 assert.match(js,/async function authLogin/);
 assert.match(js,/async function verifyAccount/);
 assert.match(js,/async function refreshSession/);
 assert.match(js,/lt_members/);
 assert.match(js,/role in \('owner','staff'\)|\["owner","staff"\]/);
 assert.match(js,/id:"costing".*staff:false/);
 assert.match(js,/id:"closing".*staff:false/);
 assert.match(js,/lt_create_order_v2/);
 assert.match(js,/lt_record_purchase_v2/);
 assert.match(js,/lt_record_waste_v2/);
 assert.match(js,/lt_record_payout/);
 assert.doesNotMatch(js,/href="\.\/legacy\.html"/,'missing legacy page must not be linked');
});

test('release inventory lists only static assets, never local ledgers',()=>{
 const doc=read('RELEASE.md');
 for(const file of published)assert.ok(doc.includes(file),'missing from release manifest: '+file);
 assert.doesNotMatch(doc,/\b(?:service_role|sb_secret_)\s*=/);
});
