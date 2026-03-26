-- Seed demo data for TranquiApp.
-- IMPORTANT: replace this UUID with a real auth.users id in each environment.
with demo_user as (
  select '11111111-1111-1111-1111-111111111111'::uuid as id
)
insert into public.profiles (id, full_name, email, currency, locale, default_section)
select id, 'Demo User', 'demo@tranqui.app', 'USD', 'es-US', 'dashboard'::public.app_section
from demo_user
on conflict (id) do update
set full_name = excluded.full_name,
    email = excluded.email,
    currency = excluded.currency,
    locale = excluded.locale,
    default_section = excluded.default_section;

with demo_user as (
  select '11111111-1111-1111-1111-111111111111'::uuid as id
),
upsert_accounts as (
  insert into public.accounts (id, user_id, name, type, opening_balance, current_balance, color)
  select *
  from (
    values
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, (select id from demo_user), 'Cuenta Principal', 'checking'::public.account_type, 1800.00, 2450.35, '#22c55e'),
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, (select id from demo_user), 'Ahorros', 'savings'::public.account_type, 9000.00, 8800.00, '#3b82f6')
  ) as t(id, user_id, name, type, opening_balance, current_balance, color)
  on conflict (id) do update
  set name = excluded.name,
      type = excluded.type,
      opening_balance = excluded.opening_balance,
      current_balance = excluded.current_balance,
      color = excluded.color
  returning id
)
select count(*) from upsert_accounts;

with demo_user as (
  select '11111111-1111-1111-1111-111111111111'::uuid as id
),
upsert_categories as (
  insert into public.categories (id, user_id, name, section, direction, icon, is_system)
  select *
  from (
    values
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001'::uuid, (select id from demo_user), 'Salario', 'presupuesto'::public.app_section, 'inflow'::public.entry_direction, 'wallet', true),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002'::uuid, (select id from demo_user), 'Supermercado', 'presupuesto'::public.app_section, 'outflow'::public.entry_direction, 'shopping-cart', true),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003'::uuid, (select id from demo_user), 'Transporte', 'presupuesto'::public.app_section, 'outflow'::public.entry_direction, 'bus', true),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004'::uuid, (select id from demo_user), 'Ahorro programado', 'presupuesto'::public.app_section, 'outflow'::public.entry_direction, 'piggy-bank', true),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005'::uuid, (select id from demo_user), 'Uso de ahorro', 'presupuesto'::public.app_section, 'outflow'::public.entry_direction, 'wrench', true),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006'::uuid, (select id from demo_user), 'Servicios', 'presupuesto'::public.app_section, 'outflow'::public.entry_direction, 'receipt', true)
  ) as t(id, user_id, name, section, direction, icon, is_system)
  on conflict (id) do update
  set name = excluded.name,
      section = excluded.section,
      direction = excluded.direction,
      icon = excluded.icon,
      is_system = excluded.is_system
  returning id
)
select count(*) from upsert_categories;

with demo_user as (
  select '11111111-1111-1111-1111-111111111111'::uuid as id
),
upsert_budget as (
  insert into public.monthly_budgets (id, user_id, month, currency, notes)
  values
    ('cccccccc-cccc-cccc-cccc-cccccccc0001'::uuid, (select id from demo_user), '2026-03-01'::date, 'USD', 'Presupuesto demo marzo 2026')
  on conflict (id) do update
  set month = excluded.month,
      currency = excluded.currency,
      notes = excluded.notes
  returning id
)
select count(*) from upsert_budget;

