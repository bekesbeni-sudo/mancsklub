import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { Wordmark } from "@/components/shell";
import { t } from "@/messages";
import { setPassword } from "../actions";

export const instant = false;

export const metadata: Metadata = {
  title: t.portal.password.setTitle,
  referrer: "same-origin",
  robots: { index: false },
};

// The page behind an invitation or a password reset link.
export default async function SetPasswordPage({ searchParams }: PageProps<"/belepes/jelszo">) {
  const { token } = await searchParams;
  const f = t.portal.password;
  return (
    <div className="mk-login">
      <div className="mk-login__card">
        <Wordmark />
        <h1 className="mk-title" style={{ marginTop: 24 }}>{f.setTitle}</h1>
        <p className="mk-sub" style={{ marginBottom: 24 }}>{f.setLead}</p>
        <ActionForm action={setPassword} submit={f.setSubmit}>
          <input type="hidden" name="token" value={typeof token === "string" ? token : ""} />
          <label className="mk-label">
            {f.password}
            <input className="mk-input" name="password" type="password" autoComplete="new-password" minLength={10} required />
          </label>
          <label className="mk-label">
            {f.again}
            <input className="mk-input" name="again" type="password" autoComplete="new-password" minLength={10} required />
          </label>
        </ActionForm>
        <p style={{ marginTop: 20 }}>
          <Link href="/belepes" className="mk-link">{f.back}</Link>
        </p>
      </div>
    </div>
  );
}
