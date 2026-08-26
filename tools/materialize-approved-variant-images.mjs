import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const matrixPath = path.join(root, 'commerce-core', 'catalog', 'image-matrix.generated.json');
const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
const checkOnly = process.argv.includes('--check');
let checked = 0;
let copied = 0;

for (const variant of matrix.variants) {
  if (!variant.approvedBaseImage) continue;
  if (!variant.sku) {
    throw new Error(`Approved-photo variant has no SKU: ${variant.slug} / ${variant.presentation}`);
  }

  const expectedSuffix = `/${variant.sku.toLowerCase()}.webp`;
  const normalizedTarget = variant.targetImage.replaceAll('\\', '/');
  if (!normalizedTarget.endsWith(expectedSuffix)) {
    throw new Error(`Variant target is not tied to SKU ${variant.sku}: ${variant.targetImage}`);
  }

  const source = path.join(root, 'peptides', 'assets', 'images', variant.approvedBaseImage);
  const target = path.join(root, variant.targetImage);
  if (!fs.existsSync(source)) throw new Error(`Approved base image missing: ${source}`);

  checked += 1;
  if (checkOnly) {
    if (!fs.existsSync(target)) throw new Error(`Variant image missing: ${variant.targetImage}`);
    if (!fs.readFileSync(source).equals(fs.readFileSync(target))) {
      throw new Error(`Variant image is not byte-preserved from approved source: ${variant.targetImage}`);
    }
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target) || !fs.readFileSync(source).equals(fs.readFileSync(target))) {
    fs.copyFileSync(source, target);
    copied += 1;
  }
}

console.log(JSON.stringify({ approvedVariantsChecked: checked, copied, checkOnly }, null, 2));
