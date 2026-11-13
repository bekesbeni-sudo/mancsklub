import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { Wordmark } from "@/components/shell";
import { t } from "@/messages";
import { requestPasswordReset } from "../actions";

export const metadata: Metadata = { title: t.portal.password.forgotTitle, robots: { index: false } };

export default function ForgotPasswordPage() {
  const f = t.portal.password;
  return (
    <div className="mk-login">
      <div className="mk-login__card">
        <Wordmark />
        <h1 className="mk-title" style={{ marginTop: 24 }}>{f.forgotTitle}</h1>
        <p className="mk-sub" style={{ marginBottom: 24 }}>{f.forgotLead}</p>
        <ActionForm action={requestPasswordReset} submit={f.forgotSubmit}>
          <label className="mk-label">
            {f.emailLabel}
            <input className="mk-input" name="email" type="email" autoComplete="email" autoCapitalize="none" required />
          </label>
        </ActionForm>
        <p style={{ marginTop: 20 }}>
          <Link href="/belepes" className="mk-link">{f.back}</Link>
        </p>
      </div>
    </div>
  );
}
