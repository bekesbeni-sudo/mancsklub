"use client";

import { useActionState } from "react";
import { submitClinicInterest, type FormState } from "@/app/actions";
import { partnerTypes } from "@/lib/validation";
import { t } from "@/messages";
import { Field, FormNotice, Honeypot, inputClass, PrivacyCheckbox, SubmitButton } from "./fields";

const initial: FormState = { status: "idle" };

export function PartnerForm() {
  const [state, action, pending] = useActionState(submitClinicInterest, initial);
  const c = t.partners;
  const v = state.values ?? {};
  const e = state.errors ?? {};

  if (state.status === "success") return <FormNotice tone="ok">{c.success}</FormNotice>;

  return (
    <form action={action} noValidate className="relative space-y-5">
      {state.message && <FormNotice tone="error">{state.message}</FormNotice>}
      <Honeypot />
      <fieldset>
        <legend className="mb-2 block text-sm font-semibold">{c.type}</legend>
        <div className="flex flex-wrap gap-2">
          {partnerTypes.map((type, index) => (
            <label key={type} className="partner-type">
              <input type="radio" name="partnerType" value={type} defaultChecked={v.partnerType ? v.partnerType === type : index === 0} />
              <span>{c.types[type]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label={c.clinicName} name="clinicName" error={e.clinicName}>
        <input id="clinicName" name="clinicName" type="text" required defaultValue={v.clinicName} className={inputClass} />
      </Field>
      <Field label={c.contactName} name="contactName" error={e.contactName}>
        <input id="contactName" name="contactName" type="text" autoComplete="name" required defaultValue={v.contactName} className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={c.email} name="email" error={e.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputClass} />
        </Field>
        <Field label={c.phone} name="phone" optional={c.optional} error={e.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass} />
        </Field>
      </div>
      <Field label={c.location} name="location" error={e.location}>
        <input id="location" name="location" type="text" required defaultValue={v.location} className={inputClass} />
      </Field>
      <Field label={c.message} name="message" optional={c.optional} error={e.message}>
        <textarea id="message" name="message" rows={4} defaultValue={v.message} className={inputClass} />
      </Field>
      <PrivacyCheckbox checked={v.privacy === "on"} error={e.privacy} />
      <SubmitButton pending={pending} label={c.submit} />
    </form>
  );
}
