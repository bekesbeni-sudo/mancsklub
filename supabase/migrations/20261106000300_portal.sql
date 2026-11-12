-- Clinic logins and discounted unplanned-care visits. Both private.

create table clinic_users (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id),
  email text not null unique check (email = lower(email)),
  name text not null,
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- For reporting only: the owner pays the clinic directly.
create table discount_visits (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships (id),
  clinic_id uuid not null references clinics (id),
  visit_date date not null,
  amount_ft integer not null check (amount_ft > 0),
  discount_ft integer not null check (discount_ft >= 0 and discount_ft <= amount_ft),
  recorded_by text not null,
  created_at timestamptz not null default now()
);

create trigger discount_visits_append_only before update or delete on discount_visits
  for each row execute function forbid_change();

alter table clinic_users enable row level security;
alter table discount_visits enable row level security;
