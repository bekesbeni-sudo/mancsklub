import { Shell } from "@/components/shell";
import { t } from "@/messages";
import { ownerLogout } from "../actions";

// Private pages read the login on every request, so they cannot be instant.
export const instant = false;

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const o = t.portal.owner;
  return (
    <Shell
      area={o.area}
      home="/gazdi"
      logoutAction={ownerLogout}
      links={[
        { href: "/gazdi", label: o.nav.pets },
        { href: "/gazdi/rendelok", label: o.nav.clinics },
      ]}
    >
      {children}
    </Shell>
  );
}
