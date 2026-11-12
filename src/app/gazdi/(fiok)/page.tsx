import { connection } from "next/server";
import Link from "next/link";
import { PageHead } from "@/components/shell";
import { requireOwner } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDateText } from "@/lib/format";
import { ownerPets } from "@/lib/owner";
import { t } from "@/messages";

export const instant = false;

export default async function OwnerHomePage() {
  await connection();
  const owner = await requireOwner();
  const pets = await ownerPets(await getDb(), owner.id);
  const m = t.portal.owner.pets;
  return (
    <>
      <PageHead title={m.title} sub={m.hello(owner.full_name)} />
      {pets.length === 0 && <p className="mk-empty">{m.noPets}</p>}
      {pets.map((pet) => (
        <section key={pet.pet_id} className="mk-panel">
          <h2 className="mk-h">{pet.name}</h2>
          <p className="mk-muted">
            {t.portal.species[pet.species]}
            {pet.package_name ? ` · ${pet.package_name} · ${m.state[pet.state!]}` : ` · ${m.noMembership}`}
          </p>
          {pet.state === "active" && <p className="mk-muted">{m.until} {formatDateText(pet.last_day!)}</p>}
          {pet.membership_id && (
            <p style={{ marginTop: 14 }}>
              <Link href={`/gazdi/tagsag/${pet.membership_id}`} className="mk-btn mk-btn--primary mk-btn--sm">{m.open}</Link>
            </p>
          )}
        </section>
      ))}
    </>
  );
}
