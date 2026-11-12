import type { ClinicRow } from "@/lib/portal-queries";
import { t } from "@/messages";

export function ClinicFields({ clinic }: { clinic?: ClinicRow }) {
  const c = t.portal.admin.clinics;
  const input = (label: string, name: string, value?: string | null, type = "text") => (
    <label className="mk-label">
      {label}
      <input className="mk-input" name={name} type={type} defaultValue={value ?? ""} />
    </label>
  );
  return (
    <>
      <div className="mk-form__row">
        {input(c.name, "name", clinic?.name)}
        <label className="mk-label">
          {c.status}
          <select className="mk-input" name="status" defaultValue={clinic?.contract_status ?? "prospect"}>
            {Object.entries(t.portal.contract).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        {input(c.discount, "discount", clinic?.discount_percent)}
      </div>
      <div className="mk-form__row">
        {input(c.town, "town", clinic?.town)}
        {input(c.district, "district", clinic?.district)}
        {input(c.address, "address", clinic?.address)}
      </div>
      <div className="mk-form__row">
        {input(c.contactName, "contactName", clinic?.contact_name)}
        {input(c.contactEmail, "contactEmail", clinic?.contact_email, "email")}
        {input(c.contactPhone, "contactPhone", clinic?.contact_phone, "tel")}
      </div>
      <label className="mk-label">
        {c.notes}
        <textarea className="mk-input" name="notes" rows={2} defaultValue={clinic?.notes ?? ""} />
      </label>
    </>
  );
}
