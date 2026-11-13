import { connection } from "next/server";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { SURVEY_BATCH, surveyAudience } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { surveyEmailHtml } from "@/lib/email-template";
import { t } from "@/messages";
import { sendSurveyTest, sendSurveyToList } from "./actions";

export const instant = false;

export default async function EmailsPage() {
  await connection();
  const staff = await requireAdmin();
  const m = t.portal.admin.emails;
  const audience = await surveyAudience(await getDb());
  const next = Math.min(audience.left, SURVEY_BATCH);
  const preview = surveyEmailHtml("#");
  return (
    <>
      <PageHead title={m.title} sub={m.sub} />
      <section className="mk-panel">
        <h2 className="mk-h">{m.surveyTitle}</h2>
        <p style={{ marginTop: 0 }}><strong>{m.subject}</strong> {t.surveyEmail.subject}</p>
        <p className="mk-muted">{m.audience(audience.total, audience.sent, audience.left)}</p>
        {audience.invalid.length > 0 && (
          <p className="mk-muted">
            {m.invalid(audience.invalid.length)} {audience.invalid.join(", ")}
          </p>
        )}
        <p className="mk-muted" style={{ marginBottom: 16 }}>{m.testFirst}</p>
        {staff.adminId ? (
          <ActionForm action={sendSurveyTest} submit={m.test} variant="secondary" />
        ) : (
          <p className="mk-muted">{m.needOwnLogin}</p>
        )}
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.sendTitle}</h2>
        {next === 0 ? (
          <p className="mk-muted" style={{ margin: 0 }}>{m.allSent}</p>
        ) : (
          <>
            <p className="mk-muted" style={{ marginTop: 0, marginBottom: 16 }}>{m.sendHint(SURVEY_BATCH)}</p>
            <ActionForm action={sendSurveyToList} submit={m.send}>
              <label className="mk-inline" style={{ marginBottom: 12 }}>
                <input type="checkbox" name="sure" value="yes" required /> {m.sure(next)}
              </label>
            </ActionForm>
          </>
        )}
      </section>
      <section className="mk-panel">
        <h2 className="mk-h">{m.preview}</h2>
        <iframe
          title={m.preview}
          srcDoc={preview}
          sandbox=""
          style={{ width: "100%", height: 1400, border: 0, borderRadius: 16 }}
        />
      </section>
    </>
  );
}
