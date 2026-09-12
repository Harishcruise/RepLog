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
    <div className="flex min-h-dvh flex-col">
      {/* Full-bleed bar — SessionHeader centres its own inner content to
          match the width of the body below. */}
      <SessionHeader controller={controller} />
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <SessionBody controller={controller} />
      </div>
    </div>
  );
}
