-- İşçilik kalemleri ve fiyatlandırma (teknisyen / admin)

alter table public.service_tickets
  add column if not exists work_items jsonb not null default '[]'::jsonb;

comment on column public.service_tickets.work_items is
  'Yapılan işlem kalemleri: [{ "description": "...", "amount": 123.45 }]';
