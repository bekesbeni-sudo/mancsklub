import { beforeEach, describe, expect, it } from "vitest";
import { claimSurveyBatch, releaseSurveyBatch, surveyAudience } from "@/lib/admin-queries";
import { openLocalDb } from "@/lib/local-db";
import { confirmWaitlistSignup, type Db } from "@/lib/queries";

let db: Db;

async function addFromForm(email: string) {
  await db.query("insert into waitlist_signups (email, privacy_version, source) values ($1, 'google-form-2026-10', 'form')", [email]);
}

const consent = async (email: string) =>
  (await db.query<{ marketing_consent: boolean; confirmed: boolean }>(
    "select marketing_consent, confirmed_at is not null as confirmed from waitlist_signups where email = $1",
    [email],
  ))[0];

describe("survey letter batches", () => {
  beforeEach(async () => {
    db = await openLocalDb();
    for (let i = 0; i < 5; i++) await addFromForm(`form${i}@example.com`);
    await db.query("insert into waitlist_signups (email, privacy_version) values ('site@example.com', 'v1')");
  });

  it("sends each survey address once, in batches, and never to site signups", async () => {
    const first = await claimSurveyBatch(db, 3, "admin");
    const second = await claimSurveyBatch(db, 3, "admin");
    const third = await claimSurveyBatch(db, 3, "admin");
    expect(first).toHaveLength(3);
    expect(second).toHaveLength(2);
    expect(third).toHaveLength(0);
    const all = [...first, ...second].map((r) => r.email);
    expect(new Set(all).size).toBe(5);
    expect(all).not.toContain("site@example.com");
    expect(await surveyAudience(db)).toEqual({ total: 5, sent: 5, left: 0 });
  });

  it("puts a failed batch back so it can be sent again", async () => {
    const batch = await claimSurveyBatch(db, 2, "admin");
    await releaseSurveyBatch(db, batch.map((r) => r.id));
    expect(await surveyAudience(db)).toEqual({ total: 5, sent: 0, left: 5 });
  });

  it("skips people who confirmed already", async () => {
    const [row] = await db.query<{ id: string }>("select id from waitlist_signups where email = 'form0@example.com'");
    await confirmWaitlistSignup(db, row.id);
    const batch = await claimSurveyBatch(db, 10, "admin");
    expect(batch.map((r) => r.email)).not.toContain("form0@example.com");
    expect(batch).toHaveLength(4);
  });

  it("records marketing consent only when the confirming person got the survey letter", async () => {
    const [batch] = await claimSurveyBatch(db, 1, "admin");
    await confirmWaitlistSignup(db, batch.id);
    expect(await consent(batch.email)).toEqual({ marketing_consent: true, confirmed: true });

    const [site] = await db.query<{ id: string }>("select id from waitlist_signups where email = 'site@example.com'");
    await confirmWaitlistSignup(db, site.id);
    expect(await consent("site@example.com")).toEqual({ marketing_consent: false, confirmed: true });
  });
});
