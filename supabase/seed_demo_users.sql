-- =============================================================================
-- FİXATECH — Demo hesaplar (SQL ile giriş çalışır)
-- Sıra: 001_service_desk.sql → 003_ensure_profile.sql → bu dosya
-- Supabase SQL Editor → Run
-- =============================================================================

create extension if not exists "pgcrypto";

-- Sabit kullanıcı ID'leri (profiles.id = auth.users.id)
-- Şifreler: admin123 | teknik123 | musteri123

-- Yardımcı: Auth kullanıcı + identity oluştur / güncelle
create or replace function public.seed_auth_user(
  p_id uuid,
  p_email text,
  p_password text,
  p_meta jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_id uuid := p_id;
  v_pw text := extensions.crypt(p_password, extensions.gen_salt('bf'));
  v_existing uuid;
begin
  select id into v_existing from auth.users where email = p_email limit 1;

  if v_existing is not null and v_existing <> p_id then
    delete from auth.identities where user_id = v_existing;
    delete from public.profiles where id = v_existing;
    delete from auth.users where id = v_existing;
  end if;

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    v_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_email,
    v_pw,
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    p_meta,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = now(),
    raw_user_meta_data = excluded.raw_user_meta_data,
    raw_app_meta_data = excluded.raw_app_meta_data,
    updated_at = now();

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    v_id,
    v_id,
    jsonb_build_object('sub', v_id::text, 'email', p_email, 'email_verified', true),
    'email',
    v_id::text,
    now(),
    now(),
    now()
  )
  on conflict (provider_id, provider) do update set
    user_id = excluded.user_id,
    identity_data = excluded.identity_data,
    updated_at = now();

  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Şirketler (müşteri hesabı için)
-- -----------------------------------------------------------------------------
insert into public.companies (id, name, contact_person, phone, email, address, district, city, type)
values
  (
    'a0000001-0001-4001-8001-000000000001',
    'Grand Bosphorus Hotel',
    'Mehmet Yıldırım',
    '+90 212 555 01 01',
    'teknik@grandbosphorus.com',
    'Cumhuriyet Cad. No: 42',
    'Şişli',
    'İstanbul',
    'hotel'
  ),
  (
    'a0000001-0001-4001-8001-000000000002',
    'La Cucina Restoran',
    'Ayşe Korkmaz',
    '+90 216 444 22 11',
    'isletme@lacucina.com',
    'Moda Cad. No: 18',
    'Kadıköy',
    'İstanbul',
    'restaurant'
  )
on conflict (id) do update set
  name = excluded.name,
  contact_person = excluded.contact_person,
  phone = excluded.phone;

-- -----------------------------------------------------------------------------
-- Demo Auth kullanıcıları
-- -----------------------------------------------------------------------------
do $$
declare
  v_admin uuid := 'b0000001-0001-4001-8001-000000000001';
  v_tech1 uuid := 'b0000001-0001-4001-8001-000000000002';
  v_tech2 uuid := 'b0000001-0001-4001-8001-000000000003';
  v_customer uuid := 'b0000001-0001-4001-8001-000000000004';
begin
  perform public.seed_auth_user(
    v_admin,
    'admin@fixatech.com',
    'admin123',
    '{"role":"admin","name":"Sistem Yöneticisi","phone":"+90 533 821 61 72"}'::jsonb
  );

  perform public.seed_auth_user(
    v_tech1,
    'teknik@fixatech.com',
    'teknik123',
    '{"role":"technician","name":"Ahmet Yılmaz","phone":"+90 532 100 20 30"}'::jsonb
  );

  perform public.seed_auth_user(
    v_tech2,
    'mehmet@fixatech.com',
    'teknik123',
    '{"role":"technician","name":"Mehmet Kaya","phone":"+90 532 200 30 40"}'::jsonb
  );

  perform public.seed_auth_user(
    v_customer,
    'musteri@fixatech.com',
    'musteri123',
    '{"role":"customer","name":"Mehmet Yıldırım","phone":"+90 212 555 01 01","company_id":"a0000001-0001-4001-8001-000000000001"}'::jsonb
  );
