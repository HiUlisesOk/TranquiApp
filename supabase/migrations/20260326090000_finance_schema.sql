-- TranquiApp finance schema
create extension if not exists "pgcrypto";

-- Enums
create type public.app_section as enum (
  'dashboard',
  'presupuesto',
  'movimientos',
  'cuentas',
  'categorias',
  'recurrentes',
  'configuracion'
);

create type public.record_state as enum (
  'active',
  'archived',
  'deleted'
);

create type public.entry_direction as enum (
  'inflow',
  'outflow'
);

create type public.transaction_type as enum (
  'income',
  'expense',
  'transfer',
  'saving_deposit',
  'saving_withdrawal'
);

create type public.account_type as enum (
  'checking',
  'savings',
  'cash',
  'credit',
  'investment'
);

create type public.import_state as enum (
  'pending',
  'processing',
  'completed',
  'failed'
);

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  currency text not null default 'USD',
  locale text not null default 'es-US',
  default_section public.app_section not null default 'dashboard',
  state public.record_state not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type public.account_type not null,
  opening_balance numeric(14,2) not null default 0,
  current_balance numeric(14,2) not null default 0,
  color text,
  state public.record_state not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (opening_balance >= 0 or type = 'credit'),
  check (char_length(name) >= 2)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  section public.app_section not null default 'presupuesto',
  direction public.entry_direction not null,
  icon text,
  is_system boolean not null default false,
  state public.record_state not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, name)
);

create table if not exists public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  month date not null,
  currency text not null default 'USD',
  state public.record_state not null default 'active',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, month),
  check (date_trunc('month', month) = month)
);

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  monthly_budget_id uuid not null references public.monthly_budgets(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  planned_amount numeric(14,2) not null,
  rollover_amount numeric(14,2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (monthly_budget_id, category_id),
  check (planned_amount >= 0)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  transaction_date date not null,
  direction public.entry_direction not null,
  type public.transaction_type not null,
  amount numeric(14,2) not null,
  note text,
  merchant text,
  transfer_account_id uuid references public.accounts(id) on delete set null,
  state public.record_state not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (amount > 0),
  check (
    (type = 'transfer' and transfer_account_id is not null)
    or (type <> 'transfer' and transfer_account_id is null)
  )
);

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null default 'csv',
  filename text not null,
  state public.import_state not null default 'pending',
  imported_rows integer not null default 0,
  total_rows integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (imported_rows >= 0),
  check (total_rows >= 0),
  check (imported_rows <= total_rows)
);

create table if not exists public.import_rows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  import_id uuid not null references public.imports(id) on delete cascade,
  row_number integer not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  payload jsonb not null,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (import_id, row_number),
  check (row_number > 0)
);

create table if not exists public.recurring_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  direction public.entry_direction not null,
  type public.transaction_type not null,
  amount numeric(14,2) not null,
  description text not null,
  cadence text not null,
  next_run_on date not null,
  starts_on date not null,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (amount > 0),
  check (cadence in ('daily', 'weekly', 'monthly', 'yearly')),
  check (ends_on is null or ends_on >= starts_on)
);

-- Indexes requested for user_id, month, category_id, account_id, transaction_date
create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_monthly_budgets_user_id_month on public.monthly_budgets(user_id, month);
create index if not exists idx_budget_items_user_id_category_id on public.budget_items(user_id, category_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_account_id on public.transactions(account_id);
create index if not exists idx_transactions_category_id on public.transactions(category_id);
create index if not exists idx_transactions_transaction_date on public.transactions(transaction_date);
create index if not exists idx_imports_user_id on public.imports(user_id);
create index if not exists idx_import_rows_user_id on public.import_rows(user_id);
create index if not exists idx_recurring_rules_user_id on public.recurring_rules(user_id);

-- Triggers
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_accounts_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger trg_monthly_budgets_updated_at
before update on public.monthly_budgets
for each row execute function public.set_updated_at();

create trigger trg_budget_items_updated_at
before update on public.budget_items
for each row execute function public.set_updated_at();

create trigger trg_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create trigger trg_imports_updated_at
before update on public.imports
for each row execute function public.set_updated_at();

create trigger trg_import_rows_updated_at
before update on public.import_rows
for each row execute function public.set_updated_at();

create trigger trg_recurring_rules_updated_at
before update on public.recurring_rules
for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.monthly_budgets enable row level security;
alter table public.budget_items enable row level security;
alter table public.transactions enable row level security;
alter table public.imports enable row level security;
alter table public.import_rows enable row level security;
alter table public.recurring_rules enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create policy "accounts_select_own" on public.accounts for select using (auth.uid() = user_id);
create policy "accounts_insert_own" on public.accounts for insert with check (auth.uid() = user_id);
create policy "accounts_update_own" on public.accounts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "accounts_delete_own" on public.accounts for delete using (auth.uid() = user_id);

create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);

