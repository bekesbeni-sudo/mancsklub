"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/components/portal";
import { SURVEY_BATCH, claimSurveyBatch, releaseSurveyBatch, signupIdByEmail } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { baseUrl } from "@/lib/base-url";
import { getDb } from "@/lib/db";
import { sendSurveyBatch, sendSurveyEmail } from "@/lib/email";
import { confirmToken } from "@/lib/signup-token";
import { t } from "@/messages";

const m = t.portal.admin.emails;

// Sends the survey letter only to the logged-in admin's own address, never to anyone else.
export async function sendSurveyTest(): Promise<ActionState> {
  const staff = await requireAdmin();
  if (!staff.adminId) return { error: m.needOwnLogin };
  const to = staff.actor;
  const signupId = await signupIdByEmail(await getDb(), to);
  const site = await baseUrl();
  const confirmUrl = `${site}/megerosites?token=${confirmToken(signupId ?? "00000000-0000-0000-0000-000000000000")}`;
  const sent = await sendSurveyEmail(to, `${site}/`, confirmUrl);
  if (!sent) return { error: t.portal.failed };
  return { ok: signupId ? m.testSent(to) : `${m.testSent(to)} ${m.notOnList}` };
}

// Sends the survey letter to the next batch of people who have not had it yet.
export async function sendSurveyToList(_: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  if (form.get("sure") !== "yes") return { error: m.mustTick };
  const db = await getDb();
  const batch = await claimSurveyBatch(db, SURVEY_BATCH, actor);
  if (batch.length === 0) return { error: m.nobodyLeft };
  const site = await baseUrl();
  const items = batch.map((row) => ({ to: row.email, confirmUrl: `${site}/megerosites?token=${confirmToken(row.id)}` }));
  const sent = await sendSurveyBatch(items, `${site}/`);
  if (!sent) {
    await releaseSurveyBatch(db, batch.map((row) => row.id));
    return { error: m.sendFailed };
  }
  revalidatePath("/admin/levelek");
  return { ok: m.sentBatch(batch.length) };
}
