import fs from 'node:fs';
import vm from 'node:vm';

const homePath='assets/home.js';
const snapshotPath='commerce-core/catalog/public.generated.json';
const source=fs.readFileSync(homePath,'utf8');
const snapshot=JSON.parse(fs.readFileSync(snapshotPath,'utf8'));

const marker='const carouselProducts=';
const start=source.indexOf(marker);
if(start<0) throw new Error('carouselProducts not found');
const arrayStart=source.indexOf('[',start);
if(arrayStart<0) throw new Error('carouselProducts array not found');
let depth=0, quote=null, escape=false, end=-1;
for(let i=arrayStart;i<source.length;i++){
  const ch=source[i];
  if(quote){
    if(escape) escape=false;
    else if(ch==='\\') escape=true;
    else if(ch===quote) quote=null;
    continue;
  }
  if(ch==='"'||ch==="'"||ch==='`'){ quote=ch; continue; }
  if(ch==='[') depth++;
  if(ch===']'){
    depth--;
    if(depth===0){ end=i+1; break; }
  }
}
if(end<0) throw new Error('Could not isolate carouselProducts array');
const items=vm.runInNewContext(`(${source.slice(arrayStart,end)})`,Object.create(null),{timeout:1000});
if(!Array.isArray(items) || items.length!==15) throw new Error(`Expected 15 carousel products, found ${items.length}`);

const bySlug=new Map(snapshot.products.map(p=>[p.slug,p]));
const findings=[];
for(const item of items){
  const product=bySlug.get(item.slug);
  if(!product){ findings.push({code:'MISSING_PRODUCT',slug:item.slug}); continue; }
  let variant=null;
  if(item.sku) variant=product.variants.find(v=>v.sku===item.sku) || null;
  if(!variant && item.dose) variant=product.variants.find(v=>v.label===item.dose) || null;
  if(!variant){ findings.push({code:'MISSING_VARIANT',slug:item.slug,sku:item.sku,dose:item.dose}); continue; }
  if(item.sku && variant.sku!==item.sku) findings.push({code:'SKU_MISMATCH',slug:item.slug,legacy:item.sku,canonical:variant.sku});
  if(item.dose && variant.label!==item.dose) findings.push({code:'LABEL_MISMATCH',slug:item.slug,legacy:item.dose,canonical:variant.label});
}

if(findings.length){
  console.error(JSON.stringify({status:'fail',items:items.length,findings},null,2));
  process.exit(1);
}
console.log(JSON.stringify({status:'pass',items:items.length,commerceCoreResolved:items.length,fallback:0},null,2));
