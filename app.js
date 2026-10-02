const WA="51936062268";
const labels={guantes:"Guantes",cateteres:"Catéteres",gasas:"Gasas y apósitos",soluciones:"Soluciones",infusion:"Infusión"};
const products=[
 {cat:"guantes",name:"Guantes de látex ALKHOFAR",desc:"Guantes de examen, ambidiestros y de un solo uso.",img:"guantes.png",info:"Tallas XS, S, M y L"},
 {cat:"cateteres",name:"Catéter NIPRO 20G",desc:"Catéter intravenoso para acceso vascular.",img:"cateter.png",info:"20G · Consultar stock"},
 {cat:"soluciones",name:"Cloruro de Sodio 0.9%",desc:"Solución inyectable por vía intravenosa.",img:"soluciones.png",info:"100, 250 y 500 mL"},
 {cat:"gasas",name:"Gasa estéril ALKHOFAR",desc:"Gasa absorbente para uso clínico.",img:"gasas.png",info:"Consultar presentaciones"},
 {cat:"infusion",name:"Equipo de Volutrol y Venoclisis",desc:"Equipo para administración de soluciones.",img:"volutrol.png",info:"Consultar disponibilidad"},
 {cat:"gasas",name:"Gasas y apósitos",desc:"Opciones para diferentes necesidades clínicas.",img:"gasas.png",info:"Varias presentaciones"}
];
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const productsEl=$("#products"), search=$("#search"), sortEl=$("#sort"), bar=$("#quoteBar");
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=t=>t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
let current="todos", quote=new Map();
try{quote=new Map(JSON.parse(localStorage.getItem("bs-quote")||"[]").filter(([i])=>products[i]))}catch(e){}

/* Toast */
let toastT;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2200)}

/* Catálogo */
function render(){
 const q=norm(search.value.trim());
 let list=products.map((p,i)=>({...p,i})).filter(p=>(current==="todos"||p.cat===current)&&norm(p.name+" "+p.desc+" "+p.info+" "+labels[p.cat]).includes(q));
 if(sortEl.value==="az")list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
 if(sortEl.value==="cat")list.sort((a,b)=>labels[a.cat].localeCompare(labels[b.cat],"es"));
 $("#count").textContent=list.length+(list.length===1?" producto":" productos");
 productsEl.innerHTML=list.map((p,n)=>{const on=quote.has(p.i);return `
 <article class="product reveal show" style="--i:${n}">
  <div class="product-img" data-open="${p.i}"><img loading="lazy" src="${p.img}" alt="${esc(p.name)}"><span class="product-badge">BioSupply</span></div>
  <div class="product-body"><span class="tag">${labels[p.cat]}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><small>${esc(p.info)}</small>
  <div class="product-actions">
   <button class="add ${on?"on":""}" data-add="${p.i}" aria-pressed="${on}">${on?"✓ En tu cotización":"+ Agregar a cotización"}</button>
   <button class="more" data-open="${p.i}">Ver detalle</button>
  </div></div>
 </article>`}).join("")||`<p class="empty">No encontramos ese producto. <a href="${wa("Hola BioSupply Perú, busco: "+search.value)}" target="_blank" rel="noopener">Pregúntanos por WhatsApp</a></p>`;
}

