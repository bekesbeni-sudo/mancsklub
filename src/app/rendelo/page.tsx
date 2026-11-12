import { redirect } from "next/navigation";
import { PageHead } from "@/components/shell";
import { requireClinic } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { lookupMember } from "@/lib/ledger";
import { t } from "@/messages";

export const instant = false;

export default async function LookupPage({ searchParams }: PageProps<"/rendelo">) {
  await requireClinic();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const l = t.portal.clinic.lookup;
  const member = query ? await lookupMember(await getDb(), query) : null;
  if (member) redirect(`/rendelo/tag/${member.membershipId}`);
  return (
    <>
      <PageHead title={l.title} sub={l.sub} />
      <section className="mk-panel">
        <form className="mk-search">
          <input
            className="mk-input"
            name="q"
            defaultValue={query}
            placeholder={l.placeholder}
            aria-label={l.title}
            autoFocus
            autoComplete="off"
          />
          <button className="mk-btn mk-btn--primary" type="submit">{l.search}</button>
        </form>
        {query && <p role="alert" className="mk-msg mk-msg--err" style={{ marginTop: 14 }}>{l.notFound}</p>}
      </section>
    </>
  );
}
