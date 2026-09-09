const menu=document.getElementById('mobileMenu');
const toggle=document.getElementById('menuToggle');
const openMenu=()=>{menu?.classList.add('open');menu?.setAttribute('aria-hidden','false');toggle?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
const closeMenu=()=>{menu?.classList.remove('open');menu?.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false');document.body.style.overflow=''};
toggle?.addEventListener('click',openMenu);
document.querySelectorAll('[data-menu-close]').forEach(el=>el.addEventListener('click',closeMenu));
try{const cart=JSON.parse(localStorage.getItem('pepmax-cart')||'[]');const total=Array.isArray(cart)?cart.reduce((sum,item)=>sum+(Number(item.qty)||0),0):0;const el=document.getElementById('cartCount');if(el)el.textContent=total}catch(_){const el=document.getElementById('cartCount');if(el)el.textContent='0'}