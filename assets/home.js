const premiumStyle=document.createElement("link");
premiumStyle.rel="stylesheet";
premiumStyle.href=`${document.documentElement.dataset.siteRoot||"./"}assets/home-premium.css?v=20260908-premium1`;
document.head.appendChild(premiumStyle);

const menu=document.getElementById("mobileMenu");
const toggle=document.getElementById("menuToggle");
const openMenu=()=>{menu.classList.add("open");menu.setAttribute("aria-hidden","false");toggle.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"};
const closeMenu=()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow=""};
toggle?.addEventListener("click",openMenu);
document.querySelectorAll("[data-menu-close]").forEach(el=>el.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

const locale=(document.documentElement.lang||"es").toLowerCase().startsWith("pt")?"pt":(document.documentElement.lang||"es").toLowerCase().startsWith("en")?"en":"es";
const siteRoot=document.documentElement.dataset.siteRoot||"./";
const ui={
  es:{show:"Mostrar",view:"Ver",slide:"diapositiva",of:"de"},
  pt:{show:"Mostrar",view:"Ver",slide:"slide",of:"de"},
  en:{show:"Show",view:"View",slide:"slide",of:"of"}
}[locale];
const category=(es,pt,en)=>({es,pt,en}[locale]);

const carouselProducts=[
  {name:"Retatrutida",slug:"retatrutida",sku:"RT5",dose:"5 mg",category:category("Agonista peptídico multirreceptor","Agonista peptídico multirreceptor","Multi-receptor peptide agonist"),image:"retatrutida-approved.webp"},
  {name:"Tirzepatida",slug:"tirzepatida",sku:"TR5",dose:"5 mg",category:category("Péptido sintético de referencia","Peptídeo sintético de referência","Synthetic reference peptide"),image:"tirzepatida-approved.webp"},
  {name:"Semaglutida",slug:"semaglutida",sku:"SM5",dose:"5 mg",category:category("Análogo peptídico catalogado","Análogo peptídico catalogado","Cataloged peptide analogue")},
  {name:"BPC-157",slug:"bpc-157",sku:"BC5",dose:"5 mg",category:category("Pentadecapéptido sintético","Pentadecapeptídeo sintético","Synthetic pentadecapeptide"),image:"bpc-157-approved.webp"},
  {name:"TB-500",slug:"tb-500",sku:"TB5",dose:"5 mg",category:category("Fragmento peptídico de referencia","Fragmento peptídico de referência","Reference peptide fragment")},
  {name:"GHK-Cu",slug:"ghk-cu",sku:"CU50",dose:"50 mg",category:category("Tripéptido de cobre","Tripeptídeo de cobre","Copper tripeptide")},
  {name:"CJC-1295 + Ipamorelina",label:"CJC-1295 + IPA",slug:"cjc-1295-ipamorelina",sku:"CP10",dose:"10 mg",category:category("Mezcla peptídica catalogada","Blend peptídico catalogado","Cataloged peptide blend")},
  {name:"Tesamorelina",slug:"tesamorelina",sku:"TSM10",dose:"10 mg",category:category("Análogo peptídico de GHRH","Análogo peptídico de GHRH","GHRH peptide analogue"),image:"tesamorelina-approved-v2.webp"},
  {name:"Ipamorelina",slug:"ipamorelina",sku:"IP5",dose:"5 mg",category:category("Pentapéptido sintético","Pentapeptídeo sintético","Synthetic pentapeptide")},
  {name:"AOD-9604",slug:"aod-9604",sku:"5AD",dose:"5 mg",category:category("Fragmento peptídico catalogado","Fragmento peptídico catalogado","Cataloged peptide fragment")},
  {name:"MOTS-c",slug:"mots-c",sku:"MS10",dose:"10 mg",category:category("Péptido mitocondrial","Peptídeo mitocondrial","Mitochondrial peptide"),image:"mots-c-approved.webp"},
  {name:"PT-141 (bremelanotida)",label:"PT-141",slug:"pt-141-bremelanotida",sku:"P41",dose:"10 mg",category:category("Péptido sintético cíclico","Peptídeo sintético cíclico","Cyclic synthetic peptide")},
  {name:"Melanotan II (MT-2)",label:"Melanotan II",slug:"melanotan-ii-mt-2",sku:"ML10",dose:"10 mg",category:category("Heptapéptido cíclico","Heptapeptídeo cíclico","Cyclic heptapeptide")},
  {name:"Epitalon",slug:"epitalon",sku:"ET10",dose:"10 mg",category:category("Tetrapéptido sintético","Tetrapeptídeo sintético","Synthetic tetrapeptide")},
  {name:"Semax",slug:"semax",sku:"XA11",dose:"11 mg",category:category("Heptapéptido sintético","Heptapeptídeo sintético","Synthetic heptapeptide")}
];

const carousel=document.getElementById("heroCarousel");
if(carousel){
  const slide=document.getElementById("carouselSlide");
  const image=document.getElementById("carouselImage");
  const name=document.getElementById("carouselName");
  const categoryEl=document.getElementById("carouselCategory");
  const dose=document.getElementById("carouselDose");
  const current=document.getElementById("carouselCurrent");
  const status=document.getElementById("carouselStatus");
  const dots=document.getElementById("carouselDots");
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escapeSvg=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const doseColors={"5 mg":"#ff2aa8","10 mg":"#55ff55","11 mg":"#ff67c4","50 mg":"#9dff9d"};
  const vialPlaceholder=product=>{
    const label=escapeSvg(product.label||product.name);
    const fontSize=label.length>17?15:label.length>12?17:20;
    const color=doseColors[product.dose]||"#ff2aa8";
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff2aa8"/><stop offset=".52" stop-color="#c92dff"/><stop offset="1" stop-color="#55ff55"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dce6ef"/><stop offset=".18" stop-color="#fff"/><stop offset=".82" stop-color="#fff"/><stop offset="1" stop-color="#cbd8e4"/></linearGradient></defs><g transform="translate(41.08503 -18.2) scale(.804357 1.07)"><ellipse cx="210" cy="474" rx="120" ry="18" fill="#000" opacity=".22"/><rect x="118" y="46" width="184" height="58" rx="17" fill="#c9d0d8"/><rect x="132" y="92" width="156" height="32" rx="8" fill="#202020"/><path d="M143 116h134l18 36v281c0 25-18 43-43 43h-84c-25 0-43-18-43-43V152z" fill="url(#glass)" stroke="#aebdca" stroke-width="4"/><rect x="130" y="204" width="160" height="205" rx="7" fill="#fff"/><rect x="130" y="204" width="160" height="18" fill="url(#g)"/><rect x="130" y="278" width="160" height="76" fill="url(#g)"/><text x="210" y="258" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="26" fill="#111">PepMAX</text><text x="210" y="317" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="${fontSize}" fill="#fff">${label}</text><text x="210" y="387" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="24" fill="${color}">${escapeSvg(product.dose)}</text><text x="210" y="427" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#333">FOR RESEARCH USE ONLY</text></g></svg>`;
    return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
  };
  let index=0;
  let timer;
  let touchStart=0;
  dots.innerHTML=carouselProducts.map((product,position)=>`<button type="button" aria-label="${ui.show} ${product.name}" data-carousel-index="${position}"></button>`).join("");
  const dotButtons=[...dots.querySelectorAll("button")];
  const restart=()=>{window.clearInterval(timer);if(!reducedMotion)timer=window.setInterval(()=>show(index+1),5200)};
  const render=()=>{
    const product=carouselProducts[index];
    const ordinal=String(index+1).padStart(2,"0");
    slide.href=`${siteRoot}peptides/${product.slug}/?sku=${encodeURIComponent(product.sku)}`;
    slide.setAttribute("aria-label",`${ui.view} ${product.name}, ${product.dose}`);
    image.src=product.image?`${siteRoot}peptides/assets/images/${product.image}`:vialPlaceholder(product);
    image.alt=`Vial PepMax ${product.name}, ${product.dose}`;
    image.className=`carousel-vial${product.image?" final-vial":" generated-vial"}`;
    name.textContent=product.name;
    categoryEl.textContent=product.category;
    dose.textContent=product.dose;
    current.textContent=ordinal;
    carousel.querySelector(".carousel-rank").textContent=ordinal;
    status.textContent=`${product.name}, ${ui.slide} ${index+1} ${ui.of} ${carouselProducts.length}`;
    dotButtons.forEach((button,position)=>{button.classList.toggle("active",position===index);button.setAttribute("aria-current",position===index?"true":"false")});
  };
  const show=next=>{index=(next+carouselProducts.length)%carouselProducts.length;if(reducedMotion){render();return}slide.classList.add("is-changing");window.setTimeout(()=>{render();slide.classList.remove("is-changing")},170)};
  document.getElementById("carouselPrev")?.addEventListener("click",()=>{show(index-1);restart()});
  document.getElementById("carouselNext")?.addEventListener("click",()=>{show(index+1);restart()});
  dotButtons.forEach((button,position)=>button.addEventListener("click",()=>{show(position);restart()}));
  carousel.addEventListener("mouseenter",()=>window.clearInterval(timer));
  carousel.addEventListener("mouseleave",restart);
  carousel.addEventListener("focusin",()=>window.clearInterval(timer));
  carousel.addEventListener("focusout",event=>{if(!carousel.contains(event.relatedTarget))restart()});
  carousel.addEventListener("keydown",event=>{if(event.key==="ArrowLeft"){event.preventDefault();show(index-1);restart()}if(event.key==="ArrowRight"){event.preventDefault();show(index+1);restart()}});
  carousel.addEventListener("touchstart",event=>{touchStart=event.changedTouches[0].clientX},{passive:true});
  carousel.addEventListener("touchend",event=>{const distance=event.changedTouches[0].clientX-touchStart;if(Math.abs(distance)>45){show(index+(distance<0?1:-1));restart()}},{passive:true});
  render();
  restart();
}

try{
  const cart=JSON.parse(localStorage.getItem("pepmax-cart-v1")||"{}");
  const count=Object.values(cart).reduce((sum,value)=>sum+(Math.max(0,Math.floor(Number(value)))||0),0);
  const countEl=document.getElementById("cartCount");
  if(countEl)countEl.textContent=count;
}catch(_){const countEl=document.getElementById("cartCount");if(countEl)countEl.textContent="0"}
