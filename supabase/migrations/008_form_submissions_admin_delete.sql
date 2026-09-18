-- Admin talep formlarını silebilsin
drop policy if exists "form_submissions_admin_delete" on public.form_submissions;
create policy "form_submissions_admin_delete" on public.form_submissions
  for delete to authenticated
  using (public.is_admin());
