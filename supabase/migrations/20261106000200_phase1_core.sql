-- Phase 1 core: clinics, dated prices, memberships, entitlements, redemptions, settlements.
-- Every table here is private: RLS on, no policies, no grants. The app uses a server-side connection.

-- A package item is either a counted service or a forint allowance.
alter table package_items alter column quantity drop not null;
alter table package_items alter column quantity drop default;
alter table package_items add column allowance_ft integer check (allowance_ft > 0);
alter table package_items add constraint package_items_one_kind
  check ((quantity is null) <> (allowance_ft is null));

create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contract_status text not null default 'prospect'
    check (contract_status in ('prospect', 'negotiating', 'active', 'ended')),
  discount_percent numeric(5, 2) check (discount_percent between 0 and 100),
  address text,
  town text,
  district text,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  created_at timestamptz not null default now()
);

-- A price applies from valid_from until the next row for the same service and clinic.
-- clinic_id null is the general price. A clinic's own price beats it.
create table service_prices (
  id uuid primary key default gen_random_uuid(),
  service_code text not null references services (code),
  clinic_id uuid references clinics (id),
  price_ft integer not null check (price_ft >= 0),
  valid_from date not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  unique nulls not distinct (service_code, clinic_id, valid_from)
);

create table owners (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references owners (id),
  name text not null,
  species text not null check (species in ('dog', 'cat')),
  sex text check (sex in ('male', 'female')),
  birth_date date,
  breed text,
  microchip text unique,
  created_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  member_code text not null unique,
  pet_id uuid not null references pets (id),
  package_code text not null references packages (code),
  monthly_fee_ft integer not null check (monthly_fee_ft >= 0),
  started_on date not null,
  -- The 12-month commitment. Entitlements are valid before this date.
  ends_on date not null check (ends_on > started_on),
  status text not null default 'active' check (status in ('active', 'cancelled')),
  cancelled_on date,
  created_at timestamptz not null default now()
);

create unique index one_active_membership_per_pet on memberships (pet_id) where status = 'active';

-- A copy of the package at signup, so later catalogue changes never alter what a member bought.
create table entitlements (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships (id),
  service_code text not null references services (code),
  quantity integer check (quantity > 0),
  allowance_ft integer check (allowance_ft > 0),
  check ((quantity is null) <> (allowance_ft is null)),
  unique (membership_id, service_code)
);

-- Append-only. A correction is a new row with the opposite sign.
create table redemptions (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references entitlements (id),
  clinic_id uuid not null references clinics (id),
  service_date date not null,
  quantity integer not null check (quantity in (1, -1)),
  amount_used_ft integer not null default 0,
  payable_ft integer not null,
  reverses_id uuid unique references redemptions (id),
  reason text,
  recorded_by text not null,
  created_at timestamptz not null default now(),
  check ((quantity = 1) = (reverses_id is null))
);

create table settlements (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id),
  period_month date not null check (extract(day from period_month) = 1),
  total_ft integer not null,
  locked_by text not null,
  locked_at timestamptz not null default now(),
  paid_by text,
  paid_at timestamptz,
  unique (clinic_id, period_month)
);

create table settlement_lines (
  redemption_id uuid primary key references redemptions (id),
  settlement_id uuid not null references settlements (id)
);

create table audit_log (
  id bigint generated always as identity primary key,
  actor text not null,
  action text not null,
  entity text not null,
  entity_id text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create function forbid_change() returns trigger language plpgsql as $$
begin
  raise exception '% rows cannot be changed', tg_table_name;
end $$;

create trigger redemptions_append_only before update or delete on redemptions
  for each row execute function forbid_change();
create trigger settlement_lines_append_only before update or delete on settlement_lines
  for each row execute function forbid_change();
create trigger audit_log_append_only before update or delete on audit_log
  for each row execute function forbid_change();

alter table clinics enable row level security;
alter table service_prices enable row level security;
alter table owners enable row level security;
alter table pets enable row level security;
alter table memberships enable row level security;
alter table entitlements enable row level security;
alter table redemptions enable row level security;
alter table settlements enable row level security;
alter table settlement_lines enable row level security;
alter table audit_log enable row level security;

-- Provisional clinic prices from the brief, section 4.
insert into service_prices (service_code, price_ft, valid_from, created_by) values
  ('EXAM', 13000, '2026-11-04', 'brief'),
  ('SICK_VISIT', 13000, '2026-11-04', 'brief'),
  ('FOLLOWUP', 8500, '2026-11-04', 'brief'),
  ('VAX_RABIES', 8500, '2026-11-04', 'brief'),
  ('VAX_COMBINED', 10500, '2026-11-04', 'brief'),
  ('VAX_RABIES_COMBINED', 13000, '2026-11-04', 'brief'),
  ('NAILS', 3500, '2026-11-04', 'brief'),
  ('ANAL_GLAND', 4000, '2026-11-04', 'brief'),
  ('EAR_CLEAN', 5000, '2026-11-04', 'brief'),
  ('BLOOD_BASIC', 21500, '2026-11-04', 'brief'),
  ('BLOOD_EXTENDED', 25000, '2026-11-04', 'brief'),
  ('URINE', 4000, '2026-11-04', 'brief'),
  ('STOOL', 7000, '2026-11-04', 'brief'),
  ('BLOOD_PRESSURE', 5500, '2026-11-04', 'brief'),
  ('ULTRASOUND_ABD', 17000, '2026-11-04', 'brief'),
  ('XRAY', 14000, '2026-11-04', 'brief');
