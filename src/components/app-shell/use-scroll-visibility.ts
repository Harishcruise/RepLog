"use client";

import { useEffect, useRef, useState } from "react";

/** Always visible at or above this scroll position. */
const TOP_THRESHOLD = 24;
/** Cumulative scroll-down (px) before the shell hides. */
const HIDE_THRESHOLD = 16;
/** Cumulative scroll-up (px) before the shell reveals — smaller than the
 *  hide threshold on purpose: harder to hide than to bring back. */
const REVEAL_THRESHOLD = 4;

/**
 * Scroll-direction visibility for the floating nav shell, per UX.md
 * "Auto-hide on scroll". Asymmetric thresholds avoid flicker on small
 * scroll jitter; `rAF`-batched so the scroll listener stays cheap.
 */
export function useScrollVisibility(): boolean {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const run = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function update() {
      ticking.current = false;
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;

      if (y <= TOP_THRESHOLD) {
        run.current = 0;
        setVisible(true);
        return;
      }

      // A direction change starts a fresh run, so a small wiggle can't
      // cross both thresholds in one gesture.
      if ((delta > 0 && run.current < 0) || (delta < 0 && run.current > 0)) {
        run.current = 0;
      }
      run.current += delta;

      if (run.current > HIDE_THRESHOLD) {
        setVisible(false);
      } else if (run.current < -REVEAL_THRESHOLD) {
        setVisible(true);
      }
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
