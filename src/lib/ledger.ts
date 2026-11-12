import { randomInt } from "node:crypto";
import type { Db } from "./queries";

export type LedgerErrorCode =
  | "NOT_FOUND"
  | "NOT_ACTIVE"
  | "OUTSIDE_MEMBERSHIP"
  | "FUTURE_DATE"
  | "CLINIC_NOT_PARTNER"
  | "NOT_IN_PACKAGE"
  | "NOTHING_LEFT"
  | "AMOUNT_REQUIRED"
  | "NO_PRICE"
  | "ALREADY_VOIDED"
  | "ALREADY_LOCKED"
  | "ALREADY_PAID"
  | "PERIOD_NOT_OVER";

export class LedgerError extends Error {
  constructor(public code: LedgerErrorCode) {
    super(code);
  }
}

const today = "(now() at time zone 'Europe/Budapest')::date";

async function audit(
  db: Db,
  actor: string,
  action: string,
  entity: string,
  entityId: string,
  details: Record<string, unknown>,
) {
  await db.query(
    "insert into audit_log (actor, action, entity, entity_id, details) values ($1, $2, $3, $4, $5::jsonb)",
    [actor, action, entity, entityId, JSON.stringify(details)],
  );
}

// No easily confused characters, because staff may type this at the front desk.
function newMemberCode(): string {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 8; i++) code += alphabet[randomInt(alphabet.length)];
  return `MK-${code}`;
}

// The price on the day of service. A clinic's own price beats the general one.
export async function priceOn(
  db: Db,
  serviceCode: string,
  clinicId: string,
  date: string,
): Promise<number> {
  const rows = await db.query<{ price_ft: number }>(
    `select price_ft from service_prices
     where service_code = $1 and (clinic_id = $2 or clinic_id is null) and valid_from <= $3::date
     order by clinic_id nulls last, valid_from desc
     limit 1`,
    [serviceCode, clinicId, date],
  );
  if (!rows[0]) throw new LedgerError("NO_PRICE");
  return rows[0].price_ft;
}

export async function setPrice(
  db: Db,
  input: { serviceCode: string; clinicId?: string; priceFt: number; validFrom: string; actor: string },
): Promise<void> {
  await db.transaction(async (tx) => {
    const [row] = await tx.query<{ id: string }>(
      `insert into service_prices (service_code, clinic_id, price_ft, valid_from, created_by)
       values ($1, $2, $3, $4::date, $5) returning id`,
      [input.serviceCode, input.clinicId ?? null, input.priceFt, input.validFrom, input.actor],
    );
    await audit(tx, input.actor, "price.set", "service_price", row.id, {
      serviceCode: input.serviceCode,
      clinicId: input.clinicId ?? null,
      priceFt: input.priceFt,
      validFrom: input.validFrom,
    });
  });
}

export async function createMembership(
  db: Db,
  input: { petId: string; packageCode: string; startedOn: string; actor: string },
): Promise<{ id: string; memberCode: string }> {
  return db.transaction(async (tx) => {
    const [pkg] = await tx.query<{ monthly_fee_ft: number }>(
      "select monthly_fee_ft from packages where code = $1 and active",
      [input.packageCode],
    );
    if (!pkg) throw new LedgerError("NOT_FOUND");

    const memberCode = newMemberCode();
    const [membership] = await tx.query<{ id: string }>(
      `insert into memberships (member_code, pet_id, package_code, monthly_fee_ft, started_on, ends_on)
       values ($1, $2, $3, $4, $5::date, ($5::date + interval '12 months')::date)
       returning id`,
      [memberCode, input.petId, input.packageCode, pkg.monthly_fee_ft, input.startedOn],
    );
    await tx.query(
      `insert into entitlements (membership_id, service_code, quantity, allowance_ft)
       select $1, i.service_code, i.quantity, i.allowance_ft
       from package_items i
       join pets p on p.id = $3
       where i.package_code = $2 and (i.species is null or i.species = p.species)`,
      [membership.id, input.packageCode, input.petId],
    );
    await audit(tx, input.actor, "membership.create", "membership", membership.id, {
      packageCode: input.packageCode,
      startedOn: input.startedOn,
    });
    return { id: membership.id, memberCode };
  });
}

export async function cancelMembership(
  db: Db,
  input: { membershipId: string; cancelledOn: string; actor: string },
): Promise<void> {
  await db.transaction(async (tx) => {
    const rows = await tx.query<{ id: string }>(
      `update memberships set status = 'cancelled', cancelled_on = $2::date
       where id = $1 and status = 'active' returning id`,
      [input.membershipId, input.cancelledOn],
    );
    if (!rows[0]) throw new LedgerError("NOT_ACTIVE");
    await audit(tx, input.actor, "membership.cancel", "membership", input.membershipId, {
      cancelledOn: input.cancelledOn,
    });
  });
}

