# PepMAX — Architecture

## Source of truth
- GitHub repository: `site-solutions-pro/pepmax-precos`
- Production branch: `main`
- Active implementation branch: `agent/pepmax-biohacking-font-20260908`
- Current review surface: Draft PR #40
- Production hosting: GitHub Pages

## Application layers
### Frontend
Static HTML/CSS/JS is currently the public application layer. The site must progressively move from hard-coded catalog data toward Supabase-backed catalog reads without breaking the existing static experience.

### Data
Supabase is the structured data layer. Current core tables:
- `categories`
- `products`
- `product_translations`
- `product_variants`
- `product_images`
- `availability`
- `orders`
- `order_items`

Spanish is the default locale. Portuguese and English must maintain equivalent public content and navigation.

### QA
Playwright is the browser-level gate for:
- ES/PT/EN routing and parity
- desktop/mobile rendering
- navigation
- cart entry points
- product links
- prohibited health/human-use wording
- regression checks

### Automation
n8n hosts the specialist-agent orchestration. While n8n execution limits are unavailable, implementation continues directly through GitHub + Supabase + Playwright. Agents must resume from the handoff documentation and current Draft PR state.

## Release governance
- Never write directly to `main` for routine work.
- Use isolated branches and Draft PRs.
- Do not merge without explicit user authorization.
- Do not invent or silently change price, SKU, presentation, checkout/payment rules, policies, supplier data, costs, margins, or security controls.
- Public copy must remain laboratory-research only.
- No dosing, reconstitution, administration, treatment, wellness, human/veterinary use guidance, or clinical benefit framing.
