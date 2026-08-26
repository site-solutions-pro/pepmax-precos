# Shop Route Migration Plan

## Current state

`shop/index.html` is currently only a meta-refresh redirect to `../peptides/`. The effective catalog UI lives in `peptides/index.html` and is backed by `peptides/assets/catalog.js`.

## Target state

The `/shop/` route becomes the canonical commercial storefront route and consumes the Commerce Core public snapshot in read-only mode. `/peptides/` remains available during migration for compatibility and may later become a product-library route or redirect according to the multilingual/content architecture.

## Safe migration order

1. Keep `/shop/` redirect unchanged while A5 validates Home parity.
2. Add Commerce Core adapter loading to the effective catalog at `/peptides/` without removing the legacy catalog.
3. Validate 100 products / 179 variants / price and SKU parity.
4. Promote `/shop/` to the actual catalog shell only after A5 passes.
5. Preserve `/peptides/` compatibility with explicit redirects or route ownership.
6. Migrate product pages and cart after Shop parity is green.

## Gates

- No silent public price changes.
- No SKU invention for the 30 variants currently lacking SKU.
- No private fields in public assets.
- No removal of legacy fallback before A5 approval.
- PT/EN/ES routing must be reconciled before final route promotion.
