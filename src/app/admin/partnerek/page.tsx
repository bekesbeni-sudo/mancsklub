import { connection } from "next/server";
import Link from "next/link";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listInterest } from "@/lib/admin-queries";
import { formatDate } from "@/lib/format";
import { t } from "@/messages";
import { addClinicFromInterest } from "../actions";

export const instant = false;

// Everyone who filled in the Partnereknek form: clinics, groomers, shops and others.
export default async function PartnersPage() {
  await connection();
  await requireAdmin();
  const p = t.portal.admin.partners;
  const interest = await listInterest(await getDb());
  return (
    <>
      <PageHead title={p.title} sub={p.sub} />
      <section className="mk-panel">
        {interest.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{p.date}</th><th>{p.type}</th><th>{p.name}</th><th>{p.place}</th><th>{p.contact}</th><th></th></tr>
              </thead>
              <tbody>
                {interest.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(new Date(row.created_at))}</td>
                    <td>{t.partners.types[row.partner_type]}</td>
                    <td>{row.clinic_name}</td>
                    <td>{row.location}</td>
                    <td>
                      {[row.contact_name, row.email, row.phone].filter(Boolean).join(", ")}
                      {row.message && <div className="mk-muted">{row.message}</div>}
                    </td>
                    <td>
                      {row.partner_type !== "clinic" ? null : row.clinic_id ? (
                        <Link href={`/admin/rendelok/${row.clinic_id}`}>{p.open}</Link>
                      ) : (
                        <form action={addClinicFromInterest.bind(null, row.id)}>
                          <button type="submit" className="mk-btn mk-btn--secondary mk-btn--sm">{p.add}</button>
                        </form>
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
