import type { Db } from "./queries";

const intCount = (n: unknown) => Number(n ?? 0);

export type ClinicRow = {
  id: string;
  name: string;
  contract_status: string;
  discount_percent: string | null;
  address: string | null;
  town: string | null;
  district: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
};

export function listClinics(db: Db): Promise<ClinicRow[]> {
  return db.query<ClinicRow>(
    `select id, name, contract_status, discount_percent::text, address, town, district,
            contact_name, contact_email, contact_phone, notes
     from clinics order by name`,
  );
}

export async function getClinic(db: Db, id: string): Promise<ClinicRow | null> {
  const rows = await db.query<ClinicRow>(
    `select id, name, contract_status, discount_percent::text, address, town, district,
            contact_name, contact_email, contact_phone, notes
     from clinics where id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export type PriceRow = {
  id: string;
  service_code: string;
  name_hu: string;
  price_ft: number;
  valid_from: string;
  clinic_id: string | null;
};

// All price rows, newest first. A null clinicId means the general prices.
export function listPrices(db: Db, clinicId: string | null): Promise<PriceRow[]> {
  return db.query<PriceRow>(
    `select p.id, p.service_code, s.name_hu, p.price_ft, p.valid_from::text, p.clinic_id
     from service_prices p join services s on s.code = p.service_code
     where p.clinic_id is not distinct from $1
     order by s.sort_order, p.valid_from desc`,
    [clinicId],
  );
}

export function listServices(db: Db) {
  return db.query<{ code: string; name_hu: string }>(
    "select code, name_hu from services where active order by sort_order",
  );
}

export function listClinicUsers(db: Db, clinicId: string) {
  return db.query<{ id: string; name: string; email: string; active: boolean }>(
    "select id, name, email, active from clinic_users where clinic_id = $1 order by name",
    [clinicId],
  );
}

export type MemberRow = {
  id: string;
  member_code: string;
  pet_name: string;
  species: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  package_name: string;
  monthly_fee_ft: number;
  status: string;
  started_on: string;
  last_day: string;
};

// ends_on is the first day after the membership, so people are shown the day before it.
const memberSelect = `
  select m.id, m.member_code, p.name as pet_name, p.species, o.id as owner_id, o.full_name as owner_name,
         o.email as owner_email, k.name_hu as package_name, m.monthly_fee_ft, m.status,
         m.started_on::text, (m.ends_on - 1)::text as last_day
  from memberships m
  join pets p on p.id = m.pet_id
  join owners o on o.id = p.owner_id
  join packages k on k.code = m.package_code`;

export function searchMembers(db: Db, query: string): Promise<MemberRow[]> {
  const like = `%${query.trim().replace(/[\\%_]/g, "\\$&")}%`;
  return db.query<MemberRow>(
    `${memberSelect}
     where m.member_code ilike $1 or p.name ilike $1 or o.email ilike $1
        or o.full_name ilike $1 or p.microchip ilike $1
     order by m.created_at desc limit 50`,
    [like],
  );
}

export async function getMember(db: Db, id: string): Promise<MemberRow | null> {
  const rows = await db.query<MemberRow>(`${memberSelect} where m.id = $1`, [id]);
  return rows[0] ?? null;
}

export type HistoryRow = {
  id: string;
  service_date: string;
  service_name: string;
  clinic_name: string;
  quantity: number;
  payable_ft: number;
  reason: string | null;
  voided: boolean;
};

// A clinic only sees its own visits: other clinics' records are not its business.
export function memberHistory(db: Db, membershipId: string, clinicId?: string): Promise<HistoryRow[]> {
  return db.query<HistoryRow>(
    `select r.id, r.service_date::text, s.name_hu as service_name, c.name as clinic_name,
            r.quantity, r.payable_ft, r.reason,
            exists (select 1 from redemptions x where x.reverses_id = r.id) as voided
     from redemptions r
     join entitlements e on e.id = r.entitlement_id
     join services s on s.code = e.service_code
     join clinics c on c.id = r.clinic_id
     where e.membership_id = $1 and ($2::uuid is null or r.clinic_id = $2::uuid)
     order by r.service_date desc, r.created_at desc`,
    [membershipId, clinicId ?? null],
  );
}

export async function redemptionClinic(db: Db, redemptionId: string): Promise<string | null> {
  const rows = await db.query<{ clinic_id: string }>("select clinic_id from redemptions where id = $1", [
    redemptionId,
  ]);
  return rows[0]?.clinic_id ?? null;
}

export async function overview(db: Db) {
  const [row] = await db.query<Record<string, unknown>>(`
    select
      (select count(*) from memberships where status = 'active') as members,
      (select coalesce(sum(monthly_fee_ft), 0) from memberships where status = 'active') as mrr,
      (select count(*) from clinics where contract_status = 'active') as clinics,
      (select count(*) from waitlist_signups where converted_membership_id is null) as waitlist,
      (select count(*) from clinic_interest where clinic_id is null) as interest,
      (select coalesce(sum(r.payable_ft), 0) from redemptions r
         left join settlement_lines l on l.redemption_id = r.id
         where l.redemption_id is null) as open_ft,
      (select coalesce(sum(total_ft), 0) from settlements where paid_at is null) as unpaid_ft`);
  return {
    members: intCount(row.members),
    mrr: intCount(row.mrr),
    clinics: intCount(row.clinics),
    waitlist: intCount(row.waitlist),
    interest: intCount(row.interest),
    openFt: intCount(row.open_ft),
    unpaidFt: intCount(row.unpaid_ft),
  };
}

export function requestedClinics(db: Db) {
  return db.query<{ clinic: string; requests: number }>(
    `select min(name) as clinic, count(*)::int as requests
     from (
       select current_clinic as name from waitlist_signups where current_clinic is not null
       union all
       select clinic_name from clinic_suggestions
     ) asked
     group by lower(trim(name))
     order by requests desc, clinic limit 10`,
  );
}

export type PeriodRow = {
  clinic_id: string;
  clinic_name: string;
  open_ft: number;
  open_lines: number;
  settlement_id: string | null;
  total_ft: number | null;
  paid_at: string | null;
};

export function periodOverview(db: Db, period: string): Promise<PeriodRow[]> {
  return db.query<PeriodRow>(
    `select c.id as clinic_id, c.name as clinic_name,
            coalesce(o.open_ft, 0)::int as open_ft, coalesce(o.open_lines, 0)::int as open_lines,
            s.id as settlement_id, s.total_ft, s.paid_at::text
     from clinics c
     left join settlements s on s.clinic_id = c.id and s.period_month = $1::date
     left join lateral (
       select sum(r.payable_ft) as open_ft, count(*) as open_lines
       from redemptions r left join settlement_lines l on l.redemption_id = r.id
       where r.clinic_id = c.id and l.redemption_id is null
         and r.service_date < ($1::date + interval '1 month')::date
     ) o on true
     where s.id is not null or o.open_lines > 0
     order by c.name`,
    [`${period}-01`],
  );
}

export function clinicSettlements(db: Db, clinicId: string) {
  return db.query<{ id: string; period: string; total_ft: number; paid_at: string | null }>(
    `select id, to_char(period_month, 'YYYY.MM') as period, total_ft, paid_at::text
     from settlements where clinic_id = $1 order by period_month desc`,
    [clinicId],
  );
}

export async function settlementClinic(db: Db, id: string) {
  const rows = await db.query<{ clinic_id: string; period: string }>(
    "select clinic_id, to_char(period_month, 'YYYY-MM') as period from settlements where id = $1",
    [id],
  );
  return rows[0] ?? null;
}

export function settlementLines(db: Db, settlementId: string) {
  return db.query<{
    service_date: string;
    member_code: string;
    pet_name: string;
    service_name: string;
    quantity: number;
    payable_ft: number;
  }>(
    `select r.service_date::text, m.member_code, p.name as pet_name, s.name_hu as service_name,
            r.quantity, r.payable_ft
     from settlement_lines l
     join redemptions r on r.id = l.redemption_id
     join entitlements e on e.id = r.entitlement_id
     join memberships m on m.id = e.membership_id
     join pets p on p.id = m.pet_id
     join services s on s.code = e.service_code
     where l.settlement_id = $1
     order by r.service_date, r.created_at`,
    [settlementId],
  );
}

export async function enrollMember(
  db: Db,
  input: { email: string; fullName: string; phone: string | null; petName: string; species: string; birthDate: string | null; microchip: string | null },
): Promise<string> {
  const [owner] = await db.query<{ id: string }>(
    `insert into owners (email, full_name, phone) values ($1, $2, $3)
     on conflict (email) do update set full_name = excluded.full_name
     returning id`,
    [input.email, input.fullName, input.phone],
  );
  const [pet] = await db.query<{ id: string }>(
    `insert into pets (owner_id, name, species, birth_date, microchip)
     values ($1, $2, $3, $4::date, $5) returning id`,
    [owner.id, input.petName, input.species, input.birthDate, input.microchip],
  );
  return pet.id;
}

export async function recordDiscountVisit(
  db: Db,
  input: { membershipId: string; clinicId: string; visitDate: string; amountFt: number; discountFt: number; actor: string },
): Promise<void> {
  await db.query(
    `insert into discount_visits (membership_id, clinic_id, visit_date, amount_ft, discount_ft, recorded_by)
     values ($1, $2, $3::date, $4, $5, $6)`,
    [input.membershipId, input.clinicId, input.visitDate, input.amountFt, input.discountFt, input.actor],
  );
}
