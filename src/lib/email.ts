import "server-only";
import { site } from "@/config/site";
import { t } from "@/messages";

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

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

// A failed email must never lose a signup, so this logs instead of throwing.
export async function sendWaitlistConfirmation(to: string, url: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // Local development has no email, so the link goes to the server log. Never in production.
    if (process.env.NODE_ENV === "production") console.error("RESEND_API_KEY is not set, confirmation not sent");
    else console.info(`Waitlist confirmation link: ${url}`);
    return;
  }
  const e = t.email;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#1f1b16">
<p>${escapeHtml(e.hello)}</p>
<p>${escapeHtml(e.lead)}</p>
<p style="margin:28px 0"><a href="${escapeHtml(url)}" style="background:#1f1b16;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:999px;font-weight:bold;display:inline-block">${escapeHtml(e.button)}</a></p>
<p style="font-size:14px;color:#6b6259">${escapeHtml(e.ignore)}</p>
<p>${escapeHtml(e.bye)}<br>${escapeHtml(site.name)}</p>
</div>`;
  await send(to, e.subject, e.body(url), html);
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
