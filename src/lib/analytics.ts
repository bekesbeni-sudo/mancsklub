// Vercel Web Analytics (no cookies). Private areas are not counted, so our own clicks do not
// skew the numbers, and the query string is dropped, because some links carry one-time tokens.
const privatePrefixes = ["/admin", "/rendelo", "/belepes", "/gazdi", "/elszamolas"];

export function publicPageUrl(url: string): string | null {
  const parsed = new URL(url);
  const isPrivate = privatePrefixes.some((p) => parsed.pathname === p || parsed.pathname.startsWith(`${p}/`));
  if (isPrivate) return null;
  return `${parsed.origin}${parsed.pathname}`;
}
