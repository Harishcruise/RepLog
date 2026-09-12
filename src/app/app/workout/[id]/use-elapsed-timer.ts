"use client";

import { useEffect, useState } from "react";

/** Seconds elapsed since `startedAt`, ticking every second. Recomputed from
 *  the clock each tick (not incremented) so a throttled/backgrounded tab
 *  doesn't drift. */
export function useElapsedTimer(startedAt: Date) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000)),
  );

  useEffect(() => {
    const tick = () => {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000)),
      );
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return elapsedSeconds;
}
