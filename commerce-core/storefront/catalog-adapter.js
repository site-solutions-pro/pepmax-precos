(function(global){
  'use strict';

  const DEFAULT_URL='../commerce-core/catalog/public.generated.json';
  let cache=null;
  let loading=null;

  function assertSnapshot(snapshot){
    if(!snapshot || !Array.isArray(snapshot.products)) throw new Error('Invalid Commerce Core snapshot');
    if(typeof snapshot.productCount==='number' && snapshot.productCount!==snapshot.products.length){
      throw new Error('Commerce Core product count mismatch');
    }
    return snapshot;
  }

  async function load(url=DEFAULT_URL){
    if(cache) return cache;
    if(loading) return loading;
    loading=fetch(url,{cache:'no-store',credentials:'same-origin'})
      .then(response=>{
        if(!response.ok) throw new Error(`Commerce Core snapshot HTTP ${response.status}`);
        return response.json();
      })
      .then(snapshot=>{
        cache=assertSnapshot(snapshot);
        return cache;
      })
      .finally(()=>{loading=null;});
    return loading;
  }

  function getProduct(snapshot,slug){
    if(!snapshot || !Array.isArray(snapshot.products)) return null;
    return snapshot.products.find(product=>product.slug===slug)||null;
  }

  function getVariant(product,{sku=null,label=null}={}){
    if(!product || !Array.isArray(product.variants)) return null;
    if(sku){
      const bySku=product.variants.find(variant=>variant.sku===sku);
      if(bySku) return bySku;
    }
    if(label){
      const byLabel=product.variants.find(variant=>variant.label===label);
      if(byLabel) return byLabel;
    }
    return product.variants[0]||null;
  }

  function resolve(snapshot,legacy){
    const product=getProduct(snapshot,legacy?.slug);
    if(!product) return {source:'legacy',...legacy};
    const variant=getVariant(product,{sku:legacy?.sku||null,label:legacy?.dose||null});
    if(!variant) return {source:'legacy',...legacy};
    return {
      ...legacy,
      source:'commerce-core',
      name:product.name||legacy?.name,
      slug:product.slug||legacy?.slug,
      sku:variant.sku??legacy?.sku??null,
      dose:variant.label||legacy?.dose,
      price:variant.price,
      currency:variant.currency||snapshot.currency||'USD',
      availability:variant.availability,
      inventoryPolicy:variant.inventoryPolicy||'untracked'
    };
  }

  async function resolveMany(legacyProducts,{url=DEFAULT_URL}={}){
    try{
      const snapshot=await load(url);
      return legacyProducts.map(item=>resolve(snapshot,item));
    }catch(error){
      console.warn('[PepMax Commerce Core] snapshot unavailable; using legacy fallback',error);
      return legacyProducts.map(item=>({source:'legacy',...item}));
    }
  }

  function reset(){ cache=null; loading=null; }

  global.PepMaxCommerceCatalog={load,getProduct,getVariant,resolve,resolveMany,reset};
})(window);
