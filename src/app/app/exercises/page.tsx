import { Dumbbell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Exercises" };

// Dummy screen — real exercise library lands in SPEC.md milestone 4.
export default function ExercisesPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 px-6 pt-[22vh] text-center">
      <Dumbbell className="text-muted-foreground size-8" strokeWidth={1.6} />
      <h1 className="font-display text-h1">Exercises</h1>
      <p className="text-micro text-muted-foreground/70 font-mono">
        exercise library coming next
      </p>
    </main>
  );
}