end $$;

-- Profiller (trigger sonrası rol / firma kesinleştir)
insert into public.profiles (id, email, name, role, phone, company_id)
values
  (
    'b0000001-0001-4001-8001-000000000001',
    'admin@fixatech.com',
    'Sistem Yöneticisi',
    'admin',
    '+90 533 821 61 72',
    null
  ),
  (
    'b0000001-0001-4001-8001-000000000002',
    'teknik@fixatech.com',
    'Ahmet Yılmaz',
    'technician',
    '+90 532 100 20 30',
    null
  ),
  (
    'b0000001-0001-4001-8001-000000000003',
    'mehmet@fixatech.com',
    'Mehmet Kaya',
    'technician',
    '+90 532 200 30 40',
    null
  ),
  (
    'b0000001-0001-4001-8001-000000000004',
    'musteri@fixatech.com',
    'Mehmet Yıldırım',
    'customer',
    '+90 212 555 01 01',
    'a0000001-0001-4001-8001-000000000001'
  )
on conflict (id) do update set
  email = excluded.email,
  name = excluded.name,
  role = excluded.role,
  phone = excluded.phone,
  company_id = excluded.company_id;

-- Teknisyen kayıtları
insert into public.technicians (id, user_id, name, phone, email, specialties, active, location)
values
  (
    'c0000001-0001-4001-8001-000000000001',
    'b0000001-0001-4001-8001-000000000002',
    'Ahmet Yılmaz',
    '+90 532 100 20 30',
    'teknik@fixatech.com',
    array['Endüstriyel Mutfak', 'Soğutma'],
    true,
    '{"lat":41.04,"lng":28.98,"label":"Şişli — Saha"}'::jsonb
  ),
  (
    'c0000001-0001-4001-8001-000000000002',
    'b0000001-0001-4001-8001-000000000003',
    'Mehmet Kaya',
    '+90 532 200 30 40',
    'mehmet@fixatech.com',
    array['Elektrik', 'Su Tesisatı'],
    true,
    '{"lat":41.01,"lng":29.02,"label":"Kadıköy — Saha"}'::jsonb
  )
on conflict (id) do update set
  user_id = excluded.user_id,
  name = excluded.name,
  phone = excluded.phone,
  specialties = excluded.specialties,
  active = excluded.active,
  location = excluded.location;

