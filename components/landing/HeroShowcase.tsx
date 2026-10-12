"use client";

import { useEffect, useRef, useState } from "react";
import { useLiquidFill } from "@/lib/liquid";
import { iconSrc, technologies } from "@/lib/technologies";

const PICKS = ["typescript", "react", "python", "nextjs", "vitejs", "docker", "postgresql", "tailwindcss", "rust"];
const COLS = 3;
const tiles = PICKS.map((slug) => technologies.find((t) => t.slug === slug)!).filter(Boolean);
// diagonal order: top-left first, bottom-right last
const waveOrder = tiles.map((_, i) => i).sort((a, b) => (a % COLS) + Math.floor(a / COLS) - ((b % COLS) + Math.floor(b / COLS)));

function Tile({ name, slug, darkInvert, active }: { name: string; slug: string; darkInvert?: boolean; active: boolean }) {
  const art = useRef<HTMLSpanElement>(null); // size the wave from the artwork, not the whole tile
  const liquid = useLiquidFill<HTMLDivElement>({ trigger: ["hover", "focus", "manual"], duration: { in: 620, out: 420 }, measureRef: art });
  const { fill, drain } = liquid;

  useEffect(() => {
    if (active) fill("up");
    else drain();
  }, [active, fill, drain]);

  return (
    <div ref={liquid.ref} {...liquid.bind} className="lp-tile" role="img" aria-label={name} tabIndex={0} data-dark-invert={darkInvert || undefined}>
      <span ref={art} className="lp-tile-art">
        <img src={iconSrc("outline", slug)} alt="" width={52} height={52} data-liquid-layer="base" />
        <img src={iconSrc("filled", slug)} alt="" width={52} height={52} data-liquid-layer="fill" className="lp-tile-ink" />
      </span>
      <span className="lp-tile-name">{name}</span>
    </div>
  );
}

/** A grid of logos that pour in and drain in a diagonal wave, and still respond to hover. */
export function HeroShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(new Set(waveOrder)); // show the finished state, no loop
      return;
    }

    let timers: ReturnType<typeof setTimeout>[] = [];
    let running = false;
    let paused = false;
    let visible = true;
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const cycle = () => {
      if (!visible || paused || document.hidden) {
        running = false;
        return;
      }
      running = true;
      const step = 140;
      waveOrder.forEach((idx, k) => timers.push(setTimeout(() => setLit((s) => new Set(s).add(idx)), k * step)));
      const full = waveOrder.length * step + 1500;
      waveOrder.forEach((idx, k) =>
        timers.push(
          setTimeout(() => setLit((s) => {
            const n = new Set(s);
            n.delete(idx);
            return n;
          }), full + k * step),
        ),
      );
      timers.push(setTimeout(cycle, full + waveOrder.length * step + 900));
    };
    const resume = () => {
      if (!running && visible && !paused && !document.hidden) cycle();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) clear(), (running = false);
      else resume();
    });
    io.observe(el);
    const onEnter = () => {
      paused = true;
      clear();
      running = false;
      setLit(new Set());
    };
    const onLeave = () => {
      paused = false;
      timers.push(setTimeout(resume, 600));
    };
    const onVis = () => (document.hidden ? (clear(), (running = false)) : resume());
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    timers.push(setTimeout(resume, 500));

    return () => {
      clear();
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={root} className="lp-showcase">
      <div className="lp-showcase-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <code>&lt;LiquidFill trigger=&quot;hover&quot; /&gt;</code>
      </div>
      <div className="lp-showcase-grid">
        {tiles.map((t, i) => (
          <Tile key={t.slug} name={t.name} slug={t.slug} darkInvert={t.darkInvert} active={lit.has(i)} />
        ))}
      </div>
      <p className="lp-showcase-hint">Hover any logo</p>
    </div>
  );
}
