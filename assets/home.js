const menu=document.getElementById("mobileMenu");
const toggle=document.getElementById("menuToggle");
const openMenu=()=>{menu.classList.add("open");menu.setAttribute("aria-hidden","false");toggle.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"};
const closeMenu=()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow=""};
toggle.addEventListener("click",openMenu);
document.querySelectorAll("[data-menu-close]").forEach(el=>el.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

try{
  const cart=JSON.parse(localStorage.getItem("pepmax-cart-v1")||"{}");
  const count=Object.values(cart).reduce((sum,value)=>sum+(Math.max(0,Math.floor(Number(value)))||0),0);
  document.getElementById("cartCount").textContent=count;
}catch(_){document.getElementById("cartCount").textContent="0"}
