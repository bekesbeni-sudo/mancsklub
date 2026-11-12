import { connection } from "next/server";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatFt } from "@/lib/format";
import { overview, requestedClinics } from "@/lib/portal-queries";
import { t } from "@/messages";

export const instant = false;

export default async function AdminHome() {
  await requireAdmin();
  await connection();
  const o = t.portal.admin.overview;
  const db = await getDb();
  const [stats, requested] = await Promise.all([overview(db), requestedClinics(db)]);
  const metrics = [
    [o.waitlist, String(stats.waitlist)],
    [o.interest, String(stats.interest)],
    [o.members, String(stats.members)],
    [o.mrr, formatFt(stats.mrr)],
    [o.clinics, String(stats.clinics)],
    [o.open, formatFt(stats.openFt)],
    [o.unpaid, formatFt(stats.unpaidFt)],
  ];
  return (
    <>
      <PageHead title={o.title} />
      <div className="mk-metrics">
        {metrics.map(([label, value]) => (
          <div key={label} className="mk-metric">
            <span className="mk-mono">{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <section className="mk-panel">
        <h2 className="mk-h">{o.requested}</h2>
        <p className="mk-muted">{o.requestedHint}</p>
        {requested.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{o.clinic}</th><th className="mk-num">{o.requests}</th></tr>
              </thead>
              <tbody>
                {requested.map((row) => (
                  <tr key={row.clinic}><td>{row.clinic}</td><td className="mk-num">{row.requests}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