insert into public.budget_items (id, user_id, monthly_budget_id, category_id, planned_amount, rollover_amount)
values
  ('dddddddd-dddd-dddd-dddd-dddddddd0001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccc0001'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002'::uuid, 500.00, 0),
  ('dddddddd-dddd-dddd-dddd-dddddddd0002'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccc0001'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003'::uuid, 200.00, 0),
  ('dddddddd-dddd-dddd-dddd-dddddddd0003'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccc0001'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004'::uuid, 300.00, 0),
  ('dddddddd-dddd-dddd-dddd-dddddddd0004'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccc0001'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006'::uuid, 180.00, 0)
on conflict (id) do update
set planned_amount = excluded.planned_amount,
    rollover_amount = excluded.rollover_amount;

-- Dataset mensual demo (marzo 2026)
insert into public.transactions (id, user_id, account_id, category_id, transaction_date, direction, type, amount, note, merchant)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeee0001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001'::uuid, '2026-03-01', 'inflow', 'income', 3200.00, 'Nómina', 'Empresa Demo'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeee0002'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002'::uuid, '2026-03-03', 'outflow', 'expense', 92.50, 'Compra semanal', 'Supermercado Central'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeee0003'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003'::uuid, '2026-03-05', 'outflow', 'expense', 45.00, 'SUBE y taxi', 'Transporte'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeee0004'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004'::uuid, '2026-03-10', 'outflow', 'saving_deposit', 300.00, 'Transferencia a ahorro', 'Ahorros'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeee0005'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005'::uuid, '2026-03-18', 'outflow', 'saving_withdrawal', 220.00, 'Uso de ahorro - Plomero', 'Plomería González'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeee0006'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006'::uuid, '2026-03-22', 'outflow', 'expense', 68.00, 'Internet hogar', 'Telecom')
on conflict (id) do update
set transaction_date = excluded.transaction_date,
    direction = excluded.direction,
    type = excluded.type,
    amount = excluded.amount,
    note = excluded.note,
    merchant = excluded.merchant;

insert into public.imports (id, user_id, source, filename, state, imported_rows, total_rows)
values
  ('ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'csv', 'movimientos-marzo.csv', 'completed', 6, 6)
on conflict (id) do update
set source = excluded.source,
    filename = excluded.filename,
    state = excluded.state,
    imported_rows = excluded.imported_rows,
    total_rows = excluded.total_rows;

insert into public.import_rows (id, user_id, import_id, row_number, transaction_id, payload)
values
  ('12121212-1212-1212-1212-121212120001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, 1, 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0001'::uuid, '{"description":"Nómina", "amount":3200, "date":"2026-03-01"}'::jsonb),
  ('12121212-1212-1212-1212-121212120002'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, 2, 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0002'::uuid, '{"description":"Compra semanal", "amount":92.5, "date":"2026-03-03"}'::jsonb),
  ('12121212-1212-1212-1212-121212120003'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, 3, 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0003'::uuid, '{"description":"SUBE y taxi", "amount":45, "date":"2026-03-05"}'::jsonb),
  ('12121212-1212-1212-1212-121212120004'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, 4, 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0004'::uuid, '{"description":"Transferencia a ahorro", "amount":300, "date":"2026-03-10"}'::jsonb),
  ('12121212-1212-1212-1212-121212120005'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, 5, 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0005'::uuid, '{"description":"Uso de ahorro - Plomero", "amount":220, "date":"2026-03-18"}'::jsonb),
  ('12121212-1212-1212-1212-121212120006'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffff0001'::uuid, 6, 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0006'::uuid, '{"description":"Internet hogar", "amount":68, "date":"2026-03-22"}'::jsonb)
on conflict (id) do update
set payload = excluded.payload,
    error_message = excluded.error_message;

insert into public.recurring_rules (
  id,
  user_id,
  account_id,
  category_id,
  direction,
  type,
  amount,
  description,
  cadence,
  next_run_on,
  starts_on,
  is_active
)
values
  (
    '13131313-1313-1313-1313-131313130001'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006'::uuid,
    'outflow',
    'expense',
    68.00,
    'Internet hogar mensual',
    'monthly',
    '2026-04-22',
    '2026-03-22',
    true
  )
on conflict (id) do update
set amount = excluded.amount,
    next_run_on = excluded.next_run_on,
    is_active = excluded.is_active;
