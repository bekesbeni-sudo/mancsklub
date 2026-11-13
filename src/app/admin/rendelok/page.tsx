import { connection } from "next/server";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listInterest } from "@/lib/admin-queries";
import { listClinics } from "@/lib/portal-queries";
import { t } from "@/messages";
import { addClinicFromInterest, createClinic } from "../actions";
import { ClinicFields } from "../clinic-fields";

export const instant = false;

export default async function ClinicsPage() {
  await connection();
  await requireAdmin();
  const c = t.portal.admin.clinics;
  const db = await getDb();
  const [clinics, interest] = await Promise.all([listClinics(db), listInterest(db)]);
  return (
    <>
      <PageHead title={c.title} sub={c.sub} />
      <section className="mk-panel">
        {clinics.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{c.name}</th><th>{c.town}</th><th>{c.status}</th><th className="mk-num">{c.discount}</th></tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td><Link href={`/admin/rendelok/${clinic.id}`}>{clinic.name}</Link></td>
                    <td>{[clinic.town, clinic.district].filter(Boolean).join(", ")}</td>
                    <td>{t.portal.contract[clinic.contract_status as keyof typeof t.portal.contract]}</td>
                    <td className="mk-num">{clinic.discount_percent ? Number(clinic.discount_percent) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{c.interest}</h2>
        <p className="mk-muted">{c.interestHint}</p>
        {interest.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{c.interestType}</th><th>{c.name}</th><th>{c.interestPlace}</th><th>{c.interestContact}</th><th></th></tr>
              </thead>
              <tbody>
                {interest.map((row) => (
                  <tr key={row.id}>
                    <td>{t.partners.types[row.partner_type]}</td>
                    <td>{row.clinic_name}</td>
                    <td>{row.location}</td>
                    <td>
                      {[row.contact_name, row.email, row.phone].filter(Boolean).join(", ")}
                      {row.message && <div className="mk-muted">{row.message}</div>}
                    </td>
                    <td>
                      {row.partner_type !== "clinic" ? null : row.clinic_id ? (
                        <Link href={`/admin/rendelok/${row.clinic_id}`}>{c.interestOpen}</Link>
                      ) : (
                        <form action={addClinicFromInterest.bind(null, row.id)}>
                          <button type="submit" className="mk-btn mk-btn--secondary mk-btn--sm">{c.interestAdd}</button>
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
      <section className="mk-panel">
        <h2 className="mk-h">{c.add}</h2>
        <ActionForm action={createClinic} submit={c.create}>
          <ClinicFields />
        </ActionForm>
      </section>
    </>
  );
}
