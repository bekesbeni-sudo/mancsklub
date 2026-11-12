import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ClinicForm } from "@/components/ClinicForm";
import { formsOpen } from "@/config/site";
import { t } from "@/messages";

export const metadata: Metadata = { title: t.clinics.metaTitle };

async function FormOrNotice() {
  await connection();
  return formsOpen() ? <ClinicForm /> : <p className="font-semibold">{t.forms.closed}</p>;
}

export default function ClinicsPage() {
  const c = t.clinics;
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-14 sm:pt-16">
        <p className="text-sm font-semibold text-accent">{c.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-title text-4xl leading-tight font-semibold sm:text-5xl">{c.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">{c.lead}</p>
        <h2 className="mt-12 font-title text-2xl font-semibold">{c.benefitsTitle}</h2>
        <ul className="mt-5 grid gap-6 sm:grid-cols-3">
          {c.benefits.map((item) => (
            <li key={item.title}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-sand">
        <div className="mx-auto max-w-xl px-4 py-14">
          <h2 className="font-title text-3xl font-semibold">{c.formTitle}</h2>
          <p className="mt-3 mb-8 text-muted">{c.formLead}</p>
          <Suspense>
            <FormOrNotice />
          </Suspense>
        </div>
      </section>
    </>
  );
}
