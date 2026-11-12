import type { Metadata } from "next";
import { site } from "@/config/site";
import { t } from "@/messages";

export const metadata: Metadata = { title: t.privacy.metaTitle };

export default function PrivacyPage() {
  const p = t.privacy;
  const controller = site.controller;
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-title text-4xl font-semibold">{p.title}</h1>
      <p className="mt-3 text-sm text-muted">{p.draft}</p>
      <h2 className="mt-8 text-lg font-semibold">{p.controllerTitle}</h2>
      <p className="mt-1 text-muted">
        {controller
          ? `${controller.name}, ${controller.address}, ${controller.registrationNumber}`
          : p.controllerMissing}
      </p>
      {p.sections.map((section) => (
        <section key={section.title}>
          <h2 className="mt-8 text-lg font-semibold">{section.title}</h2>
          <p className="mt-1 text-muted">{section.text}</p>
        </section>
      ))}
      <p className="mt-8 text-muted">{p.cookies}</p>
      <p className="mt-3 text-muted">
        {p.contact} <a href={`mailto:${site.contactEmail}`} className="underline">{site.contactEmail}</a>
      </p>
    </article>
  );
}
