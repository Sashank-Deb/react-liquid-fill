"use client";

import { useEffect, useState } from "react";
import { useLiquidFill } from "@/lib/liquid";
import { PixelRunner } from "./PixelRunner";
import { FallingLeaves, MeadowEdge, MeadowGround } from "./Meadow";

/**
 * The closing call to action. Clicking the fox colours it in and pours a pixel meadow into the
 * band from where the fox is standing (with footsteps); clicking again drains it all away.
 */
export function FinalCta({ docsHref }: { docsHref: string }) {
  const [scene, setScene] = useState(false);
  const [reduced, setReduced] = useState(false);

  const meadow = useLiquidFill<HTMLElement>({
    trigger: "manual",
    duration: { in: 1100, out: 700 },
    wave: { amplitude: 0.1 },
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section ref={meadow.ref} className="lp-final" data-scene={scene || undefined} aria-labelledby="final-title">
      <div className="meadow" aria-hidden="true">
        <MeadowGround />
        <FallingLeaves />
      </div>
      <MeadowEdge />

      <PixelRunner
        footsteps={scene && !reduced}
        onColourChange={(coloured, from) => {
          setScene(coloured);
          if (coloured) meadow.fill(from);
          else meadow.drain();
        }}
      />

      <h2 id="final-title">Ready to pour?</h2>
      <p>Installation, live demos, guides for every icon set and the full API.</p>
      <a href={docsHref} className="lp-btn lp-btn-primary">
        Discover the core library <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
