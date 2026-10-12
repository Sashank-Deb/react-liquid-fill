"use client";

/**
 * Synthesized footsteps through dry leaves (Web Audio, no audio files).
 *
 * A real leaf crunch is not one sound but a quick run of tiny crackles, so each step is
 * 6–9 very short, bright noise snaps 8–24ms apart (each with its own pitch and level),
 * a faint papery rustle under them, and a light thump for the paw. Browsers only allow sound
 * after the visitor interacts, so call unlockAudio() from a click handler before playStep().
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
      // gentle limiter so overlapping crackles never clip
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 6;
      out = ctx.createGain();
      out.gain.value = 0.9;
      out.connect(comp).connect(ctx.destination);
    }
  } catch {
    ctx = null; // audio unavailable; footsteps simply stay silent
  }
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** One crackle: a few milliseconds of high, band-passed noise with a sharp attack. */
function crackle(at: number, level: number) {
  if (!ctx || !noise || !out) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = rand(1800, 2600);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = rand(2800, 6500);
  bp.Q.value = rand(0.8, 1.6);
  const g = ctx.createGain();
  const len = rand(0.004, 0.016);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(level, at + 0.0015);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  src.connect(hp).connect(bp).connect(g).connect(out);
  src.start(at, rand(0, 0.45), len + 0.01);
}

export function playStep(volume = 1): void {
  if (!ctx || !noise || !out || ctx.state !== "running") return;
  const t = ctx.currentTime + 0.005;

  // the crunch: a cluster of crackles, front-loaded like weight settling onto leaves
  // (leaves break one after another, so each crackle follows the last by 8–24ms, getting quieter)
  const n = 6 + Math.floor(Math.random() * 4);
  let offset = 0;
  for (let i = 0; i < n; i++) {
    crackle(t + offset, rand(0.7, 1.4) * volume * Math.max(0.35, 1 - i * 0.09));
    offset += rand(0.008, 0.024);
  }

  // a faint papery rustle underneath
  const rustle = ctx.createBufferSource();
  rustle.buffer = noise;
  const rf = ctx.createBiquadFilter();
  rf.type = "bandpass";
  rf.frequency.value = rand(3500, 5000);
  rf.Q.value = 0.7;
  const rg = ctx.createGain();
  rg.gain.setValueAtTime(0.0001, t);
  rg.gain.exponentialRampToValueAtTime(0.08 * volume, t + 0.01);
  rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  rustle.connect(rf).connect(rg).connect(out);
  rustle.start(t, rand(0, 0.3), 0.16);

  // a light thump for the paw
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.06);
  const thump = ctx.createGain();
  thump.gain.setValueAtTime(0.0001, t);
  thump.gain.exponentialRampToValueAtTime(0.05 * volume, t + 0.005);
  thump.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  osc.connect(thump).connect(out);
  osc.start(t);
  osc.stop(t + 0.08);
}
