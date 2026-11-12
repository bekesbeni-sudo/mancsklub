import { Shell } from "@/components/shell";
import { t } from "@/messages";

// Private pages read the login on every request, so they cannot be instant.
export const instant = false;

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  const n = t.portal.clinic.nav;
  return (
    <Shell
      area={t.portal.clinic.area}
      home="/rendelo"
      links={[
        { href: "/rendelo", label: n.lookup },
        { href: "/rendelo/elszamolas", label: n.settlement },
      ]}
    >
      {children}
    </Shell>
  );
}
