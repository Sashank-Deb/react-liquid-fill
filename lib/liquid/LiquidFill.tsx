"use client";

/**
 * <LiquidFill> — the plug-and-play wrapper around useLiquidFill.
 *
 * Stacks two layers in the same spot and pours the `fill` layer over the `base` layer.
 * Works with anything: images, inline SVG, text, whole buttons. No CSS file needed.
 *
 *   <LiquidFill base={<img src="/logo-outline.svg" alt="" />} fill={<img src="/logo.svg" alt="" />} />
 *
 *   <LiquidFill as="button" trigger={["hover", "focus"]} direction="up"
 *     base={<span>Get in touch</span>}
 *     fill={<span className="inverted">Get in touch</span>} />
 *
 * Everything after the two layers (children) is rendered below them and is part of the hover area,
 * e.g. a caption. All useLiquidFill options are accepted as props.
 */

import { createElement, useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { useLiquidFill, type UseLiquidFillOptions } from "./useLiquidFill";

type OptionKeys = keyof UseLiquidFillOptions;
const OPTION_KEYS: OptionKeys[] = [
  "trigger", "direction", "duration", "easing", "wave", "cssVar", "inView", "touch",
  "reducedMotion", "disabled", "initial", "onProgress", "onFilled", "onDrained",
];

export type LiquidFillProps = Omit<UseLiquidFillOptions, "measureRef" | "ref"> &
  Omit<HTMLAttributes<HTMLElement>, "children" | "onProgress"> & {
    /** Element to render as. Default "span". */
    as?: ElementType;
    /** Passed through when rendering as a button or link. */
    type?: "button" | "submit" | "reset";
    href?: string;
    target?: string;
    rel?: string;
    /** Always visible underneath. */
    base: ReactNode;
    /** Revealed by the liquid. */
    fill: ReactNode;
    /** Rendered after the stacked layers (e.g. a caption). */
    children?: ReactNode;
    /** Class for the element that stacks the two layers. */
    layersClassName?: string;
    [key: `data-${string}`]: unknown;
  };

const stackStyle: CSSProperties = { display: "inline-grid", position: "relative" };
const layerStyle: CSSProperties = { gridArea: "1 / 1", display: "grid", placeItems: "center" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = ((e: any) => void) | undefined;
function compose(a: Handler, b: Handler): Handler {
  return a && b ? (e) => (a(e), b(e)) : a ?? b;
}

export function LiquidFill(props: LiquidFillProps) {
  const { as = "span", base, fill, children, layersClassName, ...rest } = props;

  // split hook options from DOM props
  const options: UseLiquidFillOptions = {};
  const domProps: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if ((OPTION_KEYS as string[]).includes(k)) (options as Record<string, unknown>)[k] = v;
    else domProps[k] = v;
  }

  const layers = useRef<HTMLSpanElement>(null);
  const liquid = useLiquidFill({ ...options, measureRef: layers });
  const cssVar = options.cssVar ?? "--liquid-clip";
  const d = domProps as HTMLAttributes<HTMLElement>;

  return createElement(
    as,
    {
      ...domProps,
      ref: liquid.ref,
      onPointerEnter: compose(liquid.bind.onPointerEnter, d.onPointerEnter),
      onPointerLeave: compose(liquid.bind.onPointerLeave, d.onPointerLeave),
      onPointerDown: compose(liquid.bind.onPointerDown, d.onPointerDown),
      onFocus: compose(liquid.bind.onFocus, d.onFocus),
      onBlur: compose(liquid.bind.onBlur, d.onBlur),
      "data-filled": liquid.filled || undefined,
    },
    <span ref={layers} className={layersClassName} style={stackStyle}>
      <span data-liquid-layer="base" style={layerStyle}>{base}</span>
      <span data-liquid-layer="fill" aria-hidden="true" style={{ ...layerStyle, clipPath: `var(${cssVar}, inset(0 100% 0 0))` }}>
        {fill}
      </span>
    </span>,
    children,
  );
}
