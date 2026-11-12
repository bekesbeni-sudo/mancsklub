import { connection } from "next/server";
import Link from "next/link";
import { PageHead } from "@/components/shell";
import { listOwners } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { t } from "@/messages";

export const instant = false;

export default async function OwnersPage({ searchParams }: PageProps<"/admin/gazdik">) {
  await connection();
  await requireAdmin();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const o = t.portal.admin.owners;
  const owners = await listOwners(await getDb(), query);
  return (
    <>
      <PageHead title={o.title} sub={o.sub} />
      <section className="mk-panel">
        <form className="mk-search" style={{ marginBottom: 20 }}>
          <input className="mk-input" name="q" defaultValue={query} aria-label={o.search} />
          <button className="mk-btn mk-btn--secondary" type="submit">{o.search}</button>
        </form>
        {owners.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{o.name}</th><th>{o.email}</th><th>{o.phone}</th><th className="mk-num">{o.pets}</th><th className="mk-num">{o.active}</th></tr>
              </thead>
              <tbody>
                {owners.map((row) => (
                  <tr key={row.id}>
                    <td><Link href={`/admin/gazdik/${row.id}`}>{row.full_name}</Link></td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td className="mk-num">{row.pets}</td>
                    <td className="mk-num">{row.active}</td>
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
