import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/portal";
import { Wordmark } from "@/components/shell";
import { t } from "@/messages";
import { confirmSignup } from "../actions";

export const instant = false;

export const metadata: Metadata = {
  title: t.confirm.metaTitle,
  referrer: "same-origin",
  robots: { index: false },
};

// The confirmation happens on the button, not on opening the link: mail scanners open links on their own.
export default async function ConfirmSignupPage({ searchParams }: PageProps<"/megerosites">) {
  const { token } = await searchParams;
  const c = t.confirm;
  return (
    <div className="mk-login">
      <div className="mk-login__card">
        <Wordmark />
        <h1 className="mk-title" style={{ marginTop: 24 }}>{c.title}</h1>
        <p className="mk-sub" style={{ marginBottom: 24 }}>{c.lead}</p>
        <ActionForm action={confirmSignup} submit={c.submit}>
          <input type="hidden" name="token" value={typeof token === "string" ? token : ""} />
        </ActionForm>
        <p style={{ marginTop: 20 }}>
          <Link href="/" className="mk-link">{c.home}</Link>
        </p>
      </div>
    </div>
  );
}
