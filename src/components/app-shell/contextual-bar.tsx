"use client";

import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ActiveSession } from "./use-active-session";

type ContextualBarProps = {
  session: ActiveSession;
  elapsed: string;
};

/**
 * The nav shell's single primary action — "Start Workout" when idle,
 * "Resume — m:ss" when a session is in progress. Never coexists with a
 * separate FAB; see UX.md "Navigation model".
 */
export function ContextualBar({ session, elapsed }: ContextualBarProps) {
  const pillClassName =
    "h-[46px] rounded-full px-5 shadow-[0_10px_28px_rgb(0_0_0/0.38)]";

  if (session) {
    return (
      <Button
        asChild
        variant="ghost"
        className={cn(
          pillClassName,
          "border-primary/45 bg-popover text-primary-hover hover:bg-popover gap-2 border",
        )}
      >
        <Link href={`/app/workout/${session.id}`}>
          <span
            className="bg-primary size-1.5 shrink-0 rounded-full"
            aria-hidden
          />
          Resume
          <span className="font-mono tabular-nums opacity-85">— {elapsed}</span>
          <ChevronRight className="ml-0.5 size-[15px]" strokeWidth={2.4} />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className={cn(pillClassName, "gap-2")}>
      <Link href="/app/workout/new">
        <Play className="size-4" fill="currentColor" strokeWidth={0} />
        Start Workout
      </Link>
    </Button>
  );
}
