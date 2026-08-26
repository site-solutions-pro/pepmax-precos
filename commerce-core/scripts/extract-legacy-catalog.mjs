import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const sourcePath = process.argv[2] || 'peptides/assets/catalog.js';
const outputPath = process.argv[3] || 'commerce-core/catalog/products.generated.json';
const source = fs.readFileSync(sourcePath, 'utf8');

const marker = 'const PRODUCTS=';
const start = source.indexOf(marker);
if (start < 0) throw new Error(`PRODUCTS not found in ${sourcePath}`);

let cursor = start + marker.length;
while (/\s/.test(source[cursor])) cursor++;
if (source[cursor] !== '[') throw new Error('PRODUCTS must start with an array literal');

let depth = 0;
let quote = null;
let escape = false;
let end = -1;
for (let i = cursor; i < source.length; i++) {
  const ch = source[i];
  if (quote) {
    if (escape) escape = false;
    else if (ch === '\\') escape = true;
    else if (ch === quote) quote = null;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
  if (ch === '[') depth++;
  if (ch === ']') {
    depth--;
    if (depth === 0) { end = i + 1; break; }
  }
}
if (end < 0) throw new Error('Could not isolate PRODUCTS array');

const literal = source.slice(cursor, end);
const legacy = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
if (!Array.isArray(legacy)) throw new Error('Legacy PRODUCTS did not evaluate to an array');

const skuOwners = new Map();
const missingSku = [];
const duplicateSku = [];
const products = legacy.map((product) => {
  if (!product?.slug || !product?.name || !Array.isArray(product.items) || !product.items.length) {
    throw new Error(`Malformed legacy product: ${JSON.stringify(product)}`);
  }
  const variants = product.items.map((item, index) => {
    const [rawSku, label, price] = item;
    const sku = typeof rawSku === 'string' && rawSku.trim() && rawSku.trim() !== '—' ? rawSku.trim() : null;
    const variantId = `${product.slug}-${index + 1}`;
    if (!sku) missingSku.push({ slug: product.slug, variantId, label });
    else if (skuOwners.has(sku)) duplicateSku.push({ sku, first: skuOwners.get(sku), second: variantId });
    else skuOwners.set(sku, variantId);

    return {
      id: variantId,
      sku,
      label,
      price,
      currency: 'USD',
      active: true,
      inventory: { policy: 'untracked', available: 0, reserved: 0, reorderPoint: null }
    };
  });

  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    status: 'review',
    productType: 'other',
    public: {
      shortDescription: product.desc || '',
      image: null,
      altText: null,
      featured: false,
      searchTerms: []
    },
    variants,
    publication: { state: 'preview', approvedBy: null, approvedAt: null, version: 1 }
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  source: sourcePath,
  productCount: products.length,
  variantCount: products.reduce((sum, product) => sum + product.variants.length, 0),
  missingSku,
  duplicateSku
};

const payload = { version: 1, currency: 'USD', products, audit: report };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify(report, null, 2));
if (products.length !== 100) {
  console.error(`Expected 100 products; found ${products.length}`);
  process.exitCode = 2;
}
if (duplicateSku.length) {
  console.error(`Duplicate SKUs found: ${duplicateSku.length}`);
  process.exitCode = 3;
}
