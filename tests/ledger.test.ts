import { beforeEach, describe, expect, it } from "vitest";
import {
  cancelMembership,
  createMembership,
  getEntitlements,
  lockSettlement,
  lookupMember,
  markSettlementPaid,
  priceOn,
  redeem,
  setPrice,
  voidRedemption,
} from "@/lib/ledger";
import { openLocalDb } from "@/lib/local-db";
import type { Db } from "@/lib/queries";

const actor = "test";
let db: Db;
let clinicId: string;
let otherClinicId: string;
let petId: string;

async function addClinic(status = "active") {
  const [row] = await db.query<{ id: string }>(
    "insert into clinics (name, contract_status) values ('Teszt', $1) returning id",
    [status],
  );
  return row.id;
}

let petCount = 0;
async function addPet(microchip?: string) {
  petCount += 1;
  const [owner] = await db.query<{ id: string }>(
    "insert into owners (email, full_name) values ($1, 'Gazdi') returning id",
    [`gazdi${petCount}@example.hu`],
  );
  const [pet] = await db.query<{ id: string }>(
    "insert into pets (owner_id, name, species, microchip) values ($1, 'Morzsi', 'dog', $2) returning id",
    [owner.id, microchip ?? null],
  );
  return pet.id;
}

const join = (packageCode = "PLUSZ", startedOn = "2026-01-10", pet = petId) =>
  createMembership(db, { petId: pet, packageCode, startedOn, actor });

const spend = (membershipId: string, serviceCode: string, serviceDate = "2026-03-15", clinic = clinicId) =>
  redeem(db, { membershipId, clinicId: clinic, serviceCode, serviceDate, actor });

const left = async (membershipId: string, serviceCode: string) =>
  (await getEntitlements(db, membershipId)).find((e) => e.serviceCode === serviceCode);

async function addAllowance(packageCode: string, serviceCode: string, allowanceFt: number) {
  await db.query("delete from package_items where package_code = $1 and service_code = $2", [packageCode, serviceCode]);
  await db.query(
    "insert into package_items (package_code, service_code, allowance_ft) values ($1, $2, $3)",
    [packageCode, serviceCode, allowanceFt],
  );
}

beforeEach(async () => {
  db = await openLocalDb();
  // The seeded prices start on 2026-11-04. The tests need past months to settle.
  await db.query("update service_prices set valid_from = '2025-01-01'");
  clinicId = await addClinic();
  otherClinicId = await addClinic();
  petId = await addPet("900000000000001");
});

describe("catalogue costs", () => {
  // Full use at the partner offer clinic prices, allowances included.
  async function fullUse(packageCode: string, pet: string) {
    const { id } = await join(packageCode, "2026-01-10", pet);
    let total = 0;
    for (const e of await getEntitlements(db, id)) {
      if (e.allowanceFt !== null) {
        total += (await redeem(db, { membershipId: id, clinicId, serviceCode: e.serviceCode, serviceDate: "2026-03-15", amountFt: e.allowanceFt, actor })).payableFt;
      }
      for (let i = 0; i < (e.quantity ?? 0); i++) total += (await spend(id, e.serviceCode)).payableFt;
    }
    return total;
  }

  it.each([
    ["ALAP", 33400],
    ["PLUSZ", 82600],
    ["PREMIUM", 127400],
    ["PREMIUM_MAX", 200800],
  ])("%s costs %i Ft at full use for a dog", async (code, expected) => {
    expect(await fullUse(code, await addPet())).toBe(expected);
  });

  it("gives cats only the combined vaccine in Alap and Plusz", async () => {
    const [owner] = await db.query<{ id: string }>("insert into owners (email, full_name) values ('cica@example.hu', 'Gazdi') returning id");
    const cat = async () =>
      (await db.query<{ id: string }>("insert into pets (owner_id, name, species) values ($1, 'Mákos', 'cat') returning id", [owner.id]))[0].id;
    for (const code of ["ALAP", "PLUSZ"]) {
      const { id } = await join(code, "2026-01-10", await cat());
      const codes = (await getEntitlements(db, id)).map((e) => e.serviceCode);
      expect(codes).toContain("VAX_COMBINED");
      expect(codes).not.toContain("VAX_RABIES");
    }
  });

  it("gives dogs rabies only in Alap, and both vaccines in Plusz", async () => {
    const alap = await join("ALAP", "2026-01-10", await addPet());
    const plusz = await join("PLUSZ", "2026-01-10", await addPet());
    const codes = async (id: string) => (await getEntitlements(db, id)).map((e) => e.serviceCode);
    expect(await codes(alap.id)).toContain("VAX_RABIES");
    expect(await codes(alap.id)).not.toContain("VAX_COMBINED");
    expect(await codes(plusz.id)).toEqual(expect.arrayContaining(["VAX_RABIES", "VAX_COMBINED"]));
  });
});

