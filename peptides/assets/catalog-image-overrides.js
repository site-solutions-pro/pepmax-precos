(()=>{
  const directImages={
    "5-amino-1mq":"5-amino-1mq-approved.webp"
  };

  const products={
    "semax":{name:"SEMAX",dose:"5 mg"},
    "selank":{name:"SELANK",dose:"5 mg"},
    "dsip":{name:"DSIP",dose:"5 mg"},
    "pinealon":{name:"PINEALON",dose:"10 mg"},
    "epitalon":{name:"EPITALON",dose:"10 mg"},
    "hgh-fragmento-176-191":{name:"HGH-FRAG",dose:"10 mg"},
    "hgh-191aa-somatropina":{name:"HGH",subtitle:"SOMATROPIN",dose:"10 IU"}
  };

  const style=document.createElement("style");
  style.textContent=`
    .catalog-media.pmx-standard-image{position:relative;display:block;overflow:hidden;background:#fff}
    .catalog-media.pmx-standard-image .vial-dose{display:none!important}
    .catalog-media.pmx-standard-image img{width:100%;height:100%;object-fit:contain;transform:scale(.86,1.02)!important;transform-origin:center}
    .catalog-media.pmx-direct-image img{width:100%;height:100%;object-fit:contain;transform:none!important}
    .pmx-fixed-label{position:absolute;left:50%;top:51.5%;width:35%;min-width:104px;transform:translate(-50%,-50%);z-index:4;text-align:center;font-family:Arial,sans-serif;pointer-events:none}
    .pmx-fixed-label .pmx-name{display:flex;align-items:center;justify-content:center;min-height:45px;padding:5px 6px;background:linear-gradient(125deg,#239bc0,#188d80 55%,#3877aa);color:#fff;font-size:clamp(10px,1.15vw,17px);font-weight:800;line-height:1.02;letter-spacing:.01em;text-transform:uppercase;border-radius:2px}
    .pmx-fixed-label .pmx-subtitle{display:block;font-size:.62em;letter-spacing:.08em;margin-top:2px}
    .pmx-fixed-label .pmx-dose{display:inline-block;margin-top:20px;padding:3px 13px;border:2px solid #2787a7;border-radius:6px;background:#fff;color:#286f92;font-size:clamp(10px,1vw,16px);font-weight:800;line-height:1}
    @media(max-width:600px){.pmx-fixed-label{width:37%}.pmx-fixed-label .pmx-name{min-height:42px}.pmx-fixed-label .pmx-dose{margin-top:17px}}
  `;
  document.head.appendChild(style);

  const matchesSlug=(href,key)=>href.includes(`${key}/`)||href.includes(`/${key}`);

  function apply(){
    document.querySelectorAll("#catalogGrid .card").forEach(card=>{
      const href=card.getAttribute("href")||"";
      const directSlug=Object.keys(directImages).find(key=>matchesSlug(href,key));
      const media=card.querySelector(".catalog-media");
      const img=media?.querySelector("img");
      if(!media||!img)return;

      if(directSlug){
        media.classList.remove("pmx-standard-image");
        media.classList.add("pmx-direct-image");
        media.querySelector(".pmx-fixed-label")?.remove();
        media.querySelector(".vial-dose")?.remove();
        const src=`./assets/images/${directImages[directSlug]}?v=20260803-search-fix1`;
        if(img.getAttribute("src")!==src)img.src=src;
        img.alt="Vial PepMAX 5-Amino-1MQ, 5 mg";
        return;
      }

      const slug=Object.keys(products).find(key=>matchesSlug(href,key));
      if(!slug)return;
      const data=products[slug];
      media.classList.add("pmx-standard-image");
      const src="./assets/images/retatrutida-approved.webp";
      if(img.getAttribute("src")!==src)img.src=src;
      img.alt=`Vial PepMAX ${data.name}, ${data.dose}`;

      let label=media.querySelector(".pmx-fixed-label");
      if(!label){
        label=document.createElement("span");
        label.className="pmx-fixed-label";
        media.appendChild(label);
      }
      const markup=`<span class="pmx-name">${data.name}${data.subtitle?`<small class="pmx-subtitle">${data.subtitle}</small>`:""}</span><span class="pmx-dose">${data.dose}</span>`;
      if(label.innerHTML!==markup)label.innerHTML=markup;
    });
  }

  const grid=document.querySelector("#catalogGrid");
  if(grid){
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
  }
})();