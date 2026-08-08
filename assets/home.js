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

// CTA editorial: dossie cientifico de retatrutida
const marketSection=document.querySelector(".market.shell");
if(marketSection&&!document.querySelector(".retatrutida-dossie-cta")){
  const style=document.createElement("style");
  style.textContent=`
    .retatrutida-dossie-cta{margin:28px auto 70px;padding:32px;border:1px solid rgba(70,211,255,.22);border-radius:28px;background:radial-gradient(circle at 82% 12%,rgba(77,212,255,.13),transparent 32%),linear-gradient(135deg,#0a1425,#101b31);display:grid;grid-template-columns:1.25fr .75fr;gap:28px;align-items:center;overflow:hidden;position:relative}
    .retatrutida-dossie-cta:after{content:"GLP-1  •  GIP  •  GCG";position:absolute;right:28px;bottom:18px;font:600 11px "IBM Plex Mono",monospace;letter-spacing:.13em;color:rgba(135,218,255,.32)}
    .retatrutida-dossie-cta .cta-kicker{display:inline-flex;gap:8px;align-items:center;color:#63ddff;font:600 12px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.1em}
    .retatrutida-dossie-cta .cta-kicker i{width:7px;height:7px;background:#43d9ff;border-radius:50%;box-shadow:0 0 15px #43d9ff}
    .retatrutida-dossie-cta h2{font:700 clamp(30px,4vw,50px)/1.04 "Bricolage Grotesque",sans-serif;letter-spacing:-.035em;margin:15px 0 14px;max-width:780px}
    .retatrutida-dossie-cta p{color:#c2d0e3;font-size:17px;line-height:1.7;margin:0;max-width:770px}
    .retatrutida-dossie-cta .cta-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
    .retatrutida-dossie-cta .cta-link{display:inline-flex;align-items:center;gap:10px;padding:13px 17px;border-radius:12px;background:linear-gradient(135deg,#3bd8ff,#34e0b8);color:#06101a;text-decoration:none;font-weight:700}
    .retatrutida-dossie-cta .cta-secondary{background:transparent;color:#e7f3ff;border:1px solid rgba(255,255,255,.16)}
    .retatrutida-dossie-cta .cta-data{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .retatrutida-dossie-cta .cta-data div{min-height:112px;padding:18px;border-radius:18px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}
    .retatrutida-dossie-cta .cta-data b{display:block;font:800 28px "Bricolage Grotesque",sans-serif;color:#fff}
    .retatrutida-dossie-cta .cta-data span{display:block;color:#91a8c2;font-size:12px;line-height:1.45;margin-top:7px}
    @media(max-width:800px){.retatrutida-dossie-cta{grid-template-columns:1fr;padding:24px;margin-bottom:48px}.retatrutida-dossie-cta .cta-data{grid-template-columns:1fr 1fr}.retatrutida-dossie-cta:after{display:none}}
  `;
  document.head.appendChild(style);
  const cta=document.createElement("section");
  cta.className="retatrutida-dossie-cta shell";
  cta.setAttribute("aria-labelledby","retatrutidaDossieTitle");
  cta.innerHTML=`
    <div>
      <span class="cta-kicker"><i></i>Novo dossiê científico</span>
      <h2 id="retatrutidaDossieTitle">Retatrutida: triplo agonismo explicado com evidência.</h2>
      <p>Um artigo técnico sobre mecanismo GLP-1R/GIPR/GCGR, estudos TRIUMPH, segurança, amplitude metabólica, comparação com tirzepatida e status regulatório — sem transformar resultado clínico em protocolo de uso.</p>
      <div class="cta-actions">
        <a class="cta-link" href="./biblioteca/retatrutida-ciencia/">Ler o artigo completo <span aria-hidden="true">→</span></a>
        <a class="cta-link cta-secondary" href="./peptides/retatrutida/">Ver ficha da molécula</a>
      </div>
    </div>
    <div class="cta-data" aria-label="Destaques do dossiê">
      <div><b>28,3%</b><span>perda média em 80 semanas no TRIUMPH-1, 12 mg</span></div>
      <div><b>5</b><span>readouts positivos de Fase 3 consolidados no dossiê</span></div>
      <div><b>3</b><span>receptores-alvo: GLP-1R, GIPR e GCGR</span></div>
      <div><b>Q1 2027</b><span>BLA planejado; submissão não equivale a aprovação</span></div>
    </div>`;
  marketSection.insertAdjacentElement("afterend",cta);
}
