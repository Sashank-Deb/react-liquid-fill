"use client";

import { useEffect, useRef, useState } from "react";
import { useLiquidFill } from "@/lib/liquid";
import { playRustle, playStep, unlockAudio } from "./footsteps";

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

/** A fox that wanders along the top edge of its positioned parent: walks, pauses, turns,
 *  and, while coloured, sometimes hides in the grass and pops up again. */
export function PixelRunner({ onColourChange, footsteps = false }: PixelRunnerProps) {
  const art = useRef<HTMLSpanElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const [coloured, setColoured] = useState(false);
  const colouredRef = useRef(false); // read by the wander loop: it only hides while coloured

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
    colouredRef.current = next;
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
  // The animation is re-read every frame: it speeds up or slows down with the walk, and it's
  // absent while the fox rests, so the sound always matches the paws.
  useEffect(() => {
    if (!footsteps) return;
    let last = -1;
    let raf = 0;
    const tick = () => {
      const anim = art.current?.querySelector(".pr-f1")?.getAnimations()[0];
      if (anim && anim.playState === "running") {
        const duration = Number(anim.effect?.getTiming().duration) || 880;
        const t = Number(anim.currentTime ?? 0);
        const frame = Math.floor((((t % duration) + duration) % duration) / (duration / 8));
        if (frame !== last) {
          if (frame === 2 || frame === 6) playStep();
          last = frame;
        }
      } else {
        last = -1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [footsteps]);

  // Wandering. Math.random picks the decisions (how far, which way, how fast, whether to rest,
  // and, while the meadow is showing, whether to hide in the grass); the motion between them is
  // eased, so it reads as natural rather than jittery.
  useEffect(() => {
    const mover = moverRef.current;
    const track = mover?.parentElement;
    if (!mover || !track) return;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const room = () => Math.max(0, track.clientWidth - mover.offsetWidth);
    const pos = { x: room() * rnd(0.1, 0.35), dy: 0 }; // dy > 0 = sunk into the grass
    let facing = 1;
    let alive = true;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const place = () => {
      mover.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.dy.toFixed(1)}px, 0)`;
    };
    const setWalking = (walking: boolean) => mover.classList.toggle("is-idle", !walking);
    const face = (dir: number) => {
      facing = dir;
      mover.classList.toggle("is-left", dir < 0);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pos.x = room() / 2;
      place();
      setWalking(false);
      return;
    }

    const sleep = (ms: number) => new Promise<void>((done) => (timer = setTimeout(done, ms)));
    const easeInOut = (k: number) => 0.5 - 0.5 * Math.cos(Math.PI * k);
    const easeIn = (k: number) => k * k;
    const easeOut = (k: number) => 1 - (1 - k) * (1 - k);
    const easeOutBack = (k: number) => 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2); // small overshoot
    const tween = (key: "x" | "dy", to: number, ms: number, ease: (k: number) => number) =>
      new Promise<void>((done) => {
        const from = pos[key];
        const start = performance.now();
        const tick = (now: number) => {
          if (!alive) return;
          const k = Math.min(1, (now - start) / ms);
          pos[key] = from + (to - from) * ease(k);
          place();
          if (k < 1) raf = requestAnimationFrame(tick);
          else done();
        };
        raf = requestAnimationFrame(tick);
      });

    const BASE_SPEED = 62; // px/s that matches the 0.88s walk cycle without paws sliding
    const BASE_CYCLE = 0.88;

    const pickTarget = () => {
      const w = room();
      let dir = Math.random() < 0.61 ? facing : -facing; // usually keep going the same way (39% turn)
      const dist = rnd(70, 420);
      if (pos.x + dir * dist < 0 || pos.x + dir * dist > w) dir = -dir; // turn back at the edges
      return Math.max(0, Math.min(w, pos.x + dir * dist));
    };

    const walkTo = async (target: number) => {
      const dist = Math.abs(target - pos.x);
      if (dist < 8) return;
      face(target > pos.x ? 1 : -1);
      const speed = rnd(49, 75);
      // steps keep pace with the speed, so the paws don't slide
      mover.style.setProperty("--pr-step", `${((BASE_CYCLE * BASE_SPEED) / speed).toFixed(3)}s`);
      setWalking(true);
      await tween("x", target, (dist / speed) * 1000 + 350, easeInOut);
      setWalking(false);
    };

    // Duck into the grass, wait, then come back up: same spot, or somewhere new
    const hide = async () => {
      const depth = mover.offsetHeight + 6;
      playRustle();
      await tween("dy", depth, 300, easeIn);
      await sleep(rnd(1200, 3200));
      if (!alive) return;
      if (Math.random() < 0.55) {
        const w = room();
        let x = rnd(0, w);
        if (Math.abs(x - pos.x) < 80) x = (x + w / 2) % w; // make a move count
        pos.x = x;
        if (Math.random() < 0.5) face(-facing);
        place();
      }
      if (Math.random() < 0.5) {
        await tween("dy", depth * 0.36, 280, easeOut); // peek: ears and eyes over the grass
        await sleep(rnd(400, 900));
      }
      playRustle(0.8);
      await tween("dy", 0, 340, easeOutBack);
    };

    const run = async () => {
      place();
      setWalking(false);
      await sleep(rnd(300, 900));
      while (alive) {
        await walkTo(pickTarget());
        if (!alive) break;
        if (Math.random() < 0.66) {
          // pause after ~2 in 3 walks; while the meadow shows, half the pauses are spent hiding
          if (colouredRef.current && Math.random() < 0.5) await hide();
          else await sleep(rnd(760, 2840));
        }
      }
    };
    void run();

    const ro = new ResizeObserver(() => {
      pos.x = Math.min(pos.x, room());
      place();
    });
    ro.observe(track);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="pr-track">
      <div ref={moverRef} className="pr-mover is-idle">
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
