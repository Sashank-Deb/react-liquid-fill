"use client";

/**
 * useLiquidFill — a drop-in "liquid pour" reveal for any element.
 *
 * How it works: the hook animates a CSS custom property (default `--liquid-clip`) on the element it is
 * attached to. Anything inside that element styled with
 *
 *     clip-path: var(--liquid-clip, inset(0 100% 0 0));
 *
 * starts hidden and is revealed by a polygon whose leading edge is a moving wave. What gets revealed is
 * up to you: a coloured logo over an outline, an inverted button label, an image over its sketch.
 *
 *     const liquid = useLiquidFill();                       // hover + keyboard focus
 *     <a ref={liquid.ref} {...liquid.bind}>
 *       <span>Label</span>
 *       <span style={{ clipPath: "var(--liquid-clip, inset(0 100% 0 0))" }}>Label</span>
 *     </a>
 *
 * No dependencies. Safe to import in Next.js server components' children (it only touches the DOM in
 * effects and event handlers).
 */

import { useCallback, useEffect, useMemo, useRef, useState, type Ref, type RefObject } from "react";
import { CLIP_EMPTY, CLIP_FULL, liquidPolygon, type Vector, type WaveOptions } from "./liquidPolygon";

export type LiquidTrigger = "hover" | "focus" | "inView" | "manual";

/** The direction the liquid travels. "up" rises from the bottom; "auto" pours from the pointer's side on hover. */
export type LiquidDirection = "auto" | "up" | "down" | "left" | "right" | Vector;

export type UseLiquidFillOptions<T extends HTMLElement = HTMLElement> = {
  /** What starts the fill. Default ["hover", "focus"]. "manual" means only your own fill()/drain() calls. */
  trigger?: LiquidTrigger | LiquidTrigger[];
  /** Default "auto": from the pointer on hover, rising ("up") for focus, inView and manual calls. */
  direction?: LiquidDirection;
  /** Milliseconds for a full fill and a full drain. A number sets both. Default { in: 460, out: 340 }. */
  duration?: number | { in: number; out: number };
  /** Maps linear time 0..1 to progress 0..1. Default easeOutCubic. */
  easing?: (t: number) => number;
  /** Wave shape, or false for a straight wipe. */
  wave?: WaveOptions | false;
  /** CSS custom property to animate. Change it to nest fills or run several on one element. Default "--liquid-clip". */
  cssVar?: string;
  /** Settings for the "inView" trigger. */
  inView?: { threshold?: number; rootMargin?: string; once?: boolean; delay?: number };
  /** Touch devices have no hover. "tap-toggle" fills/drains on tap; "ignore" (default) does nothing. */
  touch?: "ignore" | "tap-toggle";
  /** "respect" (default) jumps straight to full/empty when the user prefers reduced motion. */
  reducedMotion?: "respect" | "ignore";
  /** Drains and ignores all triggers while true. */
  disabled?: boolean;
  /** Start full (1) or empty (0). Default 0. */
  initial?: 0 | 1;
  /** Measure this element instead of the host when sizing the wave (use when the revealed layer is smaller than the host). */
  measureRef?: RefObject<Element | null>;
  /** Your own ref to the same element; it is kept in sync. */
  ref?: Ref<T>;
  onProgress?: (progress: number) => void;
  onFilled?: () => void;
  onDrained?: () => void;
};

