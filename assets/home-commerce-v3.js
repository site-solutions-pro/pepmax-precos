(()=>{
 const products=Array.isArray(window.PRODUCTS)?window.PRODUCTS:(typeof PRODUCTS!=='undefined'?PRODUCTS:[]);
 const readCart=()=>{try{const v=JSON.parse(localStorage.getItem('pepmax-cart')||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
 const renderCount=()=>{const n=readCart().reduce((sum,item)=>sum+(Number(item.qty)||0),0);const el=document.getElementById('cartCount');if(el)el.textContent=n};
 const saveCart=cart=>{localStorage.setItem('pepmax-cart',JSON.stringify(cart));renderCount()};
 const money=value=>`$${Number(value).toFixed(2)}`;
 const add=(product,item)=>{const cart=readCart();const key=`${product.slug}|${item[0]}|${item[1]}`;const found=cart.find(x=>x.key===key);if(found)found.qty=(Number(found.qty)||0)+1;else cart.push({key,slug:product.slug,name:product.name,sku:item[0],presentation:item[1],price:Number(item[2]),qty:1});saveCart(cart)};
 document.querySelectorAll('#homeArrivals .commerce-card').forEach(card=>{
   const slug=card.dataset.slug;
   const product=products.find(p=>p.slug===slug);
   const select=card.querySelector('[data-home-variant]');
   const price=card.querySelector('[data-home-price]');
   const addButton=card.querySelector('[data-home-add]');
   if(!product||!Array.isArray(product.items)||!product.items.length){card.classList.add('catalog-unavailable');if(select)select.disabled=true;if(addButton)addButton.disabled=true;return}
   select.innerHTML=product.items.map((item,index)=>`<option value="${index}">${item[1]}</option>`).join('');
   const update=()=>{const item=product.items[Number(select.value)||0];price.textContent=money(item[2])};
   select.addEventListener('change',update);update();
   addButton.addEventListener('click',()=>{const item=product.items[Number(select.value)||0];add(product,item);const original=addButton.textContent;addButton.textContent='Added';addButton.classList.add('is-added');setTimeout(()=>{addButton.textContent=original;addButton.classList.remove('is-added')},900)});
 });
 renderCount();
})();
