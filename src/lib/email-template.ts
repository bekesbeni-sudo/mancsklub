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

export function confirmationEmailHtml(url: string): string {
  const e = t.email;
  const h = escapeHtml;
  const asset = (path: string) => `https://${site.domain}${path}`;
  const link = h(url);
  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${h(e.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${h(e.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td align="center" style="padding:0 0 24px;">
      <a href="${asset("/")}" style="text-decoration:none;"><img src="${asset("/email/logo.png")}" width="180" height="27" alt="${h(site.name)}" style="display:block;border:0;width:180px;height:auto;"></a>
    </td></tr>
    <tr><td style="background:${C.card};border-radius:24px;border:1px solid ${C.line};padding:40px 36px 32px;font-family:${FONT};color:${C.ink};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center" style="padding:0 0 24px;">
          <img src="${asset("/email/pets.png")}" width="233" height="150" alt="${h(e.petsAlt)}" style="display:block;border:0;width:233px;height:auto;">
        </td></tr>
        <tr><td align="center" style="font-family:${FONT};font-size:26px;line-height:1.25;font-weight:800;color:${C.ink};padding:0 0 16px;">${h(e.title)}</td></tr>
        <tr><td style="font-family:${FONT};font-size:16px;line-height:1.6;color:${C.muted};padding:0 0 8px;">${h(e.hello)}</td></tr>
        <tr><td style="font-family:${FONT};font-size:16px;line-height:1.6;color:${C.muted};padding:0 0 28px;">${h(e.lead)}</td></tr>
        <tr><td align="center" style="padding:0 0 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" bgcolor="${C.button}" style="border-radius:999px;">
              <a href="${link}" style="display:inline-block;padding:16px 36px;font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">${h(e.button)} &rarr;</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="font-family:${FONT};font-size:13px;line-height:1.5;color:${C.soft};padding:0 0 4px;">${h(e.fallback)}</td></tr>
        <tr><td style="font-family:${FONT};font-size:13px;line-height:1.5;padding:0 0 24px;word-break:break-all;"><a href="${link}" style="color:${C.tan};">${link}</a></td></tr>
        <tr><td style="border-top:1px solid ${C.line};padding:20px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.muted};">${h(e.ignore)}</td></tr>
        <tr><td style="padding:16px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};">${h(e.bye)}<br><strong>${h(e.team)}</strong></td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding:24px 16px 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${C.soft};">
      ${h(e.follow)} <a href="${h(site.instagram)}" style="color:${C.tan};font-weight:700;text-decoration:none;">${h(e.instagram)}</a> &middot; <a href="${h(site.facebook)}" style="color:${C.tan};font-weight:700;text-decoration:none;">${h(e.facebook)}</a>
    </td></tr>
    <tr><td align="center" style="padding:8px 16px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.soft};">${h(e.reason)}</td></tr>
    <tr><td align="center" style="padding:8px 16px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.soft};">
      <a href="${asset("/")}" style="color:${C.soft};text-decoration:none;">${h(site.domain)}</a> &middot; <a href="mailto:${h(site.contactEmail)}" style="color:${C.soft};text-decoration:none;">${h(site.contactEmail)}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
