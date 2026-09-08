# ProfoundAminos UI reference audit

Reference: https://profoundaminos.com/

## Goal
Use structural and interaction patterns as inspiration for PepMAX without copying brand identity, wording, logos, proprietary graphics, or distinctive composition. PepMAX remains ES-first, research-only, commercial, and visually biotech/biohack.

## Patterns to adapt

1. Announcement strip above navigation for controlled catalog/shipping/commercial notices.
2. Conversion-focused header with Shop, support/contact, language selector, and persistent cart access.
3. Hero with one primary Shop CTA, one secondary documentation/library CTA, and short proof points.
4. Trust/evidence layer only when supported by real PepMAX documentation; never invent purity, COA, HPLC, or batch-testing claims.
5. Product discovery on the home with curated featured/new compounds and direct product access.
6. Search-first Shop with search, categories/filters, result count, and useful tabs.
7. Variant selection close to cards for compounds with multiple presentations.
8. Quick View drawer/modal for image, presentation, SKU, price, availability, quantity, and Add to Cart; no duplicate product-detail page.
9. Persistent cart count and obvious quantity controls on desktop/mobile.
10. Commercial capture/newsletter pattern may be considered later, but no discount mechanics without explicit approval.
11. Research-only restrictions remain visible but concise so they do not overwhelm the commercial experience.

## Patterns not to copy

- Profound brand identity, copy, logo, imagery, icons, or distinctive composition.
- Human-use, therapeutic, diagnostic, treatment, dosing, administration, protocol, or wellness framing.
- Reconstitution/preparation guidance.
- Purity, HPLC, COA, independent-lab, batch-analysis, or supplier-quality claims without evidence.
- Rewards, points, discounts, or account gating unless separately approved.

## PepMAX design direction

- Dark biotech base with cyan/blue/violet accents.
- Biohack/technical display typography; no rounded editorial/fashion face.
- Larger product imagery on controlled white/neutral product canvas.
- Stronger whitespace around commercial CTAs and product cards.
- Mono typography only for technical microcopy such as SKU, labels, and data.
- Sticky mobile Shop/cart action.
- ES as default locale, PT-BR and EN at parity.

## Playwright acceptance criteria

- ES is the root/default experience.
- PT-BR and EN navigation parity.
- Shop search is visible above product results.
- Cart is reachable from every primary page.
- Product cards expose presentation/variant information where applicable.
- No prohibited health/human-use language appears in public marketing copy.
- Desktop and mobile screenshots are captured on PR runs.
