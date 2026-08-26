import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const catalogPath = path.join(root, 'peptides', 'assets', 'catalog.js');
const outputPath = process.argv[2] || path.join(root, 'commerce-core', 'catalog', 'image-matrix.generated.json');
const source = fs.readFileSync(catalogPath, 'utf8');
const marker = 'const PRODUCTS=';
const start = source.indexOf(marker);
const end = source.indexOf(';', start + marker.length);
if (start < 0 || end < 0) throw new Error('PRODUCTS declaration not found');
const products = vm.runInNewContext(`(${source.slice(start + marker.length, end)})`);

const approved = new Map([
  ['ace-031', 'ace-031-approved.webp'],
  ['bpc-157', 'bpc-157-approved.webp'],
  ['mots-c', 'mots-c-approved.webp'],
  ['retatrutida', 'retatrutida-approved.webp'],
  ['tesamorelina', 'tesamorelina-approved-v2.webp'],
  ['tirzepatida', 'tirzepatida-approved.webp']
]);

const slugToken = (value) => String(value)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const rows = [];
for (const product of products) {
  for (const item of product.items) {
    const [rawSku, presentation, price] = item;
    const sku = String(rawSku || '').trim();
    const assignedSku = sku && sku !== '—' && sku !== '-';
    const variantToken = assignedSku ? sku.toLowerCase() : slugToken(presentation);
    const targetRelative = `peptides/assets/images/variants/${product.slug}/${variantToken}.webp`;
    const targetExists = fs.existsSync(path.join(root, targetRelative));
    rows.push({
      product: product.name,
      slug: product.slug,
      sku: assignedSku ? sku : null,
      presentation,
      price,
      approvedBaseImage: approved.get(product.slug) || null,
      targetImage: targetRelative,
      status: targetExists ? 'variant-ready' : approved.has(product.slug) ? 'base-photo-approved-variant-pending' : 'photography-pending'
    });
  }
}

const summary = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] || 0) + 1;
  return acc;
}, {});

const payload = {
  schemaVersion: 1,
  products: products.length,
  variants: rows.length,
  summary,
  rules: {
    finalAssetFormat: 'webp',
    sourceOfTruth: 'variant/SKU',
    noSyntheticFinalPhotography: true,
    preserveApprovedBaseGeometry: true,
    missingSkuPolicy: 'use presentation token until commercial SKU is approved; do not invent SKU'
  },
  variants: rows
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify({ products: payload.products, variants: payload.variants.length, summary }, null, 2));
