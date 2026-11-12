import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntitlementGrid } from "@/components/entitlements";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { requireClinic } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDateText, formatFt } from "@/lib/format";
import { getEntitlements, lookupMember } from "@/lib/ledger";
import { getMember, memberHistory } from "@/lib/portal-queries";
import { t } from "@/messages";
import { recordDiscount, recordService, voidService } from "../../actions";

function todayInBudapest(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Budapest" }).format(new Date());
}

export const instant = false;

export default async function ClinicMemberPage({ params }: PageProps<"/rendelo/tag/[id]">) {
  const staff = await requireClinic();
  await connection();
  const { id } = await params;
  const db = await getDb();
  const row = await getMember(db, id).catch(() => null);
  if (!row) notFound();
  const member = await lookupMember(db, row.member_code);
  if (!member) notFound();
  const [entitlements, history] = await Promise.all([
    getEntitlements(db, id),
    memberHistory(db, id, staff.clinicId),
  ]);
  const m = t.portal.clinic.member;
  const available = entitlements.filter((e) => (e.quantityLeft ?? e.allowanceLeftFt ?? 0) > 0);
  const today = todayInBudapest();
  return (
    <>
      <Link href="/rendelo" className="mk-back">{t.portal.back}</Link>
      <PageHead
        title={row.pet_name}
        sub={`${row.member_code} · ${row.package_name} · ${t.portal.species[row.species as keyof typeof t.portal.species]}`}
      >
        <span className={`mk-pill mk-pill--${member.isValidToday ? "sage" : "neutral"}`}>
          {member.isValidToday && <span className="mk-live" />}
          {member.isValidToday ? m.valid : m.invalid}
        </span>
      </PageHead>
      <p className="mk-muted">{m.until} {formatDateText(row.last_day)}</p>
      <section className="mk-panel">
        <h2 className="mk-h">{m.remaining}</h2>
        <EntitlementGrid items={entitlements} />
      </section>
      {member.isValidToday && available.length > 0 && (
        <section className="mk-panel">
          <h2 className="mk-h">{m.record}</h2>
          <ActionForm action={recordService.bind(null, id)} submit={m.submit}>
            <div className="mk-form__row">
              <label className="mk-label">
                {m.service}
                <select className="mk-input" name="service" required>
                  {available.map((e) => (
                    <option key={e.serviceCode} value={e.serviceCode}>{e.serviceName}</option>
                  ))}
                </select>
              </label>
              <label className="mk-label">
                {m.date}
                <input className="mk-input" name="date" type="date" defaultValue={today} max={today} required />
              </label>
              {entitlements.some((e) => e.allowanceFt !== null) && (
                <label className="mk-label">
                  {m.amount}
                  <input className="mk-input" name="amount" inputMode="numeric" />
                  <span className="mk-muted">{m.amountHint}</span>
                </label>
              )}
            </div>
          </ActionForm>
        </section>
      )}
      <section className="mk-panel">
        <h2 className="mk-h">{m.history}</h2>
        {history.length === 0 ? (
          <p className="mk-empty">{t.portal.none}</p>
        ) : (
          <div className="mk-tablewrap">
            <table className="mk-table">
              <thead>
                <tr><th>{m.date2}</th><th>{m.service}</th><th className="mk-num">{m.payable}</th><th /></tr>
              </thead>
              <tbody>
                {history.map((line) => (
                  <tr key={line.id}>
                    <td>{formatDateText(line.service_date)}</td>
                    <td>
                      {line.service_name}
                      {line.quantity < 0 && <span className="mk-muted"> · {m.reversal}: {line.reason}</span>}
                    </td>
                    <td className="mk-num">{formatFt(line.payable_ft)}</td>
                    <td>
                      {line.voided ? (
                        <span className="mk-muted">{m.voided}</span>
                      ) : line.quantity > 0 ? (
                        <ActionForm
                          action={voidService.bind(null, id, line.id)}
                          submit={m.void}
                          variant="secondary"
                          small
                          className="mk-search"
                        >
                          <input className="mk-input" name="reason" placeholder={m.voidReason} aria-label={m.voidReason} required style={{ minHeight: 36, minWidth: 130 }} />
                        </ActionForm>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {member.isValidToday && (
        <section className="mk-panel">
          <h2 className="mk-h">{m.discountTitle}</h2>
          <p className="mk-muted">{m.discountHint}</p>
          <ActionForm action={recordDiscount.bind(null, id)} submit={m.discountSubmit} variant="secondary">
            <div className="mk-form__row">
              <label className="mk-label">{m.date}<input className="mk-input" name="date" type="date" defaultValue={today} max={today} required /></label>
              <label className="mk-label">{m.discountAmount}<input className="mk-input" name="amount" inputMode="numeric" required /></label>
              <label className="mk-label">{m.discountValue}<input className="mk-input" name="discount" inputMode="numeric" required /></label>
            </div>
          </ActionForm>
        </section>
      )}
    </>
  );
}
