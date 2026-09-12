import type { SessionExercise } from "./exercise";
import type { LoggedSet } from "./set";

/** Stand-in for a real session fetch until sessions/sets have a schema
 *  (SPEC.md milestone 2). Pretends the session started 24 minutes ago. */
export function getStubStartedAt() {
  return new Date(Date.now() - 24 * 60 * 1000);
}

function stubSets(
  ...specs: { weightKg: number; reps: number; completed: boolean }[]
): LoggedSet[] {
  return specs.map((spec, i) => ({
    id: `${i + 1}`,
    setNumber: i + 1,
    type: "normal",
    previous: { weightKg: spec.weightKg, reps: spec.reps },
    weightKg: spec.weightKg,
    reps: spec.reps,
    completed: spec.completed,
  }));
}

/** Stand-in for the session's exercise list — same milestone-2 swap point. */
export function getStubExercises(): SessionExercise[] {
  return [
    {
      id: "1",
      name: "Barbell Bench Press",
      muscle: "Chest",
      sets: stubSets(
        { weightKg: 100, reps: 8, completed: true },
        { weightKg: 100, reps: 8, completed: true },
        { weightKg: 100, reps: 7, completed: false },
      ),
    },
    {
      id: "2",
      name: "Incline DB Press",
      muscle: "Chest",
      sets: stubSets({ weightKg: 32, reps: 10, completed: false }),
    },
    {
      id: "3",
      name: "Cable Fly",
      muscle: "Chest",
      sets: stubSets({ weightKg: 18, reps: 12, completed: false }),
    },
  ];
}
