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
export default function PartnersPage() {
  const c = t.partners;
  return (
    <section className="partner-page">
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <p className="partner-eyebrow">{c.eyebrow}</p>
        <h1 className="partner-title">{c.title}</h1>
        <p className="mt-4 mb-8 text-lg text-muted">{c.lead}</p>
        <div className="partner-card">
          <Suspense>
            <FormOrNotice />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
