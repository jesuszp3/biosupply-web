const products=[
{id:1,cat:'Soluciones',name:'Cloruro de Sodio 0.9% – 100 ml',desc:'Solución inyectable. Presentación de 100 ml.',price:'Consultar',img:'cloruro-sodio.jpg'},
{id:2,cat:'Soluciones',name:'Cloruro de Sodio 0.9% – 250 ml',desc:'Solución inyectable. Presentación de 250 ml.',price:'Consultar',img:'cloruro-sodio.jpg'},
{id:3,cat:'Soluciones',name:'Cloruro de Sodio 0.9% – 500 ml',desc:'Solución inyectable. Presentación de 500 ml.',price:'Consultar',img:'cloruro-sodio.jpg'},
{id:4,cat:'Jeringas',name:'BD Ultra-Fine 0.5 ml – 30G x 6 mm',desc:'Jeringa para insulina. Aguja 30G, 6 mm.',price:'Consultar',img:'jeringa-bd-ultra-fine.jpg'},
{id:5,cat:'Alcoholes',name:'Alcohol Medicinal Alkofarma 70° – 1000 ml',desc:'Solución para uso externo. Presentación de 1000 ml.',price:'Consultar',img:'alcoholes-alkofarma.jpg'},
{id:6,cat:'Alcoholes',name:'Alcohol Puro Alkofarma 96° – 1000 ml',desc:'Solución para uso externo. Presentación de 1000 ml.',price:'Consultar',img:'alcoholes-alkofarma.jpg'}];
let cart=JSON.parse(localStorage.getItem('biosupply-cart')||'[]');
const grid=document.getElementById('productGrid');
function render(filter='Todos',term=''){let list=products.filter(p=>(filter==='Todos'||p.cat===filter)&&p.name.toLowerCase().includes(term.toLowerCase()));grid.innerHTML=list.map(p=>`<article class="card"><img src="${p.img}" alt="${p.name}"><div class="card-info"><span class="tag">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${p.price}</div><button class="add" onclick="add(${p.id})">🛒 Agregar</button></div></article>`).join('')||'<p>No encontramos productos.</p>'}
function add(id){const p=products.find(x=>x.id===id),e=cart.find(x=>x.id===id);e?e.qty++:cart.push({...p,qty:1});save();openCart()}
function save(){localStorage.setItem('biosupply-cart',JSON.stringify(cart));renderCart()}
function renderCart(){document.getElementById('cartCount').textContent=cart.reduce((a,p)=>a+p.qty,0);const b=document.getElementById('cartItems');b.innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><b>${p.name}</b><br>Cantidad: ${p.qty}<button onclick="removeItem(${p.id})">Eliminar</button></div>`).join(''):'<p class="empty">Todavía no agregaste productos.</p>'}
function removeItem(id){cart=cart.filter(p=>p.id!==id);save()}
function openCart(){document.getElementById('cartPanel').classList.add('open');document.getElementById('overlay').classList.add('show')}
function closeCart(){document.getElementById('cartPanel').classList.remove('open');document.getElementById('overlay').classList.remove('show')}
function whatsapp(){if(!cart.length)return alert('Agrega productos al pedido.');const text=encodeURIComponent('Hola BioSupply, quiero consultar por:\n'+cart.map(p=>`• ${p.name} x${p.qty}`).join('\n'));window.open('https://wa.me/51999999999?text='+text,'_blank')}
document.querySelectorAll('.category-grid button').forEach(b=>b.onclick=()=>{render(b.dataset.filter);document.getElementById('productos').scrollIntoView({behavior:'smooth'})});
document.getElementById('search').oninput=e=>render('Todos',e.target.value);
document.getElementById('allBtn').onclick=()=>render();
document.getElementById('cartBtn').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
document.getElementById('overlay').onclick=closeCart;
document.getElementById('orderWhatsapp').onclick=whatsapp;
document.getElementById('contactWhatsapp').onclick=e=>{e.preventDefault();window.open('https://wa.me/51999999999','_blank')};
document.getElementById('menuBtn').onclick=()=>document.getElementById('nav').classList.toggle('open');
document.getElementById('year').textContent=new Date().getFullYear();
render();renderCart();