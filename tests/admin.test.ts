import { beforeEach, describe, expect, it } from "vitest";
import {
  addPet,
  clinicFromInterest,
  getOwnerRow,
  getSignup,
  listInterest,
  listOwners,
  listSignups,
  markSignupConverted,
  ownerPetsAdmin,
  petBelongsTo,
  updateOwner,
  updatePet,
} from "@/lib/admin-queries";
import { createMembership } from "@/lib/ledger";
import { openLocalDb } from "@/lib/local-db";
import { overview, enrollMember } from "@/lib/portal-queries";
import { addClinicInterest, addWaitlistSignup, type Db } from "@/lib/queries";
import { clinicSchema, waitlistSchema } from "@/lib/validation";

const actor = "admin";
const pet = { name: "Bodri", sex: null, birthDate: null, breed: null, microchip: null };
let db: Db;
let ownerId: string;

const signup = (email: string) =>
  addWaitlistSignup(db, waitlistSchema.parse({ email, species: "cat", petName: "Bodza", packageCode: "PLUSZ" }), "v1");

beforeEach(async () => {
  db = await openLocalDb();
  await enrollMember(db, { email: "gazdi@example.hu", fullName: "Teszt Gazdi", phone: null, petName: "Morzsi", species: "dog", birthDate: null, microchip: null });
  [{ id: ownerId }] = await db.query<{ id: string }>("select id from owners");
});

describe("waitlist", () => {
  it("lists signups with their package, and finds them", async () => {
    await signup("egy@example.hu");
    await signup("ketto@example.hu");
    expect(await listSignups(db, "")).toHaveLength(2);
    const [row] = await listSignups(db, "ketto");
    expect(row).toMatchObject({ email: "ketto@example.hu", pet_name: "Bodza", package_name: "Plusz" });
    expect(await listSignups(db, "%")).toHaveLength(0);
  });

  it("links a signup to the membership it became, once", async () => {
    await signup("egy@example.hu");
    const [row] = await listSignups(db, "");
    const [{ id: petId }] = await db.query<{ id: string }>("select id from pets");
    const first = await createMembership(db, { petId, packageCode: "ALAP", startedOn: "2026-01-10", actor });
    await markSignupConverted(db, row.id, first.id);
    expect((await getSignup(db, row.id))?.converted_membership_id).toBe(first.id);
    await db.query("update memberships set status = 'cancelled', cancelled_on = '2026-02-01'");
    const second = await createMembership(db, { petId, packageCode: "ALAP", startedOn: "2026-03-10", actor });
    await markSignupConverted(db, row.id, second.id);
    expect((await getSignup(db, row.id))?.converted_membership_id).toBe(first.id);
    expect((await overview(db)).waitlist).toBe(0);
  });

  it("finds nothing for a made-up id", async () => {
    expect(await getSignup(db, "nem-azonosito")).toBeNull();
  });
});

describe("clinic enquiries", () => {
  const enquiry = () =>
    addClinicInterest(
      db,
      clinicSchema.parse({ clinicName: "Példa Rendelő", contactName: "Dr. Példa", email: "rendelo@example.hu", phone: "", location: "Szeged", message: "Érdekel", privacy: "on" }),
      "v1",
    );

  it("turns an enquiry into a prospect clinic, and a second click changes nothing", async () => {
    await enquiry();
    const [row] = await listInterest(db);
    const id = await clinicFromInterest(db, row.id, actor);
    expect(await clinicFromInterest(db, row.id, actor)).toBe(id);
    const clinics = await db.query("select name, contract_status, town, contact_email, notes from clinics");
    expect(clinics).toEqual([{ name: "Példa Rendelő", contract_status: "prospect", town: "Szeged", contact_email: "rendelo@example.hu", notes: "Érdekel" }]);
    expect((await overview(db)).interest).toBe(0);
  });

  it("does not turn a brand partner into a clinic", async () => {
    await enquiry();
    await db.query("update clinic_interest set partner_type = 'food'");
    const [row] = await listInterest(db);
    expect(await clinicFromInterest(db, row.id, actor)).toBeNull();
    expect(await db.query("select id from clinics")).toHaveLength(0);
  });

  it("returns nothing for an unknown enquiry", async () => {
    expect(await clinicFromInterest(db, "nem-azonosito", actor)).toBeNull();
  });
});

describe("owners and pets", () => {
  it("counts pets and active memberships", async () => {
    const petId = await addPet(db, { ...pet, ownerId, species: "cat", actor });
    await createMembership(db, { petId, packageCode: "ALAP", startedOn: "2026-01-10", actor });
    expect(await listOwners(db, "teszt")).toMatchObject([{ pets: 2, active: 1 }]);
    const pets = await ownerPetsAdmin(db, ownerId);
    expect(pets.map((p) => [p.name, p.package_name])).toEqual([["Morzsi", null], ["Bodri", "Alap"]]);
  });

  it("updates an owner, lowercases the email, and logs it", async () => {
    await updateOwner(db, { id: ownerId, fullName: "Új Név", email: "UJ@example.hu", phone: "+36", actor });
    expect(await getOwnerRow(db, ownerId)).toMatchObject({ full_name: "Új Név", email: "uj@example.hu", phone: "+36" });
    expect(await db.query("select action from audit_log where action = 'owner.update'")).toHaveLength(1);
  });

  it("refuses an email or chip that is already taken", async () => {
    await enrollMember(db, { email: "masik@example.hu", fullName: "Másik", phone: null, petName: "Cirmi", species: "cat", birthDate: null, microchip: "123" });
    await expect(updateOwner(db, { id: ownerId, fullName: "X", email: "masik@example.hu", phone: null, actor })).rejects.toMatchObject({ code: "23505" });
    await expect(addPet(db, { ...pet, microchip: "123", ownerId, species: "dog", actor })).rejects.toMatchObject({ code: "23505" });
  });

  it("does not touch a pet through another owner", async () => {
    const [{ id: petId }] = await db.query<{ id: string }>("select id from pets");
    await enrollMember(db, { email: "masik@example.hu", fullName: "Másik", phone: null, petName: "Cirmi", species: "cat", birthDate: null, microchip: null });
    const [{ id: other }] = await db.query<{ id: string }>("select id from owners where email = 'masik@example.hu'");
    expect(await updatePet(db, { ...pet, id: petId, ownerId: other, actor })).toBe(false);
    expect(await petBelongsTo(db, petId, other)).toBe(false);
    expect(await updatePet(db, { ...pet, breed: "Puli", id: petId, ownerId, actor })).toBe(true);
    expect((await ownerPetsAdmin(db, ownerId))[0].breed).toBe("Puli");
  });
});
