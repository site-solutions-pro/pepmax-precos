const menu=document.getElementById('mobileMenu');
const toggle=document.getElementById('menuToggle');
const openMenu=()=>{menu?.classList.add('open');menu?.setAttribute('aria-hidden','false');toggle?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
const closeMenu=()=>{menu?.classList.remove('open');menu?.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false');document.body.style.overflow=''};
toggle?.addEventListener('click',openMenu);
document.querySelectorAll('[data-menu-close]').forEach(el=>el.addEventListener('click',closeMenu));

function pepmaxVial(name,dose='5 mg'){
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safe=esc(name),d=esc(dose),short=safe.length>18?safe.slice(0,17)+'…':safe,font=short.length>13?18:short.length>9?21:25;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 20 280 465"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#66757d"/><stop offset=".18" stop-color="#f3f7f9"/><stop offset=".42" stop-color="#9eabb1"/><stop offset=".68" stop-color="#f8fbfc"/><stop offset="1" stop-color="#66757d"/></linearGradient><linearGradient id="c" x1="0" x2="1"><stop stop-color="#68767e"/><stop offset=".25" stop-color="#f4f7f8"/><stop offset=".52" stop-color="#9aa5aa"/><stop offset=".78" stop-color="#eef2f4"/><stop offset="1" stop-color="#65747b"/></linearGradient><filter id="s" x="-40%" y="-30%" width="180%" height="190%"><feDropShadow dx="0" dy="18" stdDeviation="13" flood-color="#000" flood-opacity=".62"/></filter></defs><ellipse cx="210" cy="458" rx="91" ry="15" fill="#000" opacity=".42"/><g filter="url(#s)"><rect x="127" y="43" width="166" height="57" rx="17" fill="url(#c)" stroke="#c7d1d5"/><rect x="143" y="92" width="134" height="31" rx="8" fill="#111719"/><path d="M151 116h118l18 34v246c0 28-20 48-47 48h-60c-27 0-47-20-47-48V150z" fill="url(#g)" stroke="#b8c5cb" stroke-width="3"/><rect x="143" y="190" width="134" height="188" rx="3" fill="#080d0f" stroke="#1a2a31"/><text x="210" y="228" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="25" font-weight="600" fill="#f7fafb">Pep<tspan fill="#20dff7">MAX</tspan></text><line x1="160" y1="247" x2="260" y2="247" stroke="#1d2c33"/><text x="210" y="291" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="${font}" font-weight="600" fill="#fff">${short}</text><text x="210" y="319" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8.5" font-weight="600" letter-spacing="1.5" fill="#9dacb3">RESEARCH COMPOUND</text><text x="210" y="345" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8" font-weight="600" letter-spacing="1.1" fill="#72828a">FOR RESEARCH USE ONLY</text><line x1="165" y1="360" x2="202" y2="360" stroke="#20dff7" stroke-width="3"/><text x="210" y="405" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="16" font-weight="600" fill="#20dff7">${d}</text></g></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
const vialMap={
 'PepMAX Retatrutida vial':['Retatrutida','5 mg'],
 'PepMAX Tirzepatida vial':['Tirzepatida','5 mg'],
 'BPC-157':['BPC-157','5 mg'],
 'Retatrutida':['Retatrutida','5 mg'],
 'Tesamorelina':['Tesamorelina','10 mg'],
 'MOTS-c':['MOTS-c','10 mg']
};
document.querySelectorAll('.hero-vial,.product-media img').forEach(img=>{const item=vialMap[img.alt];if(item){img.src=pepmaxVial(item[0],item[1]);img.removeAttribute('srcset')}});

try{const cart=JSON.parse(localStorage.getItem('pepmax-cart')||'[]');const total=Array.isArray(cart)?cart.reduce((sum,item)=>sum+(Number(item.qty)||0),0):0;const el=document.getElementById('cartCount');if(el)el.textContent=total}catch(_){const el=document.getElementById('cartCount');if(el)el.textContent='0'}