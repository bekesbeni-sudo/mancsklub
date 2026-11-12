import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { Wordmark } from "@/components/shell";
import { t } from "@/messages";
import { requestLoginLink } from "../actions";

export const metadata: Metadata = { title: t.portal.owner.login.title };

export default function OwnerLoginPage() {
  const l = t.portal.owner.login;
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
        <ActionForm action={requestLoginLink} submit={l.submit}>
          <label className="mk-label">
            {l.email}
            <input className="mk-input" name="email" type="email" autoComplete="email" autoCapitalize="none" required />
          </label>
        </ActionForm>
        <p style={{ marginTop: 20 }}>
          <Link href="/belepes" className="mk-link">{l.staff}</Link>
        </p>
      </div>
    </div>
  );
}