create policy "monthly_budgets_select_own" on public.monthly_budgets for select using (auth.uid() = user_id);
create policy "monthly_budgets_insert_own" on public.monthly_budgets for insert with check (auth.uid() = user_id);
create policy "monthly_budgets_update_own" on public.monthly_budgets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "monthly_budgets_delete_own" on public.monthly_budgets for delete using (auth.uid() = user_id);

create policy "budget_items_select_own" on public.budget_items for select using (auth.uid() = user_id);
create policy "budget_items_insert_own" on public.budget_items for insert with check (auth.uid() = user_id);
create policy "budget_items_update_own" on public.budget_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "budget_items_delete_own" on public.budget_items for delete using (auth.uid() = user_id);

create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

create policy "imports_select_own" on public.imports for select using (auth.uid() = user_id);
create policy "imports_insert_own" on public.imports for insert with check (auth.uid() = user_id);
create policy "imports_update_own" on public.imports for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "imports_delete_own" on public.imports for delete using (auth.uid() = user_id);

create policy "import_rows_select_own" on public.import_rows for select using (auth.uid() = user_id);
create policy "import_rows_insert_own" on public.import_rows for insert with check (auth.uid() = user_id);
create policy "import_rows_update_own" on public.import_rows for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "import_rows_delete_own" on public.import_rows for delete using (auth.uid() = user_id);

create policy "recurring_rules_select_own" on public.recurring_rules for select using (auth.uid() = user_id);
create policy "recurring_rules_insert_own" on public.recurring_rules for insert with check (auth.uid() = user_id);
create policy "recurring_rules_update_own" on public.recurring_rules for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recurring_rules_delete_own" on public.recurring_rules for delete using (auth.uid() = user_id);

-- Dashboard metrics helpers
create or replace function public.fn_dashboard_plan_vs_real(p_month date)
returns table (
  planned numeric(14,2),
  actual numeric(14,2),
  variance numeric(14,2)
)
language sql
stable
as $$
  with b as (
    select coalesce(sum(bi.planned_amount), 0)::numeric(14,2) as planned
    from public.monthly_budgets mb
    join public.budget_items bi on bi.monthly_budget_id = mb.id and bi.user_id = mb.user_id
    where mb.user_id = auth.uid()
      and mb.month = date_trunc('month', p_month)::date
  ),
  t as (
    select coalesce(sum(t.amount), 0)::numeric(14,2) as actual
    from public.transactions t
    where t.user_id = auth.uid()
      and t.direction = 'outflow'
      and date_trunc('month', t.transaction_date)::date = date_trunc('month', p_month)::date
  )
  select b.planned, t.actual, (b.planned - t.actual)::numeric(14,2)
  from b cross join t;
$$;

create or replace view public.v_dashboard_unplanned_expenses
with (security_invoker = true)
as
select
  t.user_id,
  date_trunc('month', t.transaction_date)::date as month,
  coalesce(sum(t.amount), 0)::numeric(14,2) as unplanned_amount
from public.transactions t
left join public.monthly_budgets mb
  on mb.user_id = t.user_id
 and mb.month = date_trunc('month', t.transaction_date)::date
left join public.budget_items bi
  on bi.monthly_budget_id = mb.id
 and bi.user_id = t.user_id
 and bi.category_id = t.category_id
where t.direction = 'outflow'
  and bi.id is null
group by t.user_id, date_trunc('month', t.transaction_date)::date;

create or replace function public.fn_dashboard_net_savings(p_month date)
returns numeric(14,2)
language sql
stable
as $$
  select coalesce(sum(case when direction = 'inflow' then amount else -amount end), 0)::numeric(14,2)
  from public.transactions
  where user_id = auth.uid()
    and type in ('saving_deposit', 'saving_withdrawal')
    and date_trunc('month', transaction_date)::date = date_trunc('month', p_month)::date;
$$;

create or replace function public.fn_dashboard_available_to_spend(p_month date)
returns numeric(14,2)
language sql
stable
as $$
  with income as (
    select coalesce(sum(amount), 0)::numeric(14,2) amount
    from public.transactions
    where user_id = auth.uid()
      and direction = 'inflow'
      and date_trunc('month', transaction_date)::date = date_trunc('month', p_month)::date
  ),
  expenses as (
    select coalesce(sum(amount), 0)::numeric(14,2) amount
    from public.transactions
    where user_id = auth.uid()
      and direction = 'outflow'
      and date_trunc('month', transaction_date)::date = date_trunc('month', p_month)::date
  ),
  planned_savings as (
    select coalesce(sum(bi.planned_amount), 0)::numeric(14,2) amount
    from public.monthly_budgets mb
    join public.budget_items bi on bi.monthly_budget_id = mb.id and bi.user_id = mb.user_id
    join public.categories c on c.id = bi.category_id and c.user_id = bi.user_id
    where mb.user_id = auth.uid()
      and mb.month = date_trunc('month', p_month)::date
      and c.name ilike '%ahorro%'
  )
  select (income.amount - expenses.amount - planned_savings.amount)::numeric(14,2)
  from income, expenses, planned_savings;
$$;
