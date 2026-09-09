const menu=document.getElementById("mobileMenu");
const toggle=document.getElementById("menuToggle");
const openMenu=()=>{menu?.classList.add("open");menu?.setAttribute("aria-hidden","false");toggle?.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"};
const closeMenu=()=>{menu?.classList.remove("open");menu?.setAttribute("aria-hidden","true");toggle?.setAttribute("aria-expanded","false");document.body.style.overflow=""};
toggle?.addEventListener("click",openMenu);
document.querySelectorAll("[data-menu-close]").forEach(el=>el.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

const lang=(document.documentElement.lang||"en").toLowerCase();
const locale=lang.startsWith("pt")?"pt":lang.startsWith("es")?"es":"en";
const siteRoot=document.documentElement.dataset.siteRoot||"./";
const ui={en:{show:"Show",view:"View",slide:"slide",of:"of"},es:{show:"Mostrar",view:"Ver",slide:"diapositiva",of:"de"},pt:{show:"Mostrar",view:"Ver",slide:"slide",of:"de"}}[locale];
const category=(en,es,pt)=>({en,es,pt}[locale]);

const carouselProducts=[
{name:"Retatrutida",slug:"retatrutida",sku:"RT5",dose:"5 mg",category:category("Multi-receptor peptide agonist","Agonista peptídico multirreceptor","Agonista peptídico multirreceptor"),image:"retatrutida-approved.webp"},
{name:"Tirzepatida",slug:"tirzepatida",sku:"TR5",dose:"5 mg",category:category("Synthetic reference peptide","Péptido sintético de referencia","Peptídeo sintético de referência"),image:"tirzepatida-approved.webp"},
{name:"Semaglutida",slug:"semaglutida",sku:"SM5",dose:"5 mg",category:category("Cataloged peptide analogue","Análogo peptídico catalogado","Análogo peptídico catalogado")},
{name:"BPC-157",slug:"bpc-157",sku:"BC5",dose:"5 mg",category:category("Synthetic pentadecapeptide","Pentadecapéptido sintético","Pentadecapeptídeo sintético"),image:"bpc-157-approved.webp"},
{name:"TB-500",slug:"tb-500",sku:"TB5",dose:"5 mg",category:category("Reference peptide fragment","Fragmento peptídico de referencia","Fragmento peptídico de referência")},
{name:"GHK-Cu",slug:"ghk-cu",sku:"CU50",dose:"50 mg",category:category("Copper tripeptide","Tripéptido de cobre","Tripeptídeo de cobre")},
{name:"CJC-1295 + Ipamorelina",label:"CJC-1295 + IPA",slug:"cjc-1295-ipamorelina",sku:"CP10",dose:"10 mg",category:category("Cataloged peptide blend","Mezcla peptídica catalogada","Blend peptídico catalogado")},
{name:"Tesamorelina",slug:"tesamorelina",sku:"TSM10",dose:"10 mg",category:category("GHRH peptide analogue","Análogo peptídico de GHRH","Análogo peptídico de GHRH"),image:"tesamorelina-approved-v2.webp"},
{name:"Ipamorelina",slug:"ipamorelina",sku:"IP5",dose:"5 mg",category:category("Synthetic pentapeptide","Pentapéptido sintético","Pentapeptídeo sintético")},
{name:"AOD-9604",slug:"aod-9604",sku:"5AD",dose:"5 mg",category:category("Cataloged peptide fragment","Fragmento peptídico catalogado","Fragmento peptídico catalogado")},
{name:"MOTS-c",slug:"mots-c",sku:"MS10",dose:"10 mg",category:category("Mitochondrial peptide","Péptido mitocondrial","Peptídeo mitocondrial"),image:"mots-c-approved.webp"},
{name:"PT-141 (bremelanotida)",label:"PT-141",slug:"pt-141-bremelanotida",sku:"P41",dose:"10 mg",category:category("Cyclic synthetic peptide","Péptido sintético cíclico","Peptídeo sintético cíclico")},
{name:"Melanotan II (MT-2)",label:"Melanotan II",slug:"melanotan-ii-mt-2",sku:"ML10",dose:"10 mg",category:category("Cyclic heptapeptide","Heptapéptido cíclico","Heptapeptídeo cíclico")},
{name:"Epitalon",slug:"epitalon",sku:"ET10",dose:"10 mg",category:category("Synthetic tetrapeptide","Tetrapéptido sintético","Tetrapeptídeo sintético")},
{name:"Semax",slug:"semax",sku:"XA11",dose:"11 mg",category:category("Synthetic heptapeptide","Heptapéptido sintético","Heptapeptídeo sintético")}
];

const carousel=document.getElementById("heroCarousel");
if(carousel){
 const slide=document.getElementById("carouselSlide"),image=document.getElementById("carouselImage"),name=document.getElementById("carouselName"),categoryEl=document.getElementById("carouselCategory"),dose=document.getElementById("carouselDose"),current=document.getElementById("carouselCurrent"),status=document.getElementById("carouselStatus"),dots=document.getElementById("carouselDots");
 const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const escapeSvg=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
 const vialPlaceholder=product=>{
  const label=escapeSvg(product.label||product.name),fontSize=label.length>17?15:label.length>12?17:20;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520"><defs><linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#20dfff"/><stop offset=".68" stop-color="#20dfff"/><stop offset="1" stop-color="#ff2aa8"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dce6ef"/><stop offset=".18" stop-color="#fff"/><stop offset=".82" stop-color="#fff"/><stop offset="1" stop-color="#cbd8e4"/></linearGradient></defs><ellipse cx="210" cy="474" rx="95" ry="13" fill="#000" opacity=".16"/><rect x="135" y="42" width="150" height="50" rx="15" fill="#c9d0d8"/><rect x="146" y="82" width="128" height="27" rx="7" fill="#202020"/><path d="M151 103h118l16 31v258c0 24-17 41-40 41h-70c-23 0-40-17-40-41V134z" fill="url(#glass)" stroke="#aebdca" stroke-width="3"/><rect x="141" y="190" width="138" height="188" rx="6" fill="#fff"/><rect x="141" y="190" width="138" height="16" fill="url(#band)"/><rect x="141" y="257" width="138" height="70" fill="url(#band)"/><text x="210" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="24" fill="#111">PepMAX</text><text x="210" y="299" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="${fontSize}" fill="#fff">${label}</text><text x="210" y="352" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="21" fill="#20dfff">${escapeSvg(product.dose)}</text><text x="210" y="399" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#333">FOR RESEARCH USE ONLY</text></svg>`;
  return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
 };
 let index=0,timer,touchStart=0;
 dots.innerHTML=carouselProducts.map((product,position)=>`<button type="button" aria-label="${ui.show} ${product.name}" data-carousel-index="${position}"></button>`).join("");
 const dotButtons=[...dots.querySelectorAll("button")];
 const render=()=>{const product=carouselProducts[index],ordinal=String(index+1).padStart(2,"0");slide.href=`${siteRoot}peptides/${product.slug}/?sku=${encodeURIComponent(product.sku)}`;slide.setAttribute("aria-label",`${ui.view} ${product.name}, ${product.dose}`);image.src=product.image?`${siteRoot}peptides/assets/images/${product.image}`:vialPlaceholder(product);image.alt=`PepMAX ${product.name} vial, ${product.dose}`;image.className=`carousel-vial${product.image?" final-vial":" generated-vial"}`;name.textContent=product.name;categoryEl.textContent=product.category;dose.textContent=product.dose;current.textContent=ordinal;carousel.querySelector(".carousel-rank").textContent=ordinal;status.textContent=`${product.name}, ${ui.slide} ${index+1} ${ui.of} ${carouselProducts.length}`;dotButtons.forEach((button,position)=>{button.classList.toggle("active",position===index);button.setAttribute("aria-current",position===index?"true":"false")})};
 const show=next=>{index=(next+carouselProducts.length)%carouselProducts.length;if(reducedMotion){render();return}slide.classList.add("is-changing");window.setTimeout(()=>{render();slide.classList.remove("is-changing")},150)};
 const restart=()=>{window.clearInterval(timer);if(!reducedMotion)timer=window.setInterval(()=>show(index+1),5600)};
 document.getElementById("carouselPrev")?.addEventListener("click",()=>{show(index-1);restart()});document.getElementById("carouselNext")?.addEventListener("click",()=>{show(index+1);restart()});dotButtons.forEach((button,position)=>button.addEventListener("click",()=>{show(position);restart()}));carousel.addEventListener("mouseenter",()=>window.clearInterval(timer));carousel.addEventListener("mouseleave",restart);carousel.addEventListener("focusin",()=>window.clearInterval(timer));carousel.addEventListener("focusout",event=>{if(!carousel.contains(event.relatedTarget))restart()});carousel.addEventListener("keydown",event=>{if(event.key==="ArrowLeft"){event.preventDefault();show(index-1);restart()}if(event.key==="ArrowRight"){event.preventDefault();show(index+1);restart()}});carousel.addEventListener("touchstart",event=>{touchStart=event.changedTouches[0].clientX},{passive:true});carousel.addEventListener("touchend",event=>{const distance=event.changedTouches[0].clientX-touchStart;if(Math.abs(distance)>45){show(index+(distance<0?1:-1));restart()}},{passive:true});render();restart();
}
try{const cart=JSON.parse(localStorage.getItem("pepmax-cart-v1")||"{}");const count=Object.values(cart).reduce((sum,value)=>sum+(Math.max(0,Math.floor(Number(value)))||0),0);const countEl=document.getElementById("cartCount");if(countEl)countEl.textContent=count}catch(_){const countEl=document.getElementById("cartCount");if(countEl)countEl.textContent="0"}
