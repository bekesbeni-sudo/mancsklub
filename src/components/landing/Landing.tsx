"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { joinWaitlist, suggestClinic } from "@/app/actions";
import { t } from "@/messages";
import { LandingView } from "./LandingView";

// Ported from the mancsklub-web package (index.html, 2026-11-12). The markup is in LandingView.tsx,
// and this file holds what the page's own script did: state, motion and the form.

type Species = "dog" | "cat";
type Pet = "none" | Species | "both";
type PlanCode = keyof typeof t.landing.plans;
type Interest = "unsure" | PlanCode;
type PawStep = { g: number; x: string; y: string; r: string };
type Particle = {
  x: string; y: string; dx: string; dy: string; rot: string; delay: string; size: string; color: string;
  isPaw: boolean; isHeart: boolean; isImg: boolean; i0: boolean; i1: boolean; i2: boolean; i3: boolean; i4: boolean;
};

const INK = "#2E1F16";
const art = (name: string) => `/landing/${name}.webp`;
const PLAN_ORDER: PlanCode[] = ["KOLYOK", "ALAP", "PLUSZ", "PREMIUM", "PREMIUM_MAX", "SENIOR"];
const PLAN_STYLE: Record<PlanCode, { dog: string; cat: string; avBg: string; glow: string; featured?: boolean; highlights: string[]; meter: number[] }> = {
  KOLYOK: { dog: "pug", cat: "tux", avBg: "#F8E2D4", glow: "#F2D2BD", highlights: ["Oltássor", "Mikrochip", "Parazitakeret"], meter: [2, 0, 5, 4, 0] },
  ALAP: { dog: "vizsla", cat: "black-cat", avBg: "#F4EBE2", glow: "#E8D5C1", highlights: ["Éves vizsgálat", "Oltás", "Ápolás"], meter: [1, 0, 3, 0, 2] },
  PLUSZ: { dog: "yorkie", cat: "wave-cat", avBg: "#C5D4BF", glow: "#C2D7BB", featured: true, highlights: ["Betegvizit", "Labor", "Oltás"], meter: [2, 2, 3, 0, 2] },
  PREMIUM: { dog: "frenchie", cat: "siamese", avBg: "#F4EBE2", glow: "#E5CEB5", highlights: ["Hasi ultrahang", "Bővített labor", "Parazitakeret"], meter: [3, 4, 3, 4, 4] },
  PREMIUM_MAX: { dog: "pinscher", cat: "orange-cat", avBg: "#F4EBE2", glow: "#D7C2A9", highlights: ["Évi 3 vizsgálat", "Röntgen", "Fogászati keret"], meter: [5, 5, 3, 4, 5] },
  SENIOR: { dog: "golden", cat: "persian", avBg: "#E3EBDD", glow: "#CDDFC8", highlights: ["Időskori vizsgálat", "Bővített labor", "Hasi ultrahang"], meter: [4, 4, 3, 0, 3] },
};
const CONFETTI_COLORS = ["#A68563", "#7E9B7A", "#F27B8C", "#CBB197", "#C5D4BF", INK, "#7D572E"];
const HEADING = { family: "var(--nf-display), var(--nf-body), system-ui, sans-serif", weight: 700, ls: "-0.03em" };
const REVEAL = ["why", "cmp", "s1", "s2", "s3", "price", "join", "team", "faq", "cta"] as const;
const EMPTY_TRAIL: PawStep[] = Array.from({ length: 18 }, () => ({ g: 0, x: "0px", y: "0px", r: "0deg" }));

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const noSubscribe = () => () => {};
// Animations run only in a browser that can watch scrolling and has not asked for less motion.
const useCanAnimate = () =>
  useSyncExternalStore(noSubscribe, () => "IntersectionObserver" in window && !reducedMotion(), () => false);
const headerHeight = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hdrH"), 10) || 64;

// Keeps a tab row scrolled so the chosen tab sits in the middle.
function centerInRow(button: Element | null | undefined, row: Element | null | undefined) {
  if (!button || !row || row.scrollWidth <= row.clientWidth + 4) return;
  if (getComputedStyle(row).overflowX === "visible") return;
  const b = button.getBoundingClientRect();
  const r = row.getBoundingClientRect();
  row.scrollTo({ left: row.scrollLeft + (b.left + b.width / 2) - (r.left + r.width / 2), behavior: "smooth" });
}

