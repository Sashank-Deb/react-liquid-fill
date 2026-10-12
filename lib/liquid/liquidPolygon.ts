/**
 * liquidPolygon — pure geometry for the "liquid fill" reveal. No React, no DOM.
 *
 * Returns a CSS `polygon()` that covers the part of a w×h box that has been "filled" so far.
 * The leading edge is a wave whose height swells mid-fill and settles to flat at 0 and 1.
 * Use the result as a `clip-path` value.
 */

export type Vector = { x: number; y: number };

export type WaveOptions = {
  /** Wave height as a fraction of the box's shorter side. Default 0.3. */
  amplitude?: number;
  /** How fast the wave ripples over time. Default 21. 0 = a static wave. */
  ripple?: number;
  /** Number of points along the edge (more = smoother). Default 21. */
  segments?: number;
};

export type LiquidPolygonInput = {
  /** 0 = empty, 1 = full. */
  progress: number;
  /** Unit vector the liquid travels in. { x: 0, y: -1 } rises from the bottom. */
  direction: Vector;
  width: number;
  height: number;
  /** Seconds since the animation started; drives the ripple. */
  time?: number;
  /** false = a straight wipe with no wave. */
  wave?: WaveOptions | false;
};

export const CLIP_EMPTY = "inset(0 100% 0 0)";
export const CLIP_FULL = "inset(0)";

const sampleCache = new Map<number, { f: number; sin: number; cos: number; swell: number }[]>();
function samples(n: number) {
  let s = sampleCache.get(n);
  if (!s) {
    s = Array.from({ length: n }, (_, i) => {
      const f = i / (n - 1);
      const a = f * Math.PI * 2.5;
      return { f, sin: Math.sin(a), cos: Math.cos(a), swell: Math.sin(f * Math.PI) };
    });
    sampleCache.set(n, s);
  }
  return s;
}

export function liquidPolygon({ progress, direction, width, height, time = 0, wave = {} }: LiquidPolygonInput): string {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0) return CLIP_EMPTY;
  if (p >= 1) return CLIP_FULL;

  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const len = Math.hypot(direction.x, direction.y) || 1;
  const x = direction.x / len;
  const y = direction.y / len;

  const halfAlong = (Math.abs(x) * w + Math.abs(y) * h) / 2; // half the box measured along the travel direction
  const halfAcross = (Math.abs(y) * w + Math.abs(x) * h) / 2 + 2; // half measured across it (+2px overscan)
  const edge = -halfAlong + p * halfAlong * 2; // where the wave front sits

  // rotate local (along, across) coordinates into percentages of the box
  const pt = (along: number, across: number) =>
    `${(((w / 2 + x * along - y * across) / w) * 100).toFixed(2)}% ${(((h / 2 + y * along + x * across) / h) * 100).toFixed(2)}%`;

  const back = -halfAlong - 4;
  if (wave === false) {
    return `polygon(${pt(back, -halfAcross)},${pt(edge, -halfAcross)},${pt(edge, halfAcross)},${pt(back, halfAcross)})`;
  }

  const { amplitude = 0.3, ripple = 21, segments = 21 } = wave;
  const amp = amplitude * Math.min(w, h) * Math.sin(Math.PI * p);
  const s = Math.sin(ripple * time);
  const c = Math.cos(ripple * time);

  const pts = [pt(back, -halfAcross)];
  for (const { f, sin, cos, swell } of samples(Math.max(3, segments))) {
    const across = -halfAcross + f * halfAcross * 2;
    const rolling = sin * c - cos * s;
    const jitter = Math.sin(f * Math.PI * 6 + ripple * 1.38 * time);
    pts.push(pt(edge + (0.65 * rolling + 0.24 * jitter + 0.2 * swell) * amp, across));
  }
  pts.push(pt(back, halfAcross));
  return `polygon(${pts.join(",")})`;
}