describe("prices", () => {
  it("uses the price from the day of service", async () => {
    await setPrice(db, { serviceCode: "EXAM", priceFt: 14000, validFrom: "2026-12-01", actor });
    expect(await priceOn(db, "EXAM", clinicId, "2026-11-30")).toBe(12000);
    expect(await priceOn(db, "EXAM", clinicId, "2026-12-01")).toBe(14000);
    expect(await priceOn(db, "EXAM", clinicId, "2027-06-01")).toBe(14000);
  });

  it("has no price before the first one started", async () => {
    await expect(priceOn(db, "EXAM", clinicId, "2024-12-31")).rejects.toMatchObject({ code: "NO_PRICE" });
  });

  it("lets a clinic's own price beat the general one, for that clinic only", async () => {
    await setPrice(db, { serviceCode: "EXAM", clinicId, priceFt: 15000, validFrom: "2026-11-10", actor });
    expect(await priceOn(db, "EXAM", clinicId, "2026-11-09")).toBe(12000);
    expect(await priceOn(db, "EXAM", clinicId, "2026-11-10")).toBe(15000);
    expect(await priceOn(db, "EXAM", otherClinicId, "2026-11-10")).toBe(12000);
  });

  it("keeps a recorded amount when the price changes later", async () => {
    const { id } = await join();
    await spend(id, "EXAM", "2026-03-15");
    await setPrice(db, { serviceCode: "EXAM", priceFt: 20000, validFrom: "2026-03-01", actor });
    const [row] = await db.query<{ payable_ft: number }>("select payable_ft from redemptions");
    expect(row.payable_ft).toBe(12000);
  });
});

describe("membership", () => {
  it("runs for 12 months and copies the package", async () => {
    const { id, memberCode } = await join();
    const [row] = await db.query<{ ends_on: string; monthly_fee_ft: number }>(
      "select ends_on::text, monthly_fee_ft from memberships where id = $1",
      [id],
    );
    expect(row).toEqual({ ends_on: "2027-01-10", monthly_fee_ft: 6990 });
    expect(memberCode).toMatch(/^MK-[2-9A-Z]{8}$/);
    expect(await getEntitlements(db, id)).toHaveLength(10);
  });

  it("is not affected by later catalogue changes", async () => {
    const { id } = await join();
    await db.query("update packages set monthly_fee_ft = 9000 where code = 'PLUSZ'");
    await db.query("delete from package_items where package_code = 'PLUSZ' and service_code = 'EXAM'");
    expect((await left(id, "EXAM"))?.quantityLeft).toBe(1);
  });

  it("allows one active membership per pet", async () => {
    await join();
    await expect(join("ALAP")).rejects.toThrow();
  });

  it("is found by member code, lowercase code and microchip", async () => {
    const { memberCode } = await join();
    expect((await lookupMember(db, memberCode))?.petName).toBe("Morzsi");
    expect((await lookupMember(db, ` ${memberCode.toLowerCase()} `))?.memberCode).toBe(memberCode);
    expect((await lookupMember(db, "900000000000001"))?.memberCode).toBe(memberCode);
    expect(await lookupMember(db, "MK-NOPE")).toBeNull();
  });
});

