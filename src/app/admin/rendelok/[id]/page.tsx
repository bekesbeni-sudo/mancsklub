import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getClinic, listClinicUsers, listPrices, listServices } from "@/lib/portal-queries";
import { t } from "@/messages";
import { addClinicUser, addPrice, setClinicUserActive, updateClinic } from "../../actions";
import { ClinicFields } from "../../clinic-fields";
import { PriceForm } from "../../price-form";
import { PriceTable } from "../../price-table";

export const instant = false;

export default async function ClinicPage({ params }: PageProps<"/admin/rendelok/[id]">) {
  await connection();
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const clinic = await getClinic(db, id).catch(() => null);
  if (!clinic) notFound();
  const [prices, services, users] = await Promise.all([
    listPrices(db, id),
    listServices(db),
    listClinicUsers(db, id),
  ]);
  const c = t.portal.admin.clinics;
  return (
    <>
      <Link href="/admin/rendelok" className="mk-back">{t.portal.back}</Link>
      <PageHead title={clinic.name} />
      <section className="mk-panel">
        <ActionForm action={updateClinic.bind(null, id)} submit={c.save}>
          <ClinicFields clinic={clinic} />
        </ActionForm>
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{c.users}</h2>
        <p className="mk-muted">{c.usersHint}</p>
        {users.length > 0 && (
          <div className="mk-tablewrap" style={{ marginBottom: 24 }}>
            <table className="mk-table">
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.active ? "" : c.disabled}</td>
                    <td className="mk-num">
                      <ActionForm
                        action={setClinicUserActive.bind(null, id, user.id, !user.active)}
                        submit={user.active ? c.userDisable : c.userEnable}
                        variant="secondary"
                        small
                        className=""
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ActionForm action={addClinicUser.bind(null, id)} submit={c.userAdd} variant="secondary">
          <div className="mk-form__row">
            <label className="mk-label">{c.userName}<input className="mk-input" name="name" required /></label>
            <label className="mk-label">{c.userEmail}<input className="mk-input" name="email" type="email" required /></label>
            <label className="mk-label">{c.userPassword}<input className="mk-input" name="password" type="password" autoComplete="new-password" required /></label>
          </div>
        </ActionForm>
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{c.ownPrices}</h2>
        <p className="mk-muted">{c.ownPricesHint}</p>
        <PriceTable rows={prices} />
        <div style={{ marginTop: 24 }}>
          <PriceForm action={addPrice.bind(null, id)} services={services} />
        </div>
      </section>
    </>
  );
}
