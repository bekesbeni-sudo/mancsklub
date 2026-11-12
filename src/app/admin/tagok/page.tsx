import { connection } from "next/server";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getSignup } from "@/lib/admin-queries";
import { searchMembers } from "@/lib/portal-queries";
import { getPackages } from "@/lib/queries";
import { formatFt } from "@/lib/format";
import { t } from "@/messages";
import { addMember } from "../actions";

export const instant = false;

export default async function MembersPage({ searchParams }: PageProps<"/admin/tagok">) {
  await connection();
  await requireAdmin();
  const { q, varolista } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const m = t.portal.admin.members;
  const db = await getDb();
  const [members, packages, signup] = await Promise.all([
    searchMembers(db, query),
    getPackages(db),
    typeof varolista === "string" ? getSignup(db, varolista) : null,
  ]);
  const prefill = signup && !signup.converted_membership_id ? signup : null;
  const field = (label: string, name: string, type = "text", required = false, value?: string | null) => (
    <label className="mk-label">
      {label}
      <input className="mk-input" name={name} type={type} required={required} defaultValue={value ?? undefined} />
    </label>
  );
  return (
    <>
      <PageHead title={m.title} sub={m.sub} />
      <section className="mk-panel">
        <form className="mk-search" style={{ marginBottom: 20 }}>
          <input className="mk-input" name="q" defaultValue={query} aria-label={m.search} />
          <button className="mk-btn mk-btn--secondary" type="submit">{m.search}</button>
        </form>
        {members.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{m.code}</th><th>{m.pet}</th><th>{m.owner}</th><th>{m.package}</th><th>{m.status}</th></tr>
              </thead>
              <tbody>
                {members.map((row) => (
                  <tr key={row.id}>
                    <td><Link href={`/admin/tagok/${row.id}`}>{row.member_code}</Link></td>
                    <td>{row.pet_name}</td>
                    <td>{row.owner_name}</td>
                    <td>{row.package_name}</td>
                    <td>{t.portal.status[row.status as keyof typeof t.portal.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.addTitle}</h2>
        <p className="mk-muted">{prefill ? m.fromWaitlist : m.addHint}</p>
        <ActionForm key={prefill?.id} action={addMember} submit={m.add}>
          {prefill && <input type="hidden" name="signupId" value={prefill.id} />}
          <div className="mk-form__row">
            {field(m.ownerName, "ownerName", "text", true)}
            {field(m.ownerEmail, "ownerEmail", "email", true, prefill?.email)}
            {field(m.ownerPhone, "ownerPhone", "tel")}
          </div>
          <div className="mk-form__row">
            {field(m.petName, "petName", "text", true, prefill?.pet_name)}
            <label className="mk-label">
              {m.species}
              <select className="mk-input" name="species" defaultValue={prefill?.species === "cat" ? "cat" : "dog"}>
                {Object.entries(t.portal.species).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            {field(m.birthDate, "birthDate", "date")}
          </div>
          <div className="mk-form__row">
            {field(m.microchip, "microchip")}
            <label className="mk-label">
              {m.package}
              <select className="mk-input" name="package" defaultValue={prefill?.package_code ?? undefined}>
                {packages.map((pkg) => (
                  <option key={pkg.code} value={pkg.code}>{pkg.name} ({formatFt(pkg.monthlyFeeFt)})</option>
                ))}
              </select>
            </label>
            {field(m.startedOn, "startedOn", "date", true)}
          </div>
        </ActionForm>
      </section>
    </>
  );
}
