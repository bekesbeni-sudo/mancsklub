// The brand name lives here so a rename stays cheap (the trademark opinion is pending).
export const site = {
  name: "mancsklub",
  logo: "/landing/logo.webp",
  wordmark: ["mancs", "klub"],
  domain: "mancsklub.hu",
  contactEmail: "info@mancsklub.hu",
  instagram: "https://www.instagram.com/mancsklub/",
  // Who collects the data. Must be filled in before the forms can open in production.
  controller: null as null | { name: string; address: string; registrationNumber: string },
  privacyVersion: "2026-11-06-draft",
};

export function areFormsOpen(
  flag: string | undefined,
  nodeEnv: string | undefined,
  controller: unknown,
): boolean {
  if (flag !== "true") return false;
  return nodeEnv !== "production" || controller !== null;
}

export function formsOpen(): boolean {
  return areFormsOpen(process.env.FORMS_OPEN, process.env.NODE_ENV, site.controller);
}
