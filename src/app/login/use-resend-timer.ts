import { useCallback, useEffect, useState } from "react";

/** A one-shot countdown in seconds. `start(n)` begins a fresh count from `n`. */
export function useResendTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const start = useCallback((from: number) => setSeconds(from), []);

  return { seconds, start };
}
