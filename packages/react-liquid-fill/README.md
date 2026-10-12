# react-liquid-fill

**[Website, live demos and docs →](https://react-liquid-fill.com)**

Pour colour into icons, buttons and text. `react-liquid-fill` stacks two versions of anything and reveals the top one with an animated liquid edge, on hover, focus, scroll, or your own trigger.

- One component, one hook, one pure function
- Works with any icon set, image, SVG, text or element
- About 2.7 kB minified and gzipped, no dependencies, no stylesheet
- React 18+, ESM and CommonJS, fully typed
- Ready for Next.js (ships with `"use client"`)
- Keyboard focus, reduced motion and touch handled

## Install

```bash
npm install react-liquid-fill
# or
yarn add react-liquid-fill
# or
pnpm add react-liquid-fill
```

## Quick start

```tsx
import { LiquidFill } from "react-liquid-fill";

<LiquidFill
  base={<img src="/logo-outline.svg" alt="" width={48} height={48} />}
  fill={<img src="/logo.svg" alt="" width={48} height={48} />}
  role="img"
  aria-label="Acme"
/>
```

`base` is always visible. `fill` is poured over it from the side the pointer enters, and drains when it leaves.

## With any icon set

You need two renderings of the same thing: a quiet `base` and a coloured `fill`.

```tsx
// SVG icon components (react-icons, Simple Icons, MUI icons)
import { SiReact } from "react-icons/si";

<LiquidFill base={<SiReact size={48} color="#c9c9c4" />} fill={<SiReact size={48} color="#149ECA" />} />

// Stroke icon sets (Lucide, Heroicons, Phosphor)
import { Heart } from "lucide-react";

<LiquidFill
  direction="up"
  base={<Heart size={48} color="#9a9a93" />}
  fill={<Heart size={48} color="#e5484d" fill="#e5484d" />}
/>

// Emoji or text
<LiquidFill
  base={<span style={{ filter: "grayscale(1)", opacity: 0.4 }}>🔥</span>}
  fill={<span>🔥</span>}
/>
```

## Triggers

```tsx
// Fill as it scrolls into view; stagger a grid with delay
<LiquidFill trigger="inView" inView={{ delay: 70, once: true }} base={…} fill={…} />

// A button that also toggles on tap
<LiquidFill as="button" type="button" touch="tap-toggle" base={…} fill={…} />
```

## The hook

When you need your own markup, use `useLiquidFill`. It animates a CSS custom property, `--liquid-clip`, on the element; clip whatever should be revealed with it.

```tsx
import { useLiquidFill } from "react-liquid-fill";

function NavLink({ href, children }) {
  const liquid = useLiquidFill(); // hover + keyboard focus

  return (
    <a href={href} ref={liquid.ref} {...liquid.bind} className="stack">
      <span>{children}</span>
      <span className="inverted" style={{ clipPath: "var(--liquid-clip, inset(0 100% 0 0))" }}>
        {children}
      </span>
    </a>
  );
}
```

Drive it yourself with `liquid.fill()`, `liquid.drain()`, `liquid.toggle()`, or `liquid.setProgress(0..1)` to tie it to scroll position.

## API

### `<LiquidFill />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `base` | `ReactNode` | | Always visible. |
| `fill` | `ReactNode` | | Revealed by the liquid. Rendered `aria-hidden`. |
| `children` | `ReactNode` | | Rendered after the layers, inside the hover area (e.g. a caption). |
| `as` | `ElementType` | `"span"` | Element to render as. |
| `layersClassName` | `string` | | Class for the element that stacks the two layers. |
| …hook options | | | Every `useLiquidFill` option below. |
| …HTML attributes | | | Passed to the root. Your event handlers run alongside the library's. |

### `useLiquidFill(options)`

| Option | Type | Default |
| --- | --- | --- |
| `trigger` | `"hover" \| "focus" \| "inView" \| "manual"`, or an array | `["hover", "focus"]` |
| `direction` | `"auto" \| "up" \| "down" \| "left" \| "right" \| { x, y }` | `"auto"` |
| `duration` | `number \| { in, out }` (ms) | `{ in: 460, out: 340 }` |
| `easing` | `(t: number) => number` | easeOutCubic |
| `wave` | `{ amplitude?, ripple?, segments? } \| false` | `{ amplitude: 0.3, ripple: 21, segments: 21 }` |
| `cssVar` | `string` | `"--liquid-clip"` |
| `inView` | `{ threshold?, rootMargin?, once?, delay? }` | `{ threshold: 0.6, rootMargin: "0px 0px -8% 0px", once: false, delay: 0 }` |
| `touch` | `"ignore" \| "tap-toggle"` | `"ignore"` |
| `reducedMotion` | `"respect" \| "ignore"` | `"respect"` |
| `disabled` | `boolean` | `false` |
| `initial` | `0 \| 1` | `0` |
| `measureRef` | `RefObject<Element>` | the host element |
| `ref` | `Ref<T>` | |
| `onProgress` | `(progress: number) => void` | |
| `onFilled`, `onDrained` | `() => void` | |

**Returns:** `ref`, `bind`, `fill(direction?)`, `drain()`, `toggle()`, `setProgress(progress, direction?)`, `getProgress()`, `filled`.

### `liquidPolygon(input)`

The geometry with no React: `{ progress, direction, width, height, time?, wave? }` returns a CSS `polygon()` string for `clip-path` (or `inset()` at 0 and 1).

### Attributes and CSS

| | |
| --- | --- |
| `data-filled` | On the `LiquidFill` root while it is full. |
| `data-liquid-layer="base"` / `"fill"` | On the two layer wrappers. |
| `--liquid-clip` | Written on the host element every frame. |

## Accessibility

- The fill layer is `aria-hidden`, so content is announced once.
- Keyboard focus triggers the fill by default. Add `tabIndex={0}` to non-interactive elements you want reachable.
- Users who prefer reduced motion get an instant change. Opt out with `reducedMotion="ignore"`.
- Touch screens have no hover; set `touch="tap-toggle"` to fill on tap.

## License

MIT © Sashank Deb
