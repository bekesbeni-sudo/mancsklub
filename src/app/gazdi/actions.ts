"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import type { ActionState } from "@/components/portal";
import { site } from "@/config/site";
import { endSession, startSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sendLoginLink } from "@/lib/email";
import { consumeLoginToken, createLoginToken } from "@/lib/owner";
import { t } from "@/messages";

// In production the address is fixed, so a forged Host header cannot end up in a login email.
async function baseUrl(): Promise<string> {
  if (process.env.NODE_ENV === "production") return `https://${site.domain}`;
  return `http://${(await headers()).get("host")}`;
}

export async function requestLoginLink(_: ActionState, form: FormData): Promise<ActionState> {
  const l = t.portal.owner.login;
  const email = z.email().safeParse(String(form.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return { error: l.invalid };
  const token = await createLoginToken(await getDb(), email.data);
  if (token) {
    const url = `${await baseUrl()}/gazdi/belepes/link?token=${token}`;
    // Sent after the response, so the answer takes as long for known and unknown addresses.
    after(() => sendLoginLink(email.data, url));
  }
  return { ok: l.sent };
}

export async function confirmLogin(_: ActionState, form: FormData): Promise<ActionState> {
  const ownerId = await consumeLoginToken(await getDb(), String(form.get("token") ?? ""));
  if (!ownerId) return { error: t.portal.owner.confirm.failed };
  await startSession({ role: "owner", ownerId });
  redirect("/gazdi");
}

export async function ownerLogout() {
  await endSession();
  redirect("/gazdi/belepes");
}
