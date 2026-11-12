-- The waitlist form on landing v12 asks for less: species, pet name, package and email.
-- Older columns stay, so rows from the earlier form keep their data.
alter table waitlist_signups alter column pet_count drop not null;
alter table waitlist_signups alter column species drop not null;
alter table waitlist_signups alter column location drop not null;
alter table waitlist_signups add column pet_name text;
