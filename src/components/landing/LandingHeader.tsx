"use client";
/* eslint-disable @next/next/no-img-element -- the logos are small fixed images */
// Glass header of the landing page, also used on the partner and privacy pages (2026-11-18).
// Styles are the .lh-* rules in landing.css.
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { t } from "@/messages";

type Props = {
  // White text over the hero video, only on the landing page.
  dark?: boolean;
  // "" on the landing page, "/" on other pages so the section links lead back to the landing page.
  prefix?: "" | "/";
};

export function LandingHeader({ dark = false, prefix = "" }: Props) {
  const n = t.landing.nav;
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  const close = () => setMenu(false);
  const partners = "/partnereknek";
  const links = (
    <>
      <a href={`${prefix}#mi-ez`} onClick={close}>{n.what}</a>
      <a href={`${prefix}#hogyan`} onClick={close}>{n.how}</a>
      <a href={`${prefix}#arazas`} onClick={close}>{n.price}</a>
      <a href={`${prefix}#rolunk`} onClick={close}>{n.about}</a>
      <a href={`${prefix}#gyik`} onClick={close}>{n.faq}</a>
      <a href={partners} aria-current={path === partners ? "page" : undefined}>{t.footer.partners}</a>
    </>
  );

  return (
    <header className={`lh-gh${dark ? " lh-dark" : ""}${menu ? " lh-open" : ""}${prefix ? " lh-page" : ""}`}>
      <nav className="lh-bar" aria-label={n.label}>
        <a href={`${prefix}#top`} className="lh-logo-link" aria-label={n.home}>
          <img src={site.logo} alt={site.name} className="lh-logo lh-logo-c" />
          <img src={site.logoWhite} alt="" aria-hidden="true" className="lh-logo lh-logo-w" />
        </a>
        <div className="lh-links">{links}</div>
        <div className="lh-right">
          <a href={`${prefix}#feliratkozas`} className="lh-glass-btn lh-btn-sm" onClick={close}>{t.landing.cta}</a>
          <button type="button" className="lh-burger" aria-expanded={menu} aria-controls="lh-menu" aria-label={menu ? n.menuClose : n.menuOpen} onClick={() => setMenu((open) => !open)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div id="lh-menu" className="lh-menu" hidden={!menu}>{links}</div>
    </header>
  );
}
