import { beforeEach, describe, expect, it } from "vitest";
import { createMembership, lockSettlement, redeem, voidRedemption } from "@/lib/ledger";
import { openLocalDb } from "@/lib/local-db";
import { hashPassword, safeEqual, verifyPassword } from "@/lib/passwords";
import {
  clinicSettlements,
  enrollMember,
  memberHistory,
  overview,
  periodOverview,
  searchMembers,
  settlementLines,
} from "@/lib/portal-queries";
import type { Db } from "@/lib/queries";
import { decodeSession, encodeSession } from "@/lib/session";

const secret = "x".repeat(32);

describe("passwords", () => {
  it("accepts the right password only", async () => {
    const hash = await hashPassword("helyes-jelszo");
    expect(hash).not.toContain("helyes");
    expect(await verifyPassword("helyes-jelszo", hash)).toBe(true);
    expect(await verifyPassword("rossz-jelszo", hash)).toBe(false);
    expect(await verifyPassword("x", "nonsense")).toBe(false);
  });

  it("compares strings of different lengths safely", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
});

describe("sessions", () => {
  const exp = Date.now() + 60_000;

  it("round-trips", () => {
    expect(decodeSession(encodeSession({ role: "admin", exp }, secret), secret)).toEqual({ role: "admin", exp });
  });

  it("rejects tampering, the wrong key and expiry", () => {
    const token = encodeSession({ role: "clinic", userId: "a", exp }, secret);
    const [, signature] = token.split(".");
    const forged = `${Buffer.from(JSON.stringify({ role: "admin", exp })).toString("base64url")}.${signature}`;
    expect(decodeSession(forged, secret)).toBeNull();
    expect(decodeSession(token, "y".repeat(32))).toBeNull();
    expect(decodeSession(token, secret, exp + 1)).toBeNull();
    expect(decodeSession("garbage", secret)).toBeNull();
  });
});

describe("portal data", () => {
  const actor = "test";
  let db: Db;
  let clinicA: string;
  let clinicB: string;
  let membership: string;

  const clinic = async (name: string) =>
    (await db.query<{ id: string }>("insert into clinics (name, contract_status) values ($1, 'active') returning id", [name]))[0].id;

  beforeEach(async () => {
    db = await openLocalDb();
    await db.query("update service_prices set valid_from = '2025-01-01'");
    clinicA = await clinic("A rendelő");
    clinicB = await clinic("B rendelő");
    const petId = await enrollMember(db, {
      email: "g@example.hu",
      fullName: "Teszt Gazdi",
      phone: null,
      petName: "Morzsi",
      species: "dog",
      birthDate: null,
      microchip: "111",
    });
    membership = (await createMembership(db, { petId, packageCode: "PLUSZ", startedOn: "2026-01-10", actor })).id;
  });

  const use = (serviceCode: string, clinicId: string, serviceDate = "2026-03-15") =>
    redeem(db, { membershipId: membership, clinicId, serviceCode, serviceDate, actor });

  it("shows a clinic only its own visits, and admin all of them", async () => {
    await use("EXAM", clinicA);
    await use("NAILS", clinicB);
    expect((await memberHistory(db, membership, clinicA)).map((r) => r.service_name)).toEqual(["Éves megelőző vizsgálat"]);
    expect(await memberHistory(db, membership)).toHaveLength(2);
  });

  it("marks voided lines in the history", async () => {
    const line = await use("EXAM", clinicA);
    await voidRedemption(db, { redemptionId: line.id, reason: "hiba", actor });
    const rows = await memberHistory(db, membership);
    expect(rows.find((r) => r.id === line.id)?.voided).toBe(true);
    expect(rows.find((r) => r.quantity === -1)?.reason).toBe("hiba");
  });

  it("finds members by name, email, code and chip, treating % literally", async () => {
    expect(await searchMembers(db, "morz")).toHaveLength(1);
    expect(await searchMembers(db, "g@example")).toHaveLength(1);
    expect(await searchMembers(db, "111")).toHaveLength(1);
    expect(await searchMembers(db, "%")).toHaveLength(0);
    expect(await searchMembers(db, "")).toHaveLength(1);
  });

  it("reports the month before and after locking", async () => {
    await use("EXAM", clinicA);
    await use("NAILS", clinicA, "2026-04-02");
    const before = await periodOverview(db, "2026-03");
    expect(before).toMatchObject([{ clinic_name: "A rendelő", open_ft: 12000, open_lines: 1, settlement_id: null }]);
    const { id } = await lockSettlement(db, { clinicId: clinicA, period: "2026-03", actor });
    const after = await periodOverview(db, "2026-03");
    expect(after).toMatchObject([{ settlement_id: id, total_ft: 12000, open_lines: 0 }]);
    expect(await settlementLines(db, id)).toMatchObject([{ pet_name: "Morzsi", payable_ft: 12000 }]);
    expect(await clinicSettlements(db, clinicA)).toMatchObject([{ period: "2026.03", total_ft: 12000 }]);
    expect(await clinicSettlements(db, clinicB)).toHaveLength(0);
  });

  it("sums the overview", async () => {
    await use("EXAM", clinicA);
    await use("NAILS", clinicB);
    await lockSettlement(db, { clinicId: clinicA, period: "2026-03", actor });
    expect(await overview(db)).toEqual({ members: 1, mrr: 6990, clinics: 2, waitlist: 0, interest: 0, openFt: 3600, unpaidFt: 12000 });
  });

  it("keeps the new tables closed to the public API roles", async () => {
    for (const table of ["clinic_users", "discount_visits"]) {
      const [row] = await db.query<{ anon: boolean }>("select has_table_privilege('anon', $1, 'select') as anon", [table]);
      expect(row.anon).toBe(false);
    }
  });
});
