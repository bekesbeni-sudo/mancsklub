import { NavBadge } from "@/components/shell";
import { getStaff } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { waitingCount } from "@/lib/portal-queries";
import { t } from "@/messages";

// The number of people waiting, next to "Várólista" in the admin menu. It checks the login itself,
// because a layout can render before the page's own login check.
export async function WaitlistBadge() {
  const staff = await getStaff();
  if (staff?.role !== "admin") return null;
  const count = await waitingCount(await getDb());
  return <NavBadge count={count} label={t.portal.admin.nav.waitingCount(count)} />;
}
