import { createHash, randomBytes } from "node:crypto";
import type { Db } from "./queries";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// Returns null for an unknown email or too many requests. The caller shows the same message either way.
export async function createLoginToken(db: Db, email: string): Promise<string | null> {
  const [owner] = await db.query<{ id: string; last_minute: number; last_hour: number }>(
    `select o.id,
            count(*) filter (where t.created_at > now() - interval '1 minute')::int as last_minute,
            count(*) filter (where t.created_at > now() - interval '1 hour')::int as last_hour
     from owners o
     left join owner_login_tokens t on t.owner_id = o.id
     where o.email = $1
     group by o.id`,
    [email],
  );
  if (!owner || owner.last_minute >= 1 || owner.last_hour >= 5) return null;
  await db.query("delete from owner_login_tokens where owner_id = $1 and created_at < now() - interval '1 day'", [owner.id]);
  const token = randomBytes(32).toString("base64url");
  await db.query(
    `insert into owner_login_tokens (owner_id, token_hash, expires_at)
     values ($1, $2, now() + interval '15 minutes')`,
    [owner.id, hashToken(token)],
  );
  return token;
}

// A link works once. Using one also cancels the owner's other open links.
export async function consumeLoginToken(db: Db, token: string): Promise<string | null> {
  const [row] = await db.query<{ owner_id: string }>(
    `update owner_login_tokens set used_at = now()
     where token_hash = $1 and used_at is null and expires_at > now()
     returning owner_id`,
    [hashToken(token)],
  );
  if (!row) return null;
  await db.query("update owner_login_tokens set used_at = now() where owner_id = $1 and used_at is null", [row.owner_id]);
  return row.owner_id;
}

export type OwnerPet = {
  pet_id: string;
  name: string;
  species: "dog" | "cat";
  membership_id: string | null;
  package_name: string | null;
  last_day: string | null;
  state: "active" | "expired" | "cancelled" | null;
};

const today = "(now() at time zone 'Europe/Budapest')::date";

// Each pet once, with its current membership if it has one. ends_on is the first day after the membership.
export function ownerPets(db: Db, ownerId: string): Promise<OwnerPet[]> {
  return db.query<OwnerPet>(
    `select * from (
       select distinct on (p.id)
              p.id as pet_id, p.name, p.species, m.id as membership_id, k.name_hu as package_name, (m.ends_on - 1)::text as last_day,
              case when m.id is null then null
                   when m.status = 'cancelled' then 'cancelled'
                   when ${today} >= m.ends_on then 'expired'
                   else 'active' end as state
       from pets p
       left join memberships m on m.pet_id = p.id
       left join packages k on k.code = m.package_code
       where p.owner_id = $1
       order by p.id, (m.status = 'active') desc nulls last, m.started_on desc nulls last
     ) pets
     order by name`,
    [ownerId],
  );
}

export type OwnerMembership = {
  id: string;
  member_code: string;
  pet_name: string;
  package_name: string;
  monthly_fee_ft: number;
  last_day: string;
};

// The owner check is part of the query, so another owner's id finds nothing.
export async function ownerMembership(db: Db, ownerId: string, membershipId: string): Promise<OwnerMembership | null> {
  const [row] = await db.query<OwnerMembership>(
    `select m.id, m.member_code, p.name as pet_name, k.name_hu as package_name, m.monthly_fee_ft,
            (m.ends_on - 1)::text as last_day
     from memberships m
     join pets p on p.id = m.pet_id
     join packages k on k.code = m.package_code
     where m.id::text = $1 and p.owner_id = $2`,
    [membershipId, ownerId],
  );
  return row ?? null;
}

export type OwnerVisit = {
  id: string;
  service_date: string;
  service_name: string;
  clinic_name: string;
  allowance_used_ft: number;
};

// Corrected entries are left out, and so is what the clinic is paid: that is between us and the clinic.
export function ownerVisits(db: Db, membershipId: string): Promise<OwnerVisit[]> {
  return db.query<OwnerVisit>(
    `select r.id, r.service_date::text, s.name_hu as service_name, c.name as clinic_name,
            r.amount_used_ft as allowance_used_ft
     from redemptions r
     join entitlements e on e.id = r.entitlement_id
     join services s on s.code = e.service_code
     join clinics c on c.id = r.clinic_id
     where e.membership_id = $1 and r.quantity = 1
       and not exists (select 1 from redemptions x where x.reverses_id = r.id)
     order by r.service_date desc, r.created_at desc`,
    [membershipId],
  );
}

export type PartnerClinic = {
  id: string;
  name: string;
  address: string | null;
  town: string | null;
  district: string | null;
  discount_percent: string | null;
};

export function partnerClinics(db: Db): Promise<PartnerClinic[]> {
  return db.query<PartnerClinic>(
    `select id, name, address, town, district, discount_percent::text
     from clinics where contract_status = 'active' order by town nulls last, district nulls last, name`,
  );
}
