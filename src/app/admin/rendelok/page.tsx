import { connection } from "next/server";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listClinics } from "@/lib/portal-queries";
import { t } from "@/messages";
import { createClinic } from "../actions";
import { ClinicFields } from "../clinic-fields";

export const instant = false;

export default async function ClinicsPage() {
  await connection();
  await requireAdmin();
  const c = t.portal.admin.clinics;
  const clinics = await listClinics(await getDb());
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
        <h2 className="mk-h">{c.add}</h2>
        <ActionForm action={createClinic} submit={c.create}>
          <ClinicFields />
        </ActionForm>
      </section>
    </>
  );
}