export type Entitlement = {
  serviceCode: string;
  serviceName: string;
  quantity: number | null;
  quantityLeft: number | null;
  allowanceFt: number | null;
  allowanceLeftFt: number | null;
};

export async function getEntitlements(db: Db, membershipId: string): Promise<Entitlement[]> {
  const rows = await db.query<{
    service_code: string;
    name_hu: string;
    quantity: number | null;
    allowance_ft: number | null;
    used: number;
    used_ft: number;
  }>(
    `select e.service_code, s.name_hu, e.quantity, e.allowance_ft,
            coalesce(sum(r.quantity), 0)::int as used,
            coalesce(sum(r.amount_used_ft), 0)::int as used_ft
     from entitlements e
     join services s on s.code = e.service_code
     left join redemptions r on r.entitlement_id = e.id
     where e.membership_id = $1
     group by e.id, s.name_hu, s.sort_order
     order by s.sort_order`,
    [membershipId],
  );
  return rows.map((row) => ({
    serviceCode: row.service_code,
    serviceName: row.name_hu,
    quantity: row.quantity,
    quantityLeft: row.quantity === null ? null : row.quantity - row.used,
    allowanceFt: row.allowance_ft,
    allowanceLeftFt: row.allowance_ft === null ? null : row.allowance_ft - row.used_ft,
  }));
}

export type MemberLookup = {
  membershipId: string;
  memberCode: string;
  petName: string;
  species: string;
  packageCode: string;
  status: string;
  startedOn: string;
  endsOn: string;
  isValidToday: boolean;
};

// Works with the code in the QR, a typed member code or a microchip number.
export async function lookupMember(db: Db, query: string): Promise<MemberLookup | null> {
  const value = query.trim();
  const [row] = await db.query<{
    id: string;
    member_code: string;
    name: string;
    species: string;
    package_code: string;
    status: string;
    started_on: string;
    ends_on: string;
    valid: boolean;
  }>(
    `select m.id, m.member_code, p.name, p.species, m.package_code, m.status,
            m.started_on::text, m.ends_on::text,
            (m.status = 'active' and ${today} >= m.started_on and ${today} < m.ends_on) as valid
     from memberships m
     join pets p on p.id = m.pet_id
     where m.member_code = upper($1) or p.microchip = $1
     order by (m.status = 'active') desc, m.started_on desc
     limit 1`,
    [value],
  );
  if (!row) return null;
  return {
    membershipId: row.id,
    memberCode: row.member_code,
    petName: row.name,
    species: row.species,
    packageCode: row.package_code,
    status: row.status,
    startedOn: row.started_on,
    endsOn: row.ends_on,
    isValidToday: row.valid,
  };
}

export async function redeem(
  db: Db,
  input: {
    membershipId: string;
    clinicId: string;
    serviceCode: string;
    serviceDate: string;
    amountFt?: number;
    actor: string;
  },
): Promise<{ id: string; payableFt: number }> {
  return db.transaction(async (tx) => {
    // The lock makes two simultaneous redemptions of the last unit queue up.
    const [membership] = await tx.query<{
      status: string;
      in_term: boolean;
      not_future: boolean;
    }>(
      `select status, ($2::date >= started_on and $2::date < ends_on) as in_term,
              ($2::date <= ${today}) as not_future
       from memberships where id = $1 for update`,
      [input.membershipId, input.serviceDate],
    );
    if (!membership) throw new LedgerError("NOT_FOUND");
    if (membership.status !== "active") throw new LedgerError("NOT_ACTIVE");
    if (!membership.not_future) throw new LedgerError("FUTURE_DATE");
    if (!membership.in_term) throw new LedgerError("OUTSIDE_MEMBERSHIP");

    const [clinic] = await tx.query<{ contract_status: string }>(
      "select contract_status from clinics where id = $1",
      [input.clinicId],
    );
    if (clinic?.contract_status !== "active") throw new LedgerError("CLINIC_NOT_PARTNER");

    const entitlements = await getEntitlements(tx, input.membershipId);
    const entitlement = entitlements.find((e) => e.serviceCode === input.serviceCode);
    if (!entitlement) throw new LedgerError("NOT_IN_PACKAGE");

    let payableFt: number;
    let amountUsedFt = 0;
    if (entitlement.allowanceLeftFt !== null) {
      // Allowances: the clinic gets what was used, up to what is left. The owner pays the rest.
      if (!input.amountFt || input.amountFt <= 0) throw new LedgerError("AMOUNT_REQUIRED");
      if (entitlement.allowanceLeftFt <= 0) throw new LedgerError("NOTHING_LEFT");
      amountUsedFt = Math.min(input.amountFt, entitlement.allowanceLeftFt);
      payableFt = amountUsedFt;
    } else {
      if ((entitlement.quantityLeft ?? 0) <= 0) throw new LedgerError("NOTHING_LEFT");
      payableFt = await priceOn(tx, input.serviceCode, input.clinicId, input.serviceDate);
    }

    const [row] = await tx.query<{ id: string }>(
      `insert into redemptions
         (entitlement_id, clinic_id, service_date, quantity, amount_used_ft, payable_ft, recorded_by)
       select id, $3, $4::date, 1, $5, $6, $7
       from entitlements where membership_id = $1 and service_code = $2
       returning id`,
      [
        input.membershipId,
        input.serviceCode,
        input.clinicId,
        input.serviceDate,
        amountUsedFt,
        payableFt,
        input.actor,
      ],
    );
    await audit(tx, input.actor, "redemption.create", "redemption", row.id, {
      membershipId: input.membershipId,
      clinicId: input.clinicId,
      serviceCode: input.serviceCode,
      serviceDate: input.serviceDate,
      payableFt,
    });
    return { id: row.id, payableFt };
  });
}

