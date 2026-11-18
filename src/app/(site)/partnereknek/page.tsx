import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { PartnerForm } from "@/components/PartnerForm";
import { formsOpen } from "@/config/site";
import { t } from "@/messages";

export const metadata: Metadata = { title: t.partners.metaTitle };

async function FormOrNotice() {
  await connection();
  return formsOpen() ? <PartnerForm /> : <p className="font-semibold">{t.forms.closed}</p>;
}

// One form for clinics, brands and service providers who want to work with us.
// Same look as the landing page: soft colour blobs behind, glass card (2026-11-18).
export default function PartnersPage() {
  const c = t.partners;
  return (
    <section className="partner-page sx sx-l">
      <div className="sx-au" aria-hidden="true">
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
      </div>
      <div className="partner-wrap">
        <p className="eyebrow partner-eyebrow">{c.eyebrow}</p>
        <h1 className="h partner-title">{c.title}</h1>
        <p className="partner-lead">{c.lead}</p>
        <div className="partner-card glass glass-edge">
          <Suspense>
            <FormOrNotice />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