function confetti(x: number, y: number): Particle[] {
  return Array.from({ length: 44 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 320;
    const kind = i % 8 === 0 ? "img" : i % 3 === 0 ? "heart" : "paw";
    const img = kind === "img";
    return {
      x: `${x}px`,
      y: `${y}px`,
      dx: `${(Math.cos(angle) * distance).toFixed(0)}px`,
      dy: `${(Math.sin(angle) * distance * 0.8 - 130).toFixed(0)}px`,
      rot: `${(Math.random() * 360 - 180).toFixed(0)}deg`,
      delay: `${(Math.random() * 0.12).toFixed(2)}s`,
      size: (16 + Math.random() * 20).toFixed(0),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      isPaw: kind === "paw",
      isHeart: kind === "heart",
      isImg: img,
      i0: img && i % 5 === 0,
      i1: img && i % 5 === 1,
      i2: img && i % 5 === 2,
      i3: img && i % 5 === 3,
      i4: img && i % 5 === 4,
    };
  });
}

function useLandingModel() {
  const l = t.landing;
  const [trail, setTrail] = useState(EMPTY_TRAIL);
  const [pet, setPet] = useState<Pet>("none");
  const [petName, setPetName] = useState("");
  const [email, setEmail] = useState("");
  const [priceSpecies, setPriceSpecies] = useState<Species>("dog");
  const [interest, setInterest] = useState<Interest>("unsure");
  const [faq, setFaq] = useState(0);
  const [plan, setPlan] = useState<PlanCode>("PLUSZ");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [clinic, setClinic] = useState("");
  const [clinicSent, setClinicSent] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepAuto, setStepAuto] = useState(true);
  const [formStep, setFormStep] = useState(0);
  const [burst, setBurst] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const canAnimate = useCanAnimate();
  const [gaveUp, setGaveUp] = useState(false);
  const armed = canAnimate && !gaveUp;
  const countArmed = canAnimate;
  const [stepRequest, setStepRequest] = useState<{ index: number; n: number } | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [cardGo, setCardGo] = useState(false);
  const [fetchN, setFetchN] = useState(0);

  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const paw = useRef<{ last: { x: number; y: number } | null; side: number; slot: number }>({ last: null, side: 1, slot: 0 });
  const raf = useRef<number | null>(null);
  const sending = useRef(false);
  const signupToken = useRef<string | null>(null);
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const steps = useRef<{ go: (i: number) => void }>({ go: () => {} });
  const formStepRef = useRef(formStep);
  useEffect(() => {
    formStepRef.current = formStep;
  }, [formStep]);

  // Sections fade in, the figures count up, and the member card animates once in view.
  useEffect(() => {
    if (!canAnimate) return;
    const observers: IntersectionObserver[] = [];
    let countFrame = 0;
    let countTimer: ReturnType<typeof setTimeout> | undefined;
    const why = document.querySelector('[data-rv="why"]');
    if (why) {
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          io.disconnect();
          let start: number | null = null;
          const step = (time: number) => {
            if (start === null) start = time;
            const x = Math.min(1, (time - start) / 1700);
            setCount(1 - Math.pow(1 - x, 3));
            if (x < 1) countFrame = requestAnimationFrame(step);
          };
          countTimer = setTimeout(() => (countFrame = requestAnimationFrame(step)), 250);
        },
        { threshold: 0.3 },
      );
      io.observe(why);
      observers.push(io);
    }
    const card = document.querySelector("#mi-ez .kx");
    if (card) {
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          io.disconnect();
          setTimeout(() => setCardGo(true), 150);
        },
        { threshold: 0.8 },
      );
      io.observe(card);
      observers.push(io);
    }
    const sections = document.querySelectorAll("[data-rv]");
    let gotAny = false;
    const io = new IntersectionObserver(
      (entries) => {
        const add: Record<string, boolean> = {};
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          add[entry.target.getAttribute("data-rv") ?? ""] = true;
          io.unobserve(entry.target);
        }
        if (Object.keys(add).length === 0) return;
        gotAny = true;
        setSeen((current) => ({ ...current, ...add }));
      },
      { threshold: 0.12 },
    );
    sections.forEach((section) => io.observe(section));
    observers.push(io);
    // If the observer never reports anything, show the page rather than leave sections hidden.
    const fallback = setTimeout(() => {
      if (!gotAny) setGaveUp(true);
    }, 1500);
    return () => {
      observers.forEach((observer) => observer.disconnect());
      clearTimeout(fallback);
      clearTimeout(countTimer);
      cancelAnimationFrame(countFrame);
    };
  }, [canAnimate]);

  // On phones the three steps are a swipeable row that moves on by itself every five seconds.
  useEffect(() => {
    const header = document.querySelector("header");
    const setHeader = () => {
      if (header) document.documentElement.style.setProperty("--hdrH", `${header.offsetHeight}px`);
    };
    setHeader();
    window.addEventListener("resize", setHeader);
    const row = document.querySelector<HTMLElement>(".steps");
    if (!row) return () => window.removeEventListener("resize", setHeader);
    const reduce = reducedMotion();
    let index = 0;
    let hold = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (reduce || hold) return;
      setStepAuto(true);
      timer = setTimeout(() => {
        const box = row.getBoundingClientRect();
        const visible = box.bottom > 80 && box.top < window.innerHeight - 80;
        if (!isMobile() || !visible) return schedule();
        go((index + 1) % 3);
      }, 5000);
    };
    const go = (i: number) => {
      const child = row.children[i] as HTMLElement | undefined;
      if (!child) return;
      row.scrollTo({ left: child.offsetLeft - (row.children[0] as HTMLElement).offsetLeft, behavior: reduce ? "auto" : "smooth" });
      index = i;
      setStepIndex(i);
      schedule();
    };
    const onScroll = () => {
      if (!isMobile()) return;
      const kids = row.children;
      let best = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < kids.length; i++) {
        const d = Math.abs((kids[i] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft - row.scrollLeft);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      }
      if (best !== index) {
        index = best;
        setStepIndex(best);
        schedule();
      }
    };
    const onHold = () => {
      hold = true;
      clearTimeout(timer);
      setStepAuto(false);
    };
    const onRelease = () => {
      hold = false;
      schedule();
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("touchstart", onHold, { passive: true });
    row.addEventListener("touchend", onRelease, { passive: true });
    row.addEventListener("pointerdown", onHold);
    row.addEventListener("pointerup", onRelease);
    steps.current.go = go;
    schedule();
    return () => {
      clearTimeout(timer);
      row.removeEventListener("scroll", onScroll);
      row.removeEventListener("touchstart", onHold);
      row.removeEventListener("touchend", onRelease);
      row.removeEventListener("pointerdown", onHold);
      row.removeEventListener("pointerup", onRelease);
      window.removeEventListener("resize", setHeader);
    };
  }, []);

  useEffect(() => {
    if (stepRequest) steps.current.go(stepRequest.index);
  }, [stepRequest]);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (fetchTimer.current) clearTimeout(fetchTimer.current);
    },
    [],
  );

  function goStep(index: number) {
    setStepRequest((current) => ({ index, n: (current?.n ?? 0) + 1 }));
  }

  function launch() {
    const point = lastPoint.current ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setParticles(confetti(point.x, point.y));
    setBurst((value) => value + 1);
  }

  function focusLater(id: string) {
    if (!isMobile()) return;
    setTimeout(() => document.getElementById(id)?.focus({ preventScroll: true }), 340);
  }

  function planTop(): number | null {
    const tabs = document.querySelector(".pz-tabs");
    return tabs ? window.scrollY + tabs.getBoundingClientRect().top - headerHeight() - 10 : null;
  }

  function showPanel() {
    if (!isMobile()) return;
    setTimeout(() => {
      const panel = document.querySelector(".pz-panel");
      const tabs = document.querySelector(".pz-tabs");
      if (!panel || !tabs) return;
      const tabsTop = tabs.getBoundingClientRect().top;
      const panelTop = panel.getBoundingClientRect().top;
      const top = planTop();
      if (top !== null && (tabsTop < headerHeight() || panelTop > window.innerHeight * 0.62)) window.scrollTo({ top, behavior: "smooth" });
    }, 30);
  }

  async function doSubmit() {
    if (!validEmail(email)) {
      setErr(l.page.join.hoppaEzAzE);
      return;
    }
    if (sending.current) return;
    sending.current = true;
    const result = await joinWaitlist({
      email,
      species: pet === "none" ? "" : pet,
      petName,
      packageCode: interest === "unsure" ? "" : interest,
    });
    sending.current = false;
    if (!result.ok) {
      setErr(result.message);
      return;
    }
    signupToken.current = result.token;
    setErr(null);
    setSent(true);
    launch();
  }

  function sendClinic() {
    const name = clinic.trim();
    if (!name) {
      document.getElementById("clinic")?.focus();
      return;
    }
    setClinicSent(true);
    void suggestClinic({ clinicName: name, token: signupToken.current });
  }

  const motion = true;
  const dog = priceSpecies === "dog";
  const name = petName.trim();
  const interestName = interest === "unsure" ? "" : l.plans[interest].name;
  const countProgress = count ?? (countArmed && motion ? 0 : 1);
  const rv = Object.fromEntries(REVEAL.map((key) => [key, armed && motion && !seen[key] ? "" : "in"])) as Record<(typeof REVEAL)[number], string>;

  const plans = PLAN_ORDER.map((code, idx) => {
    const copy = l.plans[code];
    const style = PLAN_STYLE[code];
    const featured = !!style.featured;
    const nextCode = PLAN_ORDER[(idx + 1) % PLAN_ORDER.length];
    const num = String(idx + 1).padStart(2, "0");
    return {
      name: copy.name,
      desc: copy.desc,
      stage: copy.stage,
      dog: art(style.dog),
      cat: art(style.cat),
      dogAlt: copy.dogAlt,
      catAlt: copy.catAlt,
      avBg: style.avBg,
      items: dog ? copy.dog : copy.cat,
      featured,
      isDog: dog,
      isCat: !dog,
      bg: featured ? INK : "#FFFFFF",
      fg: featured ? "#FFFFFF" : INK,
      border: featured ? INK : "#DCC9B3",
      line: featured ? "#4A3A30" : "#D9C6B0",
      check: featured ? "#C5D4BF" : "#A68563",
      stageBg: featured ? "rgba(197, 212, 191, 0.16)" : "#F4EBE2",
      stageFg: featured ? "#C5D4BF" : "#7D572E",
      btnBg: featured ? "#C5D4BF" : INK,
      btnFg: featured ? INK : "#FFFFFF",
      pick: () => setInterest(code),
      code: num,
      on: plan === code,
      select: (event: React.MouseEvent<HTMLElement>) => {
        setPlan(code);
        const el = event.currentTarget;
        const seg = el.closest(".pz-seg");
        centerInRow(el, seg && seg.scrollWidth > seg.clientWidth + 4 ? seg : el.closest(".pz-scroll"));
        showPanel();
      },
      species: dog ? l.species.dog : l.species.cat,
      glow: style.glow,
      top: false,
      cls: plan === code ? "on" : "",
      num,
      sub: copy.sub,
      hl: style.highlights.map((text, k) => ({ t: text, cls: `h${k + 1}` })),
      tag: `#MK-${num}`,
      nextLabel: l.next(l.plans[nextCode].name),
      nextName: l.plans[nextCode].name,
      goNext: () => {
        setPlan(nextCode);
        const tabs = document.querySelectorAll(".pz-tabs .pz-opt");
        centerInRow(tabs[(idx + 1) % PLAN_ORDER.length], document.querySelector(".pz-seg"));
        showPanel();
      },
      meters: l.meters.map((label, k) => {
        const value = style.meter[k];
        return { label, segs: Array.from({ length: 5 }, (_, z) => (z < value ? "f" : "")), aria: l.meterAria(label, value) };
      }),
    };
  });

  const interestOpts = (["unsure", ...PLAN_ORDER] as Interest[]).map((key) => {
    const on = interest === key;
    const unsure = key === "unsure";
    return {
      label: unsure ? l.interest.unsure : l.plans[key].name,
      price: unsure ? "" : "soon",
      sub: unsure ? l.interest.help : l.interest.soon,
      on,
      bg: on ? INK : "#FFFFFF",
      fg: on ? "#FFFFFF" : INK,
      border: on ? INK : "#E6D9CB",
      pick: () => setInterest(key),
    };
  });

  const pets = (["dog", "cat", "both"] as const).map((key) => {
    const on = pet === key;
    return {
      label: l.pets[key],
      on,
      cls: on ? "on" : "",
      bg: on ? "#FFFFFF" : "transparent",
      fg: on ? INK : "#7A6656",
      border: "transparent",
      shadow: on ? "0 1px 3px rgba(46,31,22,.16), 0 0 0 1px rgba(46,31,22,.04)" : "none",
      pick: () => {
        setPet(on ? "none" : key);
        if (!on && formStepRef.current === 1) {
          setTimeout(() => {
            if (formStepRef.current !== 1) return;
            setFormStep(2);
            focusLater("pet-name");
          }, 320);
        }
      },
    };
  });

  const faqs = l.faq.map((item, i) => {
    const open = faq === i;
    return {
      q: item.q,
      a: item.a,
      open,
      rows: open ? "1fr" : "0fr",
      rot: open ? "45deg" : "0deg",
      icon: open ? "#C5D4BF" : "#F4EBE2",
      border: open ? "#B5C7AE" : "#DCC9B3",
      toggle: () => setFaq(open ? -1 : i),
    };
  });

  const blockEnter = (event: React.KeyboardEvent) => event.key === "Enter" && (event.preventDefault(), true);

  return {
    accent: "#7E9B7A",
    hf: HEADING,
    theme: { bg: "#FBF7F2", bg2: "#E6D4C2", hdr: "rgba(251, 247, 242, 0.92)", blob: "#E6D4C2" },
    rootCls: armed && motion ? "armed" : "",
    rv,
    trail: trail.map((step) => ({ a: step.g > 0 && step.g % 2 === 1, b: step.g > 0 && step.g % 2 === 0, x: step.x, y: step.y, r: step.r })),
    stat500: Math.round(600 * countProgress),
    stat53: Math.round(400 * countProgress),
    kxCls: cardGo || count !== null || !countArmed || !motion ? "go" : "",
    fetchA: fetchN > 0 && fetchN % 2 === 1,
    fetchB: fetchN > 0 && fetchN % 2 === 0,
    compare: l.compare.map((row, k) => ({ ...row, row: String(k + 2), n: `0${k + 1}` })),
    ps: { dogBg: dog ? INK : "transparent", dogFg: dog ? "#FFFFFF" : INK, catBg: !dog ? INK : "transparent", catFg: !dog ? "#FFFFFF" : INK },
    pIsDog: dog,
    pIsCat: !dog,
    plans,
    priceNote: (dog ? "" : l.priceNote.cat) + l.priceNote.all,
    priceDog: () => setPriceSpecies("dog"),
    priceCat: () => setPriceSpecies("cat"),
    planT: `translateX(calc((100% + 8px) * ${Math.max(0, PLAN_ORDER.indexOf(plan))}))`,
    toPlans: () => {
      const top = planTop();
      if (top !== null) window.scrollTo({ top, behavior: "smooth" });
    },
    stDots: [0, 1, 2].map((i) => ({ cls: stepIndex === i ? "on" : "", cur: stepIndex === i ? ("step" as const) : ("false" as const), label: l.step(i + 1), go: () => goStep(i) })),
    stPrev: () => goStep((stepIndex + 2) % 3),
    stNext: () => goStep((stepIndex + 1) % 3),
    stNavCls: stepAuto ? "auto" : "",
    faqs,
    pets,
    petNone: pet === "none",
    petGrpCls: pet === "none" ? "need" : "",
    petName,
    email,
    err: err !== null,
    errText: err ?? "",
    interestOpts,
    fs: { d: formStep === 0 ? "on" : "", a: formStep === 1 ? "on" : "", b: formStep === 2 ? "on" : "", c: formStep === 3 ? "on" : "" },
    fsN: formStep + 1,
    fsSegs: [0, 1, 2, 3].map((i) => (i <= formStep ? "f" : "")),
    fsBackCls: formStep === 0 ? "off" : "",
    fsBack: () => {
      setFormStep(Math.max(0, formStep - 1));
      setErr(null);
    },
    fsNext: () => setFormStep(3),
    fsNextLabel: name ? l.nameNext.filled : l.nameNext.empty,
    nameKey: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!blockEnter(event)) return;
      setFormStep(3);
      event.currentTarget.blur();
    },
    emailKey: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!blockEnter(event)) return;
      if (isMobile() && formStep === 0) {
        if (!validEmail(email)) return setErr(l.page.join.hoppaEzAzE);
        setErr(null);
        setFormStep(1);
        event.currentTarget.blur();
        return;
      }
      void doSubmit();
    },
    submit: (event?: React.SyntheticEvent) => {
      event?.preventDefault();
      if (isMobile() && formStep === 0) {
        if (!validEmail(email)) return setErr(l.page.join.hoppaEzAzE);
        setErr(null);
        setFormStep(1);
        return;
      }
      void doSubmit();
    },
    finalSubmit: (event?: React.SyntheticEvent) => {
      event?.preventDefault();
      if (!validEmail(email)) {
        setErr(l.page.join.hoppaEzAzE);
        setFormStep(0);
        return;
      }
      void doSubmit();
    },
    onName: (event: React.ChangeEvent<HTMLInputElement>) => setPetName(event.target.value.slice(0, 20)),
    onEmail: (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      setErr(null);
    },
    focusName: () => {},
    focusEmail: () => {},
    onBlur: () => {},
    sent,
    notSent: !sent,
    successTitle: l.success.title(name),
    successPlan: (interestName ? l.success.plan(interestName) : "") + l.success.confirm,
    ctaTitle: sent ? l.end.title.after : l.end.title.before,
    ctaTitle2: sent ? "" : l.end.title2,
    ctaText: sent ? l.end.text.after : l.end.text.before,
    ctaBtn: sent ? l.end.button.after : l.end.button.before,
    clinic,
    clinicSent,
    clinicOpen: !clinicSent,
    clinicName: clinic.trim(),
    onClinic: (event: React.ChangeEvent<HTMLInputElement>) => setClinic(event.target.value.slice(0, 80)),
    sendClinic,
    clinicKey: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (blockEnter(event) && clinic.trim()) sendClinic();
    },
    burstA: burst > 0 && burst % 2 === 1,
    burstB: burst > 0 && burst % 2 === 0,
    particles,
    celebrate: () => {
      setFetchN((n) => n + 1);
      launch();
      if (fetchTimer.current) clearTimeout(fetchTimer.current);
      fetchTimer.current = setTimeout(() => setFetchN(0), 3600);
    },
    onMove: (event: React.PointerEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const { clientX: cx, clientY: cy } = event;
      lastPoint.current = { x: cx, y: cy };
      const x = Math.max(-1, Math.min(1, (cx / window.innerWidth) * 2 - 1));
      const y = Math.max(-1, Math.min(1, (cy / window.innerHeight) * 2 - 1));
      if (!raf.current) {
        raf.current = requestAnimationFrame(() => {
          raf.current = null;
          el.style.setProperty("--px", x.toFixed(3));
          el.style.setProperty("--py", y.toFixed(3));
        });
      }
      if (event.pointerType === "touch" || reducedMotion()) return;
      const state = paw.current;
      const hero = document.getElementById("top")?.getBoundingClientRect();
      if (hero && (cy < hero.top || cy > hero.bottom)) {
        state.last = null;
        return;
      }
      if (!state.last) {
        state.last = { x: cx, y: cy };
        return;
      }
      const dx = cx - state.last.x;
      const dy = cy - state.last.y;
      if (Math.hypot(dx, dy) < 48) return;
      state.last = { x: cx, y: cy };
      const angle = Math.atan2(dy, dx);
      state.side *= -1;
      state.slot = (state.slot + 1) % EMPTY_TRAIL.length;
      const { slot, side } = state;
      setTrail((current) =>
        current.map((step, i) =>
          i === slot
            ? {
                g: step.g + 1,
                x: `${(cx - Math.sin(angle) * 10 * side).toFixed(0)}px`,
                y: `${(cy + Math.cos(angle) * 10 * side).toFixed(0)}px`,
                r: `${((angle * 180) / Math.PI + 90).toFixed(0)}deg`,
              }
            : step,
        ),
      );
    },
  };
}

export type LandingModel = ReturnType<typeof useLandingModel>;

export function Landing() {
  return <LandingView v={useLandingModel()} />;
}
