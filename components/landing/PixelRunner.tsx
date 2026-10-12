"use client";

import { useRef, useState } from "react";
import { useLiquidFill } from "@/lib/liquid";

/*
  A pixel fox on a 17×18 grid: tall ears with cream tufts, closed happy eyes, pink cheeks,
  white chest and a big curled tail. Eight frames make the walk cycle: each paw lifts in turn,
  the tail swishes, and the body rises between steps with the ears trailing a pixel behind.
  CSS steps through them and adds a matching lean; the fox never stops walking along the band.
  The greyscale copy is the base; the colour copy is poured in by useLiquidFill:
    - hover: pours in from the side the pointer comes from, drains when it leaves
    - click / tap / Enter: flips the colour (grey → colour, colour → grey) and the fox hops;
      colour set by a click stays after the pointer leaves

  Key: K outline · O fur · o fur shade · W white · w cream · P cheek · E eye / nose / paws · . empty
*/
const FRAMES = [
  // 1. left paw up, body low
  [
    ".................",
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
    "..KooooKoEWWOK...",
    "...KKooKoEWEoK...",
    ".....KKKK.KEKK...",
  ],
  // 2. left paw up, tail swish
  [
    ".................",
    ".....K.........K.",
    "....KoK.......KoK",
    "....KwoK.....KowK",
    "....KWoOKKKKKOoWK",
    "....KWOOOOOOOOOWK",
    ".K..KOOOOOOOOOOOK",
    "KWK.KOOOOOOOOOOOK",
    "KWWKKOOOOOOOOOOOK",
    "KWWWKWWEEOOOEEWWK",
    "KWWWKWPPWWOWWPPWK",
    "KWWWKWWWWWEWWWWWK",
    "KWWOOKWWWWWWWWWK.",
    ".KOOOOKKoWWWOKK..",
    ".KoOOOoKOWWWwK...",
    "..KooooKoEWWOK...",
    "...KKooKoEWEoK...",
    ".....KKKK.KEKK...",
  ],
  // 3. passing, body high, ears lag
  [
    ".................",
    ".....K.........K.",
    "....KoKK.....KKoK",
    "....KwoOKKKKKOowK",
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
    "..KooooKoWWWOK...",
    "...KKooKoEWEoK...",
    ".....KKKKEKEKK...",
  ],
  // 4. passing, body high, ears catch up
  [
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
    "..KooooKoWWWOK...",
    "...KKooKoEWEoK...",
    ".....KKKKEKEKK...",
  ],
  // 5. right paw up, body low
  [
    ".................",
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
    "..KooooKoWWEOK...",
    "...KKooKoEWEoK...",
    ".....KKKKEK.KK...",
  ],
  // 6. right paw up, tail swish
  [
    ".................",
    ".....K.........K.",
    "....KoK.......KoK",
    "....KwoK.....KowK",
    "....KWoOKKKKKOoWK",
    "....KWOOOOOOOOOWK",
    ".K..KOOOOOOOOOOOK",
    "KWK.KOOOOOOOOOOOK",
    "KWWKKOOOOOOOOOOOK",
    "KWWWKWWEEOOOEEWWK",
    "KWWWKWPPWWOWWPPWK",
    "KWWWKWWWWWEWWWWWK",
    "KWWOOKWWWWWWWWWK.",
    ".KOOOOKKoWWWOKK..",
    ".KoOOOoKOWWWwK...",
    "..KooooKoWWEOK...",
    "...KKooKoEWEoK...",
    ".....KKKKEK.KK...",
  ],
  // 7. passing, body high, ears lag
  [
    ".................",
    ".....K.........K.",
    "....KoKK.....KKoK",
    "....KwoOKKKKKOowK",
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
    "..KooooKoWWWOK...",
    "...KKooKoEWEoK...",
    ".....KKKKEKEKK...",
  ],
  // 8. passing, body high, ears catch up
  [
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
    "..KooooKoWWWOK...",
    "...KKooKoEWEoK...",
    ".....KKKKEKEKK...",
  ],
];

const W = 17;
const H = 18;

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
      {FRAMES.map((rows, i) => (
        <g key={i} className={`pr-f pr-f${i + 1}`}>
          <Rects rows={rows} palette={palette} />
        </g>
      ))}
    </svg>
  );
}

/** A fox that walks back and forth along the top edge of its positioned parent. */
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

  const hop = () => {
    const el = art.current;
    if (!el) return;
    el.classList.remove("is-hopping");
    void el.offsetWidth; // restart the animation even if a hop is still running
    el.classList.add("is-hopping");
  };

  // Every click flips what's on screen: grey → colour (kept after the pointer leaves),
  // colour → grey. And the fox hops each time.
  const flip = (e: React.MouseEvent) => {
    const coloured = liquid.getProgress() > 0.5;
    keptRef.current = !coloured;
    setKept(!coloured);
    if (coloured) liquid.drain();
    else liquid.fill(e.detail > 0 ? e : "up"); // from the pointer, or rising for keyboard
    hop();
  };

  return (
    <div className="pr-track">
      <div className="pr-mover">
        <button
          ref={liquid.ref}
          type="button"
          className="pr-runner"
          aria-label="Pixel fox. Hover to pour colour into it; click to switch the colour on or off."
          aria-pressed={kept}
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
          onClick={flip}
        >
          <span ref={art} className="pr-body" onAnimationEnd={(e) => e.currentTarget.classList.remove("is-hopping")}>
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
