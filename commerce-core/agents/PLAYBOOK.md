# PepMax Multi-Agent Playbook

## Purpose

This playbook turns the agent roles into a repeatable delivery system for the eShop migration.

## A0 Orchestrator

For every milestone:
1. Read `ROADMAP.md`, `AGENTS.md`, the current Commerce Core contracts and open PRs.
2. Split work into atomic tasks with explicit owners and file boundaries.
3. Mark dependencies and safe parallel work.
4. Define acceptance criteria before coding starts.
5. Route completed work to A5 and only then to A6.

A0 must stop and request human approval for destructive migrations, production payment activation, legal-policy changes with business impact, or irreversible data changes.

## A1 Commerce Data

Primary objective: one source of truth.

Required sequence:
1. Inventory every current product/variant/SKU/price source.
2. Extract and normalize without changing commercial values.
3. Validate against `product.schema.json`.
4. Detect duplicate SKU, conflicting prices, missing variants and orphan product pages.
5. Produce a canonical private catalog and a sanitized public snapshot.
6. Generate a drift report comparing legacy storefront values to canonical values.

Private fields must never be emitted in the public snapshot.

## A2 Storefront

Primary objective: replace hard-coded commerce truth with canonical public data while preserving UX.

Required sequence:
1. Consume versioned public catalog data.
2. Remove duplicated product records only after parity is proven.
3. Preserve existing URLs when possible.
4. Validate desktop/mobile, keyboard navigation and cart count behavior.
5. Keep storefront functional during each migration step.

## A3 Checkout & Orders

Primary objective: establish a complete transactional path without coupling business logic to static HTML.

Required sequence:
1. Define cart line contract around canonical variant IDs/SKUs.
2. Implement server-side price revalidation before order creation.
3. Create order lifecycle using `order.schema.json`.
4. Keep payment, tax and shipping providers behind adapters.
5. Add idempotency and duplicate-order protection.
6. Add fulfillment/tracking state transitions.

Client-provided prices must never be trusted as order truth.

## A4 Content & SEO

Primary objective: scale discovery and technical authority without contaminating Commerce Core.

Required sequence:
1. Use canonical product names/slugs as identity references.
2. Keep scientific/editorial data separate from price and inventory truth.
3. Maintain internal links from Biblioteca to relevant product pages where editorially appropriate.
4. Validate metadata, headings, canonical links and language consistency.
5. Preserve research-only framing and avoid human-use instructions.

## A5 QA & Compliance

A5 runs after every meaningful worker batch.

Blocking checks:
- schema errors;
- duplicate SKU;
- public/private field leakage;
- price mismatch between snapshot and rendered product;
- broken checkout/cart critical path;
- broken links in changed routes;
- prohibited content introduced by the change;
- unresolved merge conflict or failing CI.

Non-blocking findings must still be recorded in the PR.

## A6 Release

A6 may proceed only after A5 PASS.

Checklist:
1. Confirm exact changed files and intended scope.
2. Confirm branch is based on current target branch or document divergence.
3. Confirm CI and required validation reports.
4. Produce rollback instructions.
5. Deploy/merge only within granted authority.
6. Run post-deploy smoke checks on Home, Shop, one product page, cart and any changed transactional route.

## High-speed execution pattern

Use parallel work only where file ownership and contracts prevent collisions:

- Track 1: A1 catalog/data
- Track 2: A2 storefront integration
- Track 3: A3 checkout/order foundation
- Track 4: A4 content/SEO
- Gate: A5
- Release: A6

A0 continuously rebalances tasks but does not bypass gates.

## First automated sprint

### Sprint CC-V1.2

A1:
- inventory all current catalog sources;
- extract 100 products and variants;
- create canonical catalog;
- produce drift report.

A2:
- prepare storefront data adapter against the public catalog contract;
- do not cut over until A1 parity passes.

A3:
- design cart-to-order contract and server-side pricing validation boundary.

A4:
- map Biblioteca/product identity links without changing commerce truth.

A5:
- validate all outputs and issue a consolidated gate report.

A6:
- prepare the migration release plan, but do not activate checkout/payment without explicit approval.
