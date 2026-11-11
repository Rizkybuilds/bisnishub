(function(){
  "use strict";
  const D=window.LT_KITCHEN_DATA;
  if(!D){document.body.innerHTML="<p>Data resep gagal dimuat. Muat ulang halaman.</p>";return}
  const main=document.getElementById("main"),modal=document.getElementById("recipe-dialog"),
    dialogBody=document.getElementById("dialog-body"),help=document.getElementById("help-dialog"),
    toast=document.getElementById("toast");
  const pages=[
    {id:"menu",name:"Menu & Resep",short:"Menu",icon:"⌕",count:30},
    {id:"prep",name:"Persiapan Stok",short:"Persiapan",icon:"◫",count:D.prep.length},
    {id:"sop",name:"SOP Harian",short:"SOP",icon:"☷",count:D.ops.length},
    {id:"favorites",name:"Favorit",short:"Favorit",icon:"☆",count:null}
  ];
  const categories={coffee:{label:"Kopi",icon:"☕"},banana:{label:"Pisang",icon:"🍌"},dimsum:{label:"Dimsum",icon:"🥟"},prep:{label:"Persiapan",icon:"◫"},sop:{label:"SOP",icon:"☷"}};
  const sizes=["12","14","16","22"];
  const state={page:"menu",filter:"all",q:"",selected:null,size:"14",qty:1,sweet:"normal",checks:new Set(),favorites:new Set()};
  try{state.favorites=new Set(JSON.parse(localStorage.getItem("lt-favorites-v1")||"[]"))}catch(e){}
  const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=s=>String(s??"").toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[\u0300-\u036f]/g,"");
  const val=n=>Number.isInteger(n)?String(n):Number(n.toFixed(2)).toString().replace(".",",");
  const saveFav=()=>{try{localStorage.setItem("lt-favorites-v1",JSON.stringify([...state.favorites]))}catch(e){}};
  const icons=item=>categories[item.category]?.icon||"◫";
  const label=item=>categories[item.category]?.label||"";
  let toastTimer;
  function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
  function renderNav(){
    document.getElementById("side-nav").innerHTML=pages.map(p=>'<button type="button" class="side-link '+(state.page===p.id?"is-active":"")+'" data-nav="'+p.id+'"><span class="nav-glyph" aria-hidden="true">'+p.icon+'</span><span>'+p.name+'</span>'+(p.count!==null?'<span class="nav-count">'+p.count+'</span>':"")+'</button>').join("");
    document.getElementById("bottom-nav").innerHTML=pages.map(p=>'<button type="button" class="bottom-item '+(state.page===p.id?"is-active":"")+'" data-nav="'+p.id+'"><span class="nav-glyph" aria-hidden="true">'+p.icon+'</span><span>'+p.short+'</span></button>').join("");
    document.getElementById("breadcrumb-name").textContent=pages.find(p=>p.id===state.page)?.name||"Menu & Resep";
  }
  function dataForPage(){
    if(state.page==="menu")return [...D.coffee,...D.banana,...D.dimsum];
    if(state.page==="prep")return D.prep;
    if(state.page==="sop")return D.ops;
    return D.all.filter(x=>state.favorites.has(x.id));
  }
  function groupsForPage(){
    if(state.page==="menu")return [{id:"all",label:"Semua Menu"},{id:"coffee",label:"☕ Kopi"},{id:"banana",label:"🍌 Pisang"},{id:"dimsum",label:"🥟 Dimsum"}];
    if(state.page==="prep")return [{id:"all",label:"Semua Persiapan"},...new Map(D.prep.map(x=>[x.group,{id:x.group,label:x.group}])).values()];
    if(state.page==="sop")return [{id:"all",label:"Semua SOP"},{id:"Harian",label:"Harian"},{id:"Keselamatan",label:"Keselamatan"}];
    return [{id:"all",label:"Semua Favorit"},{id:"coffee",label:"Kopi"},{id:"banana",label:"Pisang"},{id:"dimsum",label:"Dimsum"},{id:"prep",label:"Persiapan"},{id:"sop",label:"SOP"}];
  }
  function filteredData(){
    return dataForPage().filter(x=>{
      if(state.filter!=="all" && state.filter!==x.category && state.filter!==x.group)return false;
      const search=norm([x.id,x.name,x.group,label(x),...(x.ingredients||[]).map(i=>i.name)].join(" "));
      return !state.q || search.includes(norm(state.q));
    });
  }
  function card(item){
    let isFav=state.favorites.has(item.id),sub=item.group||(item.category==="coffee"?"Cup 12–22 oz":"");
    return '<div class="card" tabindex="0" role="button" aria-label="Buka resep '+escapeHTML(item.name)+'" data-open="'+item.id+'">'+
      '<div class="card-top"><span class="category-icon '+item.category+'" aria-hidden="true">'+icons(item)+'</span>'+
      '<button type="button" class="favorite-star '+(isFav?"on":"")+'" data-fav="'+item.id+'" aria-pressed="'+isFav+'" aria-label="'+(isFav?"Hapus dari favorit":"Simpan favorit")+'">'+(isFav?"★":"☆")+'</button></div>'+
      '<div class="card-id">'+escapeHTML(item.id)+' · '+escapeHTML(label(item))+'</div>'+
      '<h3 class="card-title">'+escapeHTML(item.name)+'</h3><div class="card-sub">'+escapeHTML(sub)+'</div>'+
      '<div class="card-bottom"><span>'+(item.category==="coffee"?"4 ukuran cup":item.category==="banana"?"Resep per pesanan":item.category==="dimsum"?"Frozen ready-to-steam":item.category==="prep"?"Panduan batch":"Langkah kerja")+'</span><span class="card-arrow" aria-hidden="true">↗</span></div></div>';
  }
  function renderResults(){
    const list=filteredData(),root=document.getElementById("result-grid"),count=document.getElementById("result-count");
    if(!root)return;
    count.textContent=list.length+" ditemukan";
    root.innerHTML=list.length?'<div class="grid">'+list.map(card).join("")+'</div>':
      '<div class="empty"><span class="empty-icon" aria-hidden="true">⌕</span><b>Tidak ada hasil</b>Coba nama menu lain atau pilih kategori berbeda.</div>';
  }
  function pageText(){
    if(state.page==="prep")return ["Persiapan yang praktis.","Premix, saus, sirup, jelly — bahan dan langkah membuat stok harian."];
    if(state.page==="sop")return ["Satu standar, setiap shift.","Checklist keselamatan, alur pesanan, dan tata cara Han River."];
    if(state.page==="favorites")return ["Menu favoritmu.","Simpan resep yang sering dibuat supaya lebih cepat ditemukan."];
    return ["Mau buat menu apa hari ini?","Cari resep lengkap, takaran bahan, ukuran cup, dan langkah yang bisa diikuti satu per satu."];
  }
  function renderPage(){
    renderNav();const t=pageText();
    main.innerHTML='<section class="hero"><div><div class="eyebrow">LITTLE TREAT / KITCHEN STATION</div><h1>'+t[0]+'</h1><p>'+t[1]+'</p></div><div class="hero-visual" aria-hidden="true">'+(state.page==="menu"?"🍽️":state.page==="prep"?"🥣":state.page==="sop"?"📋":"⭐")+'</div></section>'+
      '<div class="stats"><div class="stat"><small>Menu utama</small><strong>30</strong><span>resep</span></div><div class="stat"><small>Persiapan stok</small><strong>'+D.prep.length+'</strong><span>panduan</span></div><div class="stat"><small>SOP operasional</small><strong>'+D.ops.length+'</strong><span>checklist</span></div></div>'+
      '<div class="controls"><div class="search"><span class="search-icon" aria-hidden="true">⌕</span><input type="search" id="search-menu" autocomplete="off" spellcheck="false" placeholder="Cari menu, bahan, atau kode resep…" aria-label="Cari menu atau bahan" value="'+escapeHTML(state.q)+'"/><button type="button" class="clear-search" data-clear aria-label="Bersihkan pencarian">×</button></div><span class="search-hint">Cari cepat</span></div>'+
      '<div id="filter-chips" class="chips">'+groupsForPage().map(x=>'<button type="button" data-filter="'+escapeHTML(x.id)+'" class="chip '+(state.filter===x.id?"is-active":"")+'">'+escapeHTML(x.label)+'</button>').join("")+'</div>'+
      '<div class="section-heading"><h2>'+(state.page==="menu"?"Katalog menu":state.page==="prep"?"Resep stok dan persiapan":state.page==="sop"?"Panduan prosedur":"Resep tersimpan")+'</h2><span id="result-count"></span></div>'+
      '<section id="result-grid" aria-live="polite"></section>';
    renderResults();
  }
  function go(page){
    if(!pages.some(x=>x.id===page))return;
    state.page=page;state.filter="all";state.q="";renderPage();window.scrollTo({top:0,behavior:"smooth"});
  }
  function find(id){return D.all.find(x=>x.id===id)}
  function stepsFor(item){
    if(item.category!=="coffee")return item.steps||[];
    const st=["Periksa pesanan: nama minuman, ukuran cup, jumlah cup, serta level manis yang tertera.","Cuci tangan; timbang kopi instan menggunakan timbangan, ukur air hangat sesuai tabel."];
    if(item.kind==="cocoa")st.push("Campurkan kakao dengan sebagian air hangat sampai menjadi pasta halus tanpa gumpalan; larutkan kopi pada sisa air.");
    else st.push("Larutkan kopi instan sepenuhnya dalam air hangat sampai tidak ada butiran.");
    if(item.ingredients.some(x=>x.name.includes("Creamer")))st.push("Masukkan creamer ke dalam kopi hangat, aduk hingga larut dan tidak menggumpal.");
    if(item.kind==="jelly")st.push("Timbang jelly kopi dingin sesuai resep dan masukkan ke cup sebelum es.");
    st.push("Tambahkan sirup / SKM sesuai tabel, aduk homogen. Jangan menambah pemanis di luar pesanan.");
    st.push("Tuang susu UHT dingin sesuai resep dan aduk rata.");
    st.push("Timbang es untuk setiap cup, lalu tuang campuran kopi yang sudah cukup dingin. Tutup dan segel rapat.");
    if(item.kind==="biscuit")st.push("Timbang biskuit dan bungkus secara TERPISAH agar tidak lembek.");
    st.push("QC: cek ukuran cup, jumlah, level manis, kebocoran, gumpalan, dan label sebelum serah ke driver.");
    return st;
  }
  function ingredientList(item){
    if(item.category!=="coffee")return (item.ingredients||[]).map(x=>({...x,amount:x.value*state.qty}));
    const i=sizes.indexOf(state.size);let rows=item.ingredients.map(x=>({name:x.name,unit:x.unit,amount:x.values[i]}));
    const sweetNames=["Simple syrup 1:1","Sirup gula aren 1:1","Kental manis (SKM)","Sirup butterscotch","Sirup vanilla","Sirup hazelnut","Sirup salted caramel","Sirup pandan khusus minuman","Sirup cinnamon"];
    if(state.sweet==="less"){
      let removed=0;
      rows=rows.map(x=>{if(sweetNames.includes(x.name)){const old=x.amount;x.amount=Math.round(old*.7*10)/10;removed+=old-x.amount;}return x});
      const milk=rows.find(x=>x.name==="Susu UHT plain");if(milk)milk.amount=Math.round((milk.amount+removed)*10)/10;
    }
    if(state.sweet==="more"){
      const extra=[5,7,8,12][i];const milk=rows.find(x=>x.name==="Susu UHT plain");
      if(milk)milk.amount-=extra;const syrup=rows.find(x=>x.name==="Simple syrup 1:1");
      if(syrup)syrup.amount+=extra;else rows.splice(rows.length-1,0,{name:"Simple syrup 1:1 tambahan",unit:"ml",amount:extra});
    }
    return rows.map(x=>({...x,amount:x.amount*state.qty}));
  }
  function ingredientHTML(list){return '<table class="ingredients"><tbody>'+list.map(x=>'<tr><td>'+escapeHTML(x.name)+'</td><td>'+val(x.amount)+' '+escapeHTML(x.unit)+'</td></tr>').join("")+'</tbody></table>'}
  function clipboardText(item){
    const size=item.category==="coffee"?state.size+" oz · ":"";
    const sweet=item.category==="coffee"?" · "+({normal:"Normal",less:"Less",more:"More"})[state.sweet]:"";
    const st=stepsFor(item);
    return item.id+" "+item.name+"\n"+size+state.qty+" porsi"+sweet+"\n\nBAHAN:\n"+ingredientList(item).map(x=>"- "+x.name+": "+val(x.amount)+" "+x.unit).join("\n")+"\n\nCARA BUAT:\n"+st.map((s,i)=>(i+1)+". "+s).join("\n")+"\n\n"+(item.pack?"PENGEMASAN: "+item.pack+"\n":"")+(item.warning?"PERINGATAN: "+item.warning:"");
  }
  function renderDetail(){
    const item=find(state.selected);if(!item)return;
    const hasIngredients=!!item.ingredients?.length,steps=stepsFor(item),isFav=state.favorites.has(item.id),ings=ingredientList(item);
    dialogBody.innerHTML='<div class="recipe-inner"><div class="dialog-top"><span>'+escapeHTML(label(item))+' / '+escapeHTML(item.id)+' / LITTLE TREAT</span><button type="button" class="close-dialog" data-close="recipe" aria-label="Tutup resep">×</button></div>'+
      '<h2 class="recipe-title">'+escapeHTML(item.name)+'</h2><div class="recipe-desc">'+escapeHTML(item.note||item.group||"Panduan operasional untuk satu pesanan.")+'</div>'+
      '<div class="settings-bar">'+(item.category==="coffee"?'<div class="field-group"><label for="cup-select">Ukuran cup</label><select id="cup-select">'+sizes.map(s=>'<option value="'+s+'" '+(state.size===s?"selected":"")+'>'+s+' oz</option>').join("")+'</select></div><div class="field-group"><label for="sweet-select">Tingkat manis</label><select id="sweet-select"><option value="normal" '+(state.sweet==="normal"?"selected":"")+'>Normal (resep dasar)</option><option value="less" '+(state.sweet==="less"?"selected":"")+'>Less (simulasi)</option><option value="more" '+(state.sweet==="more"?"selected":"")+'>More (simulasi)</option></select></div>':"")+
      '<div class="field-group"><label>Jumlah '+(item.category==="coffee"?"cup":item.category==="prep"?"batch":"porsi")+'</label><div class="mini-stepper"><button type="button" data-qty="-1" aria-label="Kurangi jumlah">−</button><strong>'+state.qty+'</strong><button type="button" data-qty="1" aria-label="Tambah jumlah">+</button></div></div>'+
      '<div class="recipe-actions"><button type="button" class="btn primary" data-copy>Salin</button><button type="button" class="btn" data-print>Cetak</button><button type="button" class="btn" data-toggle-fav>'+ (isFav?"★ Favorit":"☆ Simpan") +'</button></div></div>'+
      '<div class="recipe-columns">'+(hasIngredients?'<section class="recipe-section"><h3>Daftar bahan <span class="tag">'+(item.category==="coffee"?state.size+" oz":state.qty+"×")+'</span></h3>'+ingredientHTML(ings)+'<p class="small-help">Gunakan timbangan dan gelas ukur; jangan kira-kira dengan sendok.</p></section>':"")+
      '<section class="recipe-section"><h3>Langkah membuat <span style="color:#aaa;font-size:12px;font-weight:500" id="step-progress">'+state.checks.size+'/'+steps.length+'</span></h3>'+
      steps.map((s,i)=>'<div class="step '+(state.checks.has(i)?"done":"")+'"><input type="checkbox" id="step-'+i+'" data-step="'+i+'" '+(state.checks.has(i)?"checked":"")+'><label for="step-'+i+'">'+escapeHTML(s)+'</label></div>').join("")+
      '<button type="button" class="btn" data-reset style="margin-top:14px">↻ Ulangi checklist</button></section></div>'+
      (item.pack?'<div class="pack-note"><strong>Pengemasan</strong>'+escapeHTML(item.pack)+'</div>':"")+
      (item.qc?'<div class="pack-note"><strong>QC hasil</strong>'+escapeHTML(item.qc)+'</div>':"")+
      ((item.warning||item.note||item.category==="coffee")?'<div class="notice"><strong>Perhatian operator</strong>'+escapeHTML((item.warning||"")+(item.category==="coffee"&&state.sweet!=="normal"?" Level Less/More merupakan SIMULASI takaran, belum standar yang disahkan. Minta konfirmasi pengelola sebelum membuat pesanan berbayar.":""))+'</div>':"")+
      '</div>';
  }
  function openDetail(id){
    if(!find(id))return;
    state.selected=id;state.size="14";state.qty=1;state.sweet="normal";state.checks=new Set();renderDetail();if(!modal.open)modal.showModal();modal.scrollTop=0;
  }
  async function copyDetail(){
    const t=clipboardText(find(state.selected));
    try{await navigator.clipboard.writeText(t);notify("Resep disalin")}
    catch(e){const ta=document.createElement("textarea");ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");notify("Resep disalin")}catch(e2){notify("Tidak dapat menyalin di browser ini")}ta.remove()}
  }
  function toggleFav(id){
    if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);
    saveFav();notify(state.favorites.has(id)?"Ditambahkan ke favorit":"Dihapus dari favorit");
    if(modal.open&&state.selected===id)renderDetail();
    renderResults();
  }
  document.body.addEventListener("click",e=>{
    const nav=e.target.closest("[data-nav]");if(nav){go(nav.dataset.nav);return}
    const fav=e.target.closest("[data-fav]");if(fav){e.stopPropagation();toggleFav(fav.dataset.fav);return}
    const card=e.target.closest("[data-open]");if(card){openDetail(card.dataset.open);return}
    const filter=e.target.closest("[data-filter]");
    if(filter){state.filter=filter.dataset.filter;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("is-active",x.dataset.filter===state.filter));renderResults();return}
    if(e.target.closest("[data-clear]")){state.q="";let inp=document.getElementById("search-menu");if(inp){inp.value="";inp.focus()}renderResults();return}
    const close=e.target.closest("[data-close]");if(close){(close.dataset.close==="recipe"?modal:help).close();return}
    if(e.target.closest("[data-qty]")){state.qty=Math.max(1,Math.min(20,state.qty+Number(e.target.closest("[data-qty]").dataset.qty)));state.checks=new Set();renderDetail();return}
    if(e.target.closest("[data-toggle-fav]")){toggleFav(state.selected);return}
    if(e.target.closest("[data-copy]")){copyDetail();return}
    if(e.target.closest("[data-print]")){window.print();return}
    if(e.target.closest("[data-reset]")){state.checks=new Set();renderDetail();return}
    if(e.target.closest("#help-button")){help.showModal();return}
  });
  document.body.addEventListener("input",e=>{if(e.target.id==="search-menu"){state.q=e.target.value;renderResults()}});
  document.body.addEventListener("change",e=>{
    if(e.target.id==="cup-select"){state.size=e.target.value;state.checks=new Set();renderDetail()}
    if(e.target.id==="sweet-select"){state.sweet=e.target.value;state.checks=new Set();renderDetail()}
    if(e.target.matches("[data-step]")){
      const i=Number(e.target.dataset.step);
      if(e.target.checked)state.checks.add(i);else state.checks.delete(i);
      e.target.closest(".step").classList.toggle("done",e.target.checked);
      document.getElementById("step-progress").textContent=state.checks.size+"/"+stepsFor(find(state.selected)).length;
      if(state.checks.size===stepsFor(find(state.selected)).length)notify("Semua langkah dicentang. Lakukan QC sebelum kirim.");
    }
  });
  document.body.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&modal.open){modal.close();return}
    if((e.key==="Enter"||e.key===" ")&&e.target.matches(".card")){e.preventDefault();openDetail(e.target.dataset.open)}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();if(modal.open)modal.close();go("menu");document.getElementById("search-menu")?.focus()}
  });
  modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});
  help.addEventListener("click",e=>{if(e.target===help)help.close()});
  renderPage();
  if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }
})();