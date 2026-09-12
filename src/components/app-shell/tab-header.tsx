import { Flame } from "lucide-react";
import Link from "next/link";

import { getStreak } from "./get-streak";

type TabHeaderProps = {
  /** Display name shown next to the avatar. */
  name: string;
};

/**
 * Shared header for the 4 main tabs (Home/History/Exercises/Progress):
 * avatar + "Welcome back" / name (tap → Profile) and a streak chip.
 * Rendered once by the `(tabs)` route group's layout, not per-screen.
 */
export function TabHeader({ name }: TabHeaderProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const streak = getStreak();

  return (
    <header className="bg-background sticky top-0 z-20 flex items-center justify-between px-5 pt-5">
      <Link href="/app/profile" className="flex items-center gap-2.5">
        <span className="bg-accent text-primary-hover font-display flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold">
          {initial}
        </span>
        <span className="flex flex-col">
          <span className="text-muted-foreground text-[13px]">
            Welcome back
          </span>
          <span className="font-display text-[17px] font-semibold">{name}</span>
        </span>
      </Link>

      <div className="border-border bg-card flex items-center gap-1.5 rounded-full border px-3 py-1.5">
        <Flame
          className="text-warning size-[15px]"
          fill="currentColor"
          strokeWidth={0}
        />
        <span className="font-mono text-[13px] font-medium tabular-nums">
          {streak}
        </span>
      </div>
    </header>
  );
}
