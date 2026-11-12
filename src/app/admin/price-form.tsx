import { ActionForm, type ActionState } from "@/components/portal";
import { t } from "@/messages";

export function PriceForm({
  action,
  services,
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  services: { code: string; name_hu: string }[];
}) {
  const a = t.portal.admin.prices;
  return (
    <ActionForm action={action} submit={a.add} variant="secondary">
      <div className="mk-form__row">
        <label className="mk-label">
          {a.service}
          <select className="mk-input" name="service" required>
            {services.map((s) => (
              <option key={s.code} value={s.code}>{s.name_hu}</option>
            ))}
          </select>
        </label>
        <label className="mk-label">
          {a.price}
          <input className="mk-input" name="price" inputMode="numeric" required />
        </label>
        <label className="mk-label">
          {a.from}
          <input className="mk-input" name="validFrom" type="date" required />
        </label>
      </div>
    </ActionForm>
  );
}
