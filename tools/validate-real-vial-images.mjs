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
  "bpc-157":{BC5:"variants/bpc-157/bc5.webp"},
  "mots-c":{MS10:"variants/mots-c/ms10.webp"},
  "retatrutida":{RT5:"variants/retatrutida/rt5.webp"},
  "tesamorelina":{TSM10:"variants/tesamorelina/tsm10.webp"},
  "tirzepatida":{TR5:"variants/tirzepatida/tr5.webp"}
};
for(const [slug,bySku] of Object.entries(approved)){
  const product=current.find(entry=>entry.slug===slug);
  if(!product) fail(`Missing approved product ${slug}`);
  for(const [sku,asset] of Object.entries(bySku)){
    if(!product.items.some(item=>item[0]===sku)) fail(`Approved SKU ${sku} is absent from ${slug}`);
    if(!currentSource.includes(`${sku}:"${asset}"`)) fail(`Approved SKU to image mapping missing: ${sku} -> ${asset}`);
    if(!existsSync(join(root,"peptides","assets","images",asset))) fail(`Mapped public image missing: ${asset}`);
  }
}

const bpc=current.find(product=>product.slug==="bpc-157");
if(JSON.stringify(bpc.items.map(item=>item[0]))!==JSON.stringify(["BC5","BC10","BC20"])) fail("BPC-157 SKU order changed.");
if(!currentSource.includes('"bpc-157":Object.freeze({BC5:"variants/bpc-157/bc5.webp"})')) fail("BPC-157 must expose only verified BC5 photography.");
if(currentSource.includes('BC10:"variants/bpc-157/')||currentSource.includes('BC20:"variants/bpc-157/')) fail("BPC-157 unverified image is marked final.");

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
  if(!existsSync(page)||!read(page).includes("20260827-ace-real-source1")) fail(`Missing hotfix cache revision: ${page}`);
}
const publicText=pages.map(read).join("\n")+currentSource;
if(/(?:sk_live_|whsec_|PRIVATE_KEY|BEGIN (?:RSA )?PRIVATE KEY)/i.test(publicText)) fail("Private credential-like value found in public files.");
console.log(`PASS: ${current.length} products, ${variants.length} variants, ${assigned.length} assigned SKUs, ${Object.values(approved).reduce((n,entry)=>n+Object.keys(entry).length,0)} verified final SKU images; prices/SKUs/presentations match origin/main.`);
