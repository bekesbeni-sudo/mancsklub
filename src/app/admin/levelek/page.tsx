import { connection } from "next/server";
import { ActionForm } from "@/components/portal";
import { PageHead } from "@/components/shell";
import { surveyAudienceCount } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { surveyEmailHtml } from "@/lib/email-template";
import { t } from "@/messages";
import { sendSurveyTest } from "./actions";

export const instant = false;

export default async function EmailsPage() {
  await connection();
  const staff = await requireAdmin();
  const m = t.portal.admin.emails;
  const count = await surveyAudienceCount(await getDb());
  const preview = surveyEmailHtml("#");
  return (
    <>
      <PageHead title={m.title} sub={m.sub} />
      <section className="mk-panel">
        <h2 className="mk-h">{m.surveyTitle}</h2>
        <p style={{ marginTop: 0 }}><strong>{m.subject}</strong> {t.surveyEmail.subject}</p>
        <p className="mk-muted">{m.recipients(count)}</p>
        <p className="mk-muted" style={{ marginBottom: 16 }}>{m.notSent}</p>
        {staff.adminId ? (
          <ActionForm action={sendSurveyTest} submit={m.test} />
        ) : (
          <p className="mk-muted">{m.needOwnLogin}</p>
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
