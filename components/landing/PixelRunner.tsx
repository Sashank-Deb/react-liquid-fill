"use client";

import { LiquidFill } from "@/lib/liquid";

/*
  An original 8-bit runner (beanie, hoodie, sneakers) drawn on a 16×18 grid.
  Two frames make the run cycle. The greyscale copy is the base; the colour copy is poured in
  by LiquidFill when the pointer reaches it, or on tap on touch screens.

  Key: K outline · O pom-pom · H beanie · h beanie cuff · S skin · E eye
       J hoodie · j hoodie shadow · P trousers · B shoes · . empty
*/
const HEAD = [
  "......OO",
  ".....KOOK",
  "....KHHHHKK",
  "...KHHHHHHHK",
  "..KHHHHHHHHHK",
  "..KhhhhhhhhhK",
  "..KSSSSSSSESK",
  "..KSSSSSSSSSK",
  "...KSSSSSSSK",
  "....KJJJJJK",
  "...KJJJJJJJK",
];

const FRAMES = [
  // stride: arms out, legs apart
  [...HEAD, "..KSKJJJJJKSK", "...KKjjjjjKK", "....KPPPPPK", "...KPPK.KPPK", "..KPPK...KPPK", ".KBBK.....KBBBK", ".KKK.......KKKK"],
  // passing: arm forward, legs together
  [...HEAD, "...KJJJJJJKSK", "...KKjjjjjKK", "....KPPPPPK", ".....KPPPK", ".....KPPPK", "....KBBBBBK", "....KKKKKKK"],
];

const W = 16;
const H = 18;

type Palette = Record<string, string>;

const COLOUR: Palette = {
  K: "currentColor",
  O: "#fff4cc",
  H: "#e2a400",
  h: "#b97f00",
  S: "#f1c39b",
  E: "#1c1c1a",
  J: "#1d8fa6",
  j: "#146b7d",
  P: "#3b3f58",
  B: "#8a4b2a",
};

const GREY: Palette = {
  K: "currentColor",
  O: "#ededea",
  H: "#b2b2aa",
  h: "#94948c",
  S: "#e8e8e2",
  E: "#55554f",
  J: "#9a9a93",
  j: "#85857e",
  P: "#74746e",
  B: "#63635d",
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

/** Runs back and forth along the top edge of its positioned parent. */
export function PixelRunner() {
  return (
    <div className="pr-track">
      <div className="pr-mover">
        <LiquidFill
          as="button"
          type="button"
          className="pr-runner"
          layersClassName="pr-body"
          aria-label="Pixel runner. Hover or tap to pour colour into it."
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
