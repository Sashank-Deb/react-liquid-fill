"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

/** true inside the visual duplicate, so children can opt out of keyboard focus (they must stay hoverable). */
const MarqueeDuplicateContext = createContext(false);
export const useIsMarqueeDuplicate = () => useContext(MarqueeDuplicateContext);

/**
 * An endlessly drifting strip.
 * - Content is rendered twice; the track wraps after exactly one group's width, so the loop is seamless.
 * - Driven by requestAnimationFrame (28px/s), eased to a stop while a mouse is over it so icons are easy to hover.
 * - Pauses when off-screen or the tab is hidden. Falls back to a CSS animation before JS loads.
 */
export function TechnologyMarquee({ children, speed = 28 }: { children: ReactNode; speed?: number }) {
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = strip.current;
    const track = root?.querySelector<HTMLElement>(".technology-track");
    const group = track?.querySelector<HTMLElement>(".technology-group");
    if (!root || !track || !group) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let groupWidth = 0;
    let offset = 0;
    let velocity = 0;
    let hovering = false;
    let visible = false;
    let raf = 0;
    let last = 0;

    const paint = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };
    const measure = () => {
      groupWidth = group.offsetWidth;
      if (groupWidth) offset %= groupWidth;
      if (!reduced.matches) paint();
    };
    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      // exponential ease toward the target speed (0 while hovering)
      velocity += ((hovering ? 0 : speed) - velocity) * (1 - Math.exp(-dt / 0.25));
      if (groupWidth) offset = (offset + velocity * dt) % groupWidth;
      paint();
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      last = 0;
      root.dataset.enhanced = "true"; // turns off the CSS fallback animation
      if (reduced.matches) track.style.removeProperty("transform");
      else if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(group);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    io.observe(root);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [speed]);

  return (
    <div ref={strip} className="technology-strip" role="group" aria-label="Technologies">
      <div className="technology-track">
        <div className="technology-group">{children}</div>
        {/* Visual duplicate: hidden from screen readers, but NOT inert. `inert` would also block the
            pointer, so these copies couldn't be hovered until the loop wrapped back to the originals. */}
        <div className="technology-group" aria-hidden="true">
          <MarqueeDuplicateContext.Provider value={true}>{children}</MarqueeDuplicateContext.Provider>
        </div>
      </div>
    </div>
  );
}
