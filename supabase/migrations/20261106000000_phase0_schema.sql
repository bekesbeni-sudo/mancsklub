-- Phase 0: public catalogue, waitlist and clinic interest.
-- The app writes through a server-side connection. The private tables have RLS
-- on, no policies and no grants, so nothing can reach them through the public API.

create table services (
  code text primary key,
  name_hu text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table packages (
  code text primary key,
  name_hu text not null,
  monthly_fee_ft integer not null check (monthly_fee_ft >= 0),
  status text not null check (status in ('decided', 'proposal')),
  sort_order integer not null default 0,
  active boolean not null default true
);

create table package_items (
  package_code text not null references packages (code) on delete cascade,
  service_code text not null references services (code),
  quantity integer not null default 1 check (quantity > 0),
  primary key (package_code, service_code)
);

create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  pet_count integer not null check (pet_count between 1 and 20),
  species text not null check (species in ('dog', 'cat', 'both')),
  location text not null,
  current_clinic text,
  package_code text references packages (code),
  privacy_version text not null,
  privacy_accepted_at timestamptz not null default now(),
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  check (marketing_consent = (marketing_consent_at is not null))
);

create table clinic_interest (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  location text not null,
  message text,
  privacy_version text not null,
  privacy_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table services enable row level security;
alter table packages enable row level security;
alter table package_items enable row level security;
alter table waitlist_signups enable row level security;
alter table clinic_interest enable row level security;

create policy "catalogue is public" on services for select to anon, authenticated using (active);
create policy "catalogue is public" on packages for select to anon, authenticated using (active);
create policy "catalogue is public" on package_items for select to anon, authenticated using (true);

grant select on services, packages, package_items to anon, authenticated;
