-- =============================================================================
-- FİXATECH — Teknik Servis Kontrol Paneli (Supabase)
-- Supabase Dashboard → SQL Editor → bu dosyanın tamamını çalıştırın.
-- Ardından supabase/seed_reference_data.sql ve Auth kullanıcılarını oluşturun.
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums (tekrar çalıştırmada hata vermez)
-- -----------------------------------------------------------------------------
do $$ begin create type public.user_role as enum ('admin', 'technician', 'customer');
exception when duplicate_object then null; end $$;

do $$ begin create type public.service_status as enum (
  'pending', 'assigned', 'en_route', 'in_progress', 'waiting_parts', 'completed'
); exception when duplicate_object then null; end $$;

do $$ begin create type public.urgency as enum ('normal', 'urgent', 'critical');
exception when duplicate_object then null; end $$;

do $$ begin create type public.service_mode as enum ('onsite', 'workshop');
exception when duplicate_object then null; end $$;

do $$ begin create type public.warranty_status as enum ('yes', 'no', 'unknown');
exception when duplicate_object then null; end $$;

do $$ begin create type public.business_type as enum (
  'hotel', 'restaurant', 'cafe', 'industrial_kitchen', 'corporate'
); exception when duplicate_object then null; end $$;

do $$ begin create type public.ticket_event_type as enum (
  'status', 'note', 'assignment', 'photo', 'work', 'part', 'invoice'
); exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text not null,
  phone text not null,
  email text not null default '',
  address text not null,
  district text not null,
  city text not null,
  type public.business_type not null default 'corporate',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  role public.user_role not null default 'customer',
  phone text,
  company_id uuid references public.companies (id) on delete set null,
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  email text not null,
  specialties text[] not null default '{}',
  active boolean not null default true,
  location jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_tickets (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  company_id uuid not null references public.companies (id) on delete restrict,
  created_by_user_id uuid not null references public.profiles (id) on delete restrict,
  assigned_technician_id uuid references public.technicians (id) on delete set null,
  status public.service_status not null default 'pending',
  urgency public.urgency not null default 'normal',
  service_mode public.service_mode not null default 'onsite',
  company_name text not null,
  contact_person text not null,
  phone text not null,
  email text not null default '',
  address text not null,
  district text not null,
  city text not null,
  business_type public.business_type not null,
  product_type text not null,
  product_name text not null,
  brand text not null default '',
  model text not null default '',
  serial_no text not null default '',
  quantity int not null default 1 check (quantity > 0),
  issue_description text not null,
  photos text[] not null default '{}',
  videos text[] not null default '{}',
  service_date date not null,
  service_time text not null,
  estimated_completion timestamptz,
  warranty_status public.warranty_status not null default 'unknown',
  previous_service boolean not null default false,
  notes text not null default '',
  work_performed text,
  parts_used jsonb,
  invoice_amount numeric(12, 2),
  technician_signature text,
  customer_signature text,
  location jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_tickets_company_id_idx on public.service_tickets (company_id);
create index if not exists service_tickets_status_idx on public.service_tickets (status);
create index if not exists service_tickets_code_upper_idx on public.service_tickets (upper(code));

create table if not exists public.ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.service_tickets (id) on delete cascade,
  type public.ticket_event_type not null,
  message text not null,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_by_name text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ticket_events_ticket_id_idx on public.ticket_events (ticket_id, created_at);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_updated_at on public.companies;
create trigger companies_updated_at before update on public.companies
  for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists technicians_updated_at on public.technicians;
create trigger technicians_updated_at before update on public.technicians
  for each row execute function public.set_updated_at();
drop trigger if exists service_tickets_updated_at on public.service_tickets;
create trigger service_tickets_updated_at before update on public.service_tickets
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Auth: yeni kullanıcı → profil
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, phone, company_id)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, 'user'), '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer'),
    new.raw_user_meta_data ->> 'phone',
    nullif(new.raw_user_meta_data ->> 'company_id', '')::uuid
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Helpers (RLS)
-- -----------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid();
$$;

create or replace function public.current_technician_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.technicians where user_id = auth.uid() limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Ticket code generator
-- -----------------------------------------------------------------------------
create or replace function public.next_ticket_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  y int := extract(year from now())::int;
  n int;
begin
  select coalesce(
    max((regexp_match(code, 'FIX-' || y::text || '-(\d+)'))[1]::int),
    0
  ) + 1
  into n
  from public.service_tickets
  where code like 'FIX-' || y::text || '-%';

  return 'FIX-' || y::text || '-' || lpad(n::text, 4, '0');
end;
$$;

