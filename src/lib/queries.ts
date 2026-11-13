import type { ClinicInput, WaitlistInput } from "./validation";

export type Db = {
  query<T>(text: string, params?: unknown[]): Promise<T[]>;
  transaction<T>(fn: (tx: Db) => Promise<T>): Promise<T>;
};

export type PackageItem = {
  code: string;
  name: string;
  quantity: number | null;
  allowanceFt: number | null;
  species: "dog" | "cat" | null;
};
export type Package = {
  code: string;
  name: string;
  monthlyFeeFt: number;
  status: "decided" | "proposal";
  items: PackageItem[];
};

type PackageRow = {
  code: string;
  name_hu: string;
  monthly_fee_ft: number;
  status: Package["status"];
  service_code: string | null;
  service_name: string | null;
  quantity: number | null;
  allowance_ft: number | null;
  species: PackageItem["species"];
};

export async function getPackages(db: Db): Promise<Package[]> {
  const rows = await db.query<PackageRow>(`
    select p.code, p.name_hu, p.monthly_fee_ft, p.status,
           s.code as service_code, s.name_hu as service_name, i.quantity, i.allowance_ft, i.species
    from packages p
    left join package_items i on i.package_code = p.code
    left join services s on s.code = i.service_code and s.active
    where p.active
    order by p.sort_order, s.sort_order`);

  const packages = new Map<string, Package>();
  for (const row of rows) {
    let pkg = packages.get(row.code);
    if (!pkg) {
      pkg = {
        code: row.code,
        name: row.name_hu,
        monthlyFeeFt: row.monthly_fee_ft,
        status: row.status,
        items: [],
      };
      packages.set(row.code, pkg);
    }
    if (row.service_code && row.service_name) {
      pkg.items.push({
        code: row.service_code,
        name: row.service_name,
        quantity: row.quantity,
        allowanceFt: row.allowance_ft,
        species: row.species,
      });
    }
  }
  return [...packages.values()];
}

// A repeat email changes nothing: without email verification, anyone could
// otherwise overwrite someone else's answers or consent.
export async function addWaitlistSignup(
  db: Db,
  input: WaitlistInput,
  privacyVersion: string,
): Promise<{ created: boolean; id: string | null }> {
  const rows = await db.query<{ id: string }>(
    `insert into waitlist_signups (email, species, pet_name, package_code, privacy_version)
     values ($1, $2, $3, $4, $5)
     on conflict (email) do nothing
     returning id`,
    [input.email, input.species, input.petName, input.packageCode, privacyVersion],
  );
  return { created: rows.length > 0, id: rows[0]?.id ?? null };
}

// Says whether a confirmation email should go out now, and marks it as sent. At most one an
// hour per address, so the form cannot be used to flood someone's inbox.
export async function claimConfirmationEmail(db: Db, email: string): Promise<string | null> {
  const rows = await db.query<{ id: string }>(
    `update waitlist_signups set confirmation_sent_at = now()
     where email = $1 and confirmed_at is null
       and (confirmation_sent_at is null or confirmation_sent_at < now() - interval '1 hour')
     returning id`,
    [email],
  );
  return rows[0]?.id ?? null;
}

// True when the signup exists. Pressing the button twice keeps the first date.
export async function confirmWaitlistSignup(db: Db, signupId: string): Promise<boolean> {
  const rows = await db.query(
    "update waitlist_signups set confirmed_at = coalesce(confirmed_at, now()) where id::text = $1 returning id",
    [signupId],
  );
  return rows.length > 0;
}

export async function addClinicSuggestion(db: Db, clinicName: string, signupId: string | null): Promise<void> {
  await db.query(
    `insert into clinic_suggestions (clinic_name, signup_id)
     select $1, (select id from waitlist_signups where id::text = $2)`,
    [clinicName, signupId],
  );
}

export async function addClinicInterest(
  db: Db,
  input: ClinicInput,
  privacyVersion: string,
): Promise<void> {
  await db.query(
    `insert into clinic_interest
       (clinic_name, contact_name, email, phone, location, message, privacy_version)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.clinicName,
      input.contactName,
      input.email,
      input.phone,
      input.location,
      input.message,
      privacyVersion,
    ],
  );
}

export type WaitlistRow = {
  created_at: Date;
  email: string;
  pet_name: string | null;
  pet_count: number | null;
  species: string | null;
  location: string | null;
  current_clinic: string | null;
  package_code: string | null;
  marketing_consent: boolean;
  confirmed_at: Date | null;
};

export function listWaitlist(db: Db): Promise<WaitlistRow[]> {
  return db.query<WaitlistRow>(
    `select created_at, email, pet_name, pet_count, species, location, current_clinic,
            package_code, marketing_consent, confirmed_at
     from waitlist_signups order by created_at`,
  );
}

export type ClinicRow = {
  created_at: Date;
  clinic_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  location: string;
  message: string | null;
};

export function listClinicInterest(db: Db): Promise<ClinicRow[]> {
  return db.query<ClinicRow>(
    `select created_at, clinic_name, contact_name, email, phone, location, message
     from clinic_interest order by created_at`,
  );
}
