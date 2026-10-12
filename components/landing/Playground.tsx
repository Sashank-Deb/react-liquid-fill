"use client";

import { useRef, useState } from "react";
import { useLiquidFill, type LiquidDirection } from "@/lib/liquid";
import { iconSrc } from "@/lib/technologies";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { useSlidingIndicator } from "@/components/ui/useSlidingIndicator";

type Subject = "logo" | "button" | "text";
type Mode = "hover" | "click";
const DIRS: Exclude<LiquidDirection, { x: number; y: number }>[] = ["auto", "up", "down", "left", "right"];

const SUBJECT_CODE: Record<Subject, { base: string; fill: string }> = {
  logo: { base: '<img src="/angular-outline.svg" alt="" />', fill: '<img src="/angular.svg" alt="" />' },
  button: { base: '<span className="btn">Get started</span>', fill: '<span className="btn btn-inverted">Get started</span>' },
  text: { base: '<span className="outlined">Liquid</span>', fill: "<span>Liquid</span>" },
};

function Segmented<T extends string>({ id, label, value, options, onChange }: { id: string; label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  const { containerRef, indicatorRef } = useSlidingIndicator(value);
  return (
    <div className="lp-field" role="radiogroup" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="lp-field-label">
        {label}
      </span>
      <div ref={containerRef} className="lp-segmented">
        <span ref={indicatorRef} className="slide-indicator" aria-hidden="true" />
        {options.map((o) => (
          <button key={o} id={`${id}-${o}`} type="button" role="radio" aria-checked={value === o} data-indicator-key={o} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Playground() {
  const [subject, setSubject] = useState<Subject>("logo");
  const [mode, setMode] = useState<Mode>("hover");
  const [direction, setDirection] = useState<(typeof DIRS)[number]>("auto");
  const [duration, setDuration] = useState(460);
  const [amplitude, setAmplitude] = useState(0.3);

  const stage = useRef<HTMLSpanElement>(null);
  const wave = amplitude === 0 ? false : { amplitude };
  const liquid = useLiquidFill<HTMLDivElement>({
    trigger: mode === "hover" ? ["hover", "focus"] : "manual",
    direction,
    duration: { in: duration, out: Math.round(duration * 0.74) },
    wave,
    measureRef: stage,
  });

  const waveCode = amplitude === 0 ? "wave={false}" : `wave={{ amplitude: ${amplitude} }}`;
  const durationCode = `duration={{ in: ${duration}, out: ${Math.round(duration * 0.74)} }}`;
  const { base, fill } = SUBJECT_CODE[subject];
  const code =
    mode === "hover"
      ? `<LiquidFill\n  direction="${direction}"\n  ${durationCode}\n  ${waveCode}\n  base={${base}}\n  fill={${fill}}\n/>`
      : `const liquid = useLiquidFill({\n  trigger: "manual",\n  direction: "${direction}",\n  duration: { in: ${duration}, out: ${Math.round(duration * 0.74)} },\n  wave: ${amplitude === 0 ? "false" : `{ amplitude: ${amplitude} }`},\n});\n\n<button ref={liquid.ref} onClick={() => liquid.toggle()} className="stack">\n  ${base}\n  <span style={{ clipPath: "var(--liquid-clip, inset(0 100% 0 0))" }}>${fill}</span>\n</button>`;

  return (
    <div className="lp-playground">
      <div className="lp-controls">
        <Segmented id="pg-subject" label="Subject" value={subject} options={["logo", "button", "text"] as const} onChange={setSubject} />
        <Segmented id="pg-trigger" label="Trigger" value={mode} options={["hover", "click"] as const} onChange={setMode} />
        <Segmented id="pg-direction" label="Direction" value={direction} options={DIRS} onChange={setDirection} />
        <div className="lp-field">
          <label className="lp-field-label" htmlFor="pg-duration">
            Duration <output>{duration} ms</output>
          </label>
          <input id="pg-duration" type="range" min={150} max={1600} step={10} value={duration} onChange={(e) => setDuration(+e.target.value)} />
        </div>
        <div className="lp-field">
          <label className="lp-field-label" htmlFor="pg-wave">
            Wave height <output>{amplitude === 0 ? "straight wipe" : amplitude.toFixed(2)}</output>
          </label>
          <input id="pg-wave" type="range" min={0} max={0.6} step={0.05} value={amplitude} onChange={(e) => setAmplitude(+e.target.value)} />
        </div>
      </div>

      <div className="lp-stage">
        <div
          ref={liquid.ref}
          {...liquid.bind}
          onClick={mode === "click" ? () => liquid.toggle() : undefined}
          className={`lp-stage-target is-${subject}`}
          role={mode === "click" ? "button" : "img"}
          aria-label={mode === "click" ? "Toggle the fill" : "Preview"}
          tabIndex={0}
          onKeyDown={mode === "click" ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), liquid.toggle()) : undefined}
        >
          <span ref={stage} className="lp-stack lp-swap" key={subject}>
            {subject === "logo" && (
              <>
                <img src={iconSrc("outline", "angular")} alt="" width={128} height={128} />
                <img src={iconSrc("filled", "angular")} alt="" width={128} height={128} className="lp-ink" />
              </>
            )}
            {subject === "button" && (
              <>
                <span className="liquid-button-face lp-big-btn">Get started</span>
                <span className="liquid-button-face lp-big-btn is-ink lp-ink">Get started</span>
              </>
            )}
            {subject === "text" && (
              <>
                <span className="lp-word scrub-base">Liquid</span>
                <span className="lp-word lp-ink">Liquid</span>
              </>
            )}
          </span>
        </div>
        <p className="lp-stage-hint">{mode === "hover" ? "Move your pointer over it from different sides" : "Click or press Enter to toggle"}</p>
      </div>

      <div className="lp-playground-code">
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
