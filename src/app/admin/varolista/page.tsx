import { connection } from "next/server";
import Link from "next/link";
import { PageHead } from "@/components/shell";
import { listSignups } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { t } from "@/messages";

const csvPath = "/admin/export/waitlist";
const plans: Record<string, { name: string }> = t.landing.plans;
// Kölyök and Senior are offered on the landing page but are not in the catalogue yet.
const planName = (code: string | null) => (code ? plans[code]?.name ?? code : null);

export const instant = false;

export default async function WaitlistPage({ searchParams }: PageProps<"/admin/varolista">) {
  await connection();
  await requireAdmin();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const w = t.portal.admin.waitlist;
  const signups = await listSignups(await getDb(), query);
  const species = { ...t.portal.species, both: w.both };
  return (
    <>
      <PageHead title={w.title} sub={w.sub}>
        <a href={csvPath} className="mk-btn mk-btn--secondary mk-btn--sm">{w.download}</a>
      </PageHead>
      <section className="mk-panel">
        <form className="mk-search" style={{ marginBottom: 20 }}>
          <input className="mk-input" name="q" defaultValue={query} aria-label={w.search} />
          <button className="mk-btn mk-btn--secondary" type="submit">{w.search}</button>
        </form>
        {signups.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{w.date}</th><th>{w.email}</th><th>{w.pet}</th><th>{w.species}</th><th>{w.package}</th><th>{w.source}</th><th>{w.confirmed}</th><th>{w.status}</th><th></th></tr>
              </thead>
              <tbody>
                {signups.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(new Date(row.created_at))}</td>
                    <td>{row.email}</td>
                    <td>{row.pet_name}</td>
                    <td>{row.species && species[row.species]}</td>
                    <td>{row.package_name ?? planName(row.package_code)}</td>
                    <td>{w.sources[row.source]}</td>
                    <td>{row.confirmed_at ? w.yes : w.no}</td>
                    <td>{row.converted_membership_id ? w.converted : w.waiting}</td>
                    <td>
                      {row.converted_membership_id ? (
                        <Link href={`/admin/tagok/${row.converted_membership_id}`}>{w.open}</Link>
                      ) : (
                        <Link href={`/admin/tagok?varolista=${row.id}`}>{w.convert}</Link>
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
