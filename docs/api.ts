/** Content for the API reference tables on the docs page. */

export type PropRow = { name: string; type: string; default?: string; description: string };

export const PACKAGE = "react-liquid-fill";
export const VERSION = "0.1.0";

export const liquidFillProps: PropRow[] = [
  { name: "base", type: "ReactNode", description: "Always visible. Usually the outline, monochrome or inactive version." },
  { name: "fill", type: "ReactNode", description: "Revealed by the liquid. Usually the coloured or active version. Rendered with aria-hidden." },
  { name: "children", type: "ReactNode", description: "Rendered after the two stacked layers, inside the hover area. Use it for a caption." },
  { name: "as", type: "ElementType", default: '"span"', description: "Element or component to render as, e.g. \"button\", \"a\", \"li\"." },
  { name: "layersClassName", type: "string", description: "Class for the inner element that stacks base and fill." },
  { name: "…options", type: "UseLiquidFillOptions", description: "Every useLiquidFill option below (trigger, direction, duration…) is accepted as a prop." },
  { name: "…rest", type: "HTMLAttributes", description: "Any other prop (className, style, aria-*, data-*, event handlers) goes to the root element. Your handlers run alongside the library's." },
];

export const hookOptions: PropRow[] = [
  { name: "trigger", type: '"hover" | "focus" | "inView" | "manual" | Array', default: '["hover", "focus"]', description: 'What starts the fill. "manual" means only your own fill(), drain() or setProgress() calls.' },
  { name: "direction", type: '"auto" | "up" | "down" | "left" | "right" | { x, y }', default: '"auto"', description: "The way the liquid travels. \"auto\" pours from the side the pointer entered, and rises (\"up\") for every other trigger." },
  { name: "duration", type: "number | { in: number; out: number }", default: "{ in: 460, out: 340 }", description: "Milliseconds for a full fill and a full drain. A partial fill takes proportionally less." },
  { name: "easing", type: "(t: number) => number", default: "easeOutCubic", description: "Maps linear time (0–1) to progress (0–1)." },
  { name: "wave", type: "{ amplitude?, ripple?, segments? } | false", default: "{ amplitude: 0.3, ripple: 21, segments: 21 }", description: "Shape of the leading edge. amplitude is a fraction of the shorter side; ripple is how fast it moves; false gives a straight wipe." },
  { name: "cssVar", type: "string", default: '"--liquid-clip"', description: "The CSS custom property that gets animated. Rename it to nest fills or run two on one element." },
  { name: "inView", type: "{ threshold?, rootMargin?, once?, delay? }", default: '{ threshold: 0.6, rootMargin: "0px 0px -8% 0px", once: false, delay: 0 }', description: 'Settings for the "inView" trigger. once keeps it full after the first fill; delay (ms) is handy for staggering a grid.' },
  { name: "touch", type: '"ignore" | "tap-toggle"', default: '"ignore"', description: "Touch screens have no hover. \"tap-toggle\" fills and drains on tap." },
  { name: "reducedMotion", type: '"respect" | "ignore"', default: '"respect"', description: "With \"respect\", users who prefer reduced motion see an instant change instead of the animation." },
  { name: "disabled", type: "boolean", default: "false", description: "Drains and ignores every trigger while true." },
  { name: "initial", type: "0 | 1", default: "0", description: "Start empty or full." },
  { name: "measureRef", type: "RefObject<Element>", default: "the host element", description: "Size the wave from another element, for when the revealed layer is smaller than the host. LiquidFill sets this for you." },
  { name: "ref", type: "Ref<T>", description: "Your own ref to the same element. The hook keeps it in sync." },
  { name: "onProgress", type: "(progress: number) => void", description: "Called every frame while animating, and on setProgress()." },
  { name: "onFilled", type: "() => void", description: "Called when a fill completes." },
  { name: "onDrained", type: "() => void", description: "Called when a drain completes." },
];

export const hookReturns: PropRow[] = [
  { name: "ref", type: "(node: T | null) => void", description: "Attach to the host element." },
  { name: "bind", type: "{ onPointerEnter, onPointerLeave, onPointerDown, onFocus, onBlur }", description: "Event handlers for the triggers you enabled. Spread them onto the host." },
  { name: "fill", type: "(from?: direction | { clientX, clientY }) => void", description: "Pour in. Pass a direction, or a pointer position to pour from that side." },
  { name: "drain", type: "() => void", description: "Pour out." },
  { name: "toggle", type: "() => void", description: "Fill if less than half full, otherwise drain." },
  { name: "setProgress", type: "(progress: number, direction?) => void", description: "Jump to a progress between 0 and 1 with no animation. Use it to scrub the fill with scroll or a slider." },
  { name: "getProgress", type: "() => number", description: "Current progress, read without re-rendering." },
  { name: "filled", type: "boolean", description: "true after a fill completes, false after a drain completes. Re-renders only when an animation settles." },
];

export const polygonInput: PropRow[] = [
  { name: "progress", type: "number", description: "0 is empty, 1 is full." },
  { name: "direction", type: "{ x: number; y: number }", description: "Unit vector of travel. { x: 0, y: -1 } rises from the bottom." },
  { name: "width, height", type: "number", description: "Size of the box in pixels; used to keep the wave in proportion." },
  { name: "time", type: "number", default: "0", description: "Seconds since the animation began; drives the ripple." },
  { name: "wave", type: "WaveOptions | false", default: "{}", description: "Same as the hook's wave option." },
];

export const dataAttributes: PropRow[] = [
  { name: "data-filled", type: "boolean attribute", description: "Set on the LiquidFill root while it is full. Style captions or borders with [data-filled]." },
  { name: 'data-liquid-layer="base"', type: "attribute", description: "The base layer wrapper." },
  { name: 'data-liquid-layer="fill"', type: "attribute", description: "The fill layer wrapper. It carries the clip-path." },
  { name: "--liquid-clip", type: "CSS custom property", description: "Written on the host element every frame. Clip anything with clip-path: var(--liquid-clip, inset(0 100% 0 0))." },
];
