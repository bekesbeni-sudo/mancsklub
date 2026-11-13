"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The portal menu, with the current page highlighted. The first link is the portal's home, so it
// only counts as current on its own address, not on every page below it.
export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="mk-nav">
      {links.map((link, index) => {
        const current = index === 0 ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined} className={current ? "is-on" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
