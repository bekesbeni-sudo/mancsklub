-- Clinic prices from partner offer v03 (2026-11-03), gross, confirmed by Benjamin on 2026-11-06.
-- The brief's seeded prices were provisional and never live, so they are replaced in place.
-- Prices set later in the admin are left alone. XRAY and VAX_RABIES_COMBINED are not in the offer or in any package.

update service_prices p
set price_ft = v.price_ft, created_by = 'partner_offer_v03'
from (values
  ('EXAM', 12000),
  ('SICK_VISIT', 12000),
  ('FOLLOWUP', 7500),
  ('BLOOD_BASIC', 13000),
  ('BLOOD_EXTENDED', 21500),
  ('URINE', 3900),
  ('STOOL', 6500),
  ('VAX_RABIES', 9100),
  ('VAX_COMBINED', 11000),
  ('ULTRASOUND_ABD', 14300),
  ('BLOOD_PRESSURE', 5200),
  ('NAILS', 3600),
  ('EAR_CLEAN', 4500),
  ('ANAL_GLAND', 4200)
) as v (service_code, price_ft)
where p.service_code = v.service_code and p.clinic_id is null and p.created_by = 'brief';
