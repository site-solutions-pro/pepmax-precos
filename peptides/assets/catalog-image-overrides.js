(()=>{
  const directImages={
    "5-amino-1mq":"5-amino-1mq-approved.webp",
    "retatrutida":"retatrutida-approved.webp",
    "tesamorelina":"tesamorelina-approved.webp"
  };
  const baseSrc="./assets/images/retatrutida-approved.webp?v=20260804-label-fix1";
  const cache=new Map();
  let basePromise=null;

  const products=()=>typeof PRODUCTS!=="undefined"&&Array.isArray(PRODUCTS)?PRODUCTS:[];
  const slugFromHref=href=>String(href||"").split("?")[0].replace(/\/+$/,"").split("/").filter(Boolean).pop()||"";

  const style=document.createElement("style");
  style.textContent=`
    #catalogGrid .catalog-media.pmx-vial-photo{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff}
    #catalogGrid .catalog-media.pmx-vial-photo img{display:block;width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important;transform:none!important;margin:auto!important}
    #catalogGrid .catalog-media.pmx-vial-photo .vial-dose,
    #catalogGrid .catalog-media.pmx-vial-photo .pmx-fixed-label{display:none!important}
  `;
  document.head.appendChild(style);

  function loadBase(){
    if(basePromise)return basePromise;
    basePromise=new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>resolve(image);
      image.onerror=reject;
      image.src=baseSrc;
    });
    return basePromise;
  }

  function splitName(ctx,name,maxWidth,maxLines=2){
    const words=String(name).toUpperCase().split(/\s+/).filter(Boolean);
    const lines=[];
    let line="";
    for(const word of words){
      const candidate=line?`${line} ${word}`:word;
      if(ctx.measureText(candidate).width<=maxWidth||!line){
        line=candidate;
      }else{
        lines.push(line);
        line=word;
      }
    }
    if(line)lines.push(line);
    if(lines.length<=maxLines)return lines;
    return [lines[0],lines.slice(1).join(" ")];
  }

  function fitFont(ctx,text,maxWidth,start,min){
    let size=start;
    while(size>min){
      ctx.font=`900 ${size}px Arial, sans-serif`;
      if(ctx.measureText(text).width<=maxWidth)return size;
      size-=2;
    }
    return min;
  }

  async function generateVial(name,dose){
    const key=`${name}|${dose}`;
    if(cache.has(key))return cache.get(key);

    const promise=(async()=>{
      const source=await loadBase();
      const canvas=document.createElement("canvas");
      canvas.width=source.naturalWidth;
      canvas.height=source.naturalHeight;
      const ctx=canvas.getContext("2d");
      ctx.drawImage(source,0,0);

      const nameX=canvas.width*.145;
      const nameY=canvas.height*.555;
      const nameW=canvas.width*.71;
      const nameH=canvas.height*.145;
      const gradient=ctx.createLinearGradient(nameX,nameY,nameX+nameW,nameY+nameH);
      gradient.addColorStop(0,"#6fbf39");
      gradient.addColorStop(.28,"#23a7b5");
      gradient.addColorStop(.72,"#167fb2");
      gradient.addColorStop(1,"#145f9b");
      ctx.fillStyle=gradient;
      ctx.fillRect(nameX,nameY,nameW,nameH);

      ctx.fillStyle="#fff";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      const centerX=nameX+nameW/2;
      let fontSize=Math.round(canvas.width*.068);
      ctx.font=`900 ${fontSize}px Arial, sans-serif`;
      let lines=splitName(ctx,name,nameW*.88,2);
      const longest=lines.reduce((a,b)=>a.length>b.length?a:b,"");
      fontSize=fitFont(ctx,longest,nameW*.88,fontSize,Math.round(canvas.width*.035));
      ctx.font=`900 ${fontSize}px Arial, sans-serif`;
      const lineHeight=fontSize*1.02;
      const startY=nameY+nameH/2-((lines.length-1)*lineHeight)/2;
      lines.forEach((line,index)=>ctx.fillText(line,centerX,startY+index*lineHeight));

      const doseX=canvas.width*.245;
      const doseY=canvas.height*.735;
      const doseW=canvas.width*.51;
      const doseH=canvas.height*.115;
      ctx.fillStyle="#fff";
      ctx.fillRect(doseX,doseY,doseW,doseH);
      ctx.strokeStyle="#2787a7";
      ctx.lineWidth=Math.max(3,canvas.width*.005);
      ctx.strokeRect(doseX,doseY,doseW,doseH);
      ctx.fillStyle="#174d9a";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      const doseFont=fitFont(ctx,String(dose),doseW*.82,Math.round(canvas.width*.092),Math.round(canvas.width*.045));
      ctx.font=`900 ${doseFont}px Arial, sans-serif`;
      ctx.fillText(String(dose),doseX+doseW/2,doseY+doseH/2);

      return canvas.toDataURL("image/webp",.94);
    })();

    cache.set(key,promise);
    return promise;
  }

  async function updateCard(card){
    const slug=slugFromHref(card.getAttribute("href"));
    const product=products().find(item=>item.slug===slug);
    const media=card.querySelector(".catalog-media");
    const img=media?.querySelector("img");
    if(!product||!media||!img)return;

    media.classList.add("pmx-vial-photo");
    media.classList.remove("pmx-standard-image","pmx-direct-image");
    media.querySelector(".pmx-fixed-label")?.remove();
    media.querySelector(".vial-dose")?.remove();

    const dose=product.items?.[0]?.[1]||"";
    img.alt=`Vial PepMAX ${product.name}, ${dose}`;

    if(directImages[slug]){
      const src=`./assets/images/${directImages[slug]}?v=20260804-label-fix1`;
      if(img.getAttribute("src")!==src)img.src=src;
      return;
    }

    const token=`${slug}|${dose}`;
    img.dataset.pmxToken=token;
    try{
      const generated=await generateVial(product.name,dose);
      if(img.dataset.pmxToken===token)img.src=generated;
    }catch(_){
      if(img.dataset.pmxToken===token)img.src=baseSrc;
    }
  }

  function apply(){
    document.querySelectorAll("#catalogGrid .card").forEach(updateCard);
  }

  const grid=document.querySelector("#catalogGrid");
  if(!grid)return;

  let scheduled=false;
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      apply();
    });
  };

  apply();
  new MutationObserver(schedule).observe(grid,{childList:true});
})();