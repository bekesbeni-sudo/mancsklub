import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { getOwnerRow, ownerPetsAdmin, type AdminPet } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatFt } from "@/lib/format";
import { getPackages } from "@/lib/queries";
import { t } from "@/messages";
import { createPet, saveOwner, savePet, startMembership } from "../../actions";

const o = t.portal.admin.owners;

function PetFields({ pet }: { pet?: AdminPet }) {
  return (
    <>
      <div className="mk-form__row">
        <label className="mk-label">
          {o.petName}
          <input className="mk-input" name="name" defaultValue={pet?.name} required />
        </label>
        <label className="mk-label">
          {o.sex}
          <select className="mk-input" name="sex" defaultValue={pet?.sex ?? ""}>
            {Object.entries(o.sexOptions).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="mk-label">
          {o.birthDate}
          <input className="mk-input" name="birthDate" type="date" defaultValue={pet?.birth_date ?? undefined} />
        </label>
      </div>
      <div className="mk-form__row">
        <label className="mk-label">
          {o.breed}
          <input className="mk-input" name="breed" defaultValue={pet?.breed ?? undefined} />
        </label>
        <label className="mk-label">
          {o.microchip}
          <input className="mk-input" name="microchip" defaultValue={pet?.microchip ?? undefined} />
        </label>
      </div>
    </>
  );
}

export const instant = false;

export default async function OwnerPage({ params }: PageProps<"/admin/gazdik/[id]">) {
  await connection();
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const owner = await getOwnerRow(db, id);
  if (!owner) notFound();
  const [pets, packages] = await Promise.all([ownerPetsAdmin(db, id), getPackages(db)]);
  return (
    <>
      <Link href="/admin/gazdik" className="mk-back">{t.portal.back}</Link>
      <PageHead title={owner.full_name} sub={owner.email} />
      <section className="mk-panel">
        <h2 className="mk-h">{o.details}</h2>
        <ActionForm action={saveOwner.bind(null, id)} submit={o.save}>
          <div className="mk-form__row">
            <label className="mk-label">
              {o.name}
              <input className="mk-input" name="fullName" defaultValue={owner.full_name} required />
            </label>
            <label className="mk-label">
              {o.email}
              <input className="mk-input" name="email" type="email" defaultValue={owner.email} required />
            </label>
            <label className="mk-label">
              {o.phone}
              <input className="mk-input" name="phone" type="tel" defaultValue={owner.phone ?? undefined} />
            </label>
          </div>
          <p className="mk-muted">{o.emailHint}</p>
        </ActionForm>
      </section>
      {pets.map((pet) => (
        <section key={pet.id} className="mk-panel">
          <h2 className="mk-h">{pet.name}</h2>
          <p className="mk-muted">{t.portal.species[pet.species]}</p>
          <ActionForm action={savePet.bind(null, id, pet.id)} submit={o.save}>
            <PetFields pet={pet} />
          </ActionForm>
          <h3 className="mk-h" style={{ marginTop: 24 }}>{o.membership}</h3>
          {pet.membership_id ? (
            <p><Link href={`/admin/tagok/${pet.membership_id}`}>{o.openMembership}: {pet.package_name}</Link></p>
          ) : (
            <>
              <p className="mk-muted">{o.noMembership}</p>
              <ActionForm action={startMembership.bind(null, id, pet.id)} submit={o.start} variant="secondary">
                <div className="mk-form__row">
                  <label className="mk-label">
                    {o.package}
                    <select className="mk-input" name="package">
                      {packages.map((pkg) => (
                        <option key={pkg.code} value={pkg.code}>{pkg.name} ({formatFt(pkg.monthlyFeeFt)})</option>
                      ))}
                    </select>
                  </label>
                  <label className="mk-label">
                    {o.startedOn}
                    <input className="mk-input" name="startedOn" type="date" required />
                  </label>
                </div>
              </ActionForm>
            </>
          )}
        </section>
      ))}
      <section className="mk-panel">
        <h2 className="mk-h">{o.addPet}</h2>
        <ActionForm action={createPet.bind(null, id)} submit={o.add}>
          <label className="mk-label" style={{ maxWidth: 260 }}>
            {o.species}
            <select className="mk-input" name="species">
              {Object.entries(t.portal.species).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <PetFields />
        </ActionForm>
      </section>
    </>
  );
}
