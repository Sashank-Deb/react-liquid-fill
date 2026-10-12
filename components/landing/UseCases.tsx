"use client";

import { LiquidFill } from "@/lib/liquid";
import { technologies } from "@/lib/technologies";
import { TechnologyIcon } from "@/components/TechnologyIcon";
import { LiquidButton } from "@/components/Demos";

const stack = ["typescript", "react", "nodejs", "postgresql"].map((s) => technologies.find((t) => t.slug === s)!);
const links = ["Work", "Services", "About", "Contact"];

export function UseCases() {
  return (
    <div className="lp-cases">
      <article className="lp-case">
        <div className="lp-case-demo">
          <div className="lp-case-row">
            {stack.map((t) => (
              <TechnologyIcon key={t.slug} name={t.name} slug={t.slug} darkInvert={t.darkInvert} size={40} />
            ))}
          </div>
        </div>
        <h3>Tech stacks and skills</h3>
        <p>Portfolio and agency pages that list the tools behind the work. Outline at rest, brand colour on hover.</p>
      </article>

      <article className="lp-case">
        <div className="lp-case-demo">
          <LiquidButton>Book a call ↗</LiquidButton>
        </div>
        <h3>Calls to action</h3>
        <p>Buttons that invert as the pointer arrives, from whichever side it came. Tap to toggle on touch screens.</p>
      </article>

      <article className="lp-case">
        <div className="lp-case-demo">
          <nav className="lp-navdemo" aria-label="Example navigation">
            {links.map((l) => (
              <LiquidFill
                key={l}
                as="a"
                href="#use-cases"
                className="lp-navlink"
                base={<span className="lp-navlink-face">{l}</span>}
                fill={<span className="lp-navlink-face is-ink">{l}</span>}
              />
            ))}
          </nav>
        </div>
        <h3>Navigation and links</h3>
        <p>Menus where each item fills as you move along them, and keyboard users get the same effect on focus.</p>
      </article>
    </div>
  );
}
