import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root=process.cwd();
const catalogPath=join(root,"peptides","assets","catalog.js");
const read=file=>readFileSync(file,"utf8");
const productsFrom=source=>{
  const firstLine=source.split(/\r?\n/,1)[0];
  if(!firstLine.startsWith("const PRODUCTS=")||!firstLine.endsWith(";")) throw new Error("Catalog PRODUCT data is not the first complete line.");
  return JSON.parse(firstLine.slice("const PRODUCTS=".length,-1));
};
const currentSource=read(catalogPath);
const baselineSource=execFileSync("git",["show","origin/main:peptides/assets/catalog.js"],{cwd:root,encoding:"utf8"});
const current=productsFrom(currentSource);
const baseline=productsFrom(baselineSource);
const fail=message=>{throw new Error(message)};

if(current.length!==100) fail(`Expected 100 products, got ${current.length}`);
const variants=current.flatMap(product=>product.items.map(item=>({product,item})));
if(variants.length!==179) fail(`Expected 179 variants, got ${variants.length}`);
if(JSON.stringify(current)!==JSON.stringify(baseline)) fail("Catalog price, SKU, presentation, or product data differs from origin/main.");

const assigned=variants.filter(({item:[sku]})=>sku&&sku!=="-"&&sku!=="—");
const skuCounts=new Map();
for(const {item:[sku]} of assigned) skuCounts.set(sku,(skuCounts.get(sku)||0)+1);
const duplicate=[...skuCounts].filter(([,count])=>count>1);
if(duplicate.length) fail(`Duplicate assigned SKU(s): ${duplicate.map(([sku])=>sku).join(", ")}`);

const approved={
  "ace-031":{AE1:"variants/ace-031/ae1.png"},
  "bpc-157":{BC5:"variants/bpc-157/bc5.webp",BC10:"variants/bpc-157/bc10-generated.png",BC20:"variants/bpc-157/bc20-generated.png"},
  "mots-c":{MS10:"variants/mots-c/ms10.webp",MS40:"variants/mots-c/ms40-generated.png"},
  "retatrutida":{RT5:"variants/retatrutida/rt5.webp",RT10:"variants/retatrutida/rt10-generated.png",RT15:"variants/retatrutida/rt15-generated.png",RT20:"variants/retatrutida/rt20-generated.png",RT30:"variants/retatrutida/rt30-generated.png",RT40:"variants/retatrutida/rt40-generated.png",RT50:"variants/retatrutida/rt50-generated.png",RT60:"variants/retatrutida/rt60-generated.png"},
  "tesamorelina":{TSM5:"variants/tesamorelina/tsm5-generated.png",TSM10:"variants/tesamorelina/tsm10.webp",TSM20:"variants/tesamorelina/tsm20-generated.png"},
  "tirzepatida":{TR5:"variants/tirzepatida/tr5.webp",TR10:"variants/tirzepatida/tr10-generated.png",TR15:"variants/tirzepatida/tr15-generated.png",TR20:"variants/tirzepatida/tr20-generated.png",TR30:"variants/tirzepatida/tr30-generated.png",TR40:"variants/tirzepatida/tr40-generated.png",TR50:"variants/tirzepatida/tr50-generated.png",TR60:"variants/tirzepatida/tr60-generated.png",TR80:"variants/tirzepatida/tr80-generated.png",TR100:"variants/tirzepatida/tr100-generated.png"}
};
for(const [slug,bySku] of Object.entries(approved)){
  const product=current.find(entry=>entry.slug===slug);
  if(!product) fail(`Missing approved product ${slug}`);
  if(product.items.length!==Object.keys(bySku).length) fail(`Approved product ${slug} does not map every catalog variant to an image asset.`);
  for(const [sku,asset] of Object.entries(bySku)){
    if(!product.items.some(item=>item[0]===sku)) fail(`Approved SKU ${sku} is absent from ${slug}`);
    if(!currentSource.includes(`${sku}:"${asset}"`)) fail(`Approved SKU to image mapping missing: ${sku} -> ${asset}`);
    if(!existsSync(join(root,"peptides","assets","images",asset))) fail(`Mapped public image missing: ${asset}`);
  }
}

