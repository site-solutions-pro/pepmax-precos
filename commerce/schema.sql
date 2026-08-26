-- PepMax Commerce Core v1
-- PostgreSQL baseline schema. Private/commercial core only.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','review','approved','published','archived')),
  brand text not null default 'PepMAX',
  product_type text,
  research_only boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  presentation text not null,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  currency char(3) not null default 'USD',
  cost_private numeric(12,2) check (cost_private is null or cost_private >= 0),
  inventory_policy text not null default 'deny' check (inventory_policy in ('deny','continue')),
  stock_quantity integer not null default 0,
  active boolean not null default true,
  image_url text,
  weight numeric(12,3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists variants_product_id_idx on variants(product_id);
create index if not exists variants_active_idx on variants(active);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  last_name text,
  phone text,
  billing_address jsonb,
  shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  session_id text,
  currency char(3) not null default 'USD',
  status text not null default 'active' check (status in ('active','converted','abandoned','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists carts_session_active_idx
  on carts(session_id)
  where session_id is not null and status = 'active';

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  variant_id uuid not null references variants(id),
  quantity integer not null check (quantity > 0),
  unit_price_snapshot numeric(12,2) not null check (unit_price_snapshot >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, variant_id)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id uuid references customers(id) on delete set null,
  email text not null,
  currency char(3) not null default 'USD',
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  shipping_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending','authorized','paid','partially_refunded','refunded','failed','cancelled')),
  fulfillment_status text not null default 'unfulfilled' check (fulfillment_status in ('unfulfilled','processing','partially_fulfilled','fulfilled','returned','cancelled')),
  order_status text not null default 'open' check (order_status in ('open','on_hold','completed','cancelled')),
  shipping_address jsonb,
  billing_address jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  variant_id uuid references variants(id) on delete set null,
  sku_snapshot text not null,
  product_name_snapshot text not null,
  presentation_snapshot text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on order_items(order_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'USD',
  status text not null default 'pending',
  raw_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists payments_provider_payment_idx
  on payments(provider, provider_payment_id)
  where provider_payment_id is not null;

create table if not exists inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references variants(id),
  quantity_delta integer not null,
  reason text not null,
  reference_type text,
  reference_id text,
  created_at timestamptz not null default now()
);

create index if not exists inventory_movements_variant_idx on inventory_movements(variant_id);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(12,2) not null check (discount_value >= 0),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_log (
  id bigserial primary key,
  actor text not null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_entity_idx on audit_log(entity_type, entity_id, created_at desc);

-- Only approved/published, active, non-private fields should ever feed the public storefront.
create or replace view public_catalog as
select
  p.id as product_id,
  p.slug,
  p.name,
  p.description,
  p.brand,
  p.product_type,
  p.research_only,
  p.seo_title,
  p.seo_description,
  v.id as variant_id,
  v.sku,
  v.presentation,
  v.price,
  v.compare_at_price,
  v.currency,
  v.stock_quantity,
  v.inventory_policy,
  v.image_url,
  v.weight
from products p
join variants v on v.product_id = p.id
where p.status in ('approved','published')
  and v.active = true;
