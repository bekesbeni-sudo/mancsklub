import { Shell } from "@/components/shell";
import { t } from "@/messages";

// Private pages read the login on every request, so they cannot be instant.
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const n = t.portal.admin.nav;
  return (
    <Shell
      area={t.portal.admin.area}
      home="/admin"
      links={[
        { href: "/admin", label: n.overview },
        { href: "/admin/varolista", label: n.waitlist },
        { href: "/admin/gazdik", label: n.owners },
        { href: "/admin/tagok", label: n.members },
        { href: "/admin/rendelok", label: n.clinics },
        { href: "/admin/arak", label: n.prices },
        { href: "/admin/elszamolas", label: n.settlement },
      ]}
    >
      {children}
    </Shell>
  );
}
