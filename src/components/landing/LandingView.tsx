/* eslint-disable @next/next/no-img-element -- illustrations are animated and sized by CSS */
// Generated from the mancsklub-web package (index.html, 2026-11-12), so it mirrors that markup one to one.
// Texts live in t.landing.page, state and handlers in Landing.tsx.
import { Fragment } from "react";
import { site } from "@/config/site";
import { t } from "@/messages";
import { SiteFooter, SiteHeader } from "./chrome";
import type { LandingModel } from "./Landing";

const m = t.landing.page;

export function LandingView({ v }: { v: LandingModel }) {
  return (
    <div className={`pw lp ${v.rootCls}`} onPointerMove={v.onMove} style={{ "--hf": v.hf.family, "--hw": v.hf.weight, "--hls": v.hf.ls, "--accent": v.accent, "--hl": "#CBB197", fontFamily: "var(--nf-body), system-ui, sans-serif", color: "#2E1F16", background: v.theme.bg, overflowX: "clip", transition: "background-color .5s", fontSize: "17px", lineHeight: "1.6" }}>
      <div aria-hidden="true" style={{ position: "fixed", inset: "0", pointerEvents: "none", zIndex: "80", overflow: "hidden" }}>
        {v.trail.map((t, tIndex) => (
          <Fragment key={tIndex}>
            {t.a && (
              <>
                <svg className="paw-step" viewBox="0 0 24 24" fill="#2E1F16" style={{ left: t.x, top: t.y, "--rot": t.r }}>
                  <ellipse cx="5.6" cy="10.2" rx="2.1" ry="2.7" />
                  <ellipse cx="9.8" cy="5.6" rx="2.1" ry="2.8" />
                  <ellipse cx="14.4" cy="5.6" rx="2.1" ry="2.8" />
                  <ellipse cx="18.6" cy="10.2" rx="2.1" ry="2.7" />
                  <path d="M12.1 11.4c-3 0-6.1 3.7-6.1 6.3 0 1.8 1.4 2.8 3 2.8 1.2 0 2.1-.6 3.1-.6s1.9.6 3.1.6c1.6 0 3-1 3-2.8 0-2.6-3.1-6.3-6.1-6.3z" />
                </svg>
              </>
            )}
            {t.b && (
              <>
                <svg className="paw-step" viewBox="0 0 24 24" fill="#2E1F16" style={{ left: t.x, top: t.y, "--rot": t.r }}>
                  <ellipse cx="5.6" cy="10.2" rx="2.1" ry="2.7" />
                  <ellipse cx="9.8" cy="5.6" rx="2.1" ry="2.8" />
                  <ellipse cx="14.4" cy="5.6" rx="2.1" ry="2.8" />
                  <ellipse cx="18.6" cy="10.2" rx="2.1" ry="2.7" />
                  <path d="M12.1 11.4c-3 0-6.1 3.7-6.1 6.3 0 1.8 1.4 2.8 3 2.8 1.2 0 2.1-.6 3.1-.6s1.9.6 3.1.6c1.6 0 3-1 3-2.8 0-2.6-3.1-6.3-6.1-6.3z" />
                </svg>
              </>
            )}
          </Fragment>
        ))}
      </div>
      {" "}
      <div aria-hidden="true" style={{ position: "fixed", inset: "0", pointerEvents: "none", zIndex: "90", overflow: "hidden" }}>
        {v.burstA && (
          <>
            {v.particles.map((p, pIndex) => (
              <Fragment key={pIndex}>
                <div className="confetti" style={{ left: p.x, top: p.y, "--dx": p.dx, "--dy": p.dy, "--rot": p.rot, animationDelay: p.delay }}>
                  {p.isPaw && (
                    <>
                      <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
                        <ellipse cx="5.6" cy="10.2" rx="2.1" ry="2.7" />
                        <ellipse cx="9.8" cy="5.6" rx="2.1" ry="2.8" />
                        <ellipse cx="14.4" cy="5.6" rx="2.1" ry="2.8" />
                        <ellipse cx="18.6" cy="10.2" rx="2.1" ry="2.7" />
                        <path d="M12.1 11.4c-3 0-6.1 3.7-6.1 6.3 0 1.8 1.4 2.8 3 2.8 1.2 0 2.1-.6 3.1-.6s1.9.6 3.1.6c1.6 0 3-1 3-2.8 0-2.6-3.1-6.3-6.1-6.3z" />
                      </svg>
                    </>
                  )}
                  {p.isHeart && (
                    <>
                      <svg width={p.size} height={p.size} viewBox="0 0 24 24">
                        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill={p.color} />
                      </svg>
                    </>
                  )}
                  {p.i0 && (
                    <>
                      <img src={"/landing/beagle.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i1 && (
                    <>
                      <img src={"/landing/wave-cat.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i2 && (
                    <>
                      <img src={"/landing/corgi.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i3 && (
                    <>
                      <img src={"/landing/pinscher.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i4 && (
                    <>
                      <img src={"/landing/dachshund.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                </div>
              </Fragment>
            ))}
          </>
        )}
        {" "}
        {v.burstB && (
          <>
            {v.particles.map((p, pIndex) => (
              <Fragment key={pIndex}>
                <div className="confetti" style={{ left: p.x, top: p.y, "--dx": p.dx, "--dy": p.dy, "--rot": p.rot, animationDelay: p.delay }}>
                  {p.isPaw && (
                    <>
                      <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
                        <ellipse cx="5.6" cy="10.2" rx="2.1" ry="2.7" />
                        <ellipse cx="9.8" cy="5.6" rx="2.1" ry="2.8" />
                        <ellipse cx="14.4" cy="5.6" rx="2.1" ry="2.8" />
                        <ellipse cx="18.6" cy="10.2" rx="2.1" ry="2.7" />
                        <path d="M12.1 11.4c-3 0-6.1 3.7-6.1 6.3 0 1.8 1.4 2.8 3 2.8 1.2 0 2.1-.6 3.1-.6s1.9.6 3.1.6c1.6 0 3-1 3-2.8 0-2.6-3.1-6.3-6.1-6.3z" />
                      </svg>
                    </>
                  )}
                  {p.isHeart && (
                    <>
                      <svg width={p.size} height={p.size} viewBox="0 0 24 24">
                        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill={p.color} />
                      </svg>
                    </>
                  )}
                  {p.i0 && (
                    <>
                      <img src={"/landing/beagle.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i1 && (
                    <>
                      <img src={"/landing/wave-cat.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i2 && (
                    <>
                      <img src={"/landing/corgi.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i3 && (
                    <>
                      <img src={"/landing/pinscher.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                  {p.i4 && (
                    <>
                      <img src={"/landing/dachshund.webp"} alt="" style={{ width: "50px", height: "auto", display: "block" }} />
                    </>
                  )}
                </div>
              </Fragment>
            ))}
          </>
        )}
      </div>
      {" "}
      <SiteHeader />
      {" "}
      <main>
        <section id="top" className="hx hx2" style={{ position: "relative", overflow: "hidden", padding: "96px 24px 0", textAlign: "center" }}>
          <div aria-hidden="true" className="hx-aurora">
            <span className="a1" />
            <span className="a2" />
            <span className="a3" />
          </div>
          {" "}
          <div style={{ position: "relative", zIndex: "2", maxWidth: "980px", margin: "0 auto" }}>
            <p className="fade hx-pill">
              <span className="live-dot" />
              <span className="mono" style={{ fontSize: "11.5px", letterSpacing: "0.08em" }}>
                {m.hero.varolistaNyitva}
              </span>
              <span className="hx-px" style={{ width: "1px", height: "14px", background: "rgba(46, 31, 22, 0.15)" }} />
              <span className="hx-px">
                {m.hero.hamarosanEgeszMagyarorszagon}
              </span>
            </p>
            {" "}
            <h1 className="hx-h1">
              <span className="w" style={{ animationDelay: "80ms" }}>
                {m.hero.kedvenced}
              </span>
              {" "}
              <span className="w" style={{ animationDelay: "190ms" }}>
                {m.hero.egeszsege}
              </span>
              <br />
              <span className="w hx-grad" style={{ animationDelay: "300ms" }}>
                {m.hero.eloreMegtervezve}
              </span>
            </h1>
            {" "}
            <p className="fade" style={{ margin: "26px auto 38px", maxWidth: "520px", fontSize: "18.5px", lineHeight: "1.6", color: "#7A6A5D", animationDelay: "250ms" }}>
              {m.hero.megelozoAllatorvosiEllatasHavi}
            </p>
            {" "}
            <div className="fade" style={{ animationDelay: "380ms" }}>
              <a href="#feliratkozas" className="btn btn-x">
                {m.hero.feliratkozom}{" "}
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
          {" "}
          <div className="hx-stage" aria-hidden="true">
            <div className="hx-cone" />
            {" "}
            <div className="hx-toast t1 hide-sm">
              <img src={"/landing/nozi-sit.webp"} alt="" className="hx-av" style={{ width: "36px", height: "36px" }} />
              <span style={{ textAlign: "left" }}>
                <b style={{ display: "block", fontSize: "13.5px", color: "#1A130F" }}>
                  {m.hero.noziEvesVizsgalata}
                </b>
                <small style={{ display: "block", fontSize: "12.5px", color: "#8A7B6E" }}>
                  {m.hero.benneACsomagban}
                </small>
              </span>
              <span className="mono" style={{ marginLeft: "6px", fontSize: "11px", color: "#A68563" }}>
                {m.hero.most}
              </span>
            </div>
            {" "}
            <div className="hx-toast t2 hide-sm">
              <img src={"/landing/makos-sit.webp"} alt="" className="hx-av" style={{ width: "36px", height: "36px" }} />
              <span style={{ textAlign: "left" }}>
                <b style={{ display: "block", fontSize: "13.5px", color: "#1A130F" }}>
                  {m.hero.makosOltasa}
                </b>
                <small style={{ display: "block", fontSize: "12.5px", color: "#8A7B6E" }}>
                  {m.hero.benneACsomagban}
                </small>
              </span>
              <span className="mono" style={{ marginLeft: "6px", fontSize: "11px", color: "#A68563" }}>
                {m.hero.uj}
              </span>
            </div>
            {" "}
            <div className="hx-toast t3 hide-sm">
              <img src={"/landing/nozi-sit.webp"} alt="" className="hx-av" style={{ width: "36px", height: "36px" }} />
              <span style={{ textAlign: "left" }}>
                <b style={{ display: "block", fontSize: "13.5px", color: "#1A130F" }}>
                  {m.hero.parazitakeret}
                </b>
                <small style={{ display: "block", fontSize: "12.5px", color: "#8A7B6E" }}>
                  {m.hero.premiumCsomagtol}
                </small>
              </span>
              <span className="mono" style={{ marginLeft: "6px", fontSize: "11px", color: "#A68563" }}>
                {m.hero.info}
              </span>
            </div>
            {" "}
            <div className="hx-card">
              <div className="hx-bar">
                <span className="hx-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="mono" style={{ fontSize: "12px", color: "#9A8B7E" }}>
                  {m.hero.mancsklubHuTagsag}
                </span>
                <span className="mono" style={{ fontSize: "11px", color: "#B5A89B" }}>
                  {m.hero.beta}
                </span>
              </div>
              {" "}
              <div className="hx-grid">
                <div className="hx-cell">
                  <p className="hx-lbl">
                    {m.hero.tag}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                    <span style={{ display: "inline-flex" }}>
                      <img src={"/landing/nozi-sit.webp"} alt="" className="hx-av" />
                      <img src={"/landing/makos-sit.webp"} alt="" className="hx-av" style={{ marginLeft: "-14px" }} />
                    </span>
                    <span style={{ textAlign: "left" }}>
                      <span style={{ display: "block", fontSize: "17px", fontWeight: "700", color: "#1A130F", letterSpacing: "-0.01em" }}>
                        {m.hero.noziMakos}
                      </span>
                      <span style={{ display: "block", fontSize: "13px", color: "#9A8B7E" }}>
                        {m.hero.pluszCsomag}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="hx-tag">
                      <span className="live-dot" />
                      {m.hero.aktiv}
                    </span>
                    <span className="hx-tag mono" style={{ color: "#7A6A5D" }}>
                      {m.hero.mk0001}
                    </span>
                  </div>
                </div>
                {" "}
                <div className="hx-cell">
                  <p className="hx-lbl">
                    {m.hero.allapot}
                  </p>
                  <p style={{ margin: "0 0 6px", textAlign: "left", fontFamily: "var(--nf-display), var(--nf-body), sans-serif", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.03em", color: "#1A130F" }} className="hx-ok">
                    {m.hero.egeszseges}
                  </p>
                  <svg viewBox="0 0 300 70" className="hx-ecg">
                    <path className="ecg-bg" d="M0 42 H62 L72 42 L80 14 L90 62 L100 30 L108 42 H170 L180 42 L188 10 L198 64 L208 28 L216 42 H300" />
                    <path className="ecg" d="M0 42 H62 L72 42 L80 14 L90 62 L100 30 L108 42 H170 L180 42 L188 10 L198 64 L208 28 L216 42 H300" />
                  </svg>
                  <p style={{ margin: "6px 0 0", textAlign: "left", fontSize: "12.5px", color: "#9A8B7E" }}>
                    {m.hero.megelozoEllatasokTeljesitve}
                  </p>
                </div>
                {" "}
                <div className="hx-cell" style={{ paddingBottom: "0" }}>
                  <p className="hx-lbl">
                    {m.hero.miVanBenne}
                  </p>
                  <div className="hx-row">
                    <span>
                      {m.hero.evesVizsgalat}
                    </span>
                    <span className="hx-ck" aria-label={m.hero.benneVan}>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5E7F5A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="hx-row">
                    <span>
                      {m.hero.oltasok}
                    </span>
                    <span className="hx-ck" aria-label={m.hero.benneVan}>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5E7F5A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="hx-row">
                    <span>
                      {m.hero.labor}
                    </span>
                    <span className="hx-ck" aria-label={m.hero.benneVan}>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5E7F5A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="hx-row" style={{ borderBottom: "0", paddingTop: "12px" }}>
                    <span style={{ color: "#7A6A5D", fontWeight: "500" }}>
                      {m.hero.havidij}
                    </span>
                    <span style={{ fontWeight: "700", color: "#1A130F" }}>
                      {m.hero.hamarosan}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {" "}
        {" "}
        <section aria-label={m.misc.miVanBenne} style={{ background: "#2E1F16", color: "#FFFFFF", padding: "22px 0", overflow: "hidden" }}>
          <div className="mq-track">
            <div className="mq-set" style={{ display: "flex", gap: "10px 34px", padding: "0 17px", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.evesMegelozoVizsgalat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.oltasok}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.labor}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.parazitavedelem}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.fogaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.borgyogyaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.allergiakezeles}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.apolas}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.evesMegelozoVizsgalat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.oltasok}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.labor}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.parazitavedelem}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.fogaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.borgyogyaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.allergiakezeles}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.apolas}
              </span>
            </div>
            {" "}
            <div className="mq-set mq-dup" aria-hidden="true" style={{ display: "flex", gap: "10px 34px", padding: "0 17px", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.evesMegelozoVizsgalat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.oltasok}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.labor}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.parazitavedelem}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.fogaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.borgyogyaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.allergiakezeles}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.apolas}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.evesMegelozoVizsgalat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.oltasok}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.labor}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.parazitavedelem}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.fogaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A68563" }} />
                {m.misc.borgyogyaszat}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CBB197" }} />
                {m.misc.allergiakezeles}
              </span>
              {" "}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7D572E" }} />
                {m.misc.apolas}
              </span>
            </div>
          </div>
        </section>
        {" "}
        <section id="mi-ez" className="sx sx-l" style={{ padding: "104px 24px 100px" }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "48px 72px", alignItems: "center" }}>
              <div style={{ flex: "1 1 440px", minWidth: "0" }}>
                <p className="eyebrow" style={{ margin: "0 0 16px", color: "#7D572E" }}>
                  {m.why.miertCsinaljuk}
                </p>
                {" "}
                <h2 className="h" style={{ margin: "0 0 22px", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: "1.16" }}>
                  {m.why.azAllatorvosiKoltsegMa}{" "}
                  <span className={`kx ${v.kxCls}`}>
                    <span className="kx-t">
                      {m.why.kiszamithatatlan}
                    </span>
                    <svg className="kx-line" viewBox="0 0 420 14" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="kxg" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0" stopColor="#C29A72" />
                          <stop offset="1" stopColor="#7D572E" />
                        </linearGradient>
                      </defs>
                      <polyline pathLength="100" points="0,12 28,8 50,13 78,3 106,10 130,2 160,13 188,6 214,11 246,1 272,9 298,4 326,13 352,2 378,8 400,1 420,4" fill="none" stroke="url(#kxg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {"."}
                </h2>
                {" "}
                <p style={{ margin: "0 0 16px", fontSize: "18px", color: "#5C4A3A" }}>
                  {m.why.aLegtobbGazdiCsak}
                </p>
                {" "}
                <p style={{ margin: "0", fontSize: "18px", color: "#5C4A3A" }}>
                  <strong style={{ color: "#2E1F16" }}>
                    {m.why.ittJovunkMiA}
                  </strong>
                  {" "}{m.why.aMancsklubKedvezmenyesAron}
                </p>
              </div>
              {" "}
              <div data-rv="why" className={`rv ${v.rv.why}`} style={{ flex: "1 1 440px", minWidth: "0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                <div className="lift" style={{ borderRadius: "28px", padding: "28px", background: "#F4EBE2" }}>
                  <p className="h" style={{ margin: "0 0 6px", fontSize: "56px", lineHeight: "1", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {v.stat500}
                    <span className="kz">
                      {m.why.ezer}
                    </span>
                  </p>
                  {" "}
                  <p style={{ margin: "0", fontSize: "15.5px", color: "#5A3D24" }}>
                    {m.why.forintigIsNohetEgy}
                  </p>
                </div>
                {" "}
                <div className="lift" style={{ borderRadius: "28px", padding: "28px", background: "#E3EBDD" }}>
                  <p className="h" style={{ margin: "0 0 6px", fontSize: "56px", lineHeight: "1", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {v.stat53}
                    <span className="kz">
                      {m.why.ezer}
                    </span>
                  </p>
                  {" "}
                  <p style={{ margin: "0", fontSize: "15.5px", color: "#3F5A3C" }}>
                    {m.why.forintigIsNohetEgy2}
                  </p>
                </div>
                {" "}
                <div className="lift" style={{ gridColumn: "span 2", borderRadius: "28px", padding: "18px 24px", background: "#F4EBE2", display: "flex", alignItems: "center", gap: "18px" }}>
                  <img className="pp" src={"/landing/golden.webp"} alt="" style={{ width: "64px", height: "auto", flex: "none" }} />
                  {" "}
                  <p style={{ margin: "0", fontSize: "14.5px", color: "#6E5A48" }}>
                    {m.why.aBecslesekATeljes}
                  </p>
                </div>
              </div>
            </div>
            {" "}
            <div data-rv="cmp" className={`rv ${v.rv.cmp}`} style={{ marginTop: "96px" }}>
              <div style={{ textAlign: "center", marginBottom: "34px" }}>
                <p className="eyebrow" style={{ margin: "0 0 12px", color: "#7D572E" }}>
                  {m.why.osszehasonlitas}
                </p>
                {" "}
                <h3 className="h" style={{ margin: "0", fontSize: "clamp(28px, 3vw, 40px)", lineHeight: "1.1" }}>
                  {m.why.miValtozikA}{" "}
                  <span className="brand">
                    {site.wordmark[0]}
                    <b>
                      {site.wordmark[1]}
                    </b>
                  </span>
                  {" "}{m.why.tagsaggal}
                </h3>
              </div>
              {" "}
              <div className="cx">
                <div className="cx-band" aria-hidden="true" />
                {" "}
                <div className="cx-hd cx-c1" style={{ gridRow: "1" }}>
                  <span className="cx-mono">
                    {m.why.osszevetes}
                  </span>
                </div>
                {" "}
                <div className="cx-hd cx-c2" style={{ gridRow: "1" }}>
                  <span className="cx-ic">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A68563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
                      <path d="M9 8h6M9 12h6" />
                    </svg>
                  </span>
                  {m.why.jelenleg}
                </div>
                {" "}
                <div className="cx-hd cx-c3" style={{ gridRow: "1" }}>
                  <span className="cx-ic cx-ic-new">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                      <ellipse cx="5.6" cy="10.2" rx="2.1" ry="2.7" />
                      <ellipse cx="9.8" cy="5.6" rx="2.1" ry="2.8" />
                      <ellipse cx="14.4" cy="5.6" rx="2.1" ry="2.8" />
                      <ellipse cx="18.6" cy="10.2" rx="2.1" ry="2.7" />
                      <path d="M12.1 11.4c-3 0-6.1 3.7-6.1 6.3 0 1.8 1.4 2.8 3 2.8 1.2 0 2.1-.6 3.1-.6s1.9.6 3.1.6c1.6 0 3-1 3-2.8 0-2.6-3.1-6.3-6.1-6.3z" />
                    </svg>
                  </span>
                  <span>
                    <span className="cx-logo">
                      {site.wordmark[0]}
                      <b>
                        {site.wordmark[1]}
                      </b>
                    </span>
                    {" "}{m.why.tagsaggal2}
                  </span>
                </div>
                {" "}
                {v.compare.map((c, cIndex) => (
                  <Fragment key={cIndex}>
                    <div className="cx-k cx-c1" style={{ gridRow: c.row }}>
                      <span className="cx-mono">
                        <i>
                          {c.n}
                        </i>
                        {c.k}
                      </span>
                    </div>
                    <div className="cx-old cx-c2" style={{ gridRow: c.row }}>
                      <span className="cx-m">
                        {c.k}
                      </span>
                      <span className="cx-x" aria-hidden="true">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B49A84" strokeWidth="3.4" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </span>
                      <span>
                        {c.a}
                      </span>
                    </div>
                    <div className="cx-new cx-c3" style={{ gridRow: c.row }}>
                      <span className="cx-m">
                        {c.k}
                      </span>
                      <span className="cx-ck" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </span>
                      <span>
                        {c.b}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
        {" "}
        <section id="hogyan" className="sx sx-r sx-sand" style={{ padding: "100px 24px", background: v.theme.bg2 }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="how-head" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px 24px", marginBottom: "48px" }}>
              <div>
                <p className="eyebrow" style={{ margin: "0 0 16px", color: "#7D572E" }}>
                  {m.how.hogyanMukodik}
                </p>
                {" "}
                <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: "1.06" }}>
                  {m.how.haromEgyszeruLepes}
                </h2>
              </div>
              {" "}
              <p className="hand" style={{ margin: "0 0 6px", fontSize: "26px", color: "#7D572E", transform: "rotate(-3deg)" }}>
                {m.how.tenylegEnnyi}
              </p>
            </div>
            {" "}
            <div className="steps" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
              <div data-rv="s1" className={`rv ${v.rv.s1}`}>
                <div className="lift" style={{ height: "100%", borderRadius: "30px", padding: "24px", background: "#FFFFFF", border: "1.5px solid #DCC9B3" }}>
                  <div aria-hidden="true" style={{ height: "190px", borderRadius: "22px", background: "#F4EBE2", marginBottom: "22px", boxSizing: "border-box", padding: "0 18px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", alignContent: "center", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "12px", background: "#FFFFFF", fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {m.how.kolyok}
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "12px", background: "#FFFFFF", fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {m.how.alap}
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "42px", borderRadius: "12px", background: "#2E1F16", color: "#FFFFFF", fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {m.how.plusz}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBB197" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "12px", background: "#FFFFFF", fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {m.how.premium}
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "12px", background: "#FFFFFF", fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {m.how.premiumMax}
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "12px", background: "#FFFFFF", fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {m.how.senior}
                    </div>
                  </div>
                  {" "}
                  <p className="hand" style={{ margin: "0 0 2px", fontSize: "26px", color: "#7D572E" }}>
                    {"1."}
                  </p>
                  {" "}
                  <h3 className="h" style={{ margin: "0 0 8px", fontSize: "24px" }}>
                    {m.how.valasszCsomagot}
                  </h3>
                  {" "}
                  <p style={{ margin: "0", color: "#5C4A3A" }}>
                    {m.how.hatCsomagKozulKutyanak}
                  </p>
                </div>
              </div>
              {" "}
              <div data-rv="s2" className={`rv ${v.rv.s2}`} style={{ transitionDelay: "100ms" }}>
                <div className="lift" style={{ height: "100%", borderRadius: "30px", padding: "24px", background: "#FFFFFF", border: "1.5px solid #DCC9B3" }}>
                  <div aria-hidden="true" style={{ height: "190px", borderRadius: "22px", background: "#E3EBDD", marginBottom: "22px", position: "relative", overflow: "hidden" }}>
                    <svg viewBox="0 0 300 190" preserveAspectRatio="none" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }}>
                      <path d="M150 -10C138 40 166 80 156 120C148 152 134 170 142 200" fill="none" stroke="#C9D8C2" strokeWidth="22" strokeLinecap="round" />
                    </svg>
                    {" "}
                    <span style={{ position: "absolute", left: "30%", top: "30%", width: "14px", height: "14px", borderRadius: "50%", background: "#2E1F16", opacity: ".18" }} />
                    {" "}
                    <span style={{ position: "absolute", left: "70%", top: "62%", width: "14px", height: "14px", borderRadius: "50%", background: "#2E1F16", opacity: ".18" }} />
                    {" "}
                    <span style={{ position: "absolute", left: "62%", top: "24%", width: "14px", height: "14px", borderRadius: "50%", background: "#2E1F16", opacity: ".18" }} />
                    {" "}
                    <div style={{ position: "absolute", left: "38%", top: "66%" }}>
                      <span className="ring" style={{ position: "absolute", left: "-16px", top: "-16px", width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #A68563" }} />
                      {" "}
                      <svg width="34" height="40" viewBox="0 0 24 28" style={{ position: "absolute", left: "-17px", top: "-38px" }}>
                        <path d="M12 27s-9-8-9-15a9 9 0 0 1 18 0c0 7-9 15-9 15z" fill="#A68563" stroke="#2B211C" strokeWidth="1.6" />
                        <circle cx="12" cy="12" r="3.4" fill="#FFFFFF" />
                      </svg>
                    </div>
                    {" "}
                    <div style={{ position: "absolute", right: "14px", top: "14px", padding: "7px 12px", borderRadius: "999px", background: "#FFFFFF", fontSize: "12.5px", fontWeight: "700" }}>
                      {m.how.partnerrendeloAKozeledben}
                    </div>
                  </div>
                  {" "}
                  <p className="hand" style={{ margin: "0 0 2px", fontSize: "26px", color: "#7D572E" }}>
                    {"2."}
                  </p>
                  {" "}
                  <h3 className="h" style={{ margin: "0 0 8px", fontSize: "24px" }}>
                    {m.how.menjAPartnerrendelobe}
                  </h3>
                  {" "}
                  <p style={{ margin: "0", color: "#5C4A3A" }}>
                    {m.how.azOrszagTobbVarosaban}
                  </p>
                </div>
              </div>
              {" "}
              <div data-rv="s3" className={`rv ${v.rv.s3}`} style={{ transitionDelay: "200ms" }}>
                <div className="lift" style={{ height: "100%", borderRadius: "30px", padding: "24px", background: "#FFFFFF", border: "1.5px solid #DCC9B3" }}>
                  <div aria-hidden="true" style={{ height: "190px", borderRadius: "22px", background: "#F4EBE2", marginBottom: "22px", display: "flex", alignItems: "center", justifyContent: "center", gap: "18px" }}>
                    <div style={{ position: "relative", width: "100px", height: "100px", borderRadius: "16px", background: "#FFFFFF", padding: "10px", boxShadow: "0 10px 24px rgba(46, 31, 22, 0.08)" }}>
                      <svg width="80" height="80" viewBox="0 0 8 8" shapeRendering="crispEdges">
                        <path d="M0 0h3v3H0zM5 0h3v3H5zM0 5h3v3H0zM4 4h1v1H4zM6 5h1v1H6zM5 7h1v1H5zM7 7h1v1H7zM4 1h1v1H4zM1 4h1v1H1zM4 6h1v1H4zM6 3h1v1H6z" fill="#2E1F16" />
                      </svg>
                      {" "}
                      <div className="scan" style={{ position: "absolute", left: "6px", right: "6px", top: "14px", height: "3px", borderRadius: "3px", background: "#6F8F6A", boxShadow: "0 0 12px #6F8F6A" }} />
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                      <span style={{ padding: "6px 10px", borderRadius: "10px", background: "#FFFFFF" }}>
                        {m.how.tagsagAktiv}
                      </span>
                      {" "}
                      <span style={{ padding: "6px 10px", borderRadius: "10px", background: "#FFFFFF" }}>
                        {m.how.nincsFizetesAPultnal}
                      </span>
                    </div>
                  </div>
                  {" "}
                  <p className="hand" style={{ margin: "0 0 2px", fontSize: "26px", color: "#7D572E" }}>
                    {"3."}
                  </p>
                  {" "}
                  <h3 className="h" style={{ margin: "0 0 8px", fontSize: "24px" }}>
                    {m.how.mutasdFelATagkartyad}
                  </h3>
                  {" "}
                  <p style={{ margin: "0", color: "#5C4A3A" }}>
                    {m.how.aDigitalisKartyaA}
                  </p>
                </div>
              </div>
            </div>
            {" "}
            <div className={`steps-nav ${v.stNavCls}`}>
              <button type="button" className="sn-arrow" onClick={v.stPrev} aria-label={m.how.elozoLepes}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              {v.stDots.map((d, dIndex) => (
                <Fragment key={dIndex}>
                  <button type="button" className={`sn-dot ${d.cls}`} onClick={d.go} aria-label={d.label} aria-current={d.cur}>
                    <i />
                  </button>
                </Fragment>
              ))}
              <button type="button" className="sn-arrow" onClick={v.stNext} aria-label={m.how.kovetkezoLepes}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </section>
        {" "}
        <section id="arazas" className="sx sx-l" style={{ padding: "88px 24px 40px", scrollMarginTop: "0px" }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px 24px", marginBottom: "14px" }}>
              <div style={{ maxWidth: "920px" }}>
                <p className="eyebrow" style={{ margin: "0 0 10px", color: "#7D572E" }}>
                  {m.pricing.arazas}
                </p>
                {" "}
                <h2 className="h" style={{ margin: "0 0 8px", fontSize: "clamp(32px, 3.4vw, 46px)", lineHeight: "1.06" }}>
                  {m.pricing.tervezettCsomagok}
                </h2>
                {" "}
                <p style={{ margin: "0", fontSize: "16px", color: "#5C4A3A" }}>
                  {m.pricing.mindenBenneVanAmire}
                </p>
                {" "}
                <p style={{ margin: "10px 0 0", fontSize: "15px", color: "#6B5747" }}>
                  {m.pricing.evesTagsagKedvencenkentHavi}
                </p>
              </div>
              {" "}
              <div role="group" aria-label={m.pricing.kedvenc} style={{ display: "inline-flex", padding: "5px", borderRadius: "999px", background: "#F4EBE2", gap: "4px" }}>
                <button type="button" className="seg" onClick={v.priceDog} aria-pressed={v.pIsDog} style={{ border: "0", background: v.ps.dogBg, color: v.ps.dogFg }}>
                  {m.pricing.kutya}
                </button>
                {" "}
                <button type="button" className="seg" onClick={v.priceCat} aria-pressed={v.pIsCat} style={{ border: "0", background: v.ps.catBg, color: v.ps.catFg }}>
                  {m.pricing.macska}
                </button>
              </div>
            </div>
            {" "}
            <div data-rv="price" className={`rv ${v.rv.price}`}>
              <div className="pz-head">
                <p>
                  <span className="pz-step">
                    {"1"}
                  </span>
                  {m.pricing.valasszCsomagot}
                </p>
                <span>
                  {m.pricing.kattintsBarmelyikreAReszletekert}
                </span>
              </div>
              {" "}
              <div className="pz-scroll">
                <div className="pz-inner">
                  <div role="group" aria-label={m.pricing.csomagKivalasztasa} className="pz-tabs">
                    <div className="pz-seg">
                      <span className="pz-thumb" aria-hidden="true" style={{ transform: v.planT }} />
                      {" "}
                      {v.plans.map((c, cIndex) => (
                        <Fragment key={cIndex}>
                          <button type="button" className={`pz-opt ${c.cls}`} onClick={c.select} aria-pressed={c.on}>
                            <span className="av" style={{ background: c.avBg }}>
                              {c.isDog && (
                                <>
                                  <img src={c.dog} alt="" />
                                </>
                              )}
                              {c.isCat && (
                                <>
                                  <img src={c.cat} alt="" />
                                </>
                              )}
                            </span>
                            <span className="tx">
                              <b>
                                {c.name}
                              </b>
                              <small>
                                {c.sub}
                              </small>
                            </span>
                            {c.top && (
                              <>
                                <span className="rb">
                                  {m.pricing.bestseller}
                                </span>
                              </>
                            )}
                            <span className="ok" aria-hidden="true">
                              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A130F" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12l5 5L20 7" />
                              </svg>
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {" "}
              {v.plans.map((p, pIndex) => (
                <Fragment key={pIndex}>
                  {p.on && (
                    <>
                      <div className="pz-panel">
                        <div className="pz-stage" style={{ "--g": p.glow }}>
                          <div className="pz-tile">
                            <div className="pz-shadow" aria-hidden="true" />
                            {p.isDog && (
                              <>
                                <img className="pz-pet" src={p.dog} alt={p.dogAlt} />
                              </>
                            )}
                            {p.isCat && (
                              <>
                                <img className="pz-pet" src={p.cat} alt={p.catAlt} />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="pz-body">
                          <div className="pz-top">
                            <div style={{ minWidth: "0" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                <span className="pz-pill" style={{ background: "#F4EBE2", color: "#7D572E" }}>
                                  {p.stage}
                                </span>
                                {p.featured && (
                                  <>
                                    <span className="pz-pill" style={{ background: "#E3EBDD", color: "#3F5A3C" }}>
                                      <span className="live-dot" />
                                      {m.pricing.aGazdikKedvence}
                                    </span>
                                  </>
                                )}
                                {p.top && (
                                  <>
                                    <span className="pz-pill pz-top-pill">
                                      {m.pricing.aLegtobbetValasztott}
                                    </span>
                                  </>
                                )}
                              </div>
                              <h3 className="pz-name">
                                {p.name}
                              </h3>
                              <p style={{ margin: "0", fontSize: "15.5px", color: "#7A6A5D" }}>
                                {p.desc}
                              </p>
                            </div>
                            <div className="pz-price">
                              <span className="pz-mono" style={{ color: "#C5D4BF" }}>
                                {m.pricing.havidij}
                              </span>
                              <b>
                                {m.pricing.arHamarosan}
                              </b>
                            </div>
                          </div>
                          <div className="pz-cols">
                            <div>
                              <p className="pz-mono pz-lbl">
                                {m.pricing.miVanBenne}
                              </p>
                              <ul className="pz-items">
                                {p.items.map((it, itIndex) => (
                                  <Fragment key={itIndex}>
                                    <li>
                                      <span className="pz-ck">
                                        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3F5A3C" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M5 12l5 5L20 7" />
                                        </svg>
                                      </span>
                                      <span>
                                        {it}
                                      </span>
                                    </li>
                                  </Fragment>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="pz-mono pz-lbl">
                                {m.pricing.lefedettseg}
                              </p>
                              <div className="pz-meters">
                                {p.meters.map((m, mIndex) => (
                                  <Fragment key={mIndex}>
                                    <div className="pz-meter">
                                      <span>
                                        {m.label}
                                      </span>
                                      <span className="pz-segs" aria-label={m.aria}>
                                        {m.segs.map((g, gIndex) => (
                                          <Fragment key={gIndex}>
                                            <i className={g} />
                                          </Fragment>
                                        ))}
                                      </span>
                                    </div>
                                  </Fragment>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="pz-cta">
                            <a href="#feliratkozas" className="btn btn-x" onClick={p.pick} style={{ minHeight: "44px", padding: "0 22px", fontSize: "15px" }}>
                              {m.pricing.ezErdekel}{" "}
                              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                              </svg>
                            </a>
                            <button type="button" className="pz-next pz-back" onClick={v.toPlans}>
                              {m.pricing.masikCsomag}{" "}
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M6 11l6-6 6 6" />
                              </svg>
                            </button>
                            <button type="button" className="pz-next pz-fwd" onClick={p.goNext}>
                              <span className="pz-nl">
                                {p.nextLabel}
                              </span>
                              <span className="pz-ns">
                                {m.pricing.kovetkezo}
                              </span>
                              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Fragment>
              ))}
            </div>
            {" "}
            {" "}
            <p style={{ margin: "24px 0 0", fontSize: "14.5px", color: "#6E5A48" }}>
              {v.priceNote}
            </p>
          </div>
        </section>
        {" "}
        <section className="sx sx-r" style={{ position: "relative", padding: "24px 24px 56px" }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <span id="feliratkozas" aria-hidden="true" style={{ position: "absolute", left: "0", top: "-64px", width: "1px", height: "1px", scrollMarginTop: "0" }} />
          {" "}
          <div data-rv="join" className={`rv ${v.rv.join}`} style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexWrap: "wrap", borderRadius: "32px", overflow: "hidden", background: "#FFFFFF", border: "1px solid #E6D9CB", boxShadow: "0 1px 2px rgba(46, 31, 22, 0.04), 0 30px 60px -30px rgba(46, 31, 22, 0.22)" }}>
            <div className="jp jp-l" style={{ position: "relative", flex: "1 1 380px", minWidth: "0", padding: "36px 40px 0", background: "#F3EBE2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", backgroundImage: "radial-gradient(rgba(46, 31, 22, 0.10) 1px, transparent 1.5px)", backgroundSize: "22px 22px", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 60%)", maskImage: "linear-gradient(to bottom, transparent, #000 60%)" }} />
              {" "}
              <p style={{ position: "relative", margin: "0 0 18px", display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "7px", padding: "4px 10px", borderRadius: "999px", background: "#E3EBDD", color: "#3F5A3C", fontSize: "11.5px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <span className="live-dot" />
                {m.join.varolistaNyitva}
              </p>
              {" "}
              <h2 className="h" style={{ position: "relative", margin: "0 0 12px", fontSize: "clamp(30px, 3vw, 40px)", lineHeight: "1.06" }}>
                {m.join.csatlakozzA}{" "}
                <span className="brand">
                  {site.wordmark[0]}
                  <b>
                    {site.wordmark[1]}
                  </b>
                </span>
                {m.join.hoz}
              </h2>
              {" "}
              <p style={{ position: "relative", margin: "0 0 20px", fontSize: "16px", lineHeight: "1.55", color: "#6B5747", maxWidth: "380px" }}>
                {m.join.addMegParAdatod}
              </p>
              {" "}
              <ul style={{ position: "relative", listStyle: "none", margin: "0 0 20px", padding: "0", display: "grid", gap: "10px", fontSize: "15.5px", fontWeight: "600", color: "#4F3D2E" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ flex: "none", width: "26px", height: "26px", borderRadius: "8px", background: "#E3EBDD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F5A3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  {m.join.elsokentErtesitunkAzIndulasrol}
                </li>
                {" "}
                <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ flex: "none", width: "26px", height: "26px", borderRadius: "8px", background: "#E3EBDD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F5A3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  {m.join.nemKotelezSemmire}
                </li>
                {" "}
                <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ flex: "none", width: "26px", height: "26px", borderRadius: "8px", background: "#E3EBDD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F5A3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  {m.join.barmikorLeiratkozhatsz}
                </li>
              </ul>
              {" "}
              <div aria-hidden="true" className="join-pics" style={{ position: "relative", marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingTop: "10px", paddingBottom: "6px" }}>
                <div className="pose" style={{ width: "150px" }}>
                  <img className="sit" src={"/landing/nozi-sit.webp"} alt="" />
                  <img className="lie" src={"/landing/nozi-lie.webp"} alt="" />
                </div>
                <div className="pose p2" style={{ width: "104px", marginLeft: "34px" }}>
                  <img className="sit" src={"/landing/makos-sit.webp"} alt="" />
                  <img className="lie" src={"/landing/makos-lie.webp"} alt="" />
                </div>
              </div>
            </div>
            {" "}
            <div className="jp" style={{ flex: "1.35 1 460px", minWidth: "0", padding: "32px 38px 30px" }}>
              {v.notSent && (
                <>
                  <div role="form" aria-label={m.join.feliratkozasAVarolistara}>
                    <div className={`fs ${v.fs.a}`}>
                      <p className="step">
                        <i>
                          <span className="nd">
                            {"01"}
                          </span>
                          <span className="nm">
                            {"02"}
                          </span>
                        </i>
                        {m.join.kinekKereselCsomagot}
                        {v.petNone && (
                          <>
                            <span className="step-hint">
                              {m.join.valasszEgyet}
                            </span>
                          </>
                        )}
                      </p>
                      <div role="group" aria-label={m.join.kinekKereselCsomagot} className={`pet-grp ${v.petGrpCls}`} style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                        {v.pets.map((o, oIndex) => (
                          <Fragment key={oIndex}>
                            <button type="button" className={`pet-opt ${o.cls}`} onClick={o.pick} aria-pressed={o.on}>
                              <span className="rd" aria-hidden="true">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12l5 5L20 7" />
                                </svg>
                              </span>
                              {o.label}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div className={`fs ${v.fs.b}`}>
                      <label htmlFor="pet-name" className="step">
                        <i>
                          <span className="nd">
                            {"02"}
                          </span>
                          <span className="nm">
                            {"03"}
                          </span>
                        </i>
                        {m.join.kedvencedNeve}
                      </label>
                      <div className="fld" style={{ marginBottom: "18px" }}>
                        <input id="pet-name" className="inp" type="text" maxLength={20} placeholder={m.join.plBodza} value={v.petName} onChange={v.onName} onFocus={v.focusName} onBlur={v.onBlur} onKeyDown={v.nameKey} enterKeyHint="next" style={{ minHeight: "26px" }} />
                      </div>
                      <button type="button" className="btn fs-next" onClick={v.fsNext}>
                        {v.fsNextLabel}{" "}
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                    <div className={`fs ${v.fs.c}`}>
                      <p className="step">
                        <i>
                          <span className="nd">
                            {"03"}
                          </span>
                          <span className="nm">
                            {"04"}
                          </span>
                        </i>
                        {m.join.melyikCsomagErdekel}{" "}
                        <span style={{ fontWeight: "600", letterSpacing: "0", textTransform: "none", color: "#A8978A" }}>
                          {m.join.nemKotelezo}
                        </span>
                      </p>
                      <div role="group" aria-label={m.join.melyikCsomagErdekel} className="plans" style={{ marginBottom: "18px" }}>
                        {v.interestOpts.map((c, cIndex) => (
                          <Fragment key={cIndex}>
                            <button type="button" className="plan-opt" onClick={c.pick} aria-pressed={c.on} style={{ background: c.bg, color: c.fg, borderColor: c.border }}>
                              <span style={{ display: "block", fontWeight: "700", fontSize: "15px" }}>
                                {c.label}
                              </span>
                              <span style={{ display: "block", fontSize: "12.5px", opacity: "0.75", fontVariantNumeric: "tabular-nums" }}>
                                {c.sub}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <button type="button" className="btn fs-next fs-send" onClick={v.finalSubmit}>
                        {m.join.feliratkozom}{" "}
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                    <div className={`fs ${v.fs.d}`}>
                      <label htmlFor="email" className="step">
                        <i>
                          <span className="nd">
                            {"04"}
                          </span>
                          <span className="nm">
                            {"01"}
                          </span>
                        </i>
                        {m.join.eMailCimed}
                      </label>
                      <div className="fld join-email" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 6px 6px 16px" }}>
                        <input id="email" className="inp" type="email" autoComplete="email" placeholder={m.join.nevPeldaHu} value={v.email} onChange={v.onEmail} onFocus={v.focusEmail} onBlur={v.onBlur} onKeyDown={v.emailKey} aria-invalid={v.err} style={{ flex: "1", minWidth: "0", minHeight: "40px", fontSize: "16px" }} />
                        <button type="button" className="btn" onClick={v.submit} style={{ flex: "none", minHeight: "44px", borderRadius: "11px", padding: "0 20px", fontSize: "15.5px", background: "#2E1F16", color: "#FFFFFF" }}>
                          <span className="nd">
                            {m.join.feliratkozom}
                          </span>
                          <span className="nm">
                            {m.join.tovabb}
                          </span>
                          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </button>
                      </div>
                      {v.err && (
                        <>
                          <p role="alert" className="pop" style={{ margin: "12px 0 0", color: "#B42318", fontWeight: "600", fontSize: "15px" }}>
                            {v.errText}
                          </p>
                        </>
                      )}
                      <p style={{ margin: "12px 0 0 2px", fontSize: "13px", color: "#8A7563" }}>
                        {m.join.csakAzIndulasrolIrunk}
                      </p>
                    </div>
                  </div>
                  <div className="fs-bar">
                    <button type="button" className={`fs-back ${v.fsBackCls}`} onClick={v.fsBack} aria-label={m.join.visszaAzElozoLepesre}>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      {m.join.vissza}
                    </button>
                    <span className="fs-count">
                      {v.fsN}{" "}{"/ 4"}
                    </span>
                    <span className="fs-segs" aria-hidden="true">
                      {v.fsSegs.map((g, gIndex) => (
                        <Fragment key={gIndex}>
                          <i className={g} />
                        </Fragment>
                      ))}
                    </span>
                  </div>
                </>
              )}
              {" "}
              {v.sent && (
                <>
                  <div className="wiggle-in join-ok" style={{ maxWidth: "560px", borderRadius: "26px", background: "#E3EBDD", display: "flex", alignItems: "flex-start" }}>
                    <span style={{ flex: "none", width: "50px", height: "50px", borderRadius: "50%", background: "#6F8F6A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p className="h" style={{ margin: "0 0 4px", fontSize: "26px" }}>
                        {v.successTitle}
                      </p>
                      <p style={{ margin: "0 0 10px", color: "#5C4433" }}>
                        {m.join.felirtunkAVarolistaraAmint}{v.successPlan}
                      </p>
                      <div role="status" style={{ margin: "0 0 14px", padding: "16px 18px", borderRadius: "18px", background: "#FFFFFF", border: "2px solid #6F8F6A", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6F8F6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "2px" }}>
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 7l9 6 9-6" />
                        </svg>
                        <div>
                          <p style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", lineHeight: "1.3", color: "#2E1F16" }}>
                            {v.confirmTitle}
                          </p>
                          <p style={{ margin: "0 0 4px", fontSize: "16px", color: "#2E1F16", overflowWrap: "anywhere" }}>
                            {v.confirmText}
                          </p>
                          <p style={{ margin: "0", fontSize: "14px", color: "#5C4433" }}>
                            {v.confirmSpam}
                          </p>
                        </div>
                      </div>
                      <p style={{ margin: "0 0 10px", fontSize: "14.5px", fontWeight: "700", color: "#2E1F16" }}>
                        {m.join.addigIsKovesdNozi}
                      </p>
                      <div className="soc-row soc-row--ok">
                        <a className="soc" href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label={m.join.mancsklubAzInstagramon}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                          </svg>
                        </a>
                        <a className="soc" href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label={m.join.mancsklubAFacebookon}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
                          </svg>
                        </a>
                        <a className="soc" href="#" aria-label={m.join.mancsklubATiktokon}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M16.6 3c.3 2.1 1.6 3.6 3.6 3.8v3c-1.3 0-2.5-.4-3.6-1.1v6.1c0 3.2-2.4 5.6-5.6 5.6S5.4 18 5.4 14.9s2.5-5.5 5.6-5.5c.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.3 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.6V3h3.1z" />
                          </svg>
                        </a>
                      </div>
                      <div style={{ height: "14px" }} />
                      <button type="button" className="btn" onClick={v.celebrate} style={{ minHeight: "44px", padding: "0 18px", fontSize: "15px", background: "#FFFFFF", color: "#2E1F16" }}>
                        {m.join.megEgyKisUnneples}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        {" "}
        <section className="sx sx-l" style={{ position: "relative", padding: "40px 24px 100px" }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <span id="rolunk" aria-hidden="true" style={{ position: "absolute", left: "0", top: "-40px", width: "1px", height: "1px" }} />
          {" "}
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto 52px" }}>
              <p className="eyebrow" style={{ margin: "0 0 16px", color: "#7D572E" }}>
                {m.misc.rolunk}
              </p>
              {" "}
              <h2 className="h" style={{ margin: "0 0 18px", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: "1.06" }}>
                {m.misc.kikAllnakA}{" "}
                <span className="brand">
                  {site.wordmark[0]}
                  <b>
                    {site.wordmark[1]}
                  </b>
                </span>
                {" "}{m.misc.mogott}
              </h2>
              {" "}
              <p style={{ margin: "0 auto", maxWidth: "640px", fontSize: "18px", color: "#5C4A3A" }}>
                {m.misc.harmanAlapitottukAMancsklubot}
              </p>
            </div>
            {" "}
            <div data-rv="team" className={`rv ${v.rv.team}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
              <div className="lift" style={{ borderRadius: "30px", padding: "34px 28px 30px", background: "#FFFFFF", border: "1.5px solid #DCC9B3", textAlign: "center" }}>
                <img src={"/landing/team-benjamin.webp"} alt={m.team.bekesBenjamin} style={{ display: "block", width: "128px", height: "128px", margin: "0 auto 20px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 4px #FFFFFF, 0 0 0 5px #E6D4C2" }} />
                {" "}
                <h3 className="h" style={{ margin: "0 0 4px", fontSize: "24px" }}>
                  {m.team.bekesBenjamin}
                </h3>
                {" "}
                <p style={{ margin: "0", fontSize: "15px", fontWeight: "600", color: "#7D572E" }}>
                  {m.team.coFounderEsCegvezeto}
                </p>
              </div>
              {" "}
              <div className="lift" style={{ borderRadius: "30px", padding: "34px 28px 30px", background: "#FFFFFF", border: "1.5px solid #DCC9B3", textAlign: "center" }}>
                <img src={"/landing/team-david.webp"} alt={m.team.bihariDavid} style={{ display: "block", width: "128px", height: "128px", margin: "0 auto 20px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 4px #FFFFFF, 0 0 0 5px #E6D4C2" }} />
                {" "}
                <h3 className="h" style={{ margin: "0 0 4px", fontSize: "24px" }}>
                  {m.team.bihariDavid}
                </h3>
                {" "}
                <p style={{ margin: "0", fontSize: "15px", fontWeight: "600", color: "#7D572E" }}>
                  {m.team.coFounderEsCegvezeto}
                </p>
              </div>
              {" "}
              <div className="lift" style={{ borderRadius: "30px", padding: "34px 28px 30px", background: "#FFFFFF", border: "1.5px solid #DCC9B3", textAlign: "center" }}>
                <img src={"/landing/team-abel.webp"} alt={m.team.ilkovitsAbelEsNozi} style={{ display: "block", width: "128px", height: "128px", margin: "0 auto 20px", borderRadius: "50%", objectFit: "cover", objectPosition: "50% 50%", boxShadow: "0 0 0 4px #FFFFFF, 0 0 0 5px #E6D4C2" }} />
                {" "}
                <h3 className="h" style={{ margin: "0 0 4px", fontSize: "24px" }}>
                  {m.team.ilkovitsAbel}
                </h3>
                {" "}
                <p style={{ margin: "0", fontSize: "15px", fontWeight: "600", color: "#7D572E" }}>
                  {m.team.coFounderEsCegvezeto}
                </p>
              </div>
            </div>
          </div>
        </section>
        {" "}
        <section id="gyik" className="sx sx-r sx-sand" style={{ padding: "100px 24px", background: v.theme.bg2 }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <div className="faq-wrap" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "48px" }}>
            <div className="faq-side" style={{ flex: "1 1 300px", minWidth: "0" }}>
              <p className="eyebrow" style={{ margin: "0 0 16px", color: "#7D572E" }}>
                {m.faq.gyik}
              </p>
              {" "}
              <h2 className="h" style={{ margin: "0 0 16px", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: "1.06" }}>
                {m.faq.kerdesedVan}
              </h2>
              {" "}
              <p style={{ margin: "0 0 24px", color: "#5C4A3A" }}>
                {m.faq.nemTalalodAValaszt}{" "}
                <a href={`mailto:${site.contactEmail}`} style={{ fontWeight: "700", color: "#2E1F16", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  {site.contactEmail}
                </a>
                {" "}{m.faq.cimreIgyekszunkMindenLevelre}
              </p>
              {" "}
              <img className="hide-sm" src={"/landing/bobe.webp"} alt={m.faq.bobe} style={{ width: "210px", height: "auto", transform: "rotate(-6deg)" }} />
            </div>
            {" "}
            <div data-rv="faq" className={`rv ${v.rv.faq}`} style={{ flex: "2 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              {v.faqs.map((f, fIndex) => (
                <Fragment key={fIndex}>
                  <div style={{ borderRadius: "22px", padding: "0 24px", background: "#FFFFFF", border: `1.5px solid ${f.border}` }}>
                    <h3 style={{ margin: "0" }}>
                      <button type="button" onClick={f.toggle} aria-expanded={f.open} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", padding: "20px 0", background: "none", border: "0", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: "18px", fontWeight: "700", color: "#2E1F16" }}>
                        {f.q}
                        <span className="acc-icon" aria-hidden="true" style={{ flex: "none", width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${f.rot})`, background: f.icon }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E1F16" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div className="acc-body" style={{ gridTemplateRows: f.rows }}>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ margin: "0 0 22px", fontSize: "16.5px", color: "#5C4A3A", maxWidth: "640px" }}>
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        {" "}
        <section className="sx sx-l" style={{ padding: "72px 24px 96px" }}>
          <div className="sx-au" aria-hidden="true">
            <span className="b1" />
            <span className="b2" />
            <span className="b3" />
          </div>
          {" "}
          <div data-rv="cta" className={`rv ${v.rv.cta} cta-band`} style={{ maxWidth: "1100px", margin: "0 auto", borderRadius: "36px", background: "#E3EBDD", padding: "40px 44px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px", position: "relative" }}>
            <div className="cta-in" style={{ display: "flex", alignItems: "center", gap: "22px", flex: "1 1 460px", minWidth: "0" }}>
              <img className="cta-nozi" src={"/landing/nozi-sit.webp"} alt={m.cta.nozi} style={{ height: "132px", width: "auto", flex: "none", alignSelf: "flex-end", margin: "-16px 0 -40px", filter: "drop-shadow(0 8px 10px rgba(46, 31, 22, 0.14))" }} />
              {" "}
              <div>
                <h2 className="h" style={{ margin: "0 0 6px", fontSize: "clamp(26px, 3vw, 36px)", lineHeight: "1.1" }}>
                  {v.ctaTitle}{" "}
                  <br className="m-br" />
                  {v.ctaTitle2}
                </h2>
                {" "}
                <p style={{ margin: "0", color: "#5A3D24" }}>
                  {v.ctaText}
                </p>
              </div>
            </div>
            {" "}
            <a href="#feliratkozas" className="btn cta-btn" style={{ background: "#2E1F16", color: "#FFFFFF" }}>
              {v.ctaBtn}
            </a>
            {" "}
            <div className="cta-clinic">
              <label htmlFor="clinic" className="cta-cl-lbl">
                {m.cta.szivesenLatnadASajat}{" "}
                <span>
                  {m.cta.nemKotelezo}
                </span>
              </label>
              {" "}
              {v.clinicOpen && (
                <>
                  <div className="fld cta-cl-fld">
                    <input id="clinic" className="inp" type="text" maxLength={80} placeholder={m.cta.rendeloNeveVaros} value={v.clinic} onChange={v.onClinic} onKeyDown={v.clinicKey} enterKeyHint="send" />
                    <button type="button" className="btn" onClick={v.sendClinic}>
                      {m.cta.elkuldom}{" "}
                      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
              {" "}
              {v.clinicSent && (
                <>
                  <p role="status" className="pop cta-cl-ok">
                    {m.cta.koszonjukFeljegyeztuk}{" "}
                    <b>
                      {v.clinicName}
                    </b>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      {" "}
      {v.fetchA && (
        <>
          <div className="fx" aria-hidden="true">
            <span className="fx-ball">
              <span className="fx-spin">
                <svg viewBox="0 0 40 40" width="100%" height="100%">
                  <defs>
                    <radialGradient id="tbg" cx="35%" cy="30%" r="75%">
                      <stop offset="0" stopColor="#F1FA8C" />
                      <stop offset=".6" stopColor="#D4E33A" />
                      <stop offset="1" stopColor="#A9B820" />
                    </radialGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#tbg)" stroke="#1A130F" strokeWidth="2.4" />
                  <path d="M6 9c6 5 6 17 0 22M34 9c-6 5-6 17 0 22" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </span>
            </span>
            <span className="fx-dog">
              <span className="fx-hop">
                <img className="f1" src={"/landing/nozi-run.webp"} alt="" />
                <img className="f2" src={"/landing/nozi-run-small.webp"} alt="" />
              </span>
            </span>
          </div>
        </>
      )}
      {" "}
      {v.fetchB && (
        <>
          <div className="fx" aria-hidden="true">
            <span className="fx-ball">
              <span className="fx-spin">
                <svg viewBox="0 0 40 40" width="100%" height="100%">
                  <defs>
                    <radialGradient id="tbg" cx="35%" cy="30%" r="75%">
                      <stop offset="0" stopColor="#F1FA8C" />
                      <stop offset=".6" stopColor="#D4E33A" />
                      <stop offset="1" stopColor="#A9B820" />
                    </radialGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#tbg)" stroke="#1A130F" strokeWidth="2.4" />
                  <path d="M6 9c6 5 6 17 0 22M34 9c-6 5-6 17 0 22" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </span>
            </span>
            <span className="fx-dog">
              <span className="fx-hop">
                <img className="f1" src={"/landing/nozi-run.webp"} alt="" />
                <img className="f2" src={"/landing/nozi-run-small.webp"} alt="" />
              </span>
            </span>
          </div>
        </>
      )}
      {" "}
      <SiteFooter />
    </div>
  );
}
