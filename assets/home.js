const menu=document.getElementById('mobileMenu');
const toggle=document.getElementById('menuToggle');
const openMenu=()=>{menu?.classList.add('open');menu?.setAttribute('aria-hidden','false');toggle?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
const closeMenu=()=>{menu?.classList.remove('open');menu?.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false');document.body.style.overflow=''};
toggle?.addEventListener('click',openMenu);
document.querySelectorAll('[data-menu-close]').forEach(el=>el.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

const products=[
{name:'Retatrutida',slug:'retatrutida',sku:'RT5',dose:'5 mg',category:'Multi-receptor peptide agonist',image:'retatrutida-approved.webp'},
{name:'Tirzepatida',slug:'tirzepatida',sku:'TR5',dose:'5 mg',category:'Synthetic reference peptide',image:'tirzepatida-approved.webp'},
{name:'Semaglutida',slug:'semaglutida',sku:'SM5',dose:'5 mg',category:'Cataloged peptide analogue'},
{name:'BPC-157',slug:'bpc-157',sku:'BC5',dose:'5 mg',category:'Synthetic pentadecapeptide',image:'bpc-157-approved.webp'},
{name:'TB-500',slug:'tb-500',sku:'TB5',dose:'5 mg',category:'Reference peptide fragment'},
{name:'GHK-Cu',slug:'ghk-cu',sku:'CU50',dose:'50 mg',category:'Copper tripeptide'},
{name:'CJC-1295 + Ipamorelina',label:'CJC-1295 + IPA',slug:'cjc-1295-ipamorelina',sku:'CP10',dose:'10 mg',category:'Cataloged peptide blend'},
{name:'Tesamorelina',slug:'tesamorelina',sku:'TSM10',dose:'10 mg',category:'GHRH peptide analogue',image:'tesamorelina-approved-v2.webp'},
{name:'Ipamorelina',slug:'ipamorelina',sku:'IP5',dose:'5 mg',category:'Synthetic pentapeptide'},
{name:'AOD-9604',slug:'aod-9604',sku:'5AD',dose:'5 mg',category:'Cataloged peptide fragment'},
{name:'MOTS-c',slug:'mots-c',sku:'MS10',dose:'10 mg',category:'Mitochondrial peptide',image:'mots-c-approved.webp'},
{name:'PT-141',slug:'pt-141-bremelanotida',sku:'P41',dose:'10 mg',category:'Cyclic synthetic peptide'},
{name:'Melanotan II',slug:'melanotan-ii-mt-2',sku:'ML10',dose:'10 mg',category:'Cyclic heptapeptide'},
{name:'Epitalon',slug:'epitalon',sku:'ET10',dose:'10 mg',category:'Synthetic tetrapeptide'},
{name:'Semax',slug:'semax',sku:'XA11',dose:'11 mg',category:'Synthetic heptapeptide'}
];

const carousel=document.getElementById('heroCarousel');
if(carousel){
 const image=document.getElementById('heroImage');
 const name=document.getElementById('heroName');
 const category=document.getElementById('heroCategory');
 const dose=document.getElementById('heroDose');
 const indexEl=document.getElementById('heroIndex');
 const productLink=document.getElementById('heroProductLink');
 const progress=document.getElementById('heroProgress');
 const slide=document.getElementById('heroSlide');
 let index=0,timer,touchStart=0;
 const fallback=product=>{
  const label=(product.label||product.name).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fs=label.length>17?15:label.length>12?17:20;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#20dfff"/><stop offset=".78" stop-color="#20dfff"/><stop offset="1" stop-color="#ff2aa8"/></linearGradient><linearGradient id="glass" x1="0" x2="1"><stop stop-color="#dce6ef"/><stop offset=".18" stop-color="#fff"/><stop offset=".82" stop-color="#fff"/><stop offset="1" stop-color="#cbd8e4"/></linearGradient></defs><ellipse cx="210" cy="474" rx="94" ry="13" fill="#000" opacity=".14"/><rect x="136" y="43" width="148" height="49" rx="15" fill="#c9d0d8"/><rect x="147" y="82" width="126" height="27" rx="7" fill="#202020"/><path d="M151 103h118l16 31v258c0 24-17 41-40 41h-70c-23 0-40-17-40-41V134z" fill="url(#glass)" stroke="#aebdca" stroke-width="3"/><rect x="141" y="190" width="138" height="188" rx="6" fill="#fff"/><rect x="141" y="190" width="138" height="16" fill="url(#g)"/><rect x="141" y="257" width="138" height="70" fill="url(#g)"/><text x="210" y="238" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="24" fill="#111">PepMAX</text><text x="210" y="299" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="${fs}" fill="#fff">${label}</text><text x="210" y="352" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="21" fill="#20dfff">${product.dose}</text><text x="210" y="399" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8" fill="#333">LABORATORY RESEARCH</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg)
 };
 progress.innerHTML=products.map((p,i)=>`<button type="button" aria-label="Show ${p.name}" data-index="${i}"></button>`).join('');
 const dots=[...progress.querySelectorAll('button')];
 const render=()=>{
  const p=products[index];
  slide.classList.add('changing');
  setTimeout(()=>{
   image.src=p.image?`./peptides/assets/images/${p.image}`:fallback(p);
   image.alt=`PepMAX ${p.name} vial`;
   name.textContent=p.name;
   category.textContent=p.category;
   dose.textContent=p.dose;
   indexEl.textContent=String(index+1).padStart(2,'0');
   productLink.href=`./peptides/${p.slug}/?sku=${encodeURIComponent(p.sku)}`;
   dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
   slide.classList.remove('changing');
  },120)
 };
 const show=i=>{index=(i+products.length)%products.length;render()};
 const restart=()=>{clearInterval(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(index+1),5600)};
 document.getElementById('heroPrev')?.addEventListener('click',()=>{show(index-1);restart()});
 document.getElementById('heroNext')?.addEventListener('click',()=>{show(index+1);restart()});
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);restart()}));
 carousel.addEventListener('mouseenter',()=>clearInterval(timer));
 carousel.addEventListener('mouseleave',restart);
 carousel.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX},{passive:true});
 carousel.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchStart;if(Math.abs(d)>45){show(index+(d<0?1:-1));restart()}},{passive:true});
 render();restart();
}

try{const cart=JSON.parse(localStorage.getItem('pepmax-cart-v1')||'{}');const count=Object.values(cart).reduce((sum,v)=>sum+(Math.max(0,Math.floor(Number(v)))||0),0);const el=document.getElementById('cartCount');if(el)el.textContent=count}catch(_){const el=document.getElementById('cartCount');if(el)el.textContent='0'}
