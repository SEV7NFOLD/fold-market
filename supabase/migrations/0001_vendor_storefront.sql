-- Run in the Supabase SQL editor for a new project.
create extension if not exists pgcrypto;

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text not null unique check (handle ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  custom_domain text unique,
  logo_url text,
  accent_color text not null default '#8f755e',
  currency text not null default 'NGN',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_memberships (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (vendor_id, user_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null,
  price numeric(12,2) not null check (price >= 0),
  compare_at numeric(12,2) check (compare_at is null or compare_at >= 0),
  description text not null,
  details text[] not null default '{}',
  image_url text not null,
  image_alt text,
  accent_tone text not null default 'clay',
  featured boolean not null default false,
  badge text,
  inventory integer not null default 0 check (inventory >= 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, slug)
);

create index if not exists products_vendor_status_sort_idx on public.products(vendor_id, status, sort_order);
create index if not exists vendor_memberships_user_vendor_idx on public.vendor_memberships(user_id, vendor_id);

create table if not exists public.service_promotions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  title text not null,
  description text not null,
  image_url text,
  cta_label text,
  cta_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.has_vendor_role(target_vendor uuid, allowed_roles text[])
returns boolean language sql stable security definer set search_path = public, auth as $$
  select exists (
    select 1 from public.vendor_memberships m
    where m.vendor_id = target_vendor and m.user_id = (select auth.uid()) and m.role = any(allowed_roles)
  );
$$;
revoke all on function public.has_vendor_role(uuid, text[]) from public;
grant execute on function public.has_vendor_role(uuid, text[]) to anon, authenticated;

alter table public.vendors enable row level security;
alter table public.vendor_memberships enable row level security;
alter table public.products enable row level security;
alter table public.service_promotions enable row level security;

create policy "active vendors are public" on public.vendors for select to anon, authenticated using (is_active);
create policy "vendor managers can update own vendor" on public.vendors for update to authenticated
  using (public.has_vendor_role(id, array['owner','admin']))
  with check (public.has_vendor_role(id, array['owner','admin']));

create policy "members can see their memberships" on public.vendor_memberships for select to authenticated
  using (user_id = (select auth.uid()) or public.has_vendor_role(vendor_id, array['owner','admin']));
create policy "owners and admins manage memberships" on public.vendor_memberships for all to authenticated
  using (public.has_vendor_role(vendor_id, array['owner','admin']))
  with check (public.has_vendor_role(vendor_id, array['owner','admin']));

create policy "published products are public and members see vendor catalog" on public.products for select to anon, authenticated
  using (status = 'published' or public.has_vendor_role(vendor_id, array['owner','admin','editor','viewer']));
create policy "vendor editors create products" on public.products for insert to authenticated
  with check (public.has_vendor_role(vendor_id, array['owner','admin','editor']));
create policy "vendor editors update products" on public.products for update to authenticated
  using (public.has_vendor_role(vendor_id, array['owner','admin','editor']))
  with check (public.has_vendor_role(vendor_id, array['owner','admin','editor']));
create policy "vendor editors delete products" on public.products for delete to authenticated
  using (public.has_vendor_role(vendor_id, array['owner','admin','editor']));

create policy "active service promotions are public" on public.service_promotions for select to anon, authenticated
  using (is_active or public.has_vendor_role(vendor_id, array['owner','admin','editor','viewer']));
create policy "vendor managers edit service promotions" on public.service_promotions for all to authenticated
  using (public.has_vendor_role(vendor_id, array['owner','admin','editor']))
  with check (public.has_vendor_role(vendor_id, array['owner','admin','editor']));

-- Storage is public for display. Upload and removal are limited to members of
-- the vendor whose UUID is the first folder in the object path.
insert into storage.buckets (id, name, public) values ('product-media', 'product-media', true)
on conflict (id) do nothing;
create policy "public can view product media" on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-media');
create policy "vendor editors upload product media" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and public.has_vendor_role((storage.foldername(name))[1]::uuid, array['owner','admin','editor']));
create policy "vendor editors update product media" on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and public.has_vendor_role((storage.foldername(name))[1]::uuid, array['owner','admin','editor']))
  with check (bucket_id = 'product-media' and public.has_vendor_role((storage.foldername(name))[1]::uuid, array['owner','admin','editor']));
create policy "vendor editors delete product media" on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and public.has_vendor_role((storage.foldername(name))[1]::uuid, array['owner','admin','editor']));

-- Create a vendor after applying this migration, then add the first owner after
-- that person has signed up. See docs/DEPLOYMENT.md for those steps.
