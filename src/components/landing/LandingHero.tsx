"use client";
// Video hero of the landing page, from the mancsklub-frontpage package (2026-11-17).
// Styles are the .lh-* rules in landing.css. The header is LandingHeader.tsx.
import { useEffect, useRef, useState } from "react";
import { t } from "@/messages";
import { LandingHeader } from "./LandingHeader";

const PHONE = "(max-width:760px)";
const DESKTOP_VIDEO = "/landing/hero/hero-dog.mp4";
const PHONE_VIDEO = "/landing/hero/hero-phone.mp4";

export function LandingHero() {
  const h = t.landing.page.hero;
  const [dark, setDark] = useState(true);
  // Phones get their own upright video. Chosen after load, so each device downloads only its own file.
  const [src, setSrc] = useState<string | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const phone = window.matchMedia(PHONE);
    const pick = () => setSrc(phone.matches ? PHONE_VIDEO : DESKTOP_VIDEO);
    pick();
    phone.addEventListener("change", pick);
    return () => phone.removeEventListener("change", pick);
  }, []);

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
      if (stage.current) setDark(stage.current.getBoundingClientRect().bottom > 90);
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
  }, [src]);

  return (
    <>
      <LandingHeader dark={dark} />
      <section id="top" className="lh-hero">
        <div className="lh-stage" ref={stage}>
          <div className="lh-still" aria-hidden="true" />
          {src && (
            <video key={src} ref={video} className="lh-vid" src={src} poster={src === DESKTOP_VIDEO ? "/landing/hero/hero-poster.jpg" : undefined} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
          )}
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