// Gives the entitlement back and cancels the money. If the original was already
// settled, the negative line lands in the clinic's next settlement.
export async function voidRedemption(
  db: Db,
  input: { redemptionId: string; reason: string; actor: string },
): Promise<{ id: string }> {
  return db.transaction(async (tx) => {
    const [original] = await tx.query<{ id: string; quantity: number }>(
      "select id, quantity from redemptions where id = $1 for update",
      [input.redemptionId],
    );
    if (!original) throw new LedgerError("NOT_FOUND");
    const [existing] = await tx.query<{ id: string }>(
      "select id from redemptions where reverses_id = $1",
      [input.redemptionId],
    );
    if (existing || original.quantity !== 1) throw new LedgerError("ALREADY_VOIDED");

    const [row] = await tx.query<{ id: string }>(
      `insert into redemptions
         (entitlement_id, clinic_id, service_date, quantity, amount_used_ft, payable_ft,
          reverses_id, reason, recorded_by)
       select entitlement_id, clinic_id, service_date, -1, -amount_used_ft, -payable_ft, id, $2, $3
       from redemptions where id = $1
       returning id`,
      [input.redemptionId, input.reason, input.actor],
    );
    await audit(tx, input.actor, "redemption.void", "redemption", input.redemptionId, {
      reason: input.reason,
      reversalId: row.id,
    });
    return { id: row.id };
  });
}

// period is "YYYY-MM". Takes everything not yet settled up to the end of that month,
// so late entries for earlier months are paid rather than lost.
export async function lockSettlement(
  db: Db,
  input: { clinicId: string; period: string; actor: string },
): Promise<{ id: string; totalFt: number; lines: number }> {
  return db.transaction(async (tx) => {
    const periodStart = `${input.period}-01`;
    const [{ over }] = await tx.query<{ over: boolean }>(
      `select ($1::date + interval '1 month')::date <= ${today} as over`,
      [periodStart],
    );
    if (!over) throw new LedgerError("PERIOD_NOT_OVER");

    // Serialises locks per clinic, so no line can land in two settlements.
    const [clinic] = await tx.query<{ id: string }>("select id from clinics where id = $1 for update", [
      input.clinicId,
    ]);
    if (!clinic) throw new LedgerError("NOT_FOUND");

    const [existing] = await tx.query<{ id: string }>(
      "select id from settlements where clinic_id = $1 and period_month = $2::date",
      [input.clinicId, periodStart],
    );
    if (existing) throw new LedgerError("ALREADY_LOCKED");

    const lines = await tx.query<{ id: string; payable_ft: number }>(
      `select r.id, r.payable_ft from redemptions r
       left join settlement_lines l on l.redemption_id = r.id
       where r.clinic_id = $1 and l.redemption_id is null
         and r.service_date < ($2::date + interval '1 month')::date`,
      [input.clinicId, periodStart],
    );
    const totalFt = lines.reduce((sum, line) => sum + line.payable_ft, 0);

    const [settlement] = await tx.query<{ id: string }>(
      `insert into settlements (clinic_id, period_month, total_ft, locked_by)
       values ($1, $2::date, $3, $4) returning id`,
      [input.clinicId, periodStart, totalFt, input.actor],
    );
    for (const line of lines) {
      await tx.query("insert into settlement_lines (redemption_id, settlement_id) values ($1, $2)", [
        line.id,
        settlement.id,
      ]);
    }
    await audit(tx, input.actor, "settlement.lock", "settlement", settlement.id, {
      clinicId: input.clinicId,
      period: input.period,
      totalFt,
      lines: lines.length,
    });
    return { id: settlement.id, totalFt, lines: lines.length };
  });
}

export async function markSettlementPaid(
  db: Db,
  input: { settlementId: string; actor: string },
): Promise<void> {
  await db.transaction(async (tx) => {
    const rows = await tx.query<{ id: string }>(
      `update settlements set paid_by = $2, paid_at = now()
       where id = $1 and paid_at is null returning id`,
      [input.settlementId, input.actor],
    );
    if (!rows[0]) throw new LedgerError("ALREADY_PAID");
    await audit(tx, input.actor, "settlement.paid", "settlement", input.settlementId, {});
  });
}
