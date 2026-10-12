"use client";

import { LiquidFill } from "@/lib/liquid";

/*
  A sitting pixel fox on a 17×17 grid: tall ears with cream tufts, closed happy eyes,
  pink cheeks, white chest and a big curled tail. It hops along the band (CSS); the greyscale
  copy is the base and the colour copy is poured in by LiquidFill from the side the pointer
  comes from, or on tap on touch screens.

  Key: K outline · O fur · o fur shade · W white · w cream · P cheek · E eye / nose / paws · . empty
*/
const FOX = [
  ".....K.........K.",
  "....KoK.......KoK",
  "....KwoK.....KowK",
  "....KWoOKKKKKOoWK",
  "....KWOOOOOOOOOWK",
  "....KOOOOOOOOOOOK",
  ".K..KOOOOOOOOOOOK",
  "KWK.KOOOOOOOOOOOK",
  "KWWKKWWEEOOOEEWWK",
  "KWWWKWPPWWOWWPPWK",
  "KWWWKWWWWWEWWWWWK",
  "KWWOOKWWWWWWWWWK.",
  ".KOOOOKKoWWWOKK..",
  ".KoOOOoKOWWWwK...",
  "..KooooKoWWWOK...",
  "...KKooKoEWEoK...",
  ".....KKKKEKEKK...",
];

const W = 17;
const H = 17;

type Palette = Record<string, string>;

const COLOUR: Palette = {
  K: "currentColor",
  O: "#e8843f",
  o: "#c25a26",
  W: "#f8f4ea",
  w: "#f2d4b4",
  P: "#ea968a",
  E: "#3a2018",
};

const GREY: Palette = {
  K: "currentColor",
  O: "#b2b2aa",
  o: "#94948c",
  W: "#f0f0ea",
  w: "#d8d8d1",
  P: "#c8c8c1",
  E: "#4a4a45",
};

/** SVG rects for the sprite, merging horizontal runs of one colour to keep the DOM small. */
function Rects({ rows, palette }: { rows: string[]; palette: Palette }) {
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
      <Rects rows={FOX} palette={palette} />
    </svg>
  );
}

/** A fox that hops back and forth along the top edge of its positioned parent. */
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
          duration={{ in: 560, out: 400 }}
          wave={{ amplitude: 0.22 }}
          base={<Sprite palette={GREY} />}
          fill={<Sprite palette={COLOUR} />}
        />
      </div>
    </div>
  );
}