-- -----------------------------------------------------------------------------
-- Public tracking (anon) — takip kodu ile sorgu
-- -----------------------------------------------------------------------------
create or replace function public.get_public_ticket(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.service_tickets%rowtype;
  ev jsonb;
begin
  select * into t from public.service_tickets where upper(code) = upper(trim(p_code));
  if not found then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', e.id,
        'ticket_id', e.ticket_id,
        'type', e.type,
        'message', e.message,
        'created_at', e.created_at,
        'created_by', e.created_by,
        'created_by_name', e.created_by_name,
        'meta', e.meta
      )
      order by e.created_at
    ),
    '[]'::jsonb
  )
  into ev
  from public.ticket_events e
  where e.ticket_id = t.id
    and e.type in ('status', 'assignment', 'work');

  return jsonb_build_object(
    'ticket', to_jsonb(t),
    'events', ev
  );
end;
$$;

grant execute on function public.get_public_ticket(text) to anon, authenticated;
grant execute on function public.next_ticket_code() to authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.technicians enable row level security;
alter table public.service_tickets enable row level security;
alter table public.ticket_events enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert" on public.profiles
  for insert to authenticated
  with check (public.is_admin());

-- companies
drop policy if exists "companies_admin_all" on public.companies;
create policy "companies_admin_all" on public.companies
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "companies_customer_read" on public.companies;
create policy "companies_customer_read" on public.companies
  for select to authenticated
  using (id = public.current_company_id());

drop policy if exists "companies_customer_insert" on public.companies;
create policy "companies_customer_insert" on public.companies
  for insert to authenticated
  with check (public.current_user_role() = 'customer');

-- technicians
drop policy if exists "technicians_read" on public.technicians;
create policy "technicians_read" on public.technicians
  for select to authenticated
  using (
    public.is_admin()
    or user_id = auth.uid()
    or public.current_user_role() = 'customer'
  );

drop policy if exists "technicians_admin_write" on public.technicians;
create policy "technicians_admin_write" on public.technicians
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- service_tickets
drop policy if exists "tickets_admin_all" on public.service_tickets;
create policy "tickets_admin_all" on public.service_tickets
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "tickets_customer_select" on public.service_tickets;
create policy "tickets_customer_select" on public.service_tickets
  for select to authenticated
  using (
    public.current_user_role() = 'customer'
    and (
      company_id = public.current_company_id()
      or created_by_user_id = auth.uid()
    )
  );

drop policy if exists "tickets_customer_insert" on public.service_tickets;
create policy "tickets_customer_insert" on public.service_tickets
  for insert to authenticated
  with check (
    public.current_user_role() = 'customer'
    and created_by_user_id = auth.uid()
  );

drop policy if exists "tickets_customer_update_own" on public.service_tickets;
create policy "tickets_customer_update_own" on public.service_tickets
  for update to authenticated
  using (
    public.current_user_role() = 'customer'
    and created_by_user_id = auth.uid()
    and status = 'pending'
  )
  with check (created_by_user_id = auth.uid());

drop policy if exists "tickets_technician_select" on public.service_tickets;
create policy "tickets_technician_select" on public.service_tickets
  for select to authenticated
  using (
    public.current_user_role() = 'technician'
    and assigned_technician_id = public.current_technician_id()
  );

drop policy if exists "tickets_technician_update" on public.service_tickets;
create policy "tickets_technician_update" on public.service_tickets
  for update to authenticated
  using (
    public.current_user_role() = 'technician'
    and assigned_technician_id = public.current_technician_id()
  )
  with check (
    assigned_technician_id = public.current_technician_id()
  );

-- ticket_events
drop policy if exists "events_admin_all" on public.ticket_events;
create policy "events_admin_all" on public.ticket_events
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "events_read_via_ticket" on public.ticket_events;
create policy "events_read_via_ticket" on public.ticket_events
  for select to authenticated
  using (
    exists (
      select 1 from public.service_tickets t
      where t.id = ticket_id
        and (
          public.is_admin()
          or (public.current_user_role() = 'customer' and (
            t.company_id = public.current_company_id()
            or t.created_by_user_id = auth.uid()
          ))
          or (public.current_user_role() = 'technician'
            and t.assigned_technician_id = public.current_technician_id())
        )
    )
  );

drop policy if exists "events_insert_authenticated" on public.ticket_events;
create policy "events_insert_authenticated" on public.ticket_events
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.service_tickets t
      where t.id = ticket_id
        and (
          public.is_admin()
          or (public.current_user_role() = 'technician'
            and t.assigned_technician_id = public.current_technician_id())
          or (public.current_user_role() = 'customer'
            and t.created_by_user_id = auth.uid())
        )
    )
  );

-- -----------------------------------------------------------------------------
-- Storage: ticket photos (opsiyonel — data URL yerine dosya yüklemek için)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ticket-photos',
  'ticket-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "ticket_photos_public_read" on storage.objects;
create policy "ticket_photos_public_read" on storage.objects
  for select to public
  using (bucket_id = 'ticket-photos');

drop policy if exists "ticket_photos_auth_upload" on storage.objects;
create policy "ticket_photos_auth_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'ticket-photos');

drop policy if exists "ticket_photos_auth_update" on storage.objects;
create policy "ticket_photos_auth_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'ticket-photos');
