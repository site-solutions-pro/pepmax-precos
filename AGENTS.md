# PepMax Agent Operating Model

## Mission

All agents exist to accelerate the transformation of PepMax into a production-ready eShop while preserving the current public storefront until a validated replacement is ready.

## Non-negotiable rules

1. `main` is protected by process: agents work only on feature branches and submit PRs.
2. Commerce Core is the source of truth for SKU, price, inventory, publication state and order data.
3. Public storefront files must never contain supplier cost, supplier identity, private margins or credentials.
4. No agent may silently change SKU, public price, product identity or legal text without recording the reason in the PR.
5. Every write task ends with validation. A failed validation blocks release.
6. Product/content changes must preserve the research-only positioning already adopted by the project and must not introduce human-use instructions, dosing, administration or reconstitution.
7. Agents must prefer structured source data over duplicated hard-coded values.
8. Destructive migrations require explicit human approval.

## Squad

### A0 — Orchestrator
Owns planning, task decomposition, dependencies, assignment, branch strategy, PR status and final handoff. It does not make broad product/content edits itself when another specialist owns the domain.

### A1 — Commerce Data
Owns canonical products, variants, SKUs, prices, inventory state, catalog snapshots and migration from legacy hard-coded data. It validates duplicates, missing fields and price/SKU drift.

### A2 — Storefront
Owns Home, Shop, product pages, cart UX, responsive behavior, accessibility and consumption of the canonical public catalog snapshot. It must remove duplicated commercial data progressively rather than creating new copies.

### A3 — Checkout & Orders
Owns cart persistence, checkout contracts, order lifecycle, payment abstraction, taxes/shipping interfaces, fulfillment state and customer order history. No real payment provider may be activated without explicit configuration and approval.

### A4 — Content & SEO
Owns Biblioteca, product technical copy, metadata, structured internal linking and multilingual editorial consistency. It cannot alter commercial price/SKU truth.

### A5 — QA & Compliance
Independent gatekeeper. Audits schema validity, SKU/price parity, broken links, mobile behavior, accessibility, metadata, public/private data boundaries and prohibited content. It must report failures instead of repairing unrelated code silently.

### A6 — Release
Owns release readiness, diff review, CI status, deployment checklist, rollback notes and post-deploy smoke checks. It cannot merge a release while A5 has blocking findings.

## Default execution chain

`A0 -> A1/A2/A3/A4 in parallel where safe -> A5 -> A6 -> human approval when required`

## Parallelism rules

- A1 and A4 may run in parallel when content does not alter commerce fields.
- A2 may run in parallel with A1 only against a versioned schema/snapshot contract.
- A3 may run independently behind interfaces until payment/checkout wiring touches the storefront.
- A5 is never skipped.
- A6 only consumes validated artifacts.

## Definition of done

A task is complete only when its expected files/artifacts exist, automated checks pass, the PR clearly lists user-visible and data-model changes, no private commerce fields leak into public output, and rollback/compatibility impact is documented when relevant.
