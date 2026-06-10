-- Kayıt kodu öneki: FIX- (eski FixaTech) → PRAGMA- (PRAGMATECHNICAL)
update public.service_tickets
set code = 'PRAGMA-' || substring(code from 5)
where code like 'FIX-%';

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
    max((regexp_match(code, '(?:PRAGMA|FIX)-' || y::text || '-(\d+)'))[1]::int),
    0
  ) + 1
  into n
  from public.service_tickets
  where code like 'PRAGMA-' || y::text || '-%'
     or code like 'FIX-' || y::text || '-%';

  return 'PRAGMA-' || y::text || '-' || lpad(n::text, 4, '0');
end;
$$;
