-- The clinic interest form becomes a partner form: brands and service providers can apply too.
alter table clinic_interest add column partner_type text not null default 'clinic'
  check (partner_type in ('clinic', 'food', 'grooming', 'hotel', 'shop', 'brand', 'other'));
