import { Flame } from "lucide-react";
import type { ReactNode } from "react";

import { getStreak } from "@/components/app-shell/get-streak";

// Stubbed until workout_sessions exists (SPEC.md milestone 2) — same
// placeholder pattern as get-streak.ts, swapped for a real query later
// with no UI change needed.
const STUB_SESSIONS = 27;
const STUB_VOLUME_KG = 96_400;

function formatVolume(kg: number): string {
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)}k` : String(kg);
}

/** Streak / sessions / kg lifted — all-time, stubbed for now. */
export function StatsStrip() {
  const streak = getStreak();

  return (
    <div className="border-border bg-card flex justify-between rounded-xl border p-4">
      <Stat
        value={
          <span className="flex items-center gap-1">
            <Flame
              className="text-warning size-[13px]"
              fill="currentColor"
              strokeWidth={0}
            />
            {streak}
          </span>
        }
        label="day streak"
      />
      <Stat value={STUB_SESSIONS} label="sessions" />
      <Stat value={formatVolume(STUB_VOLUME_KG)} label="kg lifted" />
    </div>
  );
}

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="font-mono text-lg font-medium tabular-nums">{value}</div>
      <div className="text-muted-foreground text-[10.5px]">{label}</div>
    </div>
  );
}
