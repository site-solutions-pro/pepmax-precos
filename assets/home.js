const menu=document.getElementById("mobileMenu");
const toggle=document.getElementById("menuToggle");
const openMenu=()=>{menu.classList.add("open");menu.setAttribute("aria-hidden","false");toggle.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"};
const closeMenu=()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow=""};
toggle.addEventListener("click",openMenu);
document.querySelectorAll("[data-menu-close]").forEach(el=>el.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

const carouselProducts=[
  {name:"Retatrutida",slug:"retatrutida",sku:"RT5",dose:"5 mg",category:"Agonista peptídico multirreceptor",image:"retatrutida-approved.webp"},
  {name:"Tirzepatida",slug:"tirzepatida",sku:"TR5",dose:"5 mg",category:"Peptídeo sintético de referência",image:"tirzepatida-approved.webp"},
  {name:"Semaglutida",slug:"semaglutida",sku:"SM5",dose:"5 mg",category:"Análogo peptídico catalogado"},
  {name:"BPC-157",slug:"bpc-157",sku:"BC5",dose:"5 mg",category:"Pentadecapeptídeo sintético",image:"bpc-157-approved.webp"},
  {name:"TB-500",slug:"tb-500",sku:"TB5",dose:"5 mg",category:"Fragmento peptídico de referência"},
  {name:"GHK-Cu",slug:"ghk-cu",sku:"CU50",dose:"50 mg",category:"Tripeptídeo de cobre"},
  {name:"CJC-1295 + Ipamorelina",label:"CJC-1295 + IPA",slug:"cjc-1295-ipamorelina",sku:"CP10",dose:"10 mg",category:"Blend peptídico catalogado"},
  {name:"Tesamorelina",slug:"tesamorelina",sku:"TSM10",dose:"10 mg",category:"Análogo peptídico de GHRH",image:"tesamorelina-approved-v2.webp"},
  {name:"Ipamorelina",slug:"ipamorelina",sku:"IP5",dose:"5 mg",category:"Pentapeptídeo sintético"},
  {name:"AOD-9604",slug:"aod-9604",sku:"5AD",dose:"5 mg",category:"Fragmento peptídico catalogado"},
  {name:"MOTS-c",slug:"mots-c",sku:"MS10",dose:"10 mg",category:"Peptídeo mitocondrial",image:"mots-c-approved.webp"},
  {name:"PT-141 (bremelanotida)",label:"PT-141",slug:"pt-141-bremelanotida",sku:"P41",dose:"10 mg",category:"Peptídeo sintético cíclico"},
  {name:"Melanotan II (MT-2)",label:"Melanotan II",slug:"melanotan-ii-mt-2",sku:"ML10",dose:"10 mg",category:"Heptapeptídeo cíclico"},
  {name:"Epitalon",slug:"epitalon",sku:"ET10",dose:"10 mg",category:"Tetrapeptídeo sintético"},
  {name:"Semax",slug:"semax",sku:"XA11",dose:"11 mg",category:"Heptapeptídeo sintético"}
];

const carousel=document.getElementById("heroCarousel");
if(carousel){
  const slide=document.getElementById("carouselSlide");
  const image=document.getElementById("carouselImage");
  const name=document.getElementById("carouselName");
  const category=document.getElementById("carouselCategory");
  const dose=document.getElementById("carouselDose");
  const current=document.getElementById("carouselCurrent");
  const status=document.getElementById("carouselStatus");
  const dots=document.getElementById("carouselDots");
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escapeSvg=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const doseColors={"5 mg":"#1556a3","10 mg":"#6f42c1","11 mg":"#b32975","50 mg":"#00788a"};
  const vialPlaceholder=product=>{
    const label=escapeSvg(product.label||product.name);
    const fontSize=label.length>17?15:label.length>12?17:20;
    const color=doseColors[product.dose]||"#1556a3";
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1fc7da"/><stop offset=".46" stop-color="#7b3fd4"/><stop offset=".76" stop-color="#d6379f"/><stop offset="1" stop-color="#35d58b"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dce6ef"/><stop offset=".18" stop-color="#fff"/><stop offset=".82" stop-color="#fff"/><stop offset="1" stop-color="#cbd8e4"/></linearGradient></defs><g transform="translate(41.08503 -18.2) scale(.804357 1.07)"><ellipse cx="210" cy="474" rx="120" ry="18" fill="#64748b" opacity=".18"/><rect x="118" y="46" width="184" height="58" rx="17" fill="#c9d0d8"/><rect x="132" y="92" width="156" height="32" rx="8" fill="#202733"/><path d="M143 116h134l18 36v281c0 25-18 43-43 43h-84c-25 0-43-18-43-43V152z" fill="url(#glass)" stroke="#aebdca" stroke-width="4"/><rect x="130" y="204" width="160" height="205" rx="7" fill="#fff"/><rect x="130" y="204" width="160" height="18" fill="url(#g)"/><rect x="130" y="278" width="160" height="76" fill="url(#g)"/><text x="210" y="258" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="26" fill="#173b68">PepMAX</text><text x="210" y="317" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="${fontSize}" fill="#fff">${label}</text><text x="210" y="387" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="24" fill="${color}">${escapeSvg(product.dose)}</text><text x="210" y="427" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#41536a">FOR RESEARCH USE ONLY</text></g></svg>`;
    return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
  };
  let index=0;
  let timer;
  let touchStart=0;
  dots.innerHTML=carouselProducts.map((product,position)=>`<button type="button" aria-label="Mostrar ${product.name}" data-carousel-index="${position}"></button>`).join("");
  const dotButtons=[...dots.querySelectorAll("button")];
  const restart=()=>{
    window.clearInterval(timer);
    if(!reducedMotion)timer=window.setInterval(()=>show(index+1),5200);
  };
  const render=()=>{
    const product=carouselProducts[index];
    const ordinal=String(index+1).padStart(2,"0");
    slide.href=`./peptides/${product.slug}/?sku=${encodeURIComponent(product.sku)}`;
    slide.setAttribute("aria-label",`Ver ${product.name}, ${product.dose}`);
    image.src=product.image?`./peptides/assets/images/${product.image}`:vialPlaceholder(product);
    image.alt=`Vial PepMax ${product.name}, ${product.dose}`;
    image.className=`carousel-vial${product.image?" final-vial":" generated-vial"}`;
    name.textContent=product.name;
    category.textContent=product.category;
    dose.textContent=product.dose;
    current.textContent=ordinal;
    carousel.querySelector(".carousel-rank").textContent=ordinal;
    status.textContent=`${product.name}, slide ${index+1} de ${carouselProducts.length}`;
    dotButtons.forEach((button,position)=>{
      button.classList.toggle("active",position===index);
      button.setAttribute("aria-current",position===index?"true":"false");
    });
  };
  const show=next=>{
    index=(next+carouselProducts.length)%carouselProducts.length;
    if(reducedMotion){render();return}
    slide.classList.add("is-changing");
    window.setTimeout(()=>{render();slide.classList.remove("is-changing")},170);
  };
  document.getElementById("carouselPrev").addEventListener("click",()=>{show(index-1);restart()});
  document.getElementById("carouselNext").addEventListener("click",()=>{show(index+1);restart()});
  dotButtons.forEach((button,position)=>button.addEventListener("click",()=>{show(position);restart()}));
  carousel.addEventListener("mouseenter",()=>window.clearInterval(timer));
  carousel.addEventListener("mouseleave",restart);
  carousel.addEventListener("focusin",()=>window.clearInterval(timer));
  carousel.addEventListener("focusout",event=>{if(!carousel.contains(event.relatedTarget))restart()});
  carousel.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft"){event.preventDefault();show(index-1);restart()}
    if(event.key==="ArrowRight"){event.preventDefault();show(index+1);restart()}
  });
  carousel.addEventListener("touchstart",event=>{touchStart=event.changedTouches[0].clientX},{passive:true});
  carousel.addEventListener("touchend",event=>{
    const distance=event.changedTouches[0].clientX-touchStart;
    if(Math.abs(distance)>45){show(index+(distance<0?1:-1));restart()}
  },{passive:true});
  render();
  restart();
}

try{
  const cart=JSON.parse(localStorage.getItem("pepmax-cart-v1")||"{}");
  const count=Object.values(cart).reduce((sum,value)=>sum+(Math.max(0,Math.floor(Number(value)))||0),0);
  document.getElementById("cartCount").textContent=count;
}catch(_){document.getElementById("cartCount").textContent="0"}