describe("redemption", () => {
  it("uses up an entitlement and creates a payable line", async () => {
    const { id } = await join();
    expect((await spend(id, "EXAM")).payableFt).toBe(12000);
    expect((await left(id, "EXAM"))?.quantityLeft).toBe(0);
  });

  it("refuses when nothing is left", async () => {
    const { id } = await join();
    await spend(id, "EXAM");
    await expect(spend(id, "EXAM")).rejects.toMatchObject({ code: "NOTHING_LEFT" });
  });

  it("gives only one of two simultaneous redemptions of the last unit", async () => {
    const { id } = await join();
    const results = await Promise.allSettled([spend(id, "EXAM"), spend(id, "EXAM")]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const rows = await db.query("select id from redemptions");
    expect(rows).toHaveLength(1);
  });

  it("refuses a service outside the package", async () => {
    const { id } = await join();
    await expect(spend(id, "XRAY")).rejects.toMatchObject({ code: "NOT_IN_PACKAGE" });
  });

  it("refuses dates outside the membership year, keeping the last day valid", async () => {
    const { id } = await join("PLUSZ", "2025-06-01");
    await expect(spend(id, "EXAM", "2025-05-31")).rejects.toMatchObject({ code: "OUTSIDE_MEMBERSHIP" });
    await expect(spend(id, "EXAM", "2026-06-01")).rejects.toMatchObject({ code: "OUTSIDE_MEMBERSHIP" });
    await expect(spend(id, "EXAM", "2026-05-31")).resolves.toBeTruthy();
  });

  it("refuses a future date", async () => {
    const { id } = await join();
    await expect(spend(id, "EXAM", "2099-01-01")).rejects.toMatchObject({ code: "FUTURE_DATE" });
  });

  it("refuses a clinic without an active contract", async () => {
    const { id } = await join();
    const prospect = await addClinic("prospect");
    await expect(spend(id, "EXAM", "2026-03-15", prospect)).rejects.toMatchObject({ code: "CLINIC_NOT_PARTNER" });
  });

  it("refuses a cancelled membership, but keeps earlier lines payable", async () => {
    const { id } = await join();
    await spend(id, "EXAM");
    await cancelMembership(db, { membershipId: id, cancelledOn: "2026-04-01", actor });
    await expect(spend(id, "NAILS")).rejects.toMatchObject({ code: "NOT_ACTIVE" });
    expect((await lockSettlement(db, { clinicId, period: "2026-03", actor })).totalFt).toBe(12000);
  });
});

describe("forint allowances", () => {
  beforeEach(() => addAllowance("PLUSZ", "XRAY", 20000));

  it("pays what was used and tracks what is left", async () => {
    const { id } = await join();
    const first = await redeem(db, { membershipId: id, clinicId, serviceCode: "XRAY", serviceDate: "2026-03-15", amountFt: 12000, actor });
    expect(first.payableFt).toBe(12000);
    expect((await left(id, "XRAY"))?.allowanceLeftFt).toBe(8000);
  });

  it("caps the payment at what is left, and the owner pays the rest", async () => {
    const { id } = await join();
    const input = { membershipId: id, clinicId, serviceCode: "XRAY", serviceDate: "2026-03-15", actor };
    await redeem(db, { ...input, amountFt: 15000 });
    expect((await redeem(db, { ...input, amountFt: 15000 })).payableFt).toBe(5000);
    await expect(redeem(db, { ...input, amountFt: 1000 })).rejects.toMatchObject({ code: "NOTHING_LEFT" });
  });

  it("requires an amount", async () => {
    const { id } = await join();
    await expect(spend(id, "XRAY")).rejects.toMatchObject({ code: "AMOUNT_REQUIRED" });
  });

  it("restores the allowance when voided", async () => {
    const { id } = await join();
    const line = await redeem(db, { membershipId: id, clinicId, serviceCode: "XRAY", serviceDate: "2026-03-15", amountFt: 12000, actor });
    await voidRedemption(db, { redemptionId: line.id, reason: "hiba", actor });
    expect((await left(id, "XRAY"))?.allowanceLeftFt).toBe(20000);
  });
});

describe("corrections", () => {
  it("gives the entitlement back and cancels the money", async () => {
    const { id } = await join();
    const line = await spend(id, "EXAM");
    await voidRedemption(db, { redemptionId: line.id, reason: "rossz kedvenc", actor });
    expect((await left(id, "EXAM"))?.quantityLeft).toBe(1);
    expect((await lockSettlement(db, { clinicId, period: "2026-03", actor })).totalFt).toBe(0);
  });

  it("cannot void twice or void a reversal", async () => {
    const { id } = await join();
    const line = await spend(id, "EXAM");
    const reversal = await voidRedemption(db, { redemptionId: line.id, reason: "hiba", actor });
    await expect(voidRedemption(db, { redemptionId: line.id, reason: "x", actor })).rejects.toMatchObject({ code: "ALREADY_VOIDED" });
    await expect(voidRedemption(db, { redemptionId: reversal.id, reason: "x", actor })).rejects.toMatchObject({ code: "ALREADY_VOIDED" });
  });

  it("cannot be edited or deleted in the database", async () => {
    const { id } = await join();
    await spend(id, "EXAM");
    await expect(db.query("update redemptions set payable_ft = 1")).rejects.toThrow();
    await expect(db.query("delete from redemptions")).rejects.toThrow();
    await expect(db.query("delete from audit_log")).rejects.toThrow();
  });

  it("logs who did what", async () => {
    const { id } = await join();
    const line = await spend(id, "EXAM");
    await voidRedemption(db, { redemptionId: line.id, reason: "hiba", actor: "recepcio" });
    const rows = await db.query<{ action: string; actor: string }>("select action, actor from audit_log order by id");
    expect(rows.map((r) => r.action)).toEqual(["membership.create", "redemption.create", "redemption.void"]);
    expect(rows[2].actor).toBe("recepcio");
  });
});

describe("settlement", () => {
  it("adds up one clinic's month and ignores others", async () => {
    const { id } = await join();
    await spend(id, "EXAM", "2026-03-01");
    await spend(id, "NAILS", "2026-03-31");
    await spend(id, "EAR_CLEAN", "2026-04-01");
    await spend(id, "URINE", "2026-03-15", otherClinicId);
    expect(await lockSettlement(db, { clinicId, period: "2026-03", actor })).toMatchObject({ totalFt: 15600, lines: 2 });
    expect(await lockSettlement(db, { clinicId: otherClinicId, period: "2026-03", actor })).toMatchObject({ totalFt: 3900, lines: 1 });
  });

  it("cannot lock the same month twice", async () => {
    await lockSettlement(db, { clinicId, period: "2026-03", actor });
    await expect(lockSettlement(db, { clinicId, period: "2026-03", actor })).rejects.toMatchObject({ code: "ALREADY_LOCKED" });
  });

  it("cannot lock a month that is not over", async () => {
    await expect(lockSettlement(db, { clinicId, period: "2099-01", actor })).rejects.toMatchObject({ code: "PERIOD_NOT_OVER" });
  });

  it("pays a late entry in the next settlement, once", async () => {
    const { id } = await join();
    await spend(id, "EXAM", "2026-03-15");
    await lockSettlement(db, { clinicId, period: "2026-03", actor });
    await spend(id, "NAILS", "2026-03-20");
    await spend(id, "EAR_CLEAN", "2026-04-02");
    expect(await lockSettlement(db, { clinicId, period: "2026-04", actor })).toMatchObject({ totalFt: 8100, lines: 2 });
  });

  it("takes a correction of a settled line from the next settlement", async () => {
    const { id } = await join();
    const line = await spend(id, "EXAM", "2026-03-15");
    await spend(id, "NAILS", "2026-04-02");
    await lockSettlement(db, { clinicId, period: "2026-03", actor });
    await voidRedemption(db, { redemptionId: line.id, reason: "hiba", actor });
    expect(await lockSettlement(db, { clinicId, period: "2026-04", actor })).toMatchObject({ totalFt: -8400, lines: 2 });
  });

  it("marks paid once", async () => {
    const { id } = await lockSettlement(db, { clinicId, period: "2026-03", actor });
    await markSettlementPaid(db, { settlementId: id, actor });
    await expect(markSettlementPaid(db, { settlementId: id, actor })).rejects.toMatchObject({ code: "ALREADY_PAID" });
  });

  it("every forint recorded ends up in exactly one settlement", async () => {
    const { id } = await join("PREMIUM_MAX");
    const a = await spend(id, "EXAM", "2026-02-10");
    await spend(id, "ULTRASOUND_ABD", "2026-02-11");
    await lockSettlement(db, { clinicId, period: "2026-02", actor });
    await voidRedemption(db, { redemptionId: a.id, reason: "hiba", actor });
    await spend(id, "STOOL", "2026-03-01");
    await lockSettlement(db, { clinicId, period: "2026-03", actor });
    const [{ recorded }] = await db.query<{ recorded: number }>("select sum(payable_ft)::int as recorded from redemptions");
    const [{ settled }] = await db.query<{ settled: number }>("select sum(total_ft)::int as settled from settlements");
    expect(settled).toBe(recorded);
    expect(settled).toBe(20800);
  });
});

describe("privacy", () => {
  it("keeps Phase 1 tables closed to the public API roles", async () => {
    const tables = ["clinics", "service_prices", "owners", "pets", "memberships", "entitlements", "redemptions", "settlements", "settlement_lines", "audit_log"];
    for (const table of tables) {
      const [row] = await db.query<{ anon: boolean; rls: boolean }>(
        `select has_table_privilege('anon', $1, 'select') as anon,
                (select relrowsecurity from pg_class where oid = $1::regclass) as rls`,
        [table],
      );
      expect(row).toEqual({ anon: false, rls: true });
    }
  });
});
