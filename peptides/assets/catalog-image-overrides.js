(()=>{
  const directImages={
    "5-amino-1mq":"5-amino-1mq-approved.webp",
    "retatrutida":"retatrutida-approved.webp",
    "tesamorelina":"tesamorelina-approved.webp"
  };

  const baseImage="retatrutida-approved.webp";
  const catalogProducts=()=>typeof PRODUCTS!=="undefined"&&Array.isArray(PRODUCTS)?PRODUCTS:[];
  const escapeHtml=value=>String(value||"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const slugFromHref=href=>{
    const clean=String(href||"").split("?")[0].replace(/\/+$/,"");
    return clean.split("/").filter(Boolean).pop()||"";
  };

  const style=document.createElement("style");
  style.textContent=`
    .catalog-media.pmx-standard-image{position:relative;display:block;overflow:hidden;background:#fff}
    .catalog-media.pmx-standard-image .vial-dose{display:none!important}
    .catalog-media.pmx-standard-image img{width:100%;height:100%;object-fit:contain;transform:scale(.86,1.02)!important;transform-origin:center}
    .catalog-media.pmx-direct-image img{width:100%;height:100%;object-fit:contain;transform:none!important}
    .pmx-fixed-label{position:absolute;left:50%;top:51.5%;width:35%;min-width:104px;transform:translate(-50%,-50%);z-index:4;text-align:center;font-family:Arial,sans-serif;pointer-events:none}
    .pmx-fixed-label .pmx-name{display:flex;align-items:center;justify-content:center;min-height:45px;padding:5px 6px;background:linear-gradient(125deg,#239bc0,#188d80 55%,#3877aa);color:#fff;font-size:clamp(9px,1.08vw,16px);font-weight:800;line-height:1.02;letter-spacing:.01em;text-transform:uppercase;border-radius:2px;overflow-wrap:anywhere}
    .pmx-fixed-label .pmx-dose{display:inline-block;margin-top:20px;padding:3px 10px;border:2px solid #2787a7;border-radius:6px;background:#fff;color:#286f92;font-size:clamp(10px,1vw,16px);font-weight:800;line-height:1;white-space:nowrap}
    @media(max-width:600px){.pmx-fixed-label{width:37%}.pmx-fixed-label .pmx-name{min-height:42px}.pmx-fixed-label .pmx-dose{margin-top:17px}}
  `;
  document.head.appendChild(style);

  function apply(){
    const products=catalogProducts();
    document.querySelectorAll("#catalogGrid .card").forEach(card=>{
      const slug=slugFromHref(card.getAttribute("href"));
      const product=products.find(item=>item.slug===slug);
      const media=card.querySelector(".catalog-media");
      const img=media?.querySelector("img");
      if(!product||!media||!img)return;

      const dose=product.items?.[0]?.[1]||"";
      const direct=directImages[slug];
      if(direct){
        media.classList.remove("pmx-standard-image");
        media.classList.add("pmx-direct-image");
        media.querySelector(".pmx-fixed-label")?.remove();
        media.querySelector(".vial-dose")?.remove();
        const src=`./assets/images/${direct}?v=20260804-catalog95`;
        if(img.getAttribute("src")!==src)img.src=src;
        img.alt=`Vial PepMAX ${product.name}, ${dose}`;
        return;
      }

      media.classList.remove("pmx-direct-image");
      media.classList.add("pmx-standard-image");
      const src=`./assets/images/${baseImage}?v=20260804-catalog95`;
      if(img.getAttribute("src")!==src)img.src=src;
      img.alt=`Vial PepMAX ${product.name}, ${dose}`;

      let label=media.querySelector(".pmx-fixed-label");
      if(!label){
        label=document.createElement("span");
        label.className="pmx-fixed-label";
        media.appendChild(label);
      }
      const markup=`<span class="pmx-name">${escapeHtml(product.name)}</span><span class="pmx-dose">${escapeHtml(dose)}</span>`;
      if(label.innerHTML!==markup)label.innerHTML=markup;
    });
  }

  const grid=document.querySelector("#catalogGrid");
  if(!grid)return;

  let scheduled=false;
  const scheduleApply=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      apply();
    });
  };

  apply();
  new MutationObserver(scheduleApply).observe(grid,{childList:true});
})();