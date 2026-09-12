"use client";

import { SessionHeader } from "./session-header";
import { useActiveSession } from "./use-active-session";

type ActiveSessionFormProps = {
  sessionId: string;
  initialName: string;
  startedAt: Date;
};

/** Thin orchestrator — owns the controller, hands it to each sub-view. */
export function ActiveSessionForm({
  sessionId,
  initialName,
  startedAt,
}: ActiveSessionFormProps) {
  const controller = useActiveSession({ sessionId, initialName, startedAt });

  return (
    <div className="flex min-h-dvh flex-col">
      <SessionHeader controller={controller} />
    </div>
  );
}
