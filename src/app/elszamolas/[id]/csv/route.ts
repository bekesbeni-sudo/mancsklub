import { getStaff } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { getDb } from "@/lib/db";
import { formatDateText } from "@/lib/format";
import { settlementClinic, settlementLines } from "@/lib/portal-queries";

export async function GET(_: Request, ctx: RouteContext<"/elszamolas/[id]/csv">) {
  const staff = await getStaff();
  if (!staff) return new Response("Unauthorized", { status: 401 });

  const { id } = await ctx.params;
  const db = await getDb();
  const settlement = await settlementClinic(db, id).catch(() => null);
  // A clinic can only download its own statement.
  if (!settlement || (staff.role === "clinic" && settlement.clinic_id !== staff.clinicId)) {
    return new Response("Not found", { status: 404 });
  }

  const lines = await settlementLines(db, id);
  const csv = toCsv(
    ["date", "member", "pet", "service", "quantity", "amount_ft"],
    lines.map((l) => [formatDateText(l.service_date), l.member_code, l.pet_name, l.service_name, l.quantity, l.payable_ft]),
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elszamolas-${settlement.period}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
