-- The landing page now offers six packages, including Kölyök and Senior, which are not in the
-- catalogue yet. A signup keeps the package it was interested in without needing a catalogue row.
alter table waitlist_signups drop constraint waitlist_signups_package_code_fkey;
alter table waitlist_signups add constraint waitlist_signups_package_code_format
  check (package_code ~ '^[A-Z_]{2,20}$');

-- Clinics that visitors would like to see join, from the box at the bottom of the landing page.
-- Linked to the signup when the same visitor has just signed up.
create table clinic_suggestions (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null check (length(clinic_name) between 1 and 80),
  signup_id uuid references waitlist_signups (id),
  created_at timestamptz not null default now()
);

alter table clinic_suggestions enable row level security;
revoke all on clinic_suggestions from anon, authenticated;
