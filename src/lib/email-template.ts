import { site } from "@/config/site";
import { t } from "@/messages";

// Email clients ignore stylesheets and many CSS features, so this is the classic table layout with
// inline styles. Images come from the live site as PNG, because Outlook and older Gmail cannot show WebP.
const C = {
  page: "#f3ebe2",
  card: "#ffffff",
  ink: "#2e1f16",
  muted: "#6b5747",
  soft: "#8a7563",
  tan: "#a68563",
  line: "#e6d9cb",
  button: "#2e1f16",
};
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

type EmailContent = {
  subject: string;
  preheader: string;
  title: string;
  paragraphs: string[];
  button: string;
  url: string;
  note: string;
  reason: string;
  pets?: boolean;
};

const asset = (path: string) => `https://${site.domain}${path}`;
const text = `font-family:${FONT};font-size:16px;line-height:1.6;color:${C.muted};`;

const petsRow = () =>
  `<tr><td align="center" style="padding:0 0 24px;">
          <img src="${asset("/email/pets.png")}" width="233" height="150" alt="${escapeHtml(t.email.petsAlt)}" style="display:block;border:0;width:233px;height:auto;">
        </td></tr>`;

const titleRow = (title: string) =>
  `<tr><td align="center" style="font-family:${FONT};font-size:26px;line-height:1.25;font-weight:800;color:${C.ink};padding:0 0 16px;">${escapeHtml(title)}</td></tr>`;

const paragraphRows = (paragraphs: string[], lastGap = 28) =>
  paragraphs
    .map((p, i) => `<tr><td style="${text}padding:0 0 ${i === paragraphs.length - 1 ? lastGap : 12}px;">${escapeHtml(p)}</td></tr>`)
    .join("\n        ");

// A filled pill for the main action, or an outlined one for a secondary link.
const buttonRow = (label: string, url: string, kind: "primary" | "secondary" = "primary", gap = 28) => {
  const primary = kind === "primary";
  const cell = primary ? `bgcolor="${C.button}" style="border-radius:999px;"` : `style="border-radius:999px;border:2px solid ${C.ink};"`;
  const pad = primary ? "16px 36px" : "12px 28px";
  const color = primary ? "#ffffff" : C.ink;
  return `<tr><td align="center" style="padding:0 0 ${gap}px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" ${cell}>
              <a href="${escapeHtml(url)}" style="display:inline-block;padding:${pad};font-family:${FONT};font-size:16px;font-weight:700;color:${color};text-decoration:none;border-radius:999px;">${escapeHtml(label)} &rarr;</a>
            </td>
          </tr></table>
        </td></tr>`;
};

const fallbackRows = (url: string) => {
  const link = escapeHtml(url);
  return `<tr><td style="font-family:${FONT};font-size:13px;line-height:1.5;color:${C.soft};padding:0 0 4px;">${escapeHtml(t.email.fallback)}</td></tr>
        <tr><td style="font-family:${FONT};font-size:13px;line-height:1.5;padding:0 0 24px;word-break:break-all;"><a href="${link}" style="color:${C.tan};">${link}</a></td></tr>`;
};

const signoffRow = (bye: string, team: string) =>
  `<tr><td style="padding:16px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};">${escapeHtml(bye)}<br><strong>${escapeHtml(team)}</strong></td></tr>`;

