import { test, expect } from '@playwright/test';

const locales = [
  { path: '/', lang: 'es', label: /Exclusivamente para investigación de laboratorio/i },
  { path: '/pt/', lang: 'pt-BR', label: /Exclusivamente para pesquisa laboratorial/i },
  { path: '/en/', lang: 'en', label: /Exclusively for laboratory research/i }
];

for (const locale of locales) {
  test(`${locale.lang} home loads with research-only framing`, async ({ page }) => {
    await page.goto(locale.path);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(page.locator('.research-bar')).toContainText(locale.label);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
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

test('catalog and cart entry points remain reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="./peptides/"]').first()).toBeVisible();
  await expect(page.locator('a[href="./shop/"]').first()).toBeVisible();
  await expect(page.locator('a[href="./shop/#checkout"]')).toBeVisible();
});

test('public home avoids human-use marketing language', async ({ page }) => {
  await page.goto('/');
  const text = (await page.locator('body').innerText()).toLowerCase();
  const forbidden = [
    'tratamiento', 'terapia', 'dosificación', 'dosis recomendada', 'autoaplicación',
    'weight loss', 'treatment', 'dosage', 'recommended dose',
    'tratamento', 'dosagem', 'dose recomendada'
  ];
  for (const term of forbidden) expect(text).not.toContain(term);
});

test('featured product links resolve without 404', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('.product-card').evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')).filter(Boolean));
  for (const href of links) {
    const response = await page.request.get(new URL(href, page.url()).toString());
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});
