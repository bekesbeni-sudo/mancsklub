import { formatFt } from "@/lib/format";
import type { Entitlement } from "@/lib/ledger";
import { t } from "@/messages";

export function EntitlementGrid({ items }: { items: Entitlement[] }) {
  const m = t.portal.clinic.member;
  return (
    <div className="mk-ent">
      {items.map((item) => {
        const isMoney = item.allowanceLeftFt !== null;
        const left = isMoney ? item.allowanceLeftFt! : item.quantityLeft!;
        return (
          <div key={item.serviceCode} className={`mk-ent__item${left <= 0 ? " is-empty" : ""}`}>
            <span>{item.serviceName}</span>
            <span className="mk-ent__left">
              {left <= 0 ? m.none : isMoney ? formatFt(left) : `${left} ${m.left}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
