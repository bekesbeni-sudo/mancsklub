import { connection } from "next/server";
import { PageHead } from "@/components/shell";
import { requireOwner } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { partnerClinics } from "@/lib/owner";
import { t } from "@/messages";

export const instant = false;

export default async function OwnerClinicsPage() {
  await connection();
  await requireOwner();
  const clinics = await partnerClinics(await getDb());
  const c = t.portal.owner.clinics;
  return (
    <>
      <PageHead title={c.title} sub={c.sub} />
      {clinics.length === 0 && <p className="mk-empty">{c.none}</p>}
      {clinics.map((clinic) => (
        <section key={clinic.id} className="mk-panel">
          <h2 className="mk-h">{clinic.name}</h2>
          <p className="mk-muted">{[clinic.town, clinic.district, clinic.address].filter(Boolean).join(", ")}</p>
          {clinic.discount_percent && <p className="mk-muted">{c.discount(String(Number(clinic.discount_percent)))}</p>}
        </section>
      ))}
    </>
  );
}
