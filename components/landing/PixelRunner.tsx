"use client";

import { LiquidFill } from "@/lib/liquid";

/*
  An original 8-bit fox drawn on a 22×15 grid, facing right. Two frames make the gallop:
  legs stretched, then gathered. The greyscale copy is the base; the colour copy is poured in
  by LiquidFill when the pointer reaches it, or on tap on touch screens.

  Key: K outline · O fur · o fur shade · W white (tail tip, chest, muzzle) · E eye · N nose
       D legs · . empty
*/
const BODY = [
  "...............K..K...",
  "..............KoKKoK..",
  ".KKK..........KOOOOK..",
  "KWWWK........KOOOOOKK.",
  "KWWOOK.......KOOEOOOOK",
  "KWOOOOK.....KOOOOWWWNK",
  ".KOOOOOKKKKKOOOOWWWKK.",
  "..KOOOOOOOOOOOOWWWK...",
  "..KoOOOOOOOOOOOOWK....",
  "...KooOOOOOOOOOOK.....",
  "....KKKKKKKKKKKK......",
];

const FRAMES = [
  // stretched: front legs reach forward, back legs push off
  [...BODY, "...KDDK......KDDK.....", "..KDDK........KDDK....", ".KDDK..........KDDK...", ".KKK............KKK..."],
  // gathered: legs under the body
  [...BODY, ".....KDK....KDK.......", "....KDDK...KDDK.......", "....KDDK...KDDK.......", "....KKK....KKK........"],
];

const W = 22;
const H = 15;

type Palette = Record<string, string>;

const COLOUR: Palette = {
  K: "currentColor",
  O: "#e87a2e",
  o: "#be581e",
  W: "#faf6ee",
  E: "#1c1c1a",
  N: "#1c1c1a",
  D: "#463028",
};

const GREY: Palette = {
  K: "currentColor",
  O: "#b2b2aa",
  o: "#94948c",
  W: "#f0f0ea",
  E: "#3a3a36",
  N: "#3a3a36",
  D: "#6b6b65",
};

/** One frame as SVG rects, merging horizontal runs of the same colour to keep the DOM small. */
function FrameRects({ rows, palette }: { rows: string[]; palette: Palette }) {
  const rects: React.ReactElement[] = [];
  rows.forEach((raw, y) => {
    const row = raw.padEnd(W, ".");
    let x = 0;
    while (x < W) {
      const key = row[x];
      let run = 1;
      while (x + run < W && row[x + run] === key) run++;
      if (key !== "." && palette[key]) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[key]} />);
      }
      x += run;
    }
  });
  return <>{rects}</>;
}

function Sprite({ palette }: { palette: Palette }) {
  return (
    <svg className="pr-sprite" viewBox={`0 0 ${W} ${H}`} width={W * 4} height={H * 4} shapeRendering="crispEdges" aria-hidden="true">
      <g className="pr-frame pr-frame-a">
        <FrameRects rows={FRAMES[0]} palette={palette} />
      </g>
      <g className="pr-frame pr-frame-b">
        <FrameRects rows={FRAMES[1]} palette={palette} />
      </g>
    </svg>
  );
}

/** A fox that runs back and forth along the top edge of its positioned parent. */
export function PixelRunner() {
  return (
    <div className="pr-track">
      <div className="pr-mover">
        <LiquidFill
          as="button"
          type="button"
          className="pr-runner"
          layersClassName="pr-body"
          aria-label="Pixel fox. Hover or tap to pour colour into it."
          touch="tap-toggle"
          duration={{ in: 520, out: 380 }}
          wave={{ amplitude: 0.22 }}
          base={<Sprite palette={GREY} />}
          fill={<Sprite palette={COLOUR} />}
        />
      </div>
    </div>
  );
}
