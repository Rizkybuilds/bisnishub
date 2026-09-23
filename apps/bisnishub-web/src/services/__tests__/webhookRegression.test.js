import { readFileSync } from 'node:fs';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import { it, expect } from 'vitest';

// Execute the actual Edge handler with an isolated database and no network.
const source = readFileSync(new URL('../../../../../bisnis/teestock/supabase/functions/midtrans-webhook/index.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source.replace(/^import .*;\r?\n/gm, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None }
}).outputText;
async function notify(paymentStatus, transactionStatus, options = {}) {
  let handler;
  const writes = [];
  const order = { id:'order-1', order_number:'TS-TEST', status:options.status || 'dtf', payment_status:paymentStatus, total_amount:100000 };
  const query = {
    select:() => query, eq:() => query,
    update:value => { writes.push(value); return query; },
    maybeSingle:async () => ({ data:writes.length ? (options.concurrent ? null : {id:order.id}) : order, error:null })
  };
  vm.runInNewContext(code, {
    Deno:{serve:fn => {handler=fn;},env:{get:() => 'test-key'}},
    getAdminClient:() => ({from:() => query}), corsHeaders:{},
    crypto:webcrypto,TextEncoder,Request,Response,console:{log(){},warn(){},error(){}}
  });
  const amount = options.amount || '100000.00';
  const payload = {
    order_id:'TS-TEST',status_code:'200',gross_amount:amount,
    signature_key:createHash('sha512').update(`TS-TEST200${amount}test-key`).digest('hex'),
    transaction_status:transactionStatus,fraud_status:'accept',payment_type:'qris'
  };
  const response = await handler(new Request('http://localhost/webhook',{method:'POST',body:JSON.stringify(payload)}));
  return {response,writes};
}
it.each(['pending','settlement','capture','deny','cancel','expire'])('ignores late %s for an already paid order',async status => {
  const {response,writes}=await notify('paid',status);
  expect(response.status).toBe(200);
  expect(writes).toHaveLength(0);
});
it('never reopens refunded orders on late settlement',async () => {
  const {response,writes}=await notify('refunded','settlement');
  expect(response.status).toBe(200);
  expect(writes).toHaveLength(0);
});
it('records settlement without regressing production',async () => {
  const {response,writes}=await notify('unpaid','settlement');
  expect(response.status).toBe(200);
  expect(writes[0]).toMatchObject({payment_status:'paid',status:'dtf'});
});
it('rejects a signed but incorrect amount',async () => {
  const {response,writes}=await notify('unpaid','settlement',{amount:'1.00'});
  expect(response.status).toBe(400);
  expect(writes).toHaveLength(0);
});
it('requests a retry after a concurrent order change',async () => {
  const {response}=await notify('unpaid','settlement',{concurrent:true});
  expect(response.status).toBe(500);
});
