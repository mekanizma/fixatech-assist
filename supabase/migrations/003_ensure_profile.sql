-- Eksik profil kayıtlarını tamamla (Auth'ta kullanıcı var, profiles yoksa)
create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  u auth.users%rowtype;
  p public.profiles%rowtype;
  r public.user_role;
begin
  if auth.uid() is null then
    raise exception 'Oturum bulunamadı';
  end if;

  select * into p from public.profiles where id = auth.uid();
  if found then
    return p;
  end if;

  select * into u from auth.users where id = auth.uid();
  if not found then
    raise exception 'Auth kullanıcısı bulunamadı';
  end if;

  r := 'customer';
  if u.raw_user_meta_data ->> 'role' in ('admin', 'technician', 'customer') then
    r := (u.raw_user_meta_data ->> 'role')::public.user_role;
  end if;

  insert into public.profiles (id, email, name, role, phone, company_id)
  values (
    u.id,
    coalesce(u.email, ''),
    coalesce(u.raw_user_meta_data ->> 'name', split_part(coalesce(u.email, 'user'), '@', 1)),
    r,
    u.raw_user_meta_data ->> 'phone',
    nullif(u.raw_user_meta_data ->> 'company_id', '')::uuid
  )
  returning * into p;

  return p;
end;
$$;

grant execute on function public.ensure_my_profile() to authenticated;

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());
