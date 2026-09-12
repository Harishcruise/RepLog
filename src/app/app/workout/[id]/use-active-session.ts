"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import type { SessionExercise } from "./exercise";
import { useElapsedTimer } from "./use-elapsed-timer";

export type ActiveSessionController = ReturnType<typeof useActiveSession>;

type UseActiveSessionInput = {
  sessionId: string;
  initialName: string;
  startedAt: Date;
  initialExercises: SessionExercise[];
};

/**
 * State for the active-session screen. Sessions/sets don't have a schema yet
 * (SPEC.md milestone 2 — Schema), so rename/finish/discard are local-only
 * stubs today; they'll route through `lib/session` operations once that
 * table exists, same swap the Profile screen's stubs are waiting on.
 */
export function useActiveSession({
  sessionId,
  initialName,
  startedAt,
  initialExercises,
}: UseActiveSessionInput) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [exercises, setExercises] = useState(initialExercises);
  const elapsedSeconds = useElapsedTimer(startedAt);

  /** Framer Motion's Reorder.Group hands back the full reordered array on
   *  drop — just accept it as the new order. */
  const reorderExercises = useCallback((next: SessionExercise[]) => {
    setExercises(next);
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  }, []);

  const rename = useCallback((next: string) => {
    const trimmed = next.trim();
    if (trimmed) setName(trimmed);
  }, []);

  /** Leaves the session running in the background and returns to Home — the
   *  same as backgrounding the app. Distinct from finish/discard below. */
  const leaveRunning = useCallback(() => {
    router.push("/app");
  }, [router]);

  const finish = useCallback(() => {
    toast("Finish isn't wired up yet — no summary screen or schema.");
  }, []);

  const discard = useCallback(() => {
    router.push("/app");
  }, [router]);

  return {
    sessionId,
    name,
    elapsedSeconds,
    rename,
    leaveRunning,
    finish,
    discard,
    exercises,
    reorderExercises,
    removeExercise,
  };
}
