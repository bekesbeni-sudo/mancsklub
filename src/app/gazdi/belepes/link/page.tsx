import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { Wordmark } from "@/components/shell";
import { t } from "@/messages";
import { confirmLogin } from "../../actions";

export const instant = false;

export const metadata: Metadata = {
  title: t.portal.owner.confirm.title,
  referrer: "same-origin",
  robots: { index: false },
};

// The login happens on the button, not on opening the link: mail scanners open links on their own.
export default async function ConfirmLoginPage({ searchParams }: PageProps<"/gazdi/belepes/link">) {
  const { token } = await searchParams;
  const c = t.portal.owner.confirm;
  return (
    <div className="mk-login">
      <div className="mk-login__card">
        <Wordmark />
        <h1 className="mk-title" style={{ marginTop: 24 }}>{c.title}</h1>
        <p className="mk-sub" style={{ marginBottom: 24 }}>{c.lead}</p>
        <ActionForm action={confirmLogin} submit={c.submit}>
          <input type="hidden" name="token" value={typeof token === "string" ? token : ""} />
        </ActionForm>
        <p style={{ marginTop: 20 }}>
          <Link href="/gazdi/belepes" className="mk-link">{c.again}</Link>
        </p>
      </div>
    </div>
  );
}
