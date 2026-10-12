# react-liquid-fill

Pour colour into icons, buttons and text. `react-liquid-fill` stacks two versions of anything and reveals the top one with an animated liquid edge, on hover, focus, scroll, or your own trigger.

- One component, one hook, one pure function
- Works with any icon set, image, SVG, text or element
- No dependencies, no stylesheet, no provider
- React 18+, SSR-safe (Next.js App and Pages Router)
- Keyboard focus, reduced motion and touch handled

## Installation

```bash
npm install react-liquid-fill
# or
pnpm add react-liquid-fill
yarn add react-liquid-fill
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

## With any icon set

You need two renderings of the same thing: a quiet `base` and a coloured `fill`.

```tsx
// SVG icon components (react-icons, Simple Icons, MUI icons)
<LiquidFill base={<SiReact size={48} color="#c9c9c4" />} fill={<SiReact size={48} color="#149ECA" />} />

// Stroke icon sets (Lucide, Heroicons, Phosphor)
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
<LiquidFill trigger="inView" inView={{ delay: 70, once: true }} base={…} fill={…} />   // fill on scroll
<LiquidFill as="button" touch="tap-toggle" base={…} fill={…} />                        // tap on touch screens
```

## The hook

```tsx
import { useLiquidFill } from "react-liquid-fill";

function NavLink({ href, children }) {
  const liquid = useLiquidFill();
  return (
    <a href={href} ref={liquid.ref} {...liquid.bind} className="stack">
      <span>{children}</span>
      <span className="inverted" style={{ clipPath: "var(--liquid-clip, inset(0 100% 0 0))" }}>{children}</span>
    </a>
  );
}
```

The hook animates the `--liquid-clip` custom property on the element; whatever you clip with it is revealed. Call `liquid.setProgress(0..1)` to drive it yourself, e.g. from scroll position.

## API

### `<LiquidFill />`

| Prop | Type | Default | |
| --- | --- | --- | --- |
| `base` | `ReactNode` | | Always visible. |
| `fill` | `ReactNode` | | Revealed by the liquid (rendered `aria-hidden`). |
| `children` | `ReactNode` | | Rendered after the layers, inside the hover area. |
| `as` | `ElementType` | `"span"` | Element to render as. |
| `layersClassName` | `string` | | Class for the element that stacks the layers. |
| …all hook options | | | See below. |
| …HTML attributes | | | Passed to the root; your handlers run alongside the library's. |

### `useLiquidFill(options)`

| Option | Type | Default |
| --- | --- | --- |
| `trigger` | `"hover" \| "focus" \| "inView" \| "manual"` or an array | `["hover", "focus"]` |
| `direction` | `"auto" \| "up" \| "down" \| "left" \| "right" \| { x, y }` | `"auto"` |
| `duration` | `number \| { in, out }` | `{ in: 460, out: 340 }` |
| `easing` | `(t) => number` | easeOutCubic |
| `wave` | `{ amplitude, ripple, segments } \| false` | `{ 0.3, 21, 21 }` |
| `cssVar` | `string` | `"--liquid-clip"` |
| `inView` | `{ threshold, rootMargin, once, delay }` | `{ 0.6, "0px 0px -8% 0px", false, 0 }` |
| `touch` | `"ignore" \| "tap-toggle"` | `"ignore"` |
| `reducedMotion` | `"respect" \| "ignore"` | `"respect"` |
| `disabled` | `boolean` | `false` |
| `initial` | `0 \| 1` | `0` |
| `measureRef` | `RefObject<Element>` | host element |
| `ref` | `Ref<T>` | |
| `onProgress`, `onFilled`, `onDrained` | callbacks | |

**Returns** `ref`, `bind`, `fill(direction?)`, `drain()`, `toggle()`, `setProgress(p, direction?)`, `getProgress()`, `filled`.

### `liquidPolygon(input)`

Pure function: `{ progress, direction, width, height, time?, wave? }` → a CSS `polygon()` string for `clip-path`.

### Attributes and CSS

- `data-filled` on the `LiquidFill` root while full
- `data-liquid-layer="base" | "fill"` on the two layer wrappers
- `--liquid-clip` on the host element

## This repository

This Next.js app is the documentation site and demo. The library source is `lib/liquid/`.

```bash
npm install
npm run dev          # docs at http://localhost:3000
npm run icons        # rebuild the demo logos (Devicon originals → outline + filled)
```

| Path | |
| --- | --- |
| `lib/liquid/` | The library source: `LiquidFill`, `useLiquidFill`, `liquidPolygon` |
| `packages/react-liquid-fill/` | The npm package: builds `lib/liquid/` into `dist/` |
| `app/page.tsx` | Landing page (`/`) |
| `app/docs/page.tsx`, `components/docs/`, `docs/` | Documentation site (`/docs`) |
| `components/TechnologyIcon.tsx`, `TechnologyMarquee.tsx`, `Demos.tsx` | Demo components |
| `scripts/build-icons.mjs`, `data/technologies.json`, `public/technology/` | Demo logo pipeline |

## Deploying the site

Set `NEXT_PUBLIC_SITE_URL` to your domain (e.g. `https://react-liquid-fill.dev`). Canonical URLs, the sitemap, `robots.txt`, social cards and structured data are all built from it.

Both pages are **static**: rendered once at build time and served from the CDN, with no server work per visit. The only value that can change without a deploy is the published npm version, so each page is regenerated at most **once a day** (ISR, `revalidate = 86400`) and reads the latest version from the npm registry, falling back to `SITE.version` in `lib/site.ts`. A full redeploy isn't needed after `npm publish`.

SEO files live in `app/`: `icon.svg` and `favicon.ico` (favicons), `apple-icon.tsx`, `manifest.ts`, `opengraph-image.tsx` (home) and `docs/opengraph-image.tsx` (docs), `sitemap.ts` and `robots.ts`. Images generated with `next/og` need `display: flex` on any `<div>` with more than one child.

## Publishing to npm

The package lives in `packages/react-liquid-fill/` and builds from `lib/liquid/`, so the site and the package always share the same code. Publishing to npm also makes it installable with yarn and pnpm, which use the same registry.

```bash
cd packages/react-liquid-fill
npm install            # build tools only; nothing is added to the published package
npm run build          # dist/: ESM, CommonJS and types
npm pack --dry-run     # check the file list (13 files, ~10 kB)

npm login              # once per machine
npm publish            # runs the build again first
```

For a new version, bump it with `npm version patch` (or `minor` / `major`) in that folder, then `npm publish`. Update `SITE.version` in `lib/site.ts` to match.

## License

MIT. Demo logos from [Devicon](https://devicon.dev) (MIT) and [Simple Icons](https://simpleicons.org) (CC0).
