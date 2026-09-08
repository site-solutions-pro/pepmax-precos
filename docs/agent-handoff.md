# PepMAX — Agent Handoff

## Mission
Finish PepMAX as a polished commercial storefront for laboratory research compounds while preserving strict research-only framing.

## Current execution mode
n8n orchestration is temporarily constrained by account execution limits. Until restored, continue implementation through GitHub, Supabase, and Playwright. Resume agent orchestration from this document and the active Draft PR state.

## Current implementation surface
- Repository: `site-solutions-pro/pepmax-precos`
- Draft PR: #40
- Branch: `agent/pepmax-biohacking-font-20260908`
- Do not merge without explicit user authorization.

## Active priorities
1. Complete Playwright validation and fix failures.
2. Migrate the existing 100 products / 179 variants to Supabase preserving exact SKU, price, and presentation data.
3. Connect catalog reads to Supabase progressively with a safe static fallback.
4. Complete EN / ES / PT parity across public experience; Spanish remains default.
5. Replace legacy clinical/WellMAX content with research-only technical content.
6. Rebuild Shop as a real commercial catalog surface rather than a redirect.
7. Standardize product-page template and related-product/navigation patterns.
8. Apply approved commercial UX patterns inspired by profoundaminos.com without cloning branding or proprietary creative.
9. Keep documentation synchronized with implementation.

## Compliance rules
Never introduce:
- human or veterinary use guidance
- health, wellness or treatment framing
- dosing
- reconstitution
- administration
- protocols
- efficacy/benefit claims

Use laboratory research, analytical characterization, documentation, identity, purity verification, traceability, and experimental-context language instead.

## Commercial invariants
Do not silently modify:
- prices
- SKUs
- presentations
- checkout/payment logic
- policies/legal text
- supplier/cost/margin/private data
- workflow/security/QA controls

## Localization contract
- `/` = ES default
- `/pt/` = PT-BR equivalent
- `/en/` = EN equivalent
- canonical + hreflang required
- menu, CTA, catalog, product, Shop, footer, technical content and legal/research notices require parity

## QA contract
Before any release-ready state:
- desktop and mobile Playwright passes
- ES/PT/EN route parity passes
- cart and product links pass
- no broken internal links
- no prohibited research-use wording violations
- no accidental commercial-data drift
- no regression in typography or shared design system

## Design reference
Use `docs/design-system.md` and `docs/reference-profoundaminos.md` as the approved visual/commercial direction.