/* Cotización */
function toggleItem(i){
 if(quote.has(i)){quote.delete(i);toast("Quitado de tu cotización")}
 else{quote.set(i,1);toast("Agregado a tu cotización")}
 sync();
}
function sync(){
 const total=[...quote.values()].reduce((a,b)=>a+b,0);
 bar.classList.toggle("show",quote.size>0);
 $("#quoteCount").textContent=total+(total===1?" unidad":" unidades");
 const lines=[...quote].map(([i,n])=>`• ${products[i].name} x${n}`);
 $("#quoteSend").href=wa("Hola BioSupply Perú, quiero cotizar:\n"+lines.join("\n"));
 $("#drawerList").innerHTML=quote.size?[...quote].map(([i,n])=>`
  <div class="q-item"><img src="${products[i].img}" alt=""><b>${esc(products[i].name)}</b>
  <div class="qty"><button data-dec="${i}" aria-label="Menos">−</button><span>${n}</span><button data-inc="${i}" aria-label="Más">+</button></div>
  <button class="more" data-del="${i}" aria-label="Quitar">✕</button></div>`).join(""):'<p class="q-empty">Tu lista está vacía.<br>Agrega productos desde el catálogo.</p>';
 try{localStorage.setItem("bs-quote",JSON.stringify([...quote]))}catch(e){}
 render();
 if(!quote.size&&$("#drawer").open)$("#drawer").close();
}
$("#drawerList").addEventListener("click",e=>{
 const g=k=>e.target.closest(`[data-${k}]`)?.dataset[k];
 const inc=g("inc"),dec=g("dec"),del=g("del");
 if(inc!=null)quote.set(+inc,Math.min(999,quote.get(+inc)+1));
 else if(dec!=null)quote.set(+dec,Math.max(1,quote.get(+dec)-1));
 else if(del!=null)quote.delete(+del);
 else return;
 sync();
});
$("#quoteClear").addEventListener("click",()=>{quote.clear();sync();toast("Lista vaciada")});
$("#quoteOpen").addEventListener("click",()=>$("#drawer").showModal());

/* Modal de detalle */
function openModal(i){
 const p=products[i],on=quote.has(i);
 $("#modalBody").innerHTML=`<div class="m-grid"><img src="${p.img}" alt="${esc(p.name)}"><div class="m-info">
  <span class="tag">${labels[p.cat]}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><small>${esc(p.info)}</small>
  <button class="add ${on?"on":""}" data-add="${i}" data-modal>${on?"✓ En tu cotización":"+ Agregar a cotización"}</button>
  <a class="btn secondary" href="${wa("Hola BioSupply Perú, quiero cotizar: "+p.name)}" target="_blank" rel="noopener">Consultar por WhatsApp</a></div></div>`;
 $("#modal").showModal();
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]"),open=e.target.closest("[data-open]");
 if(add){
  const i=+add.dataset.add;toggleItem(i);
  if(add.hasAttribute("data-modal"))openModal(i);
  else productsEl.querySelector(`[data-add="${i}"]`)?.focus({preventScroll:true});
 }else if(open&&e.target.closest("#products"))openModal(+open.dataset.open);
 if(e.target.closest("[data-close]"))e.target.closest("dialog").close();
 if(e.target.tagName==="DIALOG")e.target.close();
});

/* Filtros, búsqueda y orden */
function setCat(cat,scroll){
 current=cat;
 $$(".filter,.category").forEach(x=>x.classList.toggle("active",x.dataset.cat===cat));
 if(scroll)$("#catalogo").scrollIntoView({behavior:"smooth"});
 render();
}
$$(".filter").forEach(b=>b.addEventListener("click",()=>setCat(b.dataset.cat,false)));
$$(".category").forEach(b=>b.addEventListener("click",()=>setCat(b.dataset.cat,true)));
let st;search.addEventListener("input",()=>{clearTimeout(st);st=setTimeout(render,120)});
sortEl.addEventListener("change",render);

/* Menú móvil */
const nav=$("#navLinks"), burger=$("#hamburger");
const toggleNav=o=>{nav.classList.toggle("open",o);const k=nav.classList.contains("open");burger.setAttribute("aria-expanded",k);burger.textContent=k?"✕":"☰"};
burger.addEventListener("click",()=>toggleNav());
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggleNav(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape")toggleNav(false)});

/* Animaciones de entrada */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

const counter=$(".counter");
const co=new IntersectionObserver(es=>{
 if(es[0].isIntersecting){let n=0;const t=+counter.dataset.target;const id=setInterval(()=>{counter.textContent=++n;if(n>=t)clearInterval(id)},160);co.disconnect()}
});
co.observe(counter);

/* Enlace activo */
const links=[...nav.querySelectorAll("a")];
const spy=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section[id]").forEach(s=>spy.observe(s));

/* Scroll: header, progreso, volver arriba */
const header=$("#header"),prog=$("#progress"),top=$("#toTop");
let tick=false;
function onScroll(){
 const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
 header.classList.toggle("scrolled",y>20);
 prog.style.transform=`scaleX(${max>0?y/max:0})`;
 top.classList.toggle("show",y>700);
 tick=false;
}
addEventListener("scroll",()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});
top.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

sync();onScroll();
