# Codex Work Order — PepMax Image Mass Swap

## Branch
`agent/codex-image-mass-swap`

## Mission
Execute a safe bulk migration of PepMax storefront imagery using the canonical 100-product / 179-variant catalog, without changing commercial prices, inventing SKUs, leaking private data, or bypassing A5 QA.

## Inputs
- `commerce-core/catalog/image-matrix.generated.json`
- `commerce-core/catalog/products.generated.json`
- `commerce-core/catalog/public.generated.json`
- `peptides/assets/catalog.js`
- `peptides/assets/catalog-image-standard.css`
- `peptides/assets/variant-vial-sync.js`
- approved image assets under `peptides/assets/images/`
- Issue #25

## Non-negotiable rules
1. Do not write directly to `main`.
2. Do not silently change price, SKU, product name, presentation or cart identity.
3. Do not invent any of the currently missing SKUs.
4. Do not publish supplier cost, supplier identity, private margin or credentials.
5. Do not use SVG/cartoon/generated vial art as a final approved product photograph.
6. Do not distort approved photography. Use `object-fit: contain`; no scaleX/scaleY stretching.
7. Every variant selector must keep image/presentation/SKU/price/cart state synchronized.
8. Keep research-only positioning; do not add human-use dosing, protocol, reconstitution or administration guidance.
9. A5 QA is mandatory before integration back to `feat/commerce-core-v1`.

## Execution plan

### Phase 1 — approved photography variants
Prioritize the six products with an approved base photograph:
- ACE-031
- BPC-157
- MOTS-c
- Retatrutida
- Tesamorelina
- Tirzepatida

For every sellable variant:
- derive target path from `image-matrix.generated.json`;
- prefer one real `.webp` asset per SKU/presentation when an approved source can be materialized safely;
- if variant-specific binary materialization is not possible without degrading the approved image, preserve the approved base photo and use a deterministic presentation label layer in the storefront;
- never alter the underlying canonical price/SKU data merely to fit an image naming convention.

### Phase 2 — remaining catalog
For products without an approved photograph:
- remove any synthetic/cartoon vial from the public final-photo path;
- use the neutral `Imagem em produção` state;
- keep their target variant paths in the image matrix for future photography batches;
- do not pretend placeholder art is approved photography.

### Phase 3 — storefront synchronization
Verify all 100 product pages and the catalog route:
- initial `?sku=` or `?dose=` resolves the correct selected presentation;
- selector change updates visible presentation image/label;
- selected SKU is correct;
- selected price is correct;
- URL state is correct;
- cart line receives the correct variant key and quantity;
- image alt reflects product + selected presentation;
- desktop and mobile preserve vial aspect ratio.

### Phase 4 — automated QA
Add or extend deterministic checks so CI blocks on:
- missing product-page sync script/style;
- duplicate assigned SKU;
- variant count drift from 179;
- product count drift from 100;
- mismatch between image matrix and canonical variant identity;
- approved photo stretched by CSS transforms;
- synthetic generated assets marked as approved/final;
- selector/image/SKU/price/cart mismatch for at least the six approved-photo products.

## Acceptance criteria
- 100/100 product pages use the same image/variant contract.
- 179/179 variants exist in the image matrix.
- 6 approved-photo products pass full selector-image-SKU-price-cart QA across all of their variants.
- All remaining products show a consistent neutral photography-pending state instead of inconsistent vial art.
- No public price/SKU change unless already present in canonical catalog.
- CI green on the completed branch.
- Produce a concise report with counts: products checked, variants checked, approved-photo variants, photography-pending variants, blocking findings.

## Handoff
When complete:
1. open a PR from `agent/codex-image-mass-swap` into `feat/commerce-core-v1`;
2. link Issue #25;
3. do not merge automatically;
4. request A5 review/gate.
