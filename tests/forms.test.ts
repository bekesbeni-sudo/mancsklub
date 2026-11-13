import { beforeEach, describe, expect, it } from "vitest";
import { areFormsOpen } from "@/config/site";
import { toCsv } from "@/lib/csv";
import { formatDate, formatFt } from "@/lib/format";
import { openLocalDb } from "@/lib/local-db";
import { listSuggestions, rankSuggestions, requestedClinics } from "@/lib/portal-queries";
import {
  addClinicInterest,
  addClinicSuggestion,
  addWaitlistSignup,
  claimConfirmationEmail,
  confirmWaitlistSignup,
  getPackages,
  listClinicInterest,
  listWaitlist,
  type Db,
} from "@/lib/queries";
import { clinicSchema, waitlistSchema } from "@/lib/validation";

const valid = {
  email: "  Gazdi@Example.HU ",
  species: "both",
  petName: "Bodza",
  packageCode: "PLUSZ",
};

describe("formatting", () => {
  it("writes forints with a space and no decimals", () => {
    expect(formatFt(3990)).toBe("3 990 Ft");
    expect(formatFt(14990)).toBe("14 990 Ft");
    expect(formatFt(1234567)).toBe("1 234 567 Ft");
    expect(formatFt(500)).toBe("500 Ft");
  });

  it("writes dates as YYYY.MM.DD in Budapest time", () => {
    expect(formatDate(new Date("2026-12-31T23:30:00Z"))).toBe("2027.01.01");
  });
});

describe("csv", () => {
  it("quotes separators and neutralises formulas", () => {
    const csv = toCsv(["a", "b"], [['x;"y"', "=SUM(A1)"], [null, 1]]);
    expect(csv).toBe('﻿a;b\r\n"x;""y""";\'=SUM(A1)\r\n;1\r\n');
  });
});

describe("forms switch", () => {
  it("stays closed in production until a controller is named", () => {
    expect(areFormsOpen(undefined, "development", null)).toBe(false);
    expect(areFormsOpen("true", "development", null)).toBe(true);
    expect(areFormsOpen("true", "production", null)).toBe(false);
    expect(areFormsOpen("true", "production", { name: "x" })).toBe(true);
    expect(areFormsOpen("false", "production", { name: "x" })).toBe(false);
  });
});

