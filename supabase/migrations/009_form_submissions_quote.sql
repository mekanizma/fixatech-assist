-- Teklif (quote) form submission type

do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on e.enumtypid = t.oid
    where t.typname = 'form_submission_type'
      and e.enumlabel = 'quote'
  ) then
    alter type public.form_submission_type add value 'quote';
  end if;
end $$;