export type LiquidFill<T extends HTMLElement = HTMLElement> = {
  /** Attach to the host element. */
  ref: (node: T | null) => void;
  /** Event handlers for the hover / focus / touch triggers you enabled. Spread onto the host. */
  bind: {
    onPointerEnter?: (e: React.PointerEvent) => void;
    onPointerLeave?: (e: React.PointerEvent) => void;
    onPointerDown?: (e: React.PointerEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
  };
  /** Pour in. Pass a direction, or a pointer position to pour from that side. */
  fill: (from?: LiquidDirection | { clientX: number; clientY: number }) => void;
  drain: () => void;
  toggle: () => void;
  /** Jump to a progress (0..1) with no animation, e.g. to scrub the fill with scroll position. */
  setProgress: (progress: number, direction?: LiquidDirection) => void;
  getProgress: () => number;
  /** true once fully filled, false once fully drained (updates only when an animation settles). */
  filled: boolean;
};

const DIRECTIONS: Record<Exclude<LiquidDirection, "auto" | Vector>, Vector> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function resolveDirection(d: LiquidDirection | undefined): Vector {
  if (!d || d === "auto") return DIRECTIONS.up;
  return typeof d === "string" ? DIRECTIONS[d] : d;
}

type Point = { clientX: number; clientY: number };
function isPoint(v: unknown): v is Point {
  return typeof v === "object" && v !== null && "clientX" in v && "clientY" in v;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
}

export function useLiquidFill<T extends HTMLElement = HTMLElement>(options: UseLiquidFillOptions<T> = {}): LiquidFill<T> {
  // Latest options without re-creating handlers on every render
  const opts = useRef(options);
  opts.current = options;

  const [node, setNode] = useState<T | null>(null);
  const [filled, setFilled] = useState(options.initial === 1);
  const progress = useRef(options.initial === 1 ? 1 : 0);
  const direction = useRef<Vector>(DIRECTIONS.up);
  const raf = useRef(0);
  const nodeRef = useRef<T | null>(null);

  // Keyed by value so an inline array (trigger={["hover", "inView"]}) doesn't re-subscribe every render
  const triggerKey = ([] as LiquidTrigger[]).concat(options.trigger ?? ["hover", "focus"]).join(",");
  const triggers = useMemo(() => new Set(triggerKey.split(",") as LiquidTrigger[]), [triggerKey]);

  const ref = useCallback((el: T | null) => {
    nodeRef.current = el;
    setNode(el);
    assignRef(opts.current.ref, el);
  }, []);

  const write = (value: string) => {
    nodeRef.current?.style.setProperty(opts.current.cssVar ?? "--liquid-clip", value);
  };

  const size = () => {
    const el = opts.current.measureRef?.current ?? nodeRef.current;
    const r = el?.getBoundingClientRect();
    return { width: Math.max(1, r?.width ?? 1), height: Math.max(1, r?.height ?? 1) };
  };

  const settle = (target: 0 | 1) => {
    progress.current = target;
    write(target ? CLIP_FULL : CLIP_EMPTY);
    opts.current.onProgress?.(target);
    setFilled(target === 1);
    (target ? opts.current.onFilled : opts.current.onDrained)?.();
  };

  const animate = useCallback((target: 0 | 1, from?: LiquidDirection | { clientX: number; clientY: number }) => {
    const el = nodeRef.current;
    if (!el) return;
    const o = opts.current;
    if (o.disabled && target === 1) return;
    cancelAnimationFrame(raf.current);

    const { width, height } = size();

    // Choose a direction only when starting from (nearly) empty, so a quick re-hover doesn't flip it mid-pour
    if (target === 1 && progress.current < 0.02) {
      const configured = o.direction ?? "auto";
      if (isPoint(from)) {
        if (configured === "auto") {
          const r = el.getBoundingClientRect();
          const dx = r.left + r.width / 2 - from.clientX;
          const dy = r.top + r.height / 2 - from.clientY;
          const len = Math.hypot(dx, dy);
          direction.current = len > 0 ? { x: dx / len, y: dy / len } : DIRECTIONS.up;
        } else {
          direction.current = resolveDirection(configured);
        }
      } else {
        direction.current = resolveDirection(from ?? configured);
      }
    }

    const reduce =
      (o.reducedMotion ?? "respect") === "respect" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return settle(target);

    const durations = typeof o.duration === "number" ? { in: o.duration, out: o.duration } : o.duration ?? { in: 460, out: 340 };
    const startProgress = progress.current;
    const ms = (target ? durations.in : durations.out) * Math.max(0.2, Math.abs(target - startProgress));
    const ease = o.easing ?? easeOutCubic;
    const start = performance.now();

    const tick = (now: number) => {
      const k = ms > 0 ? Math.min(1, (now - start) / ms) : 1;
      progress.current = startProgress + (target - startProgress) * ease(k);
      if (k >= 1) return settle(target);
      write(liquidPolygon({ progress: progress.current, direction: direction.current, width, height, time: (now - start) / 1000, wave: o.wave }));
      opts.current.onProgress?.(progress.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  const fill = useCallback<LiquidFill<T>["fill"]>((from) => animate(1, from), [animate]);
  const drain = useCallback(() => animate(0), [animate]);
  const toggle = useCallback(() => animate(progress.current > 0.5 ? 0 : 1), [animate]);

  const setProgress = useCallback((p: number, dir?: LiquidDirection) => {
    cancelAnimationFrame(raf.current);
    const value = Math.min(1, Math.max(0, p));
    direction.current = resolveDirection(dir ?? opts.current.direction);
    progress.current = value;
    const { width, height } = size();
    write(liquidPolygon({ progress: value, direction: direction.current, width, height, wave: opts.current.wave }));
    opts.current.onProgress?.(value);
  }, []);

  const getProgress = useCallback(() => progress.current, []);

  // Initial state, and cleanup of any running frame
  useEffect(() => {
    if (!node) return;
    const p = progress.current; // may already be mid-way if setProgress() ran before this effect
    if (p >= 1) write(CLIP_FULL);
    else if (p <= 0) write(CLIP_EMPTY);
    else write(liquidPolygon({ progress: p, direction: direction.current, ...size(), wave: opts.current.wave }));
    return () => cancelAnimationFrame(raf.current);
  }, [node]);

  // Disabled → drain
  useEffect(() => {
    if (options.disabled && progress.current > 0) animate(0);
  }, [options.disabled, animate]);

  // "inView" trigger
  const inViewKey = JSON.stringify(options.inView ?? {});
  useEffect(() => {
    if (!node || !triggers.has("inView")) return;
    const { threshold = 0.6, rootMargin = "0px 0px -8% 0px", once = false, delay = 0 } = opts.current.inView ?? {};
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          timer = setTimeout(() => animate(1), delay);
          if (once) io.disconnect();
        } else if (!once) {
          animate(0);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(node);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [node, triggers, inViewKey, animate]);

  const bind = useMemo<LiquidFill<T>["bind"]>(() => {
    const b: LiquidFill<T>["bind"] = {};
    const isFocused = () => !!nodeRef.current?.matches(":focus-visible");
    const isHovered = () => !!nodeRef.current?.matches(":hover");

    if (triggers.has("hover")) {
      b.onPointerEnter = (e) => {
        if (e.pointerType !== "touch") animate(1, e);
      };
      b.onPointerLeave = (e) => {
        if (e.pointerType === "touch") return;
        if (triggers.has("focus") && isFocused()) return; // keyboard focus keeps it full
        animate(0);
      };
    }
    if (triggers.has("focus")) {
      b.onFocus = () => {
        if (isFocused()) animate(1);
      };
      b.onBlur = () => {
        if (triggers.has("hover") && isHovered()) return;
        animate(0);
      };
    }
    if ((opts.current.touch ?? "ignore") === "tap-toggle") {
      b.onPointerDown = (e) => {
        if (e.pointerType === "touch") animate(progress.current > 0.5 ? 0 : 1, e);
      };
    }
    return b;
  }, [triggers, animate, options.touch]);

  return { ref, bind, fill, drain, toggle, setProgress, getProgress, filled };
}
