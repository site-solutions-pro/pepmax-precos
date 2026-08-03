(()=>{
  const getProducts=()=>typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)?PRODUCTS:null;
  const getProduct=()=>{
    const products=getProducts();
    if(!products) return null;
    const parts=location.pathname.split('/').filter(Boolean);
    const slug=parts[parts.length-1]||parts[parts.length-2];
    return products.find(p=>p.slug===slug)||null;
  };

  let busy=false;
  const render=()=>{
    if(busy) return;
    const product=getProduct();
    const img=document.querySelector('.product-visual img.final-vial');
    const checked=document.querySelector('input[name="variant"]:checked');
    if(!product||!img||!checked) return;

    const index=Number(checked.value);
    const item=product.items?.[index];
    if(!item) return;
    const dose=item[1];
    if(img.dataset.renderedDose===dose) return;

    if(!img.dataset.baseSrc) img.dataset.baseSrc=img.currentSrc||img.src;
    const baseSrc=img.dataset.baseSrc;
    busy=true;

    const source=new Image();
    source.crossOrigin='anonymous';
    source.onload=()=>{
      const canvas=document.createElement('canvas');
      canvas.width=source.naturalWidth;
      canvas.height=source.naturalHeight;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(source,0,0);

      const x=canvas.width*.32;
      const y=canvas.height*.70;
      const w=canvas.width*.36;
      const h=canvas.height*.115;
      ctx.fillStyle='#fff';
      ctx.fillRect(x,y,w,h);
      ctx.fillStyle='#174d9a';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      const fontSize=dose.length>8?canvas.width*.072:dose.length>6?canvas.width*.085:canvas.width*.105;
      ctx.font=`900 ${Math.round(fontSize)}px Arial`;
      ctx.fillText(dose,x+w/2,y+h/2);

      img.src=canvas.toDataURL('image/webp',.94);
      img.alt=`Vial PepMAX ${product.name}, ${dose}`;
      img.dataset.renderedDose=dose;
      busy=false;
    };
    source.onerror=()=>{busy=false};
    source.src=baseSrc;
  };

  document.addEventListener('change',e=>{
    if(e.target?.matches('input[name="variant"]')) requestAnimationFrame(render);
  });

  const start=()=>{
    const root=document.querySelector('#product');
    if(!root) return;
    new MutationObserver(()=>requestAnimationFrame(render)).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','checked']});
    requestAnimationFrame(render);
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
