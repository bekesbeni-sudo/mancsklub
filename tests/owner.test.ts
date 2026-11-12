import { beforeEach, describe, expect, it } from "vitest";
import { createMembership, redeem, voidRedemption } from "@/lib/ledger";
import { openLocalDb } from "@/lib/local-db";
import { consumeLoginToken, createLoginToken, ownerMembership, ownerPets, ownerVisits, partnerClinics } from "@/lib/owner";
import { enrollMember } from "@/lib/portal-queries";
import type { Db } from "@/lib/queries";
import { decodeSession, encodeSession } from "@/lib/session";

const actor = "teszt";
let db: Db;
let ownerId: string;
let membershipId: string;
let clinicId: string;

async function member(email: string, petName: string, species = "dog") {
  const petId = await enrollMember(db, { email, fullName: "Teszt Gazdi", phone: null, petName, species, birthDate: null, microchip: null });
  return createMembership(db, { petId, packageCode: "PLUSZ", startedOn: "2026-01-10", actor });
}

beforeEach(async () => {
  db = await openLocalDb();
  await db.query("update service_prices set valid_from = '2025-01-01'");
  membershipId = (await member("gazdi@example.hu", "Morzsi")).id;
  [{ id: ownerId }] = await db.query<{ id: string }>("select id from owners where email = 'gazdi@example.hu'");
  [{ id: clinicId }] = await db.query<{ id: string }>("insert into clinics (name, contract_status) values ('Partner', 'active') returning id");
});

const age = (interval: string) => db.query(`update owner_login_tokens set created_at = created_at - interval '${interval}'`);

describe("login links", () => {
  it("logs in once with a link", async () => {
    const token = await createLoginToken(db, "gazdi@example.hu");
    expect(await consumeLoginToken(db, token!)).toBe(ownerId);
    expect(await consumeLoginToken(db, token!)).toBeNull();
  });

  it("gives nothing for an unknown email or a made-up link", async () => {
    expect(await createLoginToken(db, "senki@example.hu")).toBeNull();
    expect(await consumeLoginToken(db, "kitalalt")).toBeNull();
    expect(await consumeLoginToken(db, "")).toBeNull();
  });

  it("refuses an expired link", async () => {
    const token = await createLoginToken(db, "gazdi@example.hu");
    await db.query("update owner_login_tokens set expires_at = now() - interval '1 second'");
    expect(await consumeLoginToken(db, token!)).toBeNull();
  });

  it("stores only a hash of the link", async () => {
    const token = await createLoginToken(db, "gazdi@example.hu");
    const [row] = await db.query<{ token_hash: string }>("select token_hash from owner_login_tokens");
    expect(row.token_hash).not.toContain(token!);
  });

  it("limits requests to one a minute and five an hour", async () => {
    expect(await createLoginToken(db, "gazdi@example.hu")).not.toBeNull();
    expect(await createLoginToken(db, "gazdi@example.hu")).toBeNull();
    for (let i = 0; i < 4; i++) {
      await age("2 minutes");
      expect(await createLoginToken(db, "gazdi@example.hu")).not.toBeNull();
    }
    await age("2 minutes");
    expect(await createLoginToken(db, "gazdi@example.hu")).toBeNull();
    await age("2 hours");
    expect(await createLoginToken(db, "gazdi@example.hu")).not.toBeNull();
  });

  it("cancels the owner's other open links on login", async () => {
    const first = await createLoginToken(db, "gazdi@example.hu");
    await age("2 minutes");
    const second = await createLoginToken(db, "gazdi@example.hu");
    await consumeLoginToken(db, second!);
    expect(await consumeLoginToken(db, first!)).toBeNull();
  });

  it("keeps the table closed to the public API roles", async () => {
    const [row] = await db.query<{ anon: boolean; rls: boolean }>(
      `select has_table_privilege('anon', 'owner_login_tokens', 'select') as anon,
              (select relrowsecurity from pg_class where oid = 'owner_login_tokens'::regclass) as rls`,
    );
    expect(row).toEqual({ anon: false, rls: true });
  });

  it("carries the owner in a signed session", () => {
    const secret = "x".repeat(32);
    const token = encodeSession({ role: "owner", ownerId: "a", exp: 2000 }, secret);
    expect(decodeSession(token, secret, 1000)).toEqual({ role: "owner", ownerId: "a", exp: 2000 });
    expect(decodeSession(token, secret, 3000)).toBeNull();
  });
});

describe("owner views", () => {
  it("shows each pet once with its membership", async () => {
    const other = await enrollMember(db, { email: "gazdi@example.hu", fullName: "Teszt Gazdi", phone: null, petName: "Bodri", species: "dog", birthDate: null, microchip: null });
    const pets = await ownerPets(db, ownerId);
    expect(pets.map((p) => p.name)).toEqual(["Bodri", "Morzsi"]);
    expect(pets[0]).toMatchObject({ pet_id: other, membership_id: null, state: null });
    expect(pets[1]).toMatchObject({ membership_id: membershipId, package_name: "Plusz", state: expect.any(String) });
  });

  it("marks an ended membership as expired", async () => {
    await db.query("update memberships set started_on = '2024-01-10', ends_on = '2025-01-10'");
    expect((await ownerPets(db, ownerId))[0].state).toBe("expired");
  });

  it("never shows another owner's membership", async () => {
    const stranger = await member("masik@example.hu", "Cirmi", "cat");
    expect(await ownerMembership(db, ownerId, stranger.id)).toBeNull();
    expect(await ownerMembership(db, ownerId, "nem-azonosito")).toBeNull();
    expect(await ownerMembership(db, ownerId, membershipId)).toMatchObject({ pet_name: "Morzsi", monthly_fee_ft: 6990, last_day: "2027-01-09" });
  });

  it("lists real visits without clinic payments or corrected entries", async () => {
    const input = { membershipId, clinicId, serviceDate: "2026-03-15", actor };
    await redeem(db, { ...input, serviceCode: "EXAM" });
    const wrong = await redeem(db, { ...input, serviceCode: "NAILS" });
    await voidRedemption(db, { redemptionId: wrong.id, reason: "hiba", actor });
    await redeem(db, { ...input, serviceCode: "PARASITE", amountFt: 2500 });
    const visits = await ownerVisits(db, membershipId);
    expect(visits.map((v) => [v.service_name, v.allowance_used_ft]).sort()).toEqual([
      ["Parazitakeret", 2500],
      ["Éves megelőző vizsgálat", 0],
    ]);
    expect(Object.keys(visits[0])).not.toContain("payable_ft");
  });

  it("lists active partners only", async () => {
    await db.query("insert into clinics (name, contract_status) values ('Jelölt', 'prospect')");
    expect((await partnerClinics(db)).map((c) => c.name)).toEqual(["Partner"]);
  });
});
