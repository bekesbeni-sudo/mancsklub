import { connection } from "next/server";
import { PageHead } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listPrices, listServices } from "@/lib/portal-queries";
import { t } from "@/messages";
import { addPrice } from "../actions";
import { PriceForm } from "../price-form";
import { PriceTable } from "../price-table";

export const instant = false;

export default async function PricesPage() {
  await connection();
  await requireAdmin();
  const a = t.portal.admin.prices;
  const db = await getDb();
  const [prices, services] = await Promise.all([listPrices(db, null), listServices(db)]);
  return (
    <>
      <PageHead title={a.title} sub={a.sub} />
      <section className="mk-panel">
        <h2 className="mk-h">{a.addTitle}</h2>
        <PriceForm action={addPrice.bind(null, null)} services={services} />
      </section>
      <section className="mk-panel">
        <PriceTable rows={prices} />
      </section>
    </>
  );
}
