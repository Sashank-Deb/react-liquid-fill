"use client";

import { useEffect, useRef } from "react";
import { LiquidFill, useLiquidFill } from "@/lib/liquid";

/** The wrapper on a button: the fill layer is an inverted copy of the label. */
export function LiquidButton({ children }: { children: string }) {
  return (
    <LiquidFill
      as="button"
      type="button"
      className="liquid-button"
      touch="tap-toggle"
      base={<span className="liquid-button-face">{children}</span>}
      fill={<span className="liquid-button-face is-ink">{children}</span>}
    />
  );
}

/** The hook used directly, with no triggers: progress is driven by scroll position via setProgress(). */
export function ScrubbedHeading({ children }: { children: string }) {
  const heading = useRef<HTMLHeadingElement>(null); // our own ref, kept in sync by the hook
  const liquid = useLiquidFill<HTMLHeadingElement>({
    ref: heading,
    trigger: "manual",
    direction: "right",
    wave: { amplitude: 0.35, ripple: 0 },
  });
  const { setProgress } = liquid;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = heading.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // empty when the heading's top is at 85% of the viewport, full by 35%
      setProgress((vh * 0.85 - r.top) / (vh * 0.5));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [setProgress]);

  return (
    <h2 ref={liquid.ref} className="scrub-heading">
      <span className="scrub-base">{children}</span>
      <span className="scrub-ink" aria-hidden="true">
        {children}
      </span>
    </h2>
  );
}
