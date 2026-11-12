import "server-only";
import { site } from "@/config/site";
import { t } from "@/messages";

async function send(to: string, subject: string, text: string): Promise<void> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${site.name} <${site.contactEmail}>`, to, subject, text }),
    });
    if (!response.ok) console.error(`Email failed: ${response.status}`);
  } catch (error) {
    console.error("Email failed", error);
  }
}

// A failed email must never lose a signup, so this logs instead of throwing.
export async function sendWaitlistConfirmation(to: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.info("RESEND_API_KEY is not set, skipping confirmation email");
    return;
  }
  await send(to, t.email.subject, t.email.body);
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
