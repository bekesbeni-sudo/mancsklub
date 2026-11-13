import "server-only";
import { site } from "@/config/site";
import { t } from "@/messages";
import { adminPasswordEmailHtml, confirmationEmailHtml } from "./email-template";

async function send(to: string, subject: string, text: string, html?: string): Promise<void> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${site.name} <${site.contactEmail}>`, to, subject, text, html }),
    });
    if (!response.ok) console.error(`Email failed: ${response.status}`);
  } catch (error) {
    console.error("Email failed", error);
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
