"use server";

import { randomUUID } from "node:crypto";
import { formsOpen, site } from "@/config/site";
import { getDb } from "@/lib/db";
import { sendWaitlistConfirmation } from "@/lib/email";
import { addClinicInterest, addClinicSuggestion, addWaitlistSignup } from "@/lib/queries";
import { readSignupToken, signupToken } from "@/lib/signup-token";
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
    const { created, id } = await addWaitlistSignup(db, parsed.data, site.privacyVersion);
    if (created) await sendWaitlistConfirmation(parsed.data.email);
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
