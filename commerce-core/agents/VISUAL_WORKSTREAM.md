# PepMax Visual Asset Workstream

## Ownership

- O2 — Experience & Content Orchestrator
- A2 — Storefront implementation
- A5 — QA / parity gate
- O3 — release integration

## Objective

Bring all 100 product pages and 179 commercial variants to one visual standard without publishing synthetic/cartoon vial artwork as final photography.

## Rules

1. Approved photography is preserved without aspect-ratio distortion.
2. Variant selection must change the visible presentation (mg/mcg/IU/ml) and keep SKU/price/cart aligned.
3. A final variant asset is keyed by SKU when SKU exists.
4. Variants without approved SKU use a presentation token only for asset naming; no commercial SKU may be invented.
5. Products without approved photography display an honest `Imagem em produção` state.
6. New final assets are WebP and live under `peptides/assets/images/variants/<slug>/`.
7. A5 must validate every batch before release.

## Execution order

1. Normalize all 100 product pages to load the shared visual CSS and variant-sync helper.
2. Materialize the 100-product / 179-variant visual matrix.
3. Generate variant-specific assets for the six products with approved base photography.
4. QA those products across desktop/mobile and selector changes.
5. Produce remaining photography in batches, prioritizing Home and highest-traffic Shop items.
6. Replace `Imagem em produção` only after the individual asset passes QA.

## Current approved base photography

- ACE-031
- BPC-157
- MOTS-c
- Retatrutida
- Tesamorelina
- Tirzepatida
