"use client";
/* eslint-disable @next/next/no-img-element -- the logos are small fixed images */
// Glass header and video hero of the landing page, from the mancsklub-frontpage package (2026-11-17).
// Styles are the .lh-* rules in landing.css. Other pages keep SiteHeader from chrome.tsx.
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { t } from "@/messages";

export function LandingHero() {
  const n = t.landing.nav;
  const h = t.landing.page.hero;
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    // Muted autoplay needs these set on the element itself in some browsers, and a retry on first touch.
    const kick = () => {
      if (!v) return;
      v.muted = true;
      v.defaultMuted = true;
      if (v.paused) v.play().catch(() => {});
    };
    // The header is see-through with white text over the video, frosted with dark text below it.
    const onScroll = () => {
      const mobile = window.matchMedia("(max-width:760px)").matches;
      const el = mobile ? v : stage.current;
      if (el) setDark(el.getBoundingClientRect().bottom > 70);
    };
    kick();
    const timers = [setTimeout(kick, 500), setTimeout(kick, 2000)];
    const firstTouch = ["pointerdown", "touchstart", "scroll"] as const;
    firstTouch.forEach((ev) => window.addEventListener(ev, kick, { passive: true, once: true }));
    const onVisible = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVisible);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      timers.forEach(clearTimeout);
      firstTouch.forEach((ev) => window.removeEventListener(ev, kick));
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const close = () => setMenu(false);
  const links = (
    <>
      <a href="#mi-ez" onClick={close}>{n.what}</a>
      <a href="#hogyan" onClick={close}>{n.how}</a>
      <a href="#arazas" onClick={close}>{n.price}</a>
      <a href="#rolunk" onClick={close}>{n.about}</a>
      <a href="#gyik" onClick={close}>{n.faq}</a>
      <a href="/partnereknek">{t.footer.partners}</a>
    </>
  );

  return (
    <>
      <header className={`lh-gh${dark && !menu ? " lh-dark" : ""}${menu ? " lh-open" : ""}`}>
        <nav className="lh-bar" aria-label={n.label}>
          <a href="#top" className="lh-logo-link" aria-label={n.home}>
            <img src={site.logo} alt={site.name} className="lh-logo lh-logo-c" />
            <img src={site.logoWhite} alt="" aria-hidden="true" className="lh-logo lh-logo-w" />
          </a>
          <div className="lh-links">{links}</div>
          <div className="lh-right">
            <a href="#feliratkozas" className="lh-glass-btn lh-btn-sm" onClick={close}>{t.landing.cta}</a>
            <button type="button" className="lh-burger" aria-expanded={menu} aria-controls="lh-menu" aria-label={menu ? n.menuClose : n.menuOpen} onClick={() => setMenu((open) => !open)}>
              <span /><span /><span />
            </button>
          </div>
        </nav>
        <div id="lh-menu" className="lh-menu" hidden={!menu}>{links}</div>
      </header>
      <section id="top" className="lh-hero">
        <div className="lh-stage" ref={stage}>
          <div className="lh-still" aria-hidden="true" />
          <video ref={video} className="lh-vid" poster="/landing/hero/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
            <source src="/landing/hero/hero-dog.mp4" type="video/mp4" />
          </video>
          <div className="lh-shade" />
          <div className="lh-copy">
            <p className="lh-kick">{h.kicker}</p>
            <h1 className="lh-h1">
              {h.kedvenced} {h.egeszsege}
              <br />
              {h.eloreMegtervezve}
            </h1>
            <p className="lh-sub">
              {h.megelozoAllatorvosiEllatasHavi} <strong>{h.kedvezmenyesen}</strong>{h.haviElofizetessel}
            </p>
            <div className="lh-cta">
              <a href="#feliratkozas" className="lh-glass-btn lh-btn-lg">{h.ctaWaitlist}</a>
              <a href="#arazas" className="lh-link">{h.ctaPlans}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
