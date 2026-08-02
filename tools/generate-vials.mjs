import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const shopPath = path.join(root, 'shop', 'index.html');
const outputDir = path.join(root, 'peptides', 'assets', 'images', 'generated');
const html = fs.readFileSync(shopPath, 'utf8');

const catMatch = html.match(/const CAT = (\[.*?\]);\nconst /s);
if (!catMatch) throw new Error('Catalogo CAT nao encontrado em shop/index.html');
const catalog = JSON.parse(catMatch[1]);

const mapMatch = html.match(/const PRODUCT_IMAGES = Object\.freeze\((\{.*?\})\);/s);
if (!mapMatch) throw new Error('PRODUCT_IMAGES nao encontrado');
const existing = Function(`"use strict";return (${mapMatch[1]})`)();
const missing = catalog.filter(product => !existing[product.n]);

if (missing.length !== 95) {
  throw new Error(`Esperadas 95 imagens pendentes; encontradas ${missing.length}. Revise o catalogo antes de publicar.`);
}

fs.mkdirSync(outputDir, { recursive: true });

const palettes = [
  ['#1556a3','#29d6e5','#6f42c1'],
  ['#6f42c1','#b32975','#29d6e5'],
  ['#16805d','#35d58b','#1556a3'],
  ['#b85c00','#e9a02a','#b32975'],
  ['#00788a','#29d6e5','#4f46b5'],
  ['#b12e3b','#d6379f','#6f42c1'],
  ['#233f7a','#4f46b5','#29d6e5'],
  ['#7b4a00','#e9a02a','#16805d']
];

const escapeXml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const slugify = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\+/g,'-plus-').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const hash = value => [...String(value)].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 2166136261);

function makeSvg(product, index) {
  const dose = product.p?.[0]?.d || 'Research';
  const name = escapeXml(product.n);
  const safeDose = escapeXml(dose);
  const palette = palettes[hash(product.n) % palettes.length];
  const fontSize = product.n.length > 28 ? 34 : product.n.length > 20 ? 40 : product.n.length > 14 ? 46 : 52;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1047" height="1502" viewBox="0 0 1047 1502" role="img" aria-labelledby="title desc">
<title id="title">Vial PepMAX ${name}</title><desc id="desc">${name}, ${safeDose}, for research use only.</desc>
<defs>
<linearGradient id="label" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette[0]}"/><stop offset=".5" stop-color="${palette[1]}"/><stop offset="1" stop-color="${palette[2]}"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#d9e3ec"/><stop offset=".15" stop-color="#ffffff"/><stop offset=".5" stop-color="#f8fbfd"/><stop offset=".85" stop-color="#ffffff"/><stop offset="1" stop-color="#c7d4df"/></linearGradient>
<linearGradient id="cap" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f2f5f8"/><stop offset="1" stop-color="#aab5c0"/></linearGradient>
<filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="34" stdDeviation="28" flood-color="#24364b" flood-opacity=".22"/></filter>
</defs>
<rect width="1047" height="1502" fill="#ffffff"/>
<ellipse cx="523.5" cy="1372" rx="285" ry="42" fill="#51657a" opacity=".13"/>
<g filter="url(#shadow)">
<rect x="326" y="116" width="395" height="172" rx="42" fill="url(#cap)" stroke="#8f9aa6" stroke-width="8"/>
<path d="M358 280h331l43 98v819c0 86-60 146-146 146H461c-86 0-146-60-146-146V378z" fill="url(#glass)" stroke="#aebdca" stroke-width="10"/>
<path d="M356 319h335" stroke="#e9eef3" stroke-width="18" opacity=".9"/>
<rect x="327" y="519" width="393" height="566" rx="18" fill="#fff" stroke="#e4e9ee" stroke-width="4"/>
<rect x="327" y="519" width="393" height="46" fill="url(#label)"/>
<rect x="327" y="702" width="393" height="202" fill="url(#label)"/>
<text x="523.5" y="650" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="67" font-weight="800" fill="#173b68">Pep<tspan fill="${palette[0]}">MAX</tspan></text>
<text x="523.5" y="786" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="800" fill="#fff">${name}</text>
<text x="523.5" y="862" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="600" letter-spacing="4" fill="#fff">RESEARCH COMPOUND</text>
<text x="523.5" y="1001" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="64" font-weight="800" fill="${palette[0]}">${safeDose}</text>
<text x="523.5" y="1053" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="18" letter-spacing="3" fill="#41536a">FOR RESEARCH USE ONLY</text>
<text x="523.5" y="1126" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="15" letter-spacing="2" fill="#718096">PEPMAX / LOT ${String(index + 1).padStart(3,'0')}</text>
</g>
</svg>`;
}

const generatedMap = {};
missing.forEach((product, index) => {
  const slug = slugify(product.n);
  const relative = `../peptides/assets/images/generated/${slug}.svg`;
  generatedMap[product.n] = relative;
  fs.writeFileSync(path.join(outputDir, `${slug}.svg`), makeSvg(product, index));
});

const merged = {...existing, ...generatedMap};
const mapBody = Object.entries(merged).map(([name, image]) => `  ${JSON.stringify(name)}: ${JSON.stringify(image)}`).join(',\n');
const updated = html.replace(/const PRODUCT_IMAGES = Object\.freeze\(\{.*?\}\);/s, `const PRODUCT_IMAGES = Object.freeze({\n${mapBody}\n});`);
fs.writeFileSync(shopPath, updated);

fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify({generatedAt: new Date().toISOString(), count: missing.length, products: missing.map(p => ({name:p.n, dose:p.p?.[0]?.d || null, file:`${slugify(p.n)}.svg`}))}, null, 2));
console.log(`Geradas e aplicadas ${missing.length} imagens de vials.`);
