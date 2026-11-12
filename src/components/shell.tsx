import Link from "next/link";
import { logout } from "@/app/belepes/actions";
import { site } from "@/config/site";
import { t } from "@/messages";

export function Wordmark({ href = "/" }: { href?: string }) {
  const [first, second] = site.wordmark;
  return (
    <Link href={href} className="mk-wordmark" aria-label={site.name}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <ellipse cx="6" cy="10" rx="2.3" ry="3" />
        <ellipse cx="10.5" cy="5.8" rx="2.3" ry="3" />
        <ellipse cx="15.5" cy="5.8" rx="2.3" ry="3" />
        <ellipse cx="19.5" cy="10.5" rx="2.2" ry="2.9" />
        <path d="M12.8 10.5c3 0 5.7 3.5 5.7 6.2 0 2.1-1.6 3.1-3.3 3.1-1.2 0-1.6-.5-2.4-.5s-1.3.5-2.5.5c-1.7 0-3.3-1-3.3-3.1 0-2.7 2.8-6.2 5.8-6.2Z" />
      </svg>
      <b>
        {first}
        <span>{second}</span>
      </b>
    </Link>
  );
}

export function Shell({
  area,
  home,
  links,
  logoutAction = logout,
  children,
}: {
  area: string;
  home: string;
  links: { href: string; label: string }[];
  logoutAction?: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <div className="mk-shell">
      <aside className="mk-side">
        <div>
          <Wordmark href={home} />
          <p className="mk-side__area">{area}</p>
        </div>
        <nav className="mk-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="mk-link">
            {t.portal.logout}
          </button>
        </form>
      </aside>
      <main className="mk-main">{children}</main>
    </div>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <header className="mk-page-head">
      <div>
        <h1 className="mk-title">{title}</h1>
        {sub && <p className="mk-sub">{sub}</p>}
      </div>
      {children}
    </header>
  );
}

export function Loading() {
  return <p className="mk-muted">{t.portal.loading}</p>;
}
