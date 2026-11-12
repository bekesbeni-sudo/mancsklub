-- Links a waitlist signup to the membership it became, and a clinic enquiry to the clinic it became.
alter table waitlist_signups add column converted_membership_id uuid references memberships (id);
alter table clinic_interest add column clinic_id uuid references clinics (id);
