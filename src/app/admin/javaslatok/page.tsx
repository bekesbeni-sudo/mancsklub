import { connection } from "next/server";
import Link from "next/link";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { listSuggestions, rankSuggestions } from "@/lib/portal-queries";
import { t } from "@/messages";

const csvPath = "/admin/export/suggestions";

export const instant = false;

export default async function SuggestedClinicsPage({ searchParams }: PageProps<"/admin/javaslatok">) {
  await connection();
  await requireAdmin();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const s = t.portal.admin.suggested;
  const db = await getDb();
  const [ranking, rows] = await Promise.all([rankSuggestions(db, query), listSuggestions(db, query)]);
  return (
    <>
      <PageHead title={s.title} sub={s.sub}>
        <a href={csvPath} className="mk-btn mk-btn--secondary mk-btn--sm">{s.csv}</a>
      </PageHead>
      <form className="mk-search" style={{ marginBottom: 24 }}>
        <input className="mk-input" name="q" defaultValue={query} aria-label={s.search} placeholder={s.search} />
        <button className="mk-btn mk-btn--secondary" type="submit">{t.portal.admin.waitlist.search}</button>
      </form>
      <section className="mk-panel">
        <h2 className="mk-h">{s.ranking}</h2>
        <p className="mk-muted" style={{ marginTop: -8, marginBottom: 16 }}>{s.rankingHint}</p>
        {ranking.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{s.clinic}</th><th className="mk-num">{s.requests}</th><th className="mk-num">{s.date}</th></tr>
              </thead>
              <tbody>
                {ranking.map((row) => (
                  <tr key={row.clinic}>
                    <td>{row.clinic}</td>
                    <td className="mk-num">{row.requests}</td>
                    <td className="mk-num">{formatDate(new Date(row.last_at))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{s.all}</h2>
        {rows.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{s.date}</th><th>{s.clinic}</th><th>{s.source}</th><th>{s.signup}</th></tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.signup_id ?? "x"}-${index}`}>
                    <td>{formatDate(new Date(row.created_at))}</td>
                    <td>{row.clinic}</td>
                    <td>{row.source === "box" ? s.fromBox : s.fromSignup}</td>
                    <td>
                      {row.email ? (
                        <Link href={`/admin/varolista?q=${encodeURIComponent(row.email)}`}>{row.email}</Link>
                      ) : (
                        <span className="mk-muted">{s.anonymous}</span>
                      )}
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
