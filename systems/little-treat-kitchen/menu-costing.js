/* Little Treat Menu & HPP helpers.
   Recipe lines are ingredient/packaging baselines; cost is derived ONLY from
   real weighted-average receipts or a separately labelled supplier quote. */
(function(root){
"use strict";
const coffeeBase=/^K[0-9]{2}$/;
const sizePattern=/^K[0-9]{2}-(12|14|16|22)$/;
function isTemplate(p){return p.category==="coffee"&&coffeeBase.test(String(p.sku||""))}
function sellable(products){return products.filter(p=>!isTemplate(p))}
function sizeOf(p){const m=String(p.sku||"").match(sizePattern);return m?Number(m[1]):null}
function groups(products,search="",category="all"){
 const map=new Map();
 for(const p of sellable(products)){
  if(category!=="all"&&p.category!==category)continue;
  const key=p.recipe_key||p.sku;
  let group=map.get(key);
  if(!group){group={key,category:p.category,label:String(p.name).replace(/\s*·\s*(12|14|16|22)\s*oz$/,""),items:[]};map.set(key,group)}
  group.items.push(p);
 }
 const term=String(search||"").trim().toLocaleLowerCase("id-ID");
 return [...map.values()].filter(g=>!term||[g.label,g.key,g.category,
  ...g.items.map(p=>p.sku)].join(" ").toLocaleLowerCase("id-ID").includes(term))
 .map(g=>({...g,items:g.items.sort((a,b)=>(sizeOf(a)||0)-(sizeOf(b)||0))}))
 .sort((a,b)=>a.key.localeCompare(b.key,"id"));
}
function calculate(product,bom,materials,costs,quotes){
 const materialById=new Map(materials.map(m=>[m.id,m]));
 const costById=new Map(costs.map(c=>[c.material_id,c]));
 const quoteById=new Map(quotes.map(q=>[q.material_id,q]));
 const parts=bom.filter(b=>b.product_id===product.id).map(b=>{
  const material=materialById.get(b.material_id);
  const avg=Number(costById.get(b.material_id)?.avg_cost_per_unit||0);
  const quote=Number(quoteById.get(b.material_id)?.cost_per_unit||0);
  const qty=Number(b.qty_per_unit||0);
  const chosen=avg>0?avg:quote>0?quote:null;
  return {
   material_id:b.material_id,name:material?.name||"Material tidak ditemukan",
   unit:material?.unit||"",qty,
   actualUnitCost:avg>0?avg:null,quoteUnitCost:quote>0?quote:null,
   supplier:quoteById.get(b.material_id)?.supplier||"",
   costSource:avg>0?"actual":quote>0?"quote":"missing",
   planningLineCost:chosen!==null?qty*chosen:null,
   actualLineCost:avg>0?qty*avg:null
  };
 });
 const missingActual=parts.filter(p=>p.actualUnitCost===null).length;
 const missingPlanning=parts.filter(p=>p.planningLineCost===null).length;
 const actualHpp=parts.length&&missingActual===0?parts.reduce((n,p)=>n+p.actualLineCost,0):null;
 const planningHpp=parts.length&&missingPlanning===0?parts.reduce((n,p)=>n+p.planningLineCost,0):null;
 return {parts,actualHpp,planningHpp,missingActual,missingPlanning,
  quoted:parts.filter(p=>p.costSource==="quote").length,
  isReady:!!(parts.length&&missingActual===0&&Number(product.price)>0),
  active:!!product.active};
}
function simulate({hpp,price,percentFee,flatFee,discount,overhead,targetProfit}){
 const vals=[hpp,price,percentFee,flatFee,discount,overhead,targetProfit].map(Number);
 if(vals.some(v=>!Number.isFinite(v)||v<0))return null;
 const [cost,selling,pct,flat,promo,extra,target]=vals;
 if(pct>=100)return null;
 const multiplier=1-pct/100;
 const fee=selling*pct/100+flat;
 const payout=selling-fee-promo;
 const contribution=payout-cost-extra;
 const breakeven=(cost+extra+flat+promo)/multiplier;
 const targetPrice=(cost+extra+flat+promo+target)/multiplier;
 return {fee,payout,contribution,margin:selling>0?contribution/selling*100:null,
  breakeven,targetPrice};
}
root.LT_COSTING={isTemplate,sellable,sizeOf,groups,calculate,simulate};
})(window);