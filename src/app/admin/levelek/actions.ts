"use server";

import type { ActionState } from "@/components/portal";
import { signupIdByEmail } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { baseUrl } from "@/lib/base-url";
import { getDb } from "@/lib/db";
import { sendSurveyEmail } from "@/lib/email";
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
