/* eslint-disable @next/next/no-img-element -- the logo is a small fixed image, as on the landing page */
import Link from "next/link";
import { logout } from "@/app/belepes/actions";
import { site } from "@/config/site";
import { t } from "@/messages";
import { NavLinks } from "./nav-links";

// The same logo image as the landing page header, so the brand lives in one file (site.logo).
export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="mk-wordmark" aria-label={site.name}>
      <img src={site.logo} alt={site.name} />
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
        <NavLinks links={links} />
        <div className="mk-side__foot">
          <Link href="/" className="mk-btn mk-btn--secondary mk-btn--sm mk-live-link" aria-label={t.portal.liveSiteAria}>
            {t.portal.liveSite}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="mk-link">
              {t.portal.logout}
            </button>
          </form>
        </div>
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
