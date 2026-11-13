"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { formsOpen, site } from "@/config/site";
import { getDb } from "@/lib/db";
import { sendWaitlistConfirmation } from "@/lib/email";
import {
  addClinicInterest,
  addClinicSuggestion,
  addWaitlistSignup,
  claimConfirmationEmail,
  confirmWaitlistSignup,
} from "@/lib/queries";
import { confirmToken, readConfirmToken, readSignupToken, signupToken } from "@/lib/signup-token";
import { clinicSchema, clinicSuggestionSchema, fieldErrors, waitlistSchema } from "@/lib/validation";
import { t } from "@/messages";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (!key.startsWith("$ACTION") && typeof value === "string") values[key] = value;
  }
  return values;
}

// In production the address is fixed, so a forged Host header cannot end up in an email.
async function baseUrl(): Promise<string> {
  if (process.env.NODE_ENV === "production") return `https://${site.domain}`;
  return `http://${(await headers()).get("host")}`;
}

// The button on the page behind the emailed link.
export async function confirmSignup(_: { error?: string; ok?: string }, form: FormData) {
  const id = readConfirmToken(String(form.get("token") ?? ""));
  try {
    if (id && (await confirmWaitlistSignup(await getDb(), id))) return { ok: t.confirm.done };
  } catch (error) {
    console.error("Waitlist confirmation failed", error);
  }
  return { error: t.confirm.failed };
}

export type JoinResult = { ok: true; token: string } | { ok: false; message: string };

// The landing page's signup. The page checks the email first, so a failure here is rare.
export async function joinWaitlist(input: {
  email: string;
  species: string;
  petName: string;
  packageCode: string;
}): Promise<JoinResult> {
  if (!formsOpen()) return { ok: false, message: t.forms.closed };
  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: Object.values(fieldErrors(parsed.error))[0] ?? t.forms.failed };
  try {
    const db = await getDb();
    const { id } = await addWaitlistSignup(db, parsed.data, site.privacyVersion);
    // New signups get the confirmation email, and so does a repeat that has not confirmed yet.
    // Sent after the response, so the answer takes as long either way.
    const pendingId = await claimConfirmationEmail(db, parsed.data.email);
    if (pendingId) {
      const url = `${await baseUrl()}/megerosites?token=${confirmToken(pendingId)}`;
      after(() => sendWaitlistConfirmation(parsed.data.email, url));
    }
    // Same reply for a repeat email, so the form can't reveal who has signed up. A repeat gets a
    // token for an id that matches no signup, so its clinic suggestion is stored on its own.
    return { ok: true, token: signupToken(id ?? randomUUID()) };
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return { ok: false, message: t.forms.failed };
  }
}

// The clinic box at the bottom of the landing page. Linked to the signup when the visitor has just signed up.
export async function suggestClinic(input: { clinicName: string; token: string | null }): Promise<void> {
  if (!formsOpen()) return;
  const parsed = clinicSuggestionSchema.safeParse(input);
  if (!parsed.success) return;
  try {
    await addClinicSuggestion(await getDb(), parsed.data.clinicName, readSignupToken(parsed.data.token));
  } catch (error) {
    console.error("Clinic suggestion failed", error);
  }
}

export async function submitClinicInterest(_: FormState, formData: FormData): Promise<FormState> {
  if (!formsOpen()) return { status: "error", message: t.forms.closed };
  const values = formValues(formData);
  if (values.website) return { status: "success" };

  const parsed = clinicSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), values };
  }
  try {
    const db = await getDb();
    await addClinicInterest(db, parsed.data, site.privacyVersion);
    return { status: "success" };
  } catch (error) {
    console.error("Clinic interest failed", error);
    return { status: "error", message: t.forms.failed, values };
  }
}
