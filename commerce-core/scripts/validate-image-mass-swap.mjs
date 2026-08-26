import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const catalogPath = path.join(root, 'peptides', 'assets', 'catalog.js');
const matrixPath = path.join(root, 'commerce-core', 'catalog', 'image-matrix.generated.json');
const approvedSlugs = new Set(['ace-031', 'bpc-157', 'mots-c', 'retatrutida', 'tesamorelina', 'tirzepatida']);
const forbiddenPublicFields = new Set(['private', 'supplier', 'supplierSku', 'cost', 'costCurrency', 'margin', 'notes', 'supplier_cost', 'supplier_id', 'private_margin']);

const parseProducts = source => {
  const marker = 'const PRODUCTS=';
  const start = source.indexOf(marker);
  const end = source.indexOf(';', start + marker.length);
  assert(start >= 0 && end >= 0, 'PRODUCTS declaration not found');
  return vm.runInNewContext(`(${source.slice(start + marker.length, end)})`);
};

const currentSource = fs.readFileSync(catalogPath, 'utf8');
const products = parseProducts(currentSource);
const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
const variants = products.flatMap(product => product.items.map((item, index) => ({ product, item, index })));
assert.equal(products.length, 100, 'Expected 100 products');
assert.equal(variants.length, 179, 'Expected 179 variants');
assert.equal(matrix.products, 100, 'Image matrix product count drift');
assert.equal(matrix.variants.length, 179, 'Image matrix variant count drift');

const assignedSku = value => {
  const sku = String(value || '').trim();
  return sku && sku !== '-' && sku !== '\u2014' ? sku : null;
};
const seenSkus = new Map();
for (const { product, item } of variants) {
  const sku = assignedSku(item[0]);
  if (!sku) continue;
  assert(!seenSkus.has(sku), `Duplicate SKU ${sku}: ${seenSkus.get(sku)} and ${product.slug}`);
  seenSkus.set(sku, product.slug);
}

const baselineArg = process.argv.find(arg => arg.startsWith('--baseline-ref='));
const baselineRef = baselineArg?.slice('--baseline-ref='.length) || process.env.BASELINE_REF || 'origin/feat/commerce-core-v1';
let baselineSource;
try {
  baselineSource = execFileSync('git', ['show', `${baselineRef}:peptides/assets/catalog.js`], { cwd: root, encoding: 'utf8' });
} catch (error) {
  throw new Error(`Cannot load price/SKU baseline ${baselineRef}: ${error.message}`);
}
const baselineProducts = parseProducts(baselineSource);
const commercialIdentity = list => list.flatMap(product => product.items.map((item, index) => ({
  slug: product.slug,
  index,
  sku: assignedSku(item[0]),
  presentation: item[1],
  price: item[2]
})));
assert.equal(
  JSON.stringify(commercialIdentity(products)),
  JSON.stringify(commercialIdentity(baselineProducts)),
  `Unauthorized SKU, presentation, or price drift from ${baselineRef}`
);

const fakeDocument = { querySelectorAll: () => [], querySelector: () => null };
const context = {
  document: fakeDocument,
  location: { pathname: '/pepmax-precos/peptides/example/' },
  localStorage: { getItem: () => null, setItem: () => {} },
  URLSearchParams,
  console
};
vm.runInNewContext(`${currentSource}\nglobalThis.__qa={PRODUCTS,variantViewModel,isAssignedSku,variantToken};`, context);
const storefront = context.__qa;

