import fs from 'node:fs';
import vm from 'node:vm';

const sourcePath = process.argv[2] || 'peptides/assets/catalog.js';
const text = fs.readFileSync(sourcePath, 'utf8');

const marker = 'const PRODUCTS=';
const start = text.indexOf(marker);
if (start < 0) throw new Error(`PRODUCTS declaration not found in ${sourcePath}`);

const expressionStart = start + marker.length;
const expressionEnd = text.indexOf(';', expressionStart);
if (expressionEnd < 0) throw new Error('Could not locate end of PRODUCTS declaration');

const expression = text.slice(expressionStart, expressionEnd);
const products = vm.runInNewContext(`(${expression})`, Object.create(null), { timeout: 1000 });
if (!Array.isArray(products)) throw new Error('PRODUCTS is not an array');

const issues = [];
const slugSeen = new Map();
const skuSeen = new Map();
let variantCount = 0;
let namedSkuCount = 0;
let unassignedSkuCount = 0;

for (const [productIndex, product] of products.entries()) {
  const where = `product[${productIndex}]`;
  if (!product || typeof product !== 'object') {
    issues.push({ severity: 'blocking', code: 'INVALID_PRODUCT', where });
    continue;
  }

  if (!product.slug || typeof product.slug !== 'string') {
    issues.push({ severity: 'blocking', code: 'MISSING_SLUG', where });
  } else if (slugSeen.has(product.slug)) {
    issues.push({ severity: 'blocking', code: 'DUPLICATE_SLUG', slug: product.slug, first: slugSeen.get(product.slug), second: where });
  } else {
    slugSeen.set(product.slug, where);
  }

  if (!product.name || typeof product.name !== 'string') {
    issues.push({ severity: 'blocking', code: 'MISSING_NAME', slug: product.slug ?? null, where });
  }

  if (!Array.isArray(product.items) || product.items.length === 0) {
    issues.push({ severity: 'blocking', code: 'MISSING_VARIANTS', slug: product.slug ?? null, where });
    continue;
  }

  for (const [variantIndex, item] of product.items.entries()) {
    variantCount += 1;
    const variantWhere = `${where}.items[${variantIndex}]`;
    if (!Array.isArray(item) || item.length < 3) {
      issues.push({ severity: 'blocking', code: 'INVALID_VARIANT', slug: product.slug ?? null, where: variantWhere });
      continue;
    }

    const [rawSku, label, price] = item;
    const sku = typeof rawSku === 'string' ? rawSku.trim() : '';
    const skuAssigned = sku && sku !== '—' && sku !== '-';

    if (skuAssigned) {
      namedSkuCount += 1;
      if (skuSeen.has(sku)) {
        issues.push({ severity: 'blocking', code: 'DUPLICATE_SKU', sku, first: skuSeen.get(sku), second: variantWhere });
      } else {
        skuSeen.set(sku, variantWhere);
      }
    } else {
      unassignedSkuCount += 1;
      issues.push({ severity: 'warning', code: 'UNASSIGNED_SKU', slug: product.slug ?? null, label: String(label ?? ''), where: variantWhere });
    }

    if (!label || typeof label !== 'string') {
      issues.push({ severity: 'blocking', code: 'MISSING_VARIANT_LABEL', slug: product.slug ?? null, where: variantWhere });
    }
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      issues.push({ severity: 'blocking', code: 'INVALID_PRICE', slug: product.slug ?? null, label: String(label ?? ''), price, where: variantWhere });
    }
  }
}

const blocking = issues.filter((issue) => issue.severity === 'blocking');
const warnings = issues.filter((issue) => issue.severity === 'warning');
const report = {
  source: sourcePath,
  products: products.length,
  variants: variantCount,
  namedSkus: namedSkuCount,
  unassignedSkus: unassignedSkuCount,
  blockingIssues: blocking.length,
  warnings: warnings.length,
  issues
};

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  console.log(`Catalog source: ${sourcePath}`);
  console.log(`Products: ${report.products}`);
  console.log(`Variants: ${report.variants}`);
  console.log(`Named SKUs: ${report.namedSkus}`);
  console.log(`Unassigned SKUs: ${report.unassignedSkus}`);
  console.log(`Blocking issues: ${report.blockingIssues}`);
  console.log(`Warnings: ${report.warnings}`);
  for (const issue of blocking) console.error(`[BLOCK] ${issue.code}: ${JSON.stringify(issue)}`);
  for (const issue of warnings) console.warn(`[WARN] ${issue.code}: ${JSON.stringify(issue)}`);
}

if (blocking.length) process.exit(1);