describe("validation", () => {
  it("cleans a valid signup", () => {
    const data = waitlistSchema.parse(valid);
    expect(data.email).toBe("gazdi@example.hu");
    expect(data.species).toBe("both");
    expect(data.petName).toBe("Bodza");
  });

  it("needs only an email", () => {
    expect(waitlistSchema.parse({ email: "gazdi@example.hu", species: "", petName: "", packageCode: "" })).toEqual({
      email: "gazdi@example.hu",
      species: null,
      petName: null,
      packageCode: null,
    });
  });

  it("rejects bad input", () => {
    expect(waitlistSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(waitlistSchema.safeParse({ ...valid, species: "hal" }).success).toBe(false);
    expect(waitlistSchema.safeParse({ ...valid, petName: "x".repeat(21) }).success).toBe(false);
  });
});

describe("database", () => {
  let db: Db;
  beforeEach(async () => {
    db = await openLocalDb();
  });

  it("serves the catalogue from the brief", async () => {
    const packages = await getPackages(db);
    expect(packages.map((p) => [p.code, p.monthlyFeeFt])).toEqual([
      ["ALAP", 3490],
      ["PLUSZ", 6990],
      ["PREMIUM", 9990],
      ["PREMIUM_MAX", 14990],
    ]);
    const codes = (code: string) => packages.find((p) => p.code === code)!.items.map((i) => i.code);
    expect(codes("ALAP")).toHaveLength(6);
    expect(codes("PLUSZ")).toContain("BLOOD_BASIC");
    expect(codes("PREMIUM")).toContain("BLOOD_EXTENDED");
    expect(codes("PREMIUM")).not.toContain("BLOOD_BASIC");
    const max = packages.find((p) => p.code === "PREMIUM_MAX")!;
    expect(max.status).toBe("proposal");
    expect(max.items.find((i) => i.code === "EXAM")!.quantity).toBe(2);
    expect(max.items.find((i) => i.code === "SICK_VISIT")!.quantity).toBe(3);
    expect(max.items.find((i) => i.code === "DENTAL")!.allowanceFt).toBe(30000);
    expect(codes("PREMIUM_MAX")).not.toContain("XRAY");
  });

  it("stores a signup with the privacy version and no marketing consent", async () => {
    expect(await addWaitlistSignup(db, waitlistSchema.parse(valid), "v1")).toMatchObject({ created: true });
    const [row] = await db.query<{ pet_name: string; marketing_consent: boolean; privacy_version: string }>(
      "select pet_name, marketing_consent, privacy_version from waitlist_signups",
    );
    expect(row).toEqual({ pet_name: "Bodza", marketing_consent: false, privacy_version: "v1" });
  });

  it("ignores a repeat email and keeps the original answers", async () => {
    await addWaitlistSignup(db, waitlistSchema.parse(valid), "v1");
    const again = waitlistSchema.parse({ ...valid, petName: "Más" });
    expect(await addWaitlistSignup(db, again, "v1")).toEqual({ created: false, id: null });
    const rows = await listWaitlist(db);
    expect(rows).toHaveLength(1);
    expect(rows[0].pet_name).toBe("Bodza");
  });

  it("sends one confirmation email an hour until the address is confirmed", async () => {
    const input = waitlistSchema.parse(valid);
    const { id } = await addWaitlistSignup(db, input, "v1");
    expect(await claimConfirmationEmail(db, input.email)).toBe(id);
    expect(await claimConfirmationEmail(db, input.email)).toBeNull();
    await db.query("update waitlist_signups set confirmation_sent_at = now() - interval '2 hours'");
    expect(await claimConfirmationEmail(db, input.email)).toBe(id);
    expect(await claimConfirmationEmail(db, "ismeretlen@example.hu")).toBeNull();

    expect(await confirmWaitlistSignup(db, id as string)).toBe(true);
    const [first] = await listWaitlist(db);
    expect(first.confirmed_at).not.toBeNull();
    // A second press keeps the first date, and a confirmed address gets no more emails.
    expect(await confirmWaitlistSignup(db, id as string)).toBe(true);
    expect((await listWaitlist(db))[0].confirmed_at).toEqual(first.confirmed_at);
    await db.query("update waitlist_signups set confirmation_sent_at = now() - interval '2 hours'");
    expect(await claimConfirmationEmail(db, input.email)).toBeNull();
    expect(await confirmWaitlistSignup(db, "nem-azonosito")).toBe(false);
  });

  it("accepts the six landing packages and nothing else", async () => {
    expect(waitlistSchema.safeParse({ ...valid, packageCode: "FAKE" }).success).toBe(false);
    const input = waitlistSchema.parse({ ...valid, email: "kolyok@example.hu", packageCode: "KOLYOK" });
    expect(await addWaitlistSignup(db, input, "v1")).toMatchObject({ created: true });
    await expect(db.query("update waitlist_signups set package_code = 'kicsi'")).rejects.toThrow();
  });

  it("stores clinic suggestions, linked to a signup when one is given", async () => {
    const { id } = await addWaitlistSignup(db, waitlistSchema.parse(valid), "v1");
    await addClinicSuggestion(db, "Példa Rendelő", id);
    await addClinicSuggestion(db, "példa rendelő ", null);
    await addClinicSuggestion(db, "Másik", "nem-azonosito");
    const rows = await db.query<{ signup_id: string | null }>("select signup_id from clinic_suggestions order by created_at");
    expect(rows.map((row) => row.signup_id)).toEqual([id, null, null]);
    expect(await requestedClinics(db)).toEqual([
      { clinic: "Példa Rendelő", requests: 2 },
      { clinic: "Másik", requests: 1 },
    ]);
    const all = await listSuggestions(db);
    expect(all).toHaveLength(3);
    expect(all.filter((row) => row.email === "gazdi@example.hu")).toHaveLength(1);
    expect((await rankSuggestions(db, "példa")).map((row) => [row.clinic, row.requests])).toEqual([["Példa Rendelő", 2]]);
    expect(await listSuggestions(db, "%")).toHaveLength(0);
  });

  it("stores clinic interest", async () => {
    const input = clinicSchema.parse({
      clinicName: "Példa Rendelő",
      contactName: "Dr. Példa",
      email: "rendelo@example.hu",
      phone: "",
      location: "Budapest",
      message: "",
      privacy: "on",
    });
    await addClinicInterest(db, input, "v1");
    const rows = await listClinicInterest(db);
    expect(rows).toHaveLength(1);
    expect(rows[0].phone).toBeNull();
  });

  it("keeps private tables closed to the public API roles", async () => {
    const rows = await db.query<{ table_name: string; anon: boolean; authed: boolean }>(`
      select t as table_name,
             has_table_privilege('anon', t, 'select') as anon,
             has_table_privilege('authenticated', t, 'select') as authed
      from unnest(array['waitlist_signups', 'clinic_interest']) as t`);
    for (const row of rows) {
      expect(row.anon).toBe(false);
      expect(row.authed).toBe(false);
    }
  });
});
