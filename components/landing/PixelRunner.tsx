"use client";

import { useRef, useState } from "react";
import { useLiquidFill } from "@/lib/liquid";

/*
  A sitting pixel fox on a 17×17 grid: tall ears with cream tufts, closed happy eyes,
  pink cheeks, white chest and a big curled tail. It never stops hopping along the band (CSS).
  The greyscale copy is the base; the colour copy is poured in by useLiquidFill:
    - hover: pours in from the side the pointer comes from, drains when it leaves
    - click / tap / Enter: keeps the colour after the pointer leaves; click again to let it drain

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
  const art = useRef<HTMLSpanElement>(null);
  const hovering = useRef(false);
  const [kept, setKept] = useState(false);
  const keptRef = useRef(false);

  // Manual trigger: hover and click are handled below so a click can keep the colour.
  const liquid = useLiquidFill<HTMLButtonElement>({
    trigger: "manual",
    duration: { in: 560, out: 400 },
    wave: { amplitude: 0.22 },
    measureRef: art,
  });

  const toggleKept = (e: React.MouseEvent) => {
    const next = !keptRef.current;
    keptRef.current = next;
    setKept(next);
    if (next) liquid.fill(e.detail > 0 ? e : "up"); // from the pointer, or rising for keyboard
    else if (!hovering.current) liquid.drain();
  };

  return (
    <div className="pr-track">
      <div className="pr-mover">
        <button
          ref={liquid.ref}
          type="button"
          className="pr-runner"
          aria-label="Pixel fox. Hover to pour colour into it, or click to keep the colour."
          aria-pressed={kept}
          data-filled={liquid.filled || undefined}
          onPointerEnter={(e) => {
            if (e.pointerType === "touch") return; // taps arrive as clicks
            hovering.current = true;
            liquid.fill(e);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "touch") return;
            hovering.current = false;
            if (!keptRef.current) liquid.drain();
          }}
          onClick={toggleKept}
        >
          <span ref={art} className="pr-body">
            <span className="pr-layer">
              <Sprite palette={GREY} />
            </span>
            <span className="pr-layer pr-ink" aria-hidden="true">
              <Sprite palette={COLOUR} />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
