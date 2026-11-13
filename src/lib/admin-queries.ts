import type { Db } from "./queries";
import type { PartnerType } from "./validation";

const pattern = (query: string) => `%${query.trim().replace(/[\\%_]/g, "\\$&")}%`;

async function audit(db: Db, actor: string, action: string, entity: string, id: string, details: unknown) {
  await db.query(
    "insert into audit_log (actor, action, entity, entity_id, details) values ($1, $2, $3, $4, $5::jsonb)",
    [actor, action, entity, id, JSON.stringify(details)],
  );
}

export type SignupRow = {
  id: string;
  created_at: Date;
  email: string;
  species: "dog" | "cat" | "both" | null;
  pet_name: string | null;
  package_code: string | null;
  package_name: string | null;
  converted_membership_id: string | null;
  confirmed_at: Date | null;
};

const signupSelect = `
  select w.id, w.created_at, w.email, w.species, w.pet_name, w.package_code,
         k.name_hu as package_name, w.converted_membership_id, w.confirmed_at
  from waitlist_signups w
  left join packages k on k.code = w.package_code`;

export function listSignups(db: Db, query: string): Promise<SignupRow[]> {
  return db.query<SignupRow>(
    `${signupSelect}
     where w.email ilike $1 or coalesce(w.pet_name, '') ilike $1
     order by (w.converted_membership_id is null) desc, w.created_at desc limit 200`,
    [pattern(query)],
  );
}

export async function getSignup(db: Db, id: string): Promise<SignupRow | null> {
  const [row] = await db.query<SignupRow>(`${signupSelect} where w.id::text = $1`, [id]);
  return row ?? null;
}

export async function markSignupConverted(db: Db, signupId: string, membershipId: string): Promise<void> {
  await db.query(
    "update waitlist_signups set converted_membership_id = $2 where id::text = $1 and converted_membership_id is null",
    [signupId, membershipId],
  );
}

export type InterestRow = {
  id: string;
  created_at: Date;
  clinic_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  location: string;
  message: string | null;
  clinic_id: string | null;
  partner_type: PartnerType;
};

export function listInterest(db: Db): Promise<InterestRow[]> {
  return db.query<InterestRow>(
    `select id, created_at, clinic_name, contact_name, email, phone, location, message, clinic_id, partner_type
     from clinic_interest order by (clinic_id is null) desc, created_at desc limit 200`,
  );
}

// Returns the clinic's id. A second click finds the clinic made by the first.
export function clinicFromInterest(db: Db, interestId: string, actor: string): Promise<string | null> {
  return db.transaction(async (tx) => {
    const [row] = await tx.query<InterestRow>("select * from clinic_interest where id::text = $1 for update", [interestId]);
    if (!row || row.partner_type !== "clinic") return null;
    if (row.clinic_id) return row.clinic_id;
    const [clinic] = await tx.query<{ id: string }>(
      `insert into clinics (name, contract_status, town, contact_name, contact_email, contact_phone, notes)
       values ($1, 'prospect', $2, $3, $4, $5, $6) returning id`,
      [row.clinic_name, row.location, row.contact_name, row.email, row.phone, row.message],
    );
    await tx.query("update clinic_interest set clinic_id = $2 where id = $1", [row.id, clinic.id]);
    await audit(tx, actor, "clinic.from_interest", "clinic", clinic.id, { interestId: row.id });
    return clinic.id;
  });
}

export type OwnerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  pets: number;
  active: number;
};

const ownerSelect = `
  select o.id, o.full_name, o.email, o.phone,
         count(distinct p.id)::int as pets,
         count(distinct m.id) filter (where m.status = 'active')::int as active
  from owners o
  left join pets p on p.owner_id = o.id
  left join memberships m on m.pet_id = p.id`;

export function listOwners(db: Db, query: string): Promise<OwnerRow[]> {
  return db.query<OwnerRow>(
    `${ownerSelect}
     where o.full_name ilike $1 or o.email ilike $1 or coalesce(o.phone, '') ilike $1
     group by o.id order by o.created_at desc limit 200`,
    [pattern(query)],
  );
}

export async function getOwnerRow(db: Db, id: string): Promise<OwnerRow | null> {
  const [row] = await db.query<OwnerRow>(`${ownerSelect} where o.id::text = $1 group by o.id`, [id]);
  return row ?? null;
}

export type AdminPet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  sex: "male" | "female" | null;
  birth_date: string | null;
  breed: string | null;
  microchip: string | null;
  membership_id: string | null;
  package_name: string | null;
};

// A pet's active membership, if it has one.
export function ownerPetsAdmin(db: Db, ownerId: string): Promise<AdminPet[]> {
  return db.query<AdminPet>(
    `select p.id, p.name, p.species, p.sex, p.birth_date::text, p.breed, p.microchip,
            m.id as membership_id, k.name_hu as package_name
     from pets p
     left join memberships m on m.pet_id = p.id and m.status = 'active'
     left join packages k on k.code = m.package_code
     where p.owner_id = $1
     order by p.created_at`,
    [ownerId],
  );
}

export async function updateOwner(
  db: Db,
  input: { id: string; fullName: string; email: string; phone: string | null; actor: string },
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.query("update owners set full_name = $2, email = $3, phone = $4 where id = $1", [
      input.id,
      input.fullName,
      input.email.toLowerCase(),
      input.phone,
    ]);
    await audit(tx, input.actor, "owner.update", "owner", input.id, { email: input.email.toLowerCase() });
  });
}

export type PetFields = {
  name: string;
  sex: string | null;
  birthDate: string | null;
  breed: string | null;
  microchip: string | null;
};

export async function addPet(db: Db, input: PetFields & { ownerId: string; species: string; actor: string }): Promise<string> {
  return db.transaction(async (tx) => {
    const [pet] = await tx.query<{ id: string }>(
      `insert into pets (owner_id, name, species, sex, birth_date, breed, microchip)
       values ($1, $2, $3, $4, $5::date, $6, $7) returning id`,
      [input.ownerId, input.name, input.species, input.sex, input.birthDate, input.breed, input.microchip],
    );
    await audit(tx, input.actor, "pet.create", "pet", pet.id, { ownerId: input.ownerId });
    return pet.id;
  });
}

// Species stays fixed, because a membership's entitlements were chosen by it.
export async function updatePet(db: Db, input: PetFields & { id: string; ownerId: string; actor: string }): Promise<boolean> {
  return db.transaction(async (tx) => {
    const rows = await tx.query<{ id: string }>(
      `update pets set name = $3, sex = $4, birth_date = $5::date, breed = $6, microchip = $7
       where id = $1 and owner_id = $2 returning id`,
      [input.id, input.ownerId, input.name, input.sex, input.birthDate, input.breed, input.microchip],
    );
    if (rows.length === 0) return false;
    await audit(tx, input.actor, "pet.update", "pet", input.id, { ownerId: input.ownerId });
    return true;
  });
}

export async function petBelongsTo(db: Db, petId: string, ownerId: string): Promise<boolean> {
  const rows = await db.query("select 1 from pets where id = $1 and owner_id = $2", [petId, ownerId]);
  return rows.length > 0;
}
