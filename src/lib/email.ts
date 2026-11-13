import "server-only";
import { site } from "@/config/site";
import { t } from "@/messages";
import { adminPasswordEmailHtml, confirmationEmailHtml, surveyEmailHtml } from "./email-template";

async function send(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${site.name} <${site.contactEmail}>`, to, subject, text, html }),
    });
    if (!response.ok) console.error(`Email failed: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error("Email failed", error);
    return false;
  }
}

// A failed email must never lose a signup, so this logs instead of throwing.
export async function sendWaitlistConfirmation(to: string, url: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // Local development has no email, so the link goes to the server log. Never in production.
    if (process.env.NODE_ENV === "production") console.error("RESEND_API_KEY is not set, confirmation not sent");
    else console.info(`Waitlist confirmation link: ${url}`);
    return;
  }
  const e = t.email;
  await send(to, e.subject, e.body(url), confirmationEmailHtml(url));
}

export async function sendLoginLink(to: string, url: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // Local development has no email, so the link goes to the server log. Never in production.
    if (process.env.NODE_ENV === "production") console.error("RESEND_API_KEY is not set, login link not sent");
    else console.info(`Owner login link: ${url}`);
    return;
  }
  const e = t.portal.owner.email;
  await send(to, e.subject, e.body(url));
}

// The link an admin uses to set a password: an invitation from the team page, or a reset.
export async function sendAdminPasswordLink(to: string, url: string, kind: "invite" | "reset"): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") console.error("RESEND_API_KEY is not set, password link not sent");
    else console.info(`Admin password link (${kind}): ${url}`);
    return;
  }
  const a = t.portal.password.email[kind];
  await send(to, a.subject, a.body(url), adminPasswordEmailHtml(url, kind));
}

// The first letter to the people imported from the survey. Returns whether it went out.
export async function sendSurveyEmail(to: string, siteUrl: string, confirmUrl: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") console.error("RESEND_API_KEY is not set, survey email not sent");
    else console.info(`Survey email to ${to}, confirmation link: ${confirmUrl}`);
    return process.env.NODE_ENV !== "production";
  }
  const s = t.surveyEmail;
  return send(to, s.subject, s.body(siteUrl, confirmUrl), surveyEmailHtml(confirmUrl));
}
