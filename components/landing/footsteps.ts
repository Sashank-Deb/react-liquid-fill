"use client";

/**
 * The meadow's sounds, synthesized with Web Audio (no audio files):
 *   - playStep(): a paw on dry leaves: a short run of soft crackles, a papery rustle, a light thump
 *   - startAmbience() / stopAmbience(): very quiet birds now and then, and two crickets
 * Browsers only allow sound after the visitor interacts, so call unlockAudio() from a click first.
 */

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let out: GainNode | null = null;

export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  try {
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    if (!noise) {
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (!out) {
      // gentle limiter so overlapping sounds never clip
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 6;
      out = ctx.createGain();
      out.gain.value = 0.9;
      out.connect(comp).connect(ctx.destination);
    }
  } catch {
    ctx = null; // audio unavailable; the meadow simply stays silent
  }
}

const ready = () => !!ctx && !!noise && !!out && ctx.state === "running";
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------------- footsteps ---------------- */

/** One crackle: a few milliseconds of band-passed noise with a quick attack. */
function crackle(at: number, level: number) {
  const src = ctx!.createBufferSource();
  src.buffer = noise;
  const bp = ctx!.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = rand(2200, 4800); // a little lower and wider than a sharp snap
  bp.Q.value = rand(0.7, 1.2);
  const g = ctx!.createGain();
  const len = rand(0.006, 0.018);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(level, at + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  src.connect(bp).connect(g).connect(out!);
  src.start(at, rand(0, 0.45), len + 0.01);
}

/** A paw on dry leaves. Middle ground: a few soft crackles over a papery rustle. */
export function playStep(volume = 1, at?: number): void {
  if (!ready()) return;
  const t = at ?? ctx!.currentTime + 0.005;

  const n = 4 + Math.floor(Math.random() * 3); // 4–6 crackles, 10–28ms apart, fading
  let offset = 0;
  for (let i = 0; i < n; i++) {
    crackle(t + offset, rand(0.2, 0.36) * volume * Math.max(0.35, 1 - i * 0.14)); // 40% less crunch
    offset += rand(0.01, 0.028);
  }

  const rustle = ctx!.createBufferSource();
  rustle.buffer = noise;
  const rf = ctx!.createBiquadFilter();
  rf.type = "bandpass";
  rf.frequency.value = rand(2600, 4000);
  rf.Q.value = 0.6;
  const rg = ctx!.createGain();
  rg.gain.setValueAtTime(0.0001, t);
  rg.gain.exponentialRampToValueAtTime(0.05 * volume, t + 0.012);
  rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
  rustle.connect(rf).connect(rg).connect(out!);
  rustle.start(t, rand(0, 0.3), 0.15);

  const osc = ctx!.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.06);
  const thump = ctx!.createGain();
  thump.gain.setValueAtTime(0.0001, t);
  thump.gain.exponentialRampToValueAtTime(0.03 * volume, t + 0.005); // thump halved
  thump.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  osc.connect(thump).connect(out!);
  osc.start(t);
  osc.stop(t + 0.08);
}

/* ---------------- ambience (very quiet) ---------------- */

function tone(at: number, f0: number, f1: number, dur: number, level: number, pan: number) {
  const osc = ctx!.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(f0, at);
  osc.frequency.exponentialRampToValueAtTime(f1, at + dur * 0.6);
  osc.frequency.exponentialRampToValueAtTime(f0 * 0.92, at + dur);
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(level, at + Math.min(0.01, dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  const p = ctx!.createStereoPanner();
  p.pan.value = pan;
  osc.connect(g).connect(p).connect(out!);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

/** A small songbird: 2–4 quick rising chirps, somewhere off to one side. */
export function birdCall(at?: number): void {
  if (!ready()) return;
  let t = at ?? ctx!.currentTime + 0.05;
  const base = rand(2600, 3600);
  const pan = rand(-0.7, 0.7);
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const d = rand(0.05, 0.09);
    tone(t, base * rand(0.95, 1.05), base * rand(1.25, 1.5), d, rand(0.012, 0.02), pan);
    t += d + rand(0.03, 0.07);
  }
}

/** A cricket: 3–4 tiny pulses of a steady high tone. */
export function cricketTrill(at?: number, freq = 4500, pan = 0): void {
  if (!ready()) return;
  let t = at ?? ctx!.currentTime + 0.02;
  const n = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) {
    tone(t, freq, freq * 1.01, 0.016, 0.014, pan);
    t += 0.045;
  }
}

let ambience: ReturnType<typeof setTimeout>[] = [];

export function startAmbience(): void {
  stopAmbience();
  if (!ready()) return;
  const loop = (fn: () => void, min: number, max: number, first: number) => {
    const run = () => {
      if (!document.hidden) fn();
      ambience.push(setTimeout(run, rand(min, max)));
    };
    ambience.push(setTimeout(run, first));
  };
  loop(() => birdCall(), 4000, 11000, rand(1500, 3500));
  const c1 = { f: rand(4300, 4600), pan: rand(-0.6, -0.2) };
  const c2 = { f: rand(4700, 5000), pan: rand(0.2, 0.6) };
  loop(() => cricketTrill(undefined, c1.f, c1.pan), 900, 1400, 600);
  loop(() => cricketTrill(undefined, c2.f, c2.pan), 1100, 1800, 1300);
}

export function stopAmbience(): void {
  ambience.forEach(clearTimeout);
  ambience = [];
}
