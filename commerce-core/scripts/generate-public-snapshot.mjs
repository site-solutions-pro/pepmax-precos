import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'commerce-core/catalog/products.generated.json';
const outputPath = process.argv[3] || 'commerce-core/catalog/public.generated.json';
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

if (!Array.isArray(input.products)) throw new Error('Canonical catalog must contain products[]');

const forbiddenKeys = new Set([
  'private', 'supplier', 'supplierSku', 'cost', 'costCurrency', 'margin',
  'supplier_cost', 'supplier_id', 'private_margin', 'notes'
]);

const products = input.products.map((product) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  description: product.public?.shortDescription || '',
  image: product.public?.image ?? null,
  altText: product.public?.altText ?? null,
  featured: Boolean(product.public?.featured),
  variants: product.variants
    .filter((variant) => variant.active !== false)
    .map((variant) => ({
      id: variant.id,
      sku: variant.sku ?? null,
      label: variant.label,
      price: variant.price,
      currency: variant.currency,
      availability: variant.inventory?.policy === 'tracked'
        ? Math.max(0, Number(variant.inventory.available || 0) - Number(variant.inventory.reserved || 0))
        : null,
      inventoryPolicy: variant.inventory?.policy || 'untracked'
    }))
}));

const snapshot = {
  schemaVersion: 1,
  catalogVersion: input.version ?? 1,
  currency: input.currency || 'USD',
  productCount: products.length,
  variantCount: products.reduce((sum, product) => sum + product.variants.length, 0),
  products
};

function scan(value, trail = '$') {
  if (!value || typeof value !== 'object') return [];
  const hits = [];
  for (const [key, child] of Object.entries(value)) {
    const next = `${trail}.${key}`;
    if (forbiddenKeys.has(key)) hits.push(next);
    hits.push(...scan(child, next));
  }
  return hits;
}

const leaks = scan(snapshot);
if (leaks.length) throw new Error(`Private fields leaked into public snapshot: ${leaks.join(', ')}`);
if (snapshot.productCount !== input.products.length) throw new Error('Product parity failure');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Public snapshot OK: ${snapshot.productCount} products / ${snapshot.variantCount} variants`);
