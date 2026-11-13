import { z } from "zod";
import { t } from "@/messages";

const e = t.errors;
const required = (max: number) => z.string().trim().min(1, e.required).max(max, e.tooLong);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, e.tooLong)
    .transform((value) => value || null);
const email = z.string().trim().toLowerCase().max(254, e.tooLong).pipe(z.email(e.email));
const accepted = z.literal("on", { error: e.privacy });

// Packages offered on the landing page. Kölyök and Senior are not in the catalogue yet.
export const landingPlanCodes = Object.keys(t.landing.plans) as [keyof typeof t.landing.plans, ...(keyof typeof t.landing.plans)[]];

export const waitlistSchema = z.object({
  email,
  species: z.enum(["dog", "cat", "both", ""], { error: e.required }).transform((value) => value || null),
  petName: optional(20),
  packageCode: z
    .enum([...landingPlanCodes, ""], { error: e.required })
    .optional()
    .transform((value) => value || null),
});

export const clinicSuggestionSchema = z.object({
  clinicName: required(80),
  token: z.string().max(400).nullable(),
});

export const partnerTypes = ["clinic", "food", "grooming", "hotel", "shop", "brand", "other"] as const;
export type PartnerType = (typeof partnerTypes)[number];

export const clinicSchema = z.object({
  partnerType: z.enum(partnerTypes, { error: e.required }).default("clinic"),
  clinicName: required(160),
  contactName: required(120),
  email,
  phone: optional(40),
  location: required(120),
  message: optional(2000),
  privacy: accepted,
});

export type WaitlistInput = z.output<typeof waitlistSchema>;
export type ClinicInput = z.output<typeof clinicSchema>;

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    errors[key] ??= issue.message;
  }
  return errors;
}
