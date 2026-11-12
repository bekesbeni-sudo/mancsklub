import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntitlementGrid } from "@/components/entitlements";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDateText, formatFt } from "@/lib/format";
import { getEntitlements } from "@/lib/ledger";
import { getMember, memberHistory } from "@/lib/portal-queries";
import { t } from "@/messages";
import { cancelMember } from "../../actions";

export const instant = false;

export default async function MemberPage({ params }: PageProps<"/admin/tagok/[id]">) {
  await connection();
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const member = await getMember(db, id).catch(() => null);
  if (!member) notFound();
  const [entitlements, history] = await Promise.all([getEntitlements(db, id), memberHistory(db, id)]);
  const m = t.portal.admin.members;
  const c = t.portal.clinic.member;
  return (
    <>
      <Link href="/admin/tagok" className="mk-back">{t.portal.back}</Link>
      <PageHead
        title={member.pet_name}
        sub={`${member.member_code} · ${member.package_name} · ${member.owner_name} (${member.owner_email})`}
      >
        <span className={`mk-pill mk-pill--${member.status === "active" ? "sage" : "neutral"}`}>
          {t.portal.status[member.status as keyof typeof t.portal.status]}
        </span>
      </PageHead>
      <p style={{ marginBottom: 20 }}><Link href={`/admin/gazdik/${member.owner_id}`} className="mk-link">{m.ownerLink}</Link></p>
      <div className="mk-metrics">
        <div className="mk-metric"><span className="mk-mono">{m.fee}</span><b>{formatFt(member.monthly_fee_ft)}</b></div>
        <div className="mk-metric">
          <span className="mk-mono">{m.term}</span>
          <p style={{ margin: "8px 0 0" }}>{formatDateText(member.started_on)} – {formatDateText(member.last_day)}</p>
        </div>
      </div>
      <section className="mk-panel">
        <h2 className="mk-h">{m.entitlements}</h2>
        <EntitlementGrid items={entitlements} />
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.history}</h2>
        {history.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDateText(row.service_date)}</td>
                    <td>{row.service_name}</td>
                    <td>{row.clinic_name}</td>
                    <td>{row.quantity < 0 ? `${c.reversal}: ${row.reason ?? ""}` : row.voided ? c.voided : ""}</td>
                    <td className="mk-num">{formatFt(row.payable_ft)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {member.status === "active" && (
        <section className="mk-panel">
          <h2 className="mk-h">{m.cancel}</h2>
          <p className="mk-muted">{m.cancelHint}</p>
          <ActionForm action={cancelMember.bind(null, id)} submit={m.cancel} variant="secondary">
            <label className="mk-label" style={{ maxWidth: 260 }}>
              {m.cancelOn}
              <input className="mk-input" name="cancelledOn" type="date" required />
            </label>
          </ActionForm>
        </section>
      )}
    </>
  );
}
