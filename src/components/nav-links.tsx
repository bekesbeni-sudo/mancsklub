"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The portal menu, with the current page highlighted. The first link is the portal's home, so it
// only counts as current on its own address, not on every page below it.
export type NavLink = { href: string; label: string; badge?: React.ReactNode };

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav className="mk-nav">
      {links.map((link, index) => {
        const current = index === 0 ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined} className={current ? "is-on" : undefined}>
            <span>{link.label}</span>
            {link.badge}
          </Link>
        );
      })}
    </nav>
  );
}
