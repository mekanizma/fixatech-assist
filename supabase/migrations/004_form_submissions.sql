-- WhatsApp ile gönderilen public talep formları (teknik servis, iletişim)

do $$ begin
  create type public.form_submission_type as enum ('tech_service', 'contact');
exception when duplicate_object then null;
end $$;

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  type public.form_submission_type not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'converted', 'archived')),
  contact_name text not null default '',
  contact_phone text not null default '',
  contact_email text not null default '',
  company_name text not null default '',
  summary text not null default '',
  payload jsonb not null default '{}',
  whatsapp_message text not null default '',
  notes text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_created_at_idx
  on public.form_submissions (created_at desc);

create index if not exists form_submissions_status_idx
  on public.form_submissions (status);

create index if not exists form_submissions_type_idx
  on public.form_submissions (type);

alter table public.form_submissions enable row level security;

-- Public formlar (anon + authenticated) kayıt ekleyebilir
drop policy if exists "form_submissions_public_insert" on public.form_submissions;
create policy "form_submissions_public_insert" on public.form_submissions
  for insert to anon, authenticated
  with check (true);

-- Sadece admin okur / günceller
drop policy if exists "form_submissions_admin_select" on public.form_submissions;
create policy "form_submissions_admin_select" on public.form_submissions
  for select to authenticated
  using (public.is_admin());

drop policy if exists "form_submissions_admin_update" on public.form_submissions;
create policy "form_submissions_admin_update" on public.form_submissions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
