/*
  A pixel-art meadow for the "Ready to pour?" band, at the same 4px pixel scale as the fox.
  The ground texture is generated from a fixed seed, so it looks hand-scattered but renders
  identically on the server and in the browser: grass tufts, fallen leaves and pebbles. A strip of grass blades sits on the band's top edge (where the fox walks),
  and a few leaves drift down.
*/

const PX = 4; // one art pixel = 4 CSS pixels, like the fox
const TILE_W = 128; // tile size in art pixels (repeats across the band)
const TILE_H = 56;

const C = {
  tuftLight: "#6fae4f",
  tuftDark: "#2f5b2c",
  leafOrange: "#e8843f",
  leafRed: "#c4462a",
  leafAmber: "#e5b23a",
  stem: "#6b4423",
  pebble: "#8f8f86",
  pebbleShade: "#6e6e66",
};

// Small pixel shapes. '.' = empty; any other character is a key into the shape's colour map.
const LEAVES = [
  ["xx.", "xxx", ".xs"],
  [".xx", "xxx", "sx."],
  [".x.", "xxx", "xx.", "..s"],
  ["xx", "xx", "s."],
];
const TUFTS = [
  ["g", "g"],
  ["g.g", ".g."],
  [".g.", "g.g", ".g."],
  ["d", "g"],
];

/** Deterministic PRNG (mulberry32) so the meadow is the same everywhere. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Px = { x: number; y: number; fill: string };

function stamp(out: Px[], shape: string[], x0: number, y0: number, colours: Record<string, string>) {
  shape.forEach((row, dy) =>
    [...row].forEach((ch, dx) => {
      if (ch !== "." && colours[ch]) out.push({ x: (x0 + dx) % TILE_W, y: (y0 + dy) % TILE_H, fill: colours[ch] });
    }),
  );
}

function buildTile(): Px[] {
  const r = seeded(20261012);
  const at = (n: number) => Math.floor(r() * n);
  const px: Px[] = [];
  for (let i = 0; i < 150; i++) {
    const t = TUFTS[at(TUFTS.length)];
    stamp(px, t, at(TILE_W), at(TILE_H), { g: r() < 0.6 ? C.tuftLight : C.tuftDark, d: C.tuftDark });
  }
  for (let i = 0; i < 5; i++) stamp(px, ["pp", "pp"], at(TILE_W), at(TILE_H), { p: r() < 0.5 ? C.pebble : C.pebbleShade });
  const leafColours = [C.leafOrange, C.leafRed, C.leafAmber];
  for (let i = 0; i < 13; i++) {
    stamp(px, LEAVES[at(LEAVES.length)], at(TILE_W), at(TILE_H), { x: leafColours[at(3)], s: C.stem });
  }
  return px;
}

const TILE = buildTile();

// Grass blades along the top edge: 3 art pixels tall, repeating every 14
const EDGE = ["..g......d....", ".dg.g...gd..g.", "gdggdgdggdggdg"];

function Pixels({ pixels }: { pixels: Px[] }) {
  return (
    <>
      {pixels.map((p, i) => (
        <rect key={i} x={p.x * PX} y={p.y * PX} width={PX} height={PX} fill={p.fill} />
      ))}
    </>
  );
}

const edgePixels: Px[] = [];
EDGE.forEach((row, y) =>
  [...row].forEach((ch, x) => {
    if (ch === "g") edgePixels.push({ x, y, fill: C.tuftLight });
    if (ch === "d") edgePixels.push({ x, y, fill: "#4c8a3d" });
  }),
);

/** The ground: stepped greens (CSS) under a repeating pixel texture. */
export function MeadowGround() {
  return (
    <svg className="meadow-ground" width="100%" height="100%" aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <pattern id="meadow-tile" width={TILE_W * PX} height={TILE_H * PX} patternUnits="userSpaceOnUse">
          <Pixels pixels={TILE} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#meadow-tile)" />
    </svg>
  );
}

/** Grass blades poking up above the band's top edge, where the fox walks. */
export function MeadowEdge() {
  return (
    <svg className="meadow-edge" height={EDGE.length * PX} aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <pattern id="meadow-edge" width={EDGE[0].length * PX} height={EDGE.length * PX} patternUnits="userSpaceOnUse">
          <Pixels pixels={edgePixels} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#meadow-edge)" />
    </svg>
  );
}

/** A few leaves drifting down across the band. */
export function FallingLeaves() {
  const leaves = [
    { left: "12%", delay: "0s", dur: "9s", colour: C.leafOrange, shape: LEAVES[0] },
    { left: "38%", delay: "-3.5s", dur: "11s", colour: C.leafAmber, shape: LEAVES[3] },
    { left: "66%", delay: "-6s", dur: "10s", colour: C.leafRed, shape: LEAVES[1] },
    { left: "86%", delay: "-1.5s", dur: "12s", colour: C.leafOrange, shape: LEAVES[2] },
  ];
  return (
    <div className="meadow-falling" aria-hidden="true">
      {leaves.map((l, i) => {
        const px: Px[] = [];
        stamp(px, l.shape, 0, 0, { x: l.colour, s: C.stem });
        return (
          <svg
            key={i}
            className="meadow-leaf"
            style={{ left: l.left, animationDelay: l.delay, animationDuration: l.dur }}
            width={4 * PX}
            height={4 * PX}
            shapeRendering="crispEdges"
          >
            <Pixels pixels={px} />
          </svg>
        );
      })}
    </div>
  );
}
