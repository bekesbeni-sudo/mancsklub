-- Catalogue from the brief, version 2026-11-04. All values are editable data.

insert into services (code, name_hu, sort_order) values
  ('EXAM', 'Általános vizsgálat', 10),
  ('VAX_RABIES_COMBINED', 'Veszettség + kombinált oltás egy oltásban', 20),
  ('VAX_RABIES', 'Veszettség oltás', 21),
  ('VAX_COMBINED', 'Kombinált oltás', 22),
  ('NAILS', 'Karomvágás', 30),
  ('ANAL_GLAND', 'Bűzmirigy kinyomása', 40),
  ('EAR_CLEAN', 'Fültisztítás', 50),
  ('SICK_VISIT', 'Betegvizit', 60),
  ('FOLLOWUP', 'Kontroll vizit', 70),
  ('BLOOD_BASIC', 'Rutin vérvizsgálat vérvétellel', 80),
  ('BLOOD_EXTENDED', 'Bővített vérvizsgálat', 81),
  ('URINE', 'Vizeletvizsgálat', 90),
  ('STOOL', 'Székletvizsgálat', 100),
  ('BLOOD_PRESSURE', 'Vérnyomásmérés', 110),
  ('ULTRASOUND_ABD', 'Hasi ultrahang', 120),
  ('XRAY', 'Röntgen (első felvétel)', 130);

insert into packages (code, name_hu, monthly_fee_ft, status, sort_order) values
  ('ALAP', 'Alap', 3990, 'decided', 10),
  ('PLUSZ', 'Plusz', 7490, 'decided', 20),
  ('PREMIUM', 'Prémium', 9990, 'decided', 30),
  ('PREMIUM_MAX', 'Prémium Max', 14990, 'proposal', 40);

insert into package_items (package_code, service_code, quantity) values
  ('ALAP', 'EXAM', 1), ('ALAP', 'VAX_RABIES_COMBINED', 1), ('ALAP', 'NAILS', 1),
  ('ALAP', 'ANAL_GLAND', 1), ('ALAP', 'EAR_CLEAN', 1),

  ('PLUSZ', 'EXAM', 1), ('PLUSZ', 'VAX_RABIES_COMBINED', 1), ('PLUSZ', 'NAILS', 1),
  ('PLUSZ', 'ANAL_GLAND', 1), ('PLUSZ', 'EAR_CLEAN', 1),
  ('PLUSZ', 'SICK_VISIT', 1), ('PLUSZ', 'BLOOD_BASIC', 1),

  ('PREMIUM', 'EXAM', 1), ('PREMIUM', 'VAX_RABIES_COMBINED', 1), ('PREMIUM', 'NAILS', 1),
  ('PREMIUM', 'ANAL_GLAND', 1), ('PREMIUM', 'EAR_CLEAN', 1),
  ('PREMIUM', 'SICK_VISIT', 1), ('PREMIUM', 'BLOOD_EXTENDED', 1),
  ('PREMIUM', 'URINE', 1), ('PREMIUM', 'ULTRASOUND_ABD', 1),

  ('PREMIUM_MAX', 'EXAM', 2), ('PREMIUM_MAX', 'VAX_RABIES_COMBINED', 1), ('PREMIUM_MAX', 'NAILS', 1),
  ('PREMIUM_MAX', 'ANAL_GLAND', 1), ('PREMIUM_MAX', 'EAR_CLEAN', 1),
  ('PREMIUM_MAX', 'SICK_VISIT', 1), ('PREMIUM_MAX', 'BLOOD_EXTENDED', 1),
  ('PREMIUM_MAX', 'URINE', 1), ('PREMIUM_MAX', 'ULTRASOUND_ABD', 1),
  ('PREMIUM_MAX', 'FOLLOWUP', 1), ('PREMIUM_MAX', 'STOOL', 1),
  ('PREMIUM_MAX', 'BLOOD_PRESSURE', 1), ('PREMIUM_MAX', 'XRAY', 1);
