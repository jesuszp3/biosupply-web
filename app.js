
const products=[
 {cat:"guantes",name:"Guantes de látex ALKHOFAR",desc:"Guantes de examen, ambidiestros y de un solo uso.",img:"guantes.png",info:"Tallas XS, S, M y L"},
 {cat:"cateteres",name:"Catéter NIPRO 20G",desc:"Catéter intravenoso para acceso vascular.",img:"cateter.png",info:"20G · Consultar stock"},
 {cat:"soluciones",name:"Cloruro de Sodio 0.9%",desc:"Solución inyectable por vía intravenosa.",img:"soluciones.png",info:"100, 250 y 500 mL"},
 {cat:"gasas",name:"Gasa estéril ALKHOFAR",desc:"Gasa absorbente para uso clínico.",img:"gasas.png",info:"Consultar presentaciones"},
 {cat:"infusion",name:"Equipo de Volutrol y Venoclisis",desc:"Equipo para administración de soluciones.",img:"volutrol.png",info:"Consultar disponibilidad"},
 {cat:"gasas",name:"Gasas y apósitos",desc:"Opciones para diferentes necesidades clínicas.",img:"gasas.png",info:"Varias presentaciones"}
];

const productsEl=document.getElementById("products"), search=document.getElementById("search");
let current="todos";

function render(){
 const q=search.value.toLowerCase().trim();
 const list=products.filter(p=>(current==="todos"||p.cat===current)&&(p.name+" "+p.desc+" "+p.info).toLowerCase().includes(q));
 productsEl.innerHTML=list.map((p,i)=>`
 <article class="product reveal show" style="--i:${i}">
  <div class="product-img"><img src="${p.img}" alt="${p.name}"><span class="product-badge">BioSupply</span></div>
  <div class="product-body"><span class="tag">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><small>${p.info}</small>
  <a class="quote" href="https://wa.me/51936062268?text=${encodeURIComponent("Hola BioSupply Perú, quiero cotizar: "+p.name)}" target="_blank">Consultar por WhatsApp →</a></div>
 </article>`).join("")||'<p class="empty">No encontramos ese producto.</p>';
}

document.querySelectorAll(".filter,.category").forEach(btn=>btn.addEventListener("click",()=>{
 current=btn.dataset.cat;
 document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.cat===current));
 document.getElementById("catalogo").scrollIntoView({behavior:"smooth"});
 render();
}));
search.addEventListener("input",render);

document.getElementById("hamburger").addEventListener("click",()=>{
 document.getElementById("navLinks").classList.toggle("open");
});

const observer=new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const counter=document.querySelector(".counter");
const counterObs=new IntersectionObserver(entries=>{
 if(entries[0].isIntersecting){
  let n=0,target=+counter.dataset.target;
  const timer=setInterval(()=>{n++;counter.textContent=n;if(n>=target)clearInterval(timer)},160);
  counterObs.disconnect();
 }
});
counterObs.observe(counter);

window.addEventListener("scroll",()=>{
 document.getElementById("header").classList.toggle("scrolled",window.scrollY>20);
});
render();
