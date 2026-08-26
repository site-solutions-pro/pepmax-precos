(function(){
  'use strict';

  const SNAPSHOT_URL='./commerce-core/catalog/public.generated.json';

  async function hydrateHomeFromCommerceCore(){
    if(!window.PepMaxCommerceCatalog) return;
    if(typeof carouselProducts==='undefined' || !Array.isArray(carouselProducts)) return;

    const before=carouselProducts.map(item=>({
      slug:item.slug,
      sku:item.sku,
      dose:item.dose,
      name:item.name
    }));

    const resolved=await window.PepMaxCommerceCatalog.resolveMany(before,{url:SNAPSHOT_URL});
    resolved.forEach((item,index)=>{
      const target=carouselProducts[index];
      if(!target) return;
      target.name=item.name||target.name;
      target.slug=item.slug||target.slug;
      target.sku=item.sku??target.sku;
      target.dose=item.dose||target.dose;
      target.price=item.price;
      target.currency=item.currency;
      target.availability=item.availability;
      target.inventoryPolicy=item.inventoryPolicy;
      target.commerceSource=item.source;
    });

    document.documentElement.dataset.pepmaxCommerceCore='ready';
    document.dispatchEvent(new CustomEvent('pepmax:commerce-core-ready',{
      detail:{
        products:resolved.length,
        commerceCore:resolved.filter(item=>item.source==='commerce-core').length,
        fallback:resolved.filter(item=>item.source!=='commerce-core').length
      }
    }));
  }

  hydrateHomeFromCommerceCore().catch(error=>{
    console.warn('[PepMax Home] Commerce Core hydration failed; legacy data remains active',error);
    document.documentElement.dataset.pepmaxCommerceCore='fallback';
  });
})();
