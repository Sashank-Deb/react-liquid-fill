"use client";

/**
 * Tiny synthesized footsteps (Web Audio, no audio files): a short band-passed noise burst
 * for leaves crunching plus a soft low thump. Browsers only allow sound after the visitor
 * interacts, so call unlockAudio() from a click handler before playStep().
 */

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  try {
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    if (!noise) {
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
  } catch {
    ctx = null; // audio unavailable; footsteps simply stay silent
  }
}

export function playStep(volume = 1): void {
  if (!ctx || !noise || ctx.state !== "running") return;
  const t = ctx.currentTime;

  // leaves crunching underfoot
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1400 + Math.random() * 900;
  band.Q.value = 0.9;
  const crunch = ctx.createGain();
  crunch.gain.setValueAtTime(0.0001, t);
  crunch.gain.exponentialRampToValueAtTime(0.11 * volume, t + 0.008);
  crunch.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  src.connect(band).connect(crunch).connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.13);

  // a soft thump
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.07);
  const thump = ctx.createGain();
  thump.gain.setValueAtTime(0.0001, t);
  thump.gain.exponentialRampToValueAtTime(0.08 * volume, t + 0.006);
  thump.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(thump).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}
