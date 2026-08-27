# Handoff — geração de imagens do catálogo PepMAX

Data: 2026-08-27

## Estado publicado

PRs já mescladas na `main`:

- `f1a794b` — imagens BPC-157/ACE e ajuste visual.
- `bf30223` — imagens por SKU das 27 variantes de BPC-157, ACE-031, MOTS-c, Retatrutida, Tesamorelina e Tirzepatida.

Essa publicação preserva preços, SKUs, apresentações, URL e carrinho.

## Trabalho em andamento

Branch: `feat/generated-catalog-images-all-variants`

- `a1ff398` — 9 assets gerados.
- `244d3b0` — 6 assets gerados.
- `b1b35be` — vincula os primeiros 15 assets ao storefront e atualiza cache.
- `ff52227` — 3 assets gerados, ainda sem vínculo.

Não existe Pull Request aberta para esta branch.

## Assets já aplicados

Arquivos: `peptides/assets/images/generated/`.
Mapa: `peptides/assets/catalog.js`, em `APPROVED_VARIANT_IMAGES`.

- 5-Amino-1MQ: 5AM, 10AM, 50AM
- ACTH 1-39: token técnico `5-mg` (sem SKU)
- Adamax: AD5
- Adipotide: AP2, AP5, AP10
- AHK-Cu: AU50, AU100
- AICAR: AR50, AR100
- Alprostadil: PRO20
- AOD-9604: 5AD, 10AD

`approvedVariantImage()` aceita SKU; sem SKU, usa `variantToken(item)`, o token de apresentação. Nunca inventar SKU.

## Gerados, ainda não aplicados

- Ara-290: RA10 → `generated/ara-290/ra10.png`
- B7-33: 2 mg → `generated/b7-33/2-mg.png`
- B7-33: 10 mg → `generated/b7-33/10-mg.png`

Para aplicá-los, adicione os mapas em `APPROVED_VARIANT_IMAGES` e incremente a revisão de cache em todas as 101 páginas `peptides/**/index.html`.

## Próximos assets

Use `peptides/assets/images/variants/bpc-157/bc5.webp` como referência no built-in `image_gen`, em modo de edição. Preserve cap, vial, logo, label azul/verde, fundo branco, enquadramento, luz e sombra; altere somente nome do produto e dose impressos no rótulo. Sem overlay, recorte, distorção, watermark, SVG ou cartoon.

Salvar em `peptides/assets/images/generated/<slug>/<sku-em-minusculas-ou-token>.png`, sem sobrescrever arquivos existentes.

## Validação e publicação

Executar `node tools/validate-real-vial-images.mjs` e `git diff --check` antes de uma PR. O validador deve manter 100 produtos, 179 variantes e dados comerciais idênticos à `origin/main`.

Fazer commits pequenos por lote, enviar a branch e abrir PR para `main`. Não fazer merge sem autorização explícita. Registrar que os novos arquivos são imagens geradas, não fotografias de origem.
