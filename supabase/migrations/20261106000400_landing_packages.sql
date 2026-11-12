-- Packages as shown on landing v12 (2026-11-06), confirmed by Benjamin. Replaces the brief's package contents.
-- Existing memberships keep the entitlements they signed up with.

alter table package_items add column species text check (species in ('dog', 'cat'));
comment on column package_items.species is 'Null means the item applies to both species.';

update packages set monthly_fee_ft = 3490 where code = 'ALAP';
update packages set monthly_fee_ft = 6990 where code = 'PLUSZ';

insert into services (code, name_hu, sort_order) values
  ('PARASITE', 'Parazitakeret', 140),
  ('DENTAL', 'Fogászati keret', 150);

update services set active = false where code = 'VAX_RABIES_COMBINED';
update services set name_hu = 'Éves megelőző vizsgálat' where code = 'EXAM';
update services set name_hu = 'Kontrollvizit' where code = 'FOLLOWUP';
update services set name_hu = 'Alap vérvizsgálat' where code = 'BLOOD_BASIC';
update services set name_hu = 'Anális mirigy kinyomása' where code = 'ANAL_GLAND';
update services set name_hu = 'Veszettség elleni oltás' where code = 'VAX_RABIES';

delete from package_items;

insert into package_items (package_code, service_code, quantity, species) values
  ('ALAP', 'EXAM', 1, null), ('ALAP', 'VAX_RABIES', 1, 'dog'), ('ALAP', 'VAX_COMBINED', 1, 'cat'),
  ('ALAP', 'NAILS', 1, null), ('ALAP', 'EAR_CLEAN', 1, null), ('ALAP', 'ANAL_GLAND', 1, null),

  ('PLUSZ', 'EXAM', 1, null), ('PLUSZ', 'SICK_VISIT', 1, null), ('PLUSZ', 'FOLLOWUP', 1, null),
  ('PLUSZ', 'BLOOD_BASIC', 1, null), ('PLUSZ', 'URINE', 1, null),
  ('PLUSZ', 'VAX_RABIES', 1, 'dog'), ('PLUSZ', 'VAX_COMBINED', 1, null),
  ('PLUSZ', 'NAILS', 1, null), ('PLUSZ', 'EAR_CLEAN', 1, null),

  ('PREMIUM', 'EXAM', 1, null), ('PREMIUM', 'SICK_VISIT', 1, null), ('PREMIUM', 'FOLLOWUP', 1, null),
  ('PREMIUM', 'BLOOD_EXTENDED', 1, null), ('PREMIUM', 'URINE', 1, null),
  ('PREMIUM', 'VAX_RABIES', 1, null), ('PREMIUM', 'VAX_COMBINED', 1, null),
  ('PREMIUM', 'ULTRASOUND_ABD', 1, null), ('PREMIUM', 'NAILS', 1, null), ('PREMIUM', 'EAR_CLEAN', 1, null),

  ('PREMIUM_MAX', 'EXAM', 2, null), ('PREMIUM_MAX', 'SICK_VISIT', 3, null), ('PREMIUM_MAX', 'FOLLOWUP', 2, null),
  ('PREMIUM_MAX', 'BLOOD_EXTENDED', 1, null), ('PREMIUM_MAX', 'URINE', 1, null), ('PREMIUM_MAX', 'STOOL', 1, null),
  ('PREMIUM_MAX', 'VAX_RABIES', 1, null), ('PREMIUM_MAX', 'VAX_COMBINED', 1, null),
  ('PREMIUM_MAX', 'ULTRASOUND_ABD', 1, null), ('PREMIUM_MAX', 'BLOOD_PRESSURE', 1, null),
  ('PREMIUM_MAX', 'NAILS', 1, null), ('PREMIUM_MAX', 'EAR_CLEAN', 1, null), ('PREMIUM_MAX', 'ANAL_GLAND', 1, null);

insert into package_items (package_code, service_code, allowance_ft) values
  ('PLUSZ', 'PARASITE', 6000),
  ('PREMIUM', 'PARASITE', 8000), ('PREMIUM', 'DENTAL', 20000),
  ('PREMIUM_MAX', 'PARASITE', 12000), ('PREMIUM_MAX', 'DENTAL', 30000);