-- -----------------------------------------------------------------------------
-- Örnek servis kayıtları (panelde veri görünsün)
-- -----------------------------------------------------------------------------
insert into public.service_tickets (
  id, code, company_id, created_by_user_id, assigned_technician_id,
  status, urgency, service_mode,
  company_name, contact_person, phone, email, address, district, city, business_type,
  product_type, product_name, brand, model, serial_no, quantity, issue_description,
  photos, videos, service_date, service_time, warranty_status, previous_service, notes,
  work_performed, parts_used, created_at, updated_at
)
values
  (
    'd0000001-0001-4001-8001-000000000001',
    'FIX-2026-0001',
    'a0000001-0001-4001-8001-000000000001',
    'b0000001-0001-4001-8001-000000000004',
    'c0000001-0001-4001-8001-000000000001',
    'in_progress',
    'urgent',
    'onsite',
    'Grand Bosphorus Hotel', 'Mehmet Yıldırım', '+90 212 555 01 01', 'teknik@grandbosphorus.com',
    'Cumhuriyet Cad. No: 42', 'Şişli', 'İstanbul', 'hotel',
    'Endüstriyel Fırın', 'Konveksiyonlu fırın', 'Rational', 'SCC 101', 'RAT-88421', 1,
    'Fırın 180°C''ye ulaşmıyor, alarm kodu E14 görünüyor.',
    '{}', '{}', current_date, '10:00 – 12:00', 'yes', true,
    'Ana mutfak girişi, güvenlikten geçiş gerekli.',
    'Sensör kontrolü yapıldı, kalibrasyon başlatıldı.',
    '[{"name":"Sıcaklık sensörü","qty":1,"cost":2400}]'::jsonb,
    now() - interval '2 days', now()
  ),
  (
    'd0000001-0001-4001-8001-000000000002',
    'FIX-2026-0002',
    'a0000001-0001-4001-8001-000000000002',
    'b0000001-0001-4001-8001-000000000001',
    'c0000001-0001-4001-8001-000000000002',
    'assigned',
    'normal',
    'workshop',
    'La Cucina Restoran', 'Ayşe Korkmaz', '+90 216 444 22 11', 'isletme@lacucina.com',
    'Moda Cad. No: 18', 'Kadıköy', 'İstanbul', 'restaurant',
    'Bulaşık Makinesi', 'Endüstriyel bulaşık makinesi', 'Electrolux', 'WD-6', 'ELX-55201', 1,
    'Su tahliye pompası çalışmıyor.',
    '{}', '{}', current_date + 1, '14:00 – 16:00', 'no', false, '',
    null, null,
    now() - interval '1 day', now() - interval '1 day'
  ),
  (
    'd0000001-0001-4001-8001-000000000003',
    'FIX-2026-0003',
    'a0000001-0001-4001-8001-000000000001',
    'b0000001-0001-4001-8001-000000000004',
    null,
    'pending',
    'critical',
    'onsite',
    'Grand Bosphorus Hotel', 'Mehmet Yıldırım', '+90 212 555 01 01', 'teknik@grandbosphorus.com',
    'Cumhuriyet Cad. No: 42', 'Şişli', 'İstanbul', 'hotel',
    'Soğutucu', 'Soğuk oda ünitesi', 'Daikin', 'VRV-III', 'DK-99102', 1,
    'Soğuk oda sıcaklığı +8°C''ye çıktı, acil müdahale.',
    '{}', '{}', current_date, '08:00 – 10:00', 'unknown', false,
    '7/24 acil hat üzerinden bildirildi.',
    null, null,
    now(), now()
  )
on conflict (id) do nothing;

insert into public.ticket_events (id, ticket_id, type, message, created_by, created_by_name, created_at)
values
  ('e0000001-0001-4001-8001-000000000001', 'd0000001-0001-4001-8001-000000000001', 'status', 'Kayıt oluşturuldu — Beklemede', 'b0000001-0001-4001-8001-000000000004', 'Mehmet Yıldırım', now() - interval '2 days'),
  ('e0000001-0001-4001-8001-000000000002', 'd0000001-0001-4001-8001-000000000001', 'assignment', 'Ahmet Yılmaz atandı', 'b0000001-0001-4001-8001-000000000001', 'Sistem Yöneticisi', now() - interval '2 days'),
  ('e0000001-0001-4001-8001-000000000003', 'd0000001-0001-4001-8001-000000000001', 'status', 'Durum: İşlem Yapılıyor', 'b0000001-0001-4001-8001-000000000002', 'Ahmet Yılmaz', now() - interval '1 day'),
  ('e0000001-0001-4001-8001-000000000004', 'd0000001-0001-4001-8001-000000000001', 'work', 'Sensör kontrolü yapıldı, kalibrasyon başlatıldı.', 'b0000001-0001-4001-8001-000000000002', 'Ahmet Yılmaz', now()),
  ('e0000001-0001-4001-8001-000000000005', 'd0000001-0001-4001-8001-000000000002', 'status', 'Kayıt oluşturuldu — Teknik Ekip Atandı', 'b0000001-0001-4001-8001-000000000001', 'Sistem Yöneticisi', now() - interval '1 day'),
  ('e0000001-0001-4001-8001-000000000006', 'd0000001-0001-4001-8001-000000000003', 'status', 'Kritik arıza kaydı — Beklemede', 'b0000001-0001-4001-8001-000000000004', 'Mehmet Yıldırım', now())
on conflict (id) do nothing;

-- Özet (SQL Editor Results sekmesinde görünür)
select email, role, name from public.profiles
where email like '%@fixatech.com'
order by role;
