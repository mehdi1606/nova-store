-- ============================================================================
--  NOVA CAVALIA — Supabase schema
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to run more than once (uses "if not exists" / "on conflict do nothing").
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Products (live overrides on top of the static catalogue) ────────────────
create table if not exists public.products (
  slug        text primary key,
  name        text,
  tagline     text,
  short_desc  text,
  description text,
  price_mad   integer,
  active      boolean     not null default true,
  sort_order  integer     not null default 0,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- ── Contact-form messages ───────────────────────────────────────────────────
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  subject    text,
  message    text        not null,
  created_at timestamptz not null default now()
);

-- ── Newsletter subscribers ──────────────────────────────────────────────────
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text        not null unique,
  created_at timestamptz not null default now()
);

-- ── Row-Level Security ──────────────────────────────────────────────────────
-- Products: anyone may read; only a signed-in (owner) account may change them.
-- Leads: anyone may submit; only a signed-in account may read them.
alter table public.products    enable row level security;
alter table public.messages    enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "products read"  on public.products;
drop policy if exists "products write" on public.products;
create policy "products read"  on public.products for select using (true);
create policy "products write" on public.products for all
  to authenticated using (true) with check (true);

drop policy if exists "messages insert" on public.messages;
drop policy if exists "messages read"   on public.messages;
create policy "messages insert" on public.messages for insert with check (true);
create policy "messages read"   on public.messages for select to authenticated using (true);

drop policy if exists "subscribers insert" on public.subscribers;
drop policy if exists "subscribers read"   on public.subscribers;
create policy "subscribers insert" on public.subscribers for insert with check (true);
create policy "subscribers read"   on public.subscribers for select to authenticated using (true);

-- ── Orders (cash on delivery, confirmed over WhatsApp) ──────────────────────
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  reference     text        not null,
  customer_name text        not null,
  phone         text        not null,
  city          text,
  address       text        not null,
  note          text,
  items         jsonb       not null default '[]'::jsonb,
  subtotal      integer     not null default 0,
  status        text        not null default 'nouvelle',
  created_at    timestamptz not null default now()
);

alter table public.orders enable row level security;
drop policy if exists "orders insert" on public.orders;
drop policy if exists "orders read"   on public.orders;
drop policy if exists "orders update" on public.orders;
-- Anyone may place an order; only a signed-in (owner) account may read/manage.
create policy "orders insert" on public.orders for insert with check (true);
create policy "orders read"   on public.orders for select to authenticated using (true);
create policy "orders update" on public.orders for update
  to authenticated using (true) with check (true);

-- ── Seed the three current products (so the dashboard mirrors the site) ──────
insert into public.products (slug, name, tagline, short_desc, description, price_mad, active, sort_order)
values
  (
    'veste-de-concours',
    'Veste de Concours',
    'L''allure du concours, l''aisance du quotidien.',
    'La pièce maîtresse du cavalier. Coupe ajustée marine, cheval brodé sur la manche.',
    'Taillée pour la piste et pensée pour durer, la Veste de Concours Nova Cavalia épouse la silhouette sans jamais l''entraver. Le marine profond, la doublure soyeuse et le cheval brodé au fil de soie sur la manche signent une élégance discrète, reconnaissable entre toutes.',
    1890, true, 0
  ),
  (
    'tapis-de-selle',
    'Tapis de Selle',
    'Le confort du cheval, la signature de la maison.',
    'Matelassé marine, passepoil corde crème, cheval brodé. Pensé pour le dos du cheval.',
    'Un tapis matelassé qui marie le maintien et la douceur. Le marine profond rehaussé d''un passepoil corde crème et du cheval brodé : une pièce qui habille la monture autant qu''elle la protège. Coutures renforcées, matière respirante, séchage rapide.',
    690, true, 1
  ),
  (
    'sweat-nova',
    'Sweat Nova Cavalia',
    'L''écurie au quotidien.',
    'Marine, script crème brodé au cœur, grand cheval corde au dos. La maille du club.',
    'Le vestiaire informel de la maison. Coton gratté épais, script « Nova Cavalia » brodé crème sur le cœur et la grande signature corde du cheval au dos. À porter du box à la ville, sans jamais quitter l''écurie d''esprit.',
    790, true, 2
  )
on conflict (slug) do nothing;
