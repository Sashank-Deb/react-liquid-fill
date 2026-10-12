/** Code samples shown on the docs page. */

export const install = {
  npm: "npm install react-liquid-fill",
  pnpm: "pnpm add react-liquid-fill",
  yarn: "yarn add react-liquid-fill",
};

export const quickStart = `import { LiquidFill } from "react-liquid-fill";

export function Logo() {
  return (
    <LiquidFill
      base={<img src="/logo-outline.svg" alt="" width={48} height={48} />}
      fill={<img src="/logo.svg" alt="" width={48} height={48} />}
      aria-label="Acme"
      role="img"
    />
  );
}`;

export const hoverDemo = `import { LiquidFill } from "react-liquid-fill";

const icons = [{ name: "TypeScript", slug: "typescript" } /* … */];

<Marquee>
  {icons.map(({ name, slug }) => (
    <LiquidFill
      key={slug}
      className="tech"
      role="img"
      aria-label={name}
      tabIndex={0}
      base={<img src={\`/icons/outline/\${slug}.svg\`} alt="" width={48} height={48} />}
      fill={<img src={\`/icons/filled/\${slug}.svg\`} alt="" width={48} height={48} />}
    >
      <span className="tech-name">{name}</span>
    </LiquidFill>
  ))}
</Marquee>`;

export const scrollDemo = `<LiquidFill
  trigger="inView"
  inView={{ delay: index * 70 }}   // stagger a grid
  base={<img src={outline} alt="" />}
  fill={<img src={filled} alt="" />}
/>`;

export const scrubDemo = `import { useEffect, useRef } from "react";
import { useLiquidFill } from "react-liquid-fill";

export function ScrubbedHeading({ children }: { children: string }) {
  const el = useRef<HTMLHeadingElement>(null);
  const liquid = useLiquidFill({ ref: el, trigger: "manual", direction: "right" });

  useEffect(() => {
    const onScroll = () => {
      const top = el.current!.getBoundingClientRect().top;
      const vh = window.innerHeight;
      liquid.setProgress((vh * 0.85 - top) / (vh * 0.5));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [liquid.setProgress]);

  return (
    <h2 ref={liquid.ref} className="stack">
      <span className="outlined">{children}</span>
      <span style={{ clipPath: "var(--liquid-clip, inset(0 100% 0 0))" }}>{children}</span>
    </h2>
  );
}`;

export const buttonDemo = `<LiquidFill
  as="button"
  type="button"
  touch="tap-toggle"
  base={<span className="btn">Get in touch ↗</span>}
  fill={<span className="btn btn-inverted">Get in touch ↗</span>}
/>`;

export const iconSets = {
  images: `// Two files per icon, e.g. from Devicon or your designer
<LiquidFill
  base={<img src="/icons/outline/python.svg" alt="" width={48} height={48} />}
  fill={<img src="/icons/filled/python.svg" alt="" width={48} height={48} />}
/>`,
  components: `// Any SVG icon component that takes a colour
import { SiReact } from "react-icons/si";

<LiquidFill
  base={<SiReact size={48} color="#c9c9c4" />}
  fill={<SiReact size={48} color="#149ECA" />}
/>`,
  stroke: `// Stroke icon sets (Lucide, Heroicons, Phosphor…)
import { Heart } from "lucide-react";

<LiquidFill
  direction="up"
  base={<Heart size={48} strokeWidth={1.5} color="#9a9a93" />}
  fill={<Heart size={48} strokeWidth={1.5} color="#e5484d" fill="#e5484d" />}
/>`,
  emoji: `// Emoji, text, or anything else that renders
<LiquidFill
  base={<span style={{ fontSize: 44, filter: "grayscale(1)", opacity: 0.4 }}>🔥</span>}
  fill={<span style={{ fontSize: 44 }}>🔥</span>}
/>`,
};

export const hookBasic = `import { useLiquidFill } from "react-liquid-fill";

export function NavLink({ href, children }) {
  const liquid = useLiquidFill(); // hover + keyboard focus

  return (
    <a href={href} ref={liquid.ref} {...liquid.bind} className="stack">
      <span>{children}</span>
      <span className="inverted" style={{ clipPath: "var(--liquid-clip, inset(0 100% 0 0))" }}>
        {children}
      </span>
    </a>
  );
}`;

export const themingCss = `/* The hook writes --liquid-clip on the host; clip whatever should be revealed */
.my-fill-layer {
  clip-path: var(--liquid-clip, inset(0 100% 0 0));
}

/* React to the finished state */
.my-icon[data-filled] .caption { color: var(--text-strong); }

/* Dark mode: invert a white outline artwork */
@media (prefers-color-scheme: dark) {
  [data-liquid-layer="base"] img { filter: invert(0.9); }
}`;

export const polygonExample = `import { liquidPolygon } from "react-liquid-fill";

el.style.clipPath = liquidPolygon({
  progress: 0.5,
  direction: { x: 0, y: -1 },
  width: el.offsetWidth,
  height: el.offsetHeight,
});`;
