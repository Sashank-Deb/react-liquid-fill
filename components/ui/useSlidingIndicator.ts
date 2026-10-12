"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Positions one highlight element under the active item of a tab bar or segmented control,
 * so switching slides it across instead of jumping. Works when items wrap onto several rows.
 *
 *   const { containerRef, indicatorRef } = useSlidingIndicator(activeKey);
 *   <div ref={containerRef} style={{ position: "relative" }}>
 *     <span ref={indicatorRef} className="indicator" aria-hidden />
 *     <button data-indicator-key="a">…</button>
 *   </div>
 *
 * The first placement doesn't animate (no slide in from the corner); switching does, using the
 * indicator's CSS transition. Layout changes (resize, fonts loading) re-place it without animating.
 */
export function useSlidingIndicator<C extends HTMLElement = HTMLDivElement>(activeKey: string) {
  const containerRef = useRef<C>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const keyRef = useRef(activeKey);
  const placed = useRef(false);

  const place = useCallback((animate: boolean) => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    const item = container.querySelector<HTMLElement>(`[data-indicator-key="${CSS.escape(keyRef.current)}"]`);
    if (!item) return;

    if (!animate) indicator.style.transition = "none";
    indicator.style.width = `${item.offsetWidth}px`;
    indicator.style.height = `${item.offsetHeight}px`;
    indicator.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`;
    indicator.style.opacity = "1";
    container.dataset.indicatorReady = "true"; // CSS hands the highlight over to the indicator
    if (!animate) {
      void indicator.offsetWidth; // commit the position before transitions come back
      indicator.style.transition = "";
    }
  }, []);

  // Switching: slide (except for the very first placement)
  useLayoutEffect(() => {
    keyRef.current = activeKey;
    place(placed.current);
    placed.current = true;
  }, [activeKey, place]);

  // Real layout changes only. ResizeObserver reports once as soon as it starts observing;
  // skip that, or it would snap the indicator to the end of every slide.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(false);
    });
    ro.observe(container);
    document.fonts?.ready.then(() => place(false)).catch(() => {});
    return () => ro.disconnect();
  }, [place]);

  return { containerRef, indicatorRef };
}
