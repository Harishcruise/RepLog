import type { SessionExercise } from "./exercise";

/** Stand-in for a real session fetch until sessions/sets have a schema
 *  (SPEC.md milestone 2). Pretends the session started 24 minutes ago. */
export function getStubStartedAt() {
  return new Date(Date.now() - 24 * 60 * 1000);
}

/** Stand-in for the session's exercise list — same milestone-2 swap point. */
export function getStubExercises(): SessionExercise[] {
  return [
    { id: "1", name: "Barbell Bench Press", muscle: "Chest" },
    { id: "2", name: "Incline DB Press", muscle: "Chest" },
    { id: "3", name: "Cable Fly", muscle: "Chest" },
  ];
}
