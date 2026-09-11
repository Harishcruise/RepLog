"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RestTimerController = {
  secondsRemaining: number;
  totalSeconds: number;
  isRunning: boolean;
  skip: () => void;
  restart: (seconds: number) => void;
};

/**
 * Counts down from an end timestamp rather than decrementing a counter each
 * tick, so drift from throttled tabs / background timers doesn't accumulate —
 * the displayed value is always recomputed from the clock.
 */
export function useRestTimer(
  initialSeconds: number,
  options?: { onComplete?: () => void },
): RestTimerController {
  const { onComplete } = options ?? {};
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(initialSeconds > 0);
  const endAtRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reading the clock is a side effect, so the initial end timestamp is
    // established here rather than during render; later starts go through
    // restart(), which sets it directly in its own event handler.
    if (initialSeconds > 0)
      endAtRef.current = Date.now() + initialSeconds * 1000;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: later durations go through restart(), not a prop change
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endAtRef.current - Date.now()) / 1000),
      );
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        setIsRunning(false);
        onCompleteRef.current?.();
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [isRunning]);

  const restart = useCallback((seconds: number) => {
    endAtRef.current = Date.now() + seconds * 1000;
    setTotalSeconds(seconds);
    setSecondsRemaining(seconds);
    setIsRunning(seconds > 0);
  }, []);

  const skip = useCallback(() => {
    endAtRef.current = Date.now();
    setSecondsRemaining(0);
    setIsRunning(false);
  }, []);

  return { secondsRemaining, totalSeconds, isRunning, skip, restart };
}
