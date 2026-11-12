import { PageHead } from "@/components/shell";
import { requireClinic } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatFt } from "@/lib/format";
import { clinicSettlements } from "@/lib/portal-queries";
import { t } from "@/messages";

export const instant = false;

export default async function ClinicSettlementPage() {
  const staff = await requireClinic();
  const s = t.portal.clinic.settlement;
  const rows = await clinicSettlements(await getDb(), staff.clinicId);
  return (
    <>
      <PageHead title={s.title} sub={s.sub} />
      <section className="mk-panel">
        {rows.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{s.period}</th><th className="mk-num">{s.total}</th><th>{s.state}</th><th /></tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.period}</td>
                    <td className="mk-num">{formatFt(row.total_ft)}</td>
                    <td>{row.paid_at ? s.paid : s.waiting}</td>
                    <td className="mk-num"><a className="mk-btn mk-btn--secondary mk-btn--sm" href={`/elszamolas/${row.id}/csv`}>{s.download}</a></td>
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