const generatedBatchOne={
  "ara-290":{RA10:"generated/ara-290/ra10.png"},
  "b7-33":{"2-mg":"generated/b7-33/2-mg.png","10-mg":"generated/b7-33/10-mg.png"}
};
for(const [slug,byKey] of Object.entries(generatedBatchOne)){
  const product=current.find(entry=>entry.slug===slug);
  if(!product) fail(`Missing generated-image product ${slug}`);
  for(const [key,asset] of Object.entries(byKey)){
    if(!currentSource.includes(`${JSON.stringify(key)}:"${asset}"`)&&!currentSource.includes(`${key}:"${asset}"`)) fail(`Generated image mapping missing: ${slug} ${key} -> ${asset}`);
    if(!existsSync(join(root,"peptides","assets","images",asset))) fail(`Generated public image missing: ${asset}`);
  }
}
const b733=current.find(product=>product.slug==="b7-33");
if(!b733||b733.items.some(item=>item[0]!=="—")) fail("B7-33 SKU assignment changed.");

const bpc=current.find(product=>product.slug==="bpc-157");
if(JSON.stringify(bpc.items.map(item=>item[0]))!==JSON.stringify(["BC5","BC10","BC20"])) fail("BPC-157 SKU order changed.");
if(!currentSource.includes('"bpc-157":Object.freeze({BC5:"variants/bpc-157/bc5.webp",BC10:"variants/bpc-157/bc10-generated.png",BC20:"variants/bpc-157/bc20-generated.png"})')) fail("BPC-157 image mappings are incomplete.");

for(const forbidden of ["<span class=\"vial-dose","vial-dose{","scaleX(","scale(.804357"]){
  for(const file of [catalogPath,join(root,"peptides","assets","catalog-image-standard.css"),join(root,"peptides","assets","styles.css")]){
    if(read(file).includes(forbidden)) fail(`Forbidden overlay or distortion token ${forbidden} in ${file}`);
  }
}
if(!read(join(root,"peptides","assets","catalog-image-standard.css")).includes("transform:scaleY(1.2)!important")) fail("The requested 20% vertical vial adjustment is missing.");
if(!currentSource.includes('data-image-status="pending"')||!currentSource.includes("Imagem em produ")) fail("Neutral pending-photography fallback is missing.");
for(const requiredContract of [
  'const cartKey=(p,item)=>{',
  'return isAssignedSku(sku)?sku:`${p.slug}|${item[1]}`;',
  'history.replaceState(null,"",sku&&sku!=="—"?`?sku=${encodeURIComponent(sku)}`:`?dose=${encodeURIComponent(item[1])}`);draw()',
  'const key=cartKey(p,x);',
  'cart[key]=(Number(cart[key])||0)+qty;',
  'const productImage=(p,item=p.items[0])=>{'
]) if(!currentSource.includes(requiredContract)) fail(`Variant URL, cart, or image synchronization contract missing: ${requiredContract}`);

const pages=[join(root,"peptides","index.html"),...readdirSync(join(root,"peptides"),{withFileTypes:true}).filter(entry=>entry.isDirectory()&&existsSync(join(root,"peptides",entry.name,"index.html"))).map(entry=>join(root,"peptides",entry.name,"index.html"))];
if(pages.length!==101) fail(`Expected 101 public index pages, got ${pages.length}`);
for(const page of pages){
  if(!existsSync(page)||!read(page).includes("20260828-generated-catalog-batch-3")) fail(`Missing hotfix cache revision: ${page}`);
}
const publicText=pages.map(read).join("\n")+currentSource;
if(/(?:sk_live_|whsec_|PRIVATE_KEY|BEGIN (?:RSA )?PRIVATE KEY)/i.test(publicText)) fail("Private credential-like value found in public files.");
console.log(`PASS: ${current.length} products, ${variants.length} variants, ${assigned.length} assigned SKUs, ${Object.values(approved).reduce((n,entry)=>n+Object.keys(entry).length,0)} mapped SKU image assets; prices/SKUs/presentations match origin/main.`);
