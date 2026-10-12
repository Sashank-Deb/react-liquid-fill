"use client";

import { LiquidFill, type UseLiquidFillOptions } from "@/lib/liquid";
import { iconSrc, type Technology } from "@/lib/technologies";
import { useIsMarqueeDuplicate } from "./TechnologyMarquee";

type Props = Pick<Technology, "name" | "slug" | "darkInvert"> &
  Omit<UseLiquidFillOptions, "measureRef" | "ref"> & { size?: number };

/**
 * Two separate artworks stacked in one spot, the same architecture as sandepalm.com:
 *   /technology/outline/<slug>.svg  always visible
 *   /technology/filled/<slug>.svg   poured in by the liquid
 * Any useLiquidFill option can be passed straight through (trigger, direction, inView, …).
 */
export function TechnologyIcon({ name, slug, darkInvert, size = 48, trigger = ["hover", "focus"], ...options }: Props) {
  const isDuplicate = useIsMarqueeDuplicate(); // the marquee's second copy stays out of the tab order
  const focusable = !isDuplicate && ([] as string[]).concat(trigger).includes("focus");
  const art = (variant: "outline" | "filled") => (
    <img src={iconSrc(variant, slug)} width={size} height={size} alt="" draggable={false} decoding="async" loading="lazy" />
  );

  return (
    <LiquidFill
      {...options}
      trigger={trigger}
      className="technology-icon"
      layersClassName="technology-art"
      role="img"
      aria-label={name}
      tabIndex={focusable ? 0 : -1}
      data-dark-invert={darkInvert || undefined}
      base={art("outline")}
      fill={art("filled")}
    >
      <span className="technology-name" aria-hidden="true">
        {name}
      </span>
    </LiquidFill>
  );
}