const matrixByIdentity = new Map(matrix.variants.map(row => [`${row.slug}|${row.sku || ''}|${row.presentation}`, row]));
let approvedVariants = 0;
let pendingVariants = 0;
for (const { product, item, index } of variants) {
  const sku = assignedSku(item[0]);
  const identity = `${product.slug}|${sku || ''}|${item[1]}`;
  const row = matrixByIdentity.get(identity);
  assert(row, `Image matrix identity missing: ${identity}`);
  assert.equal(row.price, item[2], `Image matrix price mismatch: ${identity}`);
  const view = storefront.variantViewModel(product, item, index);
  assert.equal(view.sku, sku, `View SKU mismatch: ${identity}`);
  assert.equal(view.presentation, item[1], `View presentation mismatch: ${identity}`);
  assert.equal(view.price, item[2], `View price mismatch: ${identity}`);
  assert(view.url.endsWith(view.query), `URL state mismatch: ${identity}`);
  assert.equal(view.cartKey, sku || `${product.slug}|${item[1]}`, `Cart identity mismatch: ${identity}`);
  assert(view.imageAlt.includes(item[1]), `Image alt missing presentation: ${identity}`);
  assert(view.imageMarkup.includes(`data-presentation="${item[1]}"`), `Visual presentation mismatch: ${identity}`);

  if (approvedSlugs.has(product.slug)) {
    approvedVariants += 1;
    assert.equal(row.status, 'variant-ready', `Approved variant is not ready: ${identity}`);
    assert(sku, `Approved-photo variant requires existing SKU: ${identity}`);
    assert(view.image?.endsWith(`/variants/${product.slug}/${sku.toLowerCase()}.webp`), `Image/SKU mismatch: ${identity}`);
    assert(view.imageMarkup.includes('<img class="final-vial"'), `Approved photo not rendered: ${identity}`);
    const source = path.join(root, 'peptides', 'assets', 'images', row.approvedBaseImage);
    const target = path.join(root, row.targetImage);
    assert(fs.existsSync(target), `Approved variant asset missing: ${row.targetImage}`);
    const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    assert.equal(digest(target), digest(source), `Approved photo bytes changed: ${row.targetImage}`);
  } else {
    pendingVariants += 1;
    assert.equal(row.status, 'photography-pending', `Pending photography status mismatch: ${identity}`);
    assert.equal(view.image, null, `Pending product exposes a final image path: ${identity}`);
    assert(!view.imageMarkup.includes('<img'), `Pending product renders synthetic/final image: ${identity}`);
    assert(view.imageMarkup.includes('Imagem em produ'), `Pending placeholder missing: ${identity}`);
  }
}
assert.equal(approvedVariants, 27, 'Expected 27 approved-photo variants');
assert.equal(pendingVariants, 152, 'Expected 152 photography-pending variants');

const css = fs.readFileSync(path.join(root, 'peptides', 'assets', 'catalog-image-standard.css'), 'utf8');
assert(/object-fit:contain!important/.test(css), 'Approved photography must use object-fit: contain');
assert(/background:#fff/.test(css), 'Approved photography must keep a white background');
assert(!/scale[XY]\s*\(/i.test(css), 'Photography distortion transform found');
const syncSource = fs.readFileSync(path.join(root, 'peptides', 'assets', 'variant-vial-sync.js'), 'utf8');
assert(!/canvas|toDataURL|drawImage/.test(syncSource), 'Variant sync must not rerasterize approved photography');
assert(/productImage\(selected\.product,selected\.item\)/.test(syncSource), 'Variant sync is not tied to selected image');

const productDirs = fs.readdirSync(path.join(root, 'peptides'), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && entry.name !== 'assets');
assert.equal(productDirs.length, 100, 'Expected 100 product directories');
for (const entry of productDirs) {
  const html = fs.readFileSync(path.join(root, 'peptides', entry.name, 'index.html'), 'utf8');
  assert(html.includes('../assets/catalog-image-standard.css'), `Image CSS missing: ${entry.name}`);
  assert(html.includes('../assets/variant-vial-sync.js'), `Variant sync missing: ${entry.name}`);
}

const publicSnapshot = JSON.parse(fs.readFileSync(path.join(root, 'commerce-core', 'catalog', 'public.generated.json'), 'utf8'));
const walk = value => {
  if (Array.isArray(value)) return value.forEach(walk);
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert(!forbiddenPublicFields.has(key), `Private field exposed in public snapshot: ${key}`);
    walk(child);
  }
};
walk(publicSnapshot);

console.log(JSON.stringify({
  status: 'pass',
  products: products.length,
  variants: variants.length,
  namedSkus: seenSkus.size,
  missingSkus: variants.length - seenSkus.size,
  duplicateSkus: 0,
  approvedPhotoProducts: approvedSlugs.size,
  approvedPhotoVariants: approvedVariants,
  photographyPendingVariants: pendingVariants,
  commercialBaseline: baselineRef,
  priceSkuPresentationDrift: 0,
  productPagesChecked: productDirs.length,
  privateFieldsExposed: 0
}, null, 2));
