(()=>{
  const style=document.createElement('link');
  style.rel='stylesheet';
  const depth=location.pathname.includes('/pt/peptides/')||location.pathname.includes('/en/peptides/')||location.pathname.includes('/es/peptides/')?'../../../':'../../';
  style.href=`${depth}assets/brand-system.css?v=20260909-cyan-poppins`;
  document.head.appendChild(style);

  const productRoot=document.querySelector('#product');
  if(!productRoot) return;
  if(location.pathname.replace(/\/+$/,'')==='/pepmax-precos/peptides') return;

  const selectedItem=()=>{
    const parts=location.pathname.split('/').filter(Boolean);
    const slug=parts[parts.length-1]||parts[parts.length-2];
    const product=typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)
      ?PRODUCTS.find(item=>item.slug===slug)
      :null;
    const checked=document.querySelector('input[name="variant"]:checked');
    const index=Number(checked?.value);
    return product&&Number.isInteger(index)?{product,item:product.items?.[index],index}:null;
  };

  const verify=()=>{
    const selected=selectedItem();
    const visual=document.querySelector('.product-visual .vial-visual');
    if(!selected?.item||!visual) return;
    const [rawSku,presentation]=selected.item;
    const sku=isAssignedSku(rawSku)?String(rawSku).trim():'';
    visual.dataset.sku=sku;
    visual.dataset.presentation=presentation;
    visual.setAttribute('aria-label',productImageAlt(selected.product,selected.item));
    const image=visual.querySelector('img.final-vial');
    if(image){
      image.src=productImage(selected.product,selected.item);
      image.alt=productImageAlt(selected.product,selected.item);
      image.style.width='auto';
      image.style.height='auto';
      image.style.maxWidth='100%';
      image.style.maxHeight='100%';
      image.style.objectFit='contain';
      image.style.transform='none';
    }
  };

  document.addEventListener('change',event=>{
    if(event.target?.matches('input[name="variant"]')) requestAnimationFrame(verify);
  });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',verify,{once:true});
  else verify();
})();
