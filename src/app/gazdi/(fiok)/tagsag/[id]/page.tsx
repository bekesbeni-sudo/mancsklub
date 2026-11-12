import { connection } from "next/server";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { EntitlementGrid } from "@/components/entitlements";
import { PageHead } from "@/components/shell";
import { requireOwner } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDateText, formatFt } from "@/lib/format";
import { getEntitlements, lookupMember } from "@/lib/ledger";
import { ownerMembership, ownerVisits } from "@/lib/owner";
import { t } from "@/messages";

export const instant = false;

export default async function OwnerMembershipPage({ params }: PageProps<"/gazdi/tagsag/[id]">) {
  await connection();
  const owner = await requireOwner();
  const { id } = await params;
  const db = await getDb();
  const membership = await ownerMembership(db, owner.id, id);
  if (!membership) notFound();
  const [status, entitlements, visits, qr] = await Promise.all([
    lookupMember(db, membership.member_code),
    getEntitlements(db, id),
    ownerVisits(db, id),
    QRCode.toString(membership.member_code, { type: "svg", margin: 1, errorCorrectionLevel: "M" }),
  ]);
  const m = t.portal.owner.membership;
  return (
    <>
      <PageHead title={membership.pet_name} sub={membership.package_name} />
      <section className="mk-panel mk-card">
        <div>
          <h2 className="mk-h">{m.card}</h2>
          <p className="mk-muted">{m.cardHint}</p>
          <p className="mk-card__label">{m.code}</p>
          <p className="mk-card__code">{membership.member_code}</p>
          {status?.isValidToday ? (
            <p className="mk-muted">{m.valid} {formatDateText(membership.last_day)}</p>
          ) : (
            <p role="alert" className="mk-msg mk-msg--err">{m.notValid}</p>
          )}
          <p className="mk-muted">{m.fee}: {formatFt(membership.monthly_fee_ft)}</p>
        </div>
        {/* The SVG comes from our own QR library and holds only the member code. */}
        <div className="mk-card__qr" role="img" aria-label={m.qr(membership.member_code)} dangerouslySetInnerHTML={{ __html: qr }} />
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.left}</h2>
        <EntitlementGrid items={entitlements} />
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.visits}</h2>
        {visits.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{m.date}</th><th>{m.service}</th><th>{m.clinic}</th><th>{m.allowance}</th></tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id}>
                    <td>{formatDateText(v.service_date)}</td>
                    <td>{v.service_name}</td>
                    <td>{v.clinic_name}</td>
                    <td>{v.allowance_used_ft > 0 ? formatFt(v.allowance_used_ft) : ""}</td>
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
