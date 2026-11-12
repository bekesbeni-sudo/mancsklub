import { connection } from "next/server";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatFt } from "@/lib/format";
import { periodOverview } from "@/lib/portal-queries";
import { t } from "@/messages";
import { lockPeriod, markPaid } from "../actions";

function lastMonth(): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Budapest", year: "numeric", month: "2-digit" })
    .format(new Date())
    .split("-")
    .map(Number);
  const [year, month] = parts;
  return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
}

export const instant = false;

export default async function SettlementPage({ searchParams }: PageProps<"/admin/elszamolas">) {
  await requireAdmin();
  await connection();
  const { period: given } = await searchParams;
  const period = typeof given === "string" && /^\d{4}-\d{2}$/.test(given) ? given : lastMonth();
  const s = t.portal.admin.settlement;
  const rows = await periodOverview(await getDb(), period);
  return (
    <>
      <PageHead title={s.title} sub={s.sub} />
      <section className="mk-panel">
        <form className="mk-search" style={{ maxWidth: 340, marginBottom: 20 }}>
          <input className="mk-input" type="month" name="period" defaultValue={period} aria-label={s.period} />
          <button className="mk-btn mk-btn--secondary" type="submit">{s.show}</button>
        </form>
        {rows.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{s.clinic}</th><th className="mk-num">{s.open}</th><th className="mk-num">{s.closed}</th><th>{s.state}</th><th /></tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.clinic_id}>
                    <td>{row.clinic_name}</td>
                    <td className="mk-num">{row.settlement_id ? "" : formatFt(row.open_ft)}</td>
                    <td className="mk-num">{row.total_ft === null ? "" : formatFt(row.total_ft)}</td>
                    <td>{row.settlement_id ? (row.paid_at ? s.paid : s.waiting) : ""}</td>
                    <td className="mk-num">
                      <div className="mk-actions" style={{ justifyContent: "flex-end" }}>
                        {!row.settlement_id && (
                          <ActionForm action={lockPeriod.bind(null, row.clinic_id, period)} submit={s.lock} small className="" />
                        )}
                        {row.settlement_id && (
                          <a className="mk-btn mk-btn--secondary mk-btn--sm" href={`/elszamolas/${row.settlement_id}/csv`}>{s.download}</a>
                        )}
                        {row.settlement_id && !row.paid_at && (
                          <ActionForm action={markPaid.bind(null, row.settlement_id)} submit={s.markPaid} small className="" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
