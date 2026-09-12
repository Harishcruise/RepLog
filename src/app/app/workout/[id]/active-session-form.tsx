"use client";

import type { SessionExercise } from "./exercise";
import { SessionBody } from "./session-body";
import { SessionHeader } from "./session-header";
import { useActiveSession } from "./use-active-session";

type ActiveSessionFormProps = {
  sessionId: string;
  initialName: string;
  startedAt: Date;
  initialExercises: SessionExercise[];
};

/** Thin orchestrator — owns the controller, hands it to each sub-view. */
export function ActiveSessionForm({
  sessionId,
  initialName,
  startedAt,
  initialExercises,
}: ActiveSessionFormProps) {
  const controller = useActiveSession({
    sessionId,
    initialName,
    startedAt,
    initialExercises,
  });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col">
      <SessionHeader controller={controller} />
      <SessionBody controller={controller} />
    </div>
  );
}
