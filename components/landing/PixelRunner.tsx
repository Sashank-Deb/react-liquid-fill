"use client";

import { useEffect, useRef, useState } from "react";
import { useLiquidFill } from "@/lib/liquid";
import { playStep, unlockAudio } from "./footsteps";

/*
  A pixel fox on a 17×18 grid: tall ears with cream tufts, closed happy eyes, pink cheeks,
  white chest and a big curled tail. Eight frames make the walk cycle: each paw lifts in turn,
  the tail swishes, and the body rises between steps with the ears trailing a pixel behind.
  CSS steps through them and adds a matching lean; the fox never stops walking along the band.
  The greyscale copy is the base; the colour copy is poured in by useLiquidFill.
  Each click / tap / Enter flips the colour (grey → colour, colour → grey) and the fox hops.

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

type Point = { clientX: number; clientY: number };

type PixelRunnerProps = {
  /** Called after every click with the new state and the fox's centre (for pouring a scene from it). */
  onColourChange?: (coloured: boolean, from: Point) => void;
  /** Play footsteps in time with the walk cycle (only after a click has unlocked audio). */
  footsteps?: boolean;
};

/** A fox that walks back and forth along the top edge of its positioned parent. */
export function PixelRunner({ onColourChange, footsteps = false }: PixelRunnerProps) {
  const art = useRef<HTMLSpanElement>(null);
  const [coloured, setColoured] = useState(false);

  // Manual trigger: only clicks change the colour.
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

  // Every click flips the colour and makes the fox hop.
  const flip = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = liquid.getProgress() <= 0.5;
    setColoured(next);
    if (next) {
      unlockAudio(); // inside the click, so the browser allows sound
      liquid.fill(e.detail > 0 ? e : "up"); // from the pointer, or rising for keyboard
    } else {
      liquid.drain();
    }
    hop();
    const r = e.currentTarget.getBoundingClientRect();
    onColourChange?.(next, { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
  };

  // Footsteps: watch the walk cycle and play a step when a lifted paw lands (frames 3 and 7).
  useEffect(() => {
    if (!footsteps) return;
    const frameEl = art.current?.querySelector(".pr-f1");
    const anim = frameEl?.getAnimations()[0];
    if (!anim) return; // reduced motion: no walk, no steps
    let last = -1;
    let raf = 0;
    const tick = () => {
      const duration = Number(anim.effect?.getTiming().duration) || 880;
      const t = Number(anim.currentTime ?? 0);
      const frame = Math.floor((((t % duration) + duration) % duration) / (duration / 8));
      if (frame !== last) {
        if (frame === 2 || frame === 6) playStep();
        last = frame;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [footsteps]);

  return (
    <div className="pr-track">
      <div className="pr-mover">
        <button
          ref={liquid.ref}
          type="button"
          className="pr-runner"
          aria-label="Pixel fox. Click to switch the colour on or off."
          aria-pressed={coloured}
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