// The frame around every email we send: logo, white card, social links and a footer.
function emailShell(o: { subject: string; preheader: string; reason: string; rows: string }): string {
  const e = t.email;
  const h = escapeHtml;
  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${h(o.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${h(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td align="center" style="padding:0 0 24px;">
      <a href="${asset("/")}" style="text-decoration:none;"><img src="${asset("/email/logo.png")}" width="180" height="27" alt="${h(site.name)}" style="display:block;border:0;width:180px;height:auto;"></a>
    </td></tr>
    <tr><td style="background:${C.card};border-radius:24px;border:1px solid ${C.line};padding:40px 36px 32px;font-family:${FONT};color:${C.ink};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${o.rows}
      </table>
    </td></tr>
    <tr><td align="center" style="padding:24px 16px 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${C.soft};">
      ${h(e.follow)} <a href="${h(site.instagram)}" style="color:${C.tan};font-weight:700;text-decoration:none;">${h(e.instagram)}</a> &middot; <a href="${h(site.facebook)}" style="color:${C.tan};font-weight:700;text-decoration:none;">${h(e.facebook)}</a>
    </td></tr>
    <tr><td align="center" style="padding:8px 16px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.soft};">${h(o.reason)}</td></tr>
    <tr><td align="center" style="padding:8px 16px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.soft};">
      <a href="${asset("/")}" style="color:${C.soft};text-decoration:none;">${h(site.domain)}</a> &middot; <a href="mailto:${h(site.contactEmail)}" style="color:${C.soft};text-decoration:none;">${h(site.contactEmail)}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

// The usual one-button email: confirmation, admin invitation, password reset.
export function brandedEmailHtml(c: EmailContent): string {
  const rows = [
    c.pets ? petsRow() : "",
    titleRow(c.title),
    paragraphRows(c.paragraphs),
    buttonRow(c.button, c.url),
    fallbackRows(c.url),
    `<tr><td style="border-top:1px solid ${C.line};padding:20px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.muted};">${escapeHtml(c.note)}</td></tr>`,
    signoffRow(t.email.bye, t.email.team),
  ].join("\n        ");
  return emailShell({ subject: c.subject, preheader: c.preheader, reason: c.reason, rows });
}

// The first letter to the people imported from the Google Forms survey: what came out of their
// answers, the new site, and a button to confirm the address for the weekly updates.
export function surveyEmailHtml(confirmUrl: string): string {
  const s = t.surveyEmail;
  const h = escapeHtml;
  const findings = s.findings
    .map(
      (f, i) => `<tr>
              <td valign="top" width="36" style="padding:0 0 ${i === s.findings.length - 1 ? 0 : 12}px;">
                <div style="width:26px;height:26px;border-radius:13px;background:${C.tan};color:#ffffff;font-family:${FONT};font-size:14px;font-weight:800;line-height:26px;text-align:center;">${i + 1}</div>
              </td>
              <td valign="top" style="font-family:${FONT};font-size:15px;line-height:1.55;color:${C.ink};padding:2px 0 ${i === s.findings.length - 1 ? 0 : 12}px;">${h(f)}</td>
            </tr>`,
    )
    .join("\n            ");
  const rows = [
    petsRow(),
    titleRow(s.title),
    paragraphRows([s.hello, ...s.intro], 20),
    `<tr><td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7efe6;border-radius:18px;">
            <tr><td style="padding:22px 22px 20px;">
              <div style="font-family:${FONT};font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${C.tan};padding:0 0 14px;">${h(s.findingsTitle)}</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${findings}
              </table>
            </td></tr>
          </table>
        </td></tr>`,
    paragraphRows(s.launch, 20),
    buttonRow(s.siteButton, asset("/"), "secondary", 28),
    paragraphRows([s.clinics], 28),
    `<tr><td style="border-top:1px solid ${C.line};padding:28px 0 0;"></td></tr>`,
    paragraphRows(s.confirm, 24),
    buttonRow(s.confirmButton, confirmUrl, "primary", 16),
    `<tr><td align="center" style="font-family:${FONT};font-size:14px;line-height:1.5;color:${C.soft};padding:0 0 28px;">${h(s.noConfirm)}</td></tr>`,
    fallbackRows(confirmUrl),
    signoffRow(s.bye, s.team),
  ].join("\n        ");
  return emailShell({ subject: s.subject, preheader: s.preheader, reason: s.reason, rows });
}

export function confirmationEmailHtml(url: string): string {
  const e = t.email;
  return brandedEmailHtml({
    subject: e.subject,
    preheader: e.preheader,
    title: e.title,
    paragraphs: [e.hello, e.lead],
    button: e.button,
    url,
    note: e.ignore,
    reason: e.reason,
    pets: true,
  });
}

export function adminPasswordEmailHtml(url: string, kind: "invite" | "reset"): string {
  const a = t.portal.password.email[kind];
  return brandedEmailHtml({
    subject: a.subject,
    preheader: a.preheader,
    title: a.title,
    paragraphs: [t.email.hello, a.lead],
    button: a.button,
    url,
    note: a.note,
    reason: t.portal.password.email.reason,
  });
}
