import { formatDateText, formatFt } from "@/lib/format";
import type { PriceRow } from "@/lib/portal-queries";
import { t } from "@/messages";

export function PriceTable({ rows }: { rows: PriceRow[] }) {
  const a = t.portal.admin.prices;
  if (rows.length === 0) return <p className="mk-empty">{t.portal.none}</p>;
  return (
    <div className="mk-tablewrap">
      <table className="mk-table">
        <thead>
          <tr><th>{a.service}</th><th>{a.from}</th><th className="mk-num">{a.price}</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name_hu}</td>
              <td>{formatDateText(row.valid_from)}</td>
              <td className="mk-num">{formatFt(row.price_ft)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
