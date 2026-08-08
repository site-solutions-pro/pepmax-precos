import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join} from "node:path";

const root=new URL("../",import.meta.url).pathname;
const catalog=readFileSync(join(root,"peptides/assets/catalog.js"),"utf8");
const productLine=catalog.split("\n",1)[0];
const products=JSON.parse(productLine.slice("const PRODUCTS=".length,-1));
const escape=value=>String(value).replace(/[&<>\"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

const page=product=>`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><meta name="description" content="${escape(product.name)} PepMax: ficha molecular, fontes e apresentações para pesquisa laboratorial."><title>${escape(product.name)} | PepMax</title><link rel="alternate" hreflang="pt" href="./?lang=pt"><link rel="alternate" hreflang="en" href="./?lang=en"><link rel="alternate" hreflang="es" href="./?lang=es"><link rel="stylesheet" href="../assets/styles.css?v=20260808-trilingual1"></head><body data-section="product" data-product="${escape(product.slug)}"><div class="research-strip"><div class="wrap"><strong data-i18n="global.research">Exclusivamente para pesquisa laboratorial e uso analítico.</strong></div></div><header class="top"><div class="wrap"><a class="logo" href="../../">Pep<span>Max</span></a><nav class="nav"><a href="../../" data-i18n="nav.home">Home</a><a href="../../shop/" data-i18n="nav.shop">Shop</a><a href="../" data-i18n="nav.molecules">Moléculas</a><a href="../../faqs/" data-i18n="nav.faq">FAQs</a><a href="../../politicas/" data-i18n="nav.policies">Políticas</a><label class="language-control"><span data-i18n="lang.label">Idioma</span><select data-language-select><option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option></select></label><a class="nav-cart" href="../../shop/#checkout" data-i18n-aria-label="nav.cart"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6"/></svg><span class="nav-cart-count">0</span></a></nav></div></header><div class="wrap crumbs"><a href="../" data-i18n="nav.molecules">Moléculas</a> / ${escape(product.name)}</div><main class="wrap product" id="product"></main><footer class="legal"><div class="wrap"><span data-i18n="footer.legal">Materiais exclusivamente para pesquisa laboratorial.</span> · <a href="../../politicas/" data-i18n="nav.policies">Políticas</a> · <a href="../../faqs/" data-i18n="nav.faq">FAQs</a></div></footer><script src="../../assets/site-i18n.js?v=20260808-trilingual1"></script><script src="../assets/catalog.js?v=20260808-trilingual1"></script><script>detail(${JSON.stringify(product.slug)})</script></body></html>\n`;

for(const product of products){
  const dir=join(root,"peptides",product.slug);
  mkdirSync(dir,{recursive:true});
  writeFileSync(join(dir,"index.html"),page(product));
}
writeFileSync(join(root,"peptides/product-template.html"),page({slug:"SLUG",name:"PRODUCT_NAME"}));
console.log(`Generated ${products.length} product pages.`);
