"use client";

import { LiquidFill } from "@/lib/liquid";
import { iconSrc } from "@/lib/technologies";
import { iconSets } from "@/docs/snippets";
import { CodeBlock } from "./CodeBlock";
import { HEART, SI_REACT } from "./paths";

const Svg = ({ d, ...props }: { d: string } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={48} height={48} aria-hidden="true" {...props}>
    <path d={d} />
  </svg>
);

const examples = [
  {
    id: "images",
    title: "Image files",
    text: "Two artworks per icon: an outline and a full-colour version. This is what the strip above uses, with Devicon logos.",
    preview: (
      <LiquidFill
        className="set-demo"
        role="img"
        aria-label="Python"
        tabIndex={0}
        base={<img src={iconSrc("outline", "python")} alt="" width={48} height={48} />}
        fill={<img src={iconSrc("filled", "python")} alt="" width={48} height={48} />}
      />
    ),
  },
  {
    id: "components",
    title: "SVG icon components",
    text: "react-icons, Simple Icons, MUI icons: render the same component twice with a muted and a brand colour.",
    preview: (
      <LiquidFill
        className="set-demo"
        role="img"
        aria-label="React"
        tabIndex={0}
        base={<Svg d={SI_REACT} style={{ fill: "var(--muted-icon)" }} />}
        fill={<Svg d={SI_REACT} fill="#149ECA" />}
      />
    ),
  },
  {
    id: "stroke",
    title: "Stroke icon sets",
    text: "Lucide, Heroicons, Phosphor: keep the outline as the base and add a fill colour to the top layer.",
    preview: (
      <LiquidFill
        className="set-demo"
        role="img"
        aria-label="Favourite"
        tabIndex={0}
        direction="up"
        base={<Svg d={HEART} fill="none" style={{ stroke: "var(--secondary)" }} strokeWidth={1.5} strokeLinejoin="round" />}
        fill={<Svg d={HEART} fill="#e5484d" stroke="#e5484d" strokeWidth={1.5} strokeLinejoin="round" />}
      />
    ),
  },
  {
    id: "emoji",
    title: "Emoji and text",
    text: "Anything that renders works. Here the base is a greyed-out copy made with a CSS filter.",
    preview: (
      <LiquidFill
        className="set-demo"
        role="img"
        aria-label="Fire"
        tabIndex={0}
        base={<span className="emoji is-muted">🔥</span>}
        fill={<span className="emoji">🔥</span>}
      />
    ),
  },
] as const;

export function IconSetDemos() {
  return (
    <div className="sets">
      {examples.map((ex) => (
        <article className="set" key={ex.id} id={`icons-${ex.id}`}>
          <div className="set-head">
            <div className="set-preview">{ex.preview}</div>
            <div className="set-copy">
              <h3>{ex.title}</h3>
              <p>{ex.text}</p>
            </div>
          </div>
          <CodeBlock code={iconSets[ex.id]} />
        </article>
      ))}
    </div>
  );
}
