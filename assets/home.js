const menu=document.getElementById('mobileMenu');
const toggle=document.getElementById('menuToggle');
const openMenu=()=>{menu?.classList.add('open');menu?.setAttribute('aria-hidden','false');toggle?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
const closeMenu=()=>{menu?.classList.remove('open');menu?.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false');document.body.style.overflow=''};
toggle?.addEventListener('click',openMenu);
document.querySelectorAll('[data-menu-close]').forEach(el=>el.addEventListener('click',closeMenu));

const items=[
{name:'Retatrutida',dose:'5 mg presentation',category:'Multi-receptor peptide agonist',slug:'retatrutida',sku:'RT5',image:'retatrutida-approved.webp'},
{name:'Tirzepatida',dose:'5 mg presentation',category:'Synthetic reference peptide',slug:'tirzepatida',sku:'TR5',image:'tirzepatida-approved.webp'},
{name:'BPC-157',dose:'5 mg presentation',category:'Synthetic pentadecapeptide',slug:'bpc-157',sku:'BC5',image:'bpc-157-approved.webp'},
{name:'Tesamorelina',dose:'10 mg presentation',category:'GHRH peptide analogue',slug:'tesamorelina',sku:'TSM10',image:'tesamorelina-approved-v2.webp'},
{name:'MOTS-c',dose:'10 mg presentation',category:'Mitochondrial peptide',slug:'mots-c',sku:'MS10',image:'mots-c-approved.webp'}
];
let index=0,timer;
const image=document.getElementById('heroImage'),nameEl=document.getElementById('heroName'),dose=document.getElementById('heroDose'),category=document.getElementById('heroCategory'),link=document.getElementById('heroLink'),count=document.getElementById('heroCount');
function render(){const item=items[index];image.src=`./peptides/assets/images/${item.image}`;image.alt=`${item.name} vial`;nameEl.textContent=item.name;dose.textContent=item.dose;category.textContent=item.category;link.href=`./peptides/${item.slug}/?sku=${encodeURIComponent(item.sku)}`;count.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`}
function show(next){index=(next+items.length)%items.length;render();restart()}
function restart(){clearInterval(timer);timer=setInterval(()=>{index=(index+1)%items.length;render()},6200)}
document.getElementById('heroPrev')?.addEventListener('click',()=>show(index-1));
document.getElementById('heroNext')?.addEventListener('click',()=>show(index+1));
render();restart();
try{const cart=JSON.parse(localStorage.getItem('pepmax-cart-v1')||'{}');const total=Object.values(cart).reduce((sum,v)=>sum+(Math.max(0,Math.floor(Number(v)))||0),0);const el=document.getElementById('cartCount');if(el)el.textContent=total}catch(_){const el=document.getElementById('cartCount');if(el)el.textContent='0'}
