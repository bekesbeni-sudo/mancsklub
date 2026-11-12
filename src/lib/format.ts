const NBSP = " ";

export function formatFt(amount: number): string {
  const digits = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${digits}${NBSP}Ft`;
}

export function formatDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}.${get("month")}.${get("day")}`;
}

// "2026-11-06" from the database to "2026.11.06".
export function formatDateText(date: string): string {
  return date.slice(0, 10).replaceAll("-", ".");
}
