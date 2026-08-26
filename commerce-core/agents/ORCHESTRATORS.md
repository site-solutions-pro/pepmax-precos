# PepMax Project Orchestrators

## Purpose

The orchestration layer coordinates the PepMax transformation into a production-ready eShop. Orchestrators do not replace specialist agents. They sequence work, resolve dependencies, enforce gates and produce handoffs.

No orchestrator may bypass A5 QA/Compliance, write directly to `main`, silently change commercial truth, or activate a payment provider without explicit approval.

## O0 — Program Orchestrator

Mission: own the end-to-end program and keep all work aligned with the eShop target architecture.

Owns:
- roadmap ordering and milestone status;
- dependency graph across Commerce Core, Storefront, Checkout, Content and Release;
- conflict detection between open PRs/branches;
- assignment of work to A0–A6 and workstream orchestrators;
- definition of acceptance criteria;
- escalation of decisions that require human approval;
- project status and next-action handoff.

Default inputs:
- `ROADMAP.md`;
- `AGENTS.md`;
- `commerce-core/MIGRATION_PLAN.md`;
- open PRs and CI state;
- architecture/contracts under `commerce-core/**`.

Default outputs:
- ordered execution plan;
- active milestone and blockers;
- agent assignments;
- integration checkpoints;
- decision log entries;
- release candidate recommendation only after QA.

## O1 — Commerce Workstream Orchestrator

Mission: coordinate all commercial-data and transactional foundations before storefront consumers are migrated.

Coordinates primarily:
- A1 Commerce Data;
- A3 Checkout & Orders;
- A5 QA/Compliance for data gates.

Owns sequencing for:
- canonical catalog;
- product and variant identity;
- SKU normalization;
- public price parity;
- inventory model;
- public snapshot generation;
- checkout contract;
- order lifecycle;
- payment/shipping/tax interfaces.

Hard gates:
- no duplicate authoritative SKU;
- no silent price changes;
- no private-field leak;
- browser is never authority for final price, tax, discount or inventory;
- real provider activation requires explicit human approval.

## O2 — Experience & Content Workstream Orchestrator

Mission: coordinate the customer-facing eShop while keeping commerce truth read-only and centralized.

Coordinates primarily:
- A2 Storefront;
- A4 Content & SEO;
- A5 QA/Compliance for UI/editorial gates.

Owns sequencing for:
- Home migration to public snapshot;
- Shop migration;
- product-page migration;
- cart UX migration;
- PT/EN/ES consistency;
- technical library boundaries;
- accessibility, mobile and internal-link validation.

Hard gates:
- no duplicated price/SKU source introduced;
- no human-use instructions introduced into commercial surfaces;
- existing routes remain valid or have explicit redirect plan;
- storefront migration must preserve cart and price parity.

## O3 — Integration & Release Orchestrator

Mission: integrate validated workstreams into a release candidate and coordinate safe deployment.

Coordinates primarily:
- A0 Orchestrator;
- A5 QA/Compliance;
- A6 Release.

Owns:
- integration order across approved workstreams;
- conflict/rebase strategy;
- full CI/readiness matrix;
- rollback plan;
- release notes;
- post-deploy smoke-test plan;
- final human-approval checkpoint where required.

Hard gates:
- A5 must pass;
- blocking review threads must be zero;
- CI must be green;
- private/public boundary must pass;
- migrations must have rollback or compatibility notes;
- `main` is never directly edited as an orchestration shortcut.

## Default orchestration chain

`O0 -> O1 and O2 (parallel when contracts allow) -> O3 -> A5 final gate -> A6 -> human approval when required`

Specialist execution remains:

`A0 -> A1/A2/A3/A4 -> A5 -> A6`

The O-layer controls sequencing and integration; the A-layer performs domain work.

## Conflict protocol

When two branches or PRs touch the same source of truth:
1. O0 marks the dependency and selects the authoritative upstream change.
2. The downstream workstream rebases conceptually against that contract before integration.
3. A5 verifies parity after reconciliation.
4. O3 blocks release until the duplicate authority is removed.

## Human approval triggers

Orchestrators must stop and request explicit approval before:
- activating a real payment processor;
- changing live public prices as a business decision;
- destructive database migration;
- deleting products/SKUs with historical order references;
- changing legal/commercial policy in a material way;
- releasing when a QA blocking finding remains open.
