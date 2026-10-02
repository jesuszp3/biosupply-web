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
const productsEl=$("#products"), search=$("#search"), bar=$("#quoteBar");
const esc=t=>t.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=t=>t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const quote=new Set();
let current="todos";

function render(){
 const q=norm(search.value.trim());
 const list=products.map((p,i)=>({...p,i})).filter(p=>(current==="todos"||p.cat===current)&&norm(p.name+" "+p.desc+" "+p.info+" "+labels[p.cat]).includes(q));
 productsEl.innerHTML=list.map((p,n)=>`
 <article class="product reveal show" style="--i:${n}">
  <div class="product-img"><img loading="lazy" src="${p.img}" alt="${esc(p.name)}"><span class="product-badge">BioSupply</span></div>
  <div class="product-body"><span class="tag">${labels[p.cat]}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><small>${esc(p.info)}</small>
  <div class="product-actions">
   <button class="add ${quote.has(p.i)?"on":""}" data-i="${p.i}" aria-pressed="${quote.has(p.i)}">${quote.has(p.i)?"✓ En tu cotización":"+ Agregar a cotización"}</button>
   <a class="quote" href="https://wa.me/${WA}?text=${encodeURIComponent("Hola BioSupply Perú, quiero cotizar: "+p.name)}" target="_blank" rel="noopener">Consultar</a>
  </div></div>
 </article>`).join("")||`<p class="empty">No encontramos ese producto. <a href="https://wa.me/${WA}?text=${encodeURIComponent("Hola BioSupply Perú, busco: "+search.value)}" target="_blank" rel="noopener">Pregúntanos por WhatsApp</a></p>`;
}

function updateBar(){
 const items=[...quote].map(i=>"• "+products[i].name);
 bar.classList.toggle("show",quote.size>0);
 $("#quoteCount").textContent=quote.size+(quote.size===1?" producto":" productos");
 $("#quoteSend").href=`https://wa.me/${WA}?text=`+encodeURIComponent("Hola BioSupply Perú, quiero cotizar:\n"+items.join("\n"));
}
productsEl.addEventListener("click",e=>{
 const b=e.target.closest(".add"); if(!b)return;
 const i=+b.dataset.i; quote.has(i)?quote.delete(i):quote.add(i);
 render(); updateBar();
 const again=productsEl.querySelector(`.add[data-i="${i}"]`); if(again)again.focus({preventScroll:true});
});
$("#quoteClear").addEventListener("click",()=>{quote.clear();render();updateBar()});

function setCat(cat,scroll){
 current=cat;
 $$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.cat===cat));
 $$(".category").forEach(x=>x.classList.toggle("active",x.dataset.cat===cat));
 if(scroll)$("#catalogo").scrollIntoView({behavior:"smooth"});
 render();
}
$$(".filter").forEach(b=>b.addEventListener("click",()=>setCat(b.dataset.cat,false)));
$$(".category").forEach(b=>b.addEventListener("click",()=>setCat(b.dataset.cat,true)));
search.addEventListener("input",render);

const nav=$("#navLinks"), burger=$("#hamburger");
const toggleNav=open=>{nav.classList.toggle("open",open);burger.setAttribute("aria-expanded",nav.classList.contains("open"));burger.textContent=nav.classList.contains("open")?"✕":"☰"};
burger.addEventListener("click",()=>toggleNav());
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggleNav(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape")toggleNav(false)});

const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

const counter=$(".counter");
const counterObs=new IntersectionObserver(es=>{
 if(es[0].isIntersecting){
  let n=0;const t=+counter.dataset.target;
  const timer=setInterval(()=>{counter.textContent=++n;if(n>=t)clearInterval(timer)},160);
  counterObs.disconnect();
 }
});
counterObs.observe(counter);

// Enlace activo según la sección visible
const links=[...nav.querySelectorAll("a")];
const spy=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section[id]").forEach(s=>spy.observe(s));

const header=$("#header");
addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>20),{passive:true});
render();
