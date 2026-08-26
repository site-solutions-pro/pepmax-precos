import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const peptidesDir = path.join(root, 'peptides');
const version = '20260826-image-mass-swap1';

const dirs = fs.readdirSync(peptidesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'assets')
  .map((entry) => entry.name)
  .sort();

let changed = 0;
let scanned = 0;

for (const slug of dirs) {
  const file = path.join(peptidesDir, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  scanned += 1;
  const before = fs.readFileSync(file, 'utf8');
  let html = before;

  // Normalize the primary stylesheet cache key.
  html = html.replace(
    /\.\.\/assets\/styles\.css(?:\?v=[^\"']*)?/g,
    `../assets/styles.css?v=${version}`
  );

  // Ensure the shared visual-standard override is loaded on every product page.
  if (!html.includes('../assets/catalog-image-standard.css')) {
    html = html.replace(
      /(<link rel="stylesheet" href="\.\.\/assets\/styles\.css\?v=[^\"]+">)/,
      `$1<link rel="stylesheet" href="../assets/catalog-image-standard.css?v=${version}">`
    );
  } else {
    html = html.replace(
      /\.\.\/assets\/catalog-image-standard\.css(?:\?v=[^\"']*)?/g,
      `../assets/catalog-image-standard.css?v=${version}`
    );
  }

  // Normalize catalog.js cache key without changing product data.
  html = html.replace(
    /\.\.\/assets\/catalog\.js(?:\?v=[^\"']*)?/g,
    `../assets/catalog.js?v=${version}`
  );

  // Approved photographic assets use this helper so the selected presentation
  // is rendered into the actual displayed image. It only targets final-vial.
  if (!html.includes('../assets/variant-vial-sync.js')) {
    html = html.replace(
      /(<script src="\.\.\/assets\/catalog\.js\?v=[^\"]+"><\/script>)/,
      `$1<script src="../assets/variant-vial-sync.js?v=${version}"></script>`
    );
  } else {
    html = html.replace(
      /\.\.\/assets\/variant-vial-sync\.js(?:\?v=[^\"']*)?/g,
      `../assets/variant-vial-sync.js?v=${version}`
    );
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

if (scanned !== 100) {
  throw new Error(`Expected 100 product pages, scanned ${scanned}`);
}

console.log(`Product pages scanned: ${scanned}`);
console.log(`Product pages changed: ${changed}`);
