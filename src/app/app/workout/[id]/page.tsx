import type { Metadata } from "next";

import { ActiveSessionForm } from "./active-session-form";
import { getStubStartedAt } from "./stub-session";

export const metadata: Metadata = { title: "Active session" };

export default async function ActiveSessionPage({
  params,
}: PageProps<"/app/workout/[id]">) {
  const { id } = await params;

  // Stub until sessions/sets have a schema (SPEC.md milestone 2) — real
  // fetch replaces this with the session row plus its exercises and sets.
  return (
    <ActiveSessionForm
      sessionId={id}
      initialName="Push Day"
      startedAt={getStubStartedAt()}
    />
  );
}
