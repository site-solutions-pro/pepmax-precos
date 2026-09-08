import { test, expect } from '@playwright/test';

const homes = [
  { path: '/', lang: 'es', label: /Exclusivamente para investigación de laboratorio/i },
  { path: '/pt/', lang: 'pt-BR', label: /Exclusivamente para pesquisa laboratorial/i },
  { path: '/en/', lang: 'en', label: /Exclusively for laboratory research/i }
];

for (const locale of homes) {
  test(`${locale.lang} home loads with research-only framing`, async ({ page }) => {
    await page.goto(locale.path);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(page.locator('.research-bar')).toContainText(locale.label);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
}

const storefronts = [
  { shop: '/shop/', catalog: '/peptides/', lang: 'es', search: /Buscar por nombre, presentación o SKU/i },
  { shop: '/pt/shop/', catalog: '/pt/peptides/', lang: 'pt-BR', search: /Buscar por nome, apresentação ou SKU/i },
  { shop: '/en/shop/', catalog: '/en/peptides/', lang: 'en', search: /Search by name, presentation or SKU/i }
];

for (const locale of storefronts) {
  test(`${locale.lang} shop and catalog keep locale parity`, async ({ page }) => {
    for (const path of [locale.shop, locale.catalog]) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
      await expect(page.locator('#storeSearch')).toHaveAttribute('placeholder', locale.search);
      await expect(page.locator('#storeGrid .product-card').first()).toBeVisible();
      await expect(page.locator('.product-card').first().locator('.variant-select')).toBeVisible();
      await expect(page.locator('.product-card').first().locator('[data-price]')).toContainText('$');
    }
  });
}

test('Spanish remains the default root locale', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('a[lang="es"]')).toHaveAttribute('aria-current', 'page');
});

test('language links are present on the Spanish home', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[lang="es"]')).toBeVisible();
  await expect(page.locator('a[lang="pt-BR"]')).toBeVisible();
  await expect(page.locator('a[lang="en"]')).toBeVisible();
});

test('shop search filters and quick view open correctly', async ({ page }) => {
  await page.goto('/shop/');
  const initialCount = await page.locator('#storeGrid .product-card').count();
  expect(initialCount).toBeGreaterThan(50);
  await page.locator('#storeSearch').fill('BPC-157');
  await expect(page.locator('#storeGrid .product-card:visible')).toHaveCount(2);
  await page.locator('#storeGrid .product-card:visible').first().locator('.quick').click();
  await expect(page.locator('.modal.open')).toBeVisible();
});

test('cart keeps the selected catalog presentation', async ({ page }) => {
  await page.goto('/shop/');
  const first = page.locator('#storeGrid .product-card').first();
  const selected = await first.locator('.variant-select').inputValue();
  await first.locator('.add').click();
  await expect(page.locator('.cart-drawer.open')).toBeVisible();
  await expect(page.locator('[data-cart-count]').first()).toHaveText('1');
  expect(selected).toBe('0');
});

test('storefront uses black, magenta and matrix-green design tokens', async ({ page }) => {
  await page.goto('/shop/');
  const vars = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return { bg: s.getPropertyValue('--bg').trim(), magenta: s.getPropertyValue('--magenta').trim(), matrix: s.getPropertyValue('--matrix').trim() };
  });
  expect(vars.bg).toBe('#050505');
  expect(vars.magenta).toBe('#ff2aa8');
  expect(vars.matrix).toBe('#55ff55');
});

test('public storefront avoids human-use marketing language', async ({ page }) => {
  for (const path of ['/shop/', '/pt/shop/', '/en/shop/', '/peptides/', '/pt/peptides/', '/en/peptides/']) {
    await page.goto(path);
    const text = (await page.locator('body').innerText()).toLowerCase();
    const forbidden = [
      'tratamiento', 'terapia', 'dosificación', 'dosis recomendada', 'autoaplicación',
      'weight loss', 'treatment', 'dosage', 'recommended dose',
      'tratamento', 'dosagem', 'dose recomendada'
    ];
    for (const term of forbidden) expect(text).not.toContain(term);
  }
});

test('visible product technical links resolve without 404', async ({ page }) => {
  await page.goto('/shop/');
  const links = await page.locator('.product-card a.product-image').evaluateAll((nodes) => nodes.slice(0, 12).map((n) => n.getAttribute('href')).filter(Boolean));
  for (const href of links) {
    const response = await page.request.get(new URL(href, page.url()).toString());
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});
