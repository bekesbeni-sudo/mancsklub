import { connection } from "next/server";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { listAdmins } from "@/lib/admin-users";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { t } from "@/messages";
import { addTeamMember, resendInvite, toggleTeamMember } from "./actions";

export const instant = false;

export default async function TeamPage() {
  await connection();
  const staff = await requireAdmin();
  const m = t.portal.admin.team;
  const admins = await listAdmins(await getDb());
  return (
    <>
      <PageHead title={m.title} sub={m.sub} />
      <section className="mk-panel">
        {admins.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{m.name}</th><th>{m.email}</th><th>{m.status}</th><th>{m.lastLogin}</th><th></th></tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      {admin.name}
                      {admin.id === staff.adminId && <span className="mk-muted"> ({m.you})</span>}
                    </td>
                    <td>{admin.email}</td>
                    <td>{!admin.active ? m.disabled : admin.has_password ? m.active : m.invited}</td>
                    <td>{admin.last_login_at ? formatDate(new Date(admin.last_login_at)) : <span className="mk-muted">{m.never}</span>}</td>
                    <td>
                      <div className="mk-actions">
                        {admin.active && (
                          <ActionForm action={resendInvite.bind(null, admin.id)} submit={m.resend} variant="secondary" small className="" />
                        )}
                        {admin.id !== staff.adminId && (
                          <ActionForm
                            action={toggleTeamMember.bind(null, admin.id, !admin.active)}
                            submit={admin.active ? m.disable : m.enable}
                            variant="secondary"
                            small
                            className=""
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mk-muted" style={{ marginTop: 16, marginBottom: 0 }}>{m.sharedHint}</p>
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.addTitle}</h2>
        <p className="mk-muted" style={{ marginTop: -8, marginBottom: 16 }}>{m.addHint}</p>
        <ActionForm action={addTeamMember} submit={m.add}>
          <div className="mk-form__row">
            <label className="mk-label">
              {m.name}
              <input className="mk-input" name="name" autoComplete="off" required />
            </label>
            <label className="mk-label">
              {m.email}
              <input className="mk-input" name="email" type="email" autoComplete="off" autoCapitalize="none" required />
            </label>
          </div>
        </ActionForm>
      </section>
    </>
  );
}
