import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { Wordmark } from "@/components/shell";
import { t } from "@/messages";
import { login } from "./actions";

export const metadata: Metadata = { title: t.portal.login.title };

export default function LoginPage() {
  const l = t.portal.login;
  return (
    <div className="mk-login">
      <div className="mk-login__card">
        <Wordmark />
        <div className="mk-login__pets">
          <Image src="/mascots/nozi-sit.webp" alt="" width={52} height={52} />
          <Image src="/mascots/makos-sit.webp" alt="" width={52} height={52} />
        </div>
        <h1 className="mk-title">{l.title}</h1>
        <p className="mk-sub" style={{ marginBottom: 24 }}>{l.lead}</p>
        <ActionForm action={login} submit={l.submit}>
          <label className="mk-label">
            {l.user}
            <input className="mk-input" name="user" autoComplete="username" autoCapitalize="none" required />
          </label>
          <label className="mk-label">
            {l.password}
            <input className="mk-input" name="password" type="password" autoComplete="current-password" required />
          </label>
        </ActionForm>
        <p style={{ marginTop: 20 }}>
          <Link href="/gazdi/belepes" className="mk-link">{t.portal.owner.login.owners}</Link>
        </p>
      </div>
    </div>
  );
}
