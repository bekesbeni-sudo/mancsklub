/* eslint-disable @next/next/no-img-element -- the logo is a small fixed image */
import Link from "next/link";
import { site } from "@/config/site";
import { t } from "@/messages";
import "@/styles/landing.css";

// Header and footer of the landing page (mancsklub-web, 2026-11-12), shared with the clinic and privacy pages.

export function SiteHeader() {
  const n = t.landing.nav;
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(255, 255, 255, 0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(46, 31, 22, 0.08)" }}>
      <nav aria-label={n.label} style={{ maxWidth: 1220, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <Link href="/#top" aria-label={n.home} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src={site.logo} alt={site.name} style={{ display: "block", height: 30, width: "auto" }} />
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 15, fontWeight: 600, color: "#4F3D2E" }}>
          <Link href="/#mi-ez" className="nl">{n.what}</Link>
          <Link href="/#hogyan" className="nl">{n.how}</Link>
          <Link href="/#arazas" className="nl">{n.price}</Link>
          <Link href="/#rolunk" className="nl">{n.about}</Link>
          <Link href="/#gyik" className="nl">{n.faq}</Link>
        </div>
        <Link href="/#feliratkozas" className="btn" style={{ minHeight: 44, padding: "0 20px", fontSize: 15, background: "#2E1F16", color: "#FFFFFF" }}>{t.landing.cta}</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const n = t.landing.nav;
  return (
    <footer style={{ borderTop: "1px solid rgba(46, 31, 22, 0.08)", padding: "34px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 18, fontSize: 14.5, color: "#5C4A3A" }}>
        <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 14 }}>
          <img src={site.logo} alt={site.name} style={{ display: "block", height: 26, width: "auto" }} />
          {n.copyright}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 26px", fontWeight: 600 }}>
          <Link href="/#mi-ez" className="nl">{n.what}</Link>
          <Link href="/#arazas" className="nl">{n.price}</Link>
          <Link href="/#rolunk" className="nl">{n.about}</Link>
          <Link href="/#gyik" className="nl">{n.faq}</Link>
          <a href={`mailto:${site.contactEmail}`} className="nl">{site.contactEmail}</a>
          <Link href="/adatvedelem" className="nl">{n.privacy}</Link>
          <Link href="/belepes" className="nl">{n.staffLogin}</Link>
        </div>
        <div className="soc-row">
          <a className="soc" href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label={n.instagram}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a className="soc" href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label={n.facebook}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
            </svg>
          </a>
          <a className="soc" href="#" aria-label={n.tiktok}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.6 3c.3 2.1 1.6 3.6 3.6 3.8v3c-1.3 0-2.5-.4-3.6-1.1v6.1c0 3.2-2.4 5.6-5.6 5.6S5.4 18 5.4 14.9s2.5-5.5 5.6-5.5c.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.3 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.6V3h3.1z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
