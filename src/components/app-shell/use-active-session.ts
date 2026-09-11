export type ActiveSession = { id: string; startedAt: string } | null;

/**
 * Whether the user has an in-progress workout session — drives the nav's
 * contextual pill (Start ⇄ Resume) and exempts the shell from auto-hide
 * (UX.md "Auto-hide on scroll").
 *
 * Stubbed until `workout_sessions` exists (SPEC.md milestone 2 — Schema).
 * Replace with a real query (and ideally a realtime subscription, so
 * "Resume" appears the instant a session starts on another tab/device)
 * once that table is live.
 */
export function useActiveSession(): ActiveSession {
  return null;
}
